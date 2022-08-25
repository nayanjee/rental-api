const db = require("../models");
const Asset = db.asset;
const Lessor = db.lessor;

exports.create = (req, res) => {
  Asset.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'added', data:suc});
  });
};

exports.getAll = function(req, res) {
  Asset.find({isActive:true, isDeleted:false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : -1});
};

// Fetch asset by assetId
exports.getAssetById = function(req, res) {
  Asset.findOne({_id: req.params.assetId}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.getAssetByPropertyType = (req, res) => {
  Asset.find({propertyType: req.params.propertyType, isActive: true, isDeleted: false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({flatNo : 1});
};

// Get all the property (according to property type) with respective owner and co-owners
exports.getFullAssetByPropertyType = (req, res) => {
  Asset.aggregate([
    { 
      $match: {
        propertyType: req.params.propertyType,
        isDeleted: false
      }
    },
    { $sort : { allotee : 1 } },
    {
      $lookup: {
        from: "states",
        localField: "stateId",
        foreignField: "_id",
        as: "state"
      }
    },
    {
      $unwind: "$state"
    },
    {
      $lookup: {
        from: "cities",
        localField: "cityId",
        foreignField: "_id",
        as: "city"
      }
    },
    {
      $unwind: "$city"
    },
    {
      $lookup: {
        from: "lessors",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    {
      $unwind: "$owner"
    },
    {
      $lookup: {
        from: "coowners",
        localField: "owner._id",
        foreignField: "lessorId",
        as: "coowners"
      }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

exports.changeAssetStatus = (req, res) => {
  let status = req.body.isActive ? true : false;
  
  Lessor.findOne({_id: req.body.ownerId}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (result) {
      if (result.isActive) {
        const updateData = {isActive: status, isOccupied: false, updatedBy: req.body.updatedBy};
        Asset.update({ _id: req.body._id }, updateData, function (err, data) {
          if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
          res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
        });
      } else {
        res.status(200).send({ status: 200, message: "ownerInactive", data: [] });
      }
    } else {
      return res.status(200).send({status:400, message: 'noRecord'});
    }

    //res.status(200).send({status:200, message:'Success', data:result});
  });

  
};

exports.changeFlatStatus = (req, res) => {
  let status = req.body.isOccupied ? true : false;
  const updateData = {isOccupied: status, updatedBy: req.body.updatedBy};
  Asset.update({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
};

exports.deleteFlat = (req, res) => {
  const updateData = {isDeleted: true, updatedBy: req.body.updatedBy};
  Asset.update({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
};

exports.update = (req, res) => {
  Asset.findByIdAndUpdate({ _id: req.body.assetId }, req.body, (err, suc) => {
    console.log('-----', res.status);
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'successfullyUpdated', data:[]});
  });
};