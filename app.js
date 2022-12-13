const {getCategories, getReviews, getReviewByID, getCommentsByReviewID}=require('./controllers/controller')
const express=require('express')
const app=express()

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewByID)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewID)

app.use((err,req,res,next)=>{
  if(err.status && err.msg){
      res.status(err.status).send({msg: err.msg});
  }else{
      next(err)
  }
})

app.use((err, req, res, next) => {
  if(err.code==='22P02'){
    return res.status(400).send({ msg: 'Bad request!' });
  } else{
    next(err)
  }
})

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });


module.exports=app