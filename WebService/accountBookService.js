/*jshint esversion: 6 */
'use strict';

// BASE SETUP
// =====================================================================================================================

let express = require('express');
let app = express();

let bodyParser = require('body-parser');
let cors = require('cors');
let nano = require('nano')('http://localhost:5984');
let momentjs = require('moment');

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let port = process.env.PORT || 8081;
let preloadRefreshTime = 1000 * 60 * 15;

// INIT COUCH DB
// =====================================================================================================================

nano.db.create('accountbook', function (err, body) {

    if (err) {
        console.log('Database "accountbook" could not be created.');
    } else {
        console.log('Successfully created database "accountbook".');
    }

    let accountBook = nano.db.use('accountbook');

    accountBook.get('_design/bookingDate', function (err, body) {

        let options = {
            views: {
                bookingDate: {
                    map: function (doc) {
                        emit(doc.bookingDate);
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

    accountBook.get('_design/uniqueTitle', function (err, body) {

        let options = {
            views: {
                uniqueTitle: {
                    map: function (doc) {
                        emit(doc.title);
                    },
                    reduce: '_count'
                }
            }
        };

        if (!err) {
            options._rev = body._rev;
        }

        accountBook.insert(options, '_design/uniqueTitle', function (err, body) {
            if (err) {
                console.log('View "_design/uniqueTitle" could not be created.');
            } else {
                console.log('Successfully created view "_design/uniqueTitle".');
            }
        });

    });

});

let accountBook = nano.db.use('accountbook');

// PRELOAD
// =====================================================================================================================

let uniqueTitles = [];

function getUniqueTitles() {

    let options = {
        group: true
    };

    accountBook.view('uniqueTitle', 'uniqueTitle', options, function (err, body) {

        if (err) {

            console.log(err);

        } else {

            if (body && body.rows) {

                uniqueTitles = body.rows;

                // Trim
                let toBeRemoved = [];
                for (let i = 0, len = uniqueTitles.length; i < len; i++) {
                    if (uniqueTitles[i].key && (typeof uniqueTitles[i].key === 'string' || uniqueTitles[i].key instanceof String)) {
                        uniqueTitles[i].key = uniqueTitles[i].key.trim();
                    } else {
                        // Mark title to be removed since it is not a valid string value
                        toBeRemoved.push(i);
                    }
                }

                // Remove invalid titles
                for (let i = toBeRemoved.length - 1; i >= 0; i--) {
                    uniqueTitles.splice(toBeRemoved[i], 1);
                }

                // Group by key and sum up the value (count)
                uniqueTitles = uniqueTitles.reduce(function (rv, x) {
                    let v = x.key, el = rv.find((r) => r && r.key === v);
                    if (el) {
                        el.value += x.value;
                    } else {
                        rv.push({key: v, value: x.value});
                    }
                    return rv;
                }, []);

                // Sort by value descending
                uniqueTitles = uniqueTitles.sort(function (a, b) {
                    if (a.value === b.value) {
                        return 0;
                    }
                    else {
                        return (a.value < b.value) ? 1 : -1;
                    }
                });

                console.log('Refreshed unique titles for auto complete.');

            }

        }
    });

}

getUniqueTitles();
setInterval(getUniqueTitles, preloadRefreshTime);

// ROUTES
// =====================================================================================================================

let router = express.Router();

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

    let currentTimePeriod = req.query.timePeriod;
    let previousTimePeriod = currentTimePeriod === 'month' ? 'months' : 'years';
    let date = new Date(req.query.date);

    let firstDayCurrentTimePeriod = momentjs(date).startOf(currentTimePeriod).toISOString().slice(0, -5);
    let lastDayCurrentTimePeriod = momentjs(date).endOf(currentTimePeriod).toISOString().slice(0, -5);

    let firstDayPreviousTimePeriod = momentjs(date).subtract(1, previousTimePeriod).startOf(currentTimePeriod).toISOString().slice(0, -5);
    let lastDayPreviousTimePeriod = momentjs(date).subtract(1, previousTimePeriod).endOf(currentTimePeriod).toISOString().slice(0, -5);

    let optionsCurrentTimePeriod = {
        startkey: lastDayCurrentTimePeriod,
        endkey: firstDayCurrentTimePeriod,
        descending: true,
        include_docs: true
    };

    let optionsPreviousTimePeriod = {
        startkey: lastDayPreviousTimePeriod,
        endkey: firstDayPreviousTimePeriod,
        descending: true,
        include_docs: true
    };

    let result = {};

    accountBook.view('bookingDate', 'bookingDate', optionsCurrentTimePeriod, function (err, body) {

        if (err) {

            res.json(err);

        } else {

            result.currentTimePeriodData = body.rows;

            accountBook.view('bookingDate', 'bookingDate', optionsPreviousTimePeriod, function (err, body) {

                if (err) {

                    res.json(err);

                } else {

                    result.previousTimePeriodData = body.rows;
                    res.json(result);

                }

            });

        }

    });

});

router.get('/titles', function (req, res) {

    res.json(uniqueTitles);

});

app.use('/api', router);

// START
// =====================================================================================================================

app.listen(port);
console.log('Webservice started on port ' + port + '.');