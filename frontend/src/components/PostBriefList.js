import axios from 'axios';
import React, { useState, useEffect } from "react";

import PostBrief from '../components/PostBrief';
import Divider from './Divider';

/**
 * Retrieves the blog psots using the API
 * @param {string} url URL for blogpost
 * @param {function} setBlogPosts sets the blog posts
 */
function getBlogPosts(url, setBlogPosts) {
  axios.get(url, { withCredentials: true }).then((response) => {
    setBlogPosts(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
}

/**
 * Uses the API to get blog posts and turn them into a list of PostBrief components
 * @param {object} props 
 * @returns JSX
 */
function PostBriefList(props) {
  // state to keep track of
  // all of the blog posts are here
  const [blogPosts, setBlogPosts] = useState([]);

  // side effects for components
  useEffect(() => {
    // gets all the blog posts
    getBlogPosts('http://localhost:3010/v1/blogposts', setBlogPosts);
  }, []);

  // component return function
  return (
    <div>
      {blogPosts.map((blogPost) => {
        return (
          <React.Fragment key={blogPost.id}>
            <PostBrief 
              postID={blogPost.id}
              postAuthor={blogPost.author}
              postDate={new Date(blogPost.updateddate).toLocaleString()}
              postTitle={blogPost.title}
              postPermissions={blogPost.permissions}
              // this will be the full content, including HTML. PostBrief will handle sanitizing it and getting its text content.
              postContent={blogPost.content} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default PostBriefList;
