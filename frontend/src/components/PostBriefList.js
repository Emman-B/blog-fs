import axios from 'axios';
import { useState, useEffect } from "react";

import PostBrief from '../components/PostBrief';
import Divider from './Divider';

/**
 * Retrieves the blog psots using the API
 * @param {string} url URL for blogpost
 * @param {function} setBlogPosts sets the blog posts
 */
function getBlogPosts(url, setBlogPosts) {
  axios.get(url).then((response) => {
    setBlogPosts(response.data);
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

  useEffect(() => {
    getBlogPosts('http://localhost:3010/v1/blogposts', setBlogPosts);
  }, []);

  // component return function
  return (
    <div>
      {blogPosts.map((blogPost) => {
        return (
          <>
            <PostBrief postAuthor={blogPost.author} postDate={new Date(blogPost.updatedDate).toLocaleString()} postTitle={blogPost.title} postContent={blogPost.content} />
            <Divider />
          </>
        );
      })}
    </div>
  );
}

export default PostBriefList;
