/**
 * Thai Tax Calculator - Main Application
 */
'use strict';

class TaxApp {
    constructor() {
        this.currentSummary = null;
        this.debounceTimer = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        // Check storage availability
        if (!StorageManager.isStorageAvailable()) {
            Utils.showNotification('ระบบจัดเก็บข้อมูลไม่พร้อมใช้งาน', 'warning');
        }

        // Setup event listeners
        this.setupEventListeners();

        // Resize canvases
        window.addEventListener('resize', () => {
            ChartManager.resizeAllCanvases();
        });

        // Load last calculation if available
        this.loadLastCalculation();

        // Sync sliders and inputs
        this.setupSliderSync();

        // Update UI
        this.updateUI();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Cover screen buttons
        UIManager.addClickListener('startBtn', () => this.startCalculator());

        // Calculator screen buttons
        UIManager.addClickListener('backBtn', () => this.goBack());
        UIManager.addClickListener('viewChartBtn', () => this.showChartScreen());

        // Chart screen buttons
        UIManager.addClickListener('backFromChartBtn', () => this.goBack());
        UIManager.addClickListener('exportPdfBtn', () => this.exportPDF());
        UIManager.addClickListener('shareBtn', () => this.shareResults());
        UIManager.addClickListener('saveHistoryBtn', () => this.saveToHistory());

        // Income type checkboxes
        UIManager.addChangeListener('hasSalary', () => this.onIncomeTypeChange());
        UIManager.addChangeListener('hasFreelance', () => this.onIncomeTypeChange());
        UIManager.addChangeListener('hasMerchant', () => this.onIncomeTypeChange());

        // Income sliders and inputs
        UIManager.addInputListener('salarySlider', () => this.onCalculationChange());
        UIManager.addInputListener('salaryInput', () => this.onCalculationChange());
        UIManager.addInputListener('freelanceSlider', () => this.onCalculationChange());
        UIManager.addInputListener('freelanceInput', () => this.onCalculationChange());
        UIManager.addInputListener('merchantSlider', () => this.onCalculationChange());
        UIManager.addInputListener('merchantInput', () => this.onCalculationChange());

        // Allowance checkboxes
        UIManager.addChangeListener('spouse', () => this.onCalculationChange());
        UIManager.addChangeListener('childCount', () => {
            this.updateAllowanceInputs();
            this.onCalculationChange();
        });
        UIManager.addChangeListener('childBorn2018', () => {
            this.updateAllowanceInputs();
            this.onCalculationChange();
        });
        UIManager.addChangeListener('parentCount', () => {
            this.updateAllowanceInputs();
            this.onCalculationChange();
        });

        // Allowance inputs
        UIManager.addInputListener('childCountInput', () => this.onCalculationChange());
        UIManager.addInputListener('childBorn2018Input', () => this.onCalculationChange());
        UIManager.addInputListener('parentCountInput', () => this.onCalculationChange());
        UIManager.addInputListener('lifeInsurance', () => this.onCalculationChange());
        UIManager.addInputListener('healthInsurance', () => this.onCalculationChange());
        UIManager.addInputListener('socialSecurity', () => this.onCalculationChange());
        UIManager.addInputListener('pvd', () => this.onCalculationChange());
        UIManager.addInputListener('rmf', () => this.onCalculationChange());
        UIManager.addInputListener('ssf', () => this.onCalculationChange());
        UIManager.addInputListener('homeLoanInterest', () => this.onCalculationChange());

        // Modal listeners
        UIManager.addClickListener('aboutLink', (e) => {
            e.preventDefault();
            UIManager.showModal('aboutModal');
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal) {
                    UIManager.closeModal(modal.id);
                }
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                UIManager.closeModal(e.target.id);
            }
        });
    }

    /**
     * Setup slider and input synchronization
     */
    setupSliderSync() {
        UIManager.syncSliderAndInput('salarySlider', 'salaryInput');
        UIManager.syncSliderAndInput('freelanceSlider', 'freelanceInput');
        UIManager.syncSliderAndInput('merchantSlider', 'merchantInput');
    }

    /**
     * Handle income type change
     */
    onIncomeTypeChange() {
        const incomeTypes = {
            salary: UIManager.getElementValue('hasSalary'),
            freelance: UIManager.getElementValue('hasFreelance'),
            merchant: UIManager.getElementValue('hasMerchant'),
        };

        UIManager.updateIncomeInputs(incomeTypes);
        this.onCalculationChange();
    }

    /**
     * Update allowance input states
     */
    updateAllowanceInputs() {
        UIManager.updateAllowanceInputs();
    }

    /**
     * Handle calculation change (debounced)
     */
    onCalculationChange() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.calculateTax();
        }, APP_CONFIG.debounceDelay);
    }

    /**
     * Calculate tax
     */
    calculateTax() {
        try {
            // Get form data
            const formData = UIManager.getFormData();

            // Build input object
            const input = {
                salary: formData.salary,
                freelance: formData.freelance,
                merchant: formData.merchant,
                allowances: {
                    spouse: formData.spouse,
                    childCount: formData.childCount,
                    childBorn2018Count: formData.childBorn2018Count,
                    parentCount: formData.parentCountValue,
                    lifeInsurance: formData.lifeInsurance,
                    healthInsurance: formData.healthInsurance,
                    socialSecurity: formData.socialSecurity,
                    pvd: formData.pvd,
                    rmf: formData.rmf,
                    ssf: formData.ssf,
                    homeLoanInterest: formData.homeLoanInterest,
                },
            };

            // Calculate
            this.currentSummary = TaxCalculator.calculateTaxSummary(input);

            // Update UI
            this.updateUI();
        } catch (error) {
            console.error('Error calculating tax:', error);
            Utils.showNotification('เกิดข้อผิดพลาดในการคำนวณ', 'error');
        }
    }

    /**
     * Update all UI elements
     */
    updateUI() {
        if (!this.currentSummary) {
            return;
        }

        // Update tax result
        UIManager.updateTaxResult(this.currentSummary);

        // Update equation
        UIManager.updateEquation(this.currentSummary);

        // Update tax brackets table
        UIManager.updateTaxBracketsTable(this.currentSummary);

        // Update chart summary
        UIManager.updateChartSummary(this.currentSummary);

        // Update tax breakdown table
        UIManager.updateTaxBreakdownTable(this.currentSummary);
    }

    /**
     * Start calculator
     */
    startCalculator() {
        UIManager.switchScreen('calculatorScreen');
        this.calculateTax();
    }

    /**
     * Go back to cover screen
     */
    goBack() {
        UIManager.switchScreen('coverScreen');
    }

    /**
     * Show chart screen
     */
    showChartScreen() {
        UIManager.switchScreen('chartScreen');

        // Resize canvases and render charts
        setTimeout(() => {
            ChartManager.resizeAllCanvases();
            ChartManager.renderAllCharts(this.currentSummary);
        }, 100);
    }

    /**
     * Save to history
     */
    saveToHistory() {
        if (!this.currentSummary) {
            Utils.showNotification('ไม่มีการคำนวณที่จะบันทึก', 'warning');
            return;
        }

        const success = StorageManager.saveCalculation(this.currentSummary);
        if (success) {
            Utils.showNotification('บันทึกประวัติการคำนวณเรียบร้อย', 'success');
        } else {
            Utils.showNotification('ไม่สามารถบันทึกประวัติได้', 'error');
        }
    }

    /**
     * Load last calculation
     */
    loadLastCalculation() {
        const lastCalc = StorageManager.getLastCalculation();
        if (lastCalc) {
            // Restore form data
            const formData = {
                hasSalary: lastCalc.salary > 0,
                hasFreelance: lastCalc.freelance > 0,
                hasMerchant: lastCalc.merchant > 0,
                salary: lastCalc.salary,
                freelance: lastCalc.freelance,
                merchant: lastCalc.merchant,
                spouse: lastCalc.allowanceBreakdown?.personal?.spouse > 0,
                childCount: lastCalc.allowanceBreakdown?.personal?.childOld ?
                    lastCalc.allowanceBreakdown.personal.childOld / TAX_CONSTANTS.childAllowanceOld : 0,
                childBorn2018: lastCalc.allowanceBreakdown?.personal?.childNew > 0,
                childBorn2018Count: lastCalc.allowanceBreakdown?.personal?.childNew ?
                    lastCalc.allowanceBreakdown.personal.childNew / TAX_CONSTANTS.childAllowanceNew : 0,
                parentCount: lastCalc.allowanceBreakdown?.personal?.parent > 0,
                parentCountValue: lastCalc.allowanceBreakdown?.personal?.parent ?
                    lastCalc.allowanceBreakdown.personal.parent / TAX_CONSTANTS.parentAllowance : 0,
                lifeInsurance: lastCalc.allowanceBreakdown?.insurance?.lifeInsurance || 0,
                healthInsurance: lastCalc.allowanceBreakdown?.insurance?.healthInsurance || 0,
                socialSecurity: lastCalc.allowanceBreakdown?.insurance?.socialSecurity || 0,
                pvd: lastCalc.allowanceBreakdown?.insurance?.pvd || 0,
                rmf: lastCalc.allowanceBreakdown?.insurance?.rmf || 0,
                ssf: lastCalc.allowanceBreakdown?.insurance?.ssf || 0,
                homeLoanInterest: lastCalc.allowanceBreakdown?.housing?.homeLoanInterest || 0,
            };

            UIManager.setFormData(formData);
            this.onIncomeTypeChange();
        }
    }

    /**
     * Export to PDF (Print)
     */
    exportPDF() {
        if (!this.currentSummary) {
            Utils.showNotification('ไม่มีการคำนวณที่จะส่งออก', 'warning');
            return;
        }

        // Use browser's native print to PDF
        window.print();

        // Optional: Show hint about "Save as PDF" if needed, 
        // but arguably window.print() is self-explanatory on modern devices.
    }



    /**
     * Share results
     */
    shareResults() {
        if (!this.currentSummary) {
            Utils.showNotification('ไม่มีการคำนวณที่จะแชร์', 'warning');
            return;
        }

        const text = `ผลการคำนวณภาษี:
รายได้รวม: ${Utils.formatCurrency(this.currentSummary.totalIncome)}
เงินได้สุทธิ: ${Utils.formatCurrency(this.currentSummary.netIncome)}
ภาษี: ${Utils.formatCurrency(this.currentSummary.tax)}
เงินได้หลังหักภาษี: ${Utils.formatCurrency(this.currentSummary.netSalary)}

คำนวณด้วย: ภาษีเรื่องง่าย`;

        if (navigator.share) {
            navigator.share({
                title: 'ผลการคำนวณภาษี',
                text: text,
            }).catch(err => console.error('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            Utils.copyToClipboard(text).then(success => {
                if (success) {
                    Utils.showNotification('คัดลอกไปยังคลิปบอร์ดแล้ว', 'success');
                } else {
                    Utils.showNotification('ไม่สามารถคัดลอกได้', 'error');
                }
            });
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new TaxApp();
    });
} else {
    window.app = new TaxApp();
}
