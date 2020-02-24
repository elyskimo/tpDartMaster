const router = require('express').Router();

router.get('/new', (req, res, next) => {
    console.log('Correspond à /players/new');
    res.send("NEW PLAYER");
});

router.get('/:id', (req, res, next) => {
    // redirect vers GET /players/:id/edit
});

router.get('/:id/edit', (req,res,next) => {
  // afficher un form de création de player (meme view que pour la création)
});

router.patch('/:id', (req,res,next) => {
  // permet d'editer un utilisateur
});

router.delete('/:id', (req,res,next) => {
  // permet de supprimer un utilisateur
  // s'il n'est dans aucune partie dont le statut started ou ended
});

router.get('/', (req, res, next) => {
    console.log('Correspond à /players');
    res.send("PLAYERS");
});

router.post('/', (req,res,next) => {
  console.log(req.params);
  // res.send(req.query);
  res.format({
    html: () => {
      res.redirect('/players/'+id);
    },
    json: () => {
      res.json({error: {
        type: "406 NOT_API_AVAILABLE",
        message: ""
        }
      });

    }
  });
})

module.exports = router;
