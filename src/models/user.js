const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
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
        unique: true,
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
    }, 
    tokens:[{
        token:{type: String}
    }],
    avatar:{
        type: Buffer
    }
},{timestamps:true})


//instance method
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.statics.findByCredentials = async (email,password) =>{
        const user = await User.findOne({email})
        if(!user){
            throw new Error('Invalid credentials')
        }
        
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            throw new Error('Invalid credentials')
        }
        return user
}


//hash password and store
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

//delete user tasks when user is deleted

userSchema.pre('remove', async function (next){
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User