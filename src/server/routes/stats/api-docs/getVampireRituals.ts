import { 
  commonParams,
  generalServerError500
} from '../../../docs/common';

const { exclude, include, format } = commonParams;

export const getVampireRituals = {
  get: {
    summary: 'Get blood magic rituals from a given blood magic path.',
    description: `Retrieve available rituals optionally filtered by source books and ritual level.`,
    tags: ['Stats', 'Vampire'],
    parameters: [
      {
        in: 'query',
        name: 'levels',
        required: false,
        schema: {
          type: 'array',
          items: {
            type: 'integer'
          },
          description: 'A rating from 1 to 5 to limit the available rituals'
        },
        example: [1,2,3]
      },
      {
        in: 'path',
        name: 'path',
        schema: {
          oneOf: [
            { type: 'integer' },
            { type: 'string' }
          ]
        },
        style: 'form',
        example: "Thaumaturgy",
        explode: false,
        description: ''
      },
      books,
      {
        ...exclude,
        example: "widow's spite"
      }
      {
        ...include,
        example: "burning blade"
      }
    ],
    responses: {
      200: {
        description: 'Successful response with ritual data',
        content: {
          'application/json': {
            schema: {
              allOf: [
                { $ref: '#/components/schemas/ApiSuccessResponse' },
                {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        monsters: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              display: {
                                type: 'string',
                                description: 'Name of the ritual',
                                example: 'Wake With Evening\'s Freshness'
                              },
                              name: {
                                type: 'string',
                                description: 'Name of the ritual to lower case',
                                example: 'wake with evening\'s freshness'
                              },
                              page_number: {
                                type: 'integer',
                                description: 'Page number in the source book, if it is unique to that book.',
                                example: 211
                              },
                              book: {
                                type: 'string',
                                description: 'Full name of the source book',
                                example: "Vampire: the Masquerade 20th Anniversary Core"
                              }
                            }
                          },
                          description: 'List of available rituals within that discipline of blood magic with source information.',
                          example: [
                            {
                              "display": "Wake With Evening's Freshness",
                              "name": "wake with evening's freshness",
                              "description": "Do the big magic thing wake up real nice",
                              "reference": {
                                 "page_number": 124,
                                 "book_name": "Some Book Name",
                                 "book_id": 1
                              }
                            }
                          ]
                        },
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      },
      500: generalServerError500
    }
  }
}