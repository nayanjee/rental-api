const controller = require("../controllers/ins_corporate.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post("/api/corporate/create", controller.create);
  app.post("/api/corporate/renew", controller.create);

  app.get("/api/corporate/:year", controller.getData);

  app.put("/api/corporate/delete", controller.delete);
  app.put("/api/corporate/update", controller.update);
};
