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
  const NavbarRightLoggedOut = (
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
  const NavbarRightLoggedIn = (
    <>
      {/* Greet user */}
      <div id='navbar-greeting' className='navbar-item'>Hello {localStorage.getItem('username')}</div>
      {/* New post should link to the editor route */}
      <button className='navbar-item' onClick={() => history.push('/editor')}>New Post</button>
      {/* Log Out button should run the logout function */}
      <button className='navbar-item' onClick={() => doLogout(history)}>Log Out</button>
    </>
  );

  // function to decide what component to render for the right side of navbar: user logged in, user logged out, or "loading"
  //  (called in the component return function)
  function decideRenderedNavbarRight() {
    // case: user is logged in
    if (isLoggedIn) return NavbarRightLoggedIn;
    // case: user is not logged in
    else if (isLoggedIn === false) return NavbarRightLoggedOut;
    // case: isLoggedIn === null so display nothing
    else return <></>;
  }


  // component return function
  return (
    <div id='navbar'>
      <div id='navbar-left'>
        <div id='navbar-title' className='navbar-item'>blog-fs</div>
        <input id='navbar-search' className='navbar-item' type='text' placeholder='Search...'></input>
      </div>
      <div id='navbar-right'>
        {/* Navbar Right depends on the login state of the user */}
        {decideRenderedNavbarRight()}
      </div>
    </div>
  );
}

export default NavigationBar;
