/*const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content === 'ping') {
    	message.reply('pong');
  	}
});

client.login(process.env.BOT_TOKEN);
*/
var fs = require('fs');
var jsdom = require('jsdom');
const Discord = require('discord.js');
const client = new Discord.Client();

var endMessage = "";

client.on('ready', () => {
  console.log('I am ready!');
});

var obj = JSON.parse(fs.readFileSync('./items.json', 'utf8'));
var mon = JSON.parse(fs.readFileSync('./monsters.json', 'utf8'));

function searchID(element, table) {
	for(i=0; i < table.length; i++) {
		if(table[i].name.toLowerCase() === element.toLowerCase()) {
			return table[i].value;
		}
	}
	return "";
}

function loopMessage(message, first, second, type, list) {
	var originalMes = message.content;
	var mes = originalMes;
	var dbHTML;
	if(mes.indexOf('<@') == -1 && mes.indexOf('<:') == -1 && mes.indexOf('<#') == -1) {
		while(mes.includes(first) && mes.includes(second)) {
			var i = mes.indexOf(first);
			var j = mes.indexOf(second);
			var res = "";
			var dbType;
			var resURL = "";
			var resDisplay = "";

			//the condition requires at least one character 
			if(i<j-1) {
				//check later if there's another '<'
				var item = mes.substring(i+1, j);

				if(item.length > 1) {
					res = searchID(item, list);
				}

				switch(type) {
					case 1:
						dbType = "item";
						break;
					case 2:
						dbType = "monster";
						break;
					default:
						dbType = "item";
				}
				
				if(res.length > 0) {
					resURL = "http://db.irowiki.org/db/" + dbType + "-info/" + res + "/";
					resDisplay += resURL + "\n";
					jsdom.env(
						resURL,
						["http://code.jquery.com/jquery.js"],
						function (err, window) {
							resDisplay += "\n" + window.$('body') + "\n";
							if(type == 1) {
								var selected = window.$('.bgLtTable:eq(1) tbody tr td:eq(1)').text();
								resDisplay += "**```\t";
								resDisplay += window.$('table.bgMdTitle tbody tr td:eq(1)').text();
								resDisplay += "```**";
								resDisplay += "```";
								resDisplay += window.$('table.bgLtTable:eq(0) tbody tr td').text();
								resDisplay += "```";
								resDisplay += "Type :\t\t";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(1)').text();
								resDisplay += "\nSubtype :  ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr:eq(1) td:eq(1)').text();
								resDisplay += "\nWeight :\t";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr:eq(2) td:eq(1)').text();
								message.reply(resDisplay);
							} else if(type == 2) {
								resDisplay += "**```\t";
								resDisplay += window.$('table.bgMdTitle tbody tr td').text();
								resDisplay += "```**";
								resDisplay += "```";
								resDisplay += "Size : ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(0)').text();
								resDisplay += " | ";
								resDisplay += "Race : ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(1)').text();
								resDisplay += " | ";
								resDisplay += "Element : ";
								resDisplay += window.$('table.bgLtTable:eq(1) tbody tr td:eq(2)').text();
								resDisplay += "```";
								message.reply(resDisplay);
							}
						}
					);
				}
				else if(item.length < 30 && item.length > 1) {
					resURL = "http://db.irowiki.org/classic/search/?quick=" + item.replace(" ","%20").replace(" ","%20").replace(" ","%20").replace(" ","%20") + "&type=" + type;
					resDisplay += resURL + "\n";
					message.reply(resDisplay);
				}
			}
			if(j+1 >= mes.length) {
				mes = "";
			} else {
				mes = mes.substring(j+1);
			}
		}
	}
}

client.on('message', message => {
	loopMessage(message, '<', '>', 1, obj);
	loopMessage(message, '[', ']', 2, mon);
});

client.login(process.env.BOT_TOKEN);
