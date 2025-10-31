/**
 This module is used for setting up a React context that revolves around user authentication and profile management. 

 To learn more about what a React "context" is: https://react.dev/learn/scaling-up-with-reducer-and-context
 */

import { createContext } from "react";
import type { UserContextType } from "./user.types";

/**
 * UserContext is the main React context for user management and actions.
 * It gets used with React's useContext hook to access user-related functions.
 * @default {null}
 */
const UserContext = createContext<UserContextType | null>(null);

export default UserContext;