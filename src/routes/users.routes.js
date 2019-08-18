const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const auth = require('../middleware/auth.middleware');
const { User, validate } = require('../database/Schema/user.schema');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const you = await User.findById(req.user._id)
        .select('-password -tokens');
    res.send(you);
});

router.post('/', async (req, res) => {
    //Register a user
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.password });
    if (user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body, ['name','email', 'password']));
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    const token = await user.generateAuthToken()
    res.header('x-auth-token', token).status(201).send({ user, token });
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const email = req.body.email;
        const password = req.body.password
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.tokens[0].token;
        res.header('x-auth-token', token).send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }

})
module.exports = router; 