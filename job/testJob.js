var testJob = function() {};
module.exports = new testJob();

testJob.prototype.main = function() {
	console.log('testJob...');
}