const db = require("../models");
const RentalPayment = db.rental_payment;

exports.create = (req, res) => {
  const nextYear = parseInt(req.body.year) + 1;
  const query = {
    financialYear: req.body.year + '-' + nextYear, 
    assetId: req.body.assetId,
    lessorId: req.body.ownerId,
    isActive: true
  }
  RentalPayment.find(query, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    if (result.length) {
      return res.status(400).send({status: 400, message: 'exists'});
    } else {
      const reqData = {
        financialYear: req.body.year + '-' + nextYear, 
        assetId: req.body.assetId,
        lessorId: req.body.ownerId
      }

      for (let i=4; i<=12; i++) {
        reqData['month'] = i;
        reqData['year'] = req.body.year;
        console.log('final---', reqData);
        RentalPayment.create(reqData, (err, suc) => { });
      }

      for (let i=1; i<=3; i++) {
        reqData['month'] = i;
        reqData['year'] = nextYear;
        console.log('final---', reqData);
        RentalPayment.create(reqData, (err, suc) => { });
      }

      res.status(200).send({status:200, message:'added', data:[]});
    }
  });
};

exports.getPayments = (req, res) => {
  RentalPayment.aggregate([
    { 
      $match: { 
        financialYear: req.params.financialYear
      }
    }, { 
      $group: {
        _id: "$assetId", 
        assetId: { "$first": "$assetId" },
        lessorId: { "$first": "$lessorId" },
        payments: { $push: "$$ROOT" }
      }
    }, {
      $lookup: {
        from: "lessors",
        localField: "lessorId",
        foreignField: "_id",
        as: "owner"
      }
    }, {
      $lookup: {
        from: "assets",
        localField: "assetId",
        foreignField: "_id",
        as: "asset"
      }
    }, {
      $unwind: "$owner"
    }, {
      $unwind: "$asset"
    }, {
      $sort: { "asset.flatNo": 1 }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

exports.updateCheque = (req, res) => {
  RentalPayment.findOne({chequeNo: req.body.chequeNo}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});

    console.log('result---', result);
    if (!result) {
      const updateData = {chequeNo: req.body.chequeNo};
      RentalPayment.updateOne({ _id: req.body._id }, updateData, function (err, data) {
        if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
        res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
      });
      
    } else {
      res.status(200).send({status:200, message:'success', data:result});
    }
  });
}

exports.updateAmount = (req, res) => {
  const updateData = {amount: req.body.amount};
  RentalPayment.updateOne({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
}