// dummy data
const blogPosts = require('./dummy/posts.json');

exports.getBlogPosts = async (req, res) => {
  console.warn('Dummy data is being read!');

  // send the dummy data
  res.json(blogPosts);
}
