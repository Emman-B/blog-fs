/**
 * This source file contains exported functions that revolve around authentication,
 * such as whether a user is logged in, or if a login request was made.
 */
// Some authentication-related code (regarding authenticated routes) was inspired from this link:
// https://reactrouter.com/web/example/auth-workflow
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AuthenticationContext = createContext();

/**
 * checks if the user is logged in, and if so, stored their info in local storage
 * @returns true if user is logged in (also stored data in local storage), false otherwise
 */
export async function checkLoginState() {
  try {
    // make the request to check login state and wait for its completion
    const loginRequest = await axios.get('http://localhost:3010/v1/user', {withCredentials: true});
  
    // get the username and email (which can safely be stored in local storage)
    const {username, email} = loginRequest.data;
  
    // store the data in local storage
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);

    return true;
  }
  catch (error) {
    // remove the data from local storage
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    return false;
  }
}

/**
 * Tracks authentication state. This is used in AuthenticationProvider to pass down the
 * authentication state via contexts.
 * @returns boolean|null (boolean is result of whether user is logged in or not, null means that the result was not found yet)
 */
function useAuthState() {
  // tracks login state (null means the user was not logged in)
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // react-router-dom: used to check authentication whenever the route changes. It's because
  //  ... this location has state, thus calling the checkLoginState function.
  const location = useLocation();

  // update login state
  useEffect(() => {
    checkLoginState().then((value) => {
      // value is the boolean returned from the function. it may be true or false
      setIsLoggedIn(value);
    })
    .catch((error) => {
      // if any errors occur, just set the login state to false
      setIsLoggedIn(false);
      console.error(error);
    });
  }, [location]);

  // return the boolean
  return isLoggedIn;
}

/**
 * Verifies if a user is logged in by checking AuthenticationContext. Use
 * this when checking what to render. This requires an AuthenticationProvider
 * so that the authentication state can be provided.
 * @return authentication state from an AuthenticationProvider
 */
export function useAuth() {
  // gets the value from the AuthenticationContext.Provider
  return useContext(AuthenticationContext);
}

/**
 * Provides the authentication state (from useAuthState) to children elements.
 * This should wrap elements that need the authentication state (e.g., protected
 * routes, conditionally rendered components, etc.)
 * @return Context Provider with rendered children
 */
export function AuthenticationProvider({children}) {
  const authentication = useAuthState();
  return <AuthenticationContext.Provider value={authentication}>{children}</AuthenticationContext.Provider>
}

/**
 * Does a logout and then refreshes the page
 * @param {*} history react router history object
 */
export function doLogout(history) {
  axios.delete('http://localhost:3010/v1/user/logout', {withCredentials: true})
    .finally(() => {
      // log out can either succeed or fail (failing mainly due to the user is already logged out).
      // regardless, removing the information from local storage and refreshing the current page
      //    are what needs to be done regardless of success/failure
      localStorage.removeItem('email');
      localStorage.removeItem('username');

      history.go(0); // refresh the current page
    });
}
