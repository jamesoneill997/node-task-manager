    const express = require('express')
    const User = require('../models/user')
    const router = new express.Router()

    router.post('/users', async (req,res)=>{
        const user = User(req.body)
        try {
            await user.save()
            res.status(201).send(user)
            
        } catch (error) {
            res.status(400).send(error)
        }
    })
    
    router.get('/users', async (req,res) =>{
        try {
            const users = await User.find({})
            res.send(users)
        } catch (error) {
            res.status(500).send()
        }
    })
    
    router.get('/users/:id', async (req, res) => {
        const _id = req.params.id
    
        try {
            const user = await User.findById(_id)
            if (!user) {
                return res.status(404).send()
            }
            res.send(user)
        } catch (error) {
            res.status(500).send()
        }
    })
    
    
    router.patch('/users/:id', async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'gender', 'age', 'email']
        const isValidOperation = updates.every(update =>{
            return allowedUpdates.includes(update)
        })
        const _id = req.params.id
    
        if(!isValidOperation){
            return res.status(400).send('This update is not permitted')
        }
    
    
        try {
            const user = await User.findByIdAndUpdate(_id, req.body, {new:true, runValidators: true})
            if (!user){
                return res.status(404).send('User does not exist')
            }
            res.send('User updated successfully.')
        } catch (error) {
            res.status(400).send('Bad request')
        }
    })
    
    router.delete('/users/:id', async(req, res)=>{
        const _id = req.params.id
        try {
            const user = await User.findByIdAndDelete(_id)
            if (!user){
                return res.status(404).send('User does not exist')
            }
            res.send('User successfully deleted.')
        } catch (error) {
            res.status(500).send(error)
        }
    })
    
    module.exports = router