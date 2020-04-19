const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {type: String, required: true, trim: true},
    age: {type: Number,
    validate(value){ 
        if(value < 0){
            throw new Error('Age must be positive')
        }
    }
    },
    email: {
        type:String, 
        required: true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    }, gender:{
        type: String, 
        default: 'Not specified'
    }, password:{
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password must not contain the word "password"')
            }else if(value.length <= 6){
                throw new Error('Password must be longer than 6 characters')
            }
        }
    }

    

})

module.exports = User