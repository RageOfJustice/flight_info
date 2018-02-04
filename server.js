const express = require("express");
const http = require("http");
const path = require("path");
const morgan = require("morgan");
const exprhbs = require("express-handlebars");

const app = express();


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

app.use((req, res) => {
	res.render("index", {title: "Flight Info"});
});


//TODO add 404 and 500 routes(last routes)

const server = http.createServer(app);
server.listen(PORT, () => {
	console.log("Express server listening on port " + PORT);
});
