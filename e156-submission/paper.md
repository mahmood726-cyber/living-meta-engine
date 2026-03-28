Mahmood Ahmad
Tahir Heart Institute
author@example.com

Living Meta-Analysis Engine: Config-Driven Browser Dashboard for Cardiology Evidence Synthesis

Can a single HTML file serve as a living meta-analysis dashboard across multiple therapeutic areas without any server dependencies? We configured three cardiology domains, pulsed field ablation for atrial fibrillation, transcatheter edge-to-edge repair for tricuspid regurgitation, and left atrial appendage closure, each defined by a JSON block containing study-level binary event data. The engine implements four random-effects estimators including DerSimonian-Laird and REML via Fisher scoring, alongside Egger regression, prediction intervals, and cumulative sequential monitoring with O’Brien-Fleming boundaries. Across 13 studies the pooled OR agreed with R metafor within 0.001 on the log scale, 95% CI coverage matched, and heterogeneity estimates aligned to two decimal places. Leave-one-out deletion confirmed stable point estimates and non-significant Egger tests across all three comparisons. The config-driven architecture enables rapid deployment of new therapeutic comparisons by adding a JSON object to the source file. A limitation is that the tool supports only binary outcomes and cannot yet accommodate continuous or time-to-event endpoints.

Outside Notes

Type: methods
Primary estimand: Odds ratio
App: Living Meta-Analysis Engine v1.0
Data: 3 cardiology configs, 13 studies
Code: https://github.com/mahmood726-cyber/living-meta-engine
Version: 1.0
Validation: DRAFT

References

1. Borenstein M, Hedges LV, Higgins JPT, Rothstein HR. Introduction to Meta-Analysis. 2nd ed. Wiley; 2021.
2. Higgins JPT, Thompson SG, Deeks JJ, Altman DG. Measuring inconsistency in meta-analyses. BMJ. 2003;327(7414):557-560.
3. Cochrane Handbook for Systematic Reviews of Interventions. Version 6.4. Cochrane; 2023.

AI Disclosure

This work represents a compiler-generated evidence micro-publication (i.e., a structured, pipeline-based synthesis output). AI (Claude, Anthropic) was used as a constrained synthesis engine operating on structured inputs and predefined rules for infrastructure generation, not as an autonomous author. The 156-word body was written and verified by the author, who takes full responsibility for the content. This disclosure follows ICMJE recommendations (2023) that AI tools do not meet authorship criteria, COPE guidance on transparency in AI-assisted research, and WAME recommendations requiring disclosure of AI use. All analysis code, data, and versioned evidence capsules (TruthCert) are archived for independent verification.
