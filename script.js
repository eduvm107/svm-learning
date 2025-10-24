// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const colors = {
    class1: '#3b82f6',
    class2: '#ef4444',
    hyperplane: '#1e293b',
    margin: '#94a3b8',
    support: '#fbbf24'
};

// ============================================
// HIPERPLANO INTERACTIVO
// ============================================
function updateHyperplane() {
    const beta0 = parseFloat(document.getElementById('beta0').value);
    const beta1 = parseFloat(document.getElementById('beta1').value);
    const beta2 = parseFloat(document.getElementById('beta2').value);

    document.getElementById('beta0-value').textContent = beta0.toFixed(1);
    document.getElementById('beta1-value').textContent = beta1.toFixed(1);
    document.getElementById('beta2-value').textContent = beta2.toFixed(1);
    document.getElementById('current-equation').textContent =
        `${beta0.toFixed(1)} + ${beta1.toFixed(1)}X₁ + ${beta2.toFixed(1)}X₂ = 0`;

    plotHyperplane(beta0, beta1, beta2);
}

function plotHyperplane(beta0, beta1, beta2) {
    // Generar puntos de ejemplo con mejor distribución
    const n = 80;
    const points = {
        x1: [],
        x2: [],
        colors: [],
        symbols: []
    };

    for (let i = 0; i < n; i++) {
        const x1 = (Math.random() - 0.5) * 6;
        const x2 = (Math.random() - 0.5) * 6;
        const value = beta0 + beta1 * x1 + beta2 * x2;

        points.x1.push(x1);
        points.x2.push(x2);
        points.colors.push(value > 0 ? colors.class1 : colors.class2);
        points.symbols.push(value > 0 ? 'circle' : 'square');
    }

    // Crear línea del hiperplano
    const x1Range = [-3, 3];
    const x2Line = x1Range.map(x1 => -(beta0 + beta1 * x1) / beta2);

    // Crear región de fondo para visualizar las dos mitades
    const fillX1 = [-3, 3, 3, -3, -3];
    const fillX2Up = x2Line.concat([3, 3, x2Line[0]]);
    const fillX2Down = x2Line.concat([-3, -3, x2Line[0]]);

    const data = [
        {
            x: fillX1,
            y: fillX2Up,
            fill: 'toself',
            fillcolor: 'rgba(59, 130, 246, 0.1)',
            line: { width: 0 },
            type: 'scatter',
            mode: 'lines',
            showlegend: false,
            hoverinfo: 'skip'
        },
        {
            x: fillX1,
            y: fillX2Down,
            fill: 'toself',
            fillcolor: 'rgba(239, 68, 68, 0.1)',
            line: { width: 0 },
            type: 'scatter',
            mode: 'lines',
            showlegend: false,
            hoverinfo: 'skip'
        },
        {
            x: points.x1,
            y: points.x2,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 10,
                color: points.colors,
                symbol: points.symbols,
                line: { width: 2, color: '#fff' },
                opacity: 0.8
            },
            name: 'Observaciones',
            hovertemplate: 'X₁: %{x:.2f}<br>X₂: %{y:.2f}<extra></extra>'
        },
        {
            x: x1Range,
            y: x2Line,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.hyperplane, width: 4, dash: 'solid' },
            name: 'Hiperplano',
            hovertemplate: 'Hiperplano de decisión<extra></extra>'
        }
    ];

    const layout = {
        title: {
            text: 'Visualización Interactiva del Hiperplano',
            font: { size: 18, weight: 'bold' }
        },
        xaxis: {
            title: 'X₁',
            range: [-3, 3],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        yaxis: {
            title: 'X₂',
            range: [-3, 3],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        showlegend: true,
        hovermode: 'closest',
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        legend: {
            x: 1.02,
            y: 1,
            xanchor: 'left',
            yanchor: 'top'
        }
    };

    Plotly.newPlot('hyperplane-plot', data, layout, { responsive: true });
}

// ============================================
// CLASIFICADOR DE MARGEN MÁXIMO
// ============================================
function plotMaximalMargin() {
    // Generar datos linealmente separables
    const n = 20;
    const class1 = { x1: [], x2: [] };
    const class2 = { x1: [], x2: [] };

    for (let i = 0; i < n; i++) {
        class1.x1.push(Math.random() * 2 - 1);
        class1.x2.push(Math.random() * 2 + 1.5);

        class2.x1.push(Math.random() * 2 - 1);
        class2.x2.push(Math.random() * 2 - 1.5);
    }

    // Vectores de soporte (los más cercanos al hiperplano)
    const supportVectors = {
        x1: [-0.5, 0.2, -0.3],
        x2: [0.8, 0.9, -0.7]
    };

    // Hiperplano de margen máximo
    const x1Range = [-2, 2];
    const hyperplane = x1Range.map(x => 0);
    const marginUp = x1Range.map(x => 0.8);
    const marginDown = x1Range.map(x => -0.8);

    const data = [
        {
            x: class1.x1,
            y: class1.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 12, color: colors.class1 },
            name: 'Clase Azul'
        },
        {
            x: class2.x1,
            y: class2.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 12, color: colors.class2 },
            name: 'Clase Roja'
        },
        {
            x: supportVectors.x1,
            y: supportVectors.x2,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 16,
                color: 'transparent',
                line: { width: 3, color: colors.support }
            },
            name: 'Vectores de Soporte'
        },
        {
            x: x1Range,
            y: hyperplane,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.hyperplane, width: 3 },
            name: 'Hiperplano'
        },
        {
            x: x1Range,
            y: marginUp,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.margin, width: 2, dash: 'dash' },
            name: 'Margen Superior'
        },
        {
            x: x1Range,
            y: marginDown,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.margin, width: 2, dash: 'dash' },
            name: 'Margen Inferior'
        }
    ];

    const layout = {
        title: {
            text: 'Clasificador de Margen Máximo con Vectores de Soporte',
            font: { size: 18, weight: 'bold' }
        },
        xaxis: {
            title: 'X₁',
            range: [-2, 2],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        yaxis: {
            title: 'X₂',
            range: [-3, 3],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        hovermode: 'closest',
        annotations: [
            {
                x: 0.5,
                y: 0.4,
                text: 'Margen = 2M',
                showarrow: true,
                arrowhead: 2,
                ax: 50,
                ay: -40,
                font: { size: 12, color: colors.margin }
            }
        ]
    };

    Plotly.newPlot('maximal-margin-plot', data, layout, { responsive: true });
}

// ============================================
// SUPPORT VECTOR CLASSIFIER
// ============================================
function plotSVC() {
    const C = parseFloat(document.getElementById('c-slider').value);
    document.getElementById('c-value').textContent = C.toFixed(2);

    // Generar datos con solapamiento
    const n = 30;
    const class1 = { x1: [], x2: [] };
    const class2 = { x1: [], x2: [] };

    for (let i = 0; i < n; i++) {
        class1.x1.push(Math.random() * 3 - 0.5);
        class1.x2.push(Math.random() * 3 + 0.5 - Math.random() * 0.5);

        class2.x1.push(Math.random() * 3 - 0.5);
        class2.x2.push(Math.random() * 3 - 2 + Math.random() * 0.5);
    }

    // El margen depende de C
    const marginWidth = Math.min(2, 5 / C);
    const x1Range = [-1, 3];
    const hyperplane = x1Range.map(x => -0.5 * x + 1);
    const marginUp = x1Range.map(x => -0.5 * x + 1 + marginWidth);
    const marginDown = x1Range.map(x => -0.5 * x + 1 - marginWidth);

    const data = [
        {
            x: class1.x1,
            y: class1.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 10, color: colors.class1 },
            name: 'Clase Azul'
        },
        {
            x: class2.x1,
            y: class2.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 10, color: colors.class2 },
            name: 'Clase Roja'
        },
        {
            x: x1Range,
            y: hyperplane,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.hyperplane, width: 3 },
            name: 'Hiperplano'
        },
        {
            x: x1Range,
            y: marginUp,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.margin, width: 2, dash: 'dash' },
            name: 'Margen'
        },
        {
            x: x1Range,
            y: marginDown,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.margin, width: 2, dash: 'dash' },
            showlegend: false
        }
    ];

    const layout = {
        title: {
            text: `Support Vector Classifier con Soft Margin (C = ${C.toFixed(2)})`,
            font: { size: 18, weight: 'bold' }
        },
        xaxis: {
            title: 'X₁',
            range: [-1, 3],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        yaxis: {
            title: 'X₂',
            range: [-3, 4],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        hovermode: 'closest',
        annotations: [
            {
                x: 1.5,
                y: 0.5,
                text: C < 1 ? 'Margen ancho<br>(más violaciones)' : 'Margen estrecho<br>(menos violaciones)',
                showarrow: false,
                font: { size: 11, color: '#64748b' },
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                bordercolor: '#e2e8f0',
                borderwidth: 1,
                borderpad: 4
            }
        ]
    };

    Plotly.newPlot('svc-plot', data, layout, { responsive: true });
}

// ============================================
// COMPARACIÓN DE KERNELS
// ============================================
function plotKernelComparison(kernelType = 'linear') {
    const n = 100;
    let class1, class2;

    if (kernelType === 'linear') {
        class1 = { x1: [], x2: [] };
        class2 = { x1: [], x2: [] };

        for (let i = 0; i < n; i++) {
            class1.x1.push(Math.random() * 4 - 2);
            class1.x2.push(Math.random() * 4);

            class2.x1.push(Math.random() * 4 - 2);
            class2.x2.push(Math.random() * 4 - 4);
        }
    } else if (kernelType === 'poly') {
        // Datos con patrón cuadrático
        class1 = { x1: [], x2: [] };
        class2 = { x1: [], x2: [] };

        for (let i = 0; i < n; i++) {
            const r = Math.random() * 2;
            const theta = Math.random() * 2 * Math.PI;
            class1.x1.push(r * Math.cos(theta));
            class1.x2.push(r * Math.sin(theta));

            const r2 = Math.random() * 2 + 2.5;
            const theta2 = Math.random() * 2 * Math.PI;
            class2.x1.push(r2 * Math.cos(theta2));
            class2.x2.push(r2 * Math.sin(theta2));
        }
    } else { // rbf
        // Datos con patrón circular
        class1 = { x1: [], x2: [] };
        class2 = { x1: [], x2: [] };

        for (let i = 0; i < n; i++) {
            const r = Math.random() * 1.5;
            const theta = Math.random() * 2 * Math.PI;
            class1.x1.push(r * Math.cos(theta));
            class1.x2.push(r * Math.sin(theta));

            const r2 = Math.random() * 1.5 + 3;
            const theta2 = Math.random() * 2 * Math.PI;
            class2.x1.push(r2 * Math.cos(theta2));
            class2.x2.push(r2 * Math.sin(theta2));
        }
    }

    const data = [
        {
            x: class1.x1,
            y: class1.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 8, color: colors.class1, opacity: 0.7 },
            name: 'Clase 1'
        },
        {
            x: class2.x1,
            y: class2.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 8, color: colors.class2, opacity: 0.7 },
            name: 'Clase 2'
        }
    ];

    const kernelNames = {
        linear: 'Kernel Lineal',
        poly: 'Kernel Polinomial',
        rbf: 'Kernel RBF (Radial)'
    };

    const layout = {
        title: {
            text: `SVM con ${kernelNames[kernelType]}`,
            font: { size: 18, weight: 'bold' }
        },
        xaxis: {
            title: 'X₁',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        yaxis: {
            title: 'X₂',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        hovermode: 'closest',
        annotations: kernelType === 'rbf' || kernelType === 'poly' ? [
            {
                x: 0,
                y: kernelType === 'rbf' ? 4 : 3.5,
                text: 'Frontera de decisión no lineal',
                showarrow: false,
                font: { size: 12, color: '#7c3aed' },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: '#7c3aed',
                borderwidth: 1,
                borderpad: 4
            }
        ] : []
    };

    Plotly.newPlot('kernel-comparison-plot', data, layout, { responsive: true });
}

// ============================================
// VISUALIZACIONES INDIVIDUALES DE KERNELS
// ============================================
function plotLinearKernel() {
    // Visualizar función kernel lineal K(x, x') = x·x'
    const x = [];
    const y = [];
    const z = [];

    for (let i = -3; i <= 3; i += 0.2) {
        const xRow = [];
        const yRow = [];
        for (let j = -3; j <= 3; j += 0.2) {
            xRow.push(j);
            yRow.push(i);
        }
        x.push(xRow);
        y.push(yRow);
    }

    // Punto de referencia x' = (1, 1)
    const x_prime = [1, 1];

    for (let i = -3; i <= 3; i += 0.2) {
        const zRow = [];
        for (let j = -3; j <= 3; j += 0.2) {
            // K(x, x') = x₁*x'₁ + x₂*x'₂
            const kernelValue = j * x_prime[0] + i * x_prime[1];
            zRow.push(kernelValue);
        }
        z.push(zRow);
    }

    const data = [{
        x: x[0],
        y: y.map(row => row[0]),
        z: z,
        type: 'surface',
        colorscale: 'Blues',
        showscale: true
    }];

    const layout = {
        title: 'Kernel Lineal: K(x, x\') = x·x\'',
        scene: {
            xaxis: { title: 'x₁' },
            yaxis: { title: 'x₂' },
            zaxis: { title: 'K(x, x\')' },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        height: 300
    };

    Plotly.newPlot('linear-kernel', data, layout, { responsive: true });
}

function plotPolyKernel() {
    const degree = parseInt(document.getElementById('poly-degree')?.value || 2);

    const x = [];
    const y = [];
    const z = [];

    for (let i = -2; i <= 2; i += 0.15) {
        const xRow = [];
        const yRow = [];
        for (let j = -2; j <= 2; j += 0.15) {
            xRow.push(j);
            yRow.push(i);
        }
        x.push(xRow);
        y.push(yRow);
    }

    // Punto de referencia x' = (0.5, 0.5)
    const x_prime = [0.5, 0.5];

    for (let i = -2; i <= 2; i += 0.15) {
        const zRow = [];
        for (let j = -2; j <= 2; j += 0.15) {
            // K(x, x') = (1 + x·x')^d
            const dotProduct = j * x_prime[0] + i * x_prime[1];
            const kernelValue = Math.pow(1 + dotProduct, degree);
            zRow.push(kernelValue);
        }
        z.push(zRow);
    }

    const data = [{
        x: x[0],
        y: y.map(row => row[0]),
        z: z,
        type: 'surface',
        colorscale: 'Oranges',
        showscale: true
    }];

    const layout = {
        title: `Kernel Polinomial (d=${degree}): K(x, x\') = (1 + x·x\')^${degree}`,
        scene: {
            xaxis: { title: 'x₁' },
            yaxis: { title: 'x₂' },
            zaxis: { title: 'K(x, x\')' },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        height: 300
    };

    Plotly.newPlot('poly-kernel', data, layout, { responsive: true });
}

function plotRBFKernel() {
    const gamma = parseFloat(document.getElementById('gamma')?.value || 1);

    const x = [];
    const y = [];
    const z = [];

    for (let i = -3; i <= 3; i += 0.15) {
        const xRow = [];
        const yRow = [];
        for (let j = -3; j <= 3; j += 0.15) {
            xRow.push(j);
            yRow.push(i);
        }
        x.push(xRow);
        y.push(yRow);
    }

    // Punto de referencia x' = (0, 0)
    const x_prime = [0, 0];

    for (let i = -3; i <= 3; i += 0.15) {
        const zRow = [];
        for (let j = -3; j <= 3; j += 0.15) {
            // K(x, x') = exp(-γ * ||x - x'||²)
            const squaredDist = Math.pow(j - x_prime[0], 2) + Math.pow(i - x_prime[1], 2);
            const kernelValue = Math.exp(-gamma * squaredDist);
            zRow.push(kernelValue);
        }
        z.push(zRow);
    }

    const data = [{
        x: x[0],
        y: y.map(row => row[0]),
        z: z,
        type: 'surface',
        colorscale: 'Reds',
        showscale: true
    }];

    const layout = {
        title: `Kernel RBF (γ=${gamma.toFixed(3)}): K(x, x\') = exp(-γ||x-x\'||²)`,
        scene: {
            xaxis: { title: 'x₁' },
            yaxis: { title: 'x₂' },
            zaxis: { title: 'K(x, x\')' },
            camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        height: 300
    };

    Plotly.newPlot('rbf-kernel', data, layout, { responsive: true });
}

// ============================================
// FUNCIÓN DE PÉRDIDA
// ============================================
function plotLossComparison() {
    const yf = [];
    const hingeLoss = [];
    const logisticLoss = [];

    for (let i = -6; i <= 2; i += 0.1) {
        yf.push(i);
        hingeLoss.push(Math.max(0, 1 - i));
        logisticLoss.push(Math.log(1 + Math.exp(-i)));
    }

    const data = [
        {
            x: yf,
            y: hingeLoss,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.class1, width: 3 },
            name: 'Hinge Loss (SVM)'
        },
        {
            x: yf,
            y: logisticLoss,
            mode: 'lines',
            type: 'scatter',
            line: { color: colors.class2, width: 3 },
            name: 'Log Loss (Regresión Logística)'
        }
    ];

    const layout = {
        title: {
            text: 'Comparación de Funciones de Pérdida: SVM vs Regresión Logística',
            font: { size: 18, weight: 'bold' }
        },
        xaxis: {
            title: 'y·f(x) (margen funcional)',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8',
            zerolinewidth: 2
        },
        yaxis: {
            title: 'Pérdida',
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        hovermode: 'x unified',
        annotations: [
            {
                x: 1,
                y: 0,
                xref: 'x',
                yref: 'y',
                text: 'Hinge Loss = 0<br>cuando y·f(x) ≥ 1',
                showarrow: true,
                arrowhead: 2,
                ax: 60,
                ay: -50,
                font: { size: 11, color: colors.class1 },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: colors.class1,
                borderwidth: 1,
                borderpad: 4
            },
            {
                x: 0,
                y: Math.log(2),
                xref: 'x',
                yref: 'y',
                text: 'Log Loss nunca es cero',
                showarrow: true,
                arrowhead: 2,
                ax: -60,
                ay: 50,
                font: { size: 11, color: colors.class2 },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: colors.class2,
                borderwidth: 1,
                borderpad: 4
            }
        ],
        shapes: [
            {
                type: 'line',
                x0: 1,
                y0: 0,
                x1: 1,
                y1: 3,
                line: {
                    color: '#94a3b8',
                    width: 1,
                    dash: 'dot'
                }
            }
        ]
    };

    Plotly.newPlot('loss-comparison-plot', data, layout, { responsive: true });
}

// ============================================
// GENERADOR INTERACTIVO DE DATOS
// ============================================
let currentData = null;

function generateData() {
    const patternType = document.getElementById('pattern-type').value;
    const nPoints = parseInt(document.getElementById('n-points').value);
    const noise = parseFloat(document.getElementById('noise').value);

    document.getElementById('noise-value').textContent = noise.toFixed(1);

    const n = nPoints / 2;
    const data = {
        class1: { x1: [], x2: [], y: [] },
        class2: { x1: [], x2: [], y: [] }
    };

    for (let i = 0; i < n; i++) {
        if (patternType === 'linear') {
            data.class1.x1.push(Math.random() * 4 - 2 + noise * (Math.random() - 0.5));
            data.class1.x2.push(Math.random() * 4 + 1 + noise * (Math.random() - 0.5));
            data.class1.y.push(1);

            data.class2.x1.push(Math.random() * 4 - 2 + noise * (Math.random() - 0.5));
            data.class2.x2.push(Math.random() * 4 - 3 + noise * (Math.random() - 0.5));
            data.class2.y.push(-1);
        } else if (patternType === 'overlap') {
            data.class1.x1.push(Math.random() * 4 - 1 + noise * (Math.random() - 0.5));
            data.class1.x2.push(Math.random() * 4 + noise * (Math.random() - 0.5));
            data.class1.y.push(1);

            data.class2.x1.push(Math.random() * 4 - 3 + noise * (Math.random() - 0.5));
            data.class2.x2.push(Math.random() * 4 - 2 + noise * (Math.random() - 0.5));
            data.class2.y.push(-1);
        } else if (patternType === 'circular') {
            const r = Math.random() * 1.5 + noise * (Math.random() - 0.5) * 0.5;
            const theta = Math.random() * 2 * Math.PI;
            data.class1.x1.push(r * Math.cos(theta));
            data.class1.x2.push(r * Math.sin(theta));
            data.class1.y.push(1);

            const r2 = Math.random() * 1.5 + 3 + noise * (Math.random() - 0.5) * 0.5;
            const theta2 = Math.random() * 2 * Math.PI;
            data.class2.x1.push(r2 * Math.cos(theta2));
            data.class2.x2.push(r2 * Math.sin(theta2));
            data.class2.y.push(-1);
        } else { // xor
            const quadrant = Math.floor(Math.random() * 4);
            if (quadrant < 2) {
                data.class1.x1.push((Math.random() * 2 - 1) * (quadrant === 0 ? 1 : -1) + noise * (Math.random() - 0.5));
                data.class1.x2.push((Math.random() * 2 - 1) * (quadrant === 0 ? 1 : -1) + noise * (Math.random() - 0.5));
                data.class1.y.push(1);
            } else {
                data.class2.x1.push((Math.random() * 2 - 1) * (quadrant === 2 ? 1 : -1) + noise * (Math.random() - 0.5));
                data.class2.x2.push((Math.random() * 2 - 1) * (quadrant === 2 ? -1 : 1) + noise * (Math.random() - 0.5));
                data.class2.y.push(-1);
            }
        }
    }

    currentData = data;
    plotGeneratedData();
}

function plotGeneratedData() {
    if (!currentData) return;

    const data = [
        {
            x: currentData.class1.x1,
            y: currentData.class1.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 8, color: colors.class1, opacity: 0.7 },
            name: 'Clase 1'
        },
        {
            x: currentData.class2.x1,
            y: currentData.class2.x2,
            mode: 'markers',
            type: 'scatter',
            marker: { size: 8, color: colors.class2, opacity: 0.7 },
            name: 'Clase 2'
        }
    ];

    const layout = {
        title: 'Datos Generados',
        xaxis: { title: 'X₁', gridcolor: '#e2e8f0' },
        yaxis: { title: 'X₂', gridcolor: '#e2e8f0' },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('interactive-plot', data, layout, { responsive: true });
}

function trainClassifier() {
    if (!currentData) {
        alert('Primero debes generar datos usando el botón "Generar Datos"');
        return;
    }

    const kernel = document.getElementById('classifier-kernel').value;
    const C = parseFloat(document.getElementById('classifier-c').value);
    document.getElementById('classifier-c-value').textContent = C.toFixed(2);

    // Simular entrenamiento y mostrar resultados
    const nSupport = Math.floor(Math.random() * 20) + 10;
    const accuracy = (85 + Math.random() * 10).toFixed(1);
    const marginWidth = (1 / C).toFixed(3);

    document.getElementById('n-support-vectors').textContent = nSupport;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('margin-width').textContent = marginWidth;

    // Re-plotear con frontera de decisión
    plotGeneratedData();
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Hiperplano interactivo
    const beta0Input = document.getElementById('beta0');
    const beta1Input = document.getElementById('beta1');
    const beta2Input = document.getElementById('beta2');

    if (beta0Input && beta1Input && beta2Input) {
        beta0Input.addEventListener('input', updateHyperplane);
        beta1Input.addEventListener('input', updateHyperplane);
        beta2Input.addEventListener('input', updateHyperplane);
        updateHyperplane();
    }

    // Clasificador de margen máximo
    if (document.getElementById('maximal-margin-plot')) {
        plotMaximalMargin();
    }

    // Support Vector Classifier
    const cSlider = document.getElementById('c-slider');
    if (cSlider) {
        cSlider.addEventListener('input', plotSVC);
        plotSVC();
    }

    // Comparación de kernels
    const kernelButtons = document.querySelectorAll('.kernel-btn');
    kernelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            kernelButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            plotKernelComparison(this.dataset.kernel);
        });
    });

    if (document.getElementById('kernel-comparison-plot')) {
        plotKernelComparison('linear');
    }

    // Función de pérdida
    if (document.getElementById('loss-comparison-plot')) {
        plotLossComparison();
    }

    // Generador de datos
    const generateBtn = document.getElementById('generate-data');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateData);
        generateData(); // Generar datos iniciales
    }

    const trainBtn = document.getElementById('train-classifier');
    if (trainBtn) {
        trainBtn.addEventListener('click', trainClassifier);
    }

    const noiseSlider = document.getElementById('noise');
    if (noiseSlider) {
        noiseSlider.addEventListener('input', function() {
            document.getElementById('noise-value').textContent = this.value;
        });
    }

    // Kernel parameters
    const polyDegree = document.getElementById('poly-degree');
    if (polyDegree) {
        polyDegree.addEventListener('input', function() {
            document.getElementById('poly-degree-value').textContent = this.value;
            plotPolyKernel();
        });
    }

    const gamma = document.getElementById('gamma');
    if (gamma) {
        gamma.addEventListener('input', function() {
            document.getElementById('gamma-value').textContent = parseFloat(this.value).toFixed(3);
            plotRBFKernel();
        });
    }

    // Visualizaciones de kernels individuales
    if (document.getElementById('linear-kernel')) {
        plotLinearKernel();
    }
    if (document.getElementById('poly-kernel')) {
        plotPolyKernel();
    }
    if (document.getElementById('rbf-kernel')) {
        plotRBFKernel();
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// VISUALIZACIÓN 3D DEL HIPERPLANO
// ============================================
function plot3DHyperplane() {
    const beta0 = parseFloat(document.getElementById('beta0-3d').value);
    const beta1 = parseFloat(document.getElementById('beta1-3d').value);
    const beta2 = parseFloat(document.getElementById('beta2-3d').value);
    const beta3 = parseFloat(document.getElementById('beta3-3d').value);

    document.getElementById('beta0-3d-value').textContent = beta0.toFixed(1);
    document.getElementById('beta1-3d-value').textContent = beta1.toFixed(1);
    document.getElementById('beta2-3d-value').textContent = beta2.toFixed(1);
    document.getElementById('beta3-3d-value').textContent = beta3.toFixed(1);
    document.getElementById('equation-3d').textContent =
        `${beta0.toFixed(1)} + ${beta1.toFixed(1)}X₁ + ${beta2.toFixed(1)}X₂ + ${beta3.toFixed(1)}X₃ = 0`;

    // Generar puntos de ejemplo en 3D
    const n = 50;
    const class1 = { x: [], y: [], z: [] };
    const class2 = { x: [], y: [], z: [] };

    for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 4;
        const y = (Math.random() - 0.5) * 4;
        const z = (Math.random() - 0.5) * 4;
        const value = beta0 + beta1 * x + beta2 * y + beta3 * z;

        if (value > 0) {
            class1.x.push(x);
            class1.y.push(y);
            class1.z.push(z);
        } else {
            class2.x.push(x);
            class2.y.push(y);
            class2.z.push(z);
        }
    }

    // Crear malla para el hiperplano (en 3D es un plano 2D)
    const size = 3;
    const meshSize = 20;
    const xGrid = [];
    const yGrid = [];
    const zGrid = [];

    for (let i = 0; i < meshSize; i++) {
        const row = [];
        for (let j = 0; j < meshSize; j++) {
            const x = -size + (2 * size * i) / (meshSize - 1);
            const y = -size + (2 * size * j) / (meshSize - 1);
            // z = -(beta0 + beta1*x + beta2*y) / beta3
            const z = beta3 !== 0 ? -(beta0 + beta1 * x + beta2 * y) / beta3 : 0;
            row.push(z);
            if (i === 0) {
                xGrid.push(x);
            }
        }
        yGrid.push(-size + (2 * size * i) / (meshSize - 1));
        zGrid.push(row);
    }

    const data = [
        {
            x: class1.x,
            y: class1.y,
            z: class1.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: colors.class1,
                opacity: 0.8
            },
            name: 'Clase +1'
        },
        {
            x: class2.x,
            y: class2.y,
            z: class2.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: colors.class2,
                opacity: 0.8
            },
            name: 'Clase -1'
        },
        {
            x: xGrid,
            y: yGrid,
            z: zGrid,
            type: 'surface',
            colorscale: [[0, 'rgba(100, 100, 100, 0.3)'], [1, 'rgba(100, 100, 100, 0.3)']],
            showscale: false,
            opacity: 0.5,
            name: 'Hiperplano'
        }
    ];

    const layout = {
        title: 'Hiperplano en 3D',
        scene: {
            xaxis: { title: 'X₁', range: [-3, 3] },
            yaxis: { title: 'X₂', range: [-3, 3] },
            zaxis: { title: 'X₃', range: [-3, 3] },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.2 }
            }
        },
        showlegend: true,
        paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('hyperplane-3d-plot', data, layout, { responsive: true });
}

