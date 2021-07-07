// Styles
import './App.css';

import { Route, HashRouter, Switch } from 'react-router-dom';

// Routes
import HomeRoute from './routes/HomeRoute';
import SignupRoute from './routes/SignupRoute';
import LoginRoute from './routes/LoginRoute';

function App() {
  // component return function
  return (
    <HashRouter>
      {/* Switch is being used to prevent any ProtectedRoutes from being rendered prematurely */}
      <Switch>
        <Route exact path='/'>
          <HomeRoute />
        </Route>

        <Route path='/login'>
          <LoginRoute />
        </Route>

        <Route path='/signup'>
          <SignupRoute />
        </Route>

      </Switch>
    </HashRouter>
  );
}

export default App;
