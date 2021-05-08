'use strict';

const {Gateway, Wallets} = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, registerAndEnrollUser, enrollAdmin} = require('../../test-application/javascript/CAUtil.js');
const {buildCCPOrg1, buildWallet} = require('../../test-application/javascript/AppUtil.js');

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
                discovery: {enabled: true, asLocalhost: true}
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
            app.use(express.urlencoded({extended: false}))
            app.use(express.json())

            app.use(express.static('public'))

            

            app.get('/', function (req, res) {
                res.send('Welcome to Charity-Chain donation app!');
            });
            

            app.post('/signup', async function (req, res) {
                const {username, email, password, name} = req.body;
                const key = username;

                try {
                    let result = await contract.evaluateTransaction('CreateUser', key, email, password, name);
                    await contract.submitTransaction('CreateUser', key, email, password, name);

                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })

            app.post('/login', async function (req, res) {
                const {username, password} = req.body;

                try {
                    let result = await contract.evaluateTransaction('FindUser', username, password);

                    res.cookie('user', result.toString(), {maxAge: 3600_000, httpOnly: true});
                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })

            app.get('/logout', async function (req, res) {
                const {username, password} = req.body;

                try {
                    res.cookie('user', '', {maxAge: -1, httpOnly: true});
                    res.json({status: "You have successfully logged out"});
                } catch (error) {
                    res.status(400).json({error: error.toString()});
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
                    res.status(500).json({
                        error: `Error: ${error}`,
                        isLoggedIn: false,
                    });
                }
            })
            
            
            
            app.post('/donate', async function (req, res) {
                const {key, slot_key, donor_name, recepient_name, receiver_account, transaction_id, amount, time} = req.body;
                
                try {
                    let result = await contract.evaluateTransaction('CreateTransaction', key, slot_key, donor_name, recepient_name, receiver_account, transaction_id, amount, time);
                    
                    await contract.submitTransaction('CreateTransaction', key, slot_key, donor_name, recepient_name, receiver_account, transaction_id, amount, time);

                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })
            
            
            
            app.post('/createslot', async function (req, res) {
                const {key, recepient_name, receiver_account, verification_code, amount_needed, priority} = req.body;
                
                try {
                    let result = await contract.evaluateTransaction('CreateDonationSlot', key, recepient_name, receiver_account, verification_code, amount_needed, priority);
                    
                    await contract.submitTransaction('CreateDonationSlot', key, recepient_name, receiver_account, verification_code, amount_needed, priority);

                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })
            
            
            
            
            app.get('/slot', async function (req, res) {
                
                try {
                    let result = await contract.evaluateTransaction('FindAllSlot');
                    
                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })
            
            
            app.post('/findslotbyuser', async function (req, res) {
                const {key} = req.body;
                
                try {
                    let result = await contract.evaluateTransaction('FindSlotByUser', key);
                    
                    await contract.submitTransaction('FindSlotByUser', key);
                    
                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })
            
            
            app.post('/findtransactionbyuser', async function (req, res) {
                const {key} = req.body;
                
                try {
                    let result = await contract.evaluateTransaction('FindTransactionByUser', key);
                    
                    await contract.submitTransaction('FindTransactionByUser', key);
                    
                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
                }
            })
            
            app.post('/finduserbykey', async function (req, res) {
                const {key} = req.body;
                
                try {
                    let result = await contract.evaluateTransaction('FindUserByKey', key);
                    
                    await contract.submitTransaction('FindUserByKey', key);
                    
                    res.send(result.toString());
                } catch (error) {
                    res.status(400).json({
                        error: error.toString()
                    });
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
