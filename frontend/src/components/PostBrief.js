import { useState } from "react";

function PostBrief(props) {
  // state to keep track of
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
      <div>
        {postContent}
      </div>
    </div>
  );
};

export default PostBrief;