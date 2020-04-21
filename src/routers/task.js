const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async(req,res) =>{
    //const task = Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
        })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send('Task creation failed')
    }
   
})

router.get('/tasks', async (req,res)=>{
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(400).send(error)
    }

})


router.get('/tasks/:id', async (req,res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
    
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['de scription', 'completed']
    const isValidOperation = updates.every(update =>{
        return allowedUpdates.includes(update)
    })
    const _id = req.params.id

    if(!isValidOperation){
        return res.status(400).send('Update not permitted')
    }
    try {
        const task = await Task.findById(_id)
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        if (!task){
            return res.status(404).send('Task not found')
        }
        res.send('Task updated successfully')

    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id', async(req, res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task){
            return res.status(404).send('Task does not exist')
        }
        res.send('Task successfully deleted.')
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router