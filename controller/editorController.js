const user = require("../models/authModel");
const blogModel = require("../models/blogModel");

exports.getHome = async (req, res) => {
  const user = req.session && req.session.user ? req.session.user : "";
  let blogs = await blogModel.find().populate("author", "userName");
  res.render("home", {
    pageTitle: "Welcome Home",
    isLoggedIn: req.isLoggedIn,
    user: user,
    blogs: blogs,
  });
};

//await blogModel.find({ author: userId })?
// Find all blog documents where the author field matches the given userId.

// what populate('author') do ?
// “Hey, for every blog, go look at the author field,
// find that _id in the User collection,
// and replace the ObjectId with the full User document.”

// this giving all the blogs written by login user
exports.getBlogPage = async (req, res) => {
  const user = req.session && req.session.user ? req.session.user : "";
  const blogs = await blogModel.find({ author: user._id }).populate("author"); // was using userId direct instead of author, causing problem because author has the info for this userId ;
  res.render("Blog", {
    isLoggedIn: req.isLoggedIn,
    pageTitle: "Blogs-List",
    user,
    blogs: blogs,
  });
};

exports.getReadBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const user = req.session && req.session.user ? req.session.user : "";
  const blog = await blogModel.findById(blogId).populate("author"); //i was not using populate that's why the author name was not visible in ui
  res.render("read-blog", {
    pageTitle: `${blog.title} : `,
    isLoggedIn: req.isLoggedIn,
    user,
    blog,
  });
};

exports.getCreateBlog = (req, res) => {
  const user = req.session && req.session.user ? req.session.user : null;
  res.render("create-Blog", {
    isLoggedIn: req.isLoggedIn,
    pageTitle: "create Blog",
    user,
    blog: null, // null will ensure that he has not even a single blog although it might be ,, was using blog : [] causing error
  });
};

exports.postCreateBlog = async (req, res) => {
  const { title, content, author, credits } = req.body;
  const blog = new blogModel({ title, content, author, credits });
  await blog
    .save()
    .then(() => {
      console.log("data saved successfully:");
    })
    .catch((err) => {
      console.log("error in saving Data to db :", err);
    });
  res.redirect("/blog");
};

// i was expecting to get the updation just by get routing but its not true

exports.getUpdateBlog = async (req, res) => {
  const user = req.session && req.session.user ? req.session.user : "";
  const blogId = req.params.blogId;
  const blog = await blogModel.findByIdAndUpdate(blogId);

  res.render("create-Blog", {
    pageTitle: "Edit-Blog",
    isLoggedIn: req.isLoggedIn,
    user,
    blog,
  });
};

exports.postUpdateBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const { title, content, credits } = req.body;
  await blogModel.findByIdAndUpdate(
    blogId,
    { title, content, credits },
    { new: true }
  );

  res.redirect("/blog");
};

exports.postDeleteBlog = async (req, res) => {
  const blogId = req.params.blogId;
  const blog = await blogModel.findByIdAndDelete(blogId);

  res.redirect("/blog");
};
