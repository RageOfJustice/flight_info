const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const exprhbs = require("express-handlebars");

const app = express();


mongoose.Promise = global.Promise = require("bluebird");
/*
 const mongooseOpts = {
 keepAlive: 1,
 useMongoClient: true,
 user: config.mongodb.user,
 pass: config.mongodb.pass
 };

 mongoose.connect(config.mongodb.uri, mongooseOpts);
 */


const handlebarsOpt = {
	defaultLayout: "main.handlebars",
};
app.disable("x-powered-by");
app.engine("handlebars", exprhbs(handlebarsOpt));
app.set("view engine", "handlebars");

const PORT = 3000;
const ENV = process.env.NODE_ENV || "development";

if (ENV === "development") {
	app.use(morgan("dev"));
	app.use("/assets", express.static(path.resolve(__dirname, "./src/assets")));
} else {
	app.use("/assets", express.static(path.resolve(__dirname, "./dist/assets")));
}
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// const sessionOpt = {
// 	secret: "ADD KEY",
// 	resave: false,
// 	saveUninitialized: true,
// };
// if (ENV === "production") {
// 	sessionOpt.cookie.secure = true;
// }

// app.use(cookieParser());
// app.use(session(sessionOpt));

app.use((req, res) => {
	res.render("index", {title: "Flight Info"});
});


//TODO add 404 and 500 routes(last routes)

const server = http.createServer(app);
server.listen(PORT, () => {
	console.log("Express server listening on port " + PORT);
});
