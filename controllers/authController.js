// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Модуль базы данных
const User = require('../models/User');
const session = require('express-session');
const { request } = require('express');
const mail = require('../utils/mailer');
const fs = require('fs');

require('dotenv').config();

exports.confirmRegister = async (req, res) => {
    try {
        token = jwt.decode(req.params.confirmToken);
        User.create(token.login, token.password, token.fullName, token.email, token.avatar, 'user', (err, userId) => {
            if(err) res.status(400).json({ error: "error " + error.message });
            else res.status(201).json('Email confirmed');
        });
    } catch (error) {
        res.status(500).json({ error: "error " + error.message });
    }
};

exports.register = async (req, res) => {

    if (!req.file) {
        res.status(413).send(`File not uploaded!`);
        return;
    }
    const { login, password, passwordConfirmation, email } = req.body;
    if (password !== passwordConfirmation || !password) {
        if(req.file) await fs.unlink(req.file.path, (err) => {
            if(err) {
                return res.status(500).json({ error: 'File not finded' });
            }
            else {
                return res.status(400).json({ error: 'Passwords do not match' });
            }
        });
       
    } else 
    {
        try {
        
            req.session.user = req.body;
            req.session.user.avatar = req.file.path;
            
            req.session.user.password = await bcrypt.hash(req.session.user.password, 10);
            console.log('pass = ', req.session.user.password);
            req.session.user.passwordConfirmation = undefined;
            const token = jwt.sign(req.session.user, process.env.JWT_SECRET, { expiresIn: '1h' });
            message = req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '/' + token;
            User.checkForExists(login, email, async (isExists) => {
                if(isExists) {
                    res.status(500).json({ error: 'User already exists' });
                    fs.unlink(req.file.path, (err) => {
                        if(err) res.status(500).json({ error: err.message });
                    });
                }
                else {

                    await mail.sendEmail(email, 'Register', 'Follow this link to confirm registration\n' + message);
                    res.status(201).json('Email sent');
                }
            });
        } catch (error) {
            res.status(500).json({ error: "error " + error.message });
        }
    }
   
};

exports.login = async (req, res) => {
    const { login, password } = req.body;
    console.log(req.body);
    try {
        User.findByLogin(login, async (user) => {
            if(!user) {
                return res.json({ error: `User with login ${login} does not exists` });
            }
            if(!password)
                return res.json({ error: 'Password must be provided' });
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000
            });
            res.json({ message: 'Login successful' });
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Login error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send('User not logged in');
        }

        res.clearCookie('token');
        return res.status(201).send('Logout successful');
    } catch (error) {
        res.status(500).json({ error: 'Logout error' });
    }
};

exports.passwordReset = async (req, res) => {
    const { email } = req.body;
    try {
        User.findByEmail(email, (user) => {
            if(!user) return res.status(400).json('User not found');
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            message = req.protocol + '://' + req.get('host') + req.baseUrl + req.path + '/' + token;
            mail.sendEmail(email, 'Password reset', 'Follow this link to reset password\n' + message);
            res.status(201).json('Email sent');
        });
    } catch (error) {
        res.status(500).json({ error: 'error' });
    }
};

exports.confirmReset = async (req, res) => {
    const { password, passwordConfirmation } = req.body;
    if(password !== passwordConfirmation)
        return res.status(400).json({ error: 'Passwords do not match' });
    try {
        token = jwt.decode(req.params.confirmToken);
        hashedPassword = await bcrypt.hash(password, 10)
        User.findById(token.id, (user) => {
            User.editById(
                user.id, 
                hashedPassword, 
                user.full_name, 
                user.email, 
                user.profile_picture,
                user.role);
            res.status(200).json({ message: "User's password successfully changed" });
        });
    } catch (error) {
        res.status(500).json({ error: 'error ' + error.message });
    }
};
