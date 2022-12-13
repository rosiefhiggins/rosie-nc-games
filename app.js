const {getCategories, getReviews, getReviewByID}=require('./controllers/controller')
const express=require('express')
const app=express()

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewByID)

app.use((err,req,res,next)=>{
  if(err.msg!=undefined){
      res.status(err.status).send({msg: err.msg})
  }else{
      next(err)
  }
})

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });

  
app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });

module.exports=app