const {getCategories, getReviews, getReviewByID, getCommentsByReviewID, postComment, patchVotes, getUsers, deleteComment}=require('./controllers/controller')
const{handleCustomErrors, handlePsqlErrors,handleServerErrors,PathNotFound}=require('./errors/index')
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


app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(PathNotFound)
app.use(handleServerErrors)


app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });


module.exports=app