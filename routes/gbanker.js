var express = require('express');
var router = express.Router();
var basePrice = 175.00;
var thisAddPrice = 175.00;
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  var options = {
    method: 'post',
    url: 'https://www.g-banker.com/info/price',
    json: true,
    header: {
      'content-type': 'application/json'
    }
  };

  var r = request(options, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	  console.log(body)
	  res.json({ title: 'g-banker info', basePrice: basePrice, result: body});
	}
  });
});

router.post('/', function(req, res, next) {
  var newBasePrice = req.query.baseprice;
  var oldBasePrice = baseprice;
  if(newBasePrice) {
  	baseprice = parseFloat(newBasePrice);
  }
  res.json({ rt: 1, title: 'g-banker info', basePrice: basePrice, oldBasePrice: oldBasePrice });
});

module.exports = router;