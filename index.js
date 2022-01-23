const Discord = require("discord.js")
const fetch = require("node-fetch")
const client = new Discord.Client()

// sadWords = ["sad", "depressed", "unhappy", "angry", "miserable"]
// encouragements = [
//   "Cheer up!",
//   "Hang in there.",
//   "You are a great person / bot!"
// ]
birthdays = [
  [1, "Sat Jan 22 2021", "Warwick"],
  [3, 4],
  [5, 6]
];

function getQuote() {
  return fetch("https://zenquotes.io/api/random")
    .then(res => {
      return res.json()
      })
    .then(data => {
      return data[0]["q"] + " -" + data[0]["a"]
    })
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

createArray();     // [] or new Array()

createArray(2);    // new Array(2)

createArray(3, 2); // [new Array(2),
                   //  new Array(2),
                   //  new Array(2)]



client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  // client.user.setAvatar('./bee_bot.jpg')
  // .then(user => console.log(`New avatar set!`))
  // .catch(console.error);
   client.user.setActivity('The Bee Movie!', { type: 'WATCHING' });
})

client.on("message", msg => {
  // if (msg.content === "$inspire") {
  //   getQuote().then(quote => msg.channel.send(quote))
  // }

  if (msg.content === "$birthday" || msg.content === "🎂") {
    const d = new Date();
    let text = d.toString();
    let trimmed = text.substring(0, 15);

    let museName = '';
    for(var i = 0; i < birthdays.length; i++) {
        var dob = birthdays[i];
        for(var j = 0; j < dob.length; j++) {
          if (trimmed === dob[j]) {
              museName += dob[2];

          }
        }
    }

  if (museName === '') {
      const exampleEmbed = new Discord.MessageEmbed().setTitle('No muses celebrate their birthday today!');
    exampleEmbed.setColor('#fcfc55');
    msg.channel.send(exampleEmbed);
  } else {
   const exampleEmbed = new Discord.MessageEmbed().setTitle('It\'s ' + museName + '\'s birthday! 🎂 ');
    exampleEmbed.setColor('#5dc4ff');
    msg.channel.send(exampleEmbed);
   }
  }

  if (msg.content === "$test") {
    msg.channel.send("<a:capslap:809918103999873089>");
  }

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


   if (msg.content === "$bees") {
     const embed = new Discord.MessageEmbed().setTitle('NOT THE BEES!!!').setImage('attachment://bees.gif');
msg.channel.send({ embeds: [embed], files: ['./bees.gif'] });
   // msg.channel.send("./bees.gif");
  }

     if (msg.content === "$englishftw") {
      msg.channel.send("https://www.youtube.com/watch?v=hiwgOWo7mDc");
      msg.channel.send("🎈🎈🎈");
  }


     if (msg.content === "$fancy") {
     const exampleEmbed = new Discord.MessageEmbed().setTitle('Here be dragons! 🔥🐲');

	exampleEmbed.setColor('#1bd928');
    msg.channel.send(exampleEmbed);
  }

  // if (sadWords.some(word => msg.content.includes(word))) {
  //   const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
  //   msg.reply(encouragement)
  // }

  

})

client.login(process.env.TOKEN)