const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');

exports.getAllUsers = (req, res) => {
    User.findAll((err, users) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(users);
    });
};

exports.getUserById = (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    });
};

exports.createUser = (req, res) => {
    const { login, password, fullName, email, role } = req.body;
    const token = jwt.decode(req.cookies.token);

    if (!token || token.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    User.checkForExists(login, email, (isExists) => {
        if (isExists) {
            return res.status(400).json({ error: 'User with this login or email already exists' });
        }

        User.create(login, password, fullName, email, '', role, (err, userId) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User created', userId });
        });
    });
};

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { fullName, password, email, avatar, role } = req.body;
    const usr = req.user;

    if (!(usr.id === userId || usr.role === 'admin')) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: 'User not found' });

        User.editById(userId, password || user.password, fullName, email, avatar, role, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'User updated' });
        });
    });
};

exports.uploadAvatar = (req, res) => {
    const userId = req.params.id;
    const avatarPath = req.file ? req.file.path : null;
    const usr = req.user;

    if (!avatarPath) return res.status(400).json({ error: 'File not uploaded' });
    if (!(usr.id === userId || usr.role === 'admin')) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    User.findById(userId, (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.profile_picture && fs.existsSync(user.profile_picture)) {
            fs.unlink(user.profile_picture, (err) => {
                if (err) console.error('Failed to remove old avatar:', err);
            });
        }

        User.editById(userId, user.password, user.full_name, user.email, avatarPath, user.role, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Avatar uploaded successfully' });
        });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const token = jwt.decode(req.cookies.token);
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    if (!(token.id === userId || token.role === 'admin')) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    User.findById(userId, (err, user) => {
        console.log(err);
        if (err) return res.status(500).json({ error: err.message });
        console.log('dawd1');
        if (!user) return res.status(404).json({ message: 'User not found' });
        console.log('dawd2');
        User.deleteById(userId, (err, result) => {
            
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'User deleted' });
        });
    });
};
