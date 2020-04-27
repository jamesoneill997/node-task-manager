const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')


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

beforeEach(async()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should log in existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})  

test('Should get profile for user', async () =>{
     await request(app)
     .get('/users/me')
     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
})


test('Should not log in user', async () => {
    await request(app).
    post('/users/login').
    send({
        email: 'gimm@gmail.com',
        password: 'fuckoffyouprick'
    }).expect(400)
})

test('Should sign up new user', async () => {
    await request(app).post('/users').send({
        name: 'James',
        email: 'jimmynail@gmail.com',
        password: 'hellothere'
    }).expect(201)
})