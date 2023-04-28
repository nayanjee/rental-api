const fs = require('fs');
const xlsx = require('xlsx');
const multer = require("multer");
const moment = require('moment');

const uploadFile = require("../middlewares/uploadFiles");

const db = require("../models");
const RentalFile = db.rental_file;

exports.assetFileUpload = async (req, res) => {

  try {
    // To upload file
    await uploadFile(req, res);

    // Functionality after upload
    if (req.file == undefined) {
      return res.status(200).send({status:400, message: "Please upload a file!" });
    }

    const insertData = {
    	assetId: req.body.assetId,
    	filename: req.file.filename,
    	updatedBy: req.body.updatedBy
    }

    RentalFile.create(insertData, (err, suc) => {
	    if (err) return res.status(500).send({status: 400, message: err});
	    res.status(200).send({status:200, message:'added', data:suc});
	  });
  } catch (err) {
    res.status(200).send({status:500, message: `Could not upload the file: ${err}`});
  }
}

exports.assetRemoveFile = async (req, res) => {
	const fileName = req.body.filename;
	const filePath = __basedir + "/public/uploads/files/" + fileName;
  fs.exists(filePath, function(exists) {
  	if(exists) {
      RentalFile.deleteOne({_id: req.body.id}, (err, suc) => {
      	if (err) return res.status(500).send({status: 400, message: err});

      	fs.unlinkSync(filePath); // Remove file from the folder

	    	res.status(200).send({status:200, message:'deleted', data:req.body.id});
      });
	  } else {
	  	res.status(200).send({status:500, message: 'File not found!'});
	  }
  });
}

exports.assetFiles = (req, res) => {
  RentalFile.find({assetId: req.params.assetId}, (error, result) => {
    if (error) return res.status(400).send({status:400, message: 'problemFindingRecord'});
    if (!result) return res.status(200).send({status:400, message: 'noRecord'});

    res.status(200).send({status:200, message:'Success', data:result});
  }).sort({flatNo : 1});
};

exports.assetDownloadFile = (req, res) => {
	const filePath = __basedir + "/public/uploads/files/" + req.params.filename;
	res.download(filePath, req.params.filename, (err) => {
    if (err) {
      res.send({
        error : err,
        msg   : "Problem downloading the file"
      })
    }
  });
}