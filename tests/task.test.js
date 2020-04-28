const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId, userOne, userTwo, taskOne, taskTwo, taskThree, setupDB} = require('./fixtures/db')

beforeEach(setupDB)

test('Should create a task', async()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From test'
    })
    .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should read tasks for created user', async() => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const tasks = expect(response.body.length).toEqual(2)
    console.log(response.body)
})

test('Should not delete first task', async () => {
    const response = await request(app)
    .delete('/tasks/'+taskOne._id)
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = Task.findById(taskOne._id)

    expect(task).not.toBeNull()

})