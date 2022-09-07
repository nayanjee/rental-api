const db = require("../models");
const State = db.state;

exports.getStates = function(req, res) {
  State.find({countryId: "6311eeaca11ae667905853ff", isActive:true, isDeleted:false}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({name : 1});
};
