# living-meta-engine

Living Meta-Analysis Engine: a config-driven, single-file browser dashboard for
cardiology evidence synthesis. One HTML file (`living-meta-engine.html`) loads a
JSON-style therapy config (PFA for AF, Tricuspid TEER, LAAO) and computes a
random-effects meta-analysis in the browser: log-scale OR/RR/RD effect sizes from
raw 2x2 counts, DerSimonian-Laird / REML / Paule-Mandel / fixed-effect pooling,
Q / I-squared / tau-squared, a prediction interval (t_{k-1}, Cochrane v6.5),
Egger's test, a funnel plot, risk-of-bias display, and a trial-sequential
(O'Brien-Fleming) / CUSUM view. Charts use Plotly; the t-distribution math is
self-contained (no external stats library).

## Test

`node test/smoke.test.js` extracts the in-page engine and checks the pooling math
against hand-computed values (12 assertions).

_Status: Needs triage (portfolio registry)._
