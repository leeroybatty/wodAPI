export const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TTRPG API',
      version: '1.0.0',
      description: 'API for creating tabletop RPGs on the internet - built for PennMUSH, Evennia, and more!',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        ApiSuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object'
            }
          }
        },
        ApiErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'INVALID_REQUEST'
                },
                message: {
                  type: 'string',
                  example: 'Invalid request parameters'
                },
                details: {
                  type: 'object'
                },
                endpoint: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
  },
  apis: [
    './src/server/docs/*.yaml',
    './src/server/index.ts'
  ],
};