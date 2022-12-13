const {selectCategories, selectReviews, selectReviewByID}=require('../models/model')
const {checkIfIDExists}=require('../models/models.reviews')

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
    if(id%1!=0){
        return res.status(400).send({msg: 'Bad request!'})
    }else{
    const promises=[selectReviewByID(id)]
    if (id) promises.push(checkIfIDExists(id))
    Promise.all(promises)
    .then(([selectedReview])=>{
       res.status(200).send({review:selectedReview})
    })
    .catch((err)=>next(err))
    }
}