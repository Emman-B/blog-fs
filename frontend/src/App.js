import {Route, HashRouter, Link} from 'react-router-dom';
import axios from 'axios';

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

      <Route path='/testing'>
        <button onClick={() => {
          axios.post('http://localhost:3010/v1/users/login', {email: 'johndoe@example.com', password: 'password'}, {withCredentials: true}).then((response) => {
            console.log(response);
          }).catch((err) => {console.log(err)});
          
        }}>Log in as John Doe</button>

        <button onClick={() => {
          console.log('button clicked');
          axios.post('http://localhost:3010/v1/blogposts', {title: 'a title', content: 'content of post'}, {withCredentials: true}).then((response) => {
            console.log('response');
            console.log(response);
          }).catch((err) => {console.log(`Caught error: ${err}`)});
        }}>Make Post</button>
      </Route>
    </HashRouter>
  );
}

export default App;
