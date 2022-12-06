const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");
const buttonPages = require("../functions/pagination");

const weaponInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-weaponInfo.json", "utf8"));
const subChoices = JSON.parse(fs.readFileSync("././resources/splatoon3-sub.json", "utf8")).map((sub) => ({ name: sub, value: sub }));
const specialChoices = JSON.parse(fs.readFileSync("././resources/splatoon3-special.json", "utf8")).map((special) => ({ name: special, value: special }));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weapon")
        .setDescription("Answer information about weapons")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("sub")
                .setDescription("Search for a weapon by sub weapon")
                .addStringOption((option) =>
                    option
                        .setName("sub")
                        .setDescription("which sub weapon?")
                        .addChoices(...subChoices)
                        .setRequired(true),
                ),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("special")
                .setDescription("Search for a weapon by special weapon")
                .addStringOption((option) =>
                    option
                        .setName("special")
                        .setDescription("which special weapon?")
                        .addChoices(...specialChoices)
                        .setRequired(true),
                ),
        ),
    run: async ({ interaction }) => {
        if (interaction.options.getSubcommand() == "sub") {
            const sub = interaction.options.getString("sub", true);
            const results = Object.entries(weaponInfo).filter((weapon) => weapon[1].sub == sub);
            const pages = results.map((weapon) => {
                return {
                    color: 0x6e5adf,
                    author: {
                        name: `${sub}を持つブキ`,
                        icon_url: "https://i.imgur.com/2AijJjL.png",
                    },
                    title: weapon[0],
                    image: { url: weapon[1].image },
                };
            });
            return buttonPages(interaction, pages);
        } else if (interaction.options.getSubcommand() == "special") {
            const special = interaction.options.getString("special", true);
            const results = Object.entries(weaponInfo).filter((weapon) => weapon[1].special == special);
            const pages = results.map((weapon) => {
                return {
                    color: 0x6e5adf,
                    author: {
                        name: `${special}を持つブキ`,
                        icon_url: "https://i.imgur.com/2AijJjL.png",
                    },
                    title: weapon[0],
                    image: { url: weapon[1].image },
                };
            });
            return buttonPages(interaction, pages);
        } else {
            const embed = { title: "Error" };
            return await interaction.editReply({ embeds: [embed] });
        }
    },
};
