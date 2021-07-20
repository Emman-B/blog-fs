// sanitization module
const sanitizeHtml = require('sanitize-html');
// uuid module
const { v4: uuidv4 } = require('uuid');
// dummy data of blog posts
const blogPosts = require('./dummy/posts.json');


// From sanitize-html, the options
const sanitizeHtmlOptions = {
  allowedTags: [
    "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
    "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
    "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
    "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
    "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
    "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
    "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",

    "img"
  ],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: [ 'href', 'name', 'target' ],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    img: [ 'src' ],
    '*': [ 'style', 'class' ],
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
  // URL schemes we permit
  allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false
}

/**
 * Retrieves 1 blog post by uuid
 * @param {import('express').Request} req client request
 * @param {import('express').Response} res response which should return blog posts
 */
exports.getBlogPost = async (req, res) => {
  console.warn('[getBlogPosts] Dummy data is being read!');

  // find the blogpost with the corresponding ID
  const blogPost = blogPosts.find((element) => element.id.toLowerCase() === req.params.id.toLowerCase());

  // if it was not found, return a 404 response
  if (blogPost == null) {
    res.status(404).send();
    return;
  }
  
  // if it was found, return it as the response
  res.status(200).json(blogPost);
  return;
}

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
  newBlogPost.content = sanitizeHtml(content, sanitizeHtmlOptions);

  // add it to the blog post database
  console.warn('[createBlogPost] Dummy data is being written into');
  blogPosts.push(newBlogPost);

  res.status(201).json(newBlogPost);
};
