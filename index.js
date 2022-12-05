import fetch from "node-fetch";

import TelegramApi from "node-telegram-bot-api";

import jsdom from "jsdom";

const token = "5618907871:AAFjxtLiCD5mR1JqZGthz8GnC5rBXcKy7Sw";

const bot = new TelegramApi(token, { polling: true });

let DELAY = 1 * 1000 * 60;

const followers = [1172250479, 5116192656, 342625698];

const regExp = /Лазурна/gm;

let dom;

let lastSiteUpdateTime = "";
let newUpdateTime = "";

let botUpdateTime;

function checkLastUpdateTime(date) {
	if (date != lastSiteUpdateTime) {
		return true;
	} else false;
}

function updateTime(date) {
	lastSiteUpdateTime = date;
}

function checkAdress(adress) {
	if (adress.match(regExp)) {
		return true;
	} else false;
}

function sendMessageAll(chatIdArray, msg) {
	for (let i = 0; i < chatIdArray.length; i++) {
		bot.sendMessage(chatIdArray[i], msg);
	}
}

bot.on("message", (msg) => {
	bot.sendMessage(
		msg.chat.id,
		`Бот был обновлен ${botUpdateTime}.Сайт был обновлен ${lastSiteUpdateTime}`
	);
});

function doAllStaff(url) {
	fetch(url)
		.then((response) => response.text())
		.then((text) => {
			botUpdateTime = new Date();
			dom = new jsdom.JSDOM(text);
			newUpdateTime = dom.window.document.querySelector(
				"#output td:nth-child(4)"
			).textContent;
		});

	if (checkLastUpdateTime(newUpdateTime)) {
		updateTime(newUpdateTime);
		let adress = dom.window.document.querySelector(
			"#output td:nth-child(2)"
		).textContent;
		if (checkAdress(adress)) {
			let start = dom.window.document.querySelector(
				"#output td:nth-child(5)"
			).textContent;
			let end = dom.window.document.querySelector(
				"#output td:nth-child(6)"
			).textContent;

			let alert = `Свет отключат с ${start} до ${end}`;
			sendMessageAll(followers, alert);
		} else return;
	} else return;
}

setInterval(() => {
	doAllStaff(
		"https://www.energy.mk.ua/grafik-obmezhennya-spozhyvachiv/?type=gao&fil=15"
	);

	console.log(botUpdateTime);
	console.log(lastSiteUpdateTime);
}, DELAY);
