/**
 * This source file contains exported functions that revolve around authentication,
 * such as whether a user is logged in, or if a login request was made.
 */
import axios from 'axios';
import { useEffect, useState } from 'react';


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
 * Hook to track authentication state. Use this whenever 
 * @returns boolean with state for the logged in user
 */
export function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginState().then((value) => {
      setIsLoggedIn(value);
    })
    .catch((error) => {
      console.error(error);
    });
  });

  return isLoggedIn;
}
