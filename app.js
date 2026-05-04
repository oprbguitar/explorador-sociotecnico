document.addEventListener('DOMContentLoaded', () => {
    // Initialize Icons
    lucide.createIcons();

    // Elements
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('.nav-links li');
    const breadcrumbs = document.getElementById('breadcrumbs');
    const themeToggle = document.getElementById('themeToggle');
    const chatInput = document.getElementById('chat-input');
    const sendCmdBtn = document.getElementById('send-cmd');
    const chatHistory = document.getElementById('chat-history');
    
    // State
    let cy = null;

    // View Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetView = e.currentTarget.getAttribute('data-view');
            switchView(targetView);
            updateNav(e.currentTarget);
        });
    });

    function switchView(viewId) {
        views.forEach(v => v.classList.remove('active'));
        document.getElementById(`view-${viewId}`).classList.add('active');
        breadcrumbs.textContent = `/${viewId}`;
        
        if (viewId === 'mapa') {
            setTimeout(initGraph, 100);
        } else if (viewId === 'ejes') {
            renderAxesView();
        } else if (viewId === 'relaciones') {
            renderRelationsView();
        } else if (viewId === 'evidencias') {
            renderEvidenceView();
        } else if (viewId === 'comparador') {
            renderComparatorView();
        }
    }

    function updateNav(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
    }

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
    });

    // Chat / Commands interface
    function appendMessage(text, type='system') {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        msg.innerHTML = type === 'system' ? `<strong>Sistema:</strong> ${text}` : `<strong>Usuario:</strong> ${text}`;
        chatHistory.appendChild(msg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function processCommand(cmd) {
        appendMessage(cmd, 'user');
        
        const args = cmd.trim().split(' ');
        const mainCmd = args[0].toLowerCase();

        switch (mainCmd) {
            case '/mapa':
                const mapLink = document.querySelector('[data-view="mapa"]');
                switchView('mapa');
                updateNav(mapLink);
                appendMessage('Vista de Mapa General activada.');
                break;
            case '/eje':
                const ejeLink = document.querySelector('[data-view="ejes"]');
                switchView('ejes');
                updateNav(ejeLink);
                if(args[1]) {
                    const match = SystemCore.axes.find(a => a.name.toLowerCase().includes(args[1].toLowerCase()) || a.id.includes(args[1].toLowerCase()));
                    if (match) {
                        renderAxisDetails(match.id);
                        appendMessage(`Mostrando detalle del eje: ${match.name}`);
                    } else {
                        appendMessage(`No se encontró el eje. Use una palabra clave (ej: regional, global).`);
                    }
                } else {
                    appendMessage('Vista de Ejes activada. Selecciona un eje.');
                }
                break;
            case '/relaciones':
                const relLink = document.querySelector('[data-view="relaciones"]');
                switchView('relaciones');
                updateNav(relLink);
                appendMessage('Matriz de relaciones causales activada.');
                break;
            case '/ciclo':
                const cicloLink = document.querySelector('[data-view="ciclo"]');
                switchView('ciclo');
                updateNav(cicloLink);
                appendMessage('Vista del ciclo dinámico activada.');
                break;
            case '/fuentes':
                const fuentesLink = document.querySelector('[data-view="evidencias"]');
                switchView('evidencias');
                updateNav(fuentesLink);
                appendMessage('Banco de evidencias activado.');
                break;
            case '/comparar':
                const compLink = document.querySelector('[data-view="comparador"]');
                switchView('comparador');
                updateNav(compLink);
                appendMessage('Vista comparador activada.');
                break;
            case '/resumen':
                appendMessage(`<strong>Resumen del Sistema Actual:</strong><br>
                El sistema cuenta con ${SystemCore.axes.length} ejes definidos operando en el marco de 4 fases de ciclo.<br>
                Evidencias cargadas: ${SystemCore.state.evidences.length}.<br>
                <em>Modo actual: ${SystemCore.state.mode}</em>`);
                break;
            default:
                // Try natural language response
                appendMessage(`Comando no reconocido o consulta libre. Como Analista, le sugiero usar comandos explícitos como /mapa o /eje [nombre] para navegar, o cargar archivos locales usando el botón superior para enriquecer mi base de datos.`);
                break;
        }
    }

    sendCmdBtn.addEventListener('click', () => {
        if(chatInput.value.trim()) {
            processCommand(chatInput.value);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            processCommand(chatInput.value);
            chatInput.value = '';
        }
    });

    // File Input Logic (Offline loading)
    const folderInput = document.getElementById('folder-input');
    const loadBtn = document.getElementById('load-fuentes-btn');

    loadBtn.addEventListener('click', () => {
        folderInput.click();
    });

    folderInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        appendMessage(`Procesando carpeta fuentes... Se encontraron ${files.length} archivos.`);
        
        Array.from(files).forEach(file => {
            if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const result = SystemCore.processSourceText(file.name, ev.target.result);
                    appendMessage(`[REPORTE] Archivo procesado: ${result.filename} | Ejes enriquecidos: ${result.axesEnriched.join(', ')}`);
                    if(document.getElementById('view-evidencias').classList.contains('active')) {
                        renderEvidenceView();
                    }
                };
                reader.readAsText(file);
            } else if (file.name.endsWith('.pdf')) {
                // Mock PDF processing for offline demo
                setTimeout(() => {
                    const result = SystemCore.processSourceText(file.name, "Texto simulado extraído de PDF con menciones a conflictos sociales y regionalización.");
                    appendMessage(`[REPORTE] Archivo PDF procesado (simulación offline): ${result.filename} | Ejes: ${result.axesEnriched.join(', ')}`);
                }, 500);
            }
        });
    });

    // VISTA 1: Graph Initialization
    function initGraph() {
        if (cy) return; // Already initialized

        const container = document.getElementById('cy-container');
        
        const nodes = SystemCore.axes.map(axis => ({
            data: { id: axis.id, label: axis.name, color: axis.color }
        }));

        const edges = SystemCore.relations.map((rel, idx) => ({
            data: { 
                id: `e${idx}`, 
                source: rel.source, 
                target: rel.target, 
                label: rel.loop,
                description: rel.description
            }
        }));

        const isDark = document.documentElement.classList.contains('dark');

        cy = cytoscape({
            container: container,
            elements: [...nodes, ...edges],
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'background-color': 'data(color)',
                        'color': isDark ? '#fff' : '#000',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'text-outline-width': 2,
                        'text-outline-color': 'data(color)',
                        'font-family': 'Outfit, sans-serif',
                        'font-weight': 'bold',
                        'width': '60px',
                        'height': '60px'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': isDark ? '#475569' : '#cbd5e1',
                        'target-arrow-color': isDark ? '#475569' : '#cbd5e1',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'label': 'data(label)',
                        'font-size': '12px',
                        'color': isDark ? '#94a3b8' : '#475569',
                        'text-background-opacity': 1,
                        'text-background-color': isDark ? '#0f172a' : '#f8fafc',
                        'text-background-padding': '3px'
                    }
                }
            ],
            layout: {
                name: 'circle',
                padding: 50
            }
        });

        cy.on('tap', 'node', function(evt){
            var node = evt.target;
            appendMessage(`Has seleccionado el nodo: ${node.data('label')}. Usa el comando /eje ${node.data('id')} para profundizar.`);
        });
    }

    // VISTA 2: Axes detail
    function renderAxesView() {
        const selector = document.getElementById('axis-selector');
        selector.innerHTML = '';
        
        SystemCore.axes.forEach(axis => {
            const btn = document.createElement('button');
            btn.className = 'btn secondary';
            btn.textContent = axis.name;
            btn.onclick = () => renderAxisDetails(axis.id);
            selector.appendChild(btn);
        });

        if(SystemCore.axes.length > 0 && document.getElementById('axis-details-content').innerHTML.includes('empty-state')) {
            renderAxisDetails(SystemCore.axes[0].id);
        }
    }

    function renderAxisDetails(axisId) {
        const axis = SystemCore.axes.find(a => a.id === axisId);
        const container = document.getElementById('axis-details-content');
        
        container.innerHTML = `
            <div style="border-left: 4px solid ${axis.color}; padding-left: 1rem; margin-bottom: 1.5rem;">
                <h2>${axis.name}</h2>
                <p style="color: var(--text-secondary); font-style: italic;">${axis.role}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                <div>
                    <h4 style="color: var(--accent-color); margin-bottom: 0.5rem;"><i data-lucide="arrow-down-to-line"></i> Entradas (Inputs)</h4>
                    <ul style="padding-left: 1.5rem;">
                        ${axis.inputs.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--warning); margin-bottom: 0.5rem;"><i data-lucide="refresh-cw"></i> Procesos</h4>
                    <ul style="padding-left: 1.5rem;">
                        ${axis.processes.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <h4 style="color: var(--success); margin-bottom: 0.5rem;"><i data-lucide="arrow-up-from-line"></i> Salidas (Outputs)</h4>
                    <ul style="padding-left: 1.5rem;">
                        ${axis.outputs.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
                <h4>Variables de Estado</h4>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                    ${axis.stateVariables.map(v => `<span class="tag" style="background: rgba(0,0,0,0.05); color: var(--text-primary); border: 1px solid var(--border-color);">${v}</span>`).join('')}
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    // VISTA 3: Relations
    function renderRelationsView() {
        const matrix = document.getElementById('relations-matrix');
        matrix.innerHTML = '';
        
        SystemCore.relations.forEach(rel => {
            const source = SystemCore.axes.find(a => a.id === rel.source);
            const target = SystemCore.axes.find(a => a.id === rel.target);
            
            const div = document.createElement('div');
            div.style.padding = '1rem';
            div.style.borderBottom = '1px solid var(--border-color)';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${source.name} <i data-lucide="arrow-right" style="width: 14px;"></i> ${target.name}</strong>
                    <span class="tag ${rel.loop === 'R' ? 'contradiccion' : 'validado'}">Lazo ${rel.loop === 'R' ? 'Reforzador' : 'Balanceador'}</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${rel.description} <em>(Tiempo: ${rel.time})</em></p>
            `;
            matrix.appendChild(div);
        });
        lucide.createIcons();
    }

    // VISTA 4: Simulation Cycle
    const simulateBtn = document.getElementById('simulate-btn');
    simulateBtn.addEventListener('click', () => {
        const stages = document.querySelectorAll('.stage');
        const output = document.getElementById('simulation-output');
        let current = 0;
        
        simulateBtn.disabled = true;
        stages.forEach(s => s.classList.remove('active'));
        
        const interval = setInterval(() => {
            stages.forEach(s => s.classList.remove('active'));
            stages[current].classList.add('active');
            
            const stageData = SystemCore.cycleStages[current];
            output.innerHTML = `<strong>Fase Actual: ${stageData.name}</strong><br>
                                <span style="color: var(--text-secondary)">${stageData.desc}</span><br><br>
                                <em>Dinámica: El sistema experimenta presiones inter-eje que catalizan la transición a la siguiente fase.</em>`;
            
            current++;
            if (current >= stages.length) {
                clearInterval(interval);
                simulateBtn.disabled = false;
                setTimeout(() => {
                    output.innerHTML += '<br><br><span style="color: var(--success)">Ciclo completado. El sistema entra en una nueva fase de expansión en un nivel superior (espiral).</span>';
                }, 1000);
            }
        }, 2000);
    });

    // VISTA 5: Evidence
    function renderEvidenceView() {
        const container = document.getElementById('evidence-container');
        if (SystemCore.state.evidences.length === 0) {
            container.innerHTML = '<div class="empty-state">No hay evidencias cargadas. Usa el botón superior para procesar fuentes locales.</div>';
            return;
        }

        container.innerHTML = '';
        SystemCore.state.evidences.forEach(ev => {
            const div = document.createElement('div');
            div.className = 'glass-panel';
            div.style.marginBottom = '1rem';
            
            const axisTags = ev.axes.map(a => {
                const axis = SystemCore.axes.find(ax => ax.id === a);
                return `<span class="tag" style="background: ${axis.color}20; color: ${axis.color}">${axis.name}</span>`;
            }).join('');

            const statusClass = ev.status.includes('SÍNTESIS') ? 'sintesis' : 'pendiente';

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--accent-color)">${ev.source}</strong>
                    <span class="tag ${statusClass}">${ev.status}</span>
                </div>
                <div style="margin-bottom: 0.5rem;">${axisTags}</div>
                <p style="font-size: 0.95rem; margin-bottom: 0.5rem;">${ev.content}</p>
                ${ev.tensions && ev.tensions.length > 0 ? `<div style="font-size: 0.85rem; color: var(--warning); border-left: 2px solid var(--warning); padding-left: 0.5rem;">Tensiones: ${ev.tensions.join(', ')}</div>` : ''}
            `;
            container.appendChild(div);
        });
    }

    // VISTA 6: Comparator
    function renderComparatorView() {
        const sel1 = document.getElementById('compare-select-1');
        const sel2 = document.getElementById('compare-select-2');
        
        // Populate only if empty to preserve selection
        if (sel1.options.length <= 1) {
            SystemCore.axes.forEach(a => {
                sel1.options.add(new Option(a.name, a.id));
                sel2.options.add(new Option(a.name, a.id));
            });
        }

        const handleChange = (selId, targetId) => {
            const select = document.getElementById(selId);
            const target = document.getElementById(targetId);
            
            if(!select.value) {
                target.innerHTML = '';
                return;
            }

            const axis = SystemCore.axes.find(a => a.id === select.value);
            target.innerHTML = `
                <div style="padding: 1rem; background: rgba(0,0,0,0.02); border-radius: 8px;">
                    <h3 style="color: ${axis.color}; margin-bottom: 1rem;">${axis.name}</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 1rem;">${axis.role}</p>
                    <strong>Entradas Principales:</strong>
                    <ul style="font-size: 0.85rem; margin-bottom: 1rem; padding-left: 1.5rem;">
                        ${axis.inputs.slice(0, 2).map(i => `<li>${i}</li>`).join('')}
                    </ul>
                    <strong>Salidas Principales:</strong>
                    <ul style="font-size: 0.85rem; padding-left: 1.5rem;">
                        ${axis.outputs.slice(0, 2).map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            `;
        };

        sel1.onchange = () => handleChange('compare-select-1', 'compare-content-1');
        sel2.onchange = () => handleChange('compare-select-2', 'compare-content-2');
    }

    // Initialize first view
    initGraph();
    appendMessage("Sistema socio-técnico listo. Ingrese fuentes locales o navegue por la arquitectura.", "system");
});
