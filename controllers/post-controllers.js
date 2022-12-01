const Post = require('../models/post');
const validationSession = require('../util/validation-session');
const validation = require('../util/validation');

function getHome(req, res) {
  res.render('welcome');
}

async function getAdm (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render('401');
  }

  const posts = await Post.fetchAll(); // this fetch all posts with the static method

  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: '',
    content: '',
  });

  res.render('admin', {
    posts: posts,
    inputData: sessionErrorData,
  });
}

async function createPost (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (!validation.postIsValid(enteredTitle,enteredContent)) {
    validationSession.flashErrorsToSession(
      req, 
      {
        message: 'Invalid input - please check your data.',
        title: enteredTitle,
        content: enteredContent,
      }, // data parameter
      function (){ // action parameter
        res.redirect('/admin');
      })

    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();//trig the save method that actually stores data on db.

  res.redirect('/admin');
}

async function getSinglePost (req, res) {
  const post = new Post(null,null,req.params.id);
  await post.fetch(); // trig the fetch method on Post class

  if (!post.title || !post.content) {
    return res.render('404'); // 404.ejs is missing at this point - it will be added later!
  }

  sessionErrorData = validationSession.getSessionErrorData(req, {
    title: post.title,
    content: post.content
  }); // the second parameter will pre populate the forms on update post
  
  res.render('single-post', {
    post: post,
    inputData: sessionErrorData,
  });
}

async function updatePost (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  
  if (
    !validation.postIsValid(enteredTitle,enteredContent)
  ) {
    validationSession.flashErrorsToSession(
      req, 
      {
        message: 'Invalid input - please check your data.',
        title: enteredTitle,
        content: enteredContent,
      },
      function (){
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );

    return; 
  }
  
    // create a new post based on the model
  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save(); // stores the post on db

  res.redirect('/admin');
}

async function deletePost (req, res) {
  const post = new Post(null,null,req.params.id);
  await post.delete();
  res.redirect('/admin');
}

module.exports = {
  getHome: getHome,
  getAdm: getAdm,
  createPost: createPost,
  getSinglePost: getSinglePost,
  updatePost: updatePost,
  deletePost: deletePost
}