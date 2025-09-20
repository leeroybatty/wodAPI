import fs from 'fs';
import yaml from 'js-yaml';

import { MonsterTemplates } from './server/routes/monsters/types';
import { getMonstersByType } from './server/routes/monsters/api-docs/getMonstersByType';
import { getStatsByType } from './server/routes/stats/api-docs/getStatsByType';

const booksNotFound = {
  type: 'array',
  items: {
    type: 'string'
  },
  description: 'Requested books that weren\'t found in database, e.g. due to typos',
  example: ["vamipre 20th anneversery"]
};

const booksUsed = {
  type: 'array',
  items: {
    type: 'string'
  },
  description: 'Books that were found and used',
  example: ["vampire 20th anniversary", "dark ages core"]
};

const GeneralServerError500 = {
  description: 'General server error.',
  content: {
    'application/json': {
      schema: {
        allOf: [
          { $ref: '#/components/schemas/ApiErrorResponse' }
        ]
      }
    }
  }
};

const badRequestError400 = {
  description: 'Invalid request on behalf of user.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ApiErrorResponse'
      }
    }
  }
};

const NotFoundError404 = {
  description: 'Resource was not found with given parameters.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ApiErrorResponse'
      }
    }
  }
};

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
      '/api/monsters/{monster}/type': {
        ...getMonstersByType,
        get: {
          ...getMonstersByType.get,
          responses: {
            ...getMonstersByType.get.responses,
          400: badRequestError400,
          404: NotFoundError404,
          500: GeneralServerError500
          }
        }
      }
    },
    '/api/stats/{type}/': {
      ...getStatsByType,
      get: {
        ...getStatsByType.get,
        responses: {
          ...getStatsByType.get.responses,
        400: badRequestError400,
        404: NotFoundError404,
        500: GeneralServerError500
        }
      }
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