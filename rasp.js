'use strict';

var Promise = require('promise');
let emailHelpper = require("../smartMailBox/email.js");
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: '34.224.174.202',
	user: 'root',
	port: 3306,
	// password : '',
	database: 'new_schema'
});

class Rasp {
	newMailArrived(deviceSerialNum, imagePath, time, date) {
		//TODO: implenent this function
		// insert detailes to the data base
		this.__setNewLetterInDb(date, time, imagePath, deviceSerialNum)
			.then(() => { this.__getEmailsAndNamesByDeviceID(deviceSerialNum) })
			.then((emails, userNames) => { this.__sendEmailNewLetter(emails, imagePath, userNames, time, date) })
			.then((test) => { console.log("for debug") })
			.catch((err) => {
				console.log(err);
			})

	}

	__getEmailsAndNamesByDeviceID(deviceSerialNum, cb) {
		return new Promise((reject, resolve) => {
			connection.connect();

			connection.query('SELECT * from Users WHERE Devices_serial_num_product =' + deviceSerialNum, function (err, rows, fields) {
				if (!err) {
					console.log('The solution is: ', rows);
					rows.forEach(function (element) {
						try {
							//cb(element.Email, element.User_name);
							resolve(element.Email, element.User_name);
						}
						catch (err) {
							console.log(err);
						}
					})
				}
				else {
					console.log('Error while performing Query.');
					reject(err);
					console.log(err);
				}
			});
			connection.end();
		})
	}

	__setNewLetterInDb(date, time, imagePath, deviceSerialNum) {
		//TODO: Remember to remark the line below.

		return new Promise((resolve, reject) => {
			//connection.connect();
			const query = "INSERT INTO Letters (Date, Time, Letter_path, Has_taken, Device_serial_num_product) VALUES ('" + date + "', '" + time + "', '" + imagePath + "', '" + false + "','" + deviceSerialNum + "')";
			/*connection.query(query, (err, res) => {
				if (err) {
					console.log(err);
				}
				else {
					console.log("seccues . res:" + res);
					//cb(deviceSerialNum, imagePath);
					promisse.resolve(); 
				}
			})*/
			resolve("dfg");
		})
	}

	__sendEmailNewLetter(emails, imagePath, userName, time, date, cb) {
		emails.forEach((email)=>{
			emailHelpper(email, imagePath, userName, time, date);
		})
		
		resolve("test");
	}
}

function test() {
	const rasp = new Rasp();
	//sqltest.__setNewLetterInDb("2000-11-12", "12:12:12" , "/lename.jpg", "123serialnumber" );
	rasp.newMailArrived("1", "/lename1111.jpg", "2000-11-12", "12:12:12");
	//sqltest.__sendEmailNewLetter(null, "/lename.jpg");
}
test();
// notification on a new letter

module.export = Rasp; 
