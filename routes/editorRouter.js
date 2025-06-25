const express = require('express');
const editorController = require('../controller/editorController');

const editorRouter = express.Router();

editorRouter.get('/home', editorController.getHome);
editorRouter.get('/blog', editorController.getBlogPage);

editorRouter.get('/edit-blog', editorController.getCreateBlog);
editorRouter.post('/edit-blog', editorController.postCreateBlog);

editorRouter.get('/read-blog/:blogId', editorController.getReadBlog);
editorRouter.get("/edit-blog/:blogId", editorController.getUpdateBlog);
editorRouter.post("/edit-blog/:blogId", editorController.postUpdateBlog);
editorRouter.post("/delete-blog/:blogId", editorController.postDeleteBlog);


module.exports = editorRouter;