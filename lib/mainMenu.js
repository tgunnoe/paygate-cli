const inquirer = require('inquirer');
const { mainMenuChoices } = require('./values');
const depositoryMenu = require ('./depositoryMenu')
const originatorMenu = require ('./originatorMenu')
const receiverMenu = require ('./receiverMenu')
const transfersMenu = require ('./transfersMenu')

var menu = [
  { type: 'input', name: 'endpoint', message: "What endpoint?", default: 'http://localhost:8082' },
  { type: 'list', name: 'main', message: "Choose option", choices: mainMenuChoices }
]
var options = {};

const mainMenu = (options) => {
  inquirer
    .prompt(menu).then(answer => {
      switch (answer.main) {
      case 'depositories':
        options.url = answer.endpoint + '/' + answer.main;
        depositoryMenu.depositoryMenu(options);
        break;
      case 'originators':
        options.url = answer.endpoint + '/' + answer.main;
        originatorMenu.originatorMenu(options);
        break;
      case 'receivers':
        options.url = answer.endpoint + '/' + answer.main;
        receiverMenu.receiverMenu(options);
        break;
      case 'transfers':
        options.url = answer.endpoint + '/' + answer.main;
        transfersMenu.transfersMenu(options);
        break;
      }
      // answer.main === '' ? subMenu.subMenu() :
      //   answer.menu.toLowerCase().trim() === 'menu' ? subMenu.subMenu() :
      //   tools.quickNameLookup(answer.menu);
    });
}

module.exports.mainMenu = mainMenu;
