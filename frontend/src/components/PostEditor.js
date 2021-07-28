// Styles
import './PostEditor.css';
import 'react-quill/dist/quill.snow.css';

import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import { useHistory } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// options for react quill toolbar
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']                                         // remove formatting button
];

/**
 * This makes a POST request to the server to create a new blog post.
 * This also clears local storage of any drafts.
 * @param {string} title Title of blog post
 * @param {string} permissions Permissions of the blog post
 * @param {string} content Content of blog post
 * @param {object} history Method of returning to main page after posting
 */
function postNewBlogPost(title, permissions, content, history) {
  // make post request
  axios.post('http://localhost:3010/v1/blogposts', {title: title, content: DOMPurify.sanitize(content), permissions: permissions}, {withCredentials: true})
  .then((response) => {
    history.push('/');
  })
  .catch((error) => {
    console.error(error);
  });
}

/**
 * Updates an existing blogpost with data
 * @param {string} title title to provide
 * @param {string} permissions permissions to use
 * @param {string} content content of the blogpost
 * @param {object} history react router dom history object for redirection
 * @param {string} postID ID of the blogpost to update
 */
function putExistingBlogPost(title, permissions, content, history, postID) {
  // make a PUT request with the data being edited
  axios.put(`http://localhost:3010/v1/blogposts/${postID}`,
      {title: title, content: DOMPurify.sanitize(content), permissions: permissions},
      {withCredentials: true})
    .then((response) => {
      history.push('/');
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function PostEditor(props) {
  // == State to keep track of
  // checks to see if the form was modified in any way
  const [isDirty, setIsDirty] = useState(false);
  // verifies if a submission had occurred
  const [isSubmitting, setIsSubmitting] = useState(false);
  // title of the post (set in the input element for the title)
  const [postTitle, setPostTitle] = useState(props.postData?.title);
  // content of the post (set in the react quill editor)
  const [postContent, setPostContent] = useState(props.postData?.content);

  // reference for the permissions
  const permissionsRef = useRef('public');
  // react router history
  const history = useHistory();

  // get the current post ID
  const postID = props.postData?.id;

  /**
   * Handles when a post is being submitted
   */
  const handleSubmitting = () => {
    // note that the post is being submitted (to prevent a prompt)
    setIsSubmitting(true);

    if (postID) {
      // update the existing blogpost if a postID was provided
      putExistingBlogPost(postTitle, permissionsRef.current.value, DOMPurify.sanitize(postContent), history, postID);
    }
    else {
      // create a new blogpost
      postNewBlogPost(postTitle, permissionsRef.current.value, DOMPurify.sanitize(postContent), history);
    };
  }


  useEffect(() => {
    /**
     * handles drafts when a post is not being submitted
     */
    const handleDraftSubmission = () => {
      // do nothing if the history changes due to submission or no data was modified
      if (isSubmitting || !isDirty) return;

      if (postID) {
        // update the existing blogpost if a postID was provided
        putExistingBlogPost(postTitle, 'drafts', DOMPurify.sanitize(postContent), history, postID);
      }
      else {
        // create a new blogpost
        postNewBlogPost(postTitle, 'drafts', DOMPurify.sanitize(postContent), history);
      };
    };

    // Clunky solution for deciding when to save drafts
    //  Create a listener for when history changes, meaning a draft may need saving.
    const unlisten = history.listen(() => {
      if (!isSubmitting && isDirty) {
        const saveDraft = window.confirm('Would you like to save a draft? (Unsaved changes will be lost!)')
        if (saveDraft) {
          handleDraftSubmission();
        }
      }
    });

    return () => {
      unlisten();
    };
  }, [history, postContent, postID, postTitle, isSubmitting, isDirty]);

  // component return function
  return(
    // On any input in the form, set the dirty flag to true
    <form onInput={() => setIsDirty(true)}>
      <header>
        <h4>New Post</h4>
        <div>
          <select ref={permissionsRef} defaultValue={props.postData?.permissions}>
            <option value='public'>Public</option>
            <option value='users'>Users</option>
            <option value='unlisted'>Unlisted</option>
            <option value='private'>Private</option>
          </select>
          <button
            id='submit-button'
            type='submit'
            onClick={handleSubmitting}>
              Post
          </button>
        </div>
      </header>

      {/* Post Title Input */}
      <input 
        type='text'
        placeholder='Post Title'
        // When any change occurs, save it into local storage
        onChange={(event) => setPostTitle(event.target.value)}
        defaultValue={postTitle}
      />
      {/* Post Content Editor */}
      <ReactQuill 
        modules={{toolbar: toolbarOptions}}
        onChange={(content) => {
            setPostContent(content);
            setIsDirty(true);
          }}
        defaultValue={postContent}
      />
    </form>
  );
}
