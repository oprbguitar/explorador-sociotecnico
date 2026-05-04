# Explorador de Sistemas: Marco Socio-Técnico del Perú 🇵🇪

Un *Dashboard* de Exploración Sistémica interactivo y offline ("One-Page Build") diseñado para visualizar y mapear la complejidad estructural del Perú a través de un marco de **cinco ejes interconectados**.

🌐 **[Ver Aplicación en Vivo](https://oprbguitar.github.io/explorador-sociotecnico/)**

---

## 🎯 ¿Qué es y de qué se trata?
Este proyecto es una interfaz analítica que traduce extensa documentación teórica, empírica y etnográfica en un modelo visual e interactivo. El sistema no ve al país de manera lineal, sino a través de **lazos causales (Reforzadores y Balanceadores)** entre 5 subsistemas principales:

1. **Eje Regional:** Entornos operativos, desigualdades territoriales y geografía (Costa, Sierra, Selva).
2. **Influencias Globales:** Geopolítica, mercados, y vulnerabilidades macroeconómicas.
3. **Accionar Social:** Organización civil, informalidad y desborde popular.
4. **Nutrición Globalizada:** Patrones de consumo, ultraprocesados vs. agrobiodiversidad, y salud pública.
5. **Identidad:** Subjetividad en intersección, heterogeneidad y brechas raciales/lingüísticas.

El *Dashboard* permite ver las **entradas, procesos y salidas** de cada eje, revelando tensiones como "Hibridación vs. Colonialidad" y "Desnutrición vs. UPFs".

---

## 🚀 ¿Cómo funciona?

1. **Mapa Causal Central:** La vista principal incluye un mapa de red construido con *Cytoscape.js*. Los nodos representan los ejes y las flechas representan las influencias. 
2. **Panel de Detalles:** Al hacer clic en cualquier nodo (eje), se despliega un panel a la derecha con:
   - Resumen de dinámicas (Entradas / Procesos / Salidas).
   - Tabla de Variables de Estado (Stocks y Flujos, con su tendencia e impacto).
   - Evidencias directas vinculadas a documentos (INEI, ENDES, teorías de Mariátegui, Quijano, etc.).
3. **Filtros Laterales:** El usuario puede filtrar relaciones (Reforzadoras o Balanceadoras), cambiar niveles de análisis (Nacional, Regional, Local), o alternar el *Dark Mode* 🌙.
4. **Modo Offline:** Diseñado con Vanilla HTML/CSS/JS para correr enteramente en el cliente sin requerir instalación o servidores, procesando datos localmente.

---

## 🛠️ ¿Cómo se construyó?

La aplicación fue concebida como un diseño *Socio-Técnico* siguiendo principios modulares:

- **Interfaz y UI:** HTML semántico y un modelo *Flexbox/CSS Grid* robusto (Vanilla CSS), apoyado en variables CSS para facilitar un diseño pulido, adaptable a *Dark Mode* y totalmente *Responsive* (Adaptado a móviles). 
- **Lógica Central (`system-core.js`):** Actúa como el "Cerebro" y almacena el modelo de datos crudos (Ejes, Variables, Evidencias Documentales de los reportes integrados).
- **Controlador (`app.js`):** Gestiona los eventos del DOM, la renderización de los menús móviles y la conexión bidireccional entre la Interfaz Gráfica y el Core de datos.
- **Motor Gráfico:** Se utilizó **Cytoscape.js** (`v3.26.0`) para el mapeo nodal complejo, con estilos dinámicos manipulados por JavaScript.
- **Iconografía:** Impulsado por **Lucide Icons**.

### Arquitectura de Archivos
```text
/
├── index.html        # Estructura visual principal
├── styles.css        # Sistema de diseño, Dark Mode y Media Queries
├── system-core.js    # Data, evidencias, configuración del sistema de 5 ejes
├── app.js            # Lógica, inicialización de Cytoscape y UI interactiva
└── /fuentes/         # Repositorio de la documentación (.pdf, .md) analizada
```

---

*Desarrollado para la exploración sociológica estructural. Operando bajo el modelo de Sistemas Complejos.*
