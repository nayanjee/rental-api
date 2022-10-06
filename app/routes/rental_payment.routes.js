const controller = require("../controllers/rental_payment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/rental_payment/create", controller.create);
  app.post("/api/rental_payment/upload", controller.importPayment);

  app.get("/api/rental_payment/payments/:financialYear", controller.getPayments);

  app.put("/api/rental_payment/updateCheque", controller.updateCheque);
  app.put("/api/rental_payment/updateAmount", controller.updateAmount);
};
