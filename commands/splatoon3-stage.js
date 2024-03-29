const { SlashCommandBuilder } = require("@discordjs/builders");
//const { EmbedBuilder } = require("discord.js");
const buttonPages = require("../functions/pagination");
const fs = require("fs");
const getSchedule = require("../functions/fetchSplaApi");

const splaApi = "https://spla3.yuu26.com/api/";

const stageImages = JSON.parse(fs.readFileSync("././resources/splatoon3-stageImages.json", "utf8")).stageImages;

const ruleInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-ruleInfo.json", "utf8"));

const matchInfo = JSON.parse(fs.readFileSync("././resources/splatoon3-matchInfo.json", "utf8"));

const fesImage = JSON.parse(fs.readFileSync("././resources/splatoon3-fesImage.json", "utf8"));
const fesIcon = "https://i.imgur.com/kkg0f8w.png";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stage")
        .setDescription("Answer Splatoon3 stage information")
        .addStringOption((option) =>
            option
                .setName("match")
                .setDescription("What is the match? ( regular / challenge / open / x)")
                .addChoices({ name: "regular", value: "regular" }, { name: "challenge", value: "bankara-challenge" }, { name: "open", value: "bankara-open" }, { name: "x", value: "x" })
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("What time frame do you want the information in? ( now / next / schedule )")
                .addChoices({ name: "now", value: "now" }, { name: "next", value: "next" }, { name: "schedule", value: "schedule" })
                .setRequired(true),
        ),

    run: async ({ interaction }) => {
        const match = interaction.options.getString("match", true);
        const time = interaction.options.getString("time", true);

        // データを取得
        const splaSchedule = await getSchedule(`${splaApi}${match}/${time}`, interaction);
        if (!splaSchedule) return;

        if (time == "now" || time == "next") {
            const result = splaSchedule.results[0];
            const startDate = result.start_time;
            const endDate = result.end_time;
            const matchDate = `${startDate.slice(11, 16)} ~ ${endDate.slice(11, 16)} (${time})`;
            // フェス開催中
            if (result.is_fest) {
                const embed = {
                    color: 0xeaff3d,
                    author: {
                        name: "フェスマッチ",
                        icon_url: fesIcon,
                    },
                    description: "フェスマッチの情報は`/fes`で取得できます．",
                    fields: [{ name: "期間", value: matchDate }],
                    image: { url: fesImage },
                };
                return await interaction.reply({ embeds: [embed] });
            } else {
                // フェス開催中でない
                const embed = {
                    color: parseInt(matchInfo[match].color, 16),
                    author: { name: result.rule.name + ` (${matchInfo[match].name})`, icon_url: matchInfo[match].icon },
                    thumbnail: { url: ruleInfo[result.rule.name].image },
                    fields: [
                        { name: "期間", value: matchDate, inline: false },
                        { name: "ステージ1", value: result.stages[0].name, inline: true },
                        { name: "ステージ2", value: result.stages[1].name, inline: true },
                    ],
                    image: { url: stageImages[result.stages[0].id][result.stages[1].id] },
                };
                return await interaction.reply({ embeds: [embed] });
            }
        } else if (time == "schedule") {
            // スケジュールを指定した場合
            const pages = [];
            splaSchedule.results.forEach((result, index) => {
                const startDate = result.start_time;
                const endDate = result.end_time;
                const matchDate = `${startDate.slice(11, 16)} ~ ${endDate.slice(11, 16)}`;
                // フェス開催中
                if (result.is_fest) {
                    const embed = {
                        color: 0xeaff3d,
                        author: {
                            name: "フェスマッチ",
                            icon_url: fesIcon,
                        },
                        description: "フェスマッチの情報は`/fes`で取得できます．",
                        fields: [{ name: "期間", value: matchDate }],
                        image: { url: fesImage },
                    };
                    pages.push(embed);
                } else {
                    // フェス開催中でない
                    const embed = {
                        color: parseInt(matchInfo[match].color, 16),
                        author: { name: `${result.rule.name} (${matchInfo[match].name})`, icon_url: matchInfo[match].icon },
                        thumbnail: { url: ruleInfo[result.rule.name].image },
                        fields: [
                            { name: "期間", value: matchDate, inline: false },
                            { name: "ステージ1", value: result.stages[0].name, inline: true },
                            { name: "ステージ2", value: result.stages[1].name, inline: true },
                        ],
                        image: { url: stageImages[result.stages[0].id][result.stages[1].id] },
                        footer: { text: `Page ${index + 1}/${splaSchedule.results.length}` },
                    };
                    pages.push(embed);
                }
            });
            return buttonPages(interaction, pages);
        } else {
            const embed = { title: "Error" };
            return await interaction.reply({ embeds: [embed] });
        }
    },
};
