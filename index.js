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
  [1, "Sat Jan 22 2022"],
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
let trimmed = text.substring(0, 15)
let compared = birthdays[0][1];
if (trimmed === compared)
   // msg.reply("It's Warwick's birthday!");
    msg.channel.send("It's Warwick's birthday!");
  }

  if (msg.content === "$test") {
    msg.channel.send("<a:capslap:809918103999873089>");
  }

   if (msg.content === "$bees") {
     const embed = new Discord.MessageEmbed().setTitle('NOT THE BEES!!!').setImage('attachment://bees.gif');
msg.channel.send({ embeds: [embed], files: ['./bees.gif'] });
   // msg.channel.send("./bees.gif");
  }

  // if (sadWords.some(word => msg.content.includes(word))) {
  //   const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
  //   msg.reply(encouragement)
  // }

})

client.login(process.env.TOKEN)