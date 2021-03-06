"use strict";
var express = require('express');
var app = express();
var session = require('cookie-session');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(session({
  secret: 'todotopsecret'
}))

/* S'il n'y a pas de todolist dans la session,
on en crée une vide sous forme d'array avant la suite */
.use(function (req, res, next) {
	if(typeof(req.session.todolist) == "undefined"){
		req.session.todolist = [];
	}
	next();
})

/*On affiche la todolist et le formulaire */
.get('/todo', function(req, res){
	res.render('todolist.ejs', {todolist: req.session.todolist});
})

/* On ajoute un élément à la todolist */
.post('/todo/ajouter/', urlencodedParser, function(req, res){
	if(req.body.newtodo != ''){
		req.session.todolist.push(req.body.newtodo);
	}
	res.redirect('/todo');
})

/* On supprime un élément de la todolist */
.get('/todo/supprimer/:id', function(req, res){
	if(req.params.id !=''){
		req.session.todolist.splice(req.params.id, 1);
	}
	res.redirect('/todo');
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
	res.redirect('/todo');
})

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});