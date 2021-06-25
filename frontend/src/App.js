// imports from other libraries
import {Route, HashRouter} from 'react-router-dom';

// imports
import LoginRoute from './routes/LoginRoute';

function App() {

  // component return function
  return (
    <HashRouter>
      <Route exact path='/'>
      </Route>

      <Route path='/login'>
        <LoginRoute />
      </Route>
    </HashRouter>
  );
}

export default App;
