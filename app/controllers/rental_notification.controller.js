const db = require("../models");
const RentalNotification = db.rental_notification;


exports.getAll = function(req, res) {
  RentalNotification.find({isActive:true}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({dueDate : -1});
};

exports.changeStatus = (req, res) => {
  const updateData = {status:req.body.status, isActive:req.body.isActive, isDeleted: false, updatedBy: req.body.userId};
  RentalNotification.update({ _id: req.body.id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
};

exports.delete = (req, res) => {
  const updateData = {isActive:false, isDeleted: true,  updatedBy: req.body.userId};
  RentalNotification.update({ _id: req.body.id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
};
