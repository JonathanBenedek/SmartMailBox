const express = require('express')
//const Rasp = require("../smartMailBox/rasp.js");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const multer = require('multer');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const Client = require('../smartMailBox/client.js')


const app = express();
const upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true
}));
app.use(fileUpload());

app.set('view engine', 'jade');


//set a cookie
app.use(cookieParser());
/*
app.use(function (req, res, next) {
	// check if client sent cookie
	var cookie = req.cookies.cookieName;
	if (cookie === undefined) {
		// no: set a new cookie
		var randomNumber = Math.random().toString();
		randomNumber = randomNumber.substring(2, randomNumber.length);
		res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: true });
		console.log('cookie created successfully');
	}
	else {
		// yes, cookie was already present 
		console.log('cookie exists', cookie);
	}
	next(); // <-- important!
});*/


app.get('/*', function (req, res) {
	let cookie = req.cookies.cookieName;
	if (cookie != null) {
		res.sendFile(__dirname + `/build/build/` + req.params[0], null, (err) => {
			if (err) {
				console.log(err);
			}
		});
		console.log("cookie: " + req.cookies[cookieName]);
	}
	else {
		var randomNumber = Math.random().toString();
		randomNumber = randomNumber.substring(2, randomNumber.length);
		res.cookie('cookieName', randomNumber, { maxAge: 900000 });
		console.log('cookie created successfully');
		res.send("400");
	}
	console.log("get");

})


app.post('/api/signup', function (req, res) {
	try {
		var randomNumber = Math.random().toString();
		randomNumber = randomNumber.substring(2, randomNumber.length);
		res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: false })
		console.log('cookie created successfully');
		const client = new Client();
		client.signUp(req.body, randomNumber, (status, result) => {
			res.setHeader('Content-Type', 'application/json');
			res.status(status)
				.send(JSON.stringify({ errorMsg: result }));
			//.send("test");
		})
	}
	catch(err){
		res.status(404).send({});
	}
});

app.post('/api/login', function (req, res) {
	const userName = req.body.userName;
	const password = req.body.password;
	if (userName != null && password != null) {
		var randomNumber = Math.random().toString();
		randomNumber = randomNumber.substring(2, randomNumber.length);
		console.log("random : " + randomNumber);
		res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: false })
		console.log('cookie created successfully');
		const client = new Client();
		client.logIn(userName, password, randomNumber, (result) => {
			res.status(result);
			res.send({});
		})

	}
	else {
		//"404" no password or user insert
		res.status("404");
	}
});

app.post('/rasp', function (req, res) {
	try {
		let rasp = new Rasp();
		console.log("post request..");
		if (!req.files) {
			console.log("No files were uploaded.");
			return res.status(400).send('No files were uploaded.');
		}
		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
		let sampleFile = req.files.media;
		// Use the mv() method to place the file somewhere on your server 
		//TODO: write uniqe name for the file.
		sampleFile.mv('lename.jpg', function (err) {
			if (err) {
				return res.status(500).send(err);
			}
			let rasp = new Rasp();
			rasp.newMailArrived();
			res.send('File uploaded!');
		});
	}
	catch (err) {
		console.log(err);
	}
})


app.listen(3000, function (err) {
	fs.writeFile(__dirname + "get.txt", "im listing", (err) => {
		if (err) {
			console.log(err);
		}
	})
	if (err) {
		console.log(err);
	}
	console.log('Example app listening on port 3000!')
})