// Styles
import './App.css';

// Route-related imports
import { Route, HashRouter, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './authentication/ProtectedRoute';

// Routes
import HomeRoute from './routes/HomeRoute';
import SignupRoute from './routes/SignupRoute';
import LoginRoute from './routes/LoginRoute';
import PostEditorRoute from './routes/PostEditorRoute';
import PostReaderRoute from './routes/PostReaderRoute';

function App() {

  // component return function
  return (
    <HashRouter>
      {/* Switch is being used to prevent any ProtectedRoutes from being rendered prematurely */}
      <Switch>
        <Route exact path='/'>
          <HomeRoute />
        </Route>

        {/* Login route needs to be protected in reverse to only allow unauthenticated users to access it */}
        <ProtectedRoute path='/login' reversedProtection={true}>
          <LoginRoute />
        </ProtectedRoute>

        <Route path='/signup'>
          <SignupRoute />
        </Route>

        {/* Protected Route from editing posts */}
        <ProtectedRoute path='/editor'>
          <PostEditorRoute />
        </ProtectedRoute>

        {/* Post Reader Route. It needs to use the component prop to get the prop parameter. */}
        <Route path='/reader/:id' component={PostReaderRoute}>
        </Route>

        <Route path='*'>
          <Redirect to='/' />
        </Route>

      </Switch>
    </HashRouter>
  );
}

export default App;
