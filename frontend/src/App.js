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
import NavigationBar from './components/NavigationBar';

// Authentication context
import { AuthenticationProvider } from './authentication/Authentication';

function App() {

  // component return function
  return (
    <HashRouter>
      <AuthenticationProvider>
        <NavigationBar />
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

          {/* Protected Route for creating posts (with optional UUID path) */}
          <ProtectedRoute exact path='/editor/new'>
            <PostEditorRoute />
          </ProtectedRoute>
          {/* Protected Route for editing posts (with optional UUID path) */}
          <ProtectedRoute exact path='/editor/edit/:id'>
            <PostEditorRoute />
          </ProtectedRoute>

          {/* Post Reader Route. It needs to use the component prop to get the prop parameter. */}
          <Route path='/reader/:id' component={PostReaderRoute}>
          </Route>

          <Route path='*'>
            <Redirect to='/' />
          </Route>

        </Switch>
      </AuthenticationProvider>
    </HashRouter>
  );
}

export default App;
