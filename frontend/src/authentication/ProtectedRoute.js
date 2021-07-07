/**
 * This protected route implementation was inspired by the example in the 
 * React Router documentation linked here: https://reactrouter.com/web/example/auth-workflow 
 */
import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from './Authentication';

/**
 * This is a protected route object that makes use of the useAuthState() hook
 * that I implemented which verifies if the user is logged in. It wraps the
 * react-router-dom's existing Route but with authentication.
 * @param {object} routeProps Properties to pass onto the underlying Route component
 * @param {string} routeProps.redirectPathOnFail The path that the route should redirect to
 * @param {string} routeProps.loadingComponent The component to be rendered while the user's login state is being checked
 * @param {array} routeProps.children The children of this component
 * @returns A route that either renders the component, redirects to the user to some path, or renders some form of loading
 */
export default function ProtectedRoute({redirectPathOnFail = '/', loadingComponent, children, ...rest}) {
  // redefine loadingComponent depending on whether it is valid or not
  loadingComponent = loadingComponent ?? <></>;

  // get the logged in state
  const isLoggedIn = useAuthState();

  // component return function
  return(
    // We are returning a route here but we are wrapping it with authentication
    <Route
      // provide the rest of the properties that the protected route might have taken
      {...rest}

      // Render depending on the logged in state
      render={({location}) => {
        // Render the children component(s) if isLoggedIn is true
        if (isLoggedIn === true) {
          return children;
        }
        // Redirect the user if isLoggedIn is false. The reason for checking for isLoggedIn === false is because
        //  isLoggedIn can possibly be null which indicates an unfulfilled promise.
        else if (isLoggedIn === false) {
          return (<Redirect to={{ pathname: redirectPathOnFail, state: {from: location} }} />);
        }
        // if isLoggedIn is null (only other possible value), render a component to indicate loading
        else {
          return loadingComponent;
        }
      }}
    />
  );
}
