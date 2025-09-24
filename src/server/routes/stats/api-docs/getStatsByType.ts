import { AllStatCategories } from '../types'

export const getStatsByType = {
  get: {
    summary: 'Get stat lists within a stat category',
    description: `Retrieve available stats optionally filtered by source books.`,
    tags: ['Stats'],
    parameters: [
      {
        in: 'path',
        name: 'monster',
        required: true,
        schema: {
          type: 'string',
          enum: Object.values(AllStatCategories)
        },
        description: `The stat category.  "Statpool" refers to stats that have a temporary rating and a permanent rating, e.g. Gnosis, Rage, Vitae, Quintessence and Willpower.`,
        example: 'backgrounds'
      },
      {
        in: 'query',
        name: 'format',
        schema: {
          type: 'string',
          enum: ['names', 'all'],
          default: "all"
        },
        style: 'form',
        example: "all",
        explode: false,
        description: 'Format for results. "Names" will present just an array of the stat names, and "all" will present an array of objects with all expected fields.'
      },
      {
        in: 'query',
        name: 'faction',
        schema: {
          type: 'string',
        },
        style: 'form',
        explode: false,
        example: "Sabbat",
        description: 'Filter for a faction. Filling this out wil restrict results to either stats universally available OR available to a sect. So, if you passed "Sabbat" in to find Backgrounds that are Sabbat-specific, then regular Backgrounds like Resources would show up, but also "Rituals" and "Black Hand Membership."'
      },
      {
        in: 'query',
        name: 'books',
        schema: {
          type: 'string'
        },
        style: 'form',
        explode: false,
        description: 'Comma-separated list of book names, to limit results to stats that are only found in those specified books, including universally available stats (e.g. "Resources" or "Strength"). Book names are case-insensitive.',
        example: "Mage the Ascension: 20th Anniversary Core"
      },
      {
        in: 'query',
        name: 'year',
        schema: {
          type: 'integer',
          default: 2025,
          description:`The IC year! The year your game is set in will make some alterations to what is sensibly available.
- 1980+: Computer included
- 1914+: Seneschal excluded; WWI collapsed 'great house' culture.
- 1950+: Technology included; transistors, etc. become a thing
- 1930+: Ride excluded; cars eclipsed use of horses by far
- 1910+: Drive included; cars prominent enough to be a core stat
- 1890+: Archery excluded; firearms used by majority of people
- 1750+: Commerce excluded; world shifts to industrial logistics at this point
- 1700+: Legerdemain, Enigmas, Theology, and Hearth Wisdom excluded; Age of Enlightenment underway
- 1500+: Firearms included; matchlocks and muskets proliferate armies

Please note that the books argument also has an effect on filtering out stats and default behavior.
You can override the above described default behavior with the 'include' parameter.
`
        }
      },
      {
        in: 'query',
        name: 'exclude',
        schema: {
          type: 'string'
        },
        style: 'form',
        explode: false,
        description: 'Comma-separated list of stat names to exclude from results (case-insensitive)',
        example: "node"
      },
      {
        in: 'query',
        name: 'include',
        schema: {
          type: 'string'
        },
        style: 'form',
        explode: false,
        description: 'Comma-separated list of stat names to include in results (case-insensitive)',
        example: "archery"
      }
    ],
    responses: {
      200: {
        description: 'Successful response with stat data',
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
                                description: 'Name of the stat',
                                example: 'Ananta'
                              },
                              page_number: {
                                type: 'integer',
                                description: 'Page number in the source book, if it is unique to that book.',
                                example: 211
                              },
                              book: {
                                type: 'string',
                                description: 'Full name of the source book',
                                example: "Werewolf 20th Anniversary: Changing Breeds"
                              }
                            }
                          },
                          description: 'List of available stats within that type with source information. Null values are for universally available stats.',
                          example: [
                            {
                              "name": "Resources",
                              "page_number": null,
                              "book": null
                            },
                            {
                              "name": "Majordomo",
                              "page_number": 124,
                              "book": "Vampire 20th Anniversary: Ghouls And Revenants"
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
      }
    }
  }
}