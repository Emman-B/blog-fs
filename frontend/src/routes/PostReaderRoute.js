
import PostReader from "../components/PostReader";

export default function PostReaderRoute(props) {
  // component return function
  return(
    // Give the post reader the id from the url route path
    <PostReader postID={props.match.params.id} />
  );
}
