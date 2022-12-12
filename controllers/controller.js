const {selectCategories}=require('../models/model')

exports.getCategories=(req,res)=>{
    return selectCategories().then((category)=>{
        res.status(200).send({categories: category})
    })
}

exports.getReviews=(req,res) => {
    return res.status(200).send()
}