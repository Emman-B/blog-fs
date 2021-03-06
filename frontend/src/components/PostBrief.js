import './PostBrief.css';
import { useState } from "react";
import { useHistory } from 'react-router';
import DOMPurify from 'dompurify';
import prettydate from 'pretty-date';

/**
 * Provides a brief summary to a post
 * @param {object} props object that contains post information
 * @returns JSX
 */
function PostBrief(props) {
  // state to keep track of
  // all of the post information is here with default values
  const [postID/*, setPostID */]          = useState((props.postID !== undefined)?props.postID:'');
  const [postTitle  /*, setPostTitle*/]   = useState((props.postTitle !== undefined)?props.postTitle:'Untitled');
  const [postAuthor /*, setPostAuthor*/]  = useState((props.postAuthor !== undefined)?props.postAuthor:'Anonymous');
  const [postDate   /*, setPostDate*/]    = useState((props.postDate !== undefined)?props.postDate:new Date().toLocaleDateString());
  const [postDates   /*, setPostDates*/]    = useState((props.postDates !== undefined)?props.postDates:{publish: new Date(), updated: new Date()});
  const [postPermissions/* setPostPermissions*/] = useState((props.postPermissions !== undefined)?props.postPermissions:'public');
  const [postContent/*, setPostContent*/] = useState((props.postContent !== undefined)?props.postContent:
    `PLACEHOLDER Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nam augue nulla, lacinia fringilla gravida sit amet, scelerisque
    vel felis. Mauris vitae scelerisque ante. Aliquam erat volutpat.
    Donec hendrerit massa nec odio lobortis, eget tempor orci erat curae.`);

  // react router dom history hook for use in handling clicks
  const history = useHistory();

  /**
   * Makes a prettier date, also checks if the blog post wasn't
   * updated.
   */
  const makeDate = () => {
    if (postDates.publish === postDates.updated) {
      return "Published " + prettydate.format(new Date(postDate));
    }
    return "Updated " + prettydate.format(new Date(postDate));
  }

  /**
   * Takes content with HTML tags and retrieves just the inner text
   * @param {string} content content with HTML tags
   * @returns text content
   */
  const getTextContent = (content) => {
    const tempEle = document.createElement('div');
    tempEle.innerHTML = DOMPurify.sanitize(content);
    return tempEle.innerText;
  }

  /**
   * handles when a post gets clicked
   */
  const handleClick = () => {
    if (postID) {
      // go to the reader route with the post
      history.push(`/reader/${postID}`);
    }
  }

  /**
   * This looks at the post permissions returns a string to append to the
   * element's class name(s).
   * @returns string for appending to a class name
   */
  const appendClassForPermissions = () => {
    switch (postPermissions) {
      case 'unlisted':
        return 'post-unlisted'
      case 'drafts':
        return 'post-drafts';
      default:
        return '';
    }
  }

  // component return function
  return (
    <article className={'post ' + appendClassForPermissions()} onClick={handleClick}>
      {/* Post-title class will use white-space: pre-line to preserve whitespace */}
      <h1 className='post-title'>{postTitle}</h1>
      <h4 className={'post-author-bar'} title={postDate}>{postAuthor}, {makeDate()}, {postPermissions}</h4>
      {/* Display the content (sanitize just in case) */}
      <div className='post-content'>
        {DOMPurify.sanitize(getTextContent(postContent))}
      </div>
    </article>
  );
};

export default PostBrief;