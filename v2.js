document.addEventListener('DOMContentLoaded', () => {
  const model = SocioTechnicalV2;
  const axisById = Object.fromEntries(model.axes.map(a => [a.id, a]));
  const variableById = Object.fromEntries(model.variables.map(v => [v.id, v]));
  const sourceById = Object.fromEntries(model.sources.map(s => [s.id, s]));

  const state = {
    lens: 'system',
    territory: 'all',
    enabledAxes: new Set(model.axes.map(a => a.id)),
    selected: null
  };

  const titles = {
    system: ['Sistema integrado', 'LENTE SISTEMA', 'Estructura de cinco ejes'],
    variables: ['Variables del sistema', 'LENTE VARIABLES', 'Stocks, flujos y estados observables'],
    causal: ['Mapa causal', 'LENTE CAUSAL', 'Relaciones con polaridad y retardos'],
    territory: ['Lectura territorial', 'LENTE TERRITORIO', 'Costa, Sierra y Selva como contextos'],
    history: ['Trayectoria histórica', 'LENTE HISTORIA', 'Hitos, fuentes y transformaciones'],
    nutrition: ['Transición nutricional', 'LENTE NUTRICIÓN', 'Mercados, dieta, territorio e identidad'],
    evidence: ['Arquitectura de evidencia', 'LENTE EVIDENCIA', 'Fuentes oficiales, históricas y teóricas'],
    simulation: ['Laboratorio de escenarios', 'LENTE SIMULACIÓN', 'Dinámica experimental normalizada']
  };

  const lensSummary = document.getElementById('lensSummary');
  const viewTitle = document.getElementById('viewTitle');
  const canvasKicker = document.getElementById('canvasKicker');
  const canvasTitle = document.getElementById('canvasTitle');
  const inspector = document.getElementById('inspector');
  const historyStrip = document.getElementById('historyStrip');
  const simulationPanel = document.getElementById('simulationPanel');

  function axisColor(axisId) { return axisById[axisId]?.color || '#64748b'; }
  function safe(value) { return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  function initAxisFilters() {
    const host = document.getElementById('axisFilters');
    host.innerHTML = model.axes.map(axis => `
      <label class="axis-filter">
        <span><i class="axis-dot" style="background:${axis.color}"></i>${safe(axis.label)}</span>
        <input type="checkbox" value="${axis.id}" checked>
      </label>
    `).join('');
    host.querySelectorAll('input').forEach(input => input.addEventListener('change', () => {
      input.checked ? state.enabledAxes.add(input.value) : state.enabledAxes.delete(input.value);
      renderLens();
    }));
  }

  function axisElements() {
    const nodes = model.axes.filter(a => state.enabledAxes.has(a.id)).map(a => ({
      data: { id: a.id, label: a.label, nodeType: 'axis', color: a.color, number: a.number }
    }));
    const edges = model.axisRelations.filter(r => state.enabledAxes.has(r.source) && state.enabledAxes.has(r.target)).map((r, i) => ({
      data: { id: `axis-rel-${i}`, source: r.source, target: r.target, label: r.loop, polarity: r.polarity, edgeType: 'axis', description: r.label }
    }));
    return [...nodes, ...edges];
  }

  function variableElements(filterFn = () => true) {
    const vars = model.variables.filter(v => state.enabledAxes.has(v.axis) && filterFn(v));
    const nodes = [];
    const axisIds = new Set(vars.map(v => v.axis));
    model.axes.filter(a => axisIds.has(a.id)).forEach(a => nodes.push({ data: { id: a.id, label: a.label, nodeType: 'axis', color: a.color, number: a.number } }));
    vars.forEach(v => nodes.push({ data: { id: v.id, label: v.label, nodeType: 'variable', color: axisColor(v.axis), kind: v.kind, axis: v.axis } }));
    const membership = vars.map((v, i) => ({ data: { id: `membership-${i}`, source: v.axis, target: v.id, label: '', polarity: '', edgeType: 'membership' } }));
    const allowed = new Set(vars.map(v => v.id));
    const causal = model.causalRelations.filter(r => allowed.has(r.source) && allowed.has(r.target)).map((r, i) => ({
      data: { id: `causal-${i}`, source: r.source, target: r.target, label: r.polarity, polarity: r.polarity, edgeType: 'causal', delay: r.delay }
    }));
    return [...nodes, ...membership, ...causal];
  }

  function causalElements(filterFn = () => true) {
    const vars = model.variables.filter(v => state.enabledAxes.has(v.axis) && filterFn(v));
    const allowed = new Set(vars.map(v => v.id));
    const nodes = vars.map(v => ({ data: { id: v.id, label: v.label, nodeType: 'variable', color: axisColor(v.axis), kind: v.kind, axis: v.axis } }));
    const edges = model.causalRelations.filter(r => allowed.has(r.source) && allowed.has(r.target)).map((r, i) => ({
      data: { id: `causal-only-${i}`, source: r.source, target: r.target, label: r.polarity, polarity: r.polarity, edgeType: 'causal', delay: r.delay }
    }));
    return [...nodes, ...edges];
  }

  function territoryElements() {
    const territoryNodes = model.territories.map(t => ({ data: { id: t.id, label: t.label, nodeType: 'territory', color: '#64748b' } }));
    const axisNodes = model.axes.filter(a => state.enabledAxes.has(a.id)).map(a => ({ data: { id: a.id, label: a.label, nodeType: 'axis', color: a.color, number: a.number } }));
    const edges = [];
    model.territories.forEach((t, ti) => model.axes.filter(a => state.enabledAxes.has(a.id)).forEach((a, ai) => {
      edges.push({ data: { id: `territory-${ti}-${ai}`, source: t.id, target: a.id, edgeType: 'membership', label: '' } });
    }));
    return [...territoryNodes, ...axisNodes, ...edges];
  }

  function evidenceElements() {
    const axisNodes = model.axes.filter(a => state.enabledAxes.has(a.id)).map(a => ({ data: { id: a.id, label: a.label, nodeType: 'axis', color: a.color, number: a.number } }));
    const categoryToAxes = {
      'Nutrición y salud': ['nutrition', 'regional'],
      'Sociedad y economía': ['social', 'regional'],
      'Historia territorial': ['regional', 'social'],
      'Cultura e identidad': ['identity', 'social', 'regional'],
      'Marco histórico-social': ['identity', 'social', 'global']
    };
    const sourceNodes = model.sources.map(s => ({ data: { id: s.id, label: s.institution, fullLabel: s.name, nodeType: 'source', color: '#94a3b8', category: s.category } }));
    const edges = [];
    model.sources.forEach((s, si) => (categoryToAxes[s.category] || []).filter(aid => state.enabledAxes.has(aid)).forEach((aid, ai) => {
      edges.push({ data: { id: `source-link-${si}-${ai}`, source: s.id, target: aid, edgeType: 'evidence', label: '' } });
    }));
    return [...axisNodes, ...sourceNodes, ...edges];
  }

  function elementsForLens() {
    switch (state.lens) {
      case 'variables': return variableElements();
      case 'causal': return causalElements();
      case 'territory': return territoryElements();
      case 'history': return evidenceElements();
      case 'nutrition': return variableElements(v => ['nutrition','regional','global','identity','social'].includes(v.axis) && ['global_market','upf','double_burden','food_diversity','migration','urban_pressure','cultural_resilience','informality'].includes(v.id));
      case 'evidence': return evidenceElements();
      case 'simulation': return causalElements(v => ['migration','urban_pressure','service_capacity','informality','global_market','upf','double_burden','food_diversity','cultural_resilience','community_networks'].includes(v.id));
      default: return axisElements();
    }
  }

  function graphStyle() {
    const dark = document.documentElement.classList.contains('dark');
    const text = dark ? '#e8edf2' : '#17202a';
    const panel = dark ? '#151d26' : '#ffffff';
    const line = dark ? '#52606d' : '#a9b3bd';
    return [
      { selector: 'node', style: { 'font-family':'Inter, sans-serif', 'font-size':'10px', 'font-weight':600, 'text-wrap':'wrap', 'text-max-width':'110px', 'color':text, 'label':'data(label)', 'text-valign':'bottom', 'text-margin-y':'7px', 'background-color':panel, 'border-width':2, 'border-color':'data(color)', 'width':58, 'height':58 } },
      { selector: 'node[nodeType="axis"]', style: { 'width':84, 'height':84, 'border-width':4, 'font-size':'11px', 'font-weight':700 } },
      { selector: 'node[nodeType="source"]', style: { 'shape':'round-rectangle', 'width':64, 'height':42, 'background-color': dark ? '#273341' : '#eef2f5', 'border-width':1, 'font-size':'8px', 'text-max-width':'90px' } },
      { selector: 'node[nodeType="territory"]', style: { 'shape':'hexagon', 'width':74, 'height':74, 'border-width':2, 'border-style':'dashed' } },
      { selector: 'edge', style: { 'width':1.3, 'line-color':line, 'target-arrow-color':line, 'target-arrow-shape':'triangle', 'curve-style':'bezier', 'arrow-scale':.7, 'font-size':'9px', 'label':'data(label)', 'color':text, 'text-background-color':panel, 'text-background-opacity':1, 'text-background-padding':'2px' } },
      { selector: 'edge[edgeType="membership"]', style: { 'line-style':'dashed', 'target-arrow-shape':'none', 'opacity':.55 } },
      { selector: 'edge[edgeType="evidence"]', style: { 'line-style':'dotted', 'target-arrow-shape':'none', 'opacity':.55 } },
      { selector: 'edge[polarity="-"]', style: { 'line-style':'dashed' } },
      { selector: ':selected', style: { 'overlay-opacity':0, 'border-width':5 } }
    ];
  }

  let cy = cytoscape({
    container: document.getElementById('cyV2'),
    elements: elementsForLens(),
    style: graphStyle(),
    layout: { name: 'cose', animate: false, padding: 45, nodeRepulsion: 9000, idealEdgeLength: 115 }
  });

  cy.on('tap', 'node', evt => showInspector(evt.target.id()));
  cy.on('tap', 'edge', evt => showEdgeInspector(evt.target.data()));

  function currentLayout() {
    if (state.lens === 'system') return { name: 'circle', padding: 70 };
    if (state.lens === 'territory') return { name: 'cose', padding: 45, nodeRepulsion: 11000, idealEdgeLength: 120 };
    return { name: 'cose', animate: false, padding: 40, nodeRepulsion: 9000, idealEdgeLength: 105 };
  }

  function renderLens() {
    const [title, kicker, canvas] = titles[state.lens];
    viewTitle.textContent = title;
    lensSummary.textContent = title;
    canvasKicker.textContent = kicker;
    canvasTitle.textContent = canvas;
    document.querySelectorAll('[data-lens]').forEach(btn => btn.classList.toggle('active', btn.dataset.lens === state.lens));
    historyStrip.classList.toggle('hidden', state.lens !== 'history');
    simulationPanel.classList.toggle('hidden', state.lens !== 'simulation');

    cy.elements().remove();
    cy.add(elementsForLens());
    cy.style(graphStyle());
    cy.layout(currentLayout()).run();
    document.getElementById('nodeCount').textContent = `${cy.nodes().length} nodos`;
    document.getElementById('sourceCount').textContent = `${model.sources.length} fuentes`;
    state.selected = null;
    inspector.innerHTML = `<div class="inspector-empty"><i data-lucide="mouse-pointer-2"></i><h3>Explora el sistema</h3><p>Selecciona un nodo para ver su función, evidencia asociada y relaciones.</p></div>`;
    lucide.createIcons();
  }

  function relatedSourcesForVariable(variableId) {
    const ids = new Set();
    model.causalRelations.filter(r => r.source === variableId || r.target === variableId).forEach(r => (r.evidence || []).forEach(id => ids.add(id)));
    return [...ids].map(id => sourceById[id]).filter(Boolean);
  }

  function sourceCards(sources) {
    if (!sources.length) return '<p>No hay fuente vinculada todavía.</p>';
    return sources.map(s => `<a class="source-link" href="${safe(s.url)}" target="_blank" rel="noopener"><b>${safe(s.institution)}</b> — ${safe(s.name)}<small>${safe(s.category)} · ${safe(s.type)}</small></a>`).join('');
  }

  function showInspector(id) {
    state.selected = id;
    const axis = axisById[id];
    const variable = variableById[id];
    const source = sourceById[id];
    const territory = model.territories.find(t => t.id === id);

    if (axis) {
      const vars = model.variables.filter(v => v.axis === axis.id);
      const sources = model.sources.filter(s => {
        if (axis.id === 'nutrition') return s.category === 'Nutrición y salud';
        if (axis.id === 'identity') return ['Cultura e identidad','Marco histórico-social'].includes(s.category);
        if (axis.id === 'regional') return ['Historia territorial','Sociedad y economía','Cultura e identidad'].includes(s.category);
        if (axis.id === 'social') return ['Sociedad y economía','Marco histórico-social','Cultura e identidad'].includes(s.category);
        return ['Marco histórico-social','Historia territorial'].includes(s.category);
      }).slice(0,5);
      inspector.innerHTML = `
        <span class="node-badge"><i class="axis-dot" style="background:${axis.color}"></i>Eje ${axis.number}</span>
        <h3>${safe(axis.label)}</h3><p>${safe(axis.role)}</p>
        <div class="inspector-block"><h4>Variables</h4><div class="meta-grid">${vars.map(v => `<div class="meta-item"><b>${safe(v.label)}</b><span>${safe(v.kind)} · ${safe(v.trend)}</span></div>`).join('')}</div></div>
        <div class="inspector-block"><h4>Fuentes relacionadas</h4>${sourceCards(sources)}</div>`;
    } else if (variable) {
      const sources = relatedSourcesForVariable(variable.id);
      const outgoing = model.causalRelations.filter(r => r.source === variable.id);
      const incoming = model.causalRelations.filter(r => r.target === variable.id);
      inspector.innerHTML = `
        <span class="node-badge"><i class="axis-dot" style="background:${axisColor(variable.axis)}"></i>${safe(variable.kind)}</span>
        <h3>${safe(variable.label)}</h3><p>${safe(variable.description)}</p>
        <div class="inspector-block"><h4>Metadatos</h4><div class="meta-grid"><div class="meta-item"><b>${safe(variable.unit)}</b><span>unidad/modelo</span></div><div class="meta-item"><b>${safe(variable.trend)}</b><span>tendencia conceptual</span></div><div class="meta-item"><b>${incoming.length}</b><span>entradas causales</span></div><div class="meta-item"><b>${outgoing.length}</b><span>salidas causales</span></div></div></div>
        <div class="inspector-block"><h4>Evidencia asociada</h4>${sourceCards(sources)}</div>`;
    } else if (source) {
      inspector.innerHTML = `
        <span class="node-badge">Fuente</span><h3>${safe(source.institution)}</h3><p><b>${safe(source.name)}</b></p><p>${safe(source.use)}</p>
        <div class="inspector-block"><h4>Cobertura</h4><div class="meta-grid"><div class="meta-item"><b>${safe(source.coverage)}</b><span>ámbito</span></div><div class="meta-item"><b>${safe(source.update)}</b><span>actualización</span></div></div></div>
        <div class="inspector-block"><h4>Acceso</h4>${sourceCards([source])}</div>`;
    } else if (territory) {
      inspector.innerHTML = `<span class="node-badge">Territorio</span><h3>${safe(territory.label)}</h3><p>${safe(territory.note)}</p><div class="inspector-block"><h4>Nota metodológica</h4><p>La V2 todavía no asigna valores territoriales automáticamente. Esta lente está preparada para incorporar tablas departamentales/provinciales del INEI, ENDES, ENAHO, SIEN y BDPI.</p></div>`;
    }
    lucide.createIcons();
  }

  function showEdgeInspector(data) {
    const relation = model.causalRelations.find(r => r.source === data.source && r.target === data.target);
    const axisRelation = model.axisRelations.find(r => r.source === data.source && r.target === data.target);
    if (relation) {
      const sources = (relation.evidence || []).map(id => sourceById[id]).filter(Boolean);
      inspector.innerHTML = `<span class="node-badge">Relación causal ${safe(relation.polarity)}</span><h3>${safe(variableById[relation.source]?.label)} → ${safe(variableById[relation.target]?.label)}</h3><p>Polaridad <b>${safe(relation.polarity)}</b>; retardo conceptual: <b>${safe(relation.delay)}</b>.</p><div class="inspector-block"><h4>Evidencia / fundamento</h4>${sourceCards(sources)}</div>`;
    } else if (axisRelation) {
      inspector.innerHTML = `<span class="node-badge">Loop ${safe(axisRelation.loop)}</span><h3>${safe(axisById[axisRelation.source]?.label)} → ${safe(axisById[axisRelation.target]?.label)}</h3><p>${safe(axisRelation.label)}. Polaridad de la relación: <b>${safe(axisRelation.polarity)}</b>.</p>`;
    }
  }

  function initHistory() {
    historyStrip.innerHTML = model.history.map(h => `<div class="history-card"><b>${safe(h.year)} · ${safe(h.title)}</b><span>${safe(h.note)}</span></div>`).join('');
  }

  function setLens(lens) {
    state.lens = lens;
    renderLens();
    if (lens === 'simulation') runSimulation();
  }

  document.querySelectorAll('[data-lens]').forEach(btn => btn.addEventListener('click', () => setLens(btn.dataset.lens)));
  document.getElementById('fitGraph').addEventListener('click', () => cy.fit(undefined, 45));
  document.getElementById('centerGraph').addEventListener('click', () => { cy.center(); cy.zoom(1); });
  document.getElementById('territorySelect').addEventListener('change', e => { state.territory = e.target.value; if (e.target.value !== 'all') setLens('territory'); });
  document.getElementById('resetView').addEventListener('click', () => {
    state.enabledAxes = new Set(model.axes.map(a => a.id));
    document.querySelectorAll('#axisFilters input').forEach(i => i.checked = true);
    document.getElementById('territorySelect').value = 'all';
    state.territory = 'all';
    setLens('system');
  });

  document.getElementById('globalSearch').addEventListener('input', e => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) { cy.nodes().style('opacity', 1); return; }
    cy.nodes().style('opacity', .15);
    const candidates = [
      ...model.axes.map(x => ({ id:x.id, text:`${x.label} ${x.role}`})),
      ...model.variables.map(x => ({ id:x.id, text:`${x.label} ${x.description}`})),
      ...model.sources.map(x => ({ id:x.id, text:`${x.institution} ${x.name} ${x.category}`}))
    ].filter(x => x.text.toLowerCase().includes(query));
    candidates.forEach(c => { const n = cy.getElementById(c.id); if (n.length) n.style('opacity', 1); });
    const first = candidates.map(c => cy.getElementById(c.id)).find(n => n.length);
    if (first) { cy.animate({ center: { eles: first }, zoom: 1.25 }, { duration: 250 }); showInspector(first.id()); }
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    cy.style(graphStyle());
  });

  const sliders = {
    migration: document.getElementById('migrationSlider'),
    market: document.getElementById('marketSlider'),
    capacity: document.getElementById('capacitySlider'),
    resilience: document.getElementById('resilienceSlider')
  };
  Object.entries(sliders).forEach(([key, input]) => input.addEventListener('input', () => {
    document.getElementById(`${key}Value`).textContent = input.value;
  }));

  function clamp(x) { return Math.max(0, Math.min(100, x)); }
  function runSimulation() {
    const p = Object.fromEntries(Object.entries(sliders).map(([k, el]) => [k, Number(el.value)]));
    let urban = 42, informal = 55, burden = 38, culture = p.resilience;
    const series = { urban: [], informal: [], burden: [], culture: [] };
    for (let t = 0; t < 20; t++) {
      urban = clamp(urban + .075*p.migration - .055*p.capacity - 1.2);
      informal = clamp(informal + .055*urban + .035*p.migration - .065*p.capacity - 2.1);
      burden = clamp(burden + .060*p.market + .025*urban - .040*p.capacity - .025*culture - 1.6);
      culture = clamp(culture + .045*p.resilience + .025*informal - .050*p.market - 1.0);
      series.urban.push(urban); series.informal.push(informal); series.burden.push(burden); series.culture.push(culture);
    }
    renderSimulation(series);
  }

  function renderSimulation(series) {
    const last = key => Math.round(series[key][series[key].length - 1]);
    document.getElementById('simMetrics').innerHTML = [
      ['Presión urbana', last('urban')], ['Informalidad', last('informal')], ['Carga nutricional', last('burden')], ['Resiliencia cultural', last('culture')]
    ].map(([label, value]) => `<div class="metric"><span>${label}</span><b>${value}</b></div>`).join('');

    const svg = document.getElementById('simChart');
    const W = 700, H = 240, pad = 26;
    const colors = { urban:'#00b0b9', informal:'#eab308', burden:'#ef4444', culture:'#22c55e' };
    const points = arr => arr.map((v,i) => `${pad + i*(W-2*pad)/(arr.length-1)},${H-pad-v*(H-2*pad)/100}`).join(' ');
    svg.innerHTML = `
      <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="currentColor" opacity=".18" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" stroke="currentColor" opacity=".18" />
      ${Object.entries(series).map(([k,arr]) => `<polyline points="${points(arr)}" fill="none" stroke="${colors[k]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`).join('')}
      <g font-size="11" font-family="Inter, sans-serif">
        <text x="38" y="22" fill="${colors.urban}">Presión urbana</text>
        <text x="150" y="22" fill="${colors.informal}">Informalidad</text>
        <text x="240" y="22" fill="${colors.burden}">Carga nutricional</text>
        <text x="360" y="22" fill="${colors.culture}">Resiliencia cultural</text>
      </g>`;
  }

  document.getElementById('runSimulation').addEventListener('click', runSimulation);
  document.getElementById('simulationDisclaimer').textContent = model.simulation.disclaimer;

  initAxisFilters();
  initHistory();
  document.getElementById('sourceCount').textContent = `${model.sources.length} fuentes`;
  renderLens();
  runSimulation();
  lucide.createIcons();
});
