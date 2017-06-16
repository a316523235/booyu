var request = require('request');
var fs = require('fs');
var config = require('../config.json');

var gBankerJob = function() {};
module.exports = new gBankerJob();

gBankerJob.prototype.main = function() {
	console.log('gBankerJob.main run...');

	var options = {
	    method: 'post',
	    url: 'https://www.g-banker.com/price/query',
	    json: true,
	    headers: {
	      'content-type': 'application/json'
	    },
	    body: { "queryFlag": 3 }
    };

    var r = request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body);
			var price = body.data.realtime_price / 100;
			var buyG = checkPrice(price);
			saveConfig();
			var msg = ckeckSendDingDing(price, buyG);
			console.log(new Date() + ": " + msg);
	    }
    });
}

function checkPrice(gbankerPrice) {
	var buyG = 0;
	var cjPrice = gbankerPrice - config.preInverstPrice;
	var absCjPrice = Math.abs(cjPrice);
	var absInverstedPrice = Math.abs(config.inverstedPrice);
	var isSameSite = cjPrice*config.inverstedPrice > 0;

	if(absCjPrice > 1 
		|| (isSameSite && 
			((absCjPrice>0.75&&absInverstedPrice>3)||(absCjPrice > 0.5 && absInverstedPrice > 5)))) {

		config.oldPrice = config.preInverstPrice;
		if(!isSameSite) {
			config.inverstedPrice = 0;
			absInverstedPrice = 0;
		} 
		config.preInverstPrice = gbankerPrice;
		config.inverstedPrice += cjPrice;
		buyG = Math.pow(2, absCjPrice + absInverstedPrice) - Math.pow(2, absInverstedPrice);
		return buyG;
	}
	return 0;
}

function ckeckSendDingDing(gbankerPrice, buyG) {
	if(buyG == 0) {
		return '';
	}
	var msg = getMsg(gbankerPrice, buyG);
	sendDingDing(msg);
	return msg;
}

function getMsg(gbankerPrice, buyG) {
	var msg = "当前价格：" + gbankerPrice + ", 上次提醒价格：" + config.oldPrice + ", ";
	if(config.inverstedPrice < 0) {
		msg += "建议买入：" + Math.abs(buyG) + "克";
	} else {
		msg += "建议卖出：" + Math.abs(buyG) + "克";
	}
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

	var r = request(options, function (error, response, body) {
		console.log(body);
	});
}

function saveConfig() {
	fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
	console.log('complete to save gbanker config');
}