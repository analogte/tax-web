/**
 * Thai Tax Calculator - Chart Rendering
 * Uses HTML5 Canvas for charts
 */

class ChartManager {
    /**
     * Draw pie chart
     * @param {string} canvasId - The canvas element ID
     * @param {Array} data - Array of data objects with label and value
     * @param {Array} colors - Array of colors
     */
    static drawPieChart(canvasId, data, colors) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;

        // Calculate total
        const total = data.reduce((sum, item) => sum + item.value, 0);

        // Draw pie slices
        let currentAngle = -Math.PI / 2;
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;

            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            // Draw border
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const percentage = ((item.value / total) * 100).toFixed(0);
            ctx.fillText(`${percentage}%`, labelX, labelY);

            currentAngle += sliceAngle;
        });

        // Draw legend
        const legendY = height - 60;
        data.forEach((item, index) => {
            const x = 20 + (index % 2) * (width / 2);
            const y = legendY + Math.floor(index / 2) * 20;

            // Color box
            ctx.fillStyle = colors[index % colors.length];
            ctx.fillRect(x, y, 12, 12);

            // Label
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.label, x + 18, y + 6);
        });
    }

    /**
     * Draw bar chart
     * @param {string} canvasId - The canvas element ID
     * @param {Array} labels - Array of labels
     * @param {Array} datasets - Array of datasets with label, data, and color
     */
    static drawBarChart(canvasId, labels, datasets) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value
        let maxValue = 0;
        datasets.forEach(dataset => {
            dataset.data.forEach(value => {
                maxValue = Math.max(maxValue, value);
            });
        });

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw grid lines and labels
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding + (chartHeight / gridLines) * i;
            const value = maxValue - (maxValue / gridLines) * i;

            // Grid line
            ctx.strokeStyle = '#f0f0f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis label
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(formatNumber(value), padding - 10, y);
        }

        // Draw bars
        const barWidth = chartWidth / (labels.length * (datasets.length + 1));
        const barGap = barWidth * 0.2;

        labels.forEach((label, labelIndex) => {
            const groupX = padding + (labelIndex + 0.5) * (chartWidth / labels.length);

            datasets.forEach((dataset, datasetIndex) => {
                const value = dataset.data[labelIndex] || 0;
                const barHeight = (value / maxValue) * chartHeight;
                const barX = groupX - (datasets.length * barWidth) / 2 + datasetIndex * barWidth;
                const barY = height - padding - barHeight;

                // Draw bar
                ctx.fillStyle = dataset.color;
                ctx.fillRect(barX, barY, barWidth - barGap, barHeight);

                // Draw value on top
                ctx.fillStyle = '#333';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(formatNumber(value), barX + (barWidth - barGap) / 2, barY - 5);
            });

            // X-axis label
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(label, groupX, height - padding + 10);
        });
    }

    /**
     * Draw line chart
     * @param {string} canvasId - The canvas element ID
     * @param {Array} labels - Array of labels
     * @param {Array} datasets - Array of datasets with label, data, and color
     */
    static drawLineChart(canvasId, labels, datasets) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value
        let maxValue = 0;
        datasets.forEach(dataset => {
            dataset.data.forEach(value => {
                maxValue = Math.max(maxValue, value);
            });
        });

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw grid lines
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = padding + (chartHeight / gridLines) * i;
            const value = maxValue - (maxValue / gridLines) * i;

            ctx.strokeStyle = '#f0f0f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(formatNumber(value), padding - 10, y);
        }

        // Draw lines
        datasets.forEach(dataset => {
            ctx.strokeStyle = dataset.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            dataset.data.forEach((value, index) => {
                const x = padding + (index / (labels.length - 1)) * chartWidth;
                const y = height - padding - (value / maxValue) * chartHeight;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw points
            ctx.fillStyle = dataset.color;
            dataset.data.forEach((value, index) => {
                const x = padding + (index / (labels.length - 1)) * chartWidth;
                const y = height - padding - (value / maxValue) * chartHeight;

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        });

        // Draw x-axis labels
        labels.forEach((label, index) => {
            const x = padding + (index / (labels.length - 1)) * chartWidth;

            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(label, x, height - padding + 10);
        });
    }

    /**
     * Render income breakdown pie chart
     * @param {Object} summary - Tax calculation summary
     */
    static renderIncomeChart(summary) {
        const data = [];
        const colors = [];

        if (summary.salary > 0) {
            data.push({ label: 'เงินเดือน', value: summary.salary });
            colors.push(CHART_COLORS.income);
        }
        if (summary.freelance > 0) {
            data.push({ label: 'ฟรีแลนซ์', value: summary.freelance });
            colors.push(CHART_COLORS.secondary);
        }
        if (summary.merchant > 0) {
            data.push({ label: 'ธุรกิจ', value: summary.merchant });
            colors.push(CHART_COLORS.warning);
        }

        if (data.length > 0) {
            this.drawPieChart('incomeChart', data, colors);
        }
    }

    /**
     * Render tax breakdown bar chart
     * @param {Object} summary - Tax calculation summary
     */
    static renderTaxChart(summary) {
        const { bracketTaxes } = summary.taxBreakdown;

        const labels = [];
        const data = [];

        bracketTaxes.forEach(bt => {
            const bracket = bt.bracket;
            const label = `${formatNumber(bracket.minNetIncome)}-${bracket.maxNetIncome === Infinity ? '∞' : formatNumber(bracket.maxNetIncome)}`;
            labels.push(label);
            data.push(bt.tax);
        });

        if (labels.length > 0) {
            this.drawBarChart('taxChart', labels, [{
                label: 'ภาษี',
                data: data,
                color: CHART_COLORS.tax,
            }]);
        }
    }

    /**
     * Render net salary comparison chart
     * @param {Object} summary - Tax calculation summary
     */
    static renderNetSalaryChart(summary) {
        const labels = ['รายได้รวม', 'หักภาษี', 'เงินได้สุทธิ'];
        const data = [summary.totalIncome, summary.tax, summary.netSalary];
        const colors = [CHART_COLORS.income, CHART_COLORS.danger, CHART_COLORS.success];

        this.drawBarChart('netSalaryChart', labels, [{
            label: 'จำนวนเงิน',
            data: data,
            color: CHART_COLORS.primary,
        }]);
    }

    /**
     * Render allowance breakdown pie chart
     * @param {Object} summary - Tax calculation summary
     */
    static renderAllowanceChart(summary) {
        const { allowanceBreakdown } = summary;
        const data = [];
        const colors = [];

        if (allowanceBreakdown.personalTotal > 0) {
            data.push({ label: 'ส่วนตัวและครอบครัว', value: allowanceBreakdown.personalTotal });
            colors.push(CHART_COLORS.primary);
        }
        if (allowanceBreakdown.insuranceTotal > 0) {
            data.push({ label: 'ประกันและกองทุน', value: allowanceBreakdown.insuranceTotal });
            colors.push(CHART_COLORS.secondary);
        }
        if (allowanceBreakdown.housingTotal > 0) {
            data.push({ label: 'ที่อยู่อาศัย', value: allowanceBreakdown.housingTotal });
            colors.push(CHART_COLORS.success);
        }

        if (data.length > 0) {
            this.drawPieChart('allowanceChart', data, colors);
        }
    }

    /**
     * Render all charts
     * @param {Object} summary - Tax calculation summary
     */
    static renderAllCharts(summary) {
        this.renderIncomeChart(summary);
        this.renderTaxChart(summary);
        this.renderNetSalaryChart(summary);
        this.renderAllowanceChart(summary);
    }

    /**
     * Resize canvas to fit container
     * @param {string} canvasId - The canvas element ID
     */
    static resizeCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    /**
     * Resize all canvases
     */
    static resizeAllCanvases() {
        ['incomeChart', 'taxChart', 'netSalaryChart', 'allowanceChart'].forEach(id => {
            this.resizeCanvas(id);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
