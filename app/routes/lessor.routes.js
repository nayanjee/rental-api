const controller = require("../controllers/lessor.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/lessor/property/:propertyType", controller.getOwnerByPropertyType);
  app.get("/api/lessor/:ownerId", controller.getOwnerById);

  app.post("/api/lessor/create", controller.create);

  app.put("/api/lessor/update", controller.update);
  app.put("/api/lessor/delete", controller.delete);
  app.put("/api/lessor/changeStatus", controller.changeStatus);
};
