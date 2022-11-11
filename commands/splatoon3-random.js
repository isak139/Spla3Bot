const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const weaponInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-weaponInfo.json", "utf8"));
const stageInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-stageInfo.json", "utf8"));
const ruleInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-ruleInfo.json", "utf8"));
const titleInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-titleInfo.json", "utf8"));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Answer information at random")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Which information do you want? ( weapon / stage / rule / title)")
                .addChoices({ name: "weapon", value: "weapon" }, { name: "stage", value: "stage" }, { name: "rule", value: "rule" }, { name: "title", value: "title" })
                .setRequired(true),
        ),

    run: async ({ interaction }) => {
        const query = interaction.options.getString("query", true);
        if (query == "weapon") {
            const weapon = Object.entries(weaponInfo)[Math.floor(Math.random() * Object.entries(weaponInfo).length)];
            const embed = {
                author: {
                    name: "ランダムブキ",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
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
            const stage = Object.entries(stageInfo)[Math.floor(Math.random() * Object.entries(stageInfo).length)];
            const embed = {
                author: {
                    name: "ランダムステージ",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                title: stage[0],
                image: { url: stage[1].image },
            };
            return interaction.editReply({ embeds: [embed] });
        } else if (query == "rule") {
            const rule = Object.entries(ruleInfo)[Math.floor(Math.random() * Object.entries(ruleInfo).length)];
            const embed = {
                author: {
                    name: "ランダムルール",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                title: rule[0],
                image: { url: rule[1].image },
            };
            return interaction.editReply({ embeds: [embed] });
        } else if (query == "title") {
            const first = titleInfo.first[Math.floor(Math.random() * titleInfo.first.length)];
            const second = titleInfo.second[Math.floor(Math.random() * titleInfo.second.length)];
            const embed = {
                author: {
                    name: "ランダム二つ名",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                title: `\`${first}\` \`${second}\``,
            };
            return interaction.editReply({ embeds: [embed] });
        } else {
            const embed = { title: "Error" };
            return await interaction.editReply({ embeds: [embed] });
        }
    },
};
