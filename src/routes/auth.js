const router = require('express').Router();
const validator = require('validator');
const userModel = require('../models/user');

router.post('/signup', async function (req, res) {
    result = validateUser(req.body);

    if (result.errors) {
        return res.status(400).send(result);
    }

    const input = { username: req.body.username, password: req.body.password };

    const user = new userModel(input);

    try {
        await user.save();

        const token = await user.generateAuthToken();

        res.status(201).send({ data: { token: token } });
    } catch (e) {

        if (e.code === 11000) {
            res.status(400).send({ errors: { username: 'already exists' } });
        } else {

            res.status(500).send({ errors: e });
        }
    }
});

router.post('/signin', async function (req, res) {
    result = validateUser(req.body);

    if (result.errors) {
        return res.status(400).send(result);
    }
    
    const input = { username: req.body.username, password: req.body.password };
    
    try {
        const user = await userModel.findOne({username: input.username});
        
        if (!user) {
            return res.status(400).send({ errors: 'bad request' });
        }

        const isMatch = await user.verifyPassword(input.password);
        
        if (!isMatch) {
            return res.status(400).send({ errors: 'bad request' });
        }

        const token = await user.generateAuthToken();

        res.send({ data: { token } });
    } catch (e) {

        res.status(500).send({ errors: e });
    }
});

const validateUser = function (input) {
    if (typeof input.username !== 'string' ||
        !validator.isAlphanumeric(input.username) ||
        !validator.isByteLength(input.username, { min: 3, max: 100 })) {

        return { errors: { username: 'incorrect username' } };
    }

    if (typeof input.password !== 'string' ||
        !validator.isByteLength(input.password, { min: 5, max: 100 })) {

        return { errors: { password: 'incorrect password' } };
    }

    return {};
};

module.exports = router;