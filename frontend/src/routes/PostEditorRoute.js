import { Redirect, useParams } from "react-router-dom";
import PostEditor from "../components/PostEditor";
import { useEffect, useState } from "react";
import axios from "axios";

/**
 * Route to render the PostEditor which optionally receives a UUID. If provided,
 * then an existing post is being edited (which requires permission validation through the PostEditor)
 * @param {object} props properties to pass, specifically the UUID of a post to edit
 * @return {PostEditor}
 */
export default function PostEditorRoute(props) {
  // == State to keep track of
  // used when checking if the current user is allowed to edit the post (null = loading)
  const [allowEdit, setAllowEdit] = useState(null);
  // used for setting the values for the post editor
  const [postData, setPostData] = useState(undefined);

  const params = useParams();
  const postID = params.id;
  
  // Checks if the user can edit the post
  useEffect(() => {
    /**
     * Verifies if the user is allowed to edit the post
     */
    const checkIfUserCanEditPost = () => {
      // This is needed to update the component to prepare for a re-render, primarily when
      //  the user is going from editing one post to editing another post (or no post at all)
      setAllowEdit(null);

      // if postID is undefined, the user is allowed to edit
      if (postID == null) {
        setAllowEdit(true);
        return; // prevent the axios requests from going through
      }

      // Make two GET requests, one for post and one for current user
      const postPromise = axios.get(`http://localhost:3010/v1/blogposts/${postID}`, { withCredentials: true });
      const userPromise = axios.get(`http://localhost:3010/v1/user/`, { withCredentials: true });
    
      // wait for both promises to resolve
      Promise.all([postPromise, userPromise])
        .then((resolvedValues) => {
          const [postValue, userValue] = resolvedValues;
          const userCanEdit = postValue.data.author === userValue.data.username;
          // store the post id, title, and content only if the author and username match
          if (userCanEdit) {
            setPostData( {id: postID, title: postValue.data.title, content: postValue.data.content} );
          }
          // allow the user to edit the post if the post author and the current user matches
          setAllowEdit(userCanEdit);
        })
        .catch(() => {
          // if there was an error, do not allow the user to edit
          setAllowEdit(false);
        });
    };
    checkIfUserCanEditPost();
  }, [postID]);

  // Conditional rendering: if allowEdit is null (i.e., loading), render nothing
  if (allowEdit === null) {
    return (<></>);
  }
  // Otherwise, if allowEdit is false (i.e., no permission, or bad UUID, redirect to main)
  else if (allowEdit === false) {
    return <Redirect to='/' />
  }
  else {
    return (
      // Render the PostEditor.
      <PostEditor postData={postData} />
    );
  }
}
