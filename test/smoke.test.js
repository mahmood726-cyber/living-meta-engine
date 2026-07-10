// Minimal smoke/engine test for living-meta-engine.html.
// Extracts the in-page <script> statistical engine, stubs out DOM/Plotly,
// and validates the pooling math against hand-computed values.
// Run: node test/smoke.test.js   (exits non-zero on any failure)
'use strict';
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'living-meta-engine.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const m = html.match(/<script>\s*\n'use strict';([\s\S]*?)<\/script>/);
if (!m) { console.error('NO ENGINE SCRIPT FOUND'); process.exit(1); }

// Strip the DOM-touching init IIFE so only pure declarations are evaluated.
const engine = m[1].replace(/\(function init\(\)[\s\S]*\}\)\(\);\s*$/, '');

// Lightweight DOM / Plotly / storage stubs (engine declares listeners at module scope).
const noop = () => {};
const elStub = {
  addEventListener: noop, appendChild: noop,
  classList: { add: noop, remove: noop, contains: () => false },
  setAttribute: noop, style: {}, innerHTML: '', value: 'DL', focus: noop,
  querySelector: () => elStub, querySelectorAll: () => [], dataset: {},
};
global.document = {
  getElementById: () => elStub, querySelector: () => elStub, querySelectorAll: () => [],
  createElement: () => elStub, createTextNode: () => ({}),
  documentElement: { getAttribute: () => 'dark', setAttribute: noop },
  addEventListener: noop, body: elStub,
};
global.window = {};
global.getComputedStyle = () => ({ getPropertyValue: () => '#000' });
global.localStorage = { getItem: () => null, setItem: noop };
global.Plotly = { newPlot: noop };
global.URL = { createObjectURL: () => '', revokeObjectURL: noop };
global.Blob = function () {};

const assertions = `
;(function(){
  let pass=0, fail=0;
  function ok(name,cond){ if(cond){pass++;console.log('PASS '+name);} else {fail++;console.log('FAIL '+name);} }
  const cfg = CONFIGS['pfa-af'];
  const data = computeEffects(JSON.parse(JSON.stringify(cfg.studies)), cfg);
  const dl = poolDL(data);
  // ADVENT: a=225 b=80 c=216 d=86 -> logOR = log((225*86)/(80*216))
  const lor = Math.log((225*86)/(80*216));
  ok('computeEffects yields k=4', data.length===4);
  ok('ADVENT logOR matches hand 2x2', Math.abs(lor-data[0].yi)<1e-9);
  ok('DL pooled OR in plausible (1,2)', Math.exp(dl.theta)>1 && Math.exp(dl.theta)<2);
  ok('I2 within [0,100]', dl.I2>=0 && dl.I2<=100);
  ok('tau2 >= 0', dl.tau2>=0);
  ok('REML theta finite', isFinite(poolREML(data).theta));
  ok('PM theta finite', isFinite(poolPM(data).theta));
  ok('FE theta finite', isFinite(poolFE(data).theta));
  ok("Egger p within [0,1]", (function(){var e=eggerTest(data);return e.p>=0&&e.p<=1;})());
  var pi = predictionInterval(dl,0.95);
  ok('prediction interval ordered lo<hi', pi.lo<pi.hi);
  ok('k=1 pooling does not crash', (function(){var r=pool([data[0]],'DL');return r&&isFinite(r.theta);})());
  ok('zero-event 2x2 gets continuity correction', (function(){
      var z=computeEffects([{name:'Z',year:2020,nctId:'x',n_pfa:100,e_pfa:0,n_thermal:100,e_thermal:5}],cfg);
      return z.length===1 && isFinite(z[0].yi);
  })());

  // ── Fixed heterogeneous 5-study OR dataset (raw a/n_t vs c/n_c) for estimator pinning ──
  // Reference tau^2 values independently reproduced via DerSimonian-Kacker fixed-point iteration.
  var HET = [[60,100,40,100],[50,100,48,100],[80,100,30,100],[45,100,55,100],[70,100,35,100]]
    .map(function(r){var a=r[0],nt=r[1],c=r[2],nc=r[3];var b=nt-a,d=nc-c;
      var vi=1/a+1/b+1/c+1/d; return {yi:Math.log((a*d)/(b*c)), vi:vi, sei:Math.sqrt(vi)};});
  // REML must include the +sum(w^2)/sum(w) trace-correction (else it collapses to the ML value 0.791090).
  ok('poolREML tau2 == REML reference 1.013773 (not ML 0.791090)', Math.abs(poolREML(HET).tau2 - 1.013773) < 1e-4);
  ok('poolPM tau2 == PM reference 1.019019', Math.abs(poolPM(HET).tau2 - 1.019019) < 1e-4);
  ok('poolREML tau2 > ML fixed-point 0.791090', poolREML(HET).tau2 > 0.85);
  // Degenerate Egger: all studies share identical SE -> ssxx=0 -> must return null, not a NaN object.
  ok('eggerTest all-equal-SE returns null', eggerTest([{yi:0.5,vi:0.25,sei:0.5},{yi:0.2,vi:0.25,sei:0.5},{yi:0.8,vi:0.25,sei:0.5}])===null);
  // Empty-input pooling returns null (no throw / no NaN object).
  ok('pool([]) returns null', pool([])===null);

  console.log('\\n'+pass+' passed, '+fail+' failed');
  if (fail) process.exit(1);
})();
`;

eval(engine + assertions);
