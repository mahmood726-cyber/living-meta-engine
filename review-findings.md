## REVIEW CLEAN
## Multi-Persona Review: living-meta-engine.html
### Date: 2026-03-25
### Summary: 7 P0, 10 P1, 8 P2 (deduplicated across 5 personas)
### Status: ALL P0 FIXED, ALL P1 FIXED (except P1-9 SRI hash — needs CDN file hash)

---

#### P0 -- Critical

- **[P0-1]** [Domain]: NCT IDs are wrong for 4/5 PFA-AF studies. MANIFEST-PF→NCT04826029 is ovarian cancer; inspIRE→NCT05118828 is Norwegian iCBT; PULSE-EU→NCT05424588 is ultra-cycling; ECLIPSE-AF→NCT05765305 is PCOS. All fabricated/misattributed. (lines 283-286)
  - Suggested fix: Look up correct NCT IDs from ClinicalTrials.gov for each real PFA trial. Remove MANIFEST-PF (single-arm registry, no comparator).

- **[P0-2]** [Domain]: TRILUMINATE listed twice — "TRILUMINATE" (NCT03904147) and "TRILUMINATE Pivotal" (NCT04482842, which is actually a warfarin study). These are the same program, not two separate studies. (lines 304, 306)
  - Suggested fix: Merge into one entry using NCT03904147. Remove phantom "Pivotal" entry.

- **[P0-3]** [Statistical]: REML Fisher scoring numerator is wrong. Uses `sum(w^2 * vi)` but should use `sum(w)`. Produces incorrect REML tau2. (line 408)
  - Suggested fix: `const num = wi.reduce((a, w, i) => a + w*w * (studies[i].yi - theta)**2, 0) - sumW;`

- **[P0-4]** [Statistical]: O'Brien-Fleming boundary is constant `1.96*sqrt(K)` — should decrease per look as `1.96*sqrt(K/j)`. Current boundary is never crossed and conclusions are misleading. (line 751)
  - Suggested fix: Compute per-look boundary: `boundaries[j] = 1.96 * Math.sqrt(K / (j+1))`

- **[P0-5]** [Security]: XSS via unsanitized study name in innerHTML. User-entered names flow into innerHTML at lines 704, 718, 786 without escaping. (lines 843-864, 700-706)
  - Suggested fix: Add `escapeHtml()` function; apply to all user-controlled strings before innerHTML.

- **[P0-6]** [UX/A11y]: Tabs are not keyboard-navigable. `<div>` elements with no tabindex, no role, no keyboard handler. Keyboard users cannot switch panels. (lines 124-132, 813-820)
  - Suggested fix: Convert to `<button role="tab">` with role="tablist" container, arrow-key navigation, aria-selected.

- **[P0-7]** [UX/A11y]: Modal has no Escape key, no focus trap, no focus management. Missing role="dialog", aria-modal. (lines 243-252, 843-863)
  - Suggested fix: Add role="dialog", aria-modal="true", Escape handler, focus trap, focus return on close.

#### P1 -- Important

- **[P1-1]** [Statistical]: Paule-Mandel update denominator uses `sumW` instead of `C = sumW - sumW^2/sumW`. (line 437)
  - Suggested fix: Compute C as in DL and use as denominator.

- **[P1-2]** [Statistical]: Studies table hardcodes `1.96` ignoring user-selected confidence level. Forest plot respects confLevel but table doesn't. (lines 702-703)
  - Suggested fix: Use `zCrit` derived from `confLevel`.

- **[P1-3]** [Statistical]: REML and PM compute Q/I2 using RE theta instead of FE theta. Cochran's Q requires FE weights and FE theta. (lines 421-422, 446)
  - Suggested fix: Recompute Q using FE weights and FE theta.

- **[P1-4]** [Statistical]: RD branch doesn't apply continuity correction (uses raw a,b,c,d unlike OR/RR). (lines 362-364)
  - Suggested fix: Use a2,b2,c2,d2 for RD as well.

- **[P1-5]** [Statistical]: Missing exclusion for double-all-events (b=0 AND d=0). (line 344)
  - Suggested fix: Add `|| (b === 0 && d === 0)` to filter.

- **[P1-6]** [Statistical]: poolFE has no k=0 guard (unlike poolDL). (line 451)
  - Suggested fix: Add `if (k === 0) return null;`

- **[P1-7]** [Domain]: Egger's test reported with k<10. PFA-AF has 4 usable studies, Tricuspid has 2-3. Results unreliable at small k. (lines 479, 607-608)
  - Suggested fix: Add warning when k<10: "Egger's test has low power with fewer than 10 studies."

- **[P1-8]** [Security]: CSV export has no formula injection protection. Study names starting with =, +, @, \t, \r would execute in Excel. (lines 870-874)
  - Suggested fix: Prepend `'` to cells starting with `=+@\t\r`. Quote fields containing commas.

- **[P1-9]** [Security]: No SRI hash on Plotly CDN script tag. (line 7)
  - Suggested fix: Add integrity + crossorigin attributes.

- **[P1-10]** [Engineer]: renderAll() called on every tab switch, rendering all 7 panels including hidden ones. computeEffects() called 5x redundantly. (lines 802-810, 819)
  - Suggested fix: Only render the active panel. Cache computeEffects() result.

#### P2 -- Minor

- **[P2-1]** [UX/A11y]: No visible focus indicators on buttons, tabs, conf-btns. outline:none on inputs with subtle replacement. (line 90)
- **[P2-2]** [UX/A11y]: Zero ARIA roles in entire app. No tablist/tab/tabpanel, no dialog, no landmarks. (throughout)
- **[P2-3]** [UX/A11y]: RoB dots rely solely on color. No text/symbol for colorblind users. (lines 75-78, 716)
- **[P2-4]** [UX/A11y]: Dark mode --text3 (#6b6f80) fails WCAG AA contrast (3.8:1 vs 4.5:1 required). (line 12)
- **[P2-5]** [Engineer]: Modal has `display:none` set twice in style attribute (copy-paste error). (line 243)
- **[P2-6]** [Engineer]: parseFloat(el.value) || 0 drops valid zero; empty input silently becomes 0 events. (line 858)
- **[P2-7]** [Engineer]: No CDN fallback — entire app crashes if Plotly fails to load. (line 7)
- **[P2-8]** [Engineer]: Audit log has no persistence; lost on page refresh. (lines 262, 866)

#### False Positive Watch
- DL implementation is correct (verified by Statistical Methodologist)
- Prediction interval t_{k-2} is correct per Riley 2011
- Egger's OLS-on-transformed formulation is algebraically equivalent to WLS (correct)
- Blob URL cleanup is correct (line 878)
- lnGamma/incompleteBeta implementations are correct (Lanczos + Lentz CF)
