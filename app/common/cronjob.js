const { uuid } = require('uuidv4');
const cron = require('node-cron');
const moment = require('moment');

const db 										= require("../models");
const Asset 								= db.asset;
const Motor									= db.ins_motor;
const Corporate							= db.ins_corporate;
const RentalPayment 				= db.rental_payment;
const RentalNotification 		= db.rental_notification;
const InsuranceNotification = db.ins_notification;


/* 
 *
 * Upcoming agreement expiry cron
 * This cron will fetch the records 10 days before the contract expiration date
 * Execution time: Every-day at 06:50 AM IST
 * 
*/
cron.schedule('20 1 * * *', async () => {
	const td = moment().format('YYYY-MM-DD hh:mm:ss');
	console.log('Agreement Expiry Cron ---', td);


	const today = moment().format('YYYY-MM-DD[T]23:59:59.999[Z]');
	const ago_10_days = moment().subtract(9,'d').format('YYYY-MM-DD');

	// To get active notifications
	const activeNotifications = await getActiveNotification();

	// To get inactive notifications within 10 days
	const inactiveNotifications = await getInactiveNotification(today, ago_10_days);

	// Merge active and inactive notifications
	const notificationExists = activeNotifications.concat(inactiveNotifications);

	// To get records of upcoming contract/agreement termination/expiry
	const upcomingAgreementExpiry = await getUpcomingAgreementExpiry(today, ago_10_days, notificationExists);


	// Insert agreement expiry records in notification collection
	if (upcomingAgreementExpiry && upcomingAgreementExpiry.length) {
		const insertData = [];
		upcomingAgreementExpiry.forEach(element => {
			const pushData = {
				assetId:  element._id,
				type: 'agreementExpire',
				dueDate: element.agreementExpiryDate,
				message: 'Agreement is about to expire - ' + element.flatNo + ', ' + element.address + ', ' + element.location
			}
			insertData.push(pushData);
		});

		RentalNotification.insertMany(insertData).then(function(){
	    console.log("---Notification Data inserted");
		}).catch(function(error){
	    console.log("---Notification Data insert---", error);
		});
	}
});

let getInactiveNotification = (today, agoDate) => {
  return new Promise(resolve => {
  	const query = { 
      isActive: false,
      createdAt: { 
        $gte: new Date(agoDate),
        $lte: new Date(today),
      }
    }

  	RentalNotification.find(query, (error, result) => {
  		if (result && result.length) {
        let ids = [];
        result.forEach(element => {
        	ids.push(element.assetId);
        })

        resolve(ids);
      } else {
        resolve([]);
      }
  	})
  })
}

let getActiveNotification = () => {
  return new Promise(resolve => {
  	const query = { 
  		type: 'agreementExpire',
      isActive: true,
      isDeleted: false
    }

  	RentalNotification.find(query, (error, result) => {
  		if (result && result.length) {
        let ids = [];
        result.forEach(element => {
        	ids.push(element.assetId);
        })

        resolve(ids);
      } else {
        resolve([]);
      }
  	})
  });
}

let getUpcomingAgreementExpiry = (today, agoDate, ids) => {
  return new Promise(resolve => {
  	const query = { 
      isActive: true,
      isDeleted: false,
      agreementExpiryDate: { 
          $gte: new Date(agoDate),
          $lte: new Date(today),
      },
      _id: { $nin: ids }
    }

    Asset.aggregate([
    	{ $match: query }
		]).exec((error, result) => {
      if (result && result.length) {
        resolve(result);
      } else {
        resolve([]);
      }
    });
  });
};


/* 
 *
 * Upcoming rent payment cron
 * This cron will get the record 1 day before the payment date
 * Execution time: Every-day at 06:40 AM IST
 * 
*/
cron.schedule('10 1 * * *', async () => {
	const td = moment().format('YYYY-MM-DD hh:mm:ss');
	console.log('Upcoming rent payment cron ---', td);

	const date = parseInt(moment().subtract(1, 'days').format('DD'));
	const month = parseInt(moment().format('MM'));
	const year = parseInt(moment().format('YYYY'));
	
	// Get property of previous day's due date
	const previousDayAssets = await getPreviousDayAssets(date);

	if (previousDayAssets && previousDayAssets.length) {
		// Check whether payment has been made or not
		const paymentDue = await getDuePayment(month, year, previousDayAssets);
		console.log(paymentDue);

		if (paymentDue && paymentDue.length) {
			const insertData = [];
			const yesterday = moment().subtract(1, 'days');
			const dueDate = yesterday.toISOString().split('T')[0];		// Convert date if date is in string and ISO

			paymentDue.forEach(element => {
				const pushData = {
					assetId:  element.assetId,
					type: 'paymentDue',
					dueDate: dueDate,
					message: 'Payment is due - ' + element.asset.flatNo + ', ' + element.asset.address + ', ' + element.asset.location
				}
				insertData.push(pushData);
			});

			RentalNotification.insertMany(insertData).then(function(){
		    console.log("---Upcoming rent payment Notification inserted");
			}).catch(function(error){
		    console.log("---Upcoming rent payment Notification ", error);
			});
		}
	}
});

