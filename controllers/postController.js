const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Category = require('../models/Category');
const jwt = require('jsonwebtoken');

exports.getAllPosts = (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;
    const user = jwt.decode(req.cookies.token);
    const isAdmin = user && user.role === 'admin';
    const filters = {
        categories: req.query.categories ? req.query.categories.split(',') : null,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        status: isAdmin ? null : 'active',
    };
    const orderBy = req.query.orderBy || 'likes';

    Post.findAll(offset, pageSize, filters, orderBy, (err, posts) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(posts);
    });
};

exports.getPostById = (req, res) => {
    const postId = req.params.id;
    Post.findById(postId, (err, post) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    });
};

exports.getCommentsByPostId = (req, res) => {
    const postId = req.params.id;
    Comment.findByPostId(postId, (err, comments) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(comments);
    });
};

exports.getCategoriesByPostId = (req, res) => {
    const postId = req.params.id;
    Category.findByPostId(postId, (err, categories) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(categories);
    });
};

exports.getLikesByPostId = (req, res) => {
    const postId = req.params.id;
    Like.findAllByTargetId(postId, 'post', (err, likes) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(likes);
    });
};

exports.createPost = (req, res) => {
    const { title, content, categories } = req.body;
    const authorId = req.user.id;

    if (!title || !content || !categories) {
        return res.status(400).json({ message: 'Title, content, and categories are required' });
    }

    Post.create(authorId, title, content, categories, (err, postId) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post created', postId });
    });
};

exports.createComment = (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;
    const authorId = req.user.id;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    Comment.create(authorId, postId, content, (err, commentId) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Comment added', commentId });
    });
};

exports.likePost = (req, res) => {
    const postId = req.params.id;
    const authorId = req.user.id;
    const type = req.body.type;
    if(!type) return res.status(400).json({ error: 'unknown type, allowed types are "like" or "dislike"' });
    Like.getLike(authorId, postId, 'post', (err, exists) => {
        if (err) return res.status(500).json({ error: err.message });
        if (exists) return res.status(400).json({ message: `Already ${type}d` });

        const callback = (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: `Post ${type}d` });
        };

        Like.create(authorId, postId, 'post', type, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            if (type === 'like') Post.incrementLikes(postId, callback);
            else if (type === 'dislike') Post.incrementDislikes(postId, callback);
        });
    });
};

exports.removeLike = (req, res) => {
    const postId = req.params.id;
    const authorId = req.user.id;

    Like.getLike(authorId, postId, 'post', (err, like) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!like) return res.status(404).json({ error: 'Like does not exist' });
        const type = like.type;

        const callback = (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: `${type} removed` });
        };

        Like.delete(authorId, postId, 'post', (err) => {
            if (err) return res.status(500).json({ error: err.message });
            if (type === 'like') Post.decrementLikes(postId, callback);
            else if (type === 'dislike') Post.decrementDislikes(postId, callback);
        });
    });
};

exports.updatePost = (req, res) => {
    const postId = req.params.id;
    const { title, content, categories, isActive } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    Post.findById(postId, (err, post) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to do that' });
        }

        const updatedTitle = title || post.title;
        const updatedContent = content || post.content;
        const updatedStatus = isActive === 'true';

        Post.updateById(postId, updatedTitle, updatedContent, categories, updatedStatus, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post updated' });
        });
    });
};

exports.deletePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    Post.findById(postId, (err, post) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.author_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Post.deleteById(postId, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Post deleted' });
            Like.deleteAllByTargetId(postId, 'post', () => {});
        });
    });
};
