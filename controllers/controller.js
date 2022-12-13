const {selectCategories, selectReviews, selectReviewByID}=require('../models/model')


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

exports.getReviewByID=(req,res,next)=>{
    const id=req.params.review_id
    return selectReviewByID(id).then((selectedReview)=>{
        res.status(200).send({review: selectedReview})
    })
    .catch((err)=>next(err))
}