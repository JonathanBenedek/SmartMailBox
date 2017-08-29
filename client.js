var Promise = require('promise');
var mysql = require('mysql');
class Sql {

	constructor() {
		let connection = mysql.createConnection({
			host: '34.224.174.202',
			user: 'root',
			port: 3306,
			// password : '',
			database: 'new_schema'
		})
		return connection;
	}

	getConnection() {
		return connection;
	}
}

class Client {

	changePassword(oldPassword, newPassword, deviceSerialNum) {

	}

	mailPickUp(deviceSerialNum) {
		//TODO: run over all the letters and mark al letters that equal to the eviceSerialnnumber
	}

	addDevice(deviceId, session) {
		//check if session initlaiz
		this.__getRowsByKey("Users", "session", session)
			.then((rows) => {
				if (rows.length !== 0) {
					//yes- session init
					let userData = rows[0];
					this.__isNewInDb("Devices", "Device_serial_num_product", deviceId, false)
						.then((result) => {
							if (result.err) {
								cb(404, "it's not you it's us..please wait few minutes and try angain");
								return;
							}
							if (result.new) {
								//device doesnt exists at database
								cb(401, "Device doesnt exists");
								return;
							}
							//device exists at database
							//check if we have user already for spacific device_id
							if (result.rows.User_id == '0') {
								console.log("no user for this device..can update user for this device!")
								this.__updateUserId2Devices(deviceId, userData.User_id)
							}
							else {
								console.log("we have already user for this deviceId . cant update")
								cb(401, "This device register with another user");
							}
						})

				}
			}).catch((err) => { console.log(err); cb(404, "it's not you it's us..please wait few minutes and try angain"); })
	}

	__updateUserId2Devices(deviceId, userId) {
		return new Promise((resolve, reject) => {
			const query = "UPDATE Devices SET `User_id`='4' WHERE `Device_serial_num_product`= '" + deviceId + "'";
			console.log(query);
			const sql = new Sql();
			sql.connect();
			sql.query(query, (err, res) => {
				if (err) {
					reject(err);
				}
				else {
					if (res.affectedRows == 0) {
						reject("no affected rows");
					}
					resolve();
				}
			})
		})
	}

	addEmail(newEmail, name, session, cb) {
		//check if session initlaiz
		this.__getRowsByKey("Users", "session", session)
			.then((rows) => {
				if (rows.length !== 0) {
					console.log("yes - session init");
					let userData = rows[0]
					this.__isNewInDb("Email", "Email", newEmail, false)
						.then((result) => {
							if (result.err) {
								cb(404, "it's not you it's us..please wait few minutes and try angain");
								return;
							}
							if (result.new) {
								console.log("TODO: set a new email");
								this.__setNewMail(newEmail, name, userData.User_id)
									.then((err) => {
										if (err) {
											cb(404, "it's not you it's us..please wait few minutes and try angain");
										}
										cb(200);
									})
							}
							else {
								cb(404, "the mail already exists");
							}
						})
				}
				else {
					//no - sessiont doesnt init
					console.log("Session doesnt init");
					cb(404, "please log in first");
				}
			})
			.catch((err) => {
				console.log(err);
				cb(404, "it's not you it's us..please wait few minutes and try angain");
			})
	}

	__setNewMail(email, nameForEmail, userId) {
		return new Promise((resolve, reject) => {
			const query = "INSERT INTO Email (Email, User_id, Name) VALUES ('" + email + "', '" + userId + "', '" + nameForEmail + "')";
			console.log(query);
			const sql = new Sql();
			sql.connect();
			sql.query(query, (err, res) => {
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			})
			sql.end;
		})
	}

	__getRowsByKey(table, key, value, isInt) {
		return new Promise((resolve, reject) => {
			let query;
			if (isInt) {
				console.log("TODO: inplement when iint");
			} else {
				query = "SELECT * FROM " + table + " WHERE " + key + "= '" + value + "'";
			}
			console.log(query);
			const sql = new Sql();
			sql.connect();
			sql.query(query, (err, rows, fields) => {
				if (err) {
					reject(err);
				}
				else {
					resolve(rows);
				}
			})
			sql.end();
		})
	}

