const Discord = require("discord.js");
require('dotenv').config();
// const { Intents,
//   MessageActionRow,
//   MessageButton,
// } = require('discord.js');
const client = new Discord.Client();
//const Database = require("@replit/database");
//const db = new Database();
//const keepAlive = require("./server");
//built in nodejs library
const fs = require('fs');
const path = require('path');
const { exit } = require("process");

let textLog = [];
let dontPingFlag = false;
//todo make function more reuseable
/***
 * function for automatically checking if there are birthdays today
 */
let data = '';

  //load every time birthdayCheck runs; so once a day?
  fs.readFile("./birthdays.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
    } else {
      data = JSON.parse(jsonString);
  }
  });

let birthday_found_today = false;

/**
 * birthdayCheck()
 * 
 * function that checks parsed data array to see
 * if there's any birthdays today
 * 
 * if yes, it sets birthday_found_today = true
 * 
 */
function birthdayCheck() {
  console.log('in birthdaycheck!');



  const d = new Date();
  let text = d.toString();
  let trimmed = text.substring(4, 10);

  //todo improve this for next year
  if (trimmed === "May 20") {
    let bdayMsg = '<@' + process.env.ID_1 + '> <@' + process.env.ID_2 + '> Hello there! It\'s **World Bee Day!** 🐝';
    client.channels.cache.get(process.env.SERVER_BIRTHDAYS_CID).send(bdayMsg);
  }

      for (var key in data) {
        //console.log('key is: ' +  key);
        if (data.hasOwnProperty(key)) {
          let fetchedDate = data[key].month + ' ' + data[key].day;
          //console.log('fetched date is: ' + fetchedDate);
          //console.log('trimmed date is: ' +trimmed);
          if (trimmed === fetchedDate) {
            console.log('key is: ' +  key);
            birthday_found_today = true;
          }

          if (!(trimmed === fetchedDate)) {
            birthday_found_today = false;
          }

          //add found flag to birthdays array
          data[key].flag = birthday_found_today;
        }
      }

  //viewing data array with flags attached
  console.log('checking data array; ');
  console.log(data);

  //in theory, this should loop through data 
  //& send message for any birthdays with birthday_found_today = true
  for (var key in data) {
    //console.log('key is: ' +  key);
    if (data.hasOwnProperty(key)) {
      //console.log('key is: ' + key);
      if (data[key].flag === true) {
        console.log('found : ' + data[key].id);

        //send message to discord
        let bdayMsg = '<@' + process.env.ID_1 + '> <@' + process.env.ID_2 + '> Hello there! It\'s **' + data[key].id + '**\'s birthday! 🎂 ';
        client.channels.cache.get(process.env.SERVER_BIRTHDAYS_CID).send(bdayMsg);

        //log message in logs file
        var readmessagefile = fs.readFileSync('logs.txt', 'utf-8');
        var writemessagefile = fs.writeFileSync('logs.txt', 'About to post a birthday! Details are : ' + bdayMsg + '\r\n' + readmessagefile);
      }
    }
  }
}

/**
 * 
 * runDailyTask()
 * 
 * function that will once a day, calling task (birthdayCheck)
 * & sending bee bot alert as needed
 * 
 * @param {*} hour 
 * @param {*} task 
 * @returns 
 */
function runDailyTask(hour, task) {
  const now = new Date();
  const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0, 0);
  const timeUntilTarget = targetTime.getTime() - now.getTime();
  console.log(hour);
  if (timeUntilTarget < 11) {
    // The target time has already passed today, schedule for tomorrow
    console.log('time passed');
    targetTime.setDate(targetTime.getDate() + 1);
  }

  // Check if targetTime is 11 am
  if (targetTime.getHours() === 11) {
    console.log('triggered once');
    task();
    return; // Exit function for the day
  }

  //scheduling interval until next day
  setTimeout(() => {
    runDailyTask(hour, task);
  }, timeUntilTarget);
}

