import express, { Request, Response } from 'express';
import path from 'path';
import { PoolConnection } from './sql/connection';
import { getCharacterStat } from './routes/stats';
import { getMonsterTypesHandler } from './routes/monsters/getMonsterTypesHandler';
import { getMonstersHandler } from './routes/monsters/getMonstersHandler';
import { getStatsByTypeHandler } from './routes/stats/getStatsByTypeHandler';
import { getPathVirtuesHandler } from './routes/stats/vampire/getPathVirtuesHandler';
import { getPowersByMonsterHandler } from './routes/stats/getPowersByMonsterHandler';
import { getMonsterOrganizationsHandler } from './routes/organizations/getMonsterOrganizationsHandler';
import { getVampireRitualsHandler } from './routes/stats/vampire/getVampireRitualsHandler';
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

app.get('/api/organizations/:monster', /* authorizeGeneralAccess, */ getMonsterOrganizationsHandler);
app.get('/api/monsters', /* authorizeGeneralAccess, */ getMonstersHandler);
app.get('/api/monsters/:monster/type', /* authorizeGeneralAccess, */ getMonsterTypesHandler);
app.get('/api/stats/:type', /* authorizeGeneralAccess, */ getStatsByTypeHandler);
app.get('/api/stats/powers/:monster', /* authorizeGeneralAccess, */ getPowersByMonsterHandler);
app.get('/api/stats/virtues/:path', /* authorizeGeneralAccess, */ getPathVirtuesHandler);
app.get('/api/stats/rituals/:path', /* authorizeGeneralAccess, */ getVampireRitualsHandler);
app.get('/api/character/:id/stat/:statName', /* authorizeGeneralAccess, */ getCharacterStat);


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