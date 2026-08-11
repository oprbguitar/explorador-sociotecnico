/*
 * V2.1 centered scenario engine.
 * Loaded after v2-next.js so the displayed experiment uses a neutral 50/100 baseline.
 */
document.addEventListener('DOMContentLoaded', () => {
  const model = SocioTechnicalV2;
  model.simulation.initial = { urban: 50, informal: 50, corruption: 50, capture: 50, illicit: 50, trust: 50, stress: 50, burden: 50, culture: 50 };

  const sliders = {
    migration: document.getElementById('migrationSlider'),
    market: document.getElementById('marketSlider'),
    capacity: document.getElementById('capacitySlider'),
    integrity: document.getElementById('integritySlider'),
    community: document.getElementById('communitySlider'),
    resilience: document.getElementById('resilienceSlider')
  };

  const clamp = x => Math.max(0, Math.min(100, x));
  const approach = (current, target, rate) => clamp(current + (target - current) * rate);
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function runCenteredSimulation() {
    if (Object.values(sliders).some(x => !x)) return;
    const p = Object.fromEntries(Object.entries(sliders).map(([k, el]) => [k, Number(el.value)]));
    let { urban, informal, corruption, capture, illicit, trust, stress, burden, culture } = model.simulation.initial;
    const series = { urban: [], informal: [], corruption: [], capture: [], illicit: [], trust: [], stress: [], burden: [], culture: [] };
    const periods = model.simulation.periods || 24;

    for (let t = 0; t < periods; t++) {
      urban = approach(urban, clamp(50 + .45*(p.migration-50) + .12*(p.market-50) - .35*(p.capacity-50)), .19);
      informal = approach(informal, clamp(50 + .22*(urban-50) + .18*(p.migration-50) + .20*(capture-50) - .24*(p.capacity-50) - .18*(p.integrity-50)), .16);
      illicit = approach(illicit, clamp(50 + .18*(p.market-50) + .17*(informal-50) + .22*(corruption-50) + .14*(capture-50) - .30*(p.integrity-50) - .10*(p.capacity-50)), .18);
      corruption = approach(corruption, clamp(50 + .25*(capture-50) + .15*(informal-50) + .18*(illicit-50) - .28*(p.integrity-50) - .12*(p.capacity-50)), .17);
      capture = approach(capture, clamp(50 + .32*(corruption-50) + .12*(p.market-50) + .10*(illicit-50) - .27*(p.integrity-50) - .13*(p.capacity-50)), .15);
      trust = approach(trust, clamp(50 + .25*(p.capacity-50) + .25*(p.integrity-50) + .12*(p.community-50) - .24*(capture-50) - .15*(corruption-50)), .17);
      stress = approach(stress, clamp(50 + .20*(urban-50) + .15*(informal-50) + .18*(50-trust) + .10*(capture-50) - .20*(p.community-50) - .10*(p.capacity-50)), .16);
      burden = approach(burden, clamp(50 + .25*(p.market-50) + .18*(stress-50) + .10*(urban-50) - .20*(p.resilience-50) - .12*(p.capacity-50)), .13);
      culture = approach(culture, clamp(50 + .25*(p.resilience-50) + .20*(p.community-50) + .15*(trust-50) - .16*(p.market-50) - .12*(stress-50)), .14);

      series.urban.push(urban); series.informal.push(informal); series.corruption.push(corruption);
      series.capture.push(capture); series.illicit.push(illicit); series.trust.push(trust);
      series.stress.push(stress); series.burden.push(burden); series.culture.push(culture);
    }
    renderCenteredSimulation(series);
  }

  function renderCenteredSimulation(series) {
    const last = key => Math.round(series[key][series[key].length - 1]);
    const metrics = [
      ['Presión urbana', last('urban'), '#00b0b9'],
      ['Informalidad', last('informal'), '#eab308'],
      ['Corrupción sistémica', last('corruption'), '#c2410c'],
      ['Captura política', last('capture'), '#a16207'],
      ['Flujos ilícitos', last('illicit'), '#6366f1'],
      ['Confianza institucional', last('trust'), '#0f766e'],
      ['Estrés social', last('stress'), '#ef4444'],
      ['Carga nutricional', last('burden'), '#b91c1c'],
      ['Resiliencia cultural', last('culture'), '#22c55e']
    ];
    const metricHost = document.getElementById('simMetrics');
    if (metricHost) metricHost.innerHTML = metrics.map(([label, value, color]) => `<div class="metric" style="--metric-color:${color}"><span>${label}</span><b>${value}</b></div>`).join('');

    const tension = Math.round((last('urban') + last('informal') + last('corruption') + last('capture') + last('illicit') + last('stress') + last('burden') + (100-last('trust')) + (100-last('culture'))) / 9);
    const level = tension >= 68 ? 'Alta tensión' : tension >= 48 ? 'Tensión media' : 'Tensión contenida';
    const dominant = [
      ['institucional', (last('corruption') + last('capture') + last('illicit') + (100-last('trust'))) / 4],
      ['social-territorial', (last('urban') + last('informal') + last('stress')) / 3],
      ['nutricional-cultural', (last('burden') + (100-last('culture'))) / 2]
    ].sort((a,b) => b[1]-a[1])[0][0];
    const diagnosis = document.getElementById('simDiagnosis');
    if (diagnosis) diagnosis.innerHTML = `<b>${level}: ${tension}/100</b><span>La tensión dominante del escenario es <strong>${safe(dominant)}</strong>. Son índices internos comparativos; no describen una medición real del Perú.</span>`;

    const svg = document.getElementById('simChart');
    if (!svg) return;
    const W = 760, H = 250, pad = 30;
    const colors = { capture:'#eab308', trust:'#00b0b9', stress:'#ef4444', burden:'#b91c1c', culture:'#22c55e' };
    const labels = { capture:'Captura política', trust:'Confianza', stress:'Estrés social', burden:'Carga nutricional', culture:'Resiliencia cultural' };
    const points = arr => arr.map((v,i) => `${pad + i*(W-2*pad)/(arr.length-1)},${H-pad-v*(H-2*pad)/100}`).join(' ');
    const guides = [25,50,75].map(v => `<line x1="${pad}" y1="${H-pad-v*(H-2*pad)/100}" x2="${W-pad}" y2="${H-pad-v*(H-2*pad)/100}" stroke="currentColor" opacity=".08" />`).join('');
    const keys = ['capture','trust','stress','burden','culture'];
    svg.innerHTML = `${guides}
      <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="currentColor" opacity=".18" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" stroke="currentColor" opacity=".18" />
      ${keys.map(k => `<polyline points="${points(series[k])}" fill="none" stroke="${colors[k]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`).join('')}
      <g font-size="10" font-family="Inter, sans-serif">${keys.map((k,i) => `<text x="${36+i*138}" y="18" fill="${colors[k]}">${labels[k]}</text>`).join('')}</g>`;
  }

  document.getElementById('runSimulation')?.addEventListener('click', runCenteredSimulation);
  document.querySelector('[data-lens="simulation"]')?.addEventListener('click', () => setTimeout(runCenteredSimulation, 0));
  document.querySelectorAll('#scenarioPresets [data-preset]').forEach(btn => btn.addEventListener('click', () => setTimeout(runCenteredSimulation, 0)));
  runCenteredSimulation();
});
