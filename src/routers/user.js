    const express = require('express')
    const sharp = require('sharp')
    const User = require('../models/user')
    const auth = require('../middleware/auth')
    const upload = require('../middleware/upload')
    const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account')
    const router = new express.Router()
   

    router.post('/users', async (req,res)=>{
        const user = new User(req.body)
        try {
            await user.save()
            sendWelcomeEmail(user.email, user.name)
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
            sendCancellationEmail(req.user.email, req.user.name)
            res.send('User successfully deleted.')
        } catch (error) {
            res.status(500).send(error)
            console.log(error)
        }
    })

    router.post('/users/me/avatar', auth, upload.single('avatar'),async(req, res) =>{
        const buffer = await sharp(req.file.buffer).resize(250,250).png().toBuffer()

        req.user.avatar = buffer
        await req.user.save()
        res.send('Image successfully uploaded')
    },(error, req, res, next)=>{
        res.status(400).send({error: error.message})
})


    router.delete('/users/me/avatar', auth, async(req, res) =>{
        req.user.avatar = undefined
        await req.user.save()
        res.send('Image removed successfully')
    },
        (error, req, res, next)=>{
            res.status(400).send('Error removing Image')
        
    })

    router.get('/users/:id/avatar', async (req, res)=>{
        try {
            const user = await User.findById(req.params.id)
            if(!user){
                throw new Error('No user found')
            }

            res.set('Content-Type','image/png')
            res.send(user.avatar)
            
        } catch (error) {
            res.status(404).send("Error")
        }
    })


module.exports = router