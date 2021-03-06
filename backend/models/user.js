const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    userName: {
        type:String,
        trim:true,
        required:true,
        maxLength:32,
        unique:true,
        index:true,
        lowerCase:true
    },
    name: {
        type:String,
        trim:true,
        required:true,
        maxLength:32
    },
    email: {
        type:String,
        trim:true,
        required:true,
        unique:true,
        lowerCase:true
    },
    profile: {
        type:String,
        required:true
    },
    hash_password: {
        type:String,
        required:true
    },
    salt:String,
    about:{
        type:String
    },
    role: {
        type:Number,
        default: 0
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    resetPasswordLink:{
        data:String,
        default:''
    }
}, {timestamps:true});

userSchema.virtual('password')
    .set(function (password) {
        //create temp variable called _password
        this._password = password;
        //generate Salt
        this.salt = this.makeSalt();
        //encrypt password
        this.hash_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hash_password;
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch(error) {
            return '';
        }
    },
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    }
};

module.exports = mongoose.model('User', userSchema);