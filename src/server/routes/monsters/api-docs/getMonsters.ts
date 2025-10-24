import { 
  commonParams,
  badRequestError400,
  generalServerError500
} from '../../../docs/common';

const { exclude, include, format } = commonParams;

const getMonstersExclude = {
  ...exclude,
  description: exclude.description + `For example: you want a Vampire game, but you don't want to allow ghouls or revenants by default.`,
  example: 'ghouls,revenants'
};

const getMonstersInclude = {
  ...include,
  description: include.description + `You want literally only Vampires and that's it.  Instead of using the 'splat' argument (which would select Vampire, ghouls, revenants, and humans) and then excluding 3 things,  you include 'vampire' by itself.`,
  example: 'vampire'
};


export const getMonsters = {
  get: {
    summary: 'Get playable "races" (e.g. Vampire) by source books',
    description: `Retrieve available monsters at the splat level ('Vampire', 'Mage', etc.), filtered by source books.`,
    tags: ['Monsters'],
    parameters: [
      {
        in: 'query',
        name: 'splats',
        schema: {
          type: 'string',
          enum: ['vampire', 'mage', 'shifter', 'demon', 'mummy', 'hunter', 'changeling']
        },
        required: false,
        style: 'form',
        explode: false,
        description: `Comma-separated list of splats. If you do not provide this, it will return everything. This will add anything that was introduced at any point within that gameline.  'Human' will always be included - exclude it with the exclude query parameter.

          - Vampire: Adds Vampires, Ghouls, Revenants.

          - Mage: Adds Mage, Sorcerer, and 'Companion' (types of characters defined in Gods And Monsters).

          - Shifter: Adds Shifters, Kinfolk, and 'Possessed' (fomori, drones and kami).

          - Demon: Adds Demons.

          - Mummy: Adds Mummies. 

          - Changeling: Adds Changelings and Kinain.

          - Hunter: Adds Hunter the Reckoning style hunters with Edges.
        `,
        example: "vampire,mage"
      },
      getMonstersExclude,
      getMonstersInclude,
      format
    ],
    responses: {
      200: {
        description: 'Successful response with monster data',
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
                              name: {
                                type: 'string',
                                description: 'Name of the monster',
                                example: 'Shifter'
                              },
                              book: {
                                type: 'string',
                                description: 'Full name of the source book',
                                example: "Vampire: the Masquerade 20th Anniversary Core"
                              }
                            }
                          },
                          description: 'List of available monster types with source information.',
                          example: [
                            {
                              "name": "Vampire",
                              "book": "Vampire: The Masquerade 20th Anniversary Core"
                            },
                            {
                              "name": "Ghoul",
                              "book": "Vampire: The Masquerade 20th Anniversary Core"
                            },
                            {
                              "name": "Mage",
                              "book": "Mage: The Ascension 20th Anniversary Core"
                            },
                            {
                              "name": "Sorcerer",
                              "book": "Mage 20th Anniversary: Sorcerer"
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