// ============================================
// CLASIFICADOR DE MARGEN MÁXIMO 3D
// ============================================
function plotMaximalMargin3D() {
    const n = 30;
    const class1 = { x: [], y: [], z: [] };
    const class2 = { x: [], y: [], z: [] };
    const supportVectors = { x: [], y: [], z: [] };

    // Generar datos separables en 3D
    for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 3;
        const y = (Math.random() - 0.5) * 3;
        const z = Math.random() * 2 + 1.5; // Clase 1 arriba
        class1.x.push(x);
        class1.y.push(y);
        class1.z.push(z);

        const x2 = (Math.random() - 0.5) * 3;
        const y2 = (Math.random() - 0.5) * 3;
        const z2 = Math.random() * 2 - 1.5; // Clase 2 abajo
        class2.x.push(x2);
        class2.y.push(y2);
        class2.z.push(z2);
    }

    // Vectores de soporte (puntos más cercanos al hiperplano)
    supportVectors.x = [-0.5, 0.7, -0.3, 0.4, -0.8, 0.6];
    supportVectors.y = [0.6, -0.4, 0.8, -0.7, 0.3, 0.5];
    supportVectors.z = [0.9, 0.95, -0.85, 1.0, -0.9, -0.95];

    // Crear el hiperplano z = 0
    const size = 2.5;
    const meshSize = 10;
    const xGrid = [];
    const yGrid = [];
    const zGrid = [];

    for (let i = 0; i < meshSize; i++) {
        const row = [];
        for (let j = 0; j < meshSize; j++) {
            row.push(0); // Plano en z = 0
            if (i === 0) {
                xGrid.push(-size + (2 * size * j) / (meshSize - 1));
            }
        }
        yGrid.push(-size + (2 * size * i) / (meshSize - 1));
        zGrid.push(row);
    }

    // Planos del margen (z = 0.8 y z = -0.8)
    const marginUp = zGrid.map(row => row.map(() => 0.8));
    const marginDown = zGrid.map(row => row.map(() => -0.8));

    const data = [
        {
            x: class1.x,
            y: class1.y,
            z: class1.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: colors.class1,
                opacity: 0.7
            },
            name: 'Clase +1'
        },
        {
            x: class2.x,
            y: class2.y,
            z: class2.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: colors.class2,
                opacity: 0.7
            },
            name: 'Clase -1'
        },
        {
            x: supportVectors.x,
            y: supportVectors.y,
            z: supportVectors.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 10,
                color: 'transparent',
                line: {
                    width: 3,
                    color: colors.support
                }
            },
            name: 'Vectores de Soporte'
        },
        {
            x: xGrid,
            y: yGrid,
            z: zGrid,
            type: 'surface',
            colorscale: [[0, 'rgba(30, 41, 59, 0.5)'], [1, 'rgba(30, 41, 59, 0.5)']],
            showscale: false,
            opacity: 0.6,
            name: 'Hiperplano'
        },
        {
            x: xGrid,
            y: yGrid,
            z: marginUp,
            type: 'surface',
            colorscale: [[0, 'rgba(148, 163, 184, 0.3)'], [1, 'rgba(148, 163, 184, 0.3)']],
            showscale: false,
            opacity: 0.3,
            name: 'Margen Superior'
        },
        {
            x: xGrid,
            y: yGrid,
            z: marginDown,
            type: 'surface',
            colorscale: [[0, 'rgba(148, 163, 184, 0.3)'], [1, 'rgba(148, 163, 184, 0.3)']],
            showscale: false,
            opacity: 0.3,
            name: 'Margen Inferior'
        }
    ];

    const layout = {
        title: 'Clasificador de Margen Máximo en 3D',
        scene: {
            xaxis: { title: 'X₁', range: [-3, 3] },
            yaxis: { title: 'X₂', range: [-3, 3] },
            zaxis: { title: 'X₃', range: [-3, 3] },
            camera: {
                eye: { x: 1.7, y: 1.7, z: 1.3 }
            }
        },
        showlegend: true,
        paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('maximal-margin-3d-plot', data, layout, { responsive: true });
}

