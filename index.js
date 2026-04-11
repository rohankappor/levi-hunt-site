const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

// 🔥 LOAD SAVED DATA
let leaderboard = [];

if (fs.existsSync("data.json")) {
  leaderboard = JSON.parse(fs.readFileSync("data.json", "utf8"));
}

// 💾 SAVE FUNCTION
function saveData() {
  fs.writeFileSync("data.json", JSON.stringify(leaderboard, null, 2), "utf8");
}

// 🤖 DISCORD BOT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  let user = leaderboard.find(u => u.id === message.author.id);

  if (!user) {
    leaderboard.push({
      id: message.author.id,
      name: message.author.username,
      xp: 1
    });
  } else {
    user.xp += 1;
  }

  leaderboard.sort((a, b) => b.xp - a.xp);

  saveData(); // 💾 SAVE XP
});

// 🌐 API FOR WEBSITE
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard.slice(0, 5));
});

// 🚀 START SERVER
app.listen(3000, () => {
  console.log("✅ Backend running on http://localhost:3000");
});

// 🤖 LOGIN BOT (PUT YOUR NEW TOKEN HERE)
client.login("MTQ5MjE5NTUwNzYxMzcyODk3MA.Gh_La3.DbhbkBc3PwiirCez95Ec2UC4_DqAiFZwRbKGQg");