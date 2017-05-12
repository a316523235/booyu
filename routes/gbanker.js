var express = require('express');
var router = express.Router();
var basePrice = 175.00;
var investPrice = 175.00;
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
	  console.log(body);
	  var bugG = checkPrice(body.price);
	  res.json({ title: 'g-banker info', basePrice: basePrice, result: body, bugG: bugG});
	}
  });
});

router.post('/', function(req, res, next) {
  var newBasePrice = req.query.basePrice;
  var oldBasePrice = basePrice;
  if(newBasePrice) {
  	basePrice = parseFloat(newBasePrice);
  }
  res.json({ rt: 1, title: 'g-banker info', basePrice: basePrice, oldBasePrice: oldBasePrice });
});

function checkPrice(gbankerPrice) {
	var buyG = 0;
	gbankerPrice = Math.round(gbankerPrice);
	if(gbankerPrice == basePrice) {
		return 0;
	}
	if(gbankerPrice < basePrice) {
		investPrice = Math.min(basePrice, investPrice);
		while(investPrice > gbankerPrice) {
			investPrice--;
			buyG += basePrice - investPrice;
		}
		buyG = buyG;
	} else {
		investPrice = Math.max(basePrice, investPrice);
		while(investPrice < gbankerPrice) {
			investPrice++;
			buyG += investPrice - basePrice;
		}
		buyG = -buyG;
	}
	return buyG;
}

module.exports = router;