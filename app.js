const {getCategories, getReviews, getReviewByID, getCommentsByReviewID, postComment, patchVotes, getUsers, deleteComment}=require('./controllers/controller')
const express=require('express')
const app=express()

app.use(express.json());

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewByID)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewID)

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', patchVotes)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err,req,res,next)=>{
  if(err.status && err.msg){
      res.status(err.status).send({msg: err.msg});
  }else{
      next(err)
  }
})

app.use((err, req, res, next) => {
  if(err.code==='22P02' || err.code==='23502'){
    return res.status(400).send({ msg: 'Bad request!' });
  } else{
    next(err)
  }
})

app.use((err, req, res, next) => {
  if(err.code==='23502'){
    return res.status(400).send({ msg: 'Bad request!' });
  } else{
    next(err)
  }
})

app.use((err, req, res, next) => {
  if(err.code==='23503'){
    return res.status(404).send({ msg: 'Not found' });
  } else{
    next(err)
  }
})

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });


module.exports=app