import 'package:flutter/material.dart';

const brandGreen = Color(0xFF08752F);
const brandGold = Color(0xFFFFBD00);
const brandText = Color(0xFF202A24);
const brandMuted = Color(0xFF6E7B73);
const brandBorder = Color(0xFFDDE5DF);

ThemeData eleeTheme() => ThemeData(
  useMaterial3: true,
  fontFamily: 'NotoSans',
  colorScheme: ColorScheme.fromSeed(seedColor: brandGreen).copyWith(
    primary: brandGreen, secondary: brandGold, onPrimary: Colors.white,
    onSecondary: brandText, onSurface: brandText, surface: Colors.white,
    error: const Color(0xFFB42318), outline: brandBorder,
  ),
  scaffoldBackgroundColor: Colors.white,
  textTheme: ThemeData(fontFamily: 'NotoSans').textTheme.apply(bodyColor: brandText, displayColor: brandText),
  inputDecorationTheme: const InputDecorationTheme(
    hintStyle: TextStyle(color: brandMuted),
    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: brandBorder),borderRadius: BorderRadius.all(Radius.circular(8))),
    focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: brandGreen,width:2),borderRadius: BorderRadius.all(Radius.circular(8))),
  ),
);
