const moment = require('moment');

const Validate = require('../common/validationMotor');

const db = require("../models");
const Corporate = db.ins_corporate;
const Upload = db.ins_upload;

exports.create = (req, res) => {
  const product = Validate.string(req.body.product);
  if (product) return res.status(200).send({ status: 400, param: 'product', message: product });

  const proposer = Validate.string(req.body.proposer);
  if (proposer) return res.status(200).send({ status: 400, param: 'proposer', message: proposer });

  const insurer = Validate.string(req.body.insurer);
  if (insurer) return res.status(200).send({ status: 400, param: 'insurer', message: insurer });

  const sumInsured = Validate.number(req.body.sumInsured);
  if (sumInsured) return res.status(200).send({ status: 400, param: 'sumInsured', message: sumInsured });

  const policyNo = Validate.string(req.body.policyNo);
  if (policyNo) return res.status(200).send({ status: 400, param: 'policyNo', message: policyNo });

  const premium = Validate.number(req.body.premium);
  if (premium) return res.status(200).send({ status: 400, param: 'premium', message: premium });

  const dueDate = Validate.date(req.body.dueDate);
  if (dueDate) return res.status(200).send({ status: 400, param: 'dueDate', message: dueDate });

  const createdBy = Validate.string(req.body.createdBy);
  if (createdBy) return res.status(200).send({ status: 400, param: 'createdBy', message: createdBy });

  // Modifying dueDate to UTC
  req.body.dueDate = moment(req.body.dueDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');

  Corporate.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'sucAdded', data:suc});
  });
};

exports.getData = function(req, res) {
  const currentYear = moment().format('YYYY');

  let dueDateQry = {};
  const sdate =     '01-01-'+req.params.year;
  const startDate = moment(sdate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');
  if (req.params.year == currentYear) {
    dueDateQry = { $gte: new Date(startDate) };
  } else {
    const edate =     '31-12-'+req.params.year;
    const endDate =   moment(edate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');
    dueDateQry = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  Corporate.find({
    isActive: true, 
    isDeleted: false, 
    dueDate: dueDateQry
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : 1});
};

exports.update = (req, res) => {
  const id = Validate.string(req.body._id);
  if (id) return res.status(200).send({ status: 400, param: '_id', message: id });

  const product = Validate.string(req.body.product);
  if (product) return res.status(200).send({ status: 400, param: 'product', message: product });

  const proposer = Validate.string(req.body.proposer);
  if (proposer) return res.status(200).send({ status: 400, param: 'proposer', message: proposer });

  const insurer = Validate.string(req.body.insurer);
  if (insurer) return res.status(200).send({ status: 400, param: 'insurer', message: insurer });

  const sumInsured = Validate.number(req.body.sumInsured);
  if (sumInsured) return res.status(200).send({ status: 400, param: 'sumInsured', message: sumInsured });

  const policyNo = Validate.string(req.body.policyNo);
  if (policyNo) return res.status(200).send({ status: 400, param: 'policyNo', message: policyNo });

  const premium = Validate.number(req.body.premium);
  if (premium) return res.status(200).send({ status: 400, param: 'premium', message: premium });

  const dueDate = Validate.date(req.body.dueDate);
  if (dueDate) return res.status(200).send({ status: 400, param: 'dueDate', message: dueDate });

  const updatedBy = Validate.string(req.body.updatedBy);
  if (updatedBy) return res.status(200).send({ status: 400, param: 'updatedBy', message: updatedBy });

  // Modifying dueDate to UTC
  req.body.dueDate = moment(req.body.dueDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');

  Corporate.updateOne({_id: req.body._id}, {$set: req.body}, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "sucUpdated", data: [] });
  });
};

exports.delete = (req, res) => {
  const id = Validate.string(req.body._id);
  if (id) return res.status(200).send({ status: 400, param: '_id', message: id });

  const updatedBy = Validate.string(req.body.updatedBy);
  if (updatedBy) return res.status(200).send({ status: 400, param: 'updatedBy', message: updatedBy });

  const updateData = {isDeleted: true,  updatedBy: req.body.updatedBy};
  Corporate.updateOne({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "sucDeleted", data: [] });
  });
};

exports.upload = (req, res) => {
  const id = Validate.string(req.body.id);
  if (id) return res.status(200).send({ status: 400, param: '_id', message: id });

  const type = Validate.string(req.body.type);
  if (type) return res.status(200).send({ status: 400, param: 'type', message: type });

  const name = Validate.string(req.body.name);
  if (name) return res.status(200).send({ status: 400, param: 'name', message: name });

  const createdBy = Validate.string(req.body.createdBy);
  if (createdBy) return res.status(200).send({ status: 400, param: 'createdBy', message: createdBy });

  const reqData = {
    category: 'corporate',
    itemId:   req.body.id,
    type:     req.body.type,
    name:     req.body.name
  }
  Upload.create(reqData, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'sucAdded', data:suc});
  });
}

exports.getUpload = (req, res) => {
  Upload.find({
    category:   'corporate',
    isActive:   true, 
    isDeleted:  false,
    itemId:     req.params.id,
    type:       req.params.type
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.deleteUpload = (req, res) => {
  const id = Validate.string(req.body._id);
  if (id) return res.status(200).send({ status: 400, param: '_id', message: id });

  const updatedBy = Validate.string(req.body.updatedBy);
  if (updatedBy) return res.status(200).send({ status: 400, param: 'updatedBy', message: updatedBy });

  const updateData = {
    isDeleted: true,  
    updatedBy: req.body.updatedBy
  };

  Upload.updateOne({ _id: req.body._id }, updateData, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "sucDeleted", data: [] });
  });
};