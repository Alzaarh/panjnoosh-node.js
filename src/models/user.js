const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,

        trim: true
    },

    email: {
        type: String,

        trim: true,

        sparse: true,

        unique: true
    },

    username: {
        type: String,

        trim: true,

        unique: true
    },

    password: {
        type: String,
    },

    role: {
        type: String,

        enum: ['user', 'admin'],

        default: 'user'
    },

    profilePic: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;

    user.password = await bcrypt.hash(user.password, 8);
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;

    return await jwt.sign({
        _id: user._id
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
};

userSchema.methods.verifyPassword = async function (password) {
    const user = this;
    
    return await bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;