const router = require('express').Router();
const Game = require('../models/Game');
require('async');

router.get('/new', (req, res, next) => {
  console.log("NEW ici");
  return res.format({
    html: () => {
      res.render('games/edit.pug',{
        id: "",
        modeOpt: Game.schema.path('mode').enumValues,
        statusOpt: Game.schema.path('status').enumValues,
        method: 'POST'
      });
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

router.get('/:id/edit', async(req, res, next) => {
  // afficher un form de création de game (meme view que pour la création)
  let player = await Game.findOne({_id: req.params.id}).then((g) => {
    // res.send("EDIT "+req.params.id);
    res.format({
      html: () => {
        res.render('games/edit.pug',{
          id: req.params.id,
          mode: g.mode,
          modeOpt: Game.schema.path('mode').enumValues,
          status: g.status,
          statusOpt: Game.schema.path('status').enumValues,
          name: g.name,
          currentPlayerId: g.currentPlayerId,
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

router.get('/:id/players', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.post('/:id/players', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.delete('/:id/players', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.delete('/:id/shots/previous', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.post('/:id/shots', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.get('/:id', async (req, res, next) => {
  let game = await Game.findOne({_id: req.params.id}).then((g) => {
    console.log(g);
    res.format({
      html: () => {
        // res.redirect('/players/'+p._id+'/edit');
        res.render('games/edit.pug',{
          id: req.params.id,
          mode: g.mode,
          modeOpt: Game.schema.path('mode').enumValues,
          status: g.status,
          statusOpt: Game.schema.path('status').enumValues,
          name: g.name,
          currentPlayerId: g.currentPlayerId,
          method: 'PATCH'
        });
      },
      json: () => {
        res.json(g);
      }
    });
  }).catch(next);
});

router.patch('/:id', async (req, res, next) => {
  console.log("PATCH ici");
  // permet d'editer un jeu
  let notEditedGame = await Game.findOne({_id: req.params.id}).then(async(g) => {
    if(p.status === "started"){
      let err = new Error('410 GAME_NOT_EDITABLE');
      return res.send(err);
    }else{
      if((!req.body.name || req.body.name === '') &&
         (!req.body.mode || req.body.mode === ''))
      {
        console.log("no name, no mode");
        let err = new Error('422 GAME_NOT_STARTABLE');
        return res.send(err);
      }else{
        var body = {};
        req.body.name ? body.name = req.body.name : null;
        req.body.mode ? body.mode = req.body.mode : null;
        body.status = "started";

        await Game.updateOne({_id: req.params.id}, body)
              .then((g) => {
                res.format({
                  html: () => {
                      res.redirect('games/'+req.params.id);
                  },
                  json: () => {
                    res.json({
                      code: 200,
                      player: g
                    })
                  }
                })
              }).catch(next);

      }
    }
  });


});

router.delete('/:id', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.get('/', async (req, res, next) => {
    if(req.body.limit < 21){
      var limit = req.body.limit;
    }
    if(req.body.sort === 'name' || req.body.sort === 'status')
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
    var filter = {};
    console.log(req.body);
    if(req.body.f){
      console.log("f.status");
      filter.status = req.body.f.status;
    }
    console.log(filter, "sort: "+crois, "limit: "+limit, "sort:"+sort);
    let games = await Game.find(filter)
                        .limit(limit ? parseInt(limit) : 10)
                        .sort({ sort: crois})
                        .skip(page*15)
                        .then((g) => {
                          res.format({
                            html: () => {
                              res.render('games/table.pug',{
                                games: g
                              });
                            },
                            json: () => {
                              res.json(g);
                            }
                          });
                        });
});

router.post('/', async (req, res, next) => {
    if(Object.entries(req.body).length === 0){
      let err = new Error('Please fill all the inputs');
      return next(err);
    }else{
      var insert = {};
      modeOptions = Game.schema.path('mode').enumValues;
      statusOptions = Game.schema.path('status').enumValues;
      console.log(req.body);
      if("modeselect" in req.body){
        if(modeOptions.includes(req.body.modeselect[1])){
          insert.mode = req.body.modeselect[1];
        }else{
          let err = new Error('Please enter valid values');
          return next(err);
        }
      }

      if("statusselect" in req.body){
        if(statusOptions.includes(req.body.statusselect[1])){
          insert.status = req.body.statusselect[1];
        }else{
          let err = new Error('Please enter valid values');
          return next(err);
        }
      }

      if("name" in req.body){
        if(req.body.name != undefined || req.body.name != ''){
          insert.name = req.body.name;
        }
      }

      if("currentPlayerId" in req.body){
        if(req.body.currentPlayerId != undefined || req.body.currentPlayerId != ''){
          insert.currentPlayerId = req.body.currentPlayerId;
        }
      }
      console.log(insert);

      if(Object.entries(insert).length === 0){
        let err = new Error('Entered values not valid');
        return next(err);
      }else{
        insert.createdAt = new Date(Date.now());

        await Game.collection.insertOne(insert).then((game) => {
          let id = game.ops[0]._id;
          let g = game.ops[0];
          res.format({
            html: () => {
              res.redirect('/games/'+id);
            },
            json: () => {
              res.json({error: {
                type: "201",
                game: g
                }
              });

            }
          });
        }).catch(next);
      }
    }

});

module.exports = router;
