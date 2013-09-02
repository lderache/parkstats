var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('parkstats', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'parkstats' database");
        db.collection('parkstats', {strict:true}, function(err, collection) {
            if (err) {
                //console.log("The 'parkstats' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
    }
});
 
 
 
 exports.findAll = function(req, res) {
    var n = req.params.name;
    console.log('Retrieving all stats... ');
    db.collection('parkstats', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

// unread
exports.findUnreadByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {unread: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['unread']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// cdp
exports.findCdpByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {cdp: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['cdp']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// unreadtotal
exports.findUnreadTotalByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {unreadtotal: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['unreadtotal']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// unreadtotal
exports.findTotalDbByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {totaldb: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['totaldb']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// findTotalMovByName
exports.findTotalMovByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {totalmov: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['totalmov']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// findPerfectByName
exports.findPerfectByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {perfect: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['perfect']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// findError1ByName
exports.findError1ByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {error_1: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['error_1']));
				result.push(item);
			});
			res.send(result);
        });
    });
};

// findError2ByName
exports.findError2ByName = function(req, res) {
    var n = req.params.name;
    db.collection('parkstats', function(err, collection) {
        collection.find({name: n}, {error_2: 1, date : 1, _id: 0}).toArray(function(err, items) {
			result = [];
			items.forEach(function (data) {
				item = [];
				item.push(parseInt(data['date']));
				item.push(parseFloat(data['error_2']));
				result.push(item);
			});
			res.send(result);
        });
    });
};




exports.findUnreadAll = function(req, res) {
    db.collection('parkstats', function(err, collection) {
        collection.find({}, {unread: 1, date : 1, _id: 0}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findCdpAll = function(req, res) {
    db.collection('parkstats', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
 exports.addStat = function(req, res) {
    var stat = req.body;
    console.log('Adding stats: ' + JSON.stringify(stat));
    db.collection('parkstats', function(err, collection) {
        collection.insert(stat, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var stats = [
    {
		name: "marshall",
		date: "1221084000000",
		cdp: "29",
		unread: "0.50",
		totaldb: "56000",
		perfect: "64",
		error_1: "82",
		error_2: "90"
	},
	{
		name: "marshall",
		date: "1221170400000",
		cdp: "29",
		unread: "0.48",
		totaldb: "56000",
		perfect: "64",
		error_1: "82",
		error_2: "90"
	},
	{
		name: "marshall",
		date: "1221256800000",
		cdp: "29",
		unread: "0.49",
		totaldb: "56000",
		perfect: "64",
		error_1: "82",
		error_2: "90"
	},
	{
		name: "marshall",
		date: "1221343200000",
		cdp: "29",
		unread: "0.32",
		totaldb: "56000",
		perfect: "64",
		error_1: "82",
		error_2: "90"
	}
	,
	{
		name: "marshall",
		date: "1221429600000",
		cdp: "29",
		unread: "0.35",
		totaldb: "56000",
		perfect: "64",
		error_1: "82",
		error_2: "90"
	}
	,
	{
		name: "marshall",
		date: "1221516000000",
		cdp: "29",
		unread: "0.30",
		totaldb: "56000",
		perfect: "64",
		error_1: "82",
		error_2: "90"
	}];
 
    db.collection('parkstats', function(err, collection) {
        collection.insert(stats, {safe:true}, function(err, result) {});
    });
 
};