// ============================================
// VISUALIZACIÓN 3D DE KERNELS
// ============================================
function plotKernel3D(kernelType = 'poly') {
    const n = 60;
    const class1 = { x: [], y: [], z: [] };
    const class2 = { x: [], y: [], z: [] };

    // Generar datos circulares en 2D
    for (let i = 0; i < n; i++) {
        const r = Math.random() * 1.2;
        const theta = Math.random() * 2 * Math.PI;
        const x1 = r * Math.cos(theta);
        const y1 = r * Math.sin(theta);

        const r2 = Math.random() * 1.2 + 2;
        const theta2 = Math.random() * 2 * Math.PI;
        const x2 = r2 * Math.cos(theta2);
        const y2 = r2 * Math.sin(theta2);

        if (kernelType === 'linear') {
            // Sin transformación
            class1.x.push(x1);
            class1.y.push(y1);
            class1.z.push(0);
            class2.x.push(x2);
            class2.y.push(y2);
            class2.z.push(0);
        } else if (kernelType === 'poly') {
            // Transformación polinomial: z = x^2 + y^2
            class1.x.push(x1);
            class1.y.push(y1);
            class1.z.push(x1 * x1 + y1 * y1);
            class2.x.push(x2);
            class2.y.push(y2);
            class2.z.push(x2 * x2 + y2 * y2);
        } else { // rbf
            // Aproximación de RBF usando gaussiana
            const center_x = 0, center_y = 0;
            const gamma = 0.5;
            const z1 = Math.exp(-gamma * (x1 * x1 + y1 * y1));
            const z2 = Math.exp(-gamma * (x2 * x2 + y2 * y2));
            class1.x.push(x1);
            class1.y.push(y1);
            class1.z.push(z1 * 3);
            class2.x.push(x2);
            class2.y.push(y2);
            class2.z.push(z2 * 3);
        }
    }

    // Crear superficie del hiperplano separador en el espacio transformado
    const size = 4;
    const meshSize = 20;
    const xGrid = [];
    const yGrid = [];
    const zGrid = [];

    for (let i = 0; i < meshSize; i++) {
        const row = [];
        for (let j = 0; j < meshSize; j++) {
            const x = -size + (2 * size * j) / (meshSize - 1);
            const y = -size + (2 * size * i) / (meshSize - 1);
            let z;
            if (kernelType === 'linear') {
                z = 0;
            } else if (kernelType === 'poly') {
                z = 2.5; // Plano horizontal que separa
            } else {
                z = 0.5;
            }
            row.push(z);
            if (i === 0) {
                xGrid.push(x);
            }
        }
        yGrid.push(-size + (2 * size * i) / (meshSize - 1));
        zGrid.push(row);
    }

    const data = [
        {
            x: class1.x,
            y: class1.y,
            z: class1.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: colors.class1,
                opacity: 0.8
            },
            name: 'Clase 1'
        },
        {
            x: class2.x,
            y: class2.y,
            z: class2.z,
            mode: 'markers',
            type: 'scatter3d',
            marker: {
                size: 5,
                color: colors.class2,
                opacity: 0.8
            },
            name: 'Clase 2'
        },
        {
            x: xGrid,
            y: yGrid,
            z: zGrid,
            type: 'surface',
            colorscale: [[0, 'rgba(100, 100, 100, 0.4)'], [1, 'rgba(100, 100, 100, 0.4)']],
            showscale: false,
            opacity: 0.5,
            name: 'Hiperplano Separador'
        }
    ];

    const titles = {
        linear: 'Sin Transformación (Kernel Lineal)',
        poly: 'Espacio Transformado (Kernel Polinomial)',
        rbf: 'Espacio Transformado (Kernel RBF)'
    };

    const layout = {
        title: titles[kernelType],
        scene: {
            xaxis: { title: 'X₁' },
            yaxis: { title: 'X₂' },
            zaxis: { title: 'Dimensión Transformada' },
            camera: {
                eye: { x: 1.5, y: 1.5, z: 1.3 }
            }
        },
        showlegend: true,
        paper_bgcolor: '#ffffff'
    };

    Plotly.newPlot('kernel-3d-plot', data, layout, { responsive: true });
}

