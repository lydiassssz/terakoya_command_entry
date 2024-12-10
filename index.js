const dotenv = require('dotenv');
dotenv.config();

const { REST, Routes } = require('discord.js');
const commands = [
  {
    name: 'hello',
    description: 'Replies with hello',
    type: 1
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(
  Routes.applicationGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID),
  { body: commands },
)
.then(() => console.log('Successfully registered guild command.'))
.catch(console.error);