let getDuePayment = (month, year, dueIds) => {
	return new Promise(resolve => {
		const query = { 
      isActive: true,
      year: year,
    	month: month,
    	amount: null,
    	assetId: { $in: dueIds }
    }
    console.log(query);
    
    RentalPayment.aggregate([
	    {
	      $match: query
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
	    }
    ]).exec((error, result) => {
    	if (result && result.length) {
        resolve(result);
      } else {
        resolve([]);
      }
    });
  })
};

let getPreviousDayAssets = (date) => {
	return new Promise(resolve => {
		const query = { 
      isActive: true,
      isDeleted: false,
      paymentDueDate: date,
      propertyType: { $in: [ 'commercial', 'residential'] }
    }

  	Asset.find(query, (error, result) => {
  		if (result && result.length) {
        let ids = [];
        result.forEach(element => {
        	ids.push(element._id);
        })

        resolve(ids);
      } else {
        resolve([]);
      }
  	});
  })
};


/* 
 *
 * Rent increment cron
 * This cron will get the record 1 day before the increment date
 * Execution time: Every-day at 06:30 AM IST
 * 
*/
cron.schedule('0 1 * * *', async () => {
	const td = moment().format('YYYY-MM-DD hh:mm:ss');
	console.log('Rent increment cron ---', td);

	const today = moment().format('YYYY-MM-DD[T]00:00:00.000[Z]');
	
	// To get active notifications
	const activeNotifications = await getIncrementActiveNotifications();

	// To get today's increment data
	const todayIncrement = await getTodayIncrement(today, activeNotifications);

	// Insert neet to increment records in notification collection
	if (todayIncrement && todayIncrement.length) {
		const insertData = [];
		todayIncrement.forEach(element => {
			const pushData = {
				assetId:  element._id,
				type: 'increment',
				dueDate: element.rentEscalationDate,
				message: 'Rent incrementation - ' + element.flatNo + ', ' + element.address + ', ' + element.location
			}
			insertData.push(pushData);
		});

		RentalNotification.insertMany(insertData).then(function(){
	    console.log("---Notification Increment Data inserted");
		}).catch(function(error){
	    console.log("---Notification Increment Data insert---", error);
		});
	}
});

let getIncrementActiveNotifications = () => {
	return new Promise(resolve => {
  	const query = { 
  		type: 'increment',
      isActive: true,
      isDeleted: false
    }

  	RentalNotification.find(query, (error, result) => {
  		if (result && result.length) {
        let ids = [];
        result.forEach(element => {
        	ids.push(element.assetId);
        })

        resolve(ids);
      } else {
        resolve([]);
      }
  	})
  })
}

let getTodayIncrement = (date, ids) => {
	return new Promise(resolve => {
  	const query = { 
      isActive: true,
      isDeleted: false,
      rentEscalationDate: { $eq: new Date(date) },
      _id: { $nin: ids }
    }

    Asset.aggregate([
    	{ $match: query }
		]).exec((error, result) => {
      if (result && result.length) {
        resolve(result);
      } else {
        resolve([]);
      }
    });
  });
}


/* 
 *
 * Upcoming Motor insurance expiry cron
 * This cron will fetch the records 15 days before the due-date expiration date
 * Execution time: Every-day at 07:00 AM IST
 * 
*/
cron.schedule('30 1 * * *', async () => {
	const td = moment().format('YYYY-MM-DD hh:mm:ss');

	const ago_15_days = moment().add(15,'d').format('YYYY-MM-DD');

	// To get active notifications from ins_notification table
	const motorsData = await getMotorData(ago_15_days);

	// To get data from ins_motor table
	const corporateData = await getCorporateData(ago_15_days);

	const insertData = [];
	if (motorsData && motorsData.length) {
		motorsData.forEach(element => {
			const pushData = {
				itemId:  element._id,
				type: 'motor',
				dueDate: element.dueDate,
				regNo: element.regNo,
				policyNo: element.policyNo
			}
			insertData.push(pushData);
		});
	}

	if (corporateData && corporateData.length) {
		corporateData.forEach(element => {
			const pushData = {
				itemId:  element._id,
				type: 'corporate',
				dueDate: element.dueDate,
				policyNo: element.policyNo
			}
			insertData.push(pushData);
		});
	}

	if (insertData && insertData.length) {
		InsuranceNotification.insertMany(insertData).then(function(){
	    console.log("---Upcoming insurance due date Notification inserted");
		}).catch(function(error){
	    console.log("---Upcoming insurance due date Notification ", error);
		});
	}
});

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