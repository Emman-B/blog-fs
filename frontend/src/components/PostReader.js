// styles
import './PostReader.css';
// modules
import axios from 'axios';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useHistory } from 'react-router-dom';
import prettydate from 'pretty-date';

/**
 * Makes a GET request to retrieve a specified blog post
 * @param {string} postID ID of the blog post being retrieved
 * @param {function} setBlogPost callback function to change the component's state in terms of what the blog post is
 */
function getBlogPost(postID, setBlogPost) {
  // GET request to retrieve blog post
  axios.get(`http://localhost:3010/v1/blogposts/${postID}`, { withCredentials: true })
    .then((response) => {
      setBlogPost(response.data);
    })
    .catch((error) => {
      // if there was an error, set the blog post to be an object with properties about the error
      setBlogPost({
        error: true,  // identifies that an error did occur
        statusCode: error.response.status, // identifies the status code
      });
    });
}

/**
 * make a GET request to get the user details
 * @param {function} setUser sets the current user
 */
function getUser(setUser) {
  axios.get('http://localhost:3010/v1/user', {withCredentials: true})
    .then((response) => {
      setUser(response.data);
    })
    .catch((error) => {
      setUser({error: true});
    });
}

/**
 * Post Reader main component function
 * @param {object} props properties passed onto it from parent component
 * @returns JSX, the PostReader component
 */
export default function PostReader(props) {
  // state to keep track of
  // Keep track of the blog post object
  const [blogPost, setBlogPost] = useState(undefined);
  const [user, setUser] = useState(undefined);

  // side effects for components
  useEffect(() => {
    // retrieve a blog post
    getBlogPost(props.postID, setBlogPost);
    // also, check if the user is allowed to edit this
    getUser(setUser);
  }, [props.postID]);

  // react router history
  const history = useHistory();

  // function for handling editing a post
  const handleEditPost = () => {
    // go to the editor route with the ID of the blogpost
    history.push(`/editor/edit/${props.postID}`);
  };

  // function for handling deleting a post
  const handleDeletePost = () => {
    const deletionConfirmation = window.confirm('Are you sure you want to delete this post?');

    if (deletionConfirmation && blogPost.id) {
      // make a request to delete this post
      axios.delete(`http://localhost:3010/v1/blogposts/${blogPost.id}`, {withCredentials: true})
      .then(() => {
        // on successful deletion, return to main
        history.push('/');
      })
      .catch((err) => {
        // on unsuccessful deletion, send an alert
        window.alert(`There was a problem with deleting the blog post. An error has been logged to the console.`);
        console.error(err);
      });
    }
  };

  // PostReader loading component
  const loadingComponent = (
    <div>Loading</div>
  );

  // PostReader date showing
  const showDates = () => {
    const publishDateComponent =
        <h5 title={new Date(blogPost.publishdate).toLocaleString()}>
          {"Published " + prettydate.format(new Date(blogPost.publishdate))}
        </h5>;
    const updatedDateComponent =
        <h5 title={new Date(blogPost.updateddate).toLocaleString()}>
          {"Updated " + prettydate.format(new Date(blogPost.updateddate))}
        </h5>;


    if (blogPost.publishdate === blogPost.updateddate) {
      return publishDateComponent;
    } else {
      return (
        <div>
          {publishDateComponent}
          {updatedDateComponent}
        </div>
      );
    }
  };

  // PostReader load success component function
  /**
   * takes the blog post and its properties and turns it into JSX
   * @param {object} blogPost the blogpost object with data
   * @returns JSX 
   */
  const readerComponent = (blogPost) => (
    <div className={'postreader'}>
      <h1>{blogPost.title}</h1>
      <h4>{blogPost.author}</h4>
      {showDates()}
      <div>{blogPost.permissions}</div>
      {/* Extra author controls */}
      <div className='post-reader-authorcontrols'>
        {(blogPost.author === user?.username)?<button onClick={handleEditPost}>Edit Post</button>:<></>}
        {(blogPost.author === user?.username)?<button onClick={handleDeletePost}>Delete Post</button>:<></>}
      </div>

      {/* Make sure to include the ql-snow and ql-editor classes for styling */}
      <pre className='post-reader-content ql-snow ql-editor' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(blogPost.content)}}></pre>
    </div>
  );

  // PostReader load failure component function
  /**
   * takes the blog post and its error properties and turns it into JSX
   * @param {object} blogPost the blogpost object with data about the error
   * @returns JSX
   */
  const failureComponent = (blogPost) => (
    <>
      <div>Error</div>
      <div>Status Code: {blogPost.statusCode}</div>
    </>
  );

  /**
   * Checks the blogPost.error property to see whether to
   * render the failureComponent or the successComponent
   * @returns JSX
   */
  const componentChooser = () => {
    if (blogPost.error) {
      return failureComponent(blogPost);
    }
    else {
      return readerComponent(blogPost);
    }
  }

  // component return function
  return(
    <div>
      {/* If blogPost is undefined, the component has not loaded yet */}
      {(blogPost === undefined)?loadingComponent:componentChooser()}
    </div>
  );
}
