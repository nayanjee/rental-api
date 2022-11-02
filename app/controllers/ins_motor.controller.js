const moment = require('moment');

const Validate = require('../common/validationMotor');

const db = require("../models");
const Motor = db.ins_motor;
const Upload = db.ins_upload;
const Corporate = db.ins_corporate;


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

  const createdBy = Validate.string(req.body.createdBy);
  if (createdBy) return res.status(200).send({ status: 400, param: 'createdBy', message: createdBy });

  // Modifying dueDate to UTC
  req.body.dueDate = moment(req.body.dueDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');

  Motor.create(req.body, (err, suc) => {
    if (err) return res.status(500).send({status: 400, message: 'somethingWrong'});
    res.status(200).send({status:200, message:'sucAdded', data:suc});
  });
};

exports.getData = function(req, res) {
  const sdate =     '01-01-'+req.params.year;
  const edate =     '31-12-'+req.params.year;
  const startDate = moment(sdate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');
  const endDate =   moment(edate, 'DD-MM-YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');

  Motor.find({
    isActive:   true, 
    isDeleted:  false, 
    dueDate:    {$gte: new Date(startDate), $lte: new Date(endDate)}
  }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : 1});
};

exports.update = (req, res) => {
  const id = Validate.string(req.body._id);
  if (id) return res.status(200).send({ status: 400, param: '_id', message: id });

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

  const updatedBy = Validate.string(req.body.updatedBy);
  if (updatedBy) return res.status(200).send({ status: 400, param: 'updatedBy', message: updatedBy });

  // Modifying dueDate to UTC,

  req.body.dueDate = moment(req.body.dueDate,'DD/MM/YYYY').format('YYYY-MM-DD[T]00:00:00.000[Z]');

  Motor.updateOne({_id: req.body._id}, {$set: req.body}, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "sucUpdated", data: [] });
  });
};

exports.delete = (req, res) => {
  const id = Validate.string(req.body._id);
  if (id) return res.status(200).send({ status: 400, param: '_id', message: id });

  const updatedBy = Validate.string(req.body.updatedBy);
  if (updatedBy) return res.status(200).send({ status: 400, param: 'updatedBy', message: updatedBy });

  const updateData = {
    isDeleted: true,  
    updatedBy: req.body.updatedBy
  };

  Motor.update({ _id: req.body._id }, updateData, function (err, data) {
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
    category: 'motor',
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
    category:   'motor',
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

exports.cronNotification = async (req, res) => {
  const td = moment().format('YYYY-MM-DD hh:mm:ss');

  const ago_15_days = moment().add(15,'d').format('YYYY-MM-DD');

  // To get active notifications from ins_notification table
  const motorsData = await getMotorData(ago_15_days);

  // To get data from ins_corporate table
  const corporatesData = await getCorporateData(ago_15_days);

  const finalResult = [];
  if (motorsData && motorsData.length) {
    motorsData.forEach(element => {
      const due = moment(element.dueDate).format('DD-MM-YYYY');
      const pushData = {
        itemId:  element._id,
        type: 'motor',
        dueDate: due,
        regNo: element.regNo,
        policyNo: element.policyNo
      }
      finalResult.push(pushData);
    });
  }

  if (corporatesData && corporatesData.length) {
    corporatesData.forEach(elem => {
      const due2 = moment(elem.dueDate).format('DD-MM-YYYY');
      const pushData2 = {
        itemId:  elem._id,
        type: 'corporate',
        dueDate: due2,
        policyNo: elem.policyNo
      }
      finalResult.push(pushData2);
    });
  }

  res.status(200).send({status:200, message:'Success', data:finalResult});
}

let getMotorData = (date) => {
  return new Promise(resolve => {
    const query = { 
      dueDate: { $eq: new Date(date) },
      isActive: true,
      isDeleted: false
    }

    Motor.find(query, (error, result) => {
      if (result && result.length) {
        resolve(result);
      } else {
        resolve([]);
      }
    })
  })
}

let getCorporateData = (date) => {
  return new Promise(resolve => {
    const query = { 
      dueDate: { $eq: new Date(date) },
      isActive: true,
      isDeleted: false
    }

    Corporate.find(query, (error, result) => {
      if (result && result.length) {
        resolve(result);
      } else {
        resolve([]);
      }
    })
  })
}