const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'James',
    email: 'jim@gmail.com',
    password: 'hellothere',
    tokens: [{
        token:jwt.sign({_id:userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'Rebecca',
    email: 'bex@gmail.com',
    password: 'hellothere',
    tokens: [{
        token:jwt.sign({_id:userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    description: 'Clean the car',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    description: 'Go for a run',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId,
    description: 'Have some food',
    completed: true,
    owner: userTwo._id
}


const setupDB = async () => {
        await User.deleteMany()
        await Task.deleteMany()
        await new User(userOne).save()
        await new User(userTwo).save()
        await new Task(taskOne).save()
        await new Task(taskTwo).save()
        await new Task(taskThree).save()
} 


module.exports ={
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDB
}