import './NavigationBar.css';
import { useHistory } from 'react-router-dom';
import { doLogout, useAuthState  } from '../authentication/Authentication';

/**
 * Navigation Bar with basic navigation buttons and the name of the web app
 * @param {object} props 
 * @returns JSX
 */
function NavigationBar(props) {
  // custom hook to check login state
  const isLoggedIn = useAuthState();

  // use the react router history hook
  const history = useHistory();


  
  // different components depending on login state

  // if user is logged out, show this
  const NavBarLoggedOut = (
    <>
      <div>
        <button id='navbar-login' className='navbar-item' onClick={() => {
          history.push('/login');
        }}>Login</button>
      </div>
      <div>
        <button id='navbar-signup' className='navbar-item' onClick={() => {
          history.push('/signup');
        }}>Sign Up</button>
      </div>
    </>
  );

  // if user is logged in, show this
  const NavBarLoggedIn = (
    <>
      <div id='navbar-greeting' className='navbar-item'>Hello {localStorage.getItem('username')}</div>
      <button className='navbar-item'>New Post</button>
      <button className='navbar-item' onClick={() => doLogout(history)}>Log Out</button>
    </>
  );




  // component return function
  return (
    <div id='navbar'>
      <div id='navbar-left'>
        <div id='navbar-title' className='navbar-item'>blog-fs</div>
        <input id='navbar-search' className='navbar-item' type='text' placeholder='Search...'></input>
      </div>
      <div id='navbar-right'>
        {
          (isLoggedIn)?
          NavBarLoggedIn :
          NavBarLoggedOut
        }
      </div>
    </div>
  );
}

export default NavigationBar;
