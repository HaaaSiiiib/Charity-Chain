'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'charity_chain';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		const wallet = await buildWallet(Wallets, walletPath);
		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		const gateway = new Gateway();

		try {
			await gateway.connect(ccp, {
				wallet,
				identity: org1UserId,
				discovery: { enabled: true, asLocalhost: true }
			});

			const network = await gateway.getNetwork(channelName);

			const contract = network.getContract(chaincodeName);

			/////////////////////////////////////////////////////////////////////
			const express = require('express');
			const cookieParser = require('cookie-parser');
			const fileUpload = require('express-fileupload');
			const path = require('path');
			const crypto = require('crypto');
			const fs = require('fs');
			const util = require('util');
			var cors = require('cors')


			let app = express();
			const PORT = 3000;

			app.use(cors({
				origin: "http://localhost:3001",
				credentials: true
			}));

			app.use(cookieParser());
			app.use(express.urlencoded({ extended: false }))
			app.use(express.json())

			app.use(express.static('public'))

			app.use(fileUpload({
				useTempFiles: true,
				tempFileDir: 'tmp/',
				createParentPath: true
			}));

			app.get('/', function (req, res) {
				res.send('Welcome to charity chain');
			});

			
			app.post('/register', async function (req, res) {
				const { email, password, name } = req.body;
				const key = `user_${email}`;

				try {
					let result = await contract.evaluateTransaction('CreateUser', key, email, password, name);
					await contract.submitTransaction('CreateUser', key, email, password, name);

					res.send(result.toString());
				} catch (error) {
					res.status(400).send(error.toString());
				}
			})

			app.post('/login', async function (req, res) {
				const { email, password } = req.body;

				try {
					let result = await contract.evaluateTransaction('FindUser', email, password);

					res.cookie('user', result.toString(), { maxAge: 3600_000, httpOnly: true });
					res.send(result.toString());
				} catch (error) {
					res.status(400).send(error.toString());
				}
			})

			app.get('/logout', async function (req, res) {
				const { email, password } = req.body;

				try {
					res.cookie('user', '', { maxAge: -1, httpOnly: true });
					res.send("You have successfully logged out");
				} catch (error) {
					res.status(400).send(error.toString());
				}
			})

			app.get('/profile', async function (req, res) {
				if (req.cookies.user == null) {
					res.json({
						isLoggedIn: false
					});
					return;
				}

				try {
					let user = JSON.parse(req.cookies.user.toString());
					const key = user.Key;

					let result = await contract.evaluateTransaction('FindUserByKey', key);

					user = JSON.parse(result.toString());
					user.isLoggedIn = true;

					res.json(user);
				} catch (error) {
					res.status(500).send(`Error: ${error}`);
				}
			})

			async function sha256(filePath) {
				const readFile = util.promisify(fs.readFile);


				const hash = crypto.createHash('sha256');
				const data = await readFile(filePath);
				hash.update(data);

				return hash.digest('base64');
			}

			app.post('/donate', async function (req, res) {
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				
				const fileName = uploadedFile.name;
				const fileDestination = path.join('public', 'Donate', fileName);

				uploadedFile.mv(fileDestination, async (err) => {
					if (err != undefined) {
						res.status(500).send(`Server Error, failed to move file ${err}`);
						return;
					}

					try {
						const user = JSON.parse(req.cookies.user.toString());

						const downloadLink = path.join('documents', fileName);
						const uploaderEmail = user.Email;
						const key = `file_${uploaderEmail}_${fileName}`;
						const fileHash = await sha256(fileDestination);

						let result = await contract.evaluateTransaction('NewChain', key, id, sector, amount, time, method);
						await contract.submitTransaction('NewChain', key, id, sector, amount, time, method);

						res.send(result.toString());
					} catch (error) {
						res.status(400).send(error.toString());
					}
				});
			})

			app.get('/application', async function (req, res) {
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				try {
					const user = JSON.parse(req.cookies.user.toString());
					let result = await contract.evaluateTransaction(
						'FindFileByUser',
						user.Email,
					);

					res.send(result.toString());
				} catch (err) {
					res.status(400).send(err.toString());
				}
			})

			app.get('/sectors', async function (req, res) {
				if (req.cookies.user == null) {
					res.status(400).send('You are not logged in');
					return;
				}

				const fileKey = req.params.fileKey;

				try {
					const user = JSON.parse(req.cookies.user.toString());
					let result = await contract.evaluateTransaction(
						'GetSectors',
						fileKey,
					);

					const uploadedFile = JSON.parse(result);

					result = await contract.evaluateTransaction(
						'FindDonor',
						user.Email,
					);

					let filesSharedWithMe = JSON.parse(result);
					filesSharedWithMe = filesSharedWithMe.map(data => data.Record);
					console.log(filesSharedWithMe);

					const thisFileSharedWithMe = filesSharedWithMe.some(fileShare => fileShare.FileKey == uploadedFile.Key);

					if (uploadedFile.UploaderEmail != user.Email && !thisFileSharedWithMe) {
						res.status(403).send("You are not authorized for this sector");
					} else {
						res.send(JSON.stringify(uploadedFile));
					}
				} catch (err) {
					res.status(400).send(err.toString());
				}
			})

			var server = app.listen(PORT, function () {
				console.log(`Server Listening on port http://localhost:${PORT}`);
			});
			////////////////////////////////////////////////////////////////////

		} finally {
			// gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
