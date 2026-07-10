import { TemperatureConverter } from '../utils/temperature';

describe('Temperature Conversion Utilities', () => {
  describe('celsiusToFahrenheit', () => {
    it('should convert 0\u00B0C to 32\u00B0F (freezing point of water)', () => {
      expect(TemperatureConverter.celsiusToFahrenheit(0)).toBe(32);
    });


    it('should convert 37\u00B0C to 98.6\u00B0F (human body temperature)', () => {
      expect(TemperatureConverter.celsiusToFahrenheit(37)).toBeCloseTo(98.6);
    });

    it('should convert -5.5\u00B0C to 22.1\u00B0F (negative decimal input)', () => {
      expect(TemperatureConverter.celsiusToFahrenheit(-5.5)).toBeCloseTo(22.1);
    });
  });

  describe('celsiusToKelvin', () => {
    it('should convert 0\u00B0C to 273.15K', () => {
      expect(TemperatureConverter.celsiusToKelvin(0)).toBe(273.15);
    });

    it('should convert -273.15\u00B0C to 0K (absolute zero)', () => {
      expect(TemperatureConverter.celsiusToKelvin(-273.15)).toBe(0);
    });

    it('should convert 25\u00B0C to 298.15K', () => {
      expect(TemperatureConverter.celsiusToKelvin(25)).toBe(298.15);
    });
  });

  describe('fahrenheitToCelsius', () => {
    it('should convert 32\u00B0F to 0\u00B0C', () => {
      expect(TemperatureConverter.fahrenheitToCelsius(32)).toBe(0);
    });

    it('should convert -4\u00B0F to -20\u00B0C (negative input)', () => {
      expect(TemperatureConverter.fahrenheitToCelsius(-4)).toBe(-20);
    });

    it('should convert 68.5\u00B0F to 20.28\u00B0C (decimal input)', () => {
      expect(TemperatureConverter.fahrenheitToCelsius(68.5)).toBeCloseTo(20.28);
    });
  });

  describe('fahrenheitToKelvin', () => {
    it('should convert 32\u00B0F to 273.15K', () => {
      expect(TemperatureConverter.fahrenheitToKelvin(32)).toBeCloseTo(273.15);
    });

    it('should convert 212\u00B0F to 373.15K', () => {
      expect(TemperatureConverter.fahrenheitToKelvin(212)).toBeCloseTo(373.15);
    });

    it('should convert -40\u00B0F to 233.15K (negative input)', () => {
      expect(TemperatureConverter.fahrenheitToKelvin(-40)).toBeCloseTo(233.15);
    });
  });

  describe('kelvinToCelsius', () => {
    it('should convert 273.15K to 0\u00B0C', () => {
      expect(TemperatureConverter.kelvinToCelsius(273.15)).toBe(0);
    });

    it('should convert 0K to -273.15\u00B0C (absolute zero)', () => {
      expect(TemperatureConverter.kelvinToCelsius(0)).toBe(-273.15);
    });

    it('should convert 300K to 26.85\u00B0C', () => {
      expect(TemperatureConverter.kelvinToCelsius(300)).toBeCloseTo(26.85);
    });
  });

  describe('kelvinToFahrenheit', () => {
    it('should convert 273.15K to 32\u00B0F', () => {
      expect(TemperatureConverter.kelvinToFahrenheit(273.15)).toBeCloseTo(32);
    });

    it('should convert 373.15K to 212\u00B0F', () => {
      expect(TemperatureConverter.kelvinToFahrenheit(373.15)).toBeCloseTo(212);
    });

    it('should convert 0K to -459.67\u00B0F (absolute zero)', () => {
      expect(TemperatureConverter.kelvinToFahrenheit(0)).toBeCloseTo(-459.67);
    });
  });

  describe('convertTemperature', () => {
    it('should convert from celsius to all units', () => {
      const result = TemperatureConverter.convertTemperature(0, 'celsius');
      expect(result.celsius).toBe(0);
      expect(result.fahrenheit).toBe(32);
      expect(result.kelvin).toBe(273.15);
    });

    it('should convert from fahrenheit to all units', () => {
      const result = TemperatureConverter.convertTemperature(32, 'fahrenheit');
      expect(result.celsius).toBe(0);
      expect(result.fahrenheit).toBe(32);
      expect(result.kelvin).toBe(273.15);
    });

    it('should convert from kelvin to all units', () => {
      const result = TemperatureConverter.convertTemperature(273.15, 'kelvin');
      expect(result.celsius).toBe(0);
      expect(result.fahrenheit).toBe(32);
      expect(result.kelvin).toBe(273.15);
    });

    it('should round to 2 decimal places', () => {
      const result = TemperatureConverter.convertTemperature(100, 'celsius');
      expect(result.celsius).toBe(100);
      expect(result.fahrenheit).toBe(212);
      expect(result.kelvin).toBe(373.15);
    });

    it('should handle negative temperatures', () => {
      const result = TemperatureConverter.convertTemperature(-10, 'celsius');
      expect(result.celsius).toBe(-10);
      expect(result.fahrenheit).toBe(14);
      expect(result.kelvin).toBe(263.15);
    });

    it('should throw error for unknown unit', () => {
      expect(() => {
        TemperatureConverter.convertTemperature(100, 'rankine' as any);
      }).toThrow('Unknown temperature unit: rankine');
    });

    it('should accept absolute zero (0 K)', () => {
      const result = TemperatureConverter.convertTemperature(0, 'kelvin');
      expect(result.kelvin).toBe(0);
      expect(result.celsius).toBe(-273.15);
      expect(result.fahrenheit).toBeCloseTo(-459.67);
    });

    it('should accept absolute zero in celsius (-273.15\u00B0C)', () => {
      const result = TemperatureConverter.convertTemperature(-273.15, 'celsius');
      expect(result.kelvin).toBe(0);
      expect(result.celsius).toBe(-273.15);
      expect(result.fahrenheit).toBeCloseTo(-459.67);
    });

    it('should accept absolute zero in fahrenheit (-459.67\u00B0F)', () => {
      const result = TemperatureConverter.convertTemperature(-459.67, 'fahrenheit');
      expect(result.kelvin).toBe(0);
      expect(result.celsius).toBeCloseTo(-273.15);
      expect(result.fahrenheit).toBeCloseTo(-459.67);
    });

    it('should throw error for temperature below absolute zero (negative Kelvin)', () => {
      expect(() => {
        TemperatureConverter.convertTemperature(-1, 'kelvin');
      }).toThrow('Temperature below absolute zero (0 K)');
    });

    it('should throw error for celsius below absolute zero (-273.16\u00B0C)', () => {
      expect(() => {
        TemperatureConverter.convertTemperature(-273.16, 'celsius');
      }).toThrow('Temperature below absolute zero (0 K)');
    });

    it('should throw error for fahrenheit below absolute zero (-459.68\u00B0F)', () => {
      expect(() => {
        TemperatureConverter.convertTemperature(-459.68, 'fahrenheit');
      }).toThrow('Temperature below absolute zero (0 K)');
    });
  });
});
