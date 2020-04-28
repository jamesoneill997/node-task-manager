const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDB} = require('./fixtures/db')

beforeEach(setupDB)

test('Should not delete account for unauthenticated user', async () =>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})


test('Should log in existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
})  


test('Should get profile for user', async () =>{
     await request(app)
     .get('/users/me')
     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
})  

test('Should upload avatar image', async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','./tests/fixtures/jamespp.jpg')
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should not log in user', async () => {
    await request(app).
    post('/users/login').
    send({
        email: 'gimm@gmail.com',
        password: 'fuckoffyouprick'
    }).expect(400)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for authenticated user', async () =>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})


test('Should update valid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({ name: 'Benjiman'})
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Benjiman')
})

test('Should not update invalid user fields', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({ location: 'Zambia'})
    .expect(400)

})



test('Should sign up new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'James',
        email: 'jimmynail@gmail.com',
        password: 'hellothere'
    }).expect(201)

    //assert database was updated correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //response assertions
    expect(response.body).toMatchObject({
        user: {
            name: 'James',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('hellothere')
})



