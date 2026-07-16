import { Request, Response } from 'express';
import { TemperatureConverter, TemperatureResult } from '../utils/temperature';

/**
 * @swagger
 * /convert:
 *   get:
 *     summary: Convert temperature between units
 *     description: Converts a temperature value from one unit to all three units (Celsius, Fahrenheit, Kelvin)
 *     tags:
 *       - Temperature
 *     parameters:
 *       - in: query
 *         name: celsius
 *         schema:
 *           type: number
 *         description: Temperature in Celsius
 *         required: false
 *       - in: query
 *         name: fahrenheit
 *         schema:
 *           type: number
 *         description: Temperature in Fahrenheit
 *         required: false
 *       - in: query
 *         name: kelvin
 *         schema:
 *           type: number
 *         description: Temperature in Kelvin
 *         required: false
 *     responses:
 *       200:
 *         description: Temperature conversion result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 input:
 *                   type: object
 *                   properties:
 *                     celsius:
 *                       type: number
 *                     fahrenheit:
 *                       type: number
 *                     kelvin:
 *                       type: number
 *                 result:
 *                   type: object
 *                   properties:
 *                     celsius:
 *                       type: number
 *                     fahrenheit:
 *                       type: number
 *                     kelvin:
 *                       type: number
 *       400:
 *         description: Invalid input or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 examples:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export function convertHandler(req: Request, res: Response) {
  try {
    const { celsius, fahrenheit, kelvin } = req.query;

    // Check for array-valued parameters (duplicate keys like ?celsius=20&celsius=21)
    const params = { celsius, fahrenheit, kelvin };
    const arrayParam = Object.entries(params).find(([_, value]) => Array.isArray(value));
    if (arrayParam) {
      return res.status(400).json({
        error: `Duplicate parameter '${arrayParam[0]}' is not allowed. Please provide each parameter only once.`
      });
    }

    // Count how many parameters are provided
    const providedParams = [celsius, fahrenheit, kelvin].filter(p => p !== undefined).length;
    
    // Validate that exactly one parameter is provided
    if (providedParams === 0) {
      return res.status(400).json({
        error: 'Please provide exactly one temperature parameter: celsius, fahrenheit, or kelvin',
        examples: [
          '/convert?celsius=20',
          '/convert?fahrenheit=300',
          '/convert?kelvin=100'
        ]
      });
    }
    
    if (providedParams > 1) {
      return res.status(400).json({
        error: 'Please provide exactly one temperature parameter. Multiple parameters are not allowed.'
      });
    }

    // Check which parameter is provided
    if (celsius !== undefined) {
      const value = parseFloat(celsius as string);
      if (isNaN(value)) {
        return res.status(400).json({
          error: 'Invalid celsius value. Must be a number.'
        });
      }
      const result = TemperatureConverter.convertTemperature(value, 'celsius');
      return res.json({
        input: {
          celsius: value
        },
        result
      });
    }

    if (fahrenheit !== undefined) {
      const value = parseFloat(fahrenheit as string);
      if (isNaN(value)) {
        return res.status(400).json({
          error: 'Invalid fahrenheit value. Must be a number.'
        });
      }
      const result = TemperatureConverter.convertTemperature(value, 'fahrenheit');
      return res.json({
        input: {
          fahrenheit: value
        },
        result
      });
    }

    if (kelvin !== undefined) {
      const value = parseFloat(kelvin as string);
      if (isNaN(value)) {
        return res.status(400).json({
          error: 'Invalid kelvin value. Must be a number.'
        });
      }
      const result = TemperatureConverter.convertTemperature(value, 'kelvin');
      return res.json({
        input: {
          kelvin: value
        },
        result
      });
    }

    // This should never be reached due to the validation above, but included for safety
    return res.status(400).json({
      error: 'No valid temperature parameter provided'
    });
  } catch (error) {
    console.error('Conversion error:', error);
    if (error instanceof Error && error.message.includes('below absolute zero')) {
      return res.status(400).json({
        error: error.message
      });
    }
    return res.status(500).json({
      error: 'Internal server error during temperature conversion'
    });
  }
}
