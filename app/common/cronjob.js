const { uuid } = require('uuidv4');
const cron = require('node-cron');
const moment = require('moment');

const db 									= require("../models");
const Asset 							= db.asset;
const RentalPayment 			= db.rental_payment;
const RentalNotification 	= db.rental_notification;


/* 
 *
 * Upcoming agreement expiry cron
 * This cron will fetch the records 10 days before the contract expiration date
 * Execution time: Every-day at 01:00 AM
 * 
*/
cron.schedule('* * * * *', async () => {
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
				message: 'Agreement is about to expire - ' + element.flatNo + ',' + 'address' + ',' + 'location'
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
 * Execution time: Every-day at 02:00 AM
 * 
*/
cron.schedule('* * * * *', async () => {
	const today = moment().format('YYYY-MM-DD[T]23:59:59.999[Z]');
	const todayDate = parseInt(moment().add(1, 'days').format('DD'));
	
	// To get active notifications
	const todaysPayment = await getTodaysPayment(todayDate);

	// Insert upcoing payment in notification collection
	if (todaysPayment && todaysPayment.length) {
		const insertData = [];
		const tomorrow = moment().add(1, 'days');
		const dueDate = tomorrow.toISOString().split('T')[0];		// Convert date if date is in string and ISO

		todaysPayment.forEach(element => {
			const pushData = {
				assetId:  element._id,
				type: 'paymentDue',
				dueDate: dueDate,
				message: 'Upcoming payment - ' + element.flatNo + ',' + 'address' + ',' + 'location'
			}
			insertData.push(pushData);
		});

		// RentalNotification.insertMany(insertData).then(function(){
	 //    console.log("---Payment Notification Data inserted");
		// }).catch(function(error){
	 //    console.log("---Payment Notification Data ", error);
		// });
	}
});

let getTodaysPayment = (date) => {
	return new Promise(resolve => {
		const query = { 
      isActive: true,
      isDeleted: false,
      paymentDueDate: date,
      propertyType: { $in: [ 'commercial', 'residential'] }
    }

  	Asset.find(query, (error, result) => {
  		if (result && result.length) {
				resolve(result);
      } else {
        resolve([]);
      }
  	});
  })
};