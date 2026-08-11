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
    causal: ['Mapa causal', 'LENTE CAUSAL', 'Relaciones con polaridad, retardos y nivel de evidencia'],
    territory: ['Lectura territorial', 'LENTE TERRITORIO', 'Costa, Sierra y Selva como contextos'],
    history: ['Trayectoria histórica', 'LENTE HISTORIA', 'Hitos, fuentes, persistencias y transformaciones'],
    nutrition: ['Transición nutricional', 'LENTE NUTRICIÓN', 'Mercados, estrés, dieta, territorio e identidad'],
    evidence: ['Arquitectura de evidencia', 'LENTE EVIDENCIA', 'Fuentes oficiales, históricas, teóricas y de calibración'],
    simulation: ['Laboratorio de escenarios', 'LENTE SIMULACIÓN', 'Dinámica institucional, social, cultural y nutricional']
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
      data: { id: `causal-${i}`, source: r.source, target: r.target, label: r.polarity, polarity: r.polarity, edgeType: 'causal', delay: r.delay, evidenceLevel: r.evidenceLevel }
    }));
    return [...nodes, ...membership, ...causal];
  }

  function causalElements(filterFn = () => true) {
    const vars = model.variables.filter(v => state.enabledAxes.has(v.axis) && filterFn(v));
    const allowed = new Set(vars.map(v => v.id));
    const nodes = vars.map(v => ({ data: { id: v.id, label: v.label, nodeType: 'variable', color: axisColor(v.axis), kind: v.kind, axis: v.axis } }));
    const edges = model.causalRelations.filter(r => allowed.has(r.source) && allowed.has(r.target)).map((r, i) => ({
      data: { id: `causal-only-${i}`, source: r.source, target: r.target, label: r.polarity, polarity: r.polarity, edgeType: 'causal', delay: r.delay, evidenceLevel: r.evidenceLevel }
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

  const categoryToAxes = {
    'Nutrición y salud': ['nutrition', 'regional'],
    'Sociedad y economía': ['social', 'regional'],
    'Historia territorial': ['regional', 'social'],
    'Cultura e identidad': ['identity', 'social', 'regional'],
    'Marco histórico-social': ['identity', 'social', 'global'],
    'Institucionalidad y poder': ['social', 'global', 'regional'],
    'Salud, estrés y cultura': ['social', 'nutrition', 'identity']
  };

  function evidenceElements() {
    const axisNodes = model.axes.filter(a => state.enabledAxes.has(a.id)).map(a => ({ data: { id: a.id, label: a.label, nodeType: 'axis', color: a.color, number: a.number } }));
    const sourceNodes = model.sources.map(s => ({ data: { id: s.id, label: s.institution, fullLabel: s.name, nodeType: 'source', color: '#94a3b8', category: s.category, role: s.role } }));
    const edges = [];
    model.sources.forEach((s, si) => (categoryToAxes[s.category] || []).filter(aid => state.enabledAxes.has(aid)).forEach((aid, ai) => {
      edges.push({ data: { id: `source-link-${si}-${ai}`, source: s.id, target: aid, edgeType: 'evidence', label: '' } });
    }));
    return [...axisNodes, ...sourceNodes, ...edges];
  }

  const simulationIds = new Set([
    'migration','urban_pressure','service_capacity','global_market','illicit_flows','informality',
    'systemic_corruption','political_capture','institutional_integrity','institutional_trust','social_stress',
    'community_networks','upf','double_burden','food_diversity','cultural_resilience'
  ]);

  function elementsForLens() {
    switch (state.lens) {
      case 'variables': return variableElements();
      case 'causal': return causalElements();
      case 'territory': return territoryElements();
      case 'history': return evidenceElements();
      case 'nutrition': return causalElements(v => ['global_market','upf','double_burden','food_diversity','migration','urban_pressure','social_stress','cultural_resilience','community_networks'].includes(v.id));
      case 'evidence': return evidenceElements();
      case 'simulation': return causalElements(v => simulationIds.has(v.id));
      default: return axisElements();
    }
  }

  function graphStyle() {
    const dark = document.documentElement.classList.contains('dark');
    const text = dark ? '#e8edf2' : '#17202a';
    const panel = dark ? '#151d26' : '#ffffff';
    const line = dark ? '#52606d' : '#a9b3bd';
    return [
      { selector: 'node', style: { 'font-family':'Inter, sans-serif', 'font-size':'10px', 'font-weight':600, 'text-wrap':'wrap', 'text-max-width':'112px', 'color':text, 'label':'data(label)', 'text-valign':'bottom', 'text-margin-y':'7px', 'background-color':panel, 'border-width':2, 'border-color':'data(color)', 'width':58, 'height':58 } },
      { selector: 'node[nodeType="axis"]', style: { 'width':84, 'height':84, 'border-width':4, 'font-size':'11px', 'font-weight':700 } },
      { selector: 'node[nodeType="source"]', style: { 'shape':'round-rectangle', 'width':72, 'height':44, 'background-color': dark ? '#273341' : '#eef2f5', 'border-width':1, 'font-size':'8px', 'text-max-width':'96px' } },
      { selector: 'node[nodeType="territory"]', style: { 'shape':'hexagon', 'width':74, 'height':74, 'border-width':2, 'border-style':'dashed' } },
      { selector: 'edge', style: { 'width':1.3, 'line-color':line, 'target-arrow-color':line, 'target-arrow-shape':'triangle', 'curve-style':'bezier', 'arrow-scale':.7, 'font-size':'9px', 'label':'data(label)', 'color':text, 'text-background-color':panel, 'text-background-opacity':1, 'text-background-padding':'2px' } },
      { selector: 'edge[edgeType="membership"]', style: { 'line-style':'dashed', 'target-arrow-shape':'none', 'opacity':.45 } },
      { selector: 'edge[edgeType="evidence"]', style: { 'line-style':'dotted', 'target-arrow-shape':'none', 'opacity':.46 } },
      { selector: 'edge[polarity="-"]', style: { 'line-style':'dashed' } },
      { selector: 'edge[evidenceLevel="hipótesis"]', style: { 'opacity':.68 } },
      { selector: ':selected', style: { 'overlay-opacity':0, 'border-width':5 } }
    ];
  }

  let cy = cytoscape({
    container: document.getElementById('cyV2'),
    elements: elementsForLens(),
    style: graphStyle(),
    minZoom: 0.45,
    maxZoom: 2.2,
    wheelSensitivity: 0.18,
    layout: { name: 'cose', animate: false, padding: 70, nodeRepulsion: 10000, idealEdgeLength: 120, componentSpacing: 90, nodeDimensionsIncludeLabels: true }
  });

  function safeMarginModel(px) { return px / Math.max(cy.zoom(), 0.45); }
  function constrainNodeToViewport(node) {
    if (!node || !node.grabbed()) return;
    const extent = cy.extent();
    const left = safeMarginModel(105);
    const right = safeMarginModel(90);
    const vertical = safeMarginModel(86);
    const p = node.position();
    const nx = Math.max(extent.x1 + left, Math.min(extent.x2 - right, p.x));
    const ny = Math.max(extent.y1 + vertical, Math.min(extent.y2 - vertical, p.y));
    if (nx !== p.x || ny !== p.y) node.position({ x: nx, y: ny });
  }

  cy.on('drag', 'node', evt => constrainNodeToViewport(evt.target));
  cy.on('dragfree', 'node', evt => {
    const node = evt.target;
    const extent = cy.extent();
    const marginX = safeMarginModel(100);
    const marginY = safeMarginModel(82);
    const p = node.position();
    node.position({
      x: Math.max(extent.x1 + marginX, Math.min(extent.x2 - marginX, p.x)),
      y: Math.max(extent.y1 + marginY, Math.min(extent.y2 - marginY, p.y))
    });
  });

  cy.on('tap', 'node', evt => showInspector(evt.target.id()));
  cy.on('tap', 'edge', evt => showEdgeInspector(evt.target.data()));

  function currentLayout() {
    if (state.lens === 'system') return { name: 'circle', padding: 90, nodeDimensionsIncludeLabels: true };
    if (state.lens === 'territory') return { name: 'cose', animate: false, padding: 70, nodeRepulsion: 12000, idealEdgeLength: 130, componentSpacing: 100, nodeDimensionsIncludeLabels: true };
    if (state.lens === 'simulation') return { name: 'cose', animate: false, padding: 88, nodeRepulsion: 14500, idealEdgeLength: 138, componentSpacing: 110, gravity: .55, nodeDimensionsIncludeLabels: true, numIter: 1300 };
    if (state.lens === 'evidence' || state.lens === 'history') return { name: 'cose', animate: false, padding: 78, nodeRepulsion: 13000, idealEdgeLength: 128, componentSpacing: 105, nodeDimensionsIncludeLabels: true };
    return { name: 'cose', animate: false, padding: 72, nodeRepulsion: 11000, idealEdgeLength: 118, componentSpacing: 95, nodeDimensionsIncludeLabels: true };
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
    setTimeout(() => cy.fit(undefined, state.lens === 'simulation' ? 82 : 64), 10);
    document.getElementById('nodeCount').textContent = `${cy.nodes().length} nodos`;
    document.getElementById('sourceCount').textContent = `${model.sources.length} fuentes`;
    state.selected = null;
    inspector.innerHTML = `<div class="inspector-empty"><i data-lucide="mouse-pointer-2"></i><h3>Explora el sistema</h3><p>Selecciona un nodo para ver su función, evidencia asociada y relaciones.</p></div>`;
    lucide.createIcons();
  }

  function relatedSourcesForVariable(variableId) {
    const ids = new Set(variableById[variableId]?.evidence || []);
    model.causalRelations.filter(r => r.source === variableId || r.target === variableId).forEach(r => (r.evidence || []).forEach(id => ids.add(id)));
    return [...ids].map(id => sourceById[id]).filter(Boolean);
  }

  function sourceCards(sources) {
    if (!sources.length) return '<p>No hay fuente vinculada todavía.</p>';
    return sources.map(s => {
      const content = `<b>${safe(s.institution)}</b> — ${safe(s.name)}<small>${safe(s.category)} · ${safe(s.type)}${s.role ? ` · ${safe(s.role)}` : ''}</small>`;
      return s.url
        ? `<a class="source-link" href="${safe(s.url)}" target="_blank" rel="noopener">${content}</a>`
        : `<div class="source-link source-local">${content}<small>Documento de trabajo aportado al proyecto; se usa como referencia conceptual sin redistribuir el texto fuente.</small></div>`;
    }).join('');
  }

  function showInspector(id) {
    state.selected = id;
    const axis = axisById[id];
    const variable = variableById[id];
    const source = sourceById[id];
    const territory = model.territories.find(t => t.id === id);

    if (axis) {
      const vars = model.variables.filter(v => v.axis === axis.id);
      const sources = model.sources.filter(s => (categoryToAxes[s.category] || []).includes(axis.id)).slice(0,7);
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
        <div class="inspector-block"><h4>Evidencia asociada</h4>${sourceCards(sources.slice(0,8))}</div>`;
    } else if (source) {
      inspector.innerHTML = `
        <span class="node-badge">Fuente · ${safe(source.role || 'referencia')}</span><h3>${safe(source.institution)}</h3><p><b>${safe(source.name)}</b></p><p>${safe(source.use)}</p>
        <div class="inspector-block"><h4>Cobertura</h4><div class="meta-grid"><div class="meta-item"><b>${safe(source.coverage)}</b><span>ámbito</span></div><div class="meta-item"><b>${safe(source.update)}</b><span>actualización</span></div></div></div>
        <div class="inspector-block"><h4>Acceso</h4>${sourceCards([source])}</div>`;
    } else if (territory) {
      inspector.innerHTML = `<span class="node-badge">Territorio</span><h3>${safe(territory.label)}</h3><p>${safe(territory.note)}</p><div class="inspector-block"><h4>Nota metodológica</h4><p>Esta lente todavía no asigna valores territoriales automáticamente. Está preparada para incorporar tablas departamentales/provinciales del INEI, ENDES, ENAHO, SIEN, BDPI y otras fuentes oficiales.</p></div>`;
    }
    lucide.createIcons();
  }

  function showEdgeInspector(data) {
    const relation = model.causalRelations.find(r => r.source === data.source && r.target === data.target);
    const axisRelation = model.axisRelations.find(r => r.source === data.source && r.target === data.target);
    if (relation) {
      const sources = (relation.evidence || []).map(id => sourceById[id]).filter(Boolean);
      const level = relation.evidenceLevel === 'apoyada' ? 'Relación apoyada por fuente' : 'Hipótesis causal a validar';
      inspector.innerHTML = `<span class="node-badge">Relación ${safe(relation.polarity)}</span><h3>${safe(variableById[relation.source]?.label)} → ${safe(variableById[relation.target]?.label)}</h3><p>Polaridad <b>${safe(relation.polarity)}</b>; retardo conceptual: <b>${safe(relation.delay)}</b>.</p><div class="relation-status ${relation.evidenceLevel === 'apoyada' ? 'supported' : 'hypothesis'}">${safe(level)}</div><div class="inspector-block"><h4>Evidencia / fundamento</h4>${sourceCards(sources)}</div>`;
    } else if (axisRelation) {
      inspector.innerHTML = `<span class="node-badge">Loop ${safe(axisRelation.loop)}</span><h3>${safe(axisById[axisRelation.source]?.label)} → ${safe(axisById[axisRelation.target]?.label)}</h3><p>${safe(axisRelation.label)}. Polaridad de la relación: <b>${safe(axisRelation.polarity)}</b>.</p>`;
    }
  }

  function initHistory() {
    historyStrip.innerHTML = model.history.map((h, i) => `<button class="history-card" data-history-index="${i}"><b>${safe(h.year)} · ${safe(h.title)}</b><span>${safe(h.note)}</span></button>`).join('');
    historyStrip.querySelectorAll('[data-history-index]').forEach(btn => btn.addEventListener('click', () => {
      const h = model.history[Number(btn.dataset.historyIndex)];
      const source = sourceById[h.source];
      inspector.innerHTML = `<span class="node-badge">Hito histórico</span><h3>${safe(h.year)} · ${safe(h.title)}</h3><p>${safe(h.note)}</p><div class="inspector-block"><h4>Fuente vinculada</h4>${source ? sourceCards([source]) : '<p>Sin fuente vinculada.</p>'}</div>`;
    }));
  }

  function setLens(lens) {
    state.lens = lens;
    renderLens();
    if (lens === 'simulation') runSimulation();
  }

  document.querySelectorAll('[data-lens]').forEach(btn => btn.addEventListener('click', () => setLens(btn.dataset.lens)));
  document.getElementById('fitGraph').addEventListener('click', () => cy.fit(undefined, 72));
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
    cy.nodes().style('opacity', .12);
    const candidates = [
      ...model.axes.map(x => ({ id:x.id, text:`${x.label} ${x.role}`})),
      ...model.variables.map(x => ({ id:x.id, text:`${x.label} ${x.description}`})),
      ...model.sources.map(x => ({ id:x.id, text:`${x.institution} ${x.name} ${x.category} ${x.use}`}))
    ].filter(x => x.text.toLowerCase().includes(query));
    candidates.forEach(c => { const n = cy.getElementById(c.id); if (n.length) n.style('opacity', 1); });
    const first = candidates.map(c => cy.getElementById(c.id)).find(n => n.length);
    if (first) { cy.animate({ center: { eles: first }, zoom: 1.18 }, { duration: 250 }); showInspector(first.id()); }
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    cy.style(graphStyle());
  });

  const sliders = {
    migration: document.getElementById('migrationSlider'),
    market: document.getElementById('marketSlider'),
    capacity: document.getElementById('capacitySlider'),
    integrity: document.getElementById('integritySlider'),
    community: document.getElementById('communitySlider'),
    resilience: document.getElementById('resilienceSlider')
  };

  function updateSliderOutputs() {
    Object.entries(sliders).forEach(([key, input]) => {
      document.getElementById(`${key}Value`).textContent = input.value;
    });
  }

  Object.entries(sliders).forEach(([key, input]) => input.addEventListener('input', () => {
    document.getElementById(`${key}Value`).textContent = input.value;
  }));

  function initPresets() {
    const host = document.getElementById('scenarioPresets');
    host.innerHTML = model.simulation.presets.map((p, i) => `<button class="scenario-chip ${i === 0 ? 'active' : ''}" data-preset="${safe(p.id)}">${safe(p.label)}</button>`).join('');
    host.querySelectorAll('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
      host.querySelectorAll('.scenario-chip').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      const preset = model.simulation.presets.find(p => p.id === btn.dataset.preset);
      if (!preset) return;
      Object.entries(preset.values).forEach(([key, value]) => { if (sliders[key]) sliders[key].value = value; });
      updateSliderOutputs();
      runSimulation();
    }));
  }

  function clamp(x) { return Math.max(0, Math.min(100, x)); }
  function approach(current, target, rate) { return clamp(current + (target - current) * rate); }

  function runSimulation() {
    const p = Object.fromEntries(Object.entries(sliders).map(([k, el]) => [k, Number(el.value)]));
    const initial = model.simulation.initial;
    let urban = initial.urban;
    let informal = initial.informal;
    let corruption = initial.corruption;
    let capture = initial.capture;
    let illicit = initial.illicit;
    let trust = initial.trust;
    let stress = initial.stress;
    let burden = initial.burden;
    let culture = initial.culture;

    const series = { urban: [], informal: [], corruption: [], capture: [], illicit: [], trust: [], stress: [], burden: [], culture: [] };
    const periods = model.simulation.periods || 24;

    for (let t = 0; t < periods; t++) {
      const targetUrban = clamp(18 + .52*p.migration + .10*p.market - .36*p.capacity);
      urban = approach(urban, targetUrban, .19);

      const targetInformal = clamp(14 + .28*urban + .20*p.migration + .18*capture - .27*p.capacity - .16*p.integrity);
      informal = approach(informal, targetInformal, .16);

      const targetIllicit = clamp(8 + .22*p.market + .20*informal + .24*corruption + .12*capture - .34*p.integrity - .10*p.capacity);
      illicit = approach(illicit, targetIllicit, .18);

      const targetCorruption = clamp(10 + .27*capture + .17*informal + .19*illicit - .31*p.integrity - .12*p.capacity);
      corruption = approach(corruption, targetCorruption, .17);

      const targetCapture = clamp(12 + .38*corruption + .13*p.market + .10*illicit - .28*p.integrity - .14*p.capacity);
      capture = approach(capture, targetCapture, .15);

      const targetTrust = clamp(22 + .28*p.capacity + .25*p.integrity + .14*p.community - .25*capture - .16*corruption);
      trust = approach(trust, targetTrust, .17);

      const targetStress = clamp(20 + .24*urban + .17*informal + .18*(100-trust) + .12*capture - .24*p.community - .10*p.capacity);
      stress = approach(stress, targetStress, .16);

      const targetBurden = clamp(15 + .34*p.market + .20*stress + .12*urban - .24*p.resilience - .13*p.capacity);
      burden = approach(burden, targetBurden, .13);

      const targetCulture = clamp(25 + .28*p.resilience + .23*p.community + .14*trust - .18*p.market - .12*stress);
      culture = approach(culture, targetCulture, .14);

      series.urban.push(urban);
      series.informal.push(informal);
      series.corruption.push(corruption);
      series.capture.push(capture);
      series.illicit.push(illicit);
      series.trust.push(trust);
      series.stress.push(stress);
      series.burden.push(burden);
      series.culture.push(culture);
    }
    renderSimulation(series);
  }

  function renderSimulation(series) {
    const last = key => Math.round(series[key][series[key].length - 1]);
    const metrics = [
      ['Presión urbana', last('urban'), 'tensión', '#00b0b9'],
      ['Informalidad', last('informal'), 'tensión', '#eab308'],
      ['Corrupción sistémica', last('corruption'), 'tensión', '#c2410c'],
      ['Captura política', last('capture'), 'tensión', '#a16207'],
      ['Flujos ilícitos', last('illicit'), 'tensión', '#6366f1'],
      ['Confianza institucional', last('trust'), 'protección', '#0f766e'],
      ['Estrés social', last('stress'), 'tensión', '#ef4444'],
      ['Carga nutricional', last('burden'), 'tensión', '#b91c1c'],
      ['Resiliencia cultural', last('culture'), 'protección', '#22c55e']
    ];
    document.getElementById('simMetrics').innerHTML = metrics.map(([label, value, type, color]) => `<div class="metric ${type}" style="--metric-color:${color}"><span>${label}</span><b>${value}</b></div>`).join('');

    const tension = Math.round((last('urban') + last('informal') + last('corruption') + last('capture') + last('illicit') + last('stress') + last('burden') + (100-last('trust')) + (100-last('culture'))) / 9);
    const level = tension >= 68 ? 'Alta tensión' : tension >= 48 ? 'Tensión media' : 'Tensión contenida';
    const dominant = [
      ['institucional', (last('corruption') + last('capture') + last('illicit') + (100-last('trust'))) / 4],
      ['social-territorial', (last('urban') + last('informal') + last('stress')) / 3],
      ['nutricional-cultural', (last('burden') + (100-last('culture'))) / 2]
    ].sort((a,b) => b[1]-a[1])[0][0];
    document.getElementById('simDiagnosis').innerHTML = `<b>${level}: ${tension}/100</b><span>La tensión dominante del escenario es <strong>${safe(dominant)}</strong>. Este diagnóstico compara índices internos del modelo; no describe una situación real del Perú.</span>`;

    const svg = document.getElementById('simChart');
    const W = 760, H = 250, pad = 30;
    const colors = { capture:'#eab308', trust:'#00b0b9', stress:'#ef4444', burden:'#b91c1c', culture:'#22c55e' };
    const labels = { capture:'Captura política', trust:'Confianza', stress:'Estrés social', burden:'Carga nutricional', culture:'Resiliencia cultural' };
    const points = arr => arr.map((v,i) => `${pad + i*(W-2*pad)/(arr.length-1)},${H-pad-v*(H-2*pad)/100}`).join(' ');
    const guides = [25,50,75].map(v => `<line x1="${pad}" y1="${H-pad-v*(H-2*pad)/100}" x2="${W-pad}" y2="${H-pad-v*(H-2*pad)/100}" stroke="currentColor" opacity=".08" />`).join('');
    const chartKeys = ['capture','trust','stress','burden','culture'];
    svg.innerHTML = `
      ${guides}
      <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="currentColor" opacity=".18" />
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" stroke="currentColor" opacity=".18" />
      ${chartKeys.map(k => `<polyline points="${points(series[k])}" fill="none" stroke="${colors[k]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />`).join('')}
      <g font-size="10" font-family="Inter, sans-serif">
        ${chartKeys.map((k,i) => `<text x="${36 + i*138}" y="18" fill="${colors[k]}">${labels[k]}</text>`).join('')}
      </g>`;
  }

  document.getElementById('runSimulation').addEventListener('click', runSimulation);
  document.getElementById('simulationDisclaimer').textContent = model.simulation.disclaimer;

  initAxisFilters();
  initHistory();
  initPresets();
  updateSliderOutputs();
  document.getElementById('sourceCount').textContent = `${model.sources.length} fuentes`;
  renderLens();
  runSimulation();
  lucide.createIcons();
});
