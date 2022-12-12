const {getCategories}=require('./controllers/controller')
const express=require('express')
const app=express()

app.get('/api/categories', getCategories)

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });
  
app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });

module.exports=app