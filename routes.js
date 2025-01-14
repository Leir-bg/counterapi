const express = require('express')
const Endpoints = require('./endpoints')

const router = express.Router()

router.get('/:namespace/:identifier/make', async (req, res) => {
    try{
        const data = await Endpoints.make(req.params.namespace, req.params.identifier)

        switch(data.status){
            case 200:
                res.status(200).json({
                    namespace: `${req.params.namespace}`,
                    identifier: `${req.params.identifier}`
                })
                break
            case 409:
                res.status(409).json({message: 'User already exists'})
                break
            case 500:
            default:
                res.status(500).json({message: 'Error saving user document'})
                break
        }
    }
    catch(e){
        res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/:namespace/:identifier/up', async (req, res) => {
    try{
        const data = await Endpoints.up(req.params.namespace, req.params.identifier)

        switch(data.status){
            case 200:
                res.status(200).json({
                    date: `${new Date()}`,
                    namespace: `${req.params.namespace}`,
                    identifier: `${req.params.identifier}`,
                    count: data.count
                })
                break
            case 404:
                res.status(404).json({message: 'User not found'})
                break
            case 500:
            default:
                res.status(500).json({message: 'Error saving log document'})
                break
        }
    }
    catch(e){
        res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/:namespace/:identifier/log', async (req, res) => {
    try{
        const data = await Endpoints.log(req.params.namespace, req.params.identifier)

        switch(data.status){
            case 200:
                res.status(200).json({
                    count: data.logs.length,
                    logs: data.logs,
                })
                break
            case 404:
                res.status(404).json({message: 'User not found'})
                break
            case 500:
            default:
                res.status(500).json({message: 'Error fetching user and log documents'})
                break
        }
    }
    catch(e){
        res.status(500).json({message: 'Internal server error'})
    }
})

module.exports = router