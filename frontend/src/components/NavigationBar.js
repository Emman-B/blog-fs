import './NavigationBar.css';
import { useHistory } from 'react-router-dom';

/**
 * Navigation Bar with basic navigation buttons and the name of the web app
 * @param {object} props 
 * @returns JSX
 */
function NavigationBar(props) {
  // use the react router history hook
  const history = useHistory();

  // component return function
  return (
    <div id='navbar'>
      <div id='navbar-left'>
        <div id='navbar-title' className='navbar-item'>blog-fs</div>
        <input id='navbar-search' className='navbar-item' type='text' placeholder='Search...'></input>
      </div>
      <div id='navbar-right'>
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
      </div>
    </div>
  );
}

export default NavigationBar;
