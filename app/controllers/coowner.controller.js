const db = require("../models");
const Coowner = db.coowner;

exports.create = (req, res) => {
  Coowner.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'added', data:suc});
  });
};


// Fetch co-owner by ownerId
exports.getRecordByOwnerId = function(req, res) {
  Coowner.find({lessorId: req.params.ownerId, isDeleted:false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.update = (req, res) => {
  Coowner.findByIdAndUpdate({ _id: req.body._id }, req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'successfullyUpdated', data:[]});
  });
};

exports.delete = (req, res) => {
  const updateData = {isDeleted: true, updatedBy: req.body.updatedBy};
  Coowner.updateOne({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyDeleted", data: [] });
  });
};