//initiating discord...
client.on("ready", () => {

  // Call the function to start running the task
runDailyTask(11, () => {
  birthdayCheck();
});

  console.log(`Logged in as ${client.user.tag}!`)
  // client.user.setAvatar('./bee_bot.jpg')
  // .then(user => console.log(`New avatar set!`))
  // .catch(console.error);
  client.user.setActivity('The Bee Movie!', { type: 'WATCHING' });


  //const chan = client.channels.fetch(process.env.SERVER_BIRTHDAYS_CID);


  client.channels.fetch(process.env.SERVER_BIRTHDAYS_CID) //1
    .then(response => {
      console.log('got it');
      console.log(response.messages.cache);

      console.log(client.channels.cache.get(response.lastMessageID))
    });



client.on("message", msg => {

  var readmessagefile = fs.readFileSync('logs.txt', 'utf-8');
  if (msg.member.user.username === "Bee Bot") {
  var writemessagefile = fs.writeFileSync('logs.txt', 'Time - ' +
  msg.createdAt + ' User - ' + msg.member.user.username + ': ' +
  msg.content + '\n' + readmessagefile);
  }

  if (msg.content === "$birthday" || msg.content === "🎂") {
    console.log('received command');
    const d = new Date();
    let text = d.toString();
    let trimmed = text.substring(4, 10);

    let data = '';
    let bday = '';

    //ingesting json file
    fs.readFile("./test.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("File read failed:", err);
      } else {
        data = JSON.parse(jsonString);
        let fetchedDate = '';
        let hasMatch = false;

        for (var key in data) {

          if (data.hasOwnProperty(key)) {
            fetchedDate = data[key].month + ' ' + data[key].day;

            //comparing current day with birthday in json file
            if (trimmed === fetchedDate) {
              hasMatch = true;
              let exampleEmbed = new Discord.MessageEmbed().setTitle('It\'s *' + data[key].id + '*\'s birthday! 🎂 ').setColor('#5dc4ff');
              msg.channel.send(exampleEmbed);
            }
          }

        }

        //if no matches found
        if (!hasMatch) {
          const exampleEmbed = new Discord.MessageEmbed().setTitle('No muses celebrate their birthday today!');
          exampleEmbed.setColor('#fcfc55');
          msg.channel.send(exampleEmbed);
          return false;
        }

      }
    });

    

  }

  //todo
  //add function to display list of birthdays this month

  //testing sending custom emoji
  //to find custom emoji code do;
  // \:customeemojiname:
  // & copy result
  if (msg.content === "$test") {
    msg.channel.send("<a:capslap:809918103999873089>");
  }

  //testing embeds
  //bones of quote function
  if (msg.content === "$thing") {
    // const exampleEmbed = new Discord.MessageEmbed()
    // .setTitle("This is a title")
    // .setTitle("http://tryitands.ee")
    // .setDescription("This is a description")
    // .setTimestamp()
    // .setFooter("This is a footer")
    // .setAuthor("This is the author's name")
    // .addField("This is a field", "this is its description")
    // .setImage("https://i.imgur.com/KlT2KXj.png")
    // .setThumbnail("https://i.imgur.com/C2Mrmwo.png");
    // 	exampleEmbed.setColor('#cc22cc');
    const exampleEmbed = new Discord.MessageEmbed()
      .setDescription("**“Vengeance is only a step behind you.”**")
      .setFooter("Warwick")
      .setTimestamp()
      .setThumbnail("https://i.imgur.com/C2Mrmwo.png");
    exampleEmbed.setColor('#b8a5ff');
    msg.channel.send(exampleEmbed);
  }

  //testing sending gifs
  if (msg.content === "$bees") {
    const embed = new Discord.MessageEmbed().setTitle('NOT THE BEES!!!').setImage('attachment://bees.gif');
    msg.channel.send({ embeds: [embed], files: ['./bees.gif'] });
    // msg.channel.send("./bees.gif");
  }

  //testing sending yt links
  if (msg.content === "$englishftw") {
    msg.channel.send("https://www.youtube.com/watch?v=hiwgOWo7mDc");
    msg.channel.send("🎈🎈🎈");
  }

  // if (message.content.includes('changeNick')) {

  //   if (msg.content.includes('changeNick')) {
  //     const guild = client.guilds.cache.get("634651811801727001");

  //     const memberTarget = "140442423590518784";
  //     console.log(memberTarget);

  // memberTarget.setNickname
  //     memberTarget.setNickname("cat headed eagle");
  //    const exampleEmbed = new Discord.MessageEmbed().setTitle('Nickname has been set! Bzzzt!');
  //             exampleEmbed.setColor('#fcfc55');
  //             msg.channel.send(exampleEmbed);
  // }




  //send random bee fact
  if (msg.content === "$fact") {
    var array = fs.readFileSync('beeFacts.txt').toString().split("\r\n");
    var count = 0;
    for (i in array) {
      count++;
      // console.log(array[i]);
    }

    console.log('count is: ' + count);
    console.log(Math.floor(Math.random() * array.length));
    console.log(array[Math.floor(Math.random() * array.length)]);
    //let thing = randomProperty(beeFacts);
    //console.log(thing);

    // console.log(typeof(beeFacts));

    // console.log(beeFacts);
    //   const numberPicked = Math.floor(Math.random() * Object.keys(beeFacts).length);
    //   console.log(numberPicked);
    //   console.log(beeFacts[numberPicked]);
    const exampleEmbed = new Discord.MessageEmbed().setDescription(array[Math.floor(Math.random() * array.length)]);
    exampleEmbed.setColor('#fcfc55');
    // exampleEmbed.setFooter("Viewing bee fact: #" + numberPicked + " of " + beeFacts.length + " total facts available in Bee Bot's memory! Bzzt! 🐝🌼");
    msg.channel.send(exampleEmbed);
    return false;
  }



});

});


//keepAlive(); //keeps server awake
console.log(process.env);
const token = process.env.BOT_TOKEN;
client.login(token);