const {selectCategories, selectReviews, selectReviewByID, selectCommentsByReviewID, insertComment}=require('../models/model')
const {checkIfIDExists}=require('../models/model.reviews')

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

exports.getCommentsByReviewID=(req,res,next)=>{
    const id=req.params.review_id
    const promises=[selectCommentsByReviewID(id)]
    if (id) promises.push(checkIfIDExists(id))
    Promise.all(promises)
    .then(([comments])=>{
        res.status(200).send({review_comments: comments})
    })
    .catch((err)=>next(err))
}

exports.postComment=(req,res,next)=>{
    const id=req.params.review_id
    const username=req.body.username
    const body=req.body.body
    return insertComment(id,username,body).then((newComment)=>{
        res.status(201).send({review_comments: newComment})
    })
    .catch((err)=>next(err))
}