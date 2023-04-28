var ObjectId = require('mongodb').ObjectID;
const db = require("../models");
const Asset = db.asset;
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
    //console.log(result);
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

exports.delete = (req, res) => {
  const updateData = {isActive: false, isDeleted: true, updatedBy: req.body.updatedBy};
  Lessor.update({ _id: req.body._id }, updateData, function (err, data) {
    if (err) {
      return res.status(400).send({ status: 400, message: "somethingWrong" });
    } else {
      // res.status(200).send({ status: 200, message: "successfullyDeleted", data: [] });
      Asset.find({ownerId: req.body._id}, (error, result) => {
        if (result && result.length) {
          result.forEach((element) => {
            Asset.update({ _id: element._id }, {isActive: false, isDeleted: true}, function (err, data) { });
          });
          res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
        }
      });
    }
  });
};

exports.changeStatus = (req, res) => {
  let status = req.body.isActive ? true : false;

  const updateData = {isActive: status, updatedBy: req.body.updatedBy};
  Lessor.update({ _id: req.body._id }, updateData, function (err, data) {
    if (err) {
      return res.status(400).send({ status: 400, message: "somethingWrong" });
    } else {
      if (!status) {
        Asset.find({ownerId: req.body._id}, (error, result) => {
          if (result && result.length) {
            result.forEach((element) => {
              Asset.update({ _id: element._id }, {isActive: false}, function (err, data) { });
            });
            res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
          }
        });
      } else {
        res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
      }
    }
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