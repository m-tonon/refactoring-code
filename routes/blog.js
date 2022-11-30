const express = require('express');

const Post = require('../models/post');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome', { csrfToken: req.csrfToken() });
});

router.get('/admin', async function (req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render('401');
  }

  const posts = await Post.fetchAll(); // this fetch all posts with the static method

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: '',
      content: '',
    };
  }

  req.session.inputData = null;

  res.render('admin', {
    posts: posts,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

router.post('/posts', async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === '' ||
    enteredContent.trim() === ''
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect('/admin');
    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const post = new Post(enteredTitle, enteredContent);
  await post.save();//trig the save method that actually stores data on db.

  res.redirect('/admin');
});

router.get('/posts/:id/edit', async function (req, res) {
  const post = new Post(null,null,req.params.id);
  await post.fetch(); // trig the fetch method on Post class

  if (!post.title || !post.content) {
    return res.render('404'); // 404.ejs is missing at this point - it will be added later!
  }

  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      title: post.title,
      content: post.content,
    };
  }

  req.session.inputData = null;

  res.render('single-post', {
    post: post,
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
});

router.post('/posts/:id/edit', async function (req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;
  
  if (
    !enteredTitle ||
    !enteredContent ||
    enteredTitle.trim() === '' ||
    enteredContent.trim() === ''
  ) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid input - please check your data.',
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect(`/posts/${req.params.id}/edit`);
    return; 
  }
  
    // create a new post based on the model
  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save(); // stores the post on db

  res.redirect('/admin');
});

router.post('/posts/:id/delete', async function (req, res) {
  const post = new Post(null,null,req.params.id);
  await post.delete();
  res.redirect('/admin');
});

module.exports = router;
