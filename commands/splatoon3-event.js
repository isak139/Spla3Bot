const { SlashCommandBuilder } = require("@discordjs/builders");
//const { EmbedBuilder } = require("discord.js");
const buttonPages = require("../functions/pagination");
const fs = require("fs");
const getSchedule = require("../functions/fetchSplaApi");

const splaApi = "https://spla3.yuu26.com/api/event/schedule";

const stageImages = JSON.parse(fs.readFileSync("././resources/splatoon3-stageImages.json", "utf8")).stageImages;

const ruleInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-ruleInfo.json", "utf8"));

const eventIcon = "https://i.imgur.com/3DdNbpH.png";

module.exports = {
    data: new SlashCommandBuilder().setName("event").setDescription("Answer Splatoon3 event information"),
    run: async ({ interaction }) => {
        // データを取得
        const splaSchedule = await getSchedule(splaApi, interaction);
        if (!splaSchedule) return;

        const pages = [];
        splaSchedule.results.forEach((result, index) => {
            const startDate = result.start_time;
            const endDate = result.end_time;
            const matchDate = `${startDate.slice(5, 7)}/${startDate.slice(8, 10)} ${startDate.slice(11, 16)} ~ ${endDate.slice(11, 16)}`;
            const embed = {
                color: 0xf12e7b,
                author: {
                    name: result.event.name,
                    icon_url: eventIcon,
                },
                thumbnail: { url: ruleInfo[result.rule.name].image },
                fields: [
                    { name: "期間", value: matchDate, inline: false },
                    { name: "詳細", value: result.event.desc, inline: false },
                    { name: "ステージ1", value: result.stages[0].name, inline: true },
                    { name: "ステージ2", value: result.stages[1].name, inline: true },
                ],
                image: { url: stageImages[result.stages[0].id][result.stages[1].id] },
                footer: { text: `Page ${index + 1}/${splaSchedule.results.length}` },
            };
            pages.push(embed);
        });
        return buttonPages(interaction, pages);
    },
};
