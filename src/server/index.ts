import express, { Request, Response } from 'express';
import path from 'path';
import { PoolConnection } from './sql/connection';
import { getCharacterStat } from './routes/stats';
import { getMonsterTypesHandler } from './routes/monsters/getMonsterTypesHandler';
import { getMonstersHandler } from './routes/monsters/getMonstersHandler';
import { getStatsByTypeHandler } from './routes/stats/getStatsByTypeHandler';
import { getPowersByMonsterHandler } from './routes/stats/getPowersByMonsterHandler';
import { getMonsterOrganizationsHandler } from './routes/organizations/getMonsterOrganizationsHandler';
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

app.get('/api/organizations/:monster', getMonsterOrganizationsHandler);
app.get('/api/monsters', /* authorizeCharacterAccess, */ getMonstersHandler);
app.get('/api/monsters/:monster/type', /* authorizeCharacterAccess, */ getMonsterTypesHandler);
app.get('/api/stats/:type', /* authorizeCharacterAccess, */ getStatsByTypeHandler);
app.get('/api/stats/powers/:monster', /* authorizeCharacterAccess, */ getPowersByMonsterHandler);

app.get('/api/character/:id/stat/:statName', /* authorizeCharacterAccess, */ getCharacterStat);


app.use(express.static(path.join(__dirname, '../client')));

app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('API Documentation: http://localhost:3000/api-docs');
});