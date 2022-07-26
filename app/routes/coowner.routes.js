const controller = require("../controllers/coowner.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/coowner/create", controller.create);

  app.put("/api/coowner/update", controller.update);
  app.put("/api/coowner/delete", controller.delete);

  app.get("/api/coowner/:ownerId", controller.getRecordByOwnerId);
};
