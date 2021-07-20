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
 * Retrieves 1 blog post by uuid. Permissions setting of the blog post and the client's current authentication
 * will affect whether the blogpost is sent to the client or not.
 * @param {import('express').Request} req client request (req.user may be defined from middleware)
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
  
  // if it was found and it doesn't have the 'public'/'unlisted' permissions setting, permissions need to be handled
  switch (blogPost.permissions) {
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
  console.warn('[getBlogPosts] Dummy data is being read!');

  // sort by date before providing the blogposts
  blogPosts.sort((postA, postB) => {
    return new Date(postB.updatedDate) - new Date(postA.updatedDate);
  })

  // filter depending on permissions of blog posts
  const sentBlogPosts = blogPosts.filter((blogPost) => {
    switch (blogPost.permissions) {
      case 'public': // public blogposts are available to all unauthenticated and authenticated users
        return true;
      case 'users': // users blogposts are available to all authenticated users
        return req.user !== undefined;
      case 'unlisted': // unlisted blogposts can be shown in this route to the author only, but are otherwise available to everyone with a link
        return (req.user?.username === blogPost.author);
      case 'private': // private blogposts are available only to the author
        return (req.user?.username === blogPost.author);
    }
  });

  // send the dummy data
  res.json(sentBlogPosts);
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
  // generate a new uuid
  newBlogPost.id = uuidv4();
  newBlogPost.author = req.user.username;
  newBlogPost.title = title?title:'Untitled Post'; // Untitled Post is a default name
  newBlogPost.permissions = (permissions)?permissions:'public'; // public by default
  newBlogPost.publishDate = new Date().toISOString();
  newBlogPost.updatedDate = newBlogPost.publishDate;
  // sanitize the content received from the client
  newBlogPost.content = sanitizeHtml(content, sanitizeHtmlOptions);

  // add it to the blog post database
  console.warn('[createBlogPost] Dummy data is being written into');
  blogPosts.push(newBlogPost);

  res.status(201).json(newBlogPost);
};
