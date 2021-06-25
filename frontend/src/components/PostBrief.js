
function PostBrief() {

  // component return function
  return (
    <div>
      <h3>name of post</h3>
      <h4>John Doe, {new Date().toLocaleDateString()}</h4>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nam augue nulla, lacinia fringilla gravida sit amet, scelerisque
        vel felis. Mauris vitae scelerisque ante. Aliquam erat volutpat.
        Donec hendrerit massa nec odio lobortis, eget tempor orci erat curae.
      </div>
    </div>
  );
};

export default PostBrief;