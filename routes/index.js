var express = require('express');
var router = express.Router();

//sets router to respond to get requests on the main page by outputting the 'panelhomepage'
router.get('/',function(req,res){
	res.render('panelhomepage',{title:'DM Panel'});
});

module.exports = router;
