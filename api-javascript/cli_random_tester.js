'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'tdonate';
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


			let i=1;
			for(i=1; i<5; ++i){

				let userkey = `userkey_testuser00${i}`;
				let usermail = `testuser00${i}@gmail.com`;
				let userpass = `testpass00${i}`;
				let name = `Mr Test User 00${i}`;

				try {
					let result = await contract.evaluateTransaction('CreateUser', userkey, usermail, userpass, name);
					await contract.submitTransaction('CreateUser', userkey, usermail, userpass, name);

					console.log(`CreateUser Successful\n Result: ${result}\n`);
				} catch (error) {
					console.log(`*** Error: \n    ${error}\n`);
				}


				let j=1;
				for(j=1; j<3; ++j){

					let slotkey = `slotkey_donationslot00${j}`;
					let recepient_name = `Mr Test User 00${i}`;

					try {
						let result = await contract.evaluateTransaction('CreateDonationSlot', slotkey, recepient_name, '00465-56746', '123456', '200000', 'High');
						await contract.submitTransaction('CreateDonationSlot', slotkey, recepient_name, '00465-56746', '123456', '200000', 'High');

						console.log(`CreateDonationSlot Successful\n Result: ${result}\n`);
					} catch (error) {
						console.log(`*** Error: \n    ${error}\n`);
					}



					let transkey = `transkey_transaction00${j}`;
					let donor_name = `Mr Test User 00${i+1}`;
					let time = Date.now().toString();

					try {
						let result = await contract.evaluateTransaction('CreateTransaction', transkey, slotkey, donor_name, recepient_name, '123456095758', 'TERXXX787', '5000', time);
						await contract.submitTransaction('CreateTransaction', transkey, slotkey, donor_name, recepient_name, '123456095758', 'TERXXX787', '5000', time);

						console.log(`CreateTransaction Successful\n Result: ${result}\n`);
					} catch (error) {
						console.log(`*** Error: \n    ${error}\n`);
					}


				}
			}



		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
