var express = require('express'),
    stats = require('./routes/stats');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	app.use(express.static(__dirname + '/views'));
});

//User validation
var auth = express.basicAuth(function(user, pass) {     
   return (user == "lolo" && pass == "lcsc0807");
},'Super duper secret area');

//Password protected area
app.post('/stats', stats.addStat);
app.get('/stats', stats.findAll);
app.get('/stats/unread', stats.findUnreadAll);
app.get('/stats/unread/:name', auth, stats.findUnreadByName);
app.get('/stats/cdp', stats.findCdpAll);


 
app.listen(3000);
console.log('Listening on port 3000...');