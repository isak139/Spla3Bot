const { SlashCommandBuilder } = require("@discordjs/builders");
//const { EmbedBuilder } = require("discord.js");
const buttonPages = require("../functions/pagination");
//const fs = require("fs");
const getSchedule = require("../functions/fetchSplaApi");

const splaApi = "https://spla3.yuu26.com/api/coop-grouping/";
const coopIcon = "https://i.imgur.com/12s7l5W.png";
const bigRunIcon = "https://i.imgur.com/4MwNoi6.png";

//const coopImages = JSON.parse(fs.readFileSync("././resources/splatoon3-coopImages.json", "utf8")).coopImages;

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
        const coopSchedule = await getSchedule(`${splaApi}${time}`, interaction);
        if (!coopSchedule) return;

        if (time == "now" || time == "next") {
            const result = coopSchedule.results[0];
            const startDate = result.start_time;
            const endDate = result.end_time;
            const coopDate = `${startDate.slice(5, 7)}/${startDate.slice(8, 10)} ${startDate.slice(11, 13)}:00 ~ ${endDate.slice(5, 7)}/${endDate.slice(8, 10)} ${endDate.slice(11, 13)}:00 (${time})`;
            const weapons = result.weapons;
            const is_big_run = result.is_big_run;
            const embed = {
                color: is_big_run ? 0xda3cf5 : 0xef5534,
                author: {
                    name: is_big_run ? "ビッグラン" : "サーモンラン",
                    icon_url: is_big_run ? bigRunIcon : coopIcon,
                },
                thumbnail: { url: "https://i.imgur.com/ifdahLY.png" },
                fields: [
                    { name: "期間", value: coopDate, inline: false },
                    { name: "ブキ", value: `${weapons[0].name}\n${weapons[1].name}\n${weapons[2].name}\n${weapons[3].name}`, inline: true },
                    { name: "ステージ", value: `${result.stage.name}`, inline: true },
                ],
                image: { url: result.stage.image /* coopImages[result.stage.id] */ },
            };
            return await interaction.editReply({ embeds: [embed] });
        } else if (time == "schedule") {
            const pages = [];
            coopSchedule.results.forEach((result, index) => {
                const startDate = result.start_time;
                const endDate = result.end_time;
                const coopDate = `${startDate.slice(5, 7)}/${startDate.slice(8, 10)} ${startDate.slice(11, 13)}:00 ~ ${endDate.slice(5, 7)}/${endDate.slice(8, 10)} ${endDate.slice(11, 13)}:00`;
                const weapons = result.weapons;
                const is_big_run = result.is_big_run;
                const embed = {
                    color: is_big_run ? 0xda3cf5 : 0xef5534,
                    author: {
                        name: is_big_run ? "ビッグラン" : "サーモンラン",
                        icon_url: is_big_run ? bigRunIcon : coopIcon,
                    },
                    thumbnail: { url: "https://i.imgur.com/ifdahLY.png" },
                    fields: [
                        { name: "期間", value: coopDate, inline: false },
                        { name: "ブキ", value: `${weapons[0].name}\n${weapons[1].name}\n${weapons[2].name}\n${weapons[3].name}`, inline: true },
                        { name: "ステージ", value: `${result.stage.name}`, inline: true },
                    ],
                    image: { url: result.stage.image /* coopImages[result.stage.id] */ },
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
