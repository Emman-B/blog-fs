import axios from 'axios';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';

/**
 * makes the post request to log in. On success, the email and username are stored in localstorage
 * @param {import('react').MutableRefObject} emailOrUsernameRef ref to the email or username input
 * @param {import('react').MutableRefObject} passwordRef ref to the password input
 * @param {*} history react router history
 */
function postLoginDetails(emailOrUsernameRef, passwordRef, history) {
  axios.post('http://localhost:3010/v1/user/login', {emailOrUsername: emailOrUsernameRef.current.value, password: passwordRef.current.value}, {withCredentials: true})
  .then((response) => {
    console.log('log in successful!');
    // store login details
    localStorage.setItem('email', response.data.email);
    localStorage.setItem('username', response.data.username);
    // return the user back to the home route
    history.push('/');
  })
  .catch((error) => {
    console.error('log in failed!');
    alert('Incorrect Email or Password');
    console.error(error);
  });
}

/**
 * Login component with inputs
 * @param {object} props any information to pass down to component
 * @returns JSX
 */
function Login(props) {
  // react router history
  const history = useHistory();

  // references to input
  const emailOrUsernameRef = useRef('');
  const passwordRef = useRef('');

  // component return function
  return (
    <div>
      <div>
        Login
      </div>

      {/* Email or Username Input */}
      <div>
        <div>Email or Username</div>
        <input type='text' placeholder='Email or Username' ref={emailOrUsernameRef}></input>
      </div>

      {/* Password Input */}
      <div>
        <div>Password</div>
        <input type='password' placeholder='Password' ref={passwordRef}></input>
      </div>

      {/* Login Button */}
      <button onClick={() => { postLoginDetails(emailOrUsernameRef, passwordRef, history) }}>Log in</button>
    </div>
  );
}

export default Login;
