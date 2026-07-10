/**
 * Temperature conversion utilities
 */

export interface TemperatureResult {
  celsius: number;
  fahrenheit: number;
  kelvin: number;
}

/**
 * TemperatureConverter provides static methods for converting between
 * Celsius, Fahrenheit, and Kelvin temperature units.
 */
export class TemperatureConverter {
  // Constants for temperature conversion
  private static readonly ABSOLUTE_ZERO_KELVIN = 0;
  private static readonly ABSOLUTE_ZERO_CELSIUS = -273.15;
  private static readonly ABSOLUTE_ZERO_FAHRENHEIT = -459.67;
  private static readonly KELVIN_OFFSET = -1 * this.ABSOLUTE_ZERO_CELSIUS;
  private static readonly FAHRENHEIT_OFFSET = 32;
  /**
   * Convert Celsius to Fahrenheit
   * Formula: F = C * 9/5 + 32
   */
  public static celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9) / 5 + this.FAHRENHEIT_OFFSET;
  }

  /**
   * Convert Celsius to Kelvin
   * Formula: K = C + 273.15
   */
  public static celsiusToKelvin(celsius: number): number {
    return celsius + this.KELVIN_OFFSET;
  }

  /**
   * Convert Fahrenheit to Celsius
   * Formula: C = (F - 32) * 5/9
   */
  public static fahrenheitToCelsius(fahrenheit: number): number {
    return ((fahrenheit - this.FAHRENHEIT_OFFSET) * 5) / 9;
  }

  /**
   * Convert Fahrenheit to Kelvin
   * Formula: K = (F - 32) * 5/9 + 273.15
   */
  public static fahrenheitToKelvin(fahrenheit: number): number {
    return ((fahrenheit - this.FAHRENHEIT_OFFSET) * 5) / 9 + this.KELVIN_OFFSET;
  }

  /**
   * Convert Kelvin to Celsius
   * Formula: C = K - 273.15
   */
  public static kelvinToCelsius(kelvin: number): number {
    return kelvin - this.KELVIN_OFFSET;
  }

  /**
   * Convert Kelvin to Fahrenheit
   * Formula: F = (K - 273.15) * 9/5 + 32
   */
  public static kelvinToFahrenheit(kelvin: number): number {
    return ((kelvin - this.KELVIN_OFFSET) * 9) / 5 + this.FAHRENHEIT_OFFSET;
  }

  /**
   * Convert from any temperature unit to all units
   * @throws Error if temperature is below absolute zero (0 K)
   */
  public static convertTemperature(
    value: number,
    fromUnit: 'celsius' | 'fahrenheit' | 'kelvin'
  ): TemperatureResult {
    let celsius: number;
    let fahrenheit: number;
    let kelvin: number;

    switch (fromUnit) {
      case 'celsius':
        celsius = value;
        fahrenheit = this.celsiusToFahrenheit(celsius);
        kelvin = this.celsiusToKelvin(celsius);
        break;
      case 'fahrenheit':
        fahrenheit = value;
        celsius = this.fahrenheitToCelsius(fahrenheit);
        kelvin = this.fahrenheitToKelvin(fahrenheit);
        break;
      case 'kelvin':
        kelvin = value;
        celsius = this.kelvinToCelsius(kelvin);
        fahrenheit = this.kelvinToFahrenheit(kelvin);
        break;
      default:
        throw new Error(`Unknown temperature unit: ${fromUnit}`);
    }

    // Validate temperature is not below absolute zero (0 K)
    if (kelvin < this.ABSOLUTE_ZERO_KELVIN) {
      const minValues = {
        kelvin: '0 K',
        celsius: `${this.ABSOLUTE_ZERO_CELSIUS}°C`,
        fahrenheit: `${this.ABSOLUTE_ZERO_FAHRENHEIT}°F`,
      };
      throw new Error(
        `Temperature below absolute zero (0 K). Minimum allowed: ${minValues[fromUnit]}`
      );
    }

    // Round to 2 decimal places for cleaner output
    return {
      celsius: Math.round(celsius * 100) / 100,
      fahrenheit: Math.round(fahrenheit * 100) / 100,
      kelvin: Math.round(kelvin * 100) / 100,
    };
  }
}

