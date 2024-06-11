# receipt-processor-challenge
fetch's receipt-processor-challenge

## how to run
1. open up vs code and clone the repo by selecting a folder or creating a new folder and then cd into it.
```
mkdir challenge
cd challenge
git clone <url>
cd receipt-processor-challenge
npm install    # to install the dependencies
```
3. run the command below in the terminal:
```
node server.js
```

## things to note:
* The project will return receipts despite missing attributes - returns what is given
* the project will assign a unique id to all new receipts
  *  failure to assign a unique id will return an error
  
