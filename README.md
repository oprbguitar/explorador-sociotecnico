# Explorador de Sistemas: Marco Socio-Técnico del Perú 🇵🇪

Un *Dashboard* de Exploración Sistémica interactivo ("One-Page Build") diseñado para visualizar y mapear la complejidad estructural del Perú a través de un marco de **cinco ejes interconectados**.

🌐 **[Ver Aplicación en Vivo](https://oprbguitar.github.io/explorador-sociotecnico/)**

---

## 🎯 ¿Qué es y de qué se trata?
Este proyecto es una interfaz analítica interactiva que traduce extensa documentación teórica, empírica y etnográfica en un modelo visual de Dinámica de Sistemas. No ve al país de manera lineal, sino a través de **lazos causales (Reforzadores y Balanceadores)** entre 5 subsistemas principales:

1. **Eje Regional:** Entornos operativos, desigualdades territoriales y geografía.
2. **Influencias Globales:** Geopolítica, mercados, y flujos de capital.
3. **Accionar Social:** Organización civil, informalidad y desborde popular.
4. **Nutrición Globalizada:** Transición alimentaria y ultraprocesados vs. agrobiodiversidad.
5. **Identidad:** Subjetividad en intersección, heterogeneidad y brechas raciales.

---

## 🚀 Funcionalidades Principales (Vistas Múltiples)

La aplicación cuenta con varias vistas de análisis a las que puedes acceder desde la barra lateral izquierda o las pestañas superiores:

1. **Mapa Causal Central (Sistema):** Grafo construido con *Cytoscape.js*. Los nodos representan ejes; las flechas, influencias "R" o "B". Haz clic en cualquier nodo para abrir el **Panel de Detalles** con data cruda.
2. **Tablero de Indicadores:** Una vista completa donde se listan todas las variables clave (Stocks y Flujos) de cada eje, detallando si su tendencia va al alza (↑) o a la baja (↓) y su nivel de impacto.
3. **Comparador de Ejes:** Permite cruzar dos ejes distintos para ver frente a frente sus procesos críticos, salidas (outputs) y a quiénes afectan directa e indirectamente.
4. **Banco de Evidencias:** Un repositorio digital que lista todas las síntesis analíticas extraídas de las fuentes base (INEI, ENDES, teorías), evidenciando las **Tensiones** detectadas.
5. **Simulador de Dinámicas:** Un panel con deslizadores (sliders) donde puedes ingresar niveles de "Presión Migratoria" y "Penetración UPF". Al ejecutarlo, una consola te narrará iterativamente cómo estas presiones empujan al sistema a través de 4 fases cíclicas hasta formar un "Bucle".
6. **Glosario:** Un listado con la definición de los términos teóricos fundacionales (ej. *Desborde Popular* de Matos Mar, *Colonialidad* de Quijano).

---

## 🛠️ Arquitectura y Tecnologías

La aplicación fue concebida como un diseño *Socio-Técnico* siguiendo principios modulares y opera 100% en el cliente (Frontend-only):

- **Interfaz y UI:** HTML semántico y un modelo *Flexbox/CSS Grid* robusto (Vanilla CSS), apoyado en variables CSS para facilitar un diseño pulido, adaptable a *Dark Mode* y totalmente *Responsive*.
- **Lógica Central (`system-core.js`):** Actúa como el "Cerebro" y almacena el modelo de datos (Ejes, Variables, Evidencias, Glosario y Descripciones del Ciclo).
- **Controlador (`app.js`):** Gestiona los eventos del DOM, la renderización de las múltiples vistas (`view-sections`), la recolección de los datos del simulador y la conexión entre la interfaz y el Core.
- **Motor Gráfico:** Se utilizó **Cytoscape.js** (`v3.26.0`) para el mapeo nodal.
- **Iconografía:** Impulsado por **Lucide Icons**.

*Desarrollado para la exploración sociológica estructural. Operando bajo el modelo de Sistemas Complejos.*
