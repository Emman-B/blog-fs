// Styles
import './App.css';

import { Route, HashRouter } from 'react-router-dom';

// Routes
import HomeRoute from './routes/HomeRoute';
import SignupRoute from './routes/SignupRoute';
import LoginRoute from './routes/LoginRoute';

function App() {

  // component return function
  return (
    <HashRouter>
      <Route exact path='/'>
        <HomeRoute />
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
