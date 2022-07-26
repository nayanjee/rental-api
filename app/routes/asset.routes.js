const controller = require("../controllers/asset.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/asset/create", controller.create);

  app.get("/api/asset/all", controller.getAll);
  app.get("/api/asset/:assetId", controller.getAssetById);
  app.get("/api/asset/property/:propertyType", controller.getAssetByPropertyType);
  app.get("/api/asset/propertyFull/:propertyType", controller.getFullAssetByPropertyType);
  
  app.put("/api/asset/update", controller.update);
  app.put("/api/asset/deleteFlat", controller.deleteFlat);
  app.put("/api/asset/changeFlatStatus", controller.changeFlatStatus);
  app.put("/api/asset/changeAssetStatus", controller.changeAssetStatus);

};
