import { MonsterTemplates } from '../types'

export const getMonstersByType = {
  get: {
    summary: 'Get monster clans/types by source books',
    description: `Retrieve available monster clans or types filtered by source books and in-character year.
      Historical filtering automatically excludes clans that didn't exist in the specified year.`,
    tags: ['Monsters'],
    parameters: [
      {
        in: 'path',
        name: 'monster',
        required: true,
        schema: {
          type: 'string',
          enum: Object.values(MonsterTemplates)
        },
        description: `The type of monster/supernatural being!\n
- 'vampire' will yield clans, e.g. "Brujah"\n
- 'ghoul' will yield clan vassals, e.g. "Brujah Vassal"\n
- 'revenant' will yield families, e.g. "Bratovich"\n
- 'werewolf' will yield species, e.g. "Garou"\n
- 'changeling' will yield kiths, e.g. "Boggan"\n
- 'mage' will yield crafts, e.g. "Order of Hermes"\n
- 'demon' will yield lores, e.g. "Defiler"\n
- 'hunter' will yield creeds, e.g. "Defender"\n
- 'wraith' will yield  "ghost", "risen", or "spectre" (for antagonists!)
        `,
        example: 'vampire'
      },
      {
        in: 'query',
        name: 'books',
        schema: {
          type: 'string'
        },
        style: 'form',
        explode: false,
        description: 'Comma-separated list of book names. Can also be sent as multiple parameters. Book names are case-insensitive.',
        example: "vampire 20th anniversary,dark ages core"
      },
      {
        in: 'query',
        name: 'year',
        schema: {
          type: 'integer',
          default: 2025
        },
        description: `In-character year for historical filtering. Pass a negative integer for BCE years. Affects which results are available:
- Pre-1999 (6th Great Maelstrom): No Demon Houses, no Mummy Amenti/Wu T'iang, no Hunter Creeds
- Pre 1969: No Sidhe (vanished in 1350)
- Pre-1950: No Serpents of the Light
- Pre-1900: No Blood Brothers
- Pre-1914: No New World Order
- Pre 1897: No Iteration X, Progenitors, or Void Engineers
- Pre-1851: No Syndicate
- Pre-1823: No Virtual Adepts/Mercurial Elite
- Pre-1806: No Hollow Ones, Society/Sons of Ether
- Pre-1750 (Pre African Slave Trade): No Bata'a
- Post-1697 (Fall of the last Mayan kingdom): No Camazotz
- Post-1600 (Well after the Dark Ages): No Bonsam, Impundulu, Niktuku, or Ramanga
- Pre-1565: No Oprichniki (Ivan the Terrible made them that year); no Rossellini
- Post-1530: No Capacocha mummies until post-1999
- Post-1500: No Apis (CB specifies they disappeared 500 years ago)
- Pre-1452: No Celestial Chorus, Dreamspeakers
- Pre-1450: No Daughters of Cacophony, no Servants of Anushin-Rawan
- Pre-1440: No Cult of Ecstasy, Verbena
- Post-1350 (Black Death): No Sidhe until 1969
- Pre 1315: (Pre Great Famine crisis) No Euthantos or Solificati; no Grimaldi
- Pre 1200 (Pre-Inca Period): No Chaksimallki; Ducheski are called Krevcheski, no Obertus
- Pre-1167: No Gargoyles
- Pre 1128: No Knights Templar
- Pre-1100: (Rise of Great Zimbabwe, emperor Toba) No Ngoma, no Kitsune, no Zantosa
- Pre-1055: No Giovanni
- Pre-1090: No Tremere
- Pre-1000 (Medieval feudalism in Eastern Europe): No Bratovitch
- Pre 800: (Early Dark Ages) No Rafastio or Enrathi as Revenants
- Pre-767: No Order of Hermes
- Pre-745: No Kairouan Brotherhood (Kairouan was not described as a 'great' city until then)
- Pre-500 BCE: (Pre-Greek classical period): No Cabiri
- Pre-513 BCE: (Before Persian Empire was at height): No Ahl-i-Batin 
- Pre-800 BCE: (Pre Greek city states, pre Chou dynasty): No Hyppolytoi, Wu Lung
- Pre-1530 BCE (Pre-Chimu culture): No Intimallki
- Pre-1770 BCE: (Pre-contact between Andean and Amazonian cultures) - No Uchumallki
- Pre-2300 BCE: (Before Sargon of Akkad unites early Taftani) No Taftani
- Pre-3500 BCE: (Pre Egyptian civilization): No mummies!
- Pre-5050 BCE: (Pre Chinchorro civilization): No South American mummies
- Pre-10K BCE (End of last Ice Age): No Grondr, Tzimisce`,
        example: 1200
      },
      {
        in: 'query',
        name: 'exclude',
        schema: {
          type: 'string'
        },
        style: 'form',
        explode: false,
        description: 'Comma-separated list of clan/type names to exclude from results (case-insensitive)',
        example: "giovanni,tremere"
      }
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
                                description: 'Name of the monster type',
                                example: 'Brujah'
                              },
                              page_number: {
                                type: 'integer',
                                description: 'Page number in the source book',
                                example: 48
                              },
                              book: {
                                type: 'string',
                                description: 'Full name of the source book',
                                example: "Vampire: the Masquerade 20th Anniversary Core"
                              }
                            }
                          },
                          description: 'List of available monster clans/types with source information',
                          example: [
                            {
                              "name": "Assamite",
                              "page_number": 48,
                              "book": "Vampire: The Masquerade 20th Anniversary Core"
                            },
                            {
                              "name": "Brujah",
                              "page_number": 50,
                              "book": "Vampire: The Masquerade 20th Anniversary Core"
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
    }
  }
}