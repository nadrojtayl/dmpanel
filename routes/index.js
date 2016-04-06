var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

// Get HelloWorld
router.get('/',function(req,res){
	res.render('helloworld',{title:'Hello World'});
});

//the exports object that is sent over is the object router, which has a property called get
module.exports = router;
