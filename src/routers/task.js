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

router.get('/tasks', auth, async (req,res)=>{
    const match = {}
    const sort = {}

    //checks for completed/non completed tasks
    if(req.query.completed){
        match.completed = req.query.completed ==='true'
    }
    //checks for sort filter
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]=== 'desc' ? -1 : 1
        
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }

})


router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try {

        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
    
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every(update =>{
        return allowedUpdates.includes(update)
    })
    const _id = req.params.id

    if(!isValidOperation){
        return res.status(400).send('Update not permitted')
    }
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        
        if (!task){
            return res.status(404).send('Task not found')
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send('Task updated successfully')

    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/tasks/:id',auth,  async(req, res)=>{
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task){
            return res.status(404).send('Task does not exist')
        }
        res.send('Task successfully deleted.')
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router