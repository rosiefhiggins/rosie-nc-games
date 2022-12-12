const {selectCategories, selectReviews}=require('../models/model')

exports.getCategories=(req,res)=>{
    return selectCategories().then((category)=>{
        res.status(200).send({categories: category})
    })
}

exports.getReviews=(req,res)=>{
    return selectReviews().then((review)=>{
        res.status(200).send({reviews:review})
    })
}