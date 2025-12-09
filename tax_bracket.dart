/// Tax bracket data model for Thai personal income tax
class TaxBracket {
  final double minNetIncome;
  final double maxNetIncome;
  final double taxRate;

  const TaxBracket({
    required this.minNetIncome,
    required this.maxNetIncome,
    required this.taxRate,
  });

  /// Calculate tax amount for income within this bracket
  double calculateTax(double income) {
    final incomeInBracket = income.clamp(0.0, maxNetIncome - minNetIncome);
    return incomeInBracket * taxRate;
  }

  /// Human-readable percentage string
  String get ratePercentage => '${(taxRate * 100).toInt()}%';
}

/// Thai personal income tax brackets for 2024
const List<TaxBracket> thaiTaxBrackets = [
  TaxBracket(minNetIncome: 0, maxNetIncome: 150000, taxRate: 0),
  TaxBracket(minNetIncome: 150000, maxNetIncome: 300000, taxRate: 0.05),
  TaxBracket(minNetIncome: 300000, maxNetIncome: 500000, taxRate: 0.10),
  TaxBracket(minNetIncome: 500000, maxNetIncome: 750000, taxRate: 0.15),
  TaxBracket(minNetIncome: 750000, maxNetIncome: 1000000, taxRate: 0.20),
  TaxBracket(minNetIncome: 1000000, maxNetIncome: 2000000, taxRate: 0.25),
  TaxBracket(minNetIncome: 2000000, maxNetIncome: 5000000, taxRate: 0.30),
  TaxBracket(minNetIncome: 5000000, maxNetIncome: double.infinity, taxRate: 0.35),
];
