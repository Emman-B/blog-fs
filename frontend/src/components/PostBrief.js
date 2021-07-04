import './PostBrief.css';
import { useState } from "react";

/**
 * Provides a brief summary to a post
 * @param {object} props object that contains post information
 * @returns JSX
 */
function PostBrief(props) {
  // state to keep track of
  // all of the post information is here with default values
  const [postTitle  /*, setPostTitle*/]   = useState((props.postTitle !== undefined)?props.postTitle:'Untitled');
  const [postAuthor /*, setPostAuthor*/]  = useState((props.postAuthor !== undefined)?props.postAuthor:'Anonymous');
  const [postDate   /*, setPostDate*/]    = useState((props.postDate !== undefined)?props.postDate:new Date().toLocaleDateString());
  const [postContent/*, setPostContent*/] = useState((props.postContent !== undefined)?props.postContent:
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    Nam augue nulla, lacinia fringilla gravida sit amet, scelerisque
    vel felis. Mauris vitae scelerisque ante. Aliquam erat volutpat.
    Donec hendrerit massa nec odio lobortis, eget tempor orci erat curae.`);

  // component return function
  return (
    <div>
      <h3>{postTitle}</h3>
      <h4>{postAuthor}, {postDate}</h4>
      <div className='post-content'>
        {postContent}
      </div>
    </div>
  );
};

export default PostBrief;