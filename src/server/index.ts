import express, { Request, Response } from 'express';
import { PoolConnection } from './sql/connection';
import { getCharacterStat } from './routes/characters';
import { getMonstersHandler } from './routes/monsters/getMonstersHandler';
import { swaggerConfig } from './swagger';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(express.json());

const swaggerSpec = swaggerJsdoc(swaggerConfig);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'TTRPG API Documentation'
}));

app.get('/api/character/:id/stat/:statName', /* authorizeCharacterAccess, */ getCharacterStat);

app.get('/api/monsters/:monster/class', /* authorizeCharacterAccess, */ getMonstersHandler);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API Documentation: http://localhost:3000/api-docs');
});