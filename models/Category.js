const db = require('../config/db');

class Category {
    static findAll(callback) {
        db.query('SELECT * FROM categories', (err, result) => {
            callback(err, result);
        });
    }

    static findById(id, callback) {
        db.query('SELECT * FROM categories WHERE id = ?', id, (err, result) => {
            callback(err, result);
        });
    }

    static findByPostId(postId, callback) {
        db.query(
            'SELECT categories.* FROM categories JOIN post_category ON categories.id = post_category.category_id WHERE post_category.post_id = ?',
            [postId],
            (err, result) => {
                callback(err, result);
            }
        );
    }

    static create(title, description, callback) {
        const query = 'INSERT INTO categories (title, description) VALUES (?, ?)';
        db.query(query, [title, description], (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId);
        });
    }

    static updateById(id, title, description, callback) {
        const query = 'UPDATE categories SET title = ?, description = ? WHERE id = ?';
        db.query(query, [title, description, id], (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) {
                return callback(new Error('Category not found'));
            }
            callback(null, result);
        });
    }

    static deleteById(id, callback) {
        const query = 'DELETE FROM categories WHERE id = ?';
        db.query(query, [id], (err, result) => {
            if (err) return callback(err);
            if (result.affectedRows === 0) {
                return callback(new Error('Category not found'));
            }
            callback(null, result);
        });
    }
}
module.exports = Category;
