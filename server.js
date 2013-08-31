var express = require('express'),
    stats = require('./routes/stats'),
	hash = require('./pass').hash;
	
 
var app = express();

// config
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	app.use(express.cookieParser('shhhh, very secret'));
	app.use(express.session());

});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(function(req, res, next){
  var err = req.session.error
    , msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// dummy database to be changed, wip
var users = {
  laurent: { name: 'laurent' },
  corneliu: { name: 'corneliu' }
};

hash('tbd', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.laurent.salt = salt;
  users.laurent.hash = hash;
});

hash('tbd', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.corneliu.salt = salt;
  users.corneliu.hash = hash;
});


// Authenticate 

function authenticate(name, pass, fn) {
  if (!module.parent) console.log('authenticating %s:%s', name, pass);
  var user = users[name];
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash(pass, user.salt, function(err, hash){
    if (err) return fn(err);
    if (hash == user.hash) return fn(null, user);
    fn(new Error('invalid password'));
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
	console.log("USER OK");
    next();
  } else {
	console.log("USER DENIED !!!");
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('login');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});


app.get('/show/:file', restrict, function(req, res){
  res.sendfile(__dirname + '/show/index.html');
});

app.post('/stats', stats.addStat);
//app.get('/stats', stats.findAll);
app.get('/stats/unread', stats.findUnreadAll);
app.get('/stats/unread/:name', stats.findUnreadByName);
//app.get('/stats/cdp', stats.findCdpAll);

app.post('/login', function(req, res){
  authenticate(req.body.username, req.body.password, function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation 
      req.session.regenerate(function(){
        // Store the user's primary key 
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        /*req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';*/
		  
		res.redirect('/show/index.html');
		
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.';
      res.redirect('login');
    }
  });
});
 
// staitc mapping to be done in the end since we do not want it to override folder restrict access
app.use('/show', express.static(__dirname + '/show'));
 
app.listen(3000);
console.log('Listening on port 3000...');