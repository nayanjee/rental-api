const controller = require("../controllers/upload.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/rental_assetFileUpload", controller.assetFileUpload);
  app.post("/api/rental_assetRemoveFile", controller.assetRemoveFile);

  app.get("/api/rental_getAssetFiles/:assetId", controller.assetFiles);
  app.get("/api/rental_downloadAssetFile/:filename", controller.assetDownloadFile);
};
