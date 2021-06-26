import {Route, HashRouter, Link} from 'react-router-dom';

// Routes
import SignupRoute from './routes/SignupRoute';
import LoginRoute from './routes/LoginRoute';
import PostBrief from './components/PostBrief';

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

        <PostBrief postAuthor='John Doe'/>
        <PostBrief postTitle='Blog Post Title' postDate={new Date(2018, 2, 18).toLocaleDateString()}/>
        <PostBrief postContent='This is my first blog post!' postAuthor='Jane Doe' postDate={new Date(2014, 7, 19).toLocaleDateString()}/>
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
