const controller = require("../controllers/ins_motor.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/motor/create", controller.create);
  app.post("/api/motor/renew", controller.create);
  app.post("/api/motor/upload", controller.upload);

  app.get("/api/motors/:year", controller.getData);
  app.get("/api/motors/getUploads/:id/:type", controller.getUpload);

  app.put("/api/motor/delete", controller.delete);
  app.put("/api/motor/update", controller.update);
  app.put("/api/motor/upload/delete", controller.deleteUpload);
};
