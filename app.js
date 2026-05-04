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

    // Add click events to Sidebar Ejes
    document.querySelectorAll('.eje-label').forEach(el => {
        el.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openDetailPanel(id);
            
            // Highlight node in cytoscape
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

    // Top Tabs functionality
    const topTabs = document.querySelectorAll('.tabs li');
    topTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            topTabs.forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const tabName = e.currentTarget.getAttribute('data-tab');
            if(tabName === 'ciclo') {
                document.getElementById('cycle-stages-container').scrollIntoView({behavior: 'smooth'});
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

        // Close panel when clicking background
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

        // Update Header
        document.getElementById('dp-number').textContent = axis.name.split(' ')[0];
        document.getElementById('dp-number').style.backgroundColor = axis.color;
        document.getElementById('dp-name').textContent = axis.shortName.toUpperCase();
        document.getElementById('dp-name').style.color = axis.color;

        // Update Lists
        const populateList = (id, items) => {
            const el = document.getElementById(id);
            el.innerHTML = items.map(i => `<li>${i}</li>`).join('');
        };
        populateList('dp-entradas', axis.inputs);
        populateList('dp-procesos', axis.processes);
        populateList('dp-salidas', axis.outputs);

        // Update Variables
        const tbody = document.getElementById('dp-variables');
        tbody.innerHTML = axis.stateVariables.map(v => `
            <tr>
                <td>${v.name}</td>
                <td>${v.type}</td>
                <td style="color: ${v.trend === '↑' ? 'var(--eje-4)' : (v.trend === '↓' ? 'var(--eje-5)' : 'var(--text-muted)')}">${v.trend}</td>
                <td>${v.impact}</td>
            </tr>
        `).join('');

        // Update Evidences
        const evList = document.getElementById('dp-evidencias');
        const evidences = SystemCore.getEvidenceForAxis(axisId);
        if (evidences.length > 0) {
            evList.innerHTML = evidences.map(e => `
                <div class="evidencia-card">
                    <i data-lucide="file-text" class="icon-sm" style="color: var(--primary);"></i>
                    <div>
                        <span style="color: var(--primary); display: block; margin-bottom: 4px;">${e.source}</span>
                        <span style="color: var(--text-muted); font-size: 0.75rem;">${e.content.substring(0, 100)}...</span>
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

    // Start
    initGraph();
    setTimeout(() => {
        // Open the first axis by default for showcase
        openDetailPanel('eje_regional');
    }, 500);

});
