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


			try {
				let result = await contract.evaluateTransaction('CreateUser', 'userkey_testuser1', 'testuser1@gmail.com', '1234', 'Test User 1');
				await contract.submitTransaction('CreateUser', 'userkey_testuser1', 'testuser1@gmail.com', '1234', 'Test User 1');

				console.log(`CreateUser Successful\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}\n`);
			}
			
			
			try {
				let result = await contract.evaluateTransaction('CreateDonationSlot', 'slotkey_donationslot1', 'Mr Recepient 34', '00465-56746', '123456', '2,00,000', 'High');
				await contract.submitTransaction('CreateDonationSlot', 'slotkey_donationslot1', 'Mr Recepient 34', '00465-56746', '123456', '2,00,000', 'High');

				console.log(`CreateDonationSlot Successful\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}\n`);
			}
			
		
			
			try {
				let result = await contract.evaluateTransaction('CreateTransaction', 'transkey_transaction1', 'slotkey_donationslot1', 'Mr Donor 1', 'Mr Reciever 1', '123456095758', 'TERXXX787', '5000', 'tuesday');
				await contract.submitTransaction('CreateTransaction', 'transkey_transaction1', 'slotkey_donationslot1', 'Mr Donor 1', 'Mr Reciever 1', '123456095758', 'TERXXX787', '5000', 'tuesday');

				console.log(`CreateTransaction Successful\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}\n`);
			}
			
			
			
			try {
				let result = await contract.evaluateTransaction('FindTransactionByUser', 'transkey_transaction1');
				await contract.submitTransaction('FindTransactionByUser', 'transkey_transaction1');

				console.log(`FindTransactionByUser Successful\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}\n`);
			}
			
			
			
			try {
				let result = await contract.evaluateTransaction('FindSlotByUser', 'slotkey_donationslot1');
				await contract.submitTransaction('FindSlotByUser', 'slotkey_donationslot1');

				console.log(`FindSlotByUser Successful\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}\n`);
			}
			
			
			try {
				let result = await contract.evaluateTransaction('FindAllSlot');
				await contract.submitTransaction('FindAllSlot');

				console.log(`FindAllSlot Successful\n Result: ${result}\n`);
			} catch (error) {
				console.log(`*** Error: \n    ${error}\n`);
			}
			
			
			
			
			
		} finally {
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
