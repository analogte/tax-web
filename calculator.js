/**
 * Thai Tax Calculator - Core Calculation Logic
 */

class TaxCalculator {
    /**
     * Calculate net income (เงินได้สุทธิ)
     * Net Income = Income - Expense - Allowance
     * @param {number} income - Total income
     * @param {number} expense - Total expense deduction
     * @param {number} allowance - Total allowance
     * @returns {number} Net income
     */
    static calculateNetIncome(income, expense, allowance) {
        return Math.max(0, income - expense - allowance);
    }

    /**
     * Calculate expense deduction (ค่าใช้จ่าย)
     * - Salary + Freelance (40(1)(2)): 50% (max 100,000)
     * - Merchant (40(8)): 60%
     * @param {number} salary - Salary income
     * @param {number} freelance - Freelance income
     * @param {number} merchant - Merchant income
     * @returns {number} Total expense deduction
     */
    static calculateExpense(salary, freelance, merchant) {
        // 40(1)(2) - Salary & Freelance: 50% capped at 100,000
        const expense40_1_2 = Math.min(
            (salary + freelance) * TAX_CONSTANTS.salaryExpenseRate,
            TAX_CONSTANTS.maxSalaryExpense
        );

        // 40(8) - Merchant: 60%
        const expense40_8 = merchant * TAX_CONSTANTS.merchantExpenseRate;

        return expense40_1_2 + expense40_8;
    }

    /**
     * Calculate expense breakdown
     * @param {number} salary - Salary income
     * @param {number} freelance - Freelance income
     * @param {number} merchant - Merchant income
     * @returns {Object} Expense breakdown
     */
    static calculateExpenseBreakdown(salary, freelance, merchant) {
        const expense40_1_2 = Math.min(
            (salary + freelance) * TAX_CONSTANTS.salaryExpenseRate,
            TAX_CONSTANTS.maxSalaryExpense
        );
        const expense40_8 = merchant * TAX_CONSTANTS.merchantExpenseRate;

        return {
            salaryExpense: expense40_1_2,
            merchantExpense: expense40_8,
            total: expense40_1_2 + expense40_8,
        };
    }

    /**
     * Calculate total tax based on net income and tax brackets
     * @param {number} netIncome - Net income
     * @param {Array} brackets - Tax brackets (default: TAX_BRACKETS)
     * @returns {number} Total tax amount
     */
    static calculateTax(netIncome, brackets = TAX_BRACKETS) {
        let totalTax = 0;
        let remainingIncome = netIncome;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;

            const bracketRange = bracket.maxNetIncome - bracket.minNetIncome;
            const incomeInBracket = Math.min(remainingIncome, bracketRange);
            totalTax += incomeInBracket * bracket.taxRate;
            remainingIncome -= bracketRange;
        }

