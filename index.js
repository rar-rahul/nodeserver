const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require('./routes/routes')
const bodyParser = require('body-parser')
const path = require('path')


const port = 8000;
//connect Mongodb using mongoose
dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
.then(() => {
    console.log('Connected to MongoDB tested');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });


var app = express();

//global middelware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

//Handel route here
app.get('/',(req, res)=>{ 
    res.send('route working tested successfully!');
  })

  app.get("/api",(req, res)=>{ 
    res.send('api path working');
  })


app.use("/api/",routes)





//port listen on server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
  