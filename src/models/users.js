const mongoose = require('mongoose');
const validator = require('validator');
//bcrypt for encrypting the password hashing
const bcrypt = require('bcryptjs');
//for generating the tokens
const jwt = require('jsonwebtoken')

//defining the user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        //trim spaces in the name 
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error("shouldn't includes 'password'")
            }
        }
    },
    //tokens is a list of all token or logins for this user 
    tokens: [{

        token: {
            type: String,
            required: true
        }
    }]

});

userSchema.virtual('tasks',{
    ref:"Tasks",
    localField:"_id",
    foreignField:"owner"
})


//overwrite the toJSON method 
//to return specific data not all data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    //delete the password and tokens from the returned object
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
// geterate a token for the user 
//save the token in the collection 
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        //to string because it's an id object
        _id: user._id.toString()
    }, 'thisismytrainingtoken');
    console.log(token)
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
}

//check password 
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await Users.findOne({
        email
    })
    if (!user) {
        throw new Error('unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('unable to login')
    }
    return user;
}


//hash the plain text before saving 
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;