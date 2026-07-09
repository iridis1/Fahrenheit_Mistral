/**
 * Temperature conversion utilities
 */

interface TemperatureResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

/**
 * Convert Celsius to Fahrenheit
 * Formula: F = C * 9/5 + 32
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert Celsius to Kelvin
 * Formula: K = C + 273.15
 */
export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

/**
 * Convert Fahrenheit to Celsius
 * Formula: C = (F - 32) * 5/9
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Convert Fahrenheit to Kelvin
 * Formula: K = (F - 32) * 5/9 + 273.15
 */
export function fahrenheitToKelvin(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9 + 273.15;
}

/**
 * Convert Kelvin to Celsius
 * Formula: C = K - 273.15
 */
export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

/**
 * Convert Kelvin to Fahrenheit
 * Formula: F = (K - 273.15) * 9/5 + 32
 */
export function kelvinToFahrenheit(kelvin: number): number {
  return ((kelvin - 273.15) * 9) / 5 + 32;
}

/**
 * Convert from any temperature unit to all units
 */
export function convertTemperature(
  value: number,
  fromUnit: 'celsius' | 'fahrenheit' | 'kelvin'
): TemperatureResult {
  let celsius: number;
  let fahrenheit: number;
  let kelvin: number;

  switch (fromUnit) {
    case 'celsius':
      celsius = value;
      fahrenheit = celsiusToFahrenheit(celsius);
      kelvin = celsiusToKelvin(celsius);
      break;
    case 'fahrenheit':
      fahrenheit = value;
      celsius = fahrenheitToCelsius(fahrenheit);
      kelvin = fahrenheitToKelvin(fahrenheit);
      break;
    case 'kelvin':
      kelvin = value;
      celsius = kelvinToCelsius(kelvin);
      fahrenheit = kelvinToFahrenheit(kelvin);
      break;
    default:
      throw new Error(`Unknown temperature unit: ${fromUnit}`);
  }

  // Round to 2 decimal places for cleaner output
  return {
    celsius: Math.round(celsius * 100) / 100,
    fahrenheit: Math.round(fahrenheit * 100) / 100,
    kelvin: Math.round(kelvin * 100) / 100,
  };
}

export type { TemperatureResult };
