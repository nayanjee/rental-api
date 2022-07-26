const db = require("../models");
const Lessor = db.lessor;

exports.create = (req, res) => {
  Lessor.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'added', data:suc});
  });
};


exports.getOwners = function(req, res) {
  Lessor.find({isActive:true, isDeleted:false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : -1});
};

exports.getOwnerByPropertyType = (req, res) => {
  Lessor.aggregate([
    {
      $match: {
        isDeleted: false,
        propertyType: req.params.propertyType
      }
    },
    { 
      $lookup: {
        from: "coowners",
        localField: "_id",
        foreignField: "lessorId",
        as: "coowner"
      }
    },
    {
      $sort: { name: 1 }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

exports.delete = (req, res) => {
  const updateData = {isDeleted: true};
  Lessor.update({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyDeleted", data: [] });
  });
};

exports.changeStatus = (req, res) => {
  console.log(req.body)
  let status = req.body.isActive ? true : false;

  const updateData = {isActive: status};
  Lessor.update({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
};

// Fetch owner by ownerId
exports.getOwnerById = function(req, res) {
  Lessor.findOne({_id: req.params.ownerId}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.update = (req, res) => {
  Lessor.findByIdAndUpdate({ _id: req.body.ownerId }, req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'successfullyUpdated', data:[]});
  });
};