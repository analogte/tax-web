import '../models/tax_bracket.dart';

/// Tax calculation service for Thai Personal Income Tax
/// Implements progressive tax bracket calculation
class TaxCalculator {
  TaxCalculator._(); // Private constructor

  /// Calculate net income (เงินได้สุทธิ)
  /// Net Income = Income - Expense - Allowance
  static double calculateNetIncome({
    required double income,
    required double expense,
    required double allowance,
  }) {
    return (income - expense - allowance).clamp(0, double.infinity);
  }

  /// Calculate expense deduction (ค่าใช้จ่าย)
  /// - Salary + Freelance (40(1)(2)): 50% (max 100,000)
  /// - Merchant (40(8)): 60%
  static double calculateExpense({
    required double salary,
    required double freelance,
    required double merchant,
  }) {
    // 40(1)(2) - Salary & Freelance: 50% capped at 100,000
    final expense40_1_2 = ((salary + freelance) * TaxConstants.salaryExpenseRate)
        .clamp(0.0, TaxConstants.maxSalaryExpense);

    // 40(8) - Merchant: 60%
    final expense40_8 = merchant * TaxConstants.merchantExpenseRate;

    return expense40_1_2 + expense40_8;
  }

  /// Calculate expense breakdown for display
  static ExpenseBreakdown calculateExpenseBreakdown({
    required double salary,
    required double freelance,
    required double merchant,
  }) {
    final expense40_1_2 = ((salary + freelance) * TaxConstants.salaryExpenseRate)
        .clamp(0.0, TaxConstants.maxSalaryExpense);
    final expense40_8 = merchant * TaxConstants.merchantExpenseRate;

    return ExpenseBreakdown(
      salaryExpense: expense40_1_2,
      merchantExpense: expense40_8,
      total: expense40_1_2 + expense40_8,
    );
  }

  /// Calculate total tax based on net income and tax brackets
  /// Uses progressive tax calculation
  static double calculateTax({
    required double netIncome,
    List<TaxBracket> brackets = thaiTaxBrackets,
  }) {
    double sumTax = 0;
    double remainingIncome = netIncome;

    for (final bracket in brackets) {
      if (remainingIncome <= 0) break;

      final bracketRange = bracket.maxNetIncome - bracket.minNetIncome;
      final incomeInBracket = remainingIncome.clamp(0.0, bracketRange);
      sumTax += incomeInBracket * bracket.taxRate;
      remainingIncome -= bracketRange;
    }

    return sumTax;
  }

  /// Calculate tax with detailed breakdown per bracket
  static TaxBreakdown calculateTaxBreakdown({
    required double netIncome,
    List<TaxBracket> brackets = thaiTaxBrackets,
  }) {
    final List<BracketTax> bracketTaxes = [];
    double remainingIncome = netIncome;
    double totalTax = 0;

    for (final bracket in brackets) {
      if (remainingIncome <= 0) break;

      final bracketRange = bracket.maxNetIncome - bracket.minNetIncome;
      final incomeInBracket = remainingIncome.clamp(0.0, bracketRange);
      final taxForBracket = incomeInBracket * bracket.taxRate;

      if (incomeInBracket > 0) {
        bracketTaxes.add(BracketTax(
          bracket: bracket,
          incomeInBracket: incomeInBracket,
          tax: taxForBracket,
        ));
      }

      totalTax += taxForBracket;
      remainingIncome -= bracketRange;