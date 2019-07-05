const inquirer = require('inquirer');
const { mainMenuChoices } = require('./values');
const depositoryMenu = require ('./depositoryMenu')

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
      }
      // answer.main === '' ? subMenu.subMenu() :
      //   answer.menu.toLowerCase().trim() === 'menu' ? subMenu.subMenu() :
      //   tools.quickNameLookup(answer.menu);
    });
}

module.exports.mainMenu = mainMenu;