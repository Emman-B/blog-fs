// styles
import './PostReader.css';
// modules
import axios from 'axios';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

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
 * Post Reader main component function
 * @param {object} props properties passed onto it from parent component
 * @returns JSX, the PostReader component
 */
export default function PostReader(props) {
  // state to keep track of
  // Keep track of the blog post object
  const [blogPost, setBlogPost] = useState(undefined);

  // side effects for components
  useEffect(() => {
    // retrieve a blog post
    getBlogPost(props.postID, setBlogPost);
  }, [props.postID]);

  // PostReader loading component
  const loadingComponent = (
    <div>Loading</div>
  );

  // PostReader load success component function
  /**
   * takes the blog post and its properties and turns it into JSX
   * @param {object} blogPost the blogpost object with data
   * @returns JSX 
   */
  const readerComponent = (blogPost) => (
    <>
      <pre><h1>{blogPost.title}</h1></pre>
      <h4>{blogPost.author}</h4>
      <h5>{blogPost.publishDate}</h5>
      <h5>{blogPost.updatedDate}</h5>
      <div>{blogPost.permissions}</div>
      {/* Make sure to include the ql-snow and ql-editor classes for styling */}
      <pre className='post-reader-content ql-snow ql-editor' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(blogPost.content)}}></pre>
    </>
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
