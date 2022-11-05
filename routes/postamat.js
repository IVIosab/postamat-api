const express = require('express');
const router = express.Router();
const Postamat = require('../models/Postamat')


//Creating one postamat 
router.post('/', async (req, res) => {
    try {
        const newPostamat = await Postamat.create(req.body)
        res.status(201).json(newPostamat)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})

//Getting postamats based on query
router.get('/', generalHandler, async (req, res) => {
    try{
        res.json(res.postamat)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//Updating one postamat
router.put('/:id', async (req, res) => {
    try {
        await Postamat.findByIdAndUpdate({_id: req.query.id}, req.body)
        const updatedPostamat = await Postamat.findOne({_id: req.query.id}, req.body)
        if(updatedPostamat == null){
            res.status(404).json({message: 'Cannot Find Postamats'})
        }
        else{
            res.status(200).json(updatedPostamat)
        }
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// Deleting one postamat
router.delete('/:id', async (req, res) => {
    try {
        const deletedPostamat = await Postamat.findByIdAndDelete({_id: req.params.id})
        if(deletedPostamat == null){
            res.status(404).json({message: 'Cannot Find Postamats'})
        }
        else{
            res.status(200).json(deletedPostamat)
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

async function generalHandler(req, res, next){
    let postamat
    let query = req.query
    let area = {}
    let circleQuery = false;
    if(query.hasOwnProperty('circle')){
        let circle = query.circle.slice(1,-1).split(',')
        let lon = parseFloat(circle[0])
        let lat = parseFloat(circle[1])
        let r = parseInt(circle[2])
        circleQuery = true
        area = {
            near: [lon, lat],
            maxDistance: r,
            spherical: true,
            distanceField: "dist.calculated"
        }
        
    }
    delete query.circle
    try {
        Postamat.ensureIndexes({'geometry.coordinates': '2dsphere'})
        if(circleQuery){
            postamat = await Postamat.find({
                'geometry.coordinates': {
                    $near: {
                        $maxDistance: area.maxDistance,
                        $geometry: {
                            type: 'Point',
                            coordinates: area.near
                        }
                    }
                }
            }).find(query)
        }
        else{
            postamat = await Postamat.find(query)
        }
        if(postamat == null){
            return res.status(404).json({message: 'Cannot Find Postamats'})
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({message: err.message})
    }
    res.postamat = postamat
    next()
}

module.exports = router
