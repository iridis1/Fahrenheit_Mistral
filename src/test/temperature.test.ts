import {
  celsiusToFahrenheit,
  celsiusToKelvin,
  fahrenheitToCelsius,
  fahrenheitToKelvin,
  kelvinToCelsius,
  kelvinToFahrenheit,
  convertTemperature
} from '../utils/temperature';

describe('Temperature Conversion Utilities', () => {
  describe('celsiusToFahrenheit', () => {
    it('should convert 0°C to 32°F (freezing point of water)', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('should convert 100°C to 212°F (boiling point of water)', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('should convert -40°C to -40°F (where both scales meet)', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40);
    });

    it('should convert 37°C to 98.6°F (human body temperature)', () => {
      expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6);
    });
  });

  describe('celsiusToKelvin', () => {
    it('should convert 0°C to 273.15K', () => {
      expect(celsiusToKelvin(0)).toBe(273.15);
    });

    it('should convert -273.15°C to 0K (absolute zero)', () => {
      expect(celsiusToKelvin(-273.15)).toBe(0);
    });

    it('should convert 25°C to 298.15K', () => {
      expect(celsiusToKelvin(25)).toBe(298.15);
    });
  });

  describe('fahrenheitToCelsius', () => {
    it('should convert 32°F to 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('should convert 212°F to 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('should convert -40°F to -40°C', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
    });
  });

  describe('fahrenheitToKelvin', () => {
    it('should convert 32°F to 273.15K', () => {
      expect(fahrenheitToKelvin(32)).toBeCloseTo(273.15);
    });

    it('should convert 212°F to 373.15K', () => {
      expect(fahrenheitToKelvin(212)).toBeCloseTo(373.15);
    });
  });

  describe('kelvinToCelsius', () => {
    it('should convert 273.15K to 0°C', () => {
      expect(kelvinToCelsius(273.15)).toBe(0);
    });

    it('should convert 0K to -273.15°C (absolute zero)', () => {
      expect(kelvinToCelsius(0)).toBe(-273.15);
    });

    it('should convert 300K to 26.85°C', () => {
      expect(kelvinToCelsius(300)).toBeCloseTo(26.85);
    });
  });

  describe('kelvinToFahrenheit', () => {
    it('should convert 273.15K to 32°F', () => {
      expect(kelvinToFahrenheit(273.15)).toBeCloseTo(32);
    });

    it('should convert 373.15K to 212°F', () => {
      expect(kelvinToFahrenheit(373.15)).toBeCloseTo(212);
    });

    it('should convert 0K to -459.67°F (absolute zero)', () => {
      expect(kelvinToFahrenheit(0)).toBeCloseTo(-459.67);
    });
  });

  describe('convertTemperature', () => {
    it('should convert from celsius to all units', () => {
      const result = convertTemperature(0, 'celsius');
      expect(result.celsius).toBe(0);
      expect(result.fahrenheit).toBe(32);
      expect(result.kelvin).toBe(273.15);
    });

    it('should convert from fahrenheit to all units', () => {
      const result = convertTemperature(32, 'fahrenheit');
      expect(result.celsius).toBe(0);
      expect(result.fahrenheit).toBe(32);
      expect(result.kelvin).toBe(273.15);
    });

    it('should convert from kelvin to all units', () => {
      const result = convertTemperature(273.15, 'kelvin');
      expect(result.celsius).toBe(0);
      expect(result.fahrenheit).toBe(32);
      expect(result.kelvin).toBe(273.15);
    });

    it('should round to 2 decimal places', () => {
      const result = convertTemperature(100, 'celsius');
      // 100°C = 212°F exactly, but we want to verify the rounding works
      expect(result.celsius).toBe(100);
      expect(result.fahrenheit).toBe(212);
      expect(result.kelvin).toBe(373.15);
    });

    it('should handle negative temperatures', () => {
      const result = convertTemperature(-10, 'celsius');
      expect(result.celsius).toBe(-10);
      expect(result.fahrenheit).toBe(14);
      expect(result.kelvin).toBe(263.15);
    });

    it('should throw error for unknown unit', () => {
      expect(() => {
        convertTemperature(100, 'rankine' as any);
      }).toThrow('Unknown temperature unit: rankine');
    });

    it('should accept absolute zero (0 K)', () => {
      const result = convertTemperature(0, 'kelvin');
      expect(result.kelvin).toBe(0);
      expect(result.celsius).toBe(-273.15);
      expect(result.fahrenheit).toBeCloseTo(-459.67);
    });

    it('should accept absolute zero in celsius (-273.15°C)', () => {
      const result = convertTemperature(-273.15, 'celsius');
      expect(result.kelvin).toBe(0);
      expect(result.celsius).toBe(-273.15);
      expect(result.fahrenheit).toBeCloseTo(-459.67);
    });

    it('should accept absolute zero in fahrenheit (-459.67°F)', () => {
      const result = convertTemperature(-459.67, 'fahrenheit');
      expect(result.kelvin).toBe(0);
      expect(result.celsius).toBeCloseTo(-273.15);
      expect(result.fahrenheit).toBeCloseTo(-459.67);
    });

    it('should throw error for temperature below absolute zero (negative Kelvin)', () => {
      expect(() => {
        convertTemperature(-1, 'kelvin');
      }).toThrow('Temperature below absolute zero (0 K)');
    });

    it('should throw error for celsius below absolute zero (-273.16°C)', () => {
      expect(() => {
        convertTemperature(-273.16, 'celsius');
      }).toThrow('Temperature below absolute zero (0 K)');
    });

    it('should throw error for fahrenheit below absolute zero (-459.68°F)', () => {
      expect(() => {
        convertTemperature(-459.68, 'fahrenheit');
      }).toThrow('Temperature below absolute zero (0 K)');
    });
  });
});
