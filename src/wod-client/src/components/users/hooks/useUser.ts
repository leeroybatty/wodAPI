/**
 * useUser Hook
 *
 * This hook provides access to the user authentication functions and states
 * provided by the `UserProvider`. Rather than meddling with the internals of
 * the authentication process, this hook offers a streamlined way to interact
 * with user-related data and actions.
 *
 * With `useUser`, you can access:
 * - Authentication state (e.g. is the user logged in?)
 * - User data (e.g. the user's profile information)
 * - Core authentication functions (e.g. logging in, logging out)
 *
 * This hook needs to live inside a `<UserProvider>` component to ensure that 
 * the necessary context for user authentication is available. If you ever
 * get an error complaining about UserProvider not being available, you've
 * probably deleted it from `pages/_app`, so don't do that!
 * 
 * @returns {Object} An object containing user state, authentication status
 * checks, and core user functions.
 *
 * @example
 * const { isAuthenticated, loginUser, getUser } = useUser();
 *
 * if (isAuthenticated()) {
 *   console.log("User is logged in!");
 *   console.log("User data:", getUser());
 * } else {
 *   console.log("User is not logged in.");
 * }
 */

import UserContext from '../UserContext';
import {useContext} from 'react';

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }

    const [state, dispatch, verifyUser, loginUser, logoutUser, viewProfile, openAuthModal, closeAuthModal] = context;

    return {
        ...state,
        dispatch,
        loginUser,
        logoutUser,
        verifyUser,
        viewProfile,
        openAuthModal,
        closeAuthModal
    };
};