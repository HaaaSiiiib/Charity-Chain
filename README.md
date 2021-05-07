# Charity-Chain
An implementation of blockchain to handle the transaction and necessary information in a charity and donation related works.

### Installing Hyperledger Fabric:

```bash
cd $HOME
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s
```

### Setting Up Environment Variables:

```bash
echo export PATH=\$PATH:\$HOME/fabric-samples/bin | tee -a ~/.bashrc

echo export FABRIC_CFG_PATH=$HOME/fabric-samples/config | tee -a ~/.bashrc

source ~/.bashrc
```

### Downloading Charity-Chain

```bash
cd $HOME/fabric-samples

git clone https://github.com/TissuePowder/Charity-Chain.git charity_chain

cd $HOME/fabric-samples/charitychain/chaincode-javascript
npm install

cd $HOME/fabric-samples/charity_chain/api-javascript
npm install
```

## Starting Blockchain Test Network and Install charitychain Chaincode

```bash
cd $HOME/fabric-samples/test-network

# Start Test Network
./network.sh down && ./network.sh createChannel -ca -c mychannel -s couchdb

# Deleting the existing wallet from previous test network
rm -rf $HOME/fabric-samples/charitychain/api-javascript/wallet

# Install Chaincode
./network.sh deployCC -ccn charitychain -ccp $HOME/fabric-samples/charitychain/chaincode-javascript/ -ccl javascript
```

## Starting charitychain API

```bash
cd $HOME/fabric-samples/charitychain/api-javascript

npm install

node app.js
```


## Viewing Blockchain State in CouchDB

You can view the current state at [http://localhost:5984/_utils/](http://localhost:5984/_utils/).

**Username:** admin  
**Password:** adminpw

## Stopping Test Network

```bash
cd $HOME/fabric-samples/test-network

./network.sh down
```