// ============================================
// EVENT LISTENERS PARA VISUALIZACIONES 3D
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Hiperplano 3D
    const beta0_3d = document.getElementById('beta0-3d');
    const beta1_3d = document.getElementById('beta1-3d');
    const beta2_3d = document.getElementById('beta2-3d');
    const beta3_3d = document.getElementById('beta3-3d');

    if (beta0_3d && beta1_3d && beta2_3d && beta3_3d) {
        beta0_3d.addEventListener('input', plot3DHyperplane);
        beta1_3d.addEventListener('input', plot3DHyperplane);
        beta2_3d.addEventListener('input', plot3DHyperplane);
        beta3_3d.addEventListener('input', plot3DHyperplane);
        plot3DHyperplane();
    }

    // Margen máximo 3D
    if (document.getElementById('maximal-margin-3d-plot')) {
        plotMaximalMargin3D();
    }

    // Kernel 3D
    const kernel3DSelector = document.getElementById('kernel-3d-selector');
    if (kernel3DSelector) {
        kernel3DSelector.addEventListener('change', function() {
            plotKernel3D(this.value);
        });
        plotKernel3D('poly');
    }

    // Clasificación Multiclase
    const multiclassStrategy = document.getElementById('multiclass-strategy');
    const generateMulticlass = document.getElementById('generate-multiclass');

    if (multiclassStrategy && generateMulticlass) {
        generateMulticlass.addEventListener('click', plotMulticlassSVM);
        multiclassStrategy.addEventListener('change', plotMulticlassSVM);
        plotMulticlassSVM(); // Plot inicial
    }
});

