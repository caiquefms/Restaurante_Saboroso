var express = require('express'); 
var router = express.Router();
var moment = require('moment');

var users = require('../public/inc/users');
var admin = require('../public/inc/admin');
var menus = require('../public/inc/menus');
var reservations = require('../public/inc/reservation');
var contacts  = require('../public/inc/contacts');
var emails = require('../public/inc/emails');

moment.locale("pt-BR");

router.use(function(req,res,next){
    if(['/login'].indexOf(req.url) ===-1 && !req.session.user){
        res.redirect("/admin/login")
    }else{
        next();
    }
});

router.use(function(req,res,next){
    req.menus = admin.getMenus(req);
    next();
})

router.get('/',function(req,res,next){
    admin.dashboard().then(data=>{
        res.render('admin/index',admin.getParams(req,{
            data
        }));
    }).catch(err=>{
        console.log(err);
    });
});

// LOGIN/ LOGOUT
router.get('/login',function(req,res,next){
    users.render(req,res,null);
});

router.post('/login',function(req,res,net){
    if(!req.body.email){
        users.render(req,res,"Preencha o campo email.");
    }else if(!req.body.password){
        users.render(req,res,"Preencha o campo da senha.");
    }else{
        users.login(req.body.email,req.body.password).then(user=>{
            req.session.user = user;
            res.redirect("/admin")
        }).catch(err=>{
            users.render(req,res,err.message || err);
        })
    }
});

router.get('/logout',function(req,res,next){
    delete req.session.user;
    res.redirect('/admin/login');
});

// MENU
router.get('/menus',function(req,res,next){
    menus.getMenus().then(data=>{
        res.render('admin/menus',admin.getParams(req,{
            data
        }));
    }).catch(err=>{
        console.log(err);
    });
});

router.post('/menus',function(req,res,next){
    menus.save(req.fields,req.files).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});

router.delete('/menus/:id',function(req,res,next){
    menus.delete(req.params.id).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    })
});

// RESERVA
router.get('/reservations',function(req,res,next){
    let start = (req.query.start) ? req.query.start : moment().subtract(1,"year").format("YYYY-MM-DD");
    let end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");

    reservations.getReservations(req).then(pag=>{
        res.render('admin/reservations',admin.getParams(
            req,{
                date:{
                    start,end
                },
                data:pag.data,
                moment,
                links:pag.links
            }    
        ));
    });;
});

router.post('/reservations',function(req,res,next){
    reservations.save(req.fields,req.files).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});

router.delete('/reservations/:id',function(req,res,next){
    reservations.delete(req.params.id).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});

router.get('    ',function(req,res,next){
    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1,"year").format("YYYY-MM-DD");
    req.query.end = (req.query.end) ? req.query.end : moment().format("YYYY-MM-DD");

    reservations.chart(req).then(chartData=>{
        res.send(chartData);
    });


});

// CONTATOS
router.get('/contacts',function(req,res,next){
    contacts.getContacts()
    .then(data =>{
        res.render('admin/contacts',admin.getParams(req,{
            data
        }));
    }).catch(err=>{
        console.log(err);
    });
});

router.delete('/contacts/:id',function(req,res,next){
    contacts.delete(req.params.id).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});

//USUÁRIOS
router.get('/users',function(req,res,next){
    users.getUsers()
    .then(data =>{
        res.render('admin/users',admin.getParams(req,{
            data
        }));
    }).catch(err=>{
        console.log(err);
    });
});

router.post('/users',function(req,res,next){
    users.save(req.fields,req.files).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});

router.post('/users/password-change',function(req,res,next){
    users.changePassword(req)
    .then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send({error:err});
    });
});

router.delete('/users/:id',function(req,res,next){
    users.delete(req.params.id).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});

// EMAILS
router.get('/emails',function(req,res,next){
    emails.getEmails()
    .then(data =>{
        res.render('admin/emails',admin.getParams(req,{
            data
        }));
    }).catch(err=>{
        console.log(err);
    });
});

router.delete('/emails/:id',function(req,res,next){
    emails.delete(req.params.id).then(results=>{
        res.send(results);
    }).catch(err=>{
        res.send(err);
    });
});



module.exports = router;