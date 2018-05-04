var log4js = require("log4js");
var log4js_config = require("./logConfig.json");
log4js.configure(log4js_config);


module.exports = log4js;