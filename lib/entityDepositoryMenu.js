const inquirer = require('inquirer');
const request = require('request');
const { entityDepositoryChoices } = require('./values');


const entityDepositoryMenu = (prevMenu, options) => {

  var menu = [
    { type: 'list', name: 'entity', message: "Choose entry:", choices: [] },
    { type: 'list', name: 'action', message: "Choose action:", choices: entityDepositoryChoices }
  ];

  function patchCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const entity = JSON.parse(body);
      console.log(entity);
      let patchMenu = [
        { type: 'input', name: 'bankName', message: "Bank name?", default: entity.bankName },
        { type: 'input', name: 'holder', message: "Account holder company/name?", default: entity.holder },
        { type: 'input', name: 'holderType', message: "Type of holder?", default: entity.holderType },
        { type: 'list', name: 'type', message: "Account Type?", choices: ['checking', 'savings', 'other'], default: entity.type },
        { type: 'input', name: 'routingNumber', message: "Bank Routing Number:", default: entity.routingNumber },
        { type: 'input', name: 'accountNumber', message: "Account Number:", default: entity.accountNumber },
        { type: 'input', name: 'metadata', message: "Metadata:", default: entity.metadata }
      ];

      inquirer.prompt(patchMenu).then(answers => {
        newOptions.method = 'PATCH';
        let arr = Object.keys(answers);
        for (var i = 0, len = arr.length; i < len; i++) {
          if(answers[arr[i]] == entity[arr[i]])
            delete answers[arr[i]];
          if(i == (len - 1)) {
            newOptions.body = JSON.stringify(answers);
            request(newOptions, entityCallback);
          }
        }
      });
    }
    else if (!error && response.statusCode == 201){
      console.log('Success!');
      console.log(JSON.parse(body));
    }
    else {
      console.log('Unlogged status code ' + response.statusCode);
    }
  }

  function entityCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      if(body) {
        const info = JSON.parse(body);
        console.log(info);
      } else {
        console.log('Successful delete!')
      }

    }
    else if (!error && response.statusCode == 201){
      console.log('Success!');
      console.log(JSON.parse(body));
    }
    else if (error) {
      console.log('error! ' + error);
    }
    else {
      console.log('Unlogged Code: ' + response.statusCode)
    }
  }

  function listCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      info.forEach(function(entry) {
        var obj = {
          name: entry.id + ' / ' + entry.bankName,
          value: entry.id
        }
        menu[0].choices.push(obj);
      })
      inquirer
        .prompt(menu).then(answers => {
          newOptions.url += '/' + answers.entity;
          if( answers.action == 'PATCH' ) {
            newOptions.method = 'GET';
            request(newOptions, patchCallback);
          } else {
            newOptions.method = answers.action;
            request(newOptions, entityCallback);
          }
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


  newOptions = options;
  request(options, listCallback);

};

module.exports.entityDepositoryMenu = entityDepositoryMenu;
