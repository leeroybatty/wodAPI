export const generalServerError500 = {
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

export const badRequestError400 = {
  description: 'Invalid request on behalf of user.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ApiErrorResponse'
      }
    }
  }
};

export const notFoundError404 = {
  description: 'Resource was not found with given parameters.',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/ApiErrorResponse'
      }
    }
  }
};

export const commonParams = {
  format: {
    in: 'query',
    name: 'format',
    required: false,
    schema: {
      type: 'string',
      enum: ['all','names']
    },
    description: 'An option to return full data or just a list.  You might just need a list when, for example, building a MUSH-side CG where the user only needs the available options on the menu. ',
    example: 'names'
  },
  exclude: {
    in: 'query',
    name: 'exclude',
    required: false,
    schema: {
      type: 'string',
    },
    description: 'A list of entries to  override default behavior and explicitly exclude by name, not database ID.  This is intended for conveniently doing little tweaks in your game world - maybe you want to allow every single entry in a category but one or two. '
  },
  include: {
    in: 'query',
    name: 'include',
    required: false,
    schema: {
      type: 'string',
    },
    description: 'A list of entries to override default behavior and explicitly include by name, not database ID.  This is intended for conveniently doing little tweaks in your game world - maybe you have a house rule that brings in a stat from an existing source. '
  },
  books: {
    in: 'query',
    name: 'books',
    schema: {
      type: 'string'
    },
    style: 'form',
    explode: false,
    description: 'Comma-separated list of book names. Can also be sent as multiple parameters. Book names are case-insensitive. ',
    example: "vampire 20th anniversary,dark ages core"
  },
  year: {
      in: 'query',
      name: 'year',
      schema: {
        type: 'integer',
        default: 2025
      },
      description: 'In-character year for historical filtering. Pass a negative integer for BCE years. Affects which results are available. ',
      example: 1200
  },
  faction: {
    in: 'query',
    name: 'faction',
    schema: {
      type: 'string',
    },
    style: 'form',
    explode: false,
    example: "Sabbat",
    description: 'Filter for a faction. Filling this out will restrict results to either stats universally available OR available to a sect. '
  }
};