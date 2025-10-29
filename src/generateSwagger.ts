import fs from 'fs';
import yaml from 'js-yaml';
import {
  badRequestError400,
  notFoundError404,
  generalServerError500
} from './server/docs/common';
import { MonsterTemplates } from './server/routes/monsters/types';
import { getMonsters } from './server/routes/monsters/api-docs/getMonsters';
import { getMonstersByType } from './server/routes/monsters/api-docs/getMonstersByType';
import { getStatsByType } from './server/routes/stats/api-docs/getStatsByType';
import { getVampireRituals } from './server/routes/stats/api-docs/getVampireRituals';

const generateOpenAPISpec = () => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'WOD API',
      version: '1.0.0'
    },
    components: {
      schemas: {
        ApiErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'integer',
              description: 'Error code'
            }
          }
        },
        ApiSuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Request completed successfully'
            }
          }
        }
      }
    },
    paths: {
      '/api/monsters': getMonsters,
      '/api/monsters/{monster}/type': getMonstersByType,
    '/api/stats/{type}/': {
      ...getStatsByType,
      get: {
        ...getStatsByType.get,
        responses: {
          ...getStatsByType.get.responses,
        400: badRequestError400,
        404: notFoundError404,
        500: generalServerError500
        }
      }
    },
    '/api/stats/rituals/{path}': getVampireRituals
    // '/api/organizations/{monster}': {},
    // '/api/stats/:type': {},
    // '/api/stats/powers/:monster': {},
    // '/api/stats/virtues/:path': {},
    // '/api/character/:id/stat/:statName': {}
  }
}

  const yamlStr = yaml.dump(spec, { 
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    flowLevel: -1
  });
  fs.writeFileSync('src/server/docs/openapi.yaml', yamlStr);
  console.log('OpenAPI spec generated successfully!');
};

generateOpenAPISpec();