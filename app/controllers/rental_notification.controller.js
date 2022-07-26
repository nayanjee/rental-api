const db = require("../models");
const RentalNotification = db.rental_notification;

exports.create = (req, res) => {
  RentalNotification.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'added', data:suc});
  });
};


