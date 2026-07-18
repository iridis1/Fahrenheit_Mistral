import request from 'supertest';
import app from '../app';

describe('Temperature Conversion API', () => {
  describe('GET /', () => {
    it('should return API info on root endpoint', async () => {
      const res = await request(app).get('/');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Temperature Converter API');
      expect(res.body).toHaveProperty('version', '1.0.0');
      expect(res.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /convert', () => {
    describe('Celsius conversions', () => {
      it('should convert celsius to all units', async () => {
        const res = await request(app).get('/convert?celsius=20');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ celsius: 20 });
        expect(res.body.result.celsius).toBe(20);
        expect(res.body.result.fahrenheit).toBe(68);
        expect(res.body.result.kelvin).toBe(293.15);
      });

      it('should handle negative celsius', async () => {
        const res = await request(app).get('/convert?celsius=-10');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ celsius: -10 });
        expect(res.body.result.celsius).toBe(-10);
        expect(res.body.result.fahrenheit).toBe(14);
        expect(res.body.result.kelvin).toBe(263.15);
      });

      it('should handle decimal celsius', async () => {
        const res = await request(app).get('/convert?celsius=25.5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ celsius: 25.5 });
        expect(res.body.result.celsius).toBe(25.5);
        expect(res.body.result.fahrenheit).toBeCloseTo(77.9);
        expect(res.body.result.kelvin).toBeCloseTo(298.65);
      });

      it('should return 400 for invalid celsius', async () => {
        const res = await request(app).get('/convert?celsius=invalid');
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid celsius value. Must be a number.');
      });

      it('should accept absolute zero in celsius (-273.15)', async () => {
        const res = await request(app).get('/convert?celsius=-273.15');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.result.kelvin).toBe(0);
        expect(res.body.result.celsius).toBe(-273.15);
      });

      it('should reject celsius below absolute zero', async () => {
        const res = await request(app).get('/convert?celsius=-274');
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('below absolute zero');
      });
    });

    describe('Fahrenheit conversions', () => {
      it('should convert fahrenheit to all units', async () => {
        const res = await request(app).get('/convert?fahrenheit=32');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ fahrenheit: 32 });
        expect(res.body.result.celsius).toBe(0);
        expect(res.body.result.fahrenheit).toBe(32);
        expect(res.body.result.kelvin).toBe(273.15);
      });

      it('should handle negative fahrenheit', async () => {
        const res = await request(app).get('/convert?fahrenheit=-4');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ fahrenheit: -4 });
        expect(res.body.result.celsius).toBe(-20);
        expect(res.body.result.fahrenheit).toBe(-4);
      });

      it('should handle decimal fahrenheit', async () => {
        const res = await request(app).get('/convert?fahrenheit=68.5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ fahrenheit: 68.5 });
        expect(res.body.result.celsius).toBeCloseTo(20.28);
      });

      it('should return 400 for invalid fahrenheit', async () => {
        const res = await request(app).get('/convert?fahrenheit=not-a-number');
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid fahrenheit value. Must be a number.');
      });

      it('should accept absolute zero in fahrenheit (-459.67)', async () => {
        const res = await request(app).get('/convert?fahrenheit=-459.67');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.result.kelvin).toBe(0);
      });

      it('should reject fahrenheit below absolute zero', async () => {
        const res = await request(app).get('/convert?fahrenheit=-460');
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('below absolute zero');
      });
    });

    describe('Kelvin conversions', () => {
      it('should convert kelvin to all units', async () => {
        const res = await request(app).get('/convert?kelvin=273.15');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ kelvin: 273.15 });
        expect(res.body.result.celsius).toBe(0);
        expect(res.body.result.fahrenheit).toBe(32);
        expect(res.body.result.kelvin).toBe(273.15);
      });

      it('should handle decimal kelvin', async () => {
        const res = await request(app).get('/convert?kelvin=300.5');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.input).toEqual({ kelvin: 300.5 });
        expect(res.body.result.kelvin).toBe(300.5);
        expect(res.body.result.celsius).toBeCloseTo(27.35);
      });

      it('should return 400 for invalid kelvin', async () => {
        const res = await request(app).get('/convert?kelvin=abc');
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Invalid kelvin value. Must be a number.');
      });

      it('should accept absolute zero (0 K)', async () => {
        const res = await request(app).get('/convert?kelvin=0');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.result.kelvin).toBe(0);
        expect(res.body.result.celsius).toBe(-273.15);
        expect(res.body.result.fahrenheit).toBeCloseTo(-459.67);
      });

      it('should reject kelvin below absolute zero', async () => {
        const res = await request(app).get('/convert?kelvin=-1');
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain('below absolute zero');
      });
    });

    describe('Error handling', () => {
      it('should return 400 for missing parameters', async () => {
        const res = await request(app).get('/convert');
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('Please provide exactly one temperature parameter');
        expect(res.body).toHaveProperty('examples');
      });

      it('should return 400 for multiple parameters', async () => {
        const res = await request(app).get('/convert?celsius=20&fahrenheit=32');
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain('Multiple parameters are not allowed');
      });

      it('should return 400 for duplicate parameter key', async () => {
        const res = await request(app).get('/convert?celsius=20&celsius=21');
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toContain("Duplicate parameter 'celsius' is not allowed");
      });
    });
  });

  describe('Swagger documentation', () => {
    it('should serve Swagger UI', async () => {
      const res = await request(app).get('/api-docs/');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toMatch(/html/);
      expect(res.text).toMatch(/swagger/);
      expect(res.text).toMatch(/Temperature Converter API/);
    });
  });
});
