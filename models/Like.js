const db = require('../config/db'); 

class Like{
    static getLike(userId, targetId, targetType, callback) {
        const query = `
            SELECT * FROM likes 
            WHERE author_id = ? AND target_id = ? AND target_type = ?
        `;
        db.query(query, [userId, targetId, targetType], (err, results) => {
            if (err) return callback(err);
            callback(null, results.length>0? results[0] : null);
        });
    }

    static create(userId, targetId, targetType, actionType, callback){
        const query = `
            INSERT INTO likes (author_id, target_id, target_type, type, publish_date)
            VALUES (?, ?, ?, ?, NOW())
        `;
        db.query(query, [userId, targetId, targetType, actionType], (err, result) => {
            if (err) return callback(err);
            callback(null, result.insertId);
        });
    }

    static delete(userId, targetId, targetType, callback) {
        const query = `
            DELETE FROM likes 
            WHERE author_id = ? AND target_id = ? AND target_type = ?
        `;
        db.query(query, [userId, targetId, targetType], (err, result) => {
            if (err) return callback(err);
            callback(null, result.affectedRows);
        });
    }

    static findAllByTargetId(targetId, targetType, callback) {
        const query = `
            SELECT * FROM likes 
            WHERE target_id = ? AND target_type = ?
        `;
        db.query(query, [targetId, targetType], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }

    static getLikesCount(targetId, targetType, callback) {
        const query = `
            SELECT COUNT(*) AS likeCount 
            FROM likes 
            WHERE target_id = ? AND target_type = ? AND type = 'like'
        `;
        db.query(query, [targetId, targetType], (err, result) => {
            if (err) return callback(err);
            callback(null, result[0].likeCount);
        });
    }

    static getDislikesCount(targetId, targetType, callback) {
        const query = `
            SELECT COUNT(*) AS dislikeCount 
            FROM likes 
            WHERE target_id = ? AND target_type = ? AND type = 'dislike'
        `;
        db.query(query, [targetId, targetType], (err, result) => {
            if (err) return callback(err);
            callback(null, result[0].dislikeCount);
        });
    }

    static deleteAllByTargetId(targetId, targetType, callback) {
        const query = `
            Delete FROM likes 
            WHERE target_id = ? AND target_type = ?
        `;
        db.query(query, [targetId, targetType], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = Like;
