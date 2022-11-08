const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const weaponInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-weaponInfo.json", "utf8"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Answer information at random")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Which information do you want? ( weapon / stage / rule )")
                .addChoices({ name: "weapon", value: "weapon" }, { name: "stage", value: "stage" }, { name: "rule", value: "rule" })
                .setRequired(true),
        ),

    run: async ({ interaction }) => {
        const query = interaction.options.getString("query", true);
        if (query == "weapon") {
            const weapon = Object.entries(weaponInfo)[Math.floor(Math.random() * Object.entries(weaponInfo).length)];
            const embed = {
                author: {
                    name: "ランダムブキ",
                    icon_url: "https://i.imgur.com/2AijJjL.png",
                },
                title: weapon[0],
                fields: [
                    {
                        name: "サブ",
                        value: weapon[1].sub,
                    },
                    {
                        name: "スペシャル",
                        value: weapon[1].special,
                    },
                ],
                image: { url: weapon[1].image },
            };
            return interaction.editReply({ embeds: [embed] });
        } else if (query == "stage") {
            return;
        } else if (query == "rule") {
            return;
        } else {
            const embed = { title: "Error" };
            return await interaction.editReply({ embeds: [embed] });
        }
    },
};
