import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'providers/tax_state.dart';
import 'providers/business_provider.dart';
import 'providers/report_provider.dart';
import 'providers/contact_provider.dart';
import 'providers/debt_provider.dart';
import 'theme/app_theme.dart';
import 'screens/cover_screen.dart';
import 'screens/calculator_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('th', null);
  runApp(const HowToTaxApp());
}

class HowToTaxApp extends StatelessWidget {
  const HowToTaxApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => TaxState()),
        ChangeNotifierProvider(create: (_) => BusinessProvider()),
        ChangeNotifierProvider(create: (_) => ReportProvider()),
        ChangeNotifierProvider(create: (_) => ContactProvider()),
        ChangeNotifierProvider(create: (_) => DebtProvider()),
      ],
      child: MaterialApp(
        title: 'ภาษีเรื่องง่าย',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const AppNavigator(),
      ),
    );
  }
}

/// Main navigation controller
/// Handles transition between cover and calculator screens
class AppNavigator extends StatefulWidget {
  const AppNavigator({super.key});

  @override
  State<AppNavigator> createState() => _AppNavigatorState();
}

class _AppNavigatorState extends State<AppNavigator> {
  bool _showCalculator = false;

  void _startCalculator() {
    setState(() {
      _showCalculator = true;
    });
  }

  void _goBack() {
    setState(() {
      _showCalculator = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: AppTheme.animationDuration,
      transitionBuilder: (child, animation) {
        return FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, 0.1),
              end: Offset.zero,
            ).animate(CurvedAnimation(
              parent: animation,
              curve: Curves.easeOut,
            )),
            child: child,
          ),
        );
      },
      child: _showCalculator
          ? CalculatorScreen(
              key: const ValueKey('calculator'),
              onBack: _goBack,
            )
          : CoverScreen(
              key: const ValueKey('cover'),
              onStart: _startCalculator,
            ),
    );
  }
}
