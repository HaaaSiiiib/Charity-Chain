/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const {Contract} = require('fabric-contract-api');

class TDonate extends Contract {

    async CreateUser(ctx, key, email, password, name) {
        const user = {
            Key: key,
            Email: email,
            Password: password,
            Name: name,
            DocType: 'user',
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(user)));
        return JSON.stringify(user);
    }
    
    
    async CreateDonationSlot(ctx, key, recepient_name, receiver_account, verification_code, amount_needed, priority) {
        const slot = {
            Key: key,
            RecipientName: recepient_name,
            ReceiverAccount: receiver_account,
            VerificationCode: verification_code,
            AmountNeeded: amount_needed,
            Priority: priority,
            DocType: 'slot',
        };
        
        if (verification_code === "123456") {
            await ctx.stub.putState(key, Buffer.from(JSON.stringify(slot)));
            return JSON.stringify(slot);
        }
    }


    async CreateTransaction(ctx, key, slot_key, donor_name, recepient_name, receiver_account, transaction_id, amount, time) {
        const transaction = {
            Key: key,
            SlotKey: slot_key,
            DonorName: donor_name,
            RecipientName: recepient_name,
            ReceiverAccount: receiver_account,
            TransactionID: transaction_id,
            Amount: amount,
            Time: time,
            DocType: 'transaction',
        };

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(transaction)));
        return JSON.stringify(transaction);

    }
    
    
    // ReadAsset returns the asset stored in the world state with given id.
    async FindUser(ctx, username, password) {
        const key = username;
        const userJSON = await ctx.stub.getState(key); // get the asset from chaincode state
        if (!userJSON || userJSON.length === 0) {
            throw new Error(`The User with username ${username} does not exist`);
        }

        const user = JSON.parse(userJSON.toString());
        if (user.Password !== password) {
            throw new Error('Username and Password do not match any user in our system');
        }

        user.Password = '********';

        return JSON.stringify(user);
    }
    
    async FindUserByKey(ctx, key) {
        const userJSON = await ctx.stub.getState(key); // get the asset from chaincode state
        if (!userJSON || userJSON.length === 0) {
            throw new Error('The user does not exist');
        }

        let user = JSON.parse(userJSON.toString());
        user.Password = '********';

        return JSON.stringify(user);
    }
    
    
    async FindSlotByUser(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.DocType = 'slot';
        queryString.selector.Key = key;

        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }
    
    
    
    async FindTransactionByUser(ctx, key) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.DocType = 'transaction';
        queryString.selector.Key = key;

        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }
    
    
    async FindAllSlot(ctx) {
        let queryString = {};
        queryString.selector = {};
        queryString.selector.DocType = 'slot';

        return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString));
    }


    

    async GetQueryResultForQueryString(ctx, queryString) {

        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let results = await this.GetAllResults(resultsIterator, false);

        return JSON.stringify(results);
    }

    async GetAllResults(iterator, isHistory) {
        let allResults = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                if (isHistory && isHistory === true) {
                    jsonRes.TxId = res.value.tx_id;
                    jsonRes.Timestamp = res.value.timestamp;
                    try {
                        jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            res = await iterator.next();
        }
        iterator.close();
        return allResults;
    }

 

}

module.exports = TDonate;
