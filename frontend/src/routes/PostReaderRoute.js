
import { Redirect } from "react-router-dom";
import { uuidIsValid } from "../utilities/uuidRegexTester";
import PostReader from "../components/PostReader";

/**
 * Route to render the PostReader which requires a UUID. This will Redirect
 * to home if an invalid UUID was provided
 * @param {object} props properties to pass, specifically the UUID of a post to read
 * @returns {PostReader}
 */
export default function PostReaderRoute(props) {
  // get the postID from the params
  const postID = props.match.params.id;
  // validate the postID passed in is a valid UUID
  const isUUID = uuidIsValid(postID);

  // component return function
  return(
      (isUUID)?
        // if postID is valid, pass the postID to the PostReader component
        <PostReader postID={postID} /> :
        // if the postID is not a valid UUID, redirect back to root
        <Redirect to ='/' />
  );
}
