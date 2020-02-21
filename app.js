// le point d'entrée du serveur web
const express = require('express'),
      app = express(),
      PORT = process.env.PORT || 3000,
      bodyParser = require('body-parser');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// app.use('/players', );
// app.use('/games', );

app.get('/', function (req, res) {
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
