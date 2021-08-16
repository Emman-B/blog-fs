import './LoginSignup.css'; // styles
import { useRef } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Signup() {
  // References to all of the inputs
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  // history for redirection
  const history = useHistory();

  // function to handle submitting the form
  const handleSubmit = () => {
    const accountInfo = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      passwordConfirmation: confirmPasswordRef.current.value,
    };
    axios.post('http://localhost:3010/v1/user/signup', accountInfo, {withCredentials: true})
        .then(() => {
          // redirect to login
          history.push('/login');
        })
        .catch((error) => {
          if (error.response.status === 409) {
            const conflictingResources = [...error.response.data];
            const alertMessage = `The following information that you have provided is in use: ${conflictingResources}.`;
            if (conflictingResources.length > 0) {
              window.alert(alertMessage);
            }
          }
        });
  };

  // component return function
  return (
    <form onSubmit={handleSubmit} className={'signup login-signup'}>
      <header>
        Create an Account
      </header>

      {/* Username Input */}
      <div>
        <div>Username (3-64 characters)</div>
        <input type='text' ref={usernameRef} minLength={3} maxLength={64} required></input>
      </div>

      {/* Email Input */}
      <div>
        <div>Email</div>
        <input type='email' ref={emailRef} required></input>
      </div>

      {/* Password Input */}
      <div>
        <div>Password (8-64 characters)</div>
        <input type='password' ref={passwordRef} minLength={8} maxLength={64} required></input>
      </div>

      {/* Confirm Password Input */}
      <div>
        <div>Confirm Password</div>
        <input type='password' ref={confirmPasswordRef} minLength={8} maxLength={64} required></input>
      </div>

      {/* Account Signup Button */}
      <button type='submit'>Create an Account</button>
    </form>
  );
}

export default Signup;
