const inquirer = require('inquirer');
const request = require('request');
const mainMenu = require ('./mainMenu');

const newTransfersMenu = (options) => {
  var availableOriginators = {}
  var availableReceivers = {}
  var menu = [
    { type: 'list', name: 'transferType', message: "Transfer Type?", choices: ['push', 'pull'] },
    { type: 'input', name: 'amount', message: "Amount?", default: '99.99' },
    { type: 'list', name: 'originator', message: "Originator?", choices: [] },
    { type: 'list', name: 'receiver', message: "Receiver?", choices: [] },
    { type: 'input', name: 'description', message: "Description:", default: "Loan pay" },
    { type: 'list', name: 'standardEntryClassCode', message: "Standard Entry Class Code?", choices: ['WEB'] },
    { type: 'confirm', name: 'sameDay', message: "Same Day?", default: false },
    { type: 'input', name: 'paymentInformation', message: "Payment Information:", default: "test payment" },
    { type: 'input', name: 'originatorName', message: "Originator Name:", default: "John Doe" },
    { type: 'input', name: 'originatorAddress', message: "Originator Address:", default: "123 1st St" },
    { type: 'input', name: 'originatorCity', message: "Originator City:", default: "Austin" },
    { type: 'input', name: 'originatorState', message: "Originator State:", default: "Texas" },
    { type: 'input', name: 'originatorPostalCode', message: "Originator Postal Code:", default: "12345" },
    { type: 'input', name: 'originatorCountryCode', message: "Originator Country Code:", default: "US" },
    { type: 'input', name: 'receiverName', message: "Receiver Name:", default: "Jane Doe" },
    { type: 'input', name: 'receiverAddress', message: "Receiver Address:", default: "321 2nd St" },
    { type: 'input', name: 'receiverCity', message: "Receiver City:", default: "Phoenix" },
    { type: 'input', name: 'receiverState', message: "Receiver State:", default: "AZ" },
    { type: 'input', name: 'receiverPostalCode', message: "Receiver Postal Code:", default: "12345" },
    { type: 'input', name: 'receiverCountryCode', message: "Receiver Country Code:", default: "US" },
    { type: 'input', name: 'phoneNumber', message: "Phone Number:", default: "123-456-7890" },
    { type: 'list', name: 'paymentType', message: "Payment Type?", choices: ['single', 'reoccuring'] },


  ];
  function setReceivers(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      info.forEach(function(receiver) {
        var choice = {
          name: receiver.email + ' (' + receiver.metadata + ')',
          value: receiver.id
        }
        availableReceivers[receiver.id] = receiver;
        // Lazy way to select the field I want
        menu[3].choices.push(choice);
      })
      options.method = 'POST';

      inquirer
        .prompt(menu).then(answers => {
          //let currentMenu = Object.keys(submenu)[0];
          options.body = JSON.stringify({
            "transferType": answers.transferType,
            "amount": "USD " + answers.amount,
            "originator": answers.originator,
            "originatorDepository": availableOriginators[answers.originator].defaultDepository,
            "receiver": answers.receiver,
            "receiverDepository": availableReceivers[answers.receiver].defaultDepository,
            "description": answers.description,
            "standardEntryClassCode": answers.standardEntryClassCode,
            "sameDay": answers.sameDay,
            "CCDDetail": {
              "paymentInformation": answers.paymentInformation
            },
            "IATDetail": {
              "originatorName": answers.originatorName,
              "originatorAddress": answers.originatorAddress,
              "originatorCity": answers.originatorCity,
              "originatorState": answers.originatorState,
              "originatorPostalCode": answers.originatorPostalCode,
              "originatorCountryCode": answers.originatorCountryCode,
              "ODFIName": "My Bank",
              "ODFIIDNumberQualifier": "01",
              "ODFIIdentification": "141451",
              "ODFIBranchCurrencyCode": "USD",
              "receiverName":  answers.receiverName,
              "receiverAddress": answers.receiverAddress,
              "receiverCity": answers.receiverCity,
              "receiverState": answers.receiverState,
              "receiverPostalCode": answers.receiverPostalCode,
              "receiverCountryCode": answers.receiverCountryCode,
              "RDFIName": "Their Bank",
              "RDFIIDNumberQualifier": "01",
              "RDFIIdentification": "4",
              "RDFIBranchCurrencyCode": "GB",
              "foreignCorrespondentBankName": "Their Bank",
              "foreignCorrespondentBankIDNumberQualifier": "5125112",
              "foreignCorrespondentBankIDNumber": "631551",
              "foreignCorrespondentBankBranchCountryCode": "GB"
            },
            "TELDetail": {
              "phoneNumber": answers.phoneNumber,
              "paymentType": answers.paymentType
            },
            "WEBDetail": {
              "paymentInformation": answers.paymentInformation,
              "paymentType": answers.paymentType
            }
          })
          request(options, callback);
        });
    }
    else if (!error && response.statusCode == 201) {
      console.log('Success!');
      console.log(JSON.parse(body));
    }
    else {
      // console.log('Unlogged status code ' + response.statusCode);
    }
  }
  function setOriginators(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      info.forEach(function(originator) {
        var choice = {
          name: originator.identification + ' (' + originator.metadata + ')',
          value: originator.id
        }
        availableOriginators[originator.id] = originator;
        // Lazy way to select the field I want
        menu[2].choices.push(choice);
      })
      options.method = 'POST';
      request({
        url: 'http://localhost:8082/receivers',
        headers: options.headers,
        method: 'GET'
      }, setReceivers);
    }
    else if (!error && response.statusCode == 201) {
      console.log('Success!');
      console.log(JSON.parse(body));
    }
    else {
      // console.log('Unlogged status code ' + response.statusCode);
    }
  }

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      console.log(info);
    }
    else if (!error && response.statusCode == 201){
      console.log('Success!');
      console.log(JSON.parse(body));
    }
    else {
      console.log('Unlogged status code ' + response.statusCode);
    }
    mainMenu.mainMenu(options);
  }
  request({
    url: 'http://localhost:8082/originators',
    headers: options.headers,
    method: 'GET'
  }, setOriginators);
};

module.exports.newTransfersMenu = newTransfersMenu;
