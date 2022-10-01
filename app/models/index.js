/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 04/06/2022 - 15:17:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 04/06/2022
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose     = mongoose;
db.city         = require("./city.model");
db.state        = require("./state.model");
db.asset        = require("./asset.model");
db.admin        = require("./admin.model");
db.portal       = require("./portal.model");
db.lessor       = require("./lessor.model");
db.coowner      = require("./coowner.model");
db.authority    = require("./authority.model");
db.permission   = require("./permission.model");
db.rental_payment = require("./rental_payment.model");
db.rental_notification = require("./rental_notification.model");

db.ins_motor = require("./ins_motor.model");
db.ins_upload = require("./ins_upload.model");
db.ins_corporate = require("./ins_corporate.model");

db.sales = require("./sales.model");
db.stocks = require("./stock.model");
db.products = require("./product.model");
db.exl_stockiest = require("./exl_stockiest.model");

module.exports = db;
