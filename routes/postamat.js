const express = require('express');
const router = express.Router();
const Postamat = require('../models/Postamat')


//Creating one postamat 
router.post('/', async (req, res) => {
    const postamat = new Postamat({
        address: req.body.address,
        type: req.body.type,
        district: req.body.district,
        adminstrativeDistrict: req.body.adminstrativeDistrict,
        model: req.body.model,
        rating: req.body.rating,
        lat: req.body.lat,
        lon: req.body.lon
    })

    try {
        const newPostamat = await postamat.save()
        res.status(201).json(newPostamat)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})

//Getting postamats based on query
router.get('/', queryHandler, async (req, res) => {
    try{
        res.json(res.postamat)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Getting one postamat by id
router.get('/:id', idHandler, async (req, res) => {
    try{
        res.json(res.postamat)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

//Updating one postamat
router.put('/:id', idHandler, async (req, res) => {
    res.postamat.address = req.body.address === null ? res.postamat.address : req.body.address;
    res.postamat.type = req.body.type === null ? res.postamat.type : req.body.type;
    res.postamat.district = req.body.district === null ? res.postamat.district : req.body.district;
    res.postamat.adminstrativeDistrict = req.body.adminstrativeDistrict === null ? res.postamat.adminstrativeDistrict : req.body.adminstrativeDistrict;
    res.postamat.model = req.body.model === null ? res.postamat.model : req.body.model;
    res.postamat.rating = req.body.rating === null ? res.postamat.rating : req.body.rating;
    res.postamat.lat = req.body.lat === null ? res.postamat.lat : req.body.lat;
    res.postamat.lon = req.body.lon === null ? res.postamat.lon : req.body.lon;
    try {
        const updatedPostamat = await res.postamat.save()
        res.json(updatedPostamat)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one postamat
router.delete('/:id', idHandler, async (req, res) => {
    try {
        await res.postamat.remove()
        res.json({message: "Deleted"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


async function queryHandler(req, res, next){
    let postamat
    try {
        postamat = await Postamat.find(req.query)
        if(postamat == null){
            return res.status(404).json({message: 'Cannot Find Postamat'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.postamat = postamat
    next()
}

async function idHandler(req, res, next){
    let postamat
    try {
        postamat = await Postamat.find({_id: req.params.id})
        if(postamat == null){
            return res.status(404).json({message: 'Cannot Find Postamat'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.postamat = postamat
    next()
}

module.exports = router
