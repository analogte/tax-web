/**
 * Thai Tax Calculator - UI Management
 */

class UIManager {
    /**
     * Switch between screens
     * @param {string} screenId - The screen ID to show
     */
    static switchScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    /**
     * Update tax result display
     * @param {Object} summary - Tax calculation summary
     */
    static updateTaxResult(summary) {
        document.getElementById('netIncomeDisplay').textContent = formatCurrency(summary.netIncome);
        document.getElementById('taxDisplay').textContent = formatCurrency(summary.tax);
        document.getElementById('netSalaryDisplay').textContent = formatCurrency(summary.netSalary);
    }

    /**
     * Update equation display
     * @param {Object} summary - Tax calculation summary
     */
    static updateEquation(summary) {
        document.getElementById('eqIncome').textContent = formatNumber(summary.totalIncome);
        document.getElementById('eqExpense').textContent = formatNumber(summary.expense);
        document.getElementById('eqAllowance').textContent = formatNumber(summary.allowance);
        document.getElementById('eqNetIncome').textContent = formatNumber(summary.netIncome);
    }

    /**
     * Update tax brackets table
     * @param {Object} summary - Tax calculation summary
     */
    static updateTaxBracketsTable(summary) {
        const tbody = document.getElementById('taxBracketsTable');
        tbody.innerHTML = '';

        const { bracketTaxes } = summary.taxBreakdown;

        // Show all brackets
        TAX_BRACKETS.forEach((bracket, index) => {
            const bracketTax = bracketTaxes.find(bt => bt.bracket === bracket);
            const incomeInBracket = bracketTax ? bracketTax.incomeInBracket : 0;
            const tax = bracketTax ? bracketTax.tax : 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatCurrency(bracket.minNetIncome)} - ${bracket.maxNetIncome === Infinity ? 'ขึ้นไป' : formatCurrency(bracket.maxNetIncome)}</td>
                <td class="bracket-rate">${formatPercentage(bracket.taxRate)}</td>
                <td class="bracket-tax">${formatCurrency(tax)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    /**
     * Update chart screen summary
     * @param {Object} summary - Tax calculation summary
     */
    static updateChartSummary(summary) {
        document.getElementById('chartTotalIncome').textContent = formatCurrency(summary.totalIncome);
        document.getElementById('chartExpense').textContent = formatCurrency(summary.expense);
        document.getElementById('chartAllowance').textContent = formatCurrency(summary.allowance);
        document.getElementById('chartNetIncome').textContent = formatCurrency(summary.netIncome);
        document.getElementById('chartTax').textContent = formatCurrency(summary.tax);
    }

    /**
     * Update tax breakdown table
     * @param {Object} summary - Tax calculation summary
     */
    static updateTaxBreakdownTable(summary) {
        const tbody = document.getElementById('taxBreakdownTable');
        tbody.innerHTML = '';

        const rows = [
            { label: 'รายได้รวม', value: summary.totalIncome },
            { label: 'ค่าใช้จ่าย', value: -summary.expense },
            { label: 'ค่าลดหย่อน', value: -summary.allowance },
            { label: 'เงินได้สุทธิ', value: summary.netIncome, highlight: true },
            { label: 'ภาษี', value: summary.tax, highlight: true },
            { label: 'เงินได้หลังหักภาษี', value: summary.netSalary },
            { label: 'อัตราภาษีจริง', value: `${formatPercentage(summary.effectiveTaxRate)}` },
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            const valueCell = document.createElement('td');
            
            if (typeof row.value === 'string') {
                valueCell.textContent = row.value;
            } else {
                valueCell.textContent = formatCurrency(row.value);
            }
            
            if (row.highlight) {
                valueCell.classList.add('value');
            }

            tr.innerHTML = `<td class="label">${row.label}</td>`;
            tr.appendChild(valueCell);
            tbody.appendChild(tr);
        });
    }

    /**
     * Update income input visibility
     * @param {Object} incomeTypes - Income type selections
     */
    static updateIncomeInputs(incomeTypes) {
        const section = document.getElementById('incomeInputsSection');
        const hasSalary = incomeTypes.salary;
        const hasFreelance = incomeTypes.freelance;
        const hasMerchant = incomeTypes.merchant;

        // Show/hide section
        section.style.display = (hasSalary || hasFreelance || hasMerchant) ? 'block' : 'none';

        // Show/hide individual inputs
        document.getElementById('salaryInput').style.display = hasSalary ? 'block' : 'none';
        document.getElementById('freelanceInput').style.display = hasFreelance ? 'block' : 'none';
        document.getElementById('merchantInput').style.display = hasMerchant ? 'block' : 'none';
    }

    /**
     * Update allowance input states
     */
    static updateAllowanceInputs() {
        // Child count
        const childCountCheckbox = document.getElementById('childCount');
        const childCountInput = document.getElementById('childCountInput');
        childCountInput.disabled = !childCountCheckbox.checked;

        // Child born 2018
        const childBorn2018Checkbox = document.getElementById('childBorn2018');
        const childBorn2018Input = document.getElementById('childBorn2018Input');
        childBorn2018Input.disabled = !childBorn2018Checkbox.checked;

        // Parent count
        const parentCountCheckbox = document.getElementById('parentCount');
        const parentCountInput = document.getElementById('parentCountInput');
        parentCountInput.disabled = !parentCountCheckbox.checked;
    }

    /**
     * Sync slider and number input
     * @param {string} sliderId - The slider element ID
     * @param {string} inputId - The number input element ID
     */
    static syncSliderAndInput(sliderId, inputId) {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);

        if (!slider || !input) return;

        // Slider to input
        slider.addEventListener('input', () => {
            input.value = slider.value;
        });

        // Input to slider
        input.addEventListener('input', () => {
            slider.value = input.value;
        });
    }

    /**
     * Enable/disable element
     * @param {string} elementId - The element ID
     * @param {boolean} enabled - Whether to enable
     */
    static setElementEnabled(elementId, enabled) {
        const element = document.getElementById(elementId);
        if (element) {
            element.disabled = !enabled;
            if (enabled) {
                element.classList.remove('disabled');
            } else {
                element.classList.add('disabled');
            }
        }
    }

    /**
     * Show/hide element
     * @param {string} elementId - The element ID
     * @param {boolean} visible - Whether to show
     */
    static setElementVisible(elementId, visible) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = visible ? 'block' : 'none';
        }
    }

    /**
     * Set element text content
     * @param {string} elementId - The element ID
     * @param {string} text - The text content
     */
    static setElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    /**
     * Get element value
     * @param {string} elementId - The element ID
     * @returns {string|number} The element value
     */
    static getElementValue(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return '';

        if (element.type === 'checkbox') {
            return element.checked;
        }
        if (element.type === 'number' || element.type === 'range') {
            return parseFloat(element.value) || 0;
        }
        return element.value;
    }

    /**
     * Set element value
     * @param {string} elementId - The element ID
     * @param {*} value - The value to set
     */
    static setElementValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (element.type === 'checkbox') {
            element.checked = Boolean(value);
        } else {
            element.value = value;
        }
    }

    /**
     * Add event listener to element
     * @param {string} elementId - The element ID
     * @param {string} eventType - The event type
     * @param {Function} handler - The event handler
     */
    static addEventListener(elementId, eventType, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }

    /**
     * Add change listener to element
     * @param {string} elementId - The element ID
     * @param {Function} handler - The change handler
     */
    static addChangeListener(elementId, handler) {
        this.addEventListener(elementId, 'change', handler);
    }

    /**
     * Add input listener to element
     * @param {string} elementId - The element ID
     * @param {Function} handler - The input handler
     */
    static addInputListener(elementId, handler) {
        this.addEventListener(elementId, 'input', handler);
    }

    /**
     * Add click listener to element
     * @param {string} elementId - The element ID
     * @param {Function} handler - The click handler
     */
    static addClickListener(elementId, handler) {
        this.addEventListener(elementId, 'click', handler);
    }

    /**
     * Disable all inputs
     */
    static disableAllInputs() {
        document.querySelectorAll('input, button, select, textarea').forEach(element => {
            element.disabled = true;
        });
    }

    /**
     * Enable all inputs
     */
    static enableAllInputs() {
        document.querySelectorAll('input, button, select, textarea').forEach(element => {
            element.disabled = false;
        });
    }

    /**
     * Show loading state
     */
    static showLoading() {
        this.disableAllInputs();
        // Could add a loading spinner here
    }

    /**
     * Hide loading state
     */
    static hideLoading() {
        this.enableAllInputs();
    }

    /**
     * Scroll to element
     * @param {string} elementId - The element ID
     */
    static scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Focus element
     * @param {string} elementId - The element ID
     */
    static focusElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
        }
    }

    /**
     * Get all form data
     * @returns {Object} Form data object
     */
    static getFormData() {
        return {
            // Income types
            hasSalary: this.getElementValue('hasSalary'),
            hasFreelance: this.getElementValue('hasFreelance'),
            hasMerchant: this.getElementValue('hasMerchant'),

            // Income amounts
            salary: this.getElementValue('salarySlider'),
            freelance: this.getElementValue('freelanceSlider'),
            merchant: this.getElementValue('merchantSlider'),

            // Allowances
            spouse: this.getElementValue('spouse'),
            childCount: this.getElementValue('childCountInput'),
            childBorn2018: this.getElementValue('childBorn2018'),
            childBorn2018Count: this.getElementValue('childBorn2018Input'),
            parentCount: this.getElementValue('parentCount'),
            parentCountValue: this.getElementValue('parentCountInput'),
            lifeInsurance: this.getElementValue('lifeInsurance'),
            healthInsurance: this.getElementValue('healthInsurance'),
            socialSecurity: this.getElementValue('socialSecurity'),
            pvd: this.getElementValue('pvd'),
            rmf: this.getElementValue('rmf'),
            ssf: this.getElementValue('ssf'),
            homeLoanInterest: this.getElementValue('homeLoanInterest'),
        };
    }

    /**
     * Set form data
     * @param {Object} data - Form data object
     */
    static setFormData(data) {
        // Income types
        if ('hasSalary' in data) this.setElementValue('hasSalary', data.hasSalary);
        if ('hasFreelance' in data) this.setElementValue('hasFreelance', data.hasFreelance);
        if ('hasMerchant' in data) this.setElementValue('hasMerchant', data.hasMerchant);

        // Income amounts
        if ('salary' in data) {
            this.setElementValue('salarySlider', data.salary);
            this.setElementValue('salaryInput', data.salary);
        }
        if ('freelance' in data) {
            this.setElementValue('freelanceSlider', data.freelance);
            this.setElementValue('freelanceInput', data.freelance);
        }
        if ('merchant' in data) {
            this.setElementValue('merchantSlider', data.merchant);
            this.setElementValue('merchantInput', data.merchant);
        }

        // Allowances
        if ('spouse' in data) this.setElementValue('spouse', data.spouse);
        if ('childCount' in data) this.setElementValue('childCountInput', data.childCount);
        if ('childBorn2018' in data) this.setElementValue('childBorn2018', data.childBorn2018);
        if ('childBorn2018Count' in data) this.setElementValue('childBorn2018Input', data.childBorn2018Count);
        if ('parentCount' in data) this.setElementValue('parentCount', data.parentCount);
        if ('parentCountValue' in data) this.setElementValue('parentCountInput', data.parentCountValue);
        if ('lifeInsurance' in data) this.setElementValue('lifeInsurance', data.lifeInsurance);
        if ('healthInsurance' in data) this.setElementValue('healthInsurance', data.healthInsurance);
        if ('socialSecurity' in data) this.setElementValue('socialSecurity', data.socialSecurity);
        if ('pvd' in data) this.setElementValue('pvd', data.pvd);
        if ('rmf' in data) this.setElementValue('rmf', data.rmf);
        if ('ssf' in data) this.setElementValue('ssf', data.ssf);
        if ('homeLoanInterest' in data) this.setElementValue('homeLoanInterest', data.homeLoanInterest);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
