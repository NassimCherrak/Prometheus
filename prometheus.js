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
const Discord = require('discord.js');
var jsdom = require('jsdom');
const client = new Discord.Client();
var command = "$";
var numOfResultsMax = 3;

client.on('ready', () => {
  console.log('ragial ready!');
});

client.on('message', message => {
	if(message.content.toLowerCase().startsWith(command)) {
		var numOfResults = numOfResultsMax;
		var searchURL = "http://ragi.al/search/iRO-Classic/" + message.content.substring(command.length).replace(" ","%20");
		var resDisplay = "";
		var currentRes = "";
		var count;
		jsdom.env(
			searchURL,
			["http://code.jquery.com/jquery.js"],
			function (err, window) {
				count = window.$('div:eq(0)').length;
				resDisplay += searchURL;
				if (count < numOfResults) {
					numOfResults = count;
				}
				resDisplay += "\n text = " + window.$('body').text() + "\n";
				for(var i=0; i<numOfResults; i++) {
					resDisplay += "\n```";
					resDisplay += window.$('div.ilist:eq(0) table tbody tr:eq('+ i + ') td:eq(0)').text();
					resDisplay += "```";
					resDisplay += "On sale/Last sold : ";
					currentRes = window.$('div.ilist:eq(0) table tbody tr:eq('+ i + ') td:eq(1)').text();
					resDisplay += currentRes;
					resDisplay += "\t| Price/Average : ";
					resDisplay += window.$('div.ilist:eq(0) table tbody tr:eq('+ i + ') td:eq(2)').text();
					if(currentRes.length < 7) {
						resDisplay += ":moneybag:";
					}
				}
				numOfResults = numOfResultsMax;
				message.reply(resDisplay);
			}
		);
	}
});

client.login(process.env.BOT_TOKEN);
