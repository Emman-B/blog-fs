import {Route, HashRouter, Link} from 'react-router-dom';

// Routes
import SignupRoute from './routes/SignupRoute';
import LoginRoute from './routes/LoginRoute';

function App() {

  // component return function
  return (
    <HashRouter>
      <Route exact path='/'>
        <div>navigation</div>
        <div>
          <Link to='/login'>to login</Link>
        </div>
        <div>
          <Link to='/signup'>to signup</Link>
        </div>
      </Route>

      <Route path='/login'>
        <LoginRoute />
      </Route>

      <Route path='/signup'>
        <SignupRoute />
      </Route>
    </HashRouter>
  );
}

export default App;
