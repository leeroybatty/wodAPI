/**
 * userReducer Function
 *
 * `userReducer` is a function that determines changes to an application's state.
 * Think of it like a set of rules or instructions for how to change user data.
 *
 * In programming with React, the term "reducer" often comes up. Imagine you
 * are giving a set of instructions to a new intern every day and they keep
 * asking you for instructions for the same scenarios so often you resort 
 * to devising a flow chart so you will repeat yourself ONE LAST TIME. 
 * 
 * A reducer is that flow chart.
 * 
 * This particular reducer handles actions related to user authentication.
 * For instance, when a user logs in, the reducer ensures the 'state' 
 * reflects that the user is now authenticated and their data is stored.
 *
 * A 'state' is the application's status in terms of info it is relying on,
 * such as if you are logged in.
 * 
 * Below, you'll see different 'cases'.  Think of cases like flow chart entries
 * like 'is the user trying to do X, yes or no'. Each case corresponds to a 
 * type of action we might want to make regarding our user (like logging in 
 * or logging out). Depending on which action is passed in, the reducer 
 * modifies the state in a specific way.
 *
 * @param {UserAuthState} state - The current state of user authentication.
 * @param {UserAction} action - The action to be processed.
 * @returns {UserAuthState} The new user authentication state.
 * 
 * @example
 * const initialState = { user: null, authenticated: false };
 * const loginAction = { type: ActionType.Login, payload: userProfile };
 * const newState = userReducer(initialState, loginAction);
 * // newState will now reflect that a user is logged in with their profile.
 */

import type {UserAuthState, UserAction} from "../user.types";
import { ActionType } from '../user.types';

const userReducer = (state: UserAuthState, action: UserAction): UserAuthState => {
    switch (action.type) {
      case ActionType.CloseAuthModal: 
        return {
          ...state,
          isAuthModalOpen: false,
        }
      case ActionType.OpenAuthModal:
        return {
          ...state,
          isAuthModalOpen: true
        }
      case ActionType.Login:
        return { 
          ...state, 
          user: action.payload.user, 
          isAuthenticated: true, 
          isLoading: false,
        }
      case ActionType.Verify:
        return { ...state, isAuthenticated: true, isLoading: false }
      case ActionType.Logout:
        return { ...state, user: null, isAuthenticated: false, isLoading: false }  
      case ActionType.ViewProfile:
        return { ...state, user: action.payload.user, isLoading: false};
      case ActionType.UpdateProfile: {
        if (state.user) {
          return {
            ...state,
            user: {
              ...state.user,
              ...action.payload
            },
            isLoading: false,
          };
        }
        return state;
      }
      case ActionType.Loading:
        return {...state, isLoading: true};
      case ActionType.Error:
        return {
          ...state, 
          authError: {
            message: action.payload.message,
            status: action.payload.status,
            stack: action.payload.stack
          },
          isLoading: false
        };
      default:
        return state;
    }
}

export default userReducer;