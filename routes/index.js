var connection = require('../public/inc/db')
var menus = require('./../public/inc/menus');
var reservations = require('../public/inc/reservation')
var contacts = require('../public/inc/contacts');
var emails =  require('../public/inc/emails');

var express = require('express'); 
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  menus.getMenus().then(results=>{
    res.render('index',{
      title:"Restaurante Saboroso!",
      menus:results
    });
  });
});

router.get('/contact',function(req,res,next){
  contacts.render(req,res);
})

router.post('/contact',function(req,res,next){

  console.log(req.body)
  if(!req.body.name){
    contacts.render(req,res,'Digite o nome');
  }else if(!req.body.email){
    contacts.render(req,res,"Digite o email");
  }else if(!req.body.message){
    contacts.render(req,res,"Digite alguma mensagem");
  }else{
    contacts.save(req.body).then(results=>{
      req.body = {};
      contacts.render(req,res,null,"Contato enviado com sucesso")
    }).catch(err=>{
      contacts.render(req,res,err.message);
    });
  }
});

router.get('/menu',function(req,res,next){
  menus.getMenus().then(results=>{
    res.render('menu',{
      title:"Menu - Restaurante Saboroso!",
      background:"images/img_bg_1.jpg",
      mensagem_h1:"Saboreie nosso menu!",
      menus:results
    });
  });
})
router.get('/reservation',function(req,res,next){
  reservations.render(req,res);
})
router.post('/reservation',function(req,res,next){
  if(!req.body.name){
    reservations.render(req,res,'Digite o nome');
  }else if(!req.body.email){
    reservations.render(req,res,"Digite o email");
  }else if(!req.body.people){
    reservations.render(req,res,"Selecione a quantidade de pessoas ");
  }else if(!req.body.date){
    reservations.render(req,res,"Selecione a data");
  }else if(!req.body.time){
    reservations.render(req,res,"Selecione a hora");
  }else{
    reservations.save(req.body).then(results=>{
      req.body = {};
      reservations.render(req,res,null,"Reserva Realizada com sucesso")
    }).catch(err=>{
      reservations.render(req,res,err.message);
    });
  }

})
router.get('/services',function(req,res,next){
  res.render('services',{
    title:"Serviço - Restaurante Saboroso!",
    background:"images/img_bg_1.jpg",
    mensagem_h1:"É um prazer poder servir!"
  });
})
router.post('/subscribe',function(req,res,next){
  emails.save(req.body)
  .then(results=>{
    res.send(results)
  })
  .catch(err=>{
    res.send(err);
  });

})
module.exports = router;
