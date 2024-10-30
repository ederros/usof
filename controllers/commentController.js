const Comment = require('../models/Comment');
const Like = require('../models/Like');

exports.getCommentById = (req, res) => {
    const commentId = req.params.id;
    Comment.findById(commentId, (err, result) => {
        if (err) return res.status(404).json({ error: err.message });
        res.status(200).json(result);
    });
};

exports.getLikeByCommentId = (req, res) => {
    const commentId = req.params.id;
    Like.findAllByTargetId(commentId, 'comment', (err, result) => {
        if (err) return res.status(404).json({ error: err.message });
        res.status(200).json(result);
    });
};

exports.createLikeByCommentId = (req, res) => {
    const { type } = req.body; // Changed req.query to req.body
    if (!type) return res.status(400).json({ error: 'Type is required' });
    const commentId = req.params.id;
    
    const callback = (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: `Comment ${type}d` });
    };

    Like.getLike(req.user.id, commentId, 'comment', (err, exists) => {
        if (err) return res.status(500).json({ error: err.message });
        if (exists) return res.status(400).json({ message: `Already ${type}d` });

        Like.create(req.user.id, commentId, 'comment', type, (err) => {
            if (err) return res.status(404).json({ error: err.message });
            if (type === 'like') Comment.incrementLikes(commentId, callback);
            else if (type === 'dislike') Comment.incrementDislikes(commentId, callback);
        });
    });
};

exports.updateComment = (req, res) => {
    const commentId = req.params.id;
    const { content } = req.body; // Changed req.query to req.body
    if (!content) return res.status(400).json({ error: 'Content is required' });
    try {
        const usr = req.user;
        Comment.findById(commentId, (err, comment) => {
            if (err) return res.status(401).json({ error: err.message });
            if (!(usr.id === comment.author_id || usr.role === 'admin')) {
                return res.status(401).send('You have not permissions to do that');
            }
            Comment.update(commentId, content, (err) => {
                if (err) return res.status(401).json({ error: err.message });
                res.status(201).json({ message: 'Successfully updated' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = (req, res) => {
    const commentId = req.params.id;
    const { role: userRole, id: userId } = req.user;

    Comment.findById(commentId, (err, comment) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Comment.deleteById(commentId, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Comment deleted' });
            Like.deleteAllByTargetId(commentId, 'comment', () => {});
        });
    });
};

exports.removeLike = (req, res) => {
    const commentId = req.params.id;
    const authorId = req.user.id;

    Like.getLike(authorId, commentId, 'comment', (err, like) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!like) return res.status(404).json({ error: 'Like does not exist' });
        const { type } = like;

        const callback = (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: `${type} removed` });
        };

        Like.delete(authorId, commentId, 'comment', (err) => {
            if (err) return res.status(500).json({ error: err.message });
            if (type === 'like') Comment.decrementLikes(commentId, callback);
            else if (type === 'dislike') Comment.decrementDislikes(commentId, callback);
        });
    });
};
