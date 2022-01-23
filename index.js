const Discord = require("discord.js");
const client = new Discord.Client();
const Database = require("@replit/database");
const db = new Database();
const keepAlive = require("./server");

//todo make function more reuseable
/***
 * function for automatically checking if there are birthdays today
 */
function birthdayCheck() {
  const d = new Date();
  let text = d.toString();
  let trimmed = text.substring(4, 10);

  //built in nodejs library
  const fs = require('fs');
  let data = '';

  fs.readFile("./test.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
    } else {
      data = JSON.parse(jsonString);
      var todaysLot = [];

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          let fetchedDate = data[key].month + ' ' + data[key].day;

          if (trimmed === fetchedDate) {
            console.log('found : ' + data[key].id);
            client.channels.cache.get(process.env.SERVER_BIRTHDAYS_CID).send('<@' + process.env.ID_1 + '> <@' + process.env.ID_2 + '> Hello there! It\'s **' + data[key].id + '**\'s birthday! 🎂 ');
          }

          if (!(trimmed === fetchedDate)) {
            //console.log('No birthdays found today!!!');
          }
        }
      }
    }
  });
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // client.user.setAvatar('./bee_bot.jpg')
  // .then(user => console.log(`New avatar set!`))
  // .catch(console.error);
  client.user.setActivity('The Bee Movie!', { type: 'WATCHING' });

  var interval = setInterval(() => {
    var hour = new Date().getHours();

    if (hour == 11) {
      console.log('About to post a birthday!!!');
      birthdayCheck();  //daily birthday check
      clearInterval(interval); //stop for day after checking
    }
  }, 1000); // check once a minute

})

client.on("message", msg => {

  if (msg.content === "$birthday" || msg.content === "🎂") {
    const d = new Date();
    let text = d.toString();
    let trimmed = text.substring(4, 10);

    //built in nodejs library
    const fs = require('fs');
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
  };

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

});

keepAlive(); //keeps server awake
client.login(process.env.TOKEN);