const controller = require("../controllers/rental_notification.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/api/notification/all", controller.getAll);

  app.put("/api/notification/delete", controller.delete);
  app.put("/api/notification/changeStatus", controller.changeStatus);
};
