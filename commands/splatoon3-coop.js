const { SlashCommandBuilder } = require("@discordjs/builders");
//const { EmbedBuilder } = require("discord.js");
const buttonPages = require("../functions/pagination");
const fs = require("fs");

const splaApi = "https://spla3.yuu26.com/api/coop-grouping-regular/";

const coopImgs = JSON.parse(fs.readFileSync("././resources/splatoon3-coopImages.json", "utf8")).coopImgs;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coop")
        .setDescription("Answer Splatoon3 coop information")
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("What time frame do you want the information in? ( now / next / schedule )")
                .addChoices({ name: "now", value: "now" }, { name: "next", value: "next" }, { name: "schedule", value: "schedule" })
                .setRequired(true),
        ),

    run: async ({ interaction }) => {
        const time = interaction.options.getString("time", true);
        // データを取得
        let coopSchedule;
        try {
            coopSchedule = await (await fetch(`${splaApi}${time}`)).json();
        } catch (e) {
            console.log(e);
            return interaction.reply({ content: "Error: Could not fetch data", ephemeral: true });
        }

        if (time == "now" || time == "next") {
            const result = coopSchedule.results[0];
            const startDate = result.start_time;
            const endDate = result.end_time;
            const coopDate = `${startDate.slice(5, 7)}/${startDate.slice(8, 10)} ${startDate.slice(11, 13)}:00 ~ ${endDate.slice(5, 7)}/${endDate.slice(8, 10)} ${endDate.slice(11, 13)}:00 (${time})`;
            const weapons = result.weapons;
            const embed = {
                color: 0xffaa00,
                author: {
                    name: "サーモンラン",
                    icon_url: "https://i.imgur.com/QthCIvF.png",
                },
                fields: [
                    { name: "期間", value: coopDate, inline: false },
                    { name: "ブキ", value: `${weapons[0].name}\n${weapons[1].name}\n${weapons[2].name}\n${weapons[3].name}`, inline: true },
                    { name: "ステージ", value: `${result.stage.name}`, inline: true },
                ],
                image: { url: coopImgs[result.stage.id] },
            };
            return await interaction.editReply({ embeds: [embed] });
        } else if (time == "schedule") {
            const pages = [];
            coopSchedule.results.forEach((result, index) => {
                const startDate = result.start_time;
                const endDate = result.end_time;
                const coopDate = `${startDate.slice(5, 7)}/${startDate.slice(8, 10)} ${startDate.slice(11, 13)}:00 ~ ${endDate.slice(5, 7)}/${endDate.slice(8, 10)} ${endDate.slice(11, 13)}:00`;
                const weapons = result.weapons;
                const embed = {
                    color: 0xffaa00,
                    author: {
                        name: "サーモンラン",
                        icon_url: "https://i.imgur.com/QthCIvF.png",
                    },
                    fields: [
                        { name: "期間", value: coopDate, inline: false },
                        { name: "ブキ", value: `${weapons[0].name}\n${weapons[1].name}\n${weapons[2].name}\n${weapons[3].name}`, inline: true },
                        { name: "ステージ", value: `${result.stage.name}`, inline: true },
                    ],
                    image: { url: coopImgs[result.stage.id] },
                    footer: { text: `Page ${index + 1}/${coopSchedule.results.length}` },
                };
                pages.push(embed);
            });
            return buttonPages(interaction, pages);
        } else {
            const embed = { title: "Error" };
            return await interaction.editReply({ embeds: [embed] });
        }
    },
};
