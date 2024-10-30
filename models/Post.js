const db = require('../config/db');
require('dotenv').config();


class Post { 
    static create(authorId, title, content, categories, callback) {
        
        db.query(
            'INSERT INTO posts (author_id, title, content, publish_date, likes_count, dislikes_count) VALUES (?, ?, ?, NOW(), 0, 0)',
            [authorId, title, content],
            (err, result) => {
                if (err) {
                    callback(err, -1);
                    return;
                }
                console.log(categories);
                const postId = result.insertId;
                const categoryValues = categories.map((categoryId) => [postId, categoryId]);

                db.query(
                    'INSERT INTO post_category (post_id, category_id) VALUES ?',
                    [categoryValues],
                    (categoryErr) => callback(categoryErr, postId)
                );
            }
        );
    }

    static findAll(offset, limit, filters, orderBy, callback) {
        let query = `SELECT * FROM posts WHERE 1=1`;
        let queryParams = [];
        if (filters) {
            if (filters.categories) {
                query += ` AND id IN (SELECT post_id FROM post_category WHERE category_id IN (?))`;
                queryParams.push(filters.categories);
            }
            if (filters.startDate && filters.endDate) {
                query += ` AND publish_date BETWEEN ? AND ?`;
                queryParams.push(filters.startDate, filters.endDate);
            }
            if (filters.status) {
                query += ` AND status = ?`;
                queryParams.push(filters.status);
            }
        }
        queryParams.push(limit, offset);
        if (orderBy === 'date') {
            query += ` ORDER BY publish_date DESC`;
        } else {
            query += ` ORDER BY likes_count DESC`;
        }
    
        query += ` LIMIT ? OFFSET ?`;
        var q = db.query(query, queryParams, (err, res) => callback(err, res));
    }
    

    static findById(postId, callback) {
        db.query('SELECT * FROM posts WHERE id = ?', [postId], (err, res) => {
            callback(err, res[0]);
        });
    }

    static findAllByCategoryId(category_id, callback) {
        db.query('SELECT posts.* FROM posts INNER JOIN post_category ON posts.id = post_category.post_id WHERE post_category.category_id = ?', category_id, (err, res) => {
            callback(err, res);
        });
    }

    static findComments(postId, callback) {
        db.query('SELECT * FROM comments WHERE post_id = ?', [postId], (err, res) => {
            callback(err, res);
        });
    }

    static findCategories(postId, callback) {
        db.query(
            'SELECT categories.* FROM categories INNER JOIN post_category ON categories.id = post_category.category_id WHERE post_category.post_id = ?',
            [postId],
            (err, res) => {
                callback(err, res);
            }
        );
    }

    static updateById(postId, title, content, categories, isActive, callback) {
        console.log(isActive);
        db.query('UPDATE posts SET title = ?, content = ?, status = ? WHERE id = ?', [title, content, isActive ? 'active':'inactive', postId], (err) => {
            if (err) return callback(err);

            db.query('DELETE FROM post_category WHERE post_id = ?', [postId], (deleteErr) => {
                if (deleteErr) return callback(deleteErr);
                if (categories)
                {
                    const ctgs = categories.split(',');
                    const categoryValues = ctgs.map((categoryId) => [postId, categoryId]);

                    db.query(
                        'INSERT INTO post_category (post_id, category_id) VALUES ?',
                        [categoryValues],
                        (insertErr) => callback(insertErr?new Error('Unknown category'):null)
                    );
                }
                else callback(null);
            });
        });
    }

    static deleteById(postId, callback) {
        db.query('DELETE FROM posts WHERE id = ?', [postId], (err, res) => {
            callback(err, res);
        });
    }

    static likePost(postId, authorId, callback) {
        db.query(
            'INSERT INTO likes (author_id, target_id, type, target_type) VALUES (?, ?, "like", "post")',
            [authorId, postId],
            (err, res) => {
                if(err) {
                    callback(err, res);
                    return;
                }
                this.incrementLikes(postId, callback(err, res));
            }
        );
    }

    static dislikePost(postId, authorId, callback) {
        db.query(
            'INSERT INTO likes (author_id, target_id, type, target_type) VALUES (?, ?, "dislike", "post")',
            [authorId, postId],
            (err, res) => callback(err, res)
        );
    }

    static deleteLike(postId, authorId, callback) {
        db.query('DELETE FROM likes WHERE author_id = ? AND target_id = ? AND target_type = "post"', [authorId, postId], (err, res) => {
            callback(err, res);
        });
    }

    static findLikes(postId, callback) {
        db.query('SELECT * FROM likes WHERE target_id = ? AND target_type = "post"', [postId], (err, res) => {
            callback(err, res);
        });
    }

    static incrementLikes(postId, callback) {
        db.query('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?', [postId], callback);
    }

    static decrementLikes(postId, callback) {
        db.query('UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?', [postId], callback);
    }

    static incrementDislikes(postId, callback) {
        db.query('UPDATE posts SET dislikes_count = dislikes_count + 1 WHERE id = ?', [postId], callback);
    }

    static decrementDislikes(postId, callback) {
        db.query('UPDATE posts SET dislikes_count = dislikes_count - 1 WHERE id = ?', [postId], callback);
    }

}

module.exports = Post;
