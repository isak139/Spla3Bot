const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Pong!"),

    run: async ({ /* client,  */ interaction }) => {
        return await interaction.editReply("Pong!");
    },
};
