import '../constants/tax_constants.dart';
import '../models/tax_bracket.dart';
import '../models/calculation_history.dart';
import '../services/tax_calculator.dart';

/// State management for tax calculation
/// Uses ChangeNotifier for Provider pattern
class TaxState extends ChangeNotifier {
  // Income type selection
  bool _hasSalary = true;
  bool _hasFreelance = false;
  bool _hasMerchant = false;

  // Income inputs
  double _salary = TaxConstants.defaultSalary;
  double _freelance = 0;
  double _merchant = 0;

  // ===== Allowance inputs =====
  // ส่วนตัว & ครอบครัว
  final double _personalAllowance = TaxConstants.personalAllowance;
  double _spouseAllowance = 0;
  int _childCount = 0;
  int _childBorn2018Count = 0;
  int _parentCount = 0;

  // ประกัน & กองทุน
  double _lifeInsurance = 0;
  double _healthInsurance = 0;
  double _socialSecurity = 0;
  double _pvd = 0;
  double _rmf = 0;
  double _ssf = 0;

  // ที่อยู่อาศัย
  double _homeLoanInterest = 0;

  // Getters for income type selection
  bool get hasSalary => _hasSalary;
  bool get hasFreelance => _hasFreelance;
  bool get hasMerchant => _hasMerchant;
  bool get hasAnyIncomeType => _hasSalary || _hasFreelance || _hasMerchant;

  // Getters for inputs
  double get salary => _salary;
  double get freelance => _freelance;
  double get merchant => _merchant;

  // Getters for allowances
  double get personalAllowance => _personalAllowance;
  double get spouseAllowance => _spouseAllowance;
  int get childCount => _childCount;
  int get childBorn2018Count => _childBorn2018Count;
  int get parentCount => _parentCount;
  double get lifeInsurance => _lifeInsurance;
  double get healthInsurance => _healthInsurance;
  double get socialSecurity => _socialSecurity;
  double get pvd => _pvd;
  double get rmf => _rmf;
  double get ssf => _ssf;
  double get homeLoanInterest => _homeLoanInterest;

  // Computed: Category totals
  double get personalCategoryTotal =>
      _personalAllowance +
      _spouseAllowance +
      (_childCount * TaxConstants.childAllowanceOld) +
      (_childBorn2018Count * TaxConstants.childAllowanceNew) +
      (_parentCount * TaxConstants.parentAllowance);

  double get insuranceCategoryTotal =>
      _lifeInsurance +
      _healthInsurance +
      _socialSecurity +
      _pvd +
      _rmf +
      _ssf;

  double get homeCategoryTotal => _homeLoanInterest;

  // Computed: Total allowance
  double get allowance =>
      personalCategoryTotal + insuranceCategoryTotal + homeCategoryTotal;

  // Computed: Total income
  double get totalIncome => _salary + _freelance + _merchant;

  // Computed: Expense deduction
  double get expense => TaxCalculator.calculateExpense(
        salary: _salary,
        freelance: _freelance,
        merchant: _merchant,
      );

  // Computed: Expense breakdown
  double get expense40_1_2 =>
      ((_salary + _freelance) * TaxConstants.salaryExpenseRate)
          .clamp(0.0, TaxConstants.maxSalaryExpense);
