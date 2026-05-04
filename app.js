document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // Elements
    const ejesToggles = document.getElementById('ejes-toggles');
    const detailPanel = document.getElementById('detail-panel');
    const closePanelBtn = document.getElementById('close-panel');
    const cycleContainer = document.getElementById('cycle-stages-container');

    let cy = null;

    // Dark mode toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (cy) updateGraphTheme();
    });

    // Populate Filters - Ejes
    SystemCore.axes.forEach(axis => {
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.innerHTML = `
            <div class="eje-label" data-id="${axis.id}" style="flex: 1; display: flex; align-items: center;">
                <span class="eje-dot" style="background-color: ${axis.color}"></span>
                ${axis.shortName}
            </div>
            <i data-lucide="eye" class="icon-sm eye-toggle" data-id="${axis.id}" style="color: var(--primary); cursor: pointer;"></i>
        `;
        ejesToggles.appendChild(li);
    });

    // Sidebar Interactions
    document.querySelectorAll('.eje-label').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            // Switch to Sistema tab automatically if not in it
            document.querySelector('[data-target="view-sistema"]').click();
            openDetailPanel(id);
            
            if (cy) {
                cy.nodes().style('opacity', 0.3);
                cy.nodes(`[id="${id}"]`).style('opacity', 1);
                setTimeout(() => cy.nodes().style('opacity', 1), 2000);
            }
        });
    });

    document.querySelectorAll('.eye-toggle').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const icon = e.currentTarget;
            if (cy) {
                const node = cy.getElementById(id);
                if (node.style('display') === 'none') {
                    node.style('display', 'element');
                    icon.style.color = 'var(--primary)';
                } else {
                    node.style('display', 'none');
                    icon.style.color = 'var(--text-muted)';
                }
            }
        });
    });

    // Graph Filters
    document.getElementById('filter-r').addEventListener('change', (e) => {
        if(cy) cy.edges('[label="R"]').style('display', e.target.checked ? 'element' : 'none');
    });
    document.getElementById('filter-b').addEventListener('change', (e) => {
        if(cy) cy.edges('[label="B"]').style('display', e.target.checked ? 'element' : 'none');
    });
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        document.getElementById('filter-r').checked = true;
        document.getElementById('filter-b').checked = true;
        document.querySelectorAll('.eye-toggle').forEach(icon => {
            icon.style.color = 'var(--primary)';
            if(cy) cy.getElementById(icon.getAttribute('data-id')).style('display', 'element');
        });
        if(cy) {
            cy.edges().style('display', 'element');
            cy.nodes().style('display', 'element');
            cy.fit();
        }
    });

    // Top Tabs functionality
    const topTabs = document.querySelectorAll('.tabs li');
    const viewSections = document.querySelectorAll('.view-section');

    topTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            topTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const targetId = e.currentTarget.getAttribute('data-target');
            
            viewSections.forEach(section => {
                section.style.display = 'none';
                section.classList.remove('active');
            });

            const activeSection = document.getElementById(targetId);
            activeSection.style.display = targetId === 'view-sistema' ? 'flex' : 'block';
            activeSection.classList.add('active');

            // Initialize specific view logic if needed
            if(targetId === 'view-sistema' && cy) {
                cy.resize();
            } else if (targetId === 'view-relaciones') {
                populateRelaciones();
            } else if (targetId === 'view-evidencias') {
                populateEvidencias();
            } else if (targetId === 'view-comparador') {
                populateComparador();
            }
        });
    });

    // Populate Cycle Stages
    SystemCore.cycleStages.forEach((stage, idx) => {
        const div = document.createElement('div');
        div.className = `cycle-card stage-${stage.id}`;
        div.innerHTML = `
            <div class="cycle-number">${stage.id}</div>
            <div class="cycle-content">
                <h4 style="color: var(--text-main);">${stage.name}</h4>
                <p>${stage.desc}</p>
            </div>
        `;
        cycleContainer.appendChild(div);
    });

    // Local Files Loader
    const folderInput = document.getElementById('folder-input');
    const loadBtn = document.getElementById('load-local-btn');
    
    if (loadBtn && folderInput) {
        loadBtn.addEventListener('click', () => folderInput.click());
        folderInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                alert(`Simulación: ${e.target.files.length} archivos locales procesados y añadidos al banco de evidencias.`);
                document.querySelector('[data-target="view-evidencias"]').click();
            }
        });
    }

    lucide.createIcons();

    // Initialize Cytoscape Map
    function initGraph() {
        const container = document.getElementById('cy-container');
        
        const nodes = SystemCore.axes.map(axis => ({
            data: { id: axis.id, label: axis.shortName, number: axis.name.split(' ')[0], color: axis.color }
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

        cy = cytoscape({
            container: container,
            elements: [...nodes, ...edges],
            style: getGraphStyle(),
            layout: {
                name: 'circle',
                padding: 60
            }
        });

        cy.on('tap', 'node', function(evt){
            openDetailPanel(evt.target.data('id'));
        });
        cy.on('tap', function(evt){
            if(evt.target === cy){
                detailPanel.style.display = 'none';
            }
        });
    }

    function getGraphStyle() {
        const isDark = document.documentElement.classList.contains('dark');
        return [
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'background-color': isDark ? '#1e293b' : '#ffffff',
                    'border-width': 4,
                    'border-color': 'data(color)',
                    'color': isDark ? '#f1f5f9' : '#1e293b',
                    'text-valign': 'bottom',
                    'text-halign': 'center',
                    'text-margin-y': 10,
                    'font-family': 'Inter, sans-serif',
                    'font-weight': '600',
                    'font-size': '14px',
                    'width': '90px',
                    'height': '90px',
                    'cursor': 'pointer',
                    'content': function(ele) { return ele.data('label'); }
                }
            },
            {
                selector: 'node::after',
                style: {
                    'content': 'data(number)',
                    'font-size': '24px',
                    'color': 'data(color)',
                    'font-weight': 'bold'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': 'data(color)',
                    'target-arrow-color': 'data(color)',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '12px',
                    'color': 'data(color)',
                    'text-background-opacity': 1,
                    'text-background-color': isDark ? '#1e293b' : '#ffffff',
                    'text-background-padding': '4px',
                    'text-border-width': 1,
                    'text-border-color': 'data(color)',
                    'text-border-style': 'solid',
                    'text-border-radius': '50%'
                }
            }
        ];
    }

    function updateGraphTheme() {
        cy.style(getGraphStyle());
    }

    // Detail Panel Logic
    function openDetailPanel(axisId) {
        const axis = SystemCore.axes.find(a => a.id === axisId);
        if (!axis) return;

        document.getElementById('dp-number').textContent = axis.name.split(' ')[0];
        document.getElementById('dp-number').style.backgroundColor = axis.color;
        document.getElementById('dp-name').textContent = axis.shortName.toUpperCase();
        document.getElementById('dp-name').style.color = axis.color;

        const populateList = (id, items) => {
            const el = document.getElementById(id);
            el.innerHTML = items.map(i => `<li>${i}</li>`).join('');
        };
        populateList('dp-entradas', axis.inputs);
        populateList('dp-procesos', axis.processes);
        populateList('dp-salidas', axis.outputs);

        const tbody = document.getElementById('dp-variables');
        tbody.innerHTML = axis.stateVariables.map(v => `
            <tr>
                <td>${v.name}</td>
                <td>${v.type}</td>
                <td style="color: ${v.trend === '↑' ? 'var(--eje-4)' : (v.trend === '↓' ? 'var(--eje-5)' : 'var(--text-muted)')}">${v.trend}</td>
                <td>${v.impact}</td>
            </tr>
        `).join('');

        const evList = document.getElementById('dp-evidencias');
        const evidences = SystemCore.getEvidenceForAxis(axisId);
        if (evidences.length > 0) {
            evList.innerHTML = evidences.map(e => `
                <div class="evidencia-card" style="border-left: 3px solid var(--primary);">
                    <i data-lucide="file-text" class="icon-sm" style="color: var(--primary);"></i>
                    <div>
                        <span style="color: var(--primary); display: block; margin-bottom: 4px; font-weight: 500;">${e.source}</span>
                        <span style="color: var(--text-muted); font-size: 0.75rem;">${e.content}</span>
                    </div>
                </div>
            `).join('');
        } else {
            evList.innerHTML = '<p style="font-size: 0.8rem; color: var(--text-muted);">No hay evidencias cargadas para este eje.</p>';
        }

        lucide.createIcons();
        detailPanel.style.display = 'flex';
    }

    closePanelBtn.addEventListener('click', () => {
        detailPanel.style.display = 'none';
    });

    // Additional Views Population Logic
    function populateRelaciones() {
        const container = document.getElementById('relations-list');
        container.innerHTML = '';
        SystemCore.relations.forEach(rel => {
            const source = SystemCore.axes.find(a => a.id === rel.source);
            const target = SystemCore.axes.find(a => a.id === rel.target);
            
            const div = document.createElement('div');
            div.style.padding = '1.5rem';
            div.style.background = 'var(--bg-main)';
            div.style.borderRadius = '8px';
            div.style.border = '1px solid var(--border-light)';
            
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 600;">
                    <span style="color: ${source.color}">${source.name}</span>
                    <i data-lucide="arrow-right"></i>
                    <span style="color: ${target.color}">${target.name}</span>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <span class="badge" style="background: ${rel.loop === 'R' ? '#ef444420' : '#3b82f620'}; color: ${rel.loop === 'R' ? '#ef4444' : '#3b82f6'}">Lazo ${rel.loop === 'R' ? 'Reforzador (R)' : 'Balanceador (B)'}</span>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${rel.description}</p>
            `;
            container.appendChild(div);
        });
        lucide.createIcons();
    }

    function populateEvidencias() {
        const container = document.getElementById('full-evidences-list');
        container.innerHTML = '';
        SystemCore.state.evidences.forEach(ev => {
            const div = document.createElement('div');
            div.style.padding = '1.5rem';
            div.style.background = 'var(--bg-main)';
            div.style.borderRadius = '8px';
            div.style.border = '1px solid var(--border-light)';
            
            const tags = ev.axes.map(aid => {
                const a = SystemCore.axes.find(ax => ax.id === aid);
                return `<span class="badge" style="background: ${a.color}20; color: ${a.color}">${a.shortName}</span>`;
            }).join(' ');

            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                    <strong style="color: var(--primary); font-size: 1.1rem;"><i data-lucide="file-text" class="icon-sm"></i> ${ev.source}</strong>
                    <span class="badge" style="background: var(--bg-dark); color: white;">${ev.status}</span>
                </div>
                <div style="margin-bottom: 1rem;">${tags}</div>
                <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-main); margin-bottom: 1rem;">${ev.content}</p>
                <div style="font-size: 0.85rem; color: var(--eje-3); background: #eab30810; padding: 0.5rem; border-left: 2px solid var(--eje-3);">
                    <strong>Tensiones Detectadas:</strong> ${ev.tensions.join(', ')}
                </div>
            `;
            container.appendChild(div);
        });
        lucide.createIcons();
    }

    function populateComparador() {
        const sel1 = document.getElementById('comp-1');
        const sel2 = document.getElementById('comp-2');
        
        if (sel1.options.length === 0) {
            sel1.options.add(new Option('Selecciona un eje', ''));
            sel2.options.add(new Option('Selecciona un eje', ''));
            SystemCore.axes.forEach(a => {
                sel1.options.add(new Option(a.name, a.id));
                sel2.options.add(new Option(a.name, a.id));
            });
            
            const updateBox = (selectId, resId) => {
                const val = document.getElementById(selectId).value;
                const res = document.getElementById(resId);
                if (!val) { res.innerHTML = 'Selecciona un eje.'; return; }
                const axis = SystemCore.axes.find(a => a.id === val);
                res.innerHTML = `
                    <h3 style="color: ${axis.color}; margin-bottom: 1rem;">${axis.name}</h3>
                    <p style="margin-bottom: 1rem; color: var(--text-muted);">${axis.role}</p>
                    <h5 style="margin-bottom: 0.5rem;">Variables Clave</h5>
                    <ul style="padding-left: 1.5rem; margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-main);">
                        ${axis.stateVariables.map(v => `<li>${v.name} (${v.trend})</li>`).join('')}
                    </ul>
                    <h5 style="margin-bottom: 0.5rem;">Salidas Principales</h5>
                    <ul style="padding-left: 1.5rem; font-size: 0.85rem; color: var(--text-main);">
                        ${axis.outputs.map(o => `<li>${o}</li>`).join('')}
                    </ul>
                `;
            };
            
            sel1.onchange = () => updateBox('comp-1', 'comp-1-res');
            sel2.onchange = () => updateBox('comp-2', 'comp-2-res');
        }
    }

    // Simulador Logic
    const simBtn = document.getElementById('btn-run-sim');
    const simOutput = document.getElementById('sim-output-console');
    
    if (simBtn) {
        simBtn.addEventListener('click', () => {
            simBtn.disabled = true;
            simOutput.innerHTML = '> Iniciando motor de simulación socio-técnica...<br>';
            
            const stages = SystemCore.cycleStages;
            let current = 0;
            
            const interval = setInterval(() => {
                const stage = stages[current];
                
                // Highlight cycle in bottom bar
                document.querySelectorAll('.cycle-card').forEach(c => c.style.opacity = '0.3');
                document.querySelector(`.stage-${stage.id}`).style.opacity = '1';
                
                simOutput.innerHTML += `<br><strong style="color: #fff;">[FASE ${stage.id}: ${stage.name}]</strong><br>`;
                simOutput.innerHTML += `> ${stage.desc}<br>`;
                
                if (stage.id === 2) {
                    simOutput.innerHTML += `<span style="color: #ffaa00;">> ALERTA: Presión en lazo reforzador (Migración → Desborde) detectada.</span><br>`;
                }
                if (stage.id === 3) {
                    simOutput.innerHTML += `<span style="color: #ff5555;">> CRISIS: Tensión de Identidad vs Globalización ha superado el umbral.</span><br>`;
                }
                
                simOutput.scrollTop = simOutput.scrollHeight;
                
                current++;
                if (current >= stages.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        simOutput.innerHTML += `<br><strong style="color: #00ff00;">> CICLO COMPLETADO. Sistema en nuevo estado de equilibrio.</strong><br>`;
                        simBtn.disabled = false;
                        document.querySelectorAll('.cycle-card').forEach(c => c.style.opacity = '1');
                        simOutput.scrollTop = simOutput.scrollHeight;
                    }, 1000);
                }
            }, 2000);
        });
    }

    // Mobile menu logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const filtersSidebar = document.getElementById('filters-sidebar');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (mobileMenuBtn && filtersSidebar && mobileOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            filtersSidebar.classList.add('active');
            mobileOverlay.classList.add('active');
        });
        mobileOverlay.addEventListener('click', () => {
            filtersSidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    }

    // Left Dark Sidebar Icons Logic
    const iconNavItems = document.querySelectorAll('.icon-nav li');
    iconNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            iconNavItems.forEach(i => i.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            
            const text = target.querySelector('span').textContent;
            
            // Map side icons to top tabs for functionality
            if(text === 'Mapa' || text === 'Explorar') document.querySelector('[data-target="view-sistema"]').click();
            else if(text === 'Tablero') document.querySelector('[data-target="view-comparador"]').click();
            else if(text === 'Indicadores') document.querySelector('[data-target="view-relaciones"]').click();
            else if(text === 'Escenarios') document.querySelector('[data-target="view-simulacion"]').click();
            else if(text === 'Fuentes') document.querySelector('[data-target="view-evidencias"]').click();
            else if(text === 'Glosario') alert('Glosario de términos sociológicos (Matos Mar, Quijano, etc) estará disponible en v2.0.');
        });
    });

    // Top Right Header Buttons Logic
    document.querySelectorAll('.header-actions button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.currentTarget.textContent.trim();
            if(text === 'Compartir') {
                navigator.clipboard.writeText(window.location.href);
                alert('¡Enlace del explorador copiado al portapapeles!');
            } else if (text === 'Exportar') {
                alert('Exportando modelo del sistema a JSON...');
            }
        });
    });

    const bellBtn = document.querySelector('.header-actions .icon-btn');
    if(bellBtn) {
        bellBtn.addEventListener('click', () => {
            alert('Notificaciones: Tienes 2 tensiones del sistema en estado crítico (Eje Regional y Nutrición).');
        });
    }

    const avatarBtn = document.querySelector('.header-actions .avatar');
    if(avatarBtn) {
        avatarBtn.style.cursor = 'pointer';
        avatarBtn.addEventListener('click', () => {
            alert('Perfil de Investigador Activo.');
        });
    }

    // Start
    initGraph();
    setTimeout(() => {
        openDetailPanel('eje_regional');
    }, 500);

});
