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

	addDevice(userDetailes) {

	}

	addEmail(newEmail, name, session) {
		//check if session initlaiz
		this.__getRowsByKey("Users", "session", session)
			.then((rows) => {
				if (rows.length !== 0) {
					//yes - session init
					let userData= rows[0]
					this.__isNewInDb("Email", "Email", newEmail, false, userData)
						.then((userData ) => {
							if (userData) {
								console.log("TODO: set a new email");
								this.__setNewMail(newEmail, name, userData.User_id)
								.then((res)=>{console.log(res)})
							}
							else {
								console.log ("TODO: handle with this error");
							}
						}).bind(this)
				}
				else {
					//no - sessiont doesnt init
					console.log("new session")
					console.log(" TODO: handle with this error");
				}
			})
			.catch((err) => {
				console.log(err);
				console.log("TODO: handle with this error");
			})
	}

	__setNewMail(email, nameForEmail, userId){
		return new Promiss((resolve, reject)=>{
			const query = "INSERT INTO Email (Email, User_id, Name) VALUES ('" + email +"', '"+ userId + "', '" + userId+ "')";
			console.log(query);
			const sql = new Sql();
			sql.connect();
			sql.query(query, (err, res) =>{
				if (err){
					reject(err);
				}
				else{
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
	signUp(userDetailes, session) {
		//TODO: check device id
		// check we do not have email in our database, if we have wo return error messege to the client that the email is already.
		const sql = new Sql();
		sql.connect();

		let query = "SELECT * FROM Devices WHERE Device_serial_num_product = '" + userDetailes.deviceSerialNum + "'";
		console.log(query);
		sql.query(query, (err, rows, fields) => {
			if (err) {
				console.log("TODO:handle with err");
			}
			else {
				if (rows.length !== 0) {
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
								regestry(userDetailes, session);
							}
							else {
								// email found at our database
								console.log("TODO: handle with this issue");
							}
						}
					})
				}
				else {
					console.log("TODO: no device id handle with error");
				}
				sql.end();
			}
		})
	}



	logIn(userName, password,session, cb) {
		const sql = new Sql();
		//check if found current mail in our database
		sql.connect();
		let query = "SELECT * FROM Users WHERE User_name = '" + userName + "' AND Password = '" + password + "'";
		console.log(query);
		sql.query(query, function (err, rows, fields) {
			if (err) {
				cb(404)
				console.log("TODO: handle with this error. in log in..");
			}
			else {
				if (rows.length === 0) {
					cb (401)
					console.log("TODO: need to return current message to the user that no email or password in our database, he shuld to sign up first.");
				}
				else {
					//TODO: create rendom number and set in session
					//TODO: return session to client
					console.log("TODO: need to return the home page data to the user");
					cb(200);
				}
			}
		})

	}

	__isNewInDb(table, column, value, isInt , userData) {
		return new Promise((resolve, reject) => {
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
					reject(err);
				}
				else {
					if (rows.length === 0) {
						resolve(userData);
					}
					else {
						resolve(null);
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
	userDetailes.name = "nameforemail";
	userDetailes.deviceSerialNum = "2";
	userDetailes.email = "TEST1benedekjonatan@gmail.com";
	client.addEmail("addEmail@","nameFormMail" ,"session1");
	//client.
}
//test();


/*
* @Params:
*  userDetailes : Password , User_name, email, name, device_id, 
*  session 
*/
function regestry(userDetailes, session) {
	const sql = new Sql();
	sql.connect();
	//SET USER table
	console.log("INSERT INTO Users (Password,Session, User_name) VALUES ('" + userDetailes.password + "' ,'" + session + "','" + userDetailes.userName + "') ");
	const query = "INSERT INTO Users (Password,Session, User_name) VALUES ('" + userDetailes.password + "' ,'" + session + "','" + userDetailes.userName + "') ";
	sql.query(query, (err, res) => {
		if (err) {
			sql.end();
			console.log("TODO: handle with err");
			console.log(err);
		}
		else {
			// SET EMAIL table
			const query = "INSERT INTO Email (Email, User_id, Name) VALUES ('" + userDetailes.email + "','" + res.insertId + "','" + userDetailes.name + "')";
			console.log(query);
			sql.query(query, (err, res) => {
				console.log('test');
				//SET Devices check if 
			})
			console.log("seccues . res:" + res);
			//cb(deviceSerialNum, imagePath);
			//promisse.resolve();
		}
	})

}

module.exports = Client;