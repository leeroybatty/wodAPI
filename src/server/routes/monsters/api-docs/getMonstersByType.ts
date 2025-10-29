import { MonsterTemplates } from '../types'
import { 
  commonParams,
  badRequestError400,
  generalServerError500
} from '../../../docs/common';

const { exclude, include, format, faction, books, year } = commonParams;

export const getMonstersByType = {
  get: {
    summary: 'Get monster clans/types by source books',
    description: `Retrieve available monster types filtered by source books and in-character year.
      Historical filtering automatically excludes things that didn't exist in the specified year.
      `,
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
        description: `The type of monster/supernatural being that logically holds the subcategory you're looking for.  Without other filters like books and factions, the behavior is completely indiscriminate.  See the filter descriptions for how to refine the results further.  This is mostly intuitive ('vampire' yields a list of clans, plug in a clan and see the list of bloodlines), but here are the nonintuitive things: 


        Vampire: the Masquerade
        - If you have Ghouls in your game, there is a difference in the database between a 'nosferatu' and a 'nosferatu vassal', for instance.  So, to give a user a selection of the types of Ghoul they can be, you will want to pass 'ghoul' as your monster type, NOT try to get vampire clans.


        Mage: the Ascension
        - If you use 'Sorcerer' as your 'type', you will get 'Psychic' and 'Hedge Witch'. 

        - Gods and Monsters makes a bunch of different types of Companions available.  If you use 'companion' as your monster type, you will see "Acolyte", "Consor" and "Sorcerer", as well as "Animal", "Artificial Being", "Object", and "Supernatural Being".  

        - Using 'artificial being' as your 'type' will list Construct, Reanimate, and Robot.
        - Using 'supernatural being' as your 'type' will list Alien, Bygone, and Spirit.

        Werewolf: the Apocalypse
        - You want 'shifter', not 'werewolf', to yield the list of playable shapeshifter types.  This yields Garou plus ALL Changing Breeds and 'Mockery'.
        - To get specific tribes you will want to put in that species, for instance, to see 'Fianna' et al you put in 'Garou' not 'Werewolf'. 
        `,
        example: 'vampire'
      },
      faction,
      format,
      {
        ...books,
        description: books.description + `

        Without filters, this endpoint will indiscriminately load anything relevant to a given monster category no matter how obscure. Using the Books filter is one way to broad-stroke exclude results, here are the main intended cases:

        - For Werewolf: the Apocalypse
          - When hitting /api/monsters/shifter/type, but you don't want Changing Breeds or Mockeries:
            pass in 'Werewolf: the Apocalypse Core' by itself to only have 'Garou' as the Shifter option and knock out 'Mockery' and all of the Changing Breeds.

          - When you want MOST but not all of the Changing Breeds:
            add in 'Changing Breeds' to your booklist, and then use the 'exclude' parameter to pick off the one or two you have in mind. 

        - For Mage: the Ascension
          - When hitting /api/monsters/companion/type, but you just want Consors and Acolytes, not BYGONES:
            pass in 'Mage: the Ascension Core' by itself to exclude Sorcerer and all the Familiar types in Gods and Monsters.
            
          - If you do still want Sorcerer while filtering out the Bygones and so on:
            Add 'Sorcerer' to the book list, or use the 'include' parameter, as it's designed for one-offs.
        `
      },
      {
        ...year,
        description: year.description + `

        - Pre-1999 (6th Great Maelstrom): No Hunter Creeds! Hunters in your game would be mortals without Edges.
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
        - Post-1600 (Well after the Dark Ages): No Niktuku (as a chargen option). Bonsam, Impundulu, and Ramanga likewise disappear under the assumption that you're not running Dark Ages. To include them anyway, use the 'books' query parameter and include 'Ebony Kingdom.'
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
        - Pre-800 BCE: (Pre Greek city states, pre Chou dynasty): No Hyppolytoi, no Wu Lung
        - Pre-1530 BCE (Pre-Chimu culture): No Intimallki
        - Pre-1770 BCE: (Pre-contact between Andean and Amazonian cultures) - No Uchumallki
        - Pre-2300 BCE: (Before Sargon of Akkad unites early Taftani) No Taftani
        - Pre-3500 BCE: (Pre Egyptian civilization): No Egyptian M  ummies!
        - Pre-5050 BCE: (Pre Chinchorro civilization): No South American mummies.
        - Pre-10K BCE (End of last Ice Age): No Grondr`
      },
      {
        ...exclude,
        description: exclude.description + `For example: you want a W:TA game, but you don't want Red Talons in your urban setting.`,
        example: 'red talons'
      },
      {
        ...include,
        description: include.description + `For example: in your V:TM game, you want to make sure Lasombra are available, even in the Camarilla (if you filter for 'Camarilla' with the faction arg then it'd get rid of the Lasombra).`,
        example: 'lasombra'
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