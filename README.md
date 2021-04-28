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

cd $HOME/fabric-samples/charity_chain/chaincode
npm install

cd $HOME/fabric-samples/charity_chain/api
npm install
```

## Starting Blockchain Test Network and Install T-Drive Chaincode

```bash
cd $HOME/fabric-samples/test-network

# Start Test Network
./network.sh down && ./network.sh createChannel -ca -c mychannel -s couchdb

# Deleting the existing wallet from previous test network
rm -rf $HOME/fabric-samples/charity_chain/api/wallet

# Install Chaincode
./network.sh deployCC -ccn tdrive -ccp $HOME/fabric-samples/charity_chain/chaincode/ -ccl javascript
```

## Starting T-Drive API

```bash
cd $HOME/fabric-samples/charity_chain/api

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
