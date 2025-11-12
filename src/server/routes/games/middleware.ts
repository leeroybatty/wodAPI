// import { Request, Response, NextFunction } from 'express';
// import { PoolConnection } from '../sql/connection';
// import { handleError } from '../errors';

// export interface AuthenticatedRequest extends Request {
//   gameZone?: string;
//   requesterId?: string;
// }

// export async function verifyGame(req: AuthenticatedRequest, res: Response, next: NextFunction) {
//   try {
//     const apiKey = req.query.api_key as string;
//     const requesterId = req.query.requester as string;
    
//     if (!apiKey || !requesterId) {
//       const errorResponse = createErrorResponse(ErrorKeys.AUTHENTICATION_FAILED);
//       return res
//         .status(CORE_ERROR_MAP[ErrorKeys.AUTHENTICATION_FAILED].statusCode)
//         .json(errorResponse);
//     }

//     const query = 'SELECT id FROM games WHERE api_key = $1';
//     const values = [apiKey];

//     const result = await queryDbConnection(query, values);
//     const matchingGame = getOneRowResult(result);
    
//     if (matchingGame.length === 0) {
//       client.release();
//       return res.status(401).json({ error: 'Invalid API key' });
//     }
    
//     req.gameZone = gameCheck.rows[0].zone_id;
//     req.requesterId = requesterId;
    
//     client.release();
//     next();
    
//    } catch (error) {
//       handleError(error, req, res);
//   }
// }
