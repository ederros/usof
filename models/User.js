const db = require('../config/db');

class User {
    static create(login, password, fullName, email, avatar, role, callback) {
        return db.query('INSERT INTO users (login, password, full_name, email, role, profile_picture, rating) VALUES (?, ?, ?, ?, ?, ?, 0)', 
            [login, password, fullName, email, role, avatar], (err, result) => {
                if(err) console.log('error at creating user');
                callback(err, result);
            });
    }

    static findByLogin(login, callback) {
        db.query('SELECT * FROM users WHERE login = ?', [login], (err, res) => {
            if(res.length == 0) callback(null);
            else callback(res[0]);
        });
    }

    static findByEmail(email, callback) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, res) => {
            if(res.length == 0) callback(null);
            else callback(res[0]);
        });
    }

    static findById(id, callback) {
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, res) => {
            if(res.length == 0) callback(null);
            else callback(err, res[0]);
        });
    }

    static findAll(callback) {
        db.query('SELECT * FROM users', (err, res) => {
            callback(err, res);
        });
    }

    static checkForExists(login, email, callback) {
        db.query('SELECT * FROM users WHERE login = ? OR email = ?', [login, email], (err, res) => {
            if(err)
            {
                console.log('error ', err.message);
            }
            callback(res.length != 0);
            
        });
    }

    static editById(id, pass, name, mail, avatar, role, callback)
    {
        db.query('UPDATE users SET password = ?, full_name = ?, email = ?, profile_picture = ?, role = ? WHERE (id = ?);',
            [pass, name, mail, avatar, role, id], (err, result) => {
                if(err) console.log('error', err.message);
                callback(err, result);
            }
        )
    }

    static deleteById(id, callback)
    {
        
        db.query('DELETE FROM users WHERE id = ?',
            [id], (err, result) => {
                if(err) console.log('error', err.message);
                callback(err, result);
            }
        )
    }
}

module.exports = User;
