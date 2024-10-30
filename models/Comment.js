const db = require('../config/db');

class Comment {
    static create(authorId, postId, content, callback) {
        db.query(
            'INSERT INTO comments (author_id, post_id, content, publish_date, likes_count, dislikes_count) VALUES (?, ?, ?, NOW(), 0, 0)',
            [authorId, postId, content],
            (err, result) => callback(err, result)
        );
    }

    static update(commentId, content, callback) {
        db.query(
            'UPDATE comments SET content = ? WHERE id = ?',
            [content, commentId],
            (err, result) => callback(err, result)
        );
    }    

    static findById(commentId, callback) {
        db.query('SELECT * FROM comments WHERE id = ?', [commentId], (err, res) => {
            if(res == undefined || res.length <= 0)
                callback(new Error('Comment does not exists'), null);
            else
                callback(err, res[0]);
        });
    }

    static findByPostId(postId, callback) {
        db.query('SELECT * FROM comments WHERE post_id = ?', [postId], (err, res) => {
            if(res == undefined || res.length <= 0)
                callback(new Error('Comment does not exists'), null);
            else
                callback(err, res[0]);
        });
    }

    static likeComment(commentId, authorId, callback) {
        db.query(
            'INSERT INTO likes (author_id, target_id, type, target_type) VALUES (?, ?, "like", "comment")',
            [authorId, commentId],
            (err, res) => callback(err, res)
        );
    }

    static dislikeComment(commentId, authorId, callback) {
        db.query(
            'INSERT INTO likes (author_id, target_id, type, target_type) VALUES (?, ?, "dislike", "comment")',
            [authorId, commentId],
            (err, res) => callback(err, res)
        );
    }

    static deleteLike(commentId, authorId, callback) {
        db.query('DELETE FROM likes WHERE author_id = ? AND target_id = ? AND target_type = "comment"', [authorId, commentId], (err, res) => {
            callback(err, res);
        });
    }

    static incrementLikes(commentId, callback) {
        db.query('UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?', [commentId], callback);
    }

    static decrementLikes(commentId, callback) {
        db.query('UPDATE comments SET likes_count = likes_count - 1 WHERE id = ?', [commentId], callback);
    }

    static incrementDislikes(commentId, callback) {
        db.query('UPDATE comments SET dislikes_count = dislikes_count + 1 WHERE id = ?', [commentId], callback);
    }

    static decrementDislikes(commentId, callback) {
        db.query('UPDATE comments SET dislikes_count = dislikes_count - 1 WHERE id = ?', [commentId], callback);
    }

    static deleteById(commentId, callback) {
        db.query('DELETE FROM comments WHERE id = ?', [commentId], (err, res) => {
            callback(err, res);
        });
    }

    static deleteLikeByCommentId(commentId, callback) {
        db.query('DELETE FROM comments WHERE id = ?', [commentId], (err, res) => {
            callback(err, res);
        });
    }
}

module.exports = Comment;
