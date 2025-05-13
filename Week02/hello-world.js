// hello-world.js

// Uses express
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("hello world");
});

app.get("/add-movie", (req, res) => {
	res.send("add movie");
});

app.listen(port, () => {
	console.log("App created on $(port)");
});