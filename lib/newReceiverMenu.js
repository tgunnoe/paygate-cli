const inquirer = require('inquirer');
const request = require('request');
const mainMenu = require ('./mainMenu');

const newReceiverMenu = (options) => {
  var menu = [
    { type: 'input', name: 'email', message: "Email address?", default: 'your@email.com' },
    { type: 'list', name: 'defaultDepository', message: "Default Depository?", choices: [] },
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
            "metadata": answers.metadata
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
