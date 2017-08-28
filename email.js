'use strict';

//const bunyan = require('bunyan');
/*let email = "benedek"
let path = 
let userName = 
let time =
let date = 
*/
let email = function (email, path, userName, time, date) {
	const nodemailer = require('nodemailer');
	const fs = require('fs');
	// Create a SMTP transporter object
	let transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'jonatantestorev@gmail.com',
			pass: "testorev"
		},
		/*
		logger: bunyan.createLogger({
			name: 'nodemailer'
		}),*/
		debug: true // include SMTP traffic in the logs
	}, {
			// default message fields

			// sender info
			from: 'Smart Mail',
			headers: {
				'X-Laziness-level': 1000 // just an example header, no need to use this
			}
		});

	console.log('SMTP Configured');

	// Message object
	let message = {

		// Comma separated list of recipients
		to: email,

		// Subject of the message
		subject: 'New letter arrived', //

		// plaintext body
		text: 'Hello! ' + userName + ' you got a new letter at: ' + date + time + "its watting for you in your mail-box.",


		// Apple Watch specific HTML body
		watchHtml: '<b>Hello</b> to myself',

		// An array of attachments
		attachments: [
			/*
					// String attachment
					{
						filename: 'notes.txt',
						content: 'Some notes about this e-mail',
						contentType: 'text/plain' // optional, would be detected from the filename
					},
			*/
			// Binary Buffer attachment
			{
				filename: 'image.jpg',
				content: new Buffer(fs.readFileSync(__dirname + path), 'base64'),
				cid: 'note@example.com' // should be as unique as possible
			}


/*
		// File Stream attachment
		{
			filename: 'nyan cat ✔.gif',
			path: __dirname + '/lename.jpg',
			cid: 'nyan@example.com' // should be as unique as possible
		}
*/	]
	};

	console.log('Sending Mail');
	transporter.sendMail(message, (error, info) => {
		if (error) {
			console.log('Error occurred');
			console.log(error.message);
			return;
		}
		console.log('Massage sent successfully!');
		console.log('Server responded with "%s"', info.response);
		transporter.close();
	});
}

module.exports = email;