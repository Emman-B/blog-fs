// dummy data
const blogPosts = require('./dummy/posts.json');

/**
 * Retrieves blog posts
 * @param {import('express').Request} req client request
 * @param {import('express').Response} res response which should return blog posts
 */
exports.getBlogPosts = async (req, res) => {
  console.warn('[getBlogPosts] Dummy data is being read!');

  // send the dummy data
  res.json(blogPosts);
};

/**
 * Creates a blog post
 * @param {import('express').Request} req client request which should contain info about the blog post
 * @param {import('express').Response} res response identifying if the blog post was successfully created
 */
exports.createBlogPost = async (req, res) => {
  console.warn('[createBlogPost] No authentication is being done');

  // retrieve the title and content from the request body
  const {title, content} = req.body;

  // if either are undefined, respond with status code 400
  if (title === undefined || content === undefined) {
    res.status(400).send();
  }

  // otherwise, create the new blogpost with the title and content set
  const newBlogPost = {};
  newBlogPost.author = 'Dummy_Author';
  newBlogPost.title = title;
  newBlogPost.publishDate = new Date().toISOString();
  newBlogPost.updatedDate = newBlogPost.publishDate;
  newBlogPost.content = content;

  // add it to the blog post database
  console.warn('[createBlogPost] Dummy data is being written into');
  blogPosts.push(newBlogPost);

  res.status(201).json(newBlogPost);
};
