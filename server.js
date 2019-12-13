const express = require("express");
const app = express();
const PORT = process.env.PORT || 5555;
const mongoConnect = require('./config/db');

const path = require('path');


mongoConnect();

//init middleware
app.use(express.json({extended:false})); // old body parser


//Define routes
app.use('/api/users',require('./Routes/api/users'));
app.use('/api/profile',require('./Routes/api/profile'));
app.use('/api/posts',require('./Routes/api/posts'));
app.use('/api/auth',require('./Routes/api/auth'));


//server static assets in production

if(process.env.NODE_ENV ==='production'){
  app.use(express.static('client/build'))
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}


app.listen(PORT, () => {
  console.log(`server started at  ${PORT}`);
});
