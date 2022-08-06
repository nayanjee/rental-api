/**
    * @description      : 
    * @author           : nayan.prakash
    * @group            : 
    * @created          : 04/06/2022 - 17:06:27
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 04/06/2022
    * - Author          : nayan.prakash
    * - Modification    : 
**/
const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const cron = require('./app/common/cronjob');

const app = express();

var corsOptions = {
  // origin: "http://localhost:4200"
  origin: "http://43.205.10.171:7872"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Portal = db.portal;

db.mongoose
  //.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect("mongodb://laadmin:l@r3n0n@12#12@43.205.10.171:27017/larenon-master?authSource=admin&retryWrites=false", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    // initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json("You are on the wrong track. Please check your address and port. I would like to inform you that this is a Larenone Healthcare Pvt. Ltd.'s property and tampering with it will be considered against the law.");
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/city.routes")(app);
require("./app/routes/state.routes")(app);
require("./app/routes/asset.routes")(app);
require("./app/routes/lessor.routes")(app);
require("./app/routes/coowner.routes")(app);
require("./app/routes/permission.routes")(app);
require("./app/routes/rental_payment.routes")(app);
require("./app/routes/rental_notification.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 7871;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/* function initial() {
  Portal.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Portal({ name: "user" }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Portal({ name: "moderator" }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Portal({ name: "admin" }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
} */
