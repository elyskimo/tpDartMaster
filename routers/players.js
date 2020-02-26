const router = require('express').Router();
const Player = require('../models/Player');
const GamePlayer = require('../models/GamePlayer');
const Game = require('../models/Game');
require('async');

router.get('/new', (req, res, next) => {
    res.format({
      html: () => {
        // res.redirect('/players/'+p._id+'/edit');
        res.render('players/edit.pug',{
          id: "",
          method: 'POST'
        });
      },
      json: () => {
        res.json({error: {
          type: "406 NOT_API_AVAILABLE",
          message: "message provenant de la route /players/new"
          }
        });
      }
    });
});

router.get('/:id', async (req, res, next) => {
    // redirect vers GET /players/:id/edit
    // console.log("GET /players/"+req.params.id);
    let player = await Player.findOne({_id: req.params.id}).then((p) => {
      console.log(p);
      res.format({
        html: () => {
          // res.redirect('/players/'+p._id+'/edit');
          res.render('players/edit.pug',{
            id: req.params.id,
            name: p.name,
            email: p.email,
            method: 'PATCH'
          });
        },
        json: () => {
          res.json({error: {
            type: "406 NOT_API_AVAILABLE",
            message: "message provenant de la route /players/id"
            }
          });
        }
      });
    }).catch(next);
    // console.log(player);


});

router.get('/:id/edit', async (req,res,next) => {
  // afficher un form de création de player (meme view que pour la création)
  let player = await Player.findOne({_id: req.params.id}).then((p) => {
    // res.send("EDIT "+req.params.id);
    res.format({
      html: () => {
        res.render('players/edit.pug',{
          id: req.params.id,
          name: p.name,
          email: p.email,
          method: 'PATCH'
        });
      },
      json: () => {
        res.json({error: {
          type: "406 NOT_API_AVAILABLE"
          }
        });
      }
    });
  }).catch(next);

});

router.patch('/:id', async (req,res,next) => {

  // permet d'editer un utilisateur
  if((!req.body.name || req.body.name === '') &&
     (!req.body.email || req.body.email === ''))
  {
    console.log("no name, no email");
    res.render('players/players.pug');
  }else{
    var body = {};
    req.body.name ? body.name = req.body.name : null;
    req.body.email ? body.email = req.body.email : null;

    await Player.updateOne({_id: req.params.id}, body)
          .then((p) => {
            res.format({
              html: () => {
                Player.find().then((ps) => {
                  res.render('players/players.pug', {
                    players: ps
                  });
                });
              },
              json: () => {
                res.json({
                  code: 200,
                  player: p
                })
              }
            })
          }).catch(next);

  }

});

router.delete('/:id', async(req,res,next) => {
  // permet de supprimer un utilisateur
  // s'il n'est dans aucune partie dont le statut started ou ended
  let gameplayers = await GamePlayer.find({playerId: req.params.id}).then(async(gameplayers) => {
    var deletable = true;
    console.log(gameplayers);
    if(gameplayers.length === 0){
      console.log("delete 123");
      await Player.findByIdAndDelete({_id: req.params.id}).then(() => {
        return res.format({
          html: () => {
            res.redirect('/players/');
          },
          json: () => {
            res.json({
              code: 204
            });
          }
        });
      });
    }
    gameplayers.forEach(async(gp, i) => {
      let g = await Game.findOne({_id: gp.gameId}).then((g) => {
        console.log(g);
        if(g.status === 'started' || g.status === 'ended'){
          deletable = false
        }
      });

      if(deletable){
        console.log("player deleted!");
        await Player.findByIdAndDelete({_id: req.params.id}).then(() => {
          return res.format({
            html: () => {
              res.redirect('/players/');
            },
            json: () => {
              res.json({
                code: 204
              });
            }
          });
        });
      }else{
        let err = new Error('410 PLAYER_NOT_DELETABLE');
        return next(err);
      }

    });
  }).catch(() => {
    let err = new Error('410 PLAYER_NOT_DELETABLE');
    return next(err);
  });

  res.redirect("/players/");
});

router.get('/', async (req, res, next) => {
    // console.log(req.body);
    if(req.body.limit < 21){
      var limit = req.body.limit;
    }
    if(req.body.sort === 'name' || req.body.sort === 'email' ||
       req.body.sort === 'gameWin' || req.body.sort === 'gameLost')
     {
       var sort = req.body.sort;
       var crois = 1;
     }else{
       var sort = "name";
       var crois = 1;
     }
     if(req.body.page === undefined){ var page = 0;}
     if(req.body.page > 0){
       var page = req.body.page-1;
     }
    if(req.body.reverse){
      var crois = -1;
    }
    // console.log(limit, sort, crois, page);

    let players = await Player.find()
                        .limit(limit ? parseInt(limit) : 10)
                        .sort({ sort: crois})
                        .skip(page*15)
                        .then((p) => {
                          // res.send(p);
                          res.format({
                            html: () => {
                              // console.log("player ",id);
                              res.render('players/players.pug',{
                                players: p
                              });
                            },
                            json: () => {
                              res.json(p);
                            }
                          });
                        });
});

router.post('/', async (req,res,next) => {
  // console.log(req.body);
  if( !req.body.name || req.body.name === '' ||
    !req.body.email || req.body.email === '')
  {
    let err = new Error('Please fill all the inputs');
    return next(err);
  }
  await Player.collection.insertOne({name: req.body.name, email: req.body.email,
                               gameWin: 0, gameLost: 0, createdAt: new Date(Date.now()) }).then((player) => {
    let id = player.ops[0]._id;
    res.format({
      html: () => {
        console.log("player ",id);
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
  }).catch(next);

});

module.exports = router;