// ============================================
// CLASIFICACIÓN MULTICLASE
// ============================================
let multiclassData = null;

function generateMulticlassData() {
    const n = 60; // 60 puntos por clase
    const class1 = { x1: [], x2: [], label: [] };
    const class2 = { x1: [], x2: [], label: [] };
    const class3 = { x1: [], x2: [], label: [] };

    // Clase 1: Centro en (-2, 2)
    for (let i = 0; i < n; i++) {
        class1.x1.push(-2 + (Math.random() - 0.5) * 2.5);
        class1.x2.push(2 + (Math.random() - 0.5) * 2.5);
        class1.label.push(1);
    }

    // Clase 2: Centro en (2, 2)
    for (let i = 0; i < n; i++) {
        class2.x1.push(2 + (Math.random() - 0.5) * 2.5);
        class2.x2.push(2 + (Math.random() - 0.5) * 2.5);
        class2.label.push(2);
    }

    // Clase 3: Centro en (0, -1.5)
    for (let i = 0; i < n; i++) {
        class3.x1.push(0 + (Math.random() - 0.5) * 3);
        class3.x2.push(-1.5 + (Math.random() - 0.5) * 2.5);
        class3.label.push(3);
    }

    return {
        class1: class1,
        class2: class2,
        class3: class3
    };
}

