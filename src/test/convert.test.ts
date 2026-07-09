import { Request, Response } from 'express';
import { convertHandler } from '../routes/convert';

// Mock the Response object
const createMockResponse = () => {
  const res: Partial<Response> = {
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

// Mock the Request object with query parameters
const createMockRequest = (query: Record<string, string | number | boolean | undefined>): Request => {
  return {
    query,
  } as unknown as Request;
};

describe('Convert Route Handler', () => {
  let mockRes: Response;

  beforeEach(() => {
    mockRes = createMockResponse();
    jest.clearAllMocks();
  });

  describe('GET /convert with celsius parameter', () => {
    it('should convert celsius to all units', () => {
      const mockReq = createMockRequest({ celsius: '20' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: {
          celsius: 20,
        },
        result: expect.objectContaining({
          celsius: 20,
          fahrenheit: expect.any(Number),
          kelvin: expect.any(Number),
        }),
      });
    });

    it('should return 400 for invalid celsius value', () => {
      const mockReq = createMockRequest({ celsius: 'invalid' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid celsius value. Must be a number.',
      });
    });

    it('should return 400 for missing parameters', () => {
      const mockReq = createMockRequest({});
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Please provide one of the following query parameters: celsius, fahrenheit, or kelvin',
        examples: [
          '/convert?celsius=20',
          '/convert?fahrenheit=300',
          '/convert?kelvin=100',
        ],
      });
    });
  });

  describe('GET /convert with fahrenheit parameter', () => {
    it('should convert fahrenheit to all units', () => {
      const mockReq = createMockRequest({ fahrenheit: '32' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: {
          fahrenheit: 32,
        },
        result: expect.objectContaining({
          celsius: 0,
          fahrenheit: 32,
          kelvin: 273.15,
        }),
      });
    });

    it('should return 400 for invalid fahrenheit value', () => {
      const mockReq = createMockRequest({ fahrenheit: 'not-a-number' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid fahrenheit value. Must be a number.',
      });
    });
  });

  describe('GET /convert with kelvin parameter', () => {
    it('should convert kelvin to all units', () => {
      const mockReq = createMockRequest({ kelvin: '273.15' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: {
          kelvin: 273.15,
        },
        result: expect.objectContaining({
          celsius: 0,
          fahrenheit: 32,
          kelvin: 273.15,
        }),
      });
    });

    it('should return 400 for invalid kelvin value', () => {
      const mockReq = createMockRequest({ kelvin: 'abc' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid kelvin value. Must be a number.',
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle negative temperatures', () => {
      const mockReq = createMockRequest({ celsius: '-10' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: {
          celsius: -10,
        },
        result: expect.objectContaining({
          celsius: -10,
          fahrenheit: 14,
          kelvin: 263.15,
        }),
      });
    });

    it('should handle decimal values', () => {
      const mockReq = createMockRequest({ celsius: '25.5' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: {
          celsius: 25.5,
        },
        result: expect.objectContaining({
          celsius: 25.5,
          fahrenheit: expect.any(Number),
          kelvin: expect.any(Number),
        }),
      });
    });

    it('should handle zero values', () => {
      const mockReq = createMockRequest({ celsius: '0' });
      convertHandler(mockReq, mockRes);

      expect(mockRes.status).not.toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        input: {
          celsius: 0,
        },
        result: expect.objectContaining({
          celsius: 0,
          fahrenheit: 32,
          kelvin: 273.15,
        }),
      });
    });
  });

  describe('Error handling', () => {
    it('should handle unexpected errors', () => {
      const mockReq = createMockRequest({ celsius: '20' });
      
      // Mock console.error to suppress error output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      convertHandler(mockReq, mockRes);

      consoleSpy.mockRestore();
    });
  });
});
