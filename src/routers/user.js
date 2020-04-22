    const express = require('express')
    const User = require('../models/user')
    const auth = require('../middleware/auth')
    const upload = require('../middleware/upload')
    const router = new express.Router()
   

    router.post('/users', async (req,res)=>{
        const user = new User(req.body)
        try {
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({user,token})
            
        } catch (error) {
            res.status(400).send(error)
        }
    })
    
    router.get('/users/me',auth ,async (req,res) =>{
        res.send(req.user)
    })


    router.post('/users/login', async (req, res)=>{
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password)
            const token = await user.generateAuthToken()
            res.send({user, token:token})
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    })

    router.post('/users/logout',auth, async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter(token => {
                return token.token !== req.token
            })
            await(req.user.save())
            res.send()
        } catch (error) {
            res.status(500).send(error)
        }
    })

    router.post('/users/logoutAll', auth, async (req, res) => {
        try {
            req.user.tokens = []
            await(req.user.save())
            res.status(200).send('Successfully logged out')

        } catch (error) {
            console.log(error)
            res.status(500).send(error)
        }
    })  
    
    router.patch('/users/me', auth, async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'gender', 'age', 'email', 'password']
        const isValidOperation = updates.every(update =>{
            return allowedUpdates.includes(update)
        })
        const _id = await req.user._id
    
        if(!isValidOperation){
            return res.status(400).send('This update is not permitted')
        }
    
    
        try {

            const user = await req.user
            updates.forEach((update)=>user[update] = req.body[update])
            await user.save()           
            
            if (!user){
                return res.status(404).send('User does not exist')
            }
            res.send('User updated successfully.')
        } catch (error) {
            res.status(400).send('Bad request' + error)
        }
    })
    
    router.delete('/users/me', auth, async(req, res)=>{
        const _id = req.user._id
        try {
             await req.user.remove()
            res.send('User successfully deleted.')
        } catch (error) {
            res.status(500).send(error)
        }
    })

    router.post('/users/me/avatar', upload.single('avatar'),(req, res) =>{
        res.send('Image successfully uploaded')
})
    
    module.exports = router