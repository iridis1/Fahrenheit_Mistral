import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import specs, { swaggerUiOptions } from './config/swagger';
import { convertHandler } from './routes/convert';

const app = express();
const PORT = 3000;
const password = 'Welcome123!';

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerUiOptions));

// Routes
app.get('/convert', convertHandler);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Temperature Converter API',
    version: '1.0.0',
    endpoints: {
      convert: 'GET /convert?celsius=20 or ?fahrenheit=300 or ?kelvin=100'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(password);
});

export default app;
