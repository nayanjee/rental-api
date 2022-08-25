const db = require("../models");
const Sales = db.sales;
const Stocks = db.stocks;
const Product = db.products;
const ExlStockiest = db.exl_stockiest;


exports.getSales = async function(req, res) {
  const divisionCode = ['2', '6'];
  const stockiest = await getExlStockiest();
 
  Sales.aggregate([
    {
      $match: {
        plantCode: '9011',
        billDocType: { $ne: 'ZCRF' },
        divSAPcode: { $in: divisionCode },
        monthYear: { $gte: new Date('2022-06-01'), $lte: new Date('2022-07-01') },
        customer: { $nin: stockiest }
      }
    }, {
      $group: {
        _id: { division: "$division", monthYear: "$monthYear",  name: "$name"},
        division: { $first: "$division" },
        divSAPcode: { $first: "$divSAPcode" },
        monthYear: { $first: "$monthYear" },
        name: { $first: "$name" },
        materialCode: { $first: "$materialCode" },
        totalQty: { $sum: "$salesQty" }
      }
    }, {
      $project: {
        division: 1,
        divSAPcode: 1,
        name: 1,
        monthYear: 1,
        materialCode: 1,
        totalQty: 1
      }
    }, {
      $sort: { 
        divSAPcode: 1,
        monthYear: 1,
        name: 1
      }
   }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};


let getExlStockiest = () => {
  return new Promise(resolve => {
    let stockiestId = [];
    ExlStockiest.find({status: 1}, (error, result) => {
      if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
      if (result && result.length) {
        result.map(item => {
          stockiestId.push(item.sapCustId);
        });
        resolve(stockiestId);
      } else {
        resolve(stockiestId);
      }
    });
  });
}

exports.getProductByDivisionId = function(req, res) {
  Product.find({status: 1, divSAPcode: req.params.divisionId }, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
}

exports.getStocks = function(req, res) {
  console.log(req.body.monthYear);
  Stocks.aggregate([
    {
      $match: {
        plantCode: req.body.plantCode,
        divSAPcode: { $in: req.body.divSAPcode },
        monthYear: { $eq: new Date('2022-07-01') }
      }
    }, {
      $group: {
        _id: { division: "$division", monthYear: "$monthYear",  name: "$name"},
        division: { $first: "$division" },
        divSAPcode: { $first: "$divSAPcode" },
        monthYear: { $first: "$monthYear" },
        name: { $first: "$name" },
        materialCode: { $first: "$materialCode" },
        totalQty: { $sum: "$stockQty" },
        totalValue:  { $sum: "$value" }
      }
    }, {
      $project: {
        division: 1,
        divSAPcode: 1,
        name: 1,
        monthYear: 1,
        materialCode: 1,
        totalQty: 1,
        totalValue: 1
      }
    }, {
      $sort: { 
        divSAPcode: 1
      }
    }
  ]).exec((error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  });
};

