# Living Meta-Analysis Engine

## Purpose
Unified, config-driven living meta-analysis dashboard. One HTML file supports multiple therapeutic areas by swapping a JSON config block.

## Architecture
- **Single-file HTML** (902 lines): CSS + JS + statistical engine + Plotly visualizations
- **Config-driven**: Each therapeutic area is a `CONFIGS` entry with studies, field names, effect type
- **No build step, no dependencies** (except Plotly CDN)

## Adding a New Therapeutic Area

Add a new entry to the `CONFIGS` object in the `<script>` block:

```javascript
'my-disease': {
  id: 'my-disease',
  name: 'Full Name',
  shortName: 'Short Label',
  effectType: 'OR',           // OR, RR, or RD
  scaleType: 'ratio',         // ratio or difference
  primaryOutcome: 'Description',
  robDomains: ['D1', 'D2', 'D3', 'D4', 'D5'],
  studyFields: ['name', 'year', 'nctId', 'n_int', 'e_int', 'n_ctrl', 'e_ctrl'],
  fieldLabels: { n_int: 'N (Intervention)', ... },
  studies: [
    { name: 'TRIAL1', year: 2024, nctId: 'NCT...', n_int: 100, e_int: 45, n_ctrl: 100, e_ctrl: 30 },
  ],
}
```

## Current Configs
1. **PFA-AF**: Pulsed Field Ablation vs Thermal for Atrial Fibrillation (5 studies)
2. **Tricuspid TEER**: TEER vs Medical Therapy for Tricuspid Regurgitation (3 studies)
3. **LAAO**: Left Atrial Appendage Closure vs OAC for Stroke Prevention (5 studies)

## Statistical Engine
- 4 estimators: FE, DL, REML (Fisher scoring), PM (iterative)
- Prediction interval: t_{k-2} df (Riley et al. 2011)
- Publication bias: Egger's test (WLS regression)
- Sequential: Cumulative Z-score with O'Brien-Fleming boundary, CUSUM chart
- Self-contained t-distribution (incomplete beta, no external math library)

## Tabs
1. **Overview**: Stats bar + mini forest + cumulative evidence + key findings
2. **Forest Plot**: Configurable estimator + sort + confidence level
3. **Funnel Plot**: SE vs effect + Egger's test
4. **Studies**: Raw data table with computed effects
5. **Risk of Bias**: Traffic-light summary + stacked bar
6. **Sequential Analysis**: TSA cumulative Z + CUSUM
7. **Audit Log**: Timestamped actions
