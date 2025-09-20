import express, { Request, Response } from 'express';
import { PoolConnection } from './sql/connection';
import { getCharacterStat } from './routes/stats';
import { getMonsterTypesHandler } from './routes/monsters/getMonsterTypesHandler';
import { getStatsByTypeHandler } from './routes/stats/getStatsByTypeHandler';
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

app.get('/api/monsters/:monster/type', /* authorizeCharacterAccess, */ getMonsterTypesHandler);

app.get('/api/stats/:type', /* authorizeCharacterAccess, */ getStatsByTypeHandler);


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API Documentation: http://localhost:3000/api-docs');
});