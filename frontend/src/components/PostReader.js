import axios from 'axios';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { uuidIsValid } from '../utilities/uuidRegexTester.js';
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

  // validate the postID passed in is a valid UUID
  const isUUID = uuidIsValid(props.postID);

  // if the postID is not a valid UUID, redirect back to root
  //  (so this is also another component return function) (refactor to be in the component return function later)
  if (!isUUID) {
    return <Redirect to='/' />
  }

  // PostReader loading component
  const loadingComponent = (
    <div>Loading</div>
  );

  // PostReader load success component
  const readerComponent = (blogPost) => (
    <>
      <div>{blogPost.id}</div>
      <div>{blogPost.author}</div>
      <div>{blogPost.title}</div>
      <div>{blogPost.permissions}</div>
      <div>{blogPost.publishDate}</div>
      <div>{blogPost.updatedDate}</div>
      <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(blogPost.content)}}></div>
    </>
  );

  // PostReader load failure component
  const failureComponent = (blogPost) => (
    <>
      <div>Error</div>
      <div>Status Code: {blogPost.statusCode}</div>
    </>
  );

  // component return function
  return(
    <div>
      {(blogPost === undefined)?loadingComponent:(!blogPost.error)?readerComponent(blogPost):failureComponent(blogPost)}
    </div>
  );
}