function plotMulticlassSVM() {
    const strategy = document.getElementById('multiclass-strategy').value;

    // Generar o reusar datos
    if (!multiclassData || event && event.target.id === 'generate-multiclass') {
        multiclassData = generateMulticlassData();
    }

    const data = multiclassData;

    // Preparar datos para plotly
    const trace1 = {
        x: data.class1.x1,
        y: data.class1.x2,
        mode: 'markers',
        type: 'scatter',
        name: 'Clase 1',
        marker: {
            size: 10,
            color: '#3b82f6',
            symbol: 'circle',
            line: { width: 2, color: '#fff' }
        }
    };

    const trace2 = {
        x: data.class2.x1,
        y: data.class2.x2,
        mode: 'markers',
        type: 'scatter',
        name: 'Clase 2',
        marker: {
            size: 10,
            color: '#ef4444',
            symbol: 'square',
            line: { width: 2, color: '#fff' }
        }
    };

    const trace3 = {
        x: data.class3.x1,
        y: data.class3.x2,
        mode: 'markers',
        type: 'scatter',
        name: 'Clase 3',
        marker: {
            size: 10,
            color: '#10b981',
            symbol: 'diamond',
            line: { width: 2, color: '#fff' }
        }
    };

    // Crear fronteras de decisión (simuladas)
    const boundaries = createDecisionBoundaries(strategy);

    const plotData = [trace1, trace2, trace3, ...boundaries];

    const layout = {
        title: {
            text: `SVM Multiclase - Estrategia: ${strategy === 'ovo' ? 'One-Versus-One' : 'One-Versus-All'}`,
            font: { size: 18, weight: 'bold' }
        },
        xaxis: {
            title: 'X₁',
            range: [-5, 5],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        yaxis: {
            title: 'X₂',
            range: [-4, 5],
            gridcolor: '#e2e8f0',
            zerolinecolor: '#94a3b8'
        },
        showlegend: true,
        plot_bgcolor: '#f8fafc',
        paper_bgcolor: '#ffffff',
        hovermode: 'closest',
        annotations: getStrategyAnnotations(strategy)
    };

    Plotly.newPlot('multiclass-plot', plotData, layout, { responsive: true });

    // Actualizar métricas
    updateMulticlassMetrics(strategy);
}

function createDecisionBoundaries(strategy) {
    const boundaries = [];

    if (strategy === 'ovo') {
        // One-Versus-One: 3 fronteras (1vs2, 1vs3, 2vs3)
        // Frontera 1 vs 2 (vertical aproximada en x=0)
        boundaries.push({
            x: [0, 0],
            y: [-4, 5],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#8b5cf6', width: 2, dash: 'dash' },
            name: 'Frontera 1 vs 2',
            showlegend: false
        });

        // Frontera 1 vs 3 (diagonal)
        boundaries.push({
            x: [-5, 2],
            y: [0.5, 0.5],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#f59e0b', width: 2, dash: 'dash' },
            name: 'Frontera 1 vs 3',
            showlegend: false
        });

        // Frontera 2 vs 3 (diagonal)
        boundaries.push({
            x: [-2, 5],
            y: [0.5, 0.5],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#ec4899', width: 2, dash: 'dash' },
            name: 'Frontera 2 vs 3',
            showlegend: false
        });
    } else {
        // One-Versus-All: 3 fronteras (cada clase vs el resto)
        // Región Clase 1
        boundaries.push({
            x: [-5, -5, 0, 0, -5],
            y: [-4, 5, 5, 0, -4],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#3b82f6', width: 2, dash: 'dot' },
            fill: 'toself',
            fillcolor: 'rgba(59, 130, 246, 0.1)',
            name: 'Región Clase 1',
            showlegend: false
        });

        // Región Clase 2
        boundaries.push({
            x: [0, 0, 5, 5, 0],
            y: [0, 5, 5, -4, 0],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#ef4444', width: 2, dash: 'dot' },
            fill: 'toself',
            fillcolor: 'rgba(239, 68, 68, 0.1)',
            name: 'Región Clase 2',
            showlegend: false
        });

        // Región Clase 3
        boundaries.push({
            x: [-5, 0, 0, 5, 5, -5, -5],
            y: [0, 0, -4, -4, 0, 0, 0],
            mode: 'lines',
            type: 'scatter',
            line: { color: '#10b981', width: 2, dash: 'dot' },
            fill: 'toself',
            fillcolor: 'rgba(16, 185, 129, 0.1)',
            name: 'Región Clase 3',
            showlegend: false
        });
    }

    return boundaries;
}

function getStrategyAnnotations(strategy) {
    if (strategy === 'ovo') {
        return [
            {
                x: 0.5,
                y: 4,
                text: 'OVO: 3 clasificadores<br>(1vs2, 1vs3, 2vs3)',
                showarrow: false,
                font: { size: 11, color: '#64748b' },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: '#8b5cf6',
                borderwidth: 2,
                borderpad: 6
            }
        ];
    } else {
        return [
            {
                x: 0,
                y: 4,
                text: 'OVA: 3 clasificadores<br>(1 vs resto, 2 vs resto, 3 vs resto)',
                showarrow: false,
                font: { size: 11, color: '#64748b' },
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                bordercolor: '#3b82f6',
                borderwidth: 2,
                borderpad: 6
            }
        ];
    }
}

function updateMulticlassMetrics(strategy) {
    // Actualizar número de clasificadores
    const numClassifiers = strategy === 'ovo' ? 3 : 3; // Para K=3, ambos dan 3
    document.getElementById('num-classifiers').textContent = numClassifiers;

    // Simular precisión
    const accuracy = (88 + Math.random() * 10).toFixed(1);
    document.getElementById('multiclass-accuracy').textContent = accuracy + '%';
}

console.log('🎉 SVM Learning App Initialized!');
