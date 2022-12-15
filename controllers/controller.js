const {selectCategories, selectReviews, selectReviewByID, selectCommentsByReviewID, insertComment, updateVotes, selectUsers}=require('../models/model')
const {checkIfIDExists}=require('../models/model.reviews')

exports.getCategories=(req,res)=>{
    return selectCategories().then((category)=>{
        res.status(200).send({categories: category})
    })
}

exports.getReviews=(req,res,next)=>{
    const queries=req.query
    const validQueries=['category', 'sort_by', 'order']
    for(let query in queries){
        if(validQueries.indexOf(query)===-1){
            return next({status:400, msg:'Invalid query'})
        }
    }
    const {category, sort_by, order}=queries
    return selectReviews(category,sort_by,order).then((review)=>{
            res.status(200).send({reviews:review})
     })
    .catch((err)=>next(err))
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

exports.patchVotes=(req,res,next)=>{
    const id=req.params.review_id
    const newVote=req.body.inc_votes
    return updateVotes(id,newVote).then((updatedReview)=>{
        res.status(200).send({review: updatedReview})
    })
    .catch((err)=>next(err))
}

exports.getUsers=(req,res)=>{
    return selectUsers().then((userArr)=>{
        res.status(200).send({users: userArr})
    })
}