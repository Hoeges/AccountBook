'use strict';

// BASE SETUP
// =====================================================================================================================

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cors = require('cors');
var nano = require('nano')('http://localhost:5984');

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8081;

// INIT COUCH DB
// =====================================================================================================================

nano.db.create('accountbook', function (err, body) {

    if (err) {
        console.log('Database "accountbook" could not be created.');
    } else {
        console.log('Successfully created database "accountbook".');
    }

    var accountBook = nano.db.use('accountbook');

    accountBook.get('_design/bookingDate', function (err, body) {

        var options = {
            views: {
                bookingDate: {
                    map: function (doc) {
                        emit(doc.bookingDate, 1);
                    }
                }
            }
        };

        if (!err) {
            options._rev = body._rev;
        }

        accountBook.insert(options, '_design/bookingDate', function (err, body) {
            if (err) {
                console.log('View "_design/bookingDate" could not be created.');
            } else {
                console.log('Successfully created view "_design/bookingDate".');
            }
        });

    });

});

var accountBook = nano.db.use('accountbook');

// ROUTES
// =====================================================================================================================

var router = express.Router();

router.post('/update', function (req, res) {

    accountBook.insert(req.body, null, function (err, body) {
        if (err) {
            res.json(err);
        } else {
            res.json(body);
        }
    });

});

router.post('/delete', function (req, res) {

    if (req.body.rowId && req.body.revId) {

        accountBook.destroy(req.body.rowId, req.body.revId, function (err, body) {
            if (err) {
                res.json(err);
            } else {
                res.json(body);
            }
        });

    }

});

router.get('/list', function (req, res) {

    var timePeriod = req.query.timePeriod;
    var date = new Date(req.query.date), y = date.getFullYear(), m = date.getMonth();
    var firstDay, lastDay;

    if (timePeriod === 'month') {
        firstDay = new Date(y, m, 1);
        lastDay = new Date(y, m + 1);
    }

    if (timePeriod === 'year') {
        firstDay = new Date(y, 0, 1);
        lastDay = new Date(y, 11, 31);
    }

    var options = {
        startkey: lastDay,
        endkey: firstDay,
        descending: true,
        include_docs: true
    };

    accountBook.view('bookingDate', 'bookingDate', options, function (err, body) {
        if (err) {
            res.json(err);
        } else {
            res.json(body.rows);
        }
    });

});

app.use('/api', router);

// START
// =====================================================================================================================

app.listen(port);
console.log('Webservice started on port ' + port + '.');