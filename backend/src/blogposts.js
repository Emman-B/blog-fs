// sanitization module
const sanitizeHtml = require('sanitize-html');
// uuid module
const { v4: uuidv4 } = require('uuid');
// dummy data of blog posts
const blogPosts = require('./dummy/posts.json');

/**
 * Retrieves blog posts
 * @param {import('express').Request} req client request
 * @param {import('express').Response} res response which should return blog posts
 */
exports.getBlogPosts = async (req, res) => {
  console.warn('[getBlogPosts] Dummy data is being read!');

  // sort by date before providing the blogposts
  blogPosts.sort((postA, postB) => {
    return new Date(postB.updatedDate) - new Date(postA.updatedDate);
  })
  // send the dummy data
  res.json(blogPosts);
};

/**
 * Creates a blog post
 * @param {import('express').Request} req client request which should contain info about the blog post
 * @param {import('express').Response} res response identifying if the blog post was successfully created
 */
exports.createBlogPost = async (req, res) => {
  // retrieve the title and content from the request body
  const {title, content} = req.body;

  // if either are undefined, respond with status code 400
  if (title === undefined || content === undefined) {
    res.status(400).send();
    return;
  }

  // otherwise, create the new blogpost with the title and content set
  const newBlogPost = {};
  // generate a new uuid
  newBlogPost.id = uuidv4();
  newBlogPost.author = req.user.username;
  newBlogPost.title = title?title:'Untitled Post'; // Untitled Post is a default name
  newBlogPost.permissions = 'public'; // Uses public for now, but will be something else when permissions are implemented
  newBlogPost.publishDate = new Date().toISOString();
  newBlogPost.updatedDate = newBlogPost.publishDate;
  // sanitize the content received from the client
  newBlogPost.content = sanitizeHtml(content);

  // add it to the blog post database
  console.warn('[createBlogPost] Dummy data is being written into');
  blogPosts.push(newBlogPost);

  res.status(201).json(newBlogPost);
};
