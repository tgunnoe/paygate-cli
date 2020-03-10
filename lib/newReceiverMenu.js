const inquirer = require('inquirer');
const request = require('request');
const mainMenu = require ('./mainMenu');

const newReceiverMenu = (options) => {
  var menu = [
    { type: 'input', name: 'email', message: "Email address?", default: 'your@email.com' },
    { type: 'list', name: 'defaultDepository', message: "Default Depository?", choices: [] },
    { type: 'input', name: 'address1', message: "Address:", default: "166 Rock Road" },
    { type: 'input', name: 'address2', message: "Address, cont:", default: "" },
    { type: 'input', name: 'city', message: "City:", default: "Austin" },
    { type: 'input', name: 'state', message: "State:", default: "Texas" },
    { type: 'input', name: 'postalCode', message: "Zip:", default: "31380" },
    { type: 'input', name: 'metadata', message: "Metadata:", default: "Authorized for re-occurring WEB payments" }
  ];

    function listCallback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      info.forEach(function(entry) {
        var obj = {
          name: entry.bankName + ' (' + entry.id + ')',
          value: entry.id
        }
        // Lazy way to select the field I want
        menu[1].choices.push(obj);
      })
      options.method = 'POST';
      inquirer
        .prompt(menu).then(answers => {
          //let currentMenu = Object.keys(submenu)[0];
          options.body = JSON.stringify({
            "defaultDepository": answers.defaultDepository,
            "email": answers.email,
            "address": {
              "address1": answers.address1,
              "address2": answers.address2,
              "city": answers.city,
              "state": answers.state,
              "postalCode": answers.postalCode
            },
            "metadata": answers.metadata
          })
          console.log(options.body)
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
    url: 'http://localhost:8082/depositories',
    headers: options.headers,
    method: 'GET'
  }, listCallback);
};

module.exports.newReceiverMenu = newReceiverMenu;