        return totalTax;
    }

    /**
     * Calculate tax with detailed breakdown per bracket
     * @param {number} netIncome - Net income
     * @param {Array} brackets - Tax brackets (default: TAX_BRACKETS)
     * @returns {Object} Tax breakdown with details
     */
    static calculateTaxBreakdown(netIncome, brackets = TAX_BRACKETS) {
        const bracketTaxes = [];
        let remainingIncome = netIncome;
        let totalTax = 0;

        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;

            const bracketRange = bracket.maxNetIncome - bracket.minNetIncome;
            const incomeInBracket = Math.min(remainingIncome, bracketRange);
            const taxForBracket = incomeInBracket * bracket.taxRate;

            if (incomeInBracket > 0) {
                bracketTaxes.push({
                    bracket: bracket,
                    incomeInBracket: incomeInBracket,
                    tax: taxForBracket,
                });
            }

            totalTax += taxForBracket;
            remainingIncome -= bracketRange;
        }

        return {
            totalTax: totalTax,
            bracketTaxes: bracketTaxes,
        };
    }

    /**
     * Calculate effective tax rate
     * @param {number} netIncome - Net income
     * @param {number} tax - Tax amount
     * @returns {number} Effective tax rate (0-1)
     */
    static calculateEffectiveTaxRate(netIncome, tax) {
        if (netIncome <= 0) return 0;
        return tax / netIncome;
    }

    /**
     * Calculate net salary after tax
     * @param {number} totalIncome - Total income
     * @param {number} tax - Tax amount
     * @returns {number} Net salary after tax
     */
    static calculateNetSalary(totalIncome, tax) {
        return Math.max(0, totalIncome - tax);
    }

    /**
     * Calculate withholding tax (ภาษีหัก ณ ที่จ่าย)
     * Typically 5-10% of salary
     * @param {number} salary - Salary income
     * @param {number} rate - Withholding tax rate (default: 0.05)
     * @returns {number} Withholding tax amount
     */
    static calculateWithholdingTax(salary, rate = 0.05) {
        return salary * rate;
    }

    /**
     * Calculate tax installments
     * @param {number} tax - Total tax amount
     * @param {number} installments - Number of installments (default: 3)
     * @returns {Array} Array of installment amounts
     */
    static calculateInstallments(tax, installments = TAX_CONSTANTS.installmentCount) {
        if (tax < TAX_CONSTANTS.minTaxForInstallment) {
            return [tax];
        }

        const installmentAmount = Math.floor(tax / installments);
        const remainder = tax - (installmentAmount * (installments - 1));

        const result = [];
        for (let i = 0; i < installments - 1; i++) {
            result.push(installmentAmount);
        }
        result.push(remainder);

        return result;
    }

    /**
     * Calculate total allowance
     * @param {Object} allowances - Allowance object
     * @returns {number} Total allowance
     */
    static calculateTotalAllowance(allowances) {
        let total = TAX_CONSTANTS.personalAllowance; // Personal allowance is always included

        // Personal & Family
        if (allowances.spouse) {
            total += TAX_CONSTANTS.spouseAllowance;
        }
        total += (allowances.childCount || 0) * TAX_CONSTANTS.childAllowanceOld;
        total += (allowances.childBorn2018Count || 0) * TAX_CONSTANTS.childAllowanceNew;
        total += (allowances.parentCount || 0) * TAX_CONSTANTS.parentAllowance;

        // Insurance & Funds
        total += Math.min(allowances.lifeInsurance || 0, TAX_CONSTANTS.maxLifeInsurance);
        total += Math.min(allowances.healthInsurance || 0, TAX_CONSTANTS.maxHealthInsurance);
        total += Math.min(allowances.socialSecurity || 0, TAX_CONSTANTS.maxSocialSecurity);
        total += Math.min(allowances.pvd || 0, TAX_CONSTANTS.maxPvd);
        total += Math.min(allowances.rmf || 0, TAX_CONSTANTS.maxRmf);
        total += Math.min(allowances.ssf || 0, TAX_CONSTANTS.maxSsf);

        // Housing
        total += Math.min(allowances.homeLoanInterest || 0, TAX_CONSTANTS.maxHomeLoanInterest);

        return total;
    }

    /**
     * Calculate allowance breakdown
     * @param {Object} allowances - Allowance object
     * @returns {Object} Allowance breakdown by category
     */
    static calculateAllowanceBreakdown(allowances) {
        const personal = {
            personalAllowance: TAX_CONSTANTS.personalAllowance,
            spouse: allowances.spouse ? TAX_CONSTANTS.spouseAllowance : 0,
            childOld: (allowances.childCount || 0) * TAX_CONSTANTS.childAllowanceOld,
            childNew: (allowances.childBorn2018Count || 0) * TAX_CONSTANTS.childAllowanceNew,
            parent: (allowances.parentCount || 0) * TAX_CONSTANTS.parentAllowance,
        };

        const insurance = {
            lifeInsurance: Math.min(allowances.lifeInsurance || 0, TAX_CONSTANTS.maxLifeInsurance),
            healthInsurance: Math.min(allowances.healthInsurance || 0, TAX_CONSTANTS.maxHealthInsurance),
            socialSecurity: Math.min(allowances.socialSecurity || 0, TAX_CONSTANTS.maxSocialSecurity),
            pvd: Math.min(allowances.pvd || 0, TAX_CONSTANTS.maxPvd),
            rmf: Math.min(allowances.rmf || 0, TAX_CONSTANTS.maxRmf),
            ssf: Math.min(allowances.ssf || 0, TAX_CONSTANTS.maxSsf),
        };

        const housing = {
            homeLoanInterest: Math.min(allowances.homeLoanInterest || 0, TAX_CONSTANTS.maxHomeLoanInterest),
        };

        const personalTotal = Object.values(personal).reduce((a, b) => a + b, 0);
        const insuranceTotal = Object.values(insurance).reduce((a, b) => a + b, 0);
        const housingTotal = Object.values(housing).reduce((a, b) => a + b, 0);

        return {
            personal,
            personalTotal,
            insurance,
            insuranceTotal,
            housing,
            housingTotal,
            total: personalTotal + insuranceTotal + housingTotal,
        };
    }

    /**
     * Calculate complete tax summary
     * @param {Object} input - Input object with income and allowances
     * @returns {Object} Complete tax calculation summary
     */
    static calculateTaxSummary(input) {
        // Extract income
        const salary = input.salary || 0;
        const freelance = input.freelance || 0;
        const merchant = input.merchant || 0;
        const totalIncome = salary + freelance + merchant;

        // Calculate expense
        const expense = this.calculateExpense(salary, freelance, merchant);
        const expenseBreakdown = this.calculateExpenseBreakdown(salary, freelance, merchant);

        // Calculate allowance
        const allowance = this.calculateTotalAllowance(input.allowances || {});
        const allowanceBreakdown = this.calculateAllowanceBreakdown(input.allowances || {});

        // Calculate net income
        const netIncome = this.calculateNetIncome(totalIncome, expense, allowance);

        // Calculate tax
        const taxBreakdown = this.calculateTaxBreakdown(netIncome);
        const tax = taxBreakdown.totalTax;

        // Calculate effective tax rate
        const effectiveTaxRate = this.calculateEffectiveTaxRate(netIncome, tax);

        // Calculate net salary
        const netSalary = this.calculateNetSalary(totalIncome, tax);

        // Calculate withholding tax
        const withholdingTax = this.calculateWithholdingTax(salary);

        // Calculate installments
        const installments = this.calculateInstallments(tax);

        return {
            // Income
            salary,
            freelance,
            merchant,
            totalIncome,

            // Expense
            expense,
            expenseBreakdown,

            // Allowance
            allowance,
            allowanceBreakdown,

            // Net Income
            netIncome,

            // Tax
            tax,
            taxBreakdown,
            effectiveTaxRate,

            // Net Salary
            netSalary,

            // Withholding Tax
            withholdingTax,

            // Installments
            installments,

            // Timestamp
            timestamp: new Date().toISOString(),
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaxCalculator;
}
