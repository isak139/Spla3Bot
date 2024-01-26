const { Routes, Collection, Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const { REST } = require("@discordjs/rest");
const fs = require("fs");

dotenv.config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
//const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
});

client.slashcommands = new Collection();

let commands = [];

const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.slashcommands[command.data.name] = command;
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(TOKEN);
console.log("Deploying slash commands");
// load slashcommands only for a guild
/* rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
    .then(() => {
        console.log("Successfully loaded guild commands");
    })
    .catch((err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    }) */
// load slashcommands globally
rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
    .then(() => {
        console.log("Successfully loaded global commands");
    })
    .catch((err) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
    });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.on("interactionCreate", (interaction) => {
    async function handleCommand() {
        if (!interaction.isCommand()) {
            return;
        }
        const slashcmd = client.slashcommands[interaction.commandName];
        if (!slashcmd) {
            interaction.reply("Not a valid slash command");
        }
        //await interaction.deferReply();
        await slashcmd.run({ client, interaction });
    }
    handleCommand();
});
client.login(TOKEN);
