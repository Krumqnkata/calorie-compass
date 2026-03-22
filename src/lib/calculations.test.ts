import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateBodyFat,
  calculateTDEE,
  convertImperialToMetric,
  calculateBMI,
  calculateIdealWeightRange,
} from "./calculations";

describe("Calculations", () => {
  describe("BMR (Mifflin-St Jeor)", () => {
    it("calculates correctly for males", () => {
      // 10*100 + 6.25*180 - 5*30 + 5 = 1000 + 1125 - 150 + 5 = 1980
      expect(calculateBMR("male", 100, 180, 30)).toBeCloseTo(1980);
    });

    it("calculates correctly for females", () => {
      // 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25
      expect(calculateBMR("female", 60, 165, 30)).toBeCloseTo(1320.25);
    });
  });

  describe("Body Fat (Navy Method)", () => {
    it("calculates correctly for males", () => {
      // H: 180, W: 90, N: 40
      const bf = calculateBodyFat("male", 40, 90, 0, 180);
      expect(bf).toBeGreaterThan(0);
      expect(bf).toBeLessThan(100);
      // Validated manually ~18.35%
      expect(bf).toBeCloseTo(18.3, 0); 
    });

    it("calculates correctly for females", () => {
      // H: 165, W: 70, Hip: 100, N: 35
      // 495 / (1.29579 - 0.35004 * log10(70 + 100 - 35) + 0.22100 * log10(165)) - 450
      const bf = calculateBodyFat("female", 35, 70, 100, 165);
      expect(bf).toBeGreaterThan(0);
      expect(bf).toBeLessThan(100);
    });

    it("returns 0 for invalid inputs", () => {
      expect(calculateBodyFat("male", 0, 90, 0, 180)).toBe(0);
      expect(calculateBodyFat("male", 40, 90, 0, 0)).toBe(0);
    });
  });

  describe("TDEE", () => {
    it("applies multiplier correctly", () => {
      expect(calculateTDEE(2000, 1.2)).toBeCloseTo(2400);
      expect(calculateTDEE(2000, 1.55)).toBeCloseTo(3100);
    });
  });

  describe("Utilities", () => {
    it("converts imperial to metric correctly", () => {
      const { weightKg, heightCm } = convertImperialToMetric(150, 5, 10);
      // 150 lbs = 68.0389 kg
      // 5'10" = 70 in = 177.8 cm
      expect(weightKg).toBeCloseTo(68.0389);
      expect(heightCm).toBeCloseTo(177.8);
    });

    it("calculates BMI correctly", () => {
      // 70kg, 175cm -> 70 / (1.75^2) = 22.857
      expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 1);
    });

    it("calculates ideal weight range", () => {
      // 175cm = 1.75m
      // Min: 18.5 * 1.75^2 = 56.65
      // Max: 24.9 * 1.75^2 = 76.25
      const range = calculateIdealWeightRange(175);
      expect(range.min).toBe(57); // Rounding check
      expect(range.max).toBe(76);
    });
  });
});
