import { Request, Response } from 'express';
import { convertTemperature } from '../utils/temperature';

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

    // Check which parameter is provided
    if (celsius !== undefined) {
      const value = parseFloat(celsius as string);
      if (isNaN(value)) {
        return res.status(400).json({
          error: 'Invalid celsius value. Must be a number.'
        });
      }
      const result = convertTemperature(value, 'celsius');
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
      const result = convertTemperature(value, 'fahrenheit');
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
      const result = convertTemperature(value, 'kelvin');
      return res.json({
        input: {
          kelvin: value
        },
        result
      });
    }

    // No valid parameter provided
    return res.status(400).json({
      error: 'Please provide one of the following query parameters: celsius, fahrenheit, or kelvin',
      examples: [
        '/convert?celsius=20',
        '/convert?fahrenheit=300',
        '/convert?kelvin=100'
      ]
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