	/*
	useDetailes: password, email, firstName, lastName, 
	*/
	signUp(userDetailes, session, cb) {
		// check we do not have email in our database, if we have wo return error messege to the client that the email is already.
		const sql = new Sql();
		sql.connect();

		//check if we have deviceId
		let query = "SELECT * FROM Devices WHERE Device_serial_num_product = '" + userDetailes.deviceId + "'";
		console.log(query);
		sql.query(query, (err, rows, fields) => {
			if (err) {
				cb(404, "it's not you it's us");
			}
			else {
				if (rows.length !== 0) {
					console.log("device id exists");
					//TODO: check if device have already user
					console.log("SELECT * FROM Users WHERE User_name = '" + userDetailes.userName + "'");
					sql.query("SELECT * FROM Users WHERE User_name = '" + userDetailes.userName + "'", function (err, rows, fields) {
						if (err) {
							console.log('Error while performing Query.');
							console.log(err);
						}
						else {
							// now we check the user_name is uniq and not found at our database
							if (rows.length === 0) {
								//OK
								//
								regestry(userDetailes, session, (status, err) => {
									cb(status, err);
								})
							}
							else {
								// user name found at our database
								console.log("TODO: handle with this issue");
								cb(401, "User name already exists");
							}
						}
					})
				}
				else {
					console.log("no device id ");
					cb(401, "device id not exists");
				}
				sql.end();
			}
		})
	}



	logIn(userName, password, session, cb) {
		const sql = new Sql();
		//check if found current mail in our database
		sql.connect();
		let query = "SELECT * FROM Users WHERE User_name = '" + userName + "' AND Password = '" + password + "'";
		console.log(query);
		sql.query(query, function (err, rows, fields) {
			if (err) {
				cb(404)
			}
			else {
				if (rows.length === 0) {
					cb(401)
				}
				else {
					console.log("TODO: need to set session");
					cb(200);
				}
			}
		})

	}

	__isNewInDb(table, column, value, isInt) {
		return new Promise(function (resolve, reject) {
			let result = {}
			const sql = new Sql();
			let query;
			sql.connect();
			if (isInt) {

			} else {
				query = "SELECT * FROM " + table + " WHERE " + column + "= '" + value + "'";
			}
			console.log(query);
			sql.query(query, (err, rows, field) => {
				if (err) {
					result.err = err;
					reject(result);
				}
				else {
					result.err = null;
					if (rows.length === 0) {
						result.new = true;
						resolve(result);
					}
					else {
						result.rows = rows[0];
						result.new = false
						resolve(result);
					}
				}
			})
			sql.end();
		})
	}

}

function test() {
	let client = new Client();
	let userDetailes = {};
	userDetailes.password = "12345";
	userDetailes.userName = "jon";
	userDetailes.name = "namefo333remail";
	userDetailes.deviceSerialNum = "2";
	userDetailes.email = "TEST1benedekjonatan@gmail.com";
	client.addDevice("2", "session1");
	//client.
}
//test();


/*
* @Params:
*  userDetailes : Password , User_name, email, name, device_id, 
*  session 
*/
function regestry(userDetailes, session, cb) {
	const sql = new Sql();
	sql.connect();
	//SET USER table
	console.log("INSERT INTO Users (Password,Session, User_name) VALUES ('" + userDetailes.password + "' ,'" + session + "','" + userDetailes.userName + "') ");
	const query = "INSERT INTO Users (Password,Session, User_name) VALUES ('" + userDetailes.password + "' ,'" + session + "','" + userDetailes.userName + "') ";
	sql.query(query, (err, res) => {
		if (err) {
			sql.end();
			console.log(err);
			cb(401, err);
		}
		else {
			// SET EMAIL table
			const query = "INSERT INTO Email (Email, User_id, Name) VALUES ('" + userDetailes.email + "','" + res.insertId + "','" + userDetailes.name + "')";
			console.log(query);
			sql.query(query, (err, res) => {
				if (err) {
					//TODO: handle with duplcate entry
					//TODO: delete let insert
					cb(401, "Something worng, maybe email alredy in our system");
				}
				else {
					//success
					//TODO: set session
					setSession(session, userDetailes.userId, (status) => {
						cb(status);
					})
				}
				console.log('test');
				//SET Devices check if 
			})
			console.log("seccues . res:" + res);
		}
	})

}

function setSession(sesison, userId, cb) {
	const sql = new Sql();
	sql.connect();
	const query = "UPDATE Users SET `session`='" + sesison + "' WHERE `User_id`= '" + userId + "'";
	sql.query(query, (err, res) => {
		if (err) {console.log("TODO: revert 2 last insert"); console.log(err); cb(404, err) }
		else{
			cb(200, "success");
		}

	})
	console.log(query);

}

module.exports = Client;