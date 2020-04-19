const express = require('express')
const mongoose = require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req,res)=>{
    const user = User(req.body)

    user.save().then(()=>{
        res.status(201).send('User successfully saved')
    }).catch((error)=>{
        res.status(400).send('Save failed')
    })
})

app.get('/users',(req,res) =>{
    User.find({

    }).then((users)=>{
        res.send(users)
    }).catch(error =>{
        res.status(500).send()
    })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id

    User.findById(_id).then((user)=>{
        if(!user){
           return res.request(404).send('User not found')
        }

        res.send(user)
    }).catch((error) =>{
        res.status(500).send()
    })
})



app.post('/tasks',(req,res) =>{
    const task = Task(req.body)
    
    task.save().then(()=>{
        res.status(201).send('Task successfully saved!')
    }).catch((error)=>{
        res.status(400).send('Save failed')
    })
})

app.get('/tasks', (req,res)=>{
    Task.find({

    }).then((tasks)=>{
        res.send(tasks)
    }).catch((error)=>{
        res.status(500).send()
    })
})


app.get('/tasks/:id', (req,res)=>{
    const _id = req.params.id

    Task.findById(_id).then((task)=>{
        if(!task){
           return res.status(400).send()
        }

        res.send(task)
    }).catch((error) =>{
        res.status(500).send(error)
    })
    
})




app.listen(port, () => {
    console.log('Server is running on port: ', port)
})

