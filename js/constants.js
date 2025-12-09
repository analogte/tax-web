/**
 * Thai Tax Calculator - Constants
 * Contains all tax-related constants and configuration
 */
'use strict';


const TAX_CONSTANTS = {
    // ============ Income Input Limits ============
    maxIncomeInput: 10000000,
    defaultSalary: 300000,

    // ============ Expense Deduction Rates ============
    salaryExpenseRate: 0.50,
    maxSalaryExpense: 100000,
    merchantExpenseRate: 0.60,

    // ============ Personal & Family Allowances ============
    personalAllowance: 60000,
    spouseAllowance: 60000,
    childAllowanceOld: 30000,
    childAllowanceNew: 60000,
    parentAllowance: 30000,
    maxChildCount: 10,
    maxParentCount: 4,

    // ============ Insurance & Fund Allowances ============
    maxLifeInsurance: 100000,
    maxHealthInsurance: 25000,
    maxSocialSecurity: 9000,
    monthlySocialSecurity: 750,
    maxPvd: 500000,
    pvdRateLimit: 0.15,
    maxRmf: 500000,
    rmfRateLimit: 0.30,
    maxSsf: 200000,
    ssfRateLimit: 0.30,
    maxCombinedRetirementFunds: 500000,

    // ============ Housing Allowances ============
    maxHomeLoanInterest: 100000,

    // ============ Tax Brackets ============
    taxExemptionThreshold: 150000,
    minIncomeForTaxFiling: 60000,
    minTaxForInstallment: 3000,
    installmentCount: 3,

    // ============ Date/Time Constants ============
    paperFilingDeadlineMonth: 3,
    paperFilingDeadlineDay: 31,
    onlineFilingDeadlineMonth: 4,
    onlineFilingDeadlineDay: 8,

    // ============ UI Related ============
    incomeSliderMax: 10000000,
    incomeSliderStep: 10000,
};

/**
 * Thai personal income tax brackets for 2024
 * Progressive tax calculation
 */
const TAX_BRACKETS = [
    { minNetIncome: 0, maxNetIncome: 150000, taxRate: 0.00 },
    { minNetIncome: 150000, maxNetIncome: 300000, taxRate: 0.05 },
    { minNetIncome: 300000, maxNetIncome: 500000, taxRate: 0.10 },
    { minNetIncome: 500000, maxNetIncome: 750000, taxRate: 0.15 },
    { minNetIncome: 750000, maxNetIncome: 1000000, taxRate: 0.20 },
    { minNetIncome: 1000000, maxNetIncome: 2000000, taxRate: 0.25 },
    { minNetIncome: 2000000, maxNetIncome: 5000000, taxRate: 0.30 },
    { minNetIncome: 5000000, maxNetIncome: Infinity, taxRate: 0.35 },
];

/**
 * Color scheme for charts
 */
const CHART_COLORS = {
    primary: '#6366f1',
    secondary: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    income: '#10b981',
    expense: '#ef4444',
    tax: '#6366f1',
    allowance: '#8b5cf6',
};

/**
 * Locale settings for Thai
 */
const LOCALE = {
    currency: '฿',
    currencyCode: 'THB',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    language: 'th',
    dateFormat: 'DD/MM/YYYY',
};

/**
 * Storage keys for LocalStorage
 */
const STORAGE_KEYS = {
    calculationHistory: 'tax_calculation_history',
    lastCalculation: 'tax_last_calculation',
    userPreferences: 'tax_user_preferences',
    savedCalculations: 'tax_saved_calculations',
};

/**
 * Application configuration
 */
const APP_CONFIG = {
    appName: 'ภาษีเรื่องง่าย',
    appSubtitle: 'ใครๆก็เข้าใจ',
    version: '1.0.0',
    maxHistoryItems: 50,
    debounceDelay: 300,
};
// Export for use in other modules (Safe for browser)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TAX_CONSTANTS,
        TAX_BRACKETS,
        CHART_COLORS,
        LOCALE,
        STORAGE_KEYS,
        APP_CONFIG,
    };
}
