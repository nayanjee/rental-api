const moment = require('moment');

const Validate = require('../common/validationMotor');

const db = require("../models");
const Motor = db.ins_motor;

exports.create = (req, res) => {
  const make = Validate.string(req.body.make);
  if (make) return res.status(200).send({ status: 400, param: 'make', message: make });

  const model = Validate.string(req.body.model);
  if (model) return res.status(200).send({ status: 400, param: 'model', message: model });

  const manufactureAt = Validate.number(req.body.manufactureAt);
  if (manufactureAt) return res.status(200).send({ status: 400, param: 'manufactureAt', message: manufactureAt });

  const chachisNo = Validate.string(req.body.chachisNo);
  if (chachisNo) return res.status(200).send({ status: 400, param: 'chachisNo', message: chachisNo });

  const idv = Validate.number(req.body.idv);
  if (idv) return res.status(200).send({ status: 400, param: 'idv', message: idv });

  const proposer = Validate.string(req.body.proposer);
  if (proposer) return res.status(200).send({ status: 400, param: 'proposer', message: proposer });

  const insurer = Validate.string(req.body.insurer);
  if (insurer) return res.status(200).send({ status: 400, param: 'insurer', message: insurer });

  const policyNo = Validate.string(req.body.policyNo);
  if (policyNo) return res.status(200).send({ status: 400, param: 'policyNo', message: policyNo });

  const premium = Validate.number(req.body.premium);
  if (premium) return res.status(200).send({ status: 400, param: 'premium', message: premium });

  const dueDate = Validate.date(req.body.dueDate);
  if (dueDate) return res.status(200).send({ status: 400, param: 'dueDate', message: dueDate });

  // Modifying dueDate to UTC
  req.body.dueDate = moment(req.body.dueDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');

  Motor.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'sucAdded', data:suc});
  });
};

exports.getMotors = function(req, res) {
  Motor.find({isActive:true, isDeleted:false, isDisplay: true}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : 1});
};