// sanitization module
const sanitizeHtml = require('sanitize-html');

// database module
const db = require('./db.js');


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
 * Retrieves 1 blog post by uuid. Permissions setting of the blog post and the client's current authentication
 * will affect whether the blogpost is sent to the client or not.
 * @param {import('express').Request} req client request (req.user may be defined from middleware)
 * @param {import('express').Response} res response which should return blog posts
 */
exports.getBlogPost = async (req, res) => {
  // find the blogpost with the corresponding ID
  const blogPost = await db.selectOneBlogPost(req.params.id.toLowerCase());

  // if it was not found, return a 404 response
  if (blogPost == null) {
    res.status(404).send();
    return;
  }
  
  // if it was found and it doesn't have the 'public'/'unlisted' permissions setting, permissions need to be handled
  switch (blogPost.permissions) {
    case 'drafts': // same as private
    case 'private':
      // check if the user is logged in and the username matches the author
      if (req.user?.username !== blogPost.author) {
        // if it doesn't, return a 404 (it should appear as if it was missing)
        res.status(404).send();
        return;
      }
      break;

    case 'users':
      // check if the user is just logged in
      if (req.user === undefined) {
        // if the user is not logged in, return a 401, indicating the need for authentication
        res.status(401).send();
        return;
      }
      break;

    // if the permission is either public/unlisted, then nothing else needs to be done
    default:
      break;
  }
  
  // if this point was reached, then we can send the blogpost
  res.status(200).json(blogPost);
  return;
}

/**
 * Retrieves blog posts. The blog posts that are retrieved will depend on the authentication
 * of the client.
 * @param {import('express').Request} req client request (req.user may be defined from middleware)
 * @param {import('express').Response} res response which should return blog posts
 */
exports.getBlogPosts = async (req, res) => {
  // get the blogposts from the database
  const blogPosts_ = await db.selectBlogPosts(req.user);

  // sort by date before providing the blogposts
  blogPosts_.sort((postA, postB) => {
    return new Date(postB.updateddate) - new Date(postA.updateddate);
  })

  // send the dummy data
  res.json(blogPosts_);
};

/**
 * Creates a blog post
 * @param {import('express').Request} req client request which should contain info about the blog post
 * @param {import('express').Response} res response identifying if the blog post was successfully created
 */
exports.createBlogPost = async (req, res) => {
  // retrieve the title, content, and permissions from the request body
  const {title, content, permissions} = req.body;

  // if either are undefined, respond with status code 400
  if (title === undefined || content === undefined) {
    res.status(400).send();
    return;
  }

  // otherwise, create the new blogpost with the title and content set
  const newBlogPost = {};
  newBlogPost.author = req.user.username;
  newBlogPost.title = title?title:'Untitled Post'; // Untitled Post is a default name
  newBlogPost.permissions = permissions?permissions:'public'; // public by default
  newBlogPost.publishdate = new Date().toISOString();
  newBlogPost.updateddate = newBlogPost.publishdate;
  // sanitize the content received from the client
  newBlogPost.content = sanitizeHtml(content, sanitizeHtmlOptions);

  // add it to the blog post database
  const insertedBlogPost = await db.insertNewBlogPost(newBlogPost);

  // if any errors occurred in insertion, send an error response
  if (insertedBlogPost == null) {
    res.status(400).send();
    return;
  }
  res.status(201).json(insertedBlogPost);
};

/**
 * Updates an existing blog post
 * @param {import('express').Request} req client request containing the updated blog post data
 * @param {import('express').Response} res server response indicating update status
 */
exports.updateExistingBlogPost = async (req, res) => {
  // get the UUID in the parameters
  const {id} = req.params;

  // Find the corresponding blog post in the database with the ID
  const blogPost = await db.selectOneBlogPost(id);
  
  // If there is no blogpost, return a 404 status code
  if (blogPost == null) {
    res.status(404).send();
    return;
  }

  // If there is a blogpost, verify that the author is the same as the user (401 if not)
  if (blogPost.author !== req.user.username) {
    res.status(401).send();
    return;
  }

  // At this stage, a blogPost with the correct ID and correct author has been found.
  //  This item will be updated with the new information if they are not undefined, otherwise it will be omitted.
  const {title, content, permissions} = req.body;
  blogPost.title = (title !== undefined)?title:blogPost.title;
  blogPost.content = (content !== undefined)?sanitizeHtml(content, sanitizeHtmlOptions):blogPost.content;
  blogPost.permissions = (permissions !== undefined)?permissions:blogPost.permissions;
  blogPost.updateddate = new Date().toISOString(); // set the updated date to be now
  // update the item in the database
  const updatedBlogPost = await db.updateExistingBlogPost(blogPost);
  // if any errors occurred in updating, send an error response
  if (updatedBlogPost == null) {
    res.status(400).send();
    return;
  }
  // send the updated blogpost in the response
  res.status(200).json(updatedBlogPost);
}

/**
 * Deletes a blog post with a specified id. The authenticated user must be the author
 * @param {import('express').Request} req Client request to delete blog post, contains id parameter
 * @param {import('express').Response} res Server response
 */
exports.deleteBlogPost = async (req, res) => {
  const {id} = req.params;
  const {username} = req.user;

  // delete the blog post
  const deletionResult = await db.deleteBlogPost(id, username);

  // deletion failure case: not found
  if (deletionResult === false) {
    return res.status(404).send();
  }
  // deletion failure case: error occurred
  else if (deletionResult === undefined || deletionResult === null) {
    return res.status(500).send();
  }

  // deletion success case
  return res.status(204).send();
};
