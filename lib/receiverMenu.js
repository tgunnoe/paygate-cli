const inquirer = require('inquirer');
const { receiverChoices } = require('./values');
const request = require('request');
const mainMenu = require ('./mainMenu');
const newReceiverMenu = require('./newReceiverMenu');

const receiverMenu = (options) => {

  let menu = [
  { type: 'list', name: 'action', message: "Welcome to the Receivers menu. What would you like to do?", choices: receiverChoices }
  ]

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

  inquirer
    .prompt(menu).then(submenu => {
      let currentMenu = Object.keys(submenu)[0];
      options.headers = {
        'x-user-id': 'taylor',
        'Content-Type': 'application/json'
      }
      switch (submenu.action) {
      case 'GET':
        options.method = submenu.action;
        request(options, callback);
        break;
      case 'POST':
        options.method = submenu.action;
        newReceiverMenu.newReceiverMenu(options);
        break;
      case 'more':
        options.method = 'GET';
        //entityDepositoryMenu.entityDepositoryMenu(currentMenu, options);
        break;
      case 'back':
        mainMenu.mainMenu(options);
        break;
      }
    });
};

module.exports.receiverMenu = receiverMenu;
