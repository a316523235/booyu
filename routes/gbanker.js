var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var config = require('../config.json');
//var config.basePrice = 275.00;
//var config.investPrice = 275.00;
//var config.oldInvestPrice = config.investPrice;



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
	  body.price = body.price / 100;
	  var buyG = checkPrice(body.price);
	  saveConfig();
	  var msg = ckeckSendDingDing(body.price, buyG);
	  res.json({ title: 'g-banker info', buyG: buyG, msg: msg, result: body, config: config });
	}
  });
});

router.get('/test', function(req, res, next) {
  var buyG = checkPrice(276);
  saveConfig();
  var msg = ckeckSendDingDing(body.price, buyG);
  res.json({ title: 'g-banker info', buyG: buyG, msg: msg, config: config });
});

router.post('/', function(req, res, next) {
  var newBasePrice = req.query.basePrice;
  var oldBasePrice = config.basePrice;
  if(newBasePrice) {
  	basePrice = parseFloat(newBasePrice);
  }
  res.json({ rt: 1, title: 'g-banker info', basePrice: config.basePrice, oldBasePrice: oldBasePrice });
});

function checkPrice(gbankerPrice) {
	var buyG = 0;
	gbankerPrice = Math.round(gbankerPrice);
	if(gbankerPrice == config.basePrice) {
		return 0;
	}
	config.oldInvestPrice = config.investPrice;
	if(gbankerPrice < config.basePrice) {
		config.investPrice = Math.min(config.basePrice, config.investPrice);
		while(config.investPrice > gbankerPrice) {
			config.investPrice--;
			buyG += config.basePrice - config.investPrice;
		}
		buyG = buyG;
	} else {
		config.investPrice = Math.max(config.basePrice, config.investPrice);
		while(config.investPrice < gbankerPrice) {
			config.investPrice++;
			buyG += config.investPrice - config.basePrice;
		}
		buyG = -buyG;
	}
	return buyG;
}

function ckeckSendDingDing(gbankerPrice, buyG) {
	if(buyG == 0) {
		return;
	}
	var msg = getMsg(gbankerPrice, buyG);
	sendDingDing(msg);
}

function getMsg(gbankerPrice, buyG) {
	var msg = "当前价格：" + gbankerPrice + ", 上次提醒价格：" + config.oldInvestPrice + ", ";
	if(buyG > 0) {
		msg += "建议买入：" + Math.abs(buyG) + "克";
	} else {
		msg += "建议卖出：" + Math.abs(buyG) + "克";
	}
	console.log(msg);
	return msg;
}

function sendDingDing(msg) {
	var postData = {
	    "msgtype": "text", 
	    "text": {
	        "content": msg
	    }, 
	    "at": {
	        "atMobiles": [
	        ], 
	        "isAtAll": false
	    }
	};

	var options = {
	    method: 'post',
	    url: 'https://oapi.dingtalk.com/robot/send?access_token=c88befc4e1bc5ef9e289fd6e5891d37bf6f402f3d2aafdb8d0519f46786d23e7',
	    json: true,
	    header: {
	      'content-type': 'application/json'
	    },
	    body: postData
	};

	return msg + 'test..';

	var r = request(options, function (error, response, body) {
		console.log(body);
	});
}

function saveConfig() {
	fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
	console.log('complete to save gbanker config');
}

module.exports = router;