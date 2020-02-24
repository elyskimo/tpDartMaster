// le point d'entrée du serveur web
const express = require('express'),
      app = express(),
      PORT = process.env.PORT,
      bodyParser = require('body-parser'),
      playersRoutes = require('./routers/players'),
      gamesRoutes = require('./routers/games'),
      dotenv = require('dotenv'),
      mongoose = require('mongoose');
dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
                  { useNewUrlParser: true, useUnifiedTopology: true },
                  () => console.log("Connected to MongoDB"));


app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/players', playersRoutes);
app.use('/games', gamesRoutes);
app.get('/', (req,res) => {
  console.log("ICI /")
  res.format({
    html: () => {
      res.redirect('/games');
    },
    json: () => {
      res.json({error: {
        type: "406 NOT_API_AVAILABLE",
        message: ""
        }
      });

    }
  });
});

app.get('/test', function (req, res) {
    // res.send('Hello World');
    // res.render('main',{
    //     title: 'Bonjour!',
    //     name: 'Michaela',
    //     content: 'and now everything goes my way'
    // });
    res.format({html: () => { res.send('<p>Bonjour !</p>') },json: () => { res.send({ message:'Bonjour !' }) }})
});


app.listen(PORT, () => {
    console.log('Server up and running on localhost:', PORT);
});
