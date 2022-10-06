const xlsx = require('xlsx');
const moment = require('moment');

const uploadFile = require("../middlewares/uploadPayment");

const db = require("../models");
const Asset = db.asset;
const Lessor = db.lessor;
const Coowner = db.coowner;
const RentalPayment = db.rental_payment;

/*exports.create = (req, res) => {
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
        lessorId: req.body.ownerId,
        createdBy: req.body.createdBy
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
};*/

exports.create = (req, res) => {
  let success = 0;
  const nextYear = parseInt(req.body.year) + 1;
  const query = {
    financialYear: req.body.year + '-' + nextYear, 
    assetId: req.body.assetId,
    lessorId: req.body.ownerId,
    isActive: true
  }
  RentalPayment.find(query, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'Something went wrong please try again.'});
    if (!result) return res.status(200).send({status:400, message: 'No record found.'});

    if (result.length) {
      return res.status(200).send({status: 400, message: 'This property already exists in our records.'});
    } else {
      // ADD MAIN OWNER PAYMENT
      const reqData = {
        financialYear: req.body.year + '-' + nextYear, 
        assetId: req.body.assetId,
        lessorId: req.body.ownerId,
        createdBy: req.body.createdBy,
        payments: []
      }

      for (let i=4; i<=15; i++) {
        const month = (i > 12) ? i-12 : i; 
        const year = (i < 13) ? req.body.year : nextYear;
        const obj = {month: month, year: year, chequeNo: null, amount: null};
        reqData['payments'].push(obj);
      }

      RentalPayment.create(reqData, (err, suc) => {
        if (err) return res.status(500).send({status: 400, message: 'Something went wrong please try again.'});

        Coowner.find({lessorId: req.body.ownerId, isDeleted:false}, (error2, result2) => {
          if (result2.length) {
            // ADD CO-OWNER'S PAYMENT
            result2.forEach(element => {
              const reqData2 = {
                financialYear: req.body.year + '-' + nextYear, 
                assetId: req.body.assetId,
                lessorId: element._id,
                createdBy: req.body.createdBy,
                payments: []
              }

              for (let i=4; i<=15; i++) {
                const month = (i > 12) ? i-12 : i; 
                const year = (i < 13) ? req.body.year : nextYear;
                const obj = {month: month, year: year, chequeNo: null, amount: null};
                reqData2['payments'].push(obj);
              }

              RentalPayment.create(reqData2, (err, suc) => { });
            });
          }
          res.status(200).send({status:200, message:'added', data:[]});
        });
      });
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
      $lookup: {
        from: "lessors",
        localField: "lessorId",
        foreignField: "_id",
        as: "owner"
      }
    }, {
      $lookup: {
        from: "coowners",
        localField: "lessorId",
        foreignField: "_id",
        as: "coowner"
      }
    }, {
      $lookup: {
        from: "assets",
        localField: "assetId",
        foreignField: "_id",
        as: "asset"
      }
    }, {
      $unwind: "$asset"
    }, {
      $unwind: {path: "$owner", preserveNullAndEmptyArrays: true}
    }, {
      $unwind: {path: "$coowner", preserveNullAndEmptyArrays: true}
    }, {
      $sort: { "assetId": 1 }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};
/*
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
};*/

exports.updateCheque = (req, res) => {
  const reqData = { 
    _id: req.body.paymentId, 
    "payments.month": parseInt(req.body.month)
  };

  const updateData = {
      "payments.$.chequeNo": parseInt(req.body.chequeNo),
      "updatedBy": req.body.updatedBy
   };

  RentalPayment.updateOne(reqData, {$set: updateData}, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
}
/*exports.updateCheque = (req, res) => {
  RentalPayment.findOne({chequeNo: req.body.chequeNo}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});

    if (!result) {
      const updateData = {chequeNo: req.body.chequeNo, updatedBy: req.body.updatedBy};
      RentalPayment.updateOne({ _id: req.body._id }, updateData, function (err, data) {
        if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
        res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
      });
      
    } else {
      res.status(200).send({status:200, message:'success', data:result});
    }
  });
}*/

exports.updateAmount = (req, res) => {
  const reqData = { 
    _id: req.body.paymentId, 
    "payments.month": parseInt(req.body.month)
  };

  const updateData = {
      "payments.$.amount": parseInt(req.body.amount),
      "updatedBy": req.body.updatedBy
   };

  RentalPayment.updateOne(reqData, {$set: updateData}, function (err, data) {
    if (err) return res.status(400).send({ status: 400, message: "somethingWrong" });
    res.status(200).send({ status: 200, message: "successfullyUpdated", data: [] });
  });
}

exports.importPayment = async (req, res) => {
  try {
    // To upload file
    await uploadFile(req, res);

    console.log('req---', req);
    console.log('body---', req.body);
    console.log('file---', req.file);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    //res.status(200).send({status:200, message: "Uploaded the file successfully: " + req.file.originalname});

    // Insert records in database
    const finalResult = await convertExcelToJson(req.file.originalname, req.body.financialYear);
    res.status(200).send(finalResult);
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

let convertExcelToJson  = async (fileName, financialYear) => {
  console.log('convertExcelToJson---');
  return new Promise(async resolve => {
    const filePath = './public/uploads/payments/' + fileName;
    if (!filePath) {
      resolve({status:400, message: 'FilePath is null!'});
    }

    // Read the file using pathname
    const file = xlsx.readFile(filePath, { type: 'binary' , cellDates: true });
    if (!file.SheetNames) {
      resolve({status:400, message: "Worksheet's name or ressource was not found."});
    }
    
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;

    // Convert to json using xlsx
    const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[0]]);
    console.log('tempData---', tempData);

    const totalRow = tempData.length;
    if (totalRow == 0) {
      resolve({status:400, message: 'File content is empty.'});
    }
    console.log('totalRow---', totalRow);

    if (tempData.length > 1) {
      const years = financialYear.split('-');

      // change key name in array of objects
      const newArray = tempData.map(item => {
        let monthPayment = [];
        for (var i=0; i<12; i++) {
          let year = 0;
          let month = 0;
          if (i < 9) {
            year = years[0];
            month = i + 4;
          } else {
            year = parseInt(years[0]) + 1;
            month = i - 8;
          }
          const fullMonth = moment().month(month - 1).format("MMM");
          const chk = item[fullMonth+' Cheque'] ? item[fullMonth+' Cheque'] : null;
          const amt = item[fullMonth+' Amount'] ? item[fullMonth+' Amount'] : null;

          console.log('month--', month);
          console.log('year--', year);
          console.log('fullMonth--', fullMonth);

          const monthPay = {
            month : month,
            year : year,
            chequeNo : chk,
            amount : amt
          }
          monthPayment.push(monthPay);
        }

        return {
          financialYear: financialYear,
          assetId: item['Asset ID'],
          lessorId: item['Owner ID'],
          payments: monthPayment,
          createdBy: '629f2b920be81137cfedb9b6'
        }
      });
      console.log('newArray---', newArray);
      (async function(){
        const insertMany = await RentalPayment.insertMany(newArray);
        resolve({status:200, message: "Data added successfully."});
      })();
    }

  });
}
