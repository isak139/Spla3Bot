const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const buttonPages = require("../functions/pagination");
const fs = require("fs");

const stageGifs = JSON.parse(fs.readFileSync("././resources/splatoon3-stageGifs.json", "utf8")).stageGifs;

const matchInfo = {
    regular: {
        name: "レギュラー",
        icon: "https://i.imgur.com/sHXeNci.png",
        color: "#899A37",
    },
    "bankara-challenge": {
        name: "チャレンジ",
        icon: "https://i.imgur.com/UO6hEB6.png",
        color: "#835439",
    },
    "bankara-open": {
        name: "オープン",
        icon: "https://i.imgur.com/UO6hEB6.png",
        color: "#835439",
    },
    league: {
        name: "リーグ",
        icon: "https://i.imgur.com/oiIZSXG.png",
        color: "#C76080",
    },
};

const ruleInfo = {
    ナワバリバトル: {
        img: "https://i.imgur.com/KOQFBER.png",
    },
    ガチヤグラ: {
        img: "https://i.imgur.com/6N9nuLe.png",
    },
    ガチホコバトル: {
        img: "https://i.imgur.com/6YMbNFG.png",
    },
    ガチアサリ: {
        img: "https://i.imgur.com/hN4a3uJ.png",
    },
    ガチエリア: {
        img: "https://i.imgur.com/GaAg1IJ.png",
    },
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stage")
        .setDescription("Answer Splatoon3 stage information")
        .addStringOption((option) =>
            option
                .setName("match")
                .setDescription("What is the match? ( regular / challenge / open )")
                .addChoices({ name: "regular", value: "regular" }, { name: "challenge", value: "bankara-challenge" }, { name: "open", value: "bankara-open" })
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
        const splaUrl = "https://spla3.yuu26.com/api/";
        const match = interaction.options.getString("match", true);
        const time = interaction.options.getString("time", true);
        const splaSchedule = await (await fetch(`${splaUrl}${match}/${time}`)).json();

        if (time == "now" || time == "next") {
            const result = splaSchedule.results[0];
            const startDate = result.start_time;
            const endDate = result.end_time;
            const description = `${startDate.slice(11, 16)} ~ ${endDate.slice(11, 16)} (${time})`;
            // フェス開催中
            if (splaSchedule.results[0].is_fest) {
                const embed = new EmbedBuilder()
                    .setColor("eaff3d")
                    .setAuthor({
                        name: "フェスマッチ",
                        iconURL: "https://i.imgur.com/oIlQeGX.png",
                    })
                    .setDescription(description)
                    .setImage("https://pbs.twimg.com/media/FciqAP2aIAYZiHJ.jpg");

                return await interaction.editReply({ embeds: [embed] });
            } else {
                // フェス開催中でない
                const author = {
                    name: result.rule.name + ` (${matchInfo[match].name})`,
                    iconURL: matchInfo[match].iconconst,
                };
                const fields = [
                    {
                        name: "ステージ1",
                        value: result.stages[0].name,
                        inline: true,
                    },
                    {
                        name: "ステージ2",
                        value: result.stages[1].name,
                        inline: true,
                    },
                ];
                const img = stageGifs[result.stages[0].id][result.stages[1].id];
                const embed = new EmbedBuilder()
                    .setColor(matchInfo[match].color)
                    .setAuthor(author)
                    .setDescription(description)
                    .setThumbnail(ruleInfo[result.rule.name].img)
                    .addFields(fields)
                    .setImage(img);

                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (time == "schedule") {
            // スケジュールを指定した場合
            const pages = [];
            splaSchedule.results.forEach((result, index) => {
                const startDate = result.start_time;
                const endDate = result.end_time;
                const description = `${startDate.slice(11, 16)} ~ ${endDate.slice(11, 16)}`;
                // フェス開催中
                if (result.is_fest) {
                    const embed = new EmbedBuilder()
                        .setColor("eaff3d")
                        .setAuthor({
                            name: "フェスマッチ",
                            iconURL: "https://i.imgur.com/oIlQeGX.png",
                        })
                        .setDescription(description)
                        .setImage("https://pbs.twimg.com/media/FciqAP2aIAYZiHJ.jpg");
                    pages.push(embed);
                } else {
                    // フェス開催中でない
                    const author = {
                        name: `${result.rule.name} (${matchInfo[match].name})`,
                        iconURL: matchInfo[match].icon,
                    };
                    const fields = [
                        {
                            name: "ステージ1",
                            value: result.stages[0].name,
                            inline: true,
                        },
                        {
                            name: "ステージ2",
                            value: result.stages[1].name,
                            inline: true,
                        },
                    ];
                    const img = stageGifs[result.stages[0].id][result.stages[1].id];
                    const footer = {
                        text: `Page ${index + 1}/${splaSchedule.results.length}`,
                    };
                    const embed = new EmbedBuilder()
                        .setColor(matchInfo[match].color)
                        .setAuthor(author)
                        .setDescription(description)
                        .setThumbnail(ruleInfo[result.rule.name].img)
                        .addFields(fields)
                        .setImage(img)
                        .setFooter(footer);
                    pages.push(embed);
                }
            });

            return buttonPages(interaction, pages);
        } else {
            const embed = new EmbedBuilder().setTitle("Error");
            return await interaction.editReply({ embeds: [embed] });
        }
    },
};
