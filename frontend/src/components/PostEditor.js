// Styles
import './PostEditor.css';
import 'react-quill/dist/quill.snow.css';

import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import { Prompt, useHistory } from 'react-router-dom';
import { useRef, useState } from 'react';
import axios from 'axios';

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
    // clear local storage of previous data
    cleanUpDraftData();
    // return to main home page
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
  // get the current post ID
  // const postID = props.id;

  const handleSubmitting = () => {
    // note that the post is being submitted (to prevent a prompt)
    setIsSubmitting(true);
    // make the post request
    postNewBlogPost(postTitle, permissionsRef.current.value, DOMPurify.sanitize(postContent), history);
  };

  // component return function
  return(
    // On any input in the form, set the dirty flag to true
    <form onInput={() => setIsDirty(true)}>
      <Prompt
        when={isDirty && !isSubmitting}
        message={(location, action) => `Are you sure you want to leave? A draft will be saved. Location '${location} Action: ${action}'`}
      />
      <header>
        <h4>New Post</h4>
        <div>
          <select ref={permissionsRef}>
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

      <input 
        type='text'
        placeholder='Post Title'
        // When any change occurs, save it into local storage
        onChange={(event) => setPostTitle(event.target.value)}
        defaultValue={postTitle}
      />
      <ReactQuill 
        modules={{toolbar: toolbarOptions}}
        // When any change occurs, save it into local storage
        onChange={(content) => setPostContent(content)}
        defaultValue={postContent}
      />
    </form>
  );
}

/**
 * (Helper function)
 * Removes any draft data saved into local storage by the PostEditor.
 */
export function cleanUpDraftData() {
  console.warn('Warning: cleanUpDraftData is going to be deprecated');
  localStorage.removeItem('draftTitle');
  localStorage.removeItem('draftContent');
}
