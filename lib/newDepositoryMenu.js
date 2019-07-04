const inquirer = require('inquirer');
const { depositoryChoices } = require('./values');
const request = require('request');
const mainMenu = require ('./mainMenu');

var menu = [
  { type: 'input', name: 'bankName', message: "Bank name?", default: 'Default bank name'
  },
  { type: 'input', name: 'holder', message: "Account holder company/name?", default: 'Default company LLC' },
  { type: 'input', name: 'holderType', message: "Type of holder?", default: 'individual' },
  { type: 'list', name: 'type', message: "Account Type?", choices: ['checking', 'savings', 'other'] },
  { type: 'input', name: 'routingNumber', message: "Bank Routing Number:", default: "051504597" },
  { type: 'input', name: 'accountNumber', message: "Account Number:", default: "0000000000000" },
  { type: 'input', name: 'metadata', message: "Metadata:", default: "Payroll" }
];

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
  mainMenu.mainMenu();
}

const newDepositoryMenu = (options) => {
  inquirer
    .prompt(menu).then(answers => {
      //let currentMenu = Object.keys(submenu)[0];
      options.body = JSON.stringify({
       "bankName": answers.bankName,
        "holder": answers.holder,
        "holderType": answers.holderType,
        "type": answers.type,
        "routingNumber": answers.routingNumber,
        "accountNumber": answers.accountNumber,
        "metadata": answers.metadata
      })
      request(options, callback);
    });
};

module.exports.newDepositoryMenu = newDepositoryMenu;
