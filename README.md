# Temperature Converter API

A simple REST API for converting temperatures between Celsius, Fahrenheit, and Kelvin. Built with Express and TypeScript.

## Features

- Convert between Celsius, Fahrenheit, and Kelvin
- RESTful API endpoint
- Input validation
- Comprehensive error handling
- CORS support

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/temperature-converter.git
   cd temperature-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

Run the development server with hot reload:
```bash
npm run dev
```

### Production

Build the TypeScript code and run the production server:
```bash
npm run build
npm start
```

## API Documentation

### GET /convert

Converts a temperature value from one unit to all three units (Celsius, Fahrenheit, Kelvin).

#### Query Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| celsius | number | Temperature in Celsius | One of these |
| fahrenheit | number | Temperature in Fahrenheit | One of these |
| kelvin | number | Temperature in Kelvin | One of these |

#### Example Requests

```
GET /convert?celsius=20
GET /convert?fahrenheit=300
GET /convert?kelvin=100
```

#### Example Response

```json
{
  "input": {
    "celsius": 20
  },
  "result": {
    "celsius": 20,
    "fahrenheit": 68,
    "kelvin": 293.15
  }
}
```

#### Error Responses

- **400 Bad Request**: No valid parameter provided or invalid number format
  ```json
  {
    "error": "Please provide one of the following query parameters: celsius, fahrenheit, or kelvin",
    "examples": ["/convert?celsius=20", "/convert?fahrenheit=300", "/convert?kelvin=100"]
  }
  ```

- **500 Internal Server Error**: Conversion error
  ```json
  {
    "error": "Internal server error during temperature conversion"
  }
  ```

## Conversion Formulas

| From \ To | Celsius | Fahrenheit | Kelvin |
|-----------|---------|------------|--------|
| **Celsius** | - | F = C × 9/5 + 32 | K = C + 273.15 |
| **Fahrenheit** | C = (F - 32) × 5/9 | - | K = (F - 32) × 5/9 + 273.15 |
| **Kelvin** | C = K - 273.15 | F = (K - 273.15) × 9/5 + 32 | - |

## Project Structure

```
temperature-converter/
├── src/
│   ├── routes/
│   │   └── convert.ts      # API route handler
│   ├── utils/
│   │   └── temperature.ts  # Conversion logic
│   └── app.ts              # Express application
├── dist/                   # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the production server |
| `npm run dev` | Run the development server with hot reload |
| `npm test` | Run tests (not configured) |

## Dependencies

- **express** ^4.18.2 - Web framework
- **cors** ^2.8.5 - CORS middleware
- **typescript** ^5.1.6 - TypeScript compiler
- **@types/express** ^4.17.17 - TypeScript types for Express
- **@types/cors** ^2.8.13 - TypeScript types for CORS
- **@types/node** ^20.4.10 - TypeScript types for Node.js
- **ts-node** ^10.9.1 - TypeScript execution engine

## License

MIT
