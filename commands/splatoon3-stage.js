const { SlashCommandBuilder } = require("@discordjs/builders");
//const { EmbedBuilder } = require("discord.js");
const buttonPages = require("../functions/pagination");
const fs = require("fs");

const splaApi = "https://spla3.yuu26.com/api/";

const stageImages = JSON.parse(fs.readFileSync("././resources/splatoon3-stageImages.json", "utf8")).stageImages;

const matchInfo = {
    regular: {
        name: "レギュラー",
        icon: "https://i.imgur.com/sHXeNci.png",
        color: 0x899a37,
    },
    "bankara-challenge": {
        name: "チャレンジ",
        icon: "https://i.imgur.com/UO6hEB6.png",
        color: 0x835439,
    },
    "bankara-open": {
        name: "オープン",
        icon: "https://i.imgur.com/UO6hEB6.png",
        color: 0x835439,
    },
    league: {
        name: "リーグ",
        icon: "https://i.imgur.com/oiIZSXG.png",
        color: 0xc76080,
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

const fesImage = "https://i.imgur.com/dwnSeCC.jpg";

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
        const match = interaction.options.getString("match", true);
        const time = interaction.options.getString("time", true);

        // データを取得
        let splaSchedule;
        try {
            splaSchedule = await (await fetch(`${splaApi}${match}/${time}`)).json();
        } catch (e) {
            console.log(e);
            return interaction.reply({ content: "Error: Could not fetch data", ephemeral: true });
        }

        if (time == "now" || time == "next") {
            const result = splaSchedule.results[0];
            const startDate = result.start_time;
            const endDate = result.end_time;
            const description = `${startDate.slice(11, 16)} ~ ${endDate.slice(11, 16)} (${time})`;
            // フェス開催中
            if (result.is_fest) {
                const embed = {
                    color: 0xeaff3d,
                    author: {
                        name: "フェスマッチ",
                        icon_url: "https://i.imgur.com/kkg0f8w.png",
                    },
                    description: description,
                    image: { url: fesImage },
                };
                return await interaction.editReply({ embeds: [embed] });
            } else {
                // フェス開催中でない
                const embed = {
                    color: matchInfo[match].color,
                    author: { name: result.rule.name + ` (${matchInfo[match].name})`, icon_url: matchInfo[match].icon },
                    description: description,
                    thumbnail: { url: ruleInfo[result.rule.name].img },
                    fields: [
                        { name: "ステージ1", value: result.stages[0].name, inline: true },
                        { name: "ステージ2", value: result.stages[1].name, inline: true },
                    ],
                    image: { url: stageImages[result.stages[0].id][result.stages[1].id] },
                };
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
                    const embed = {
                        color: 0xeaff3d,
                        author: {
                            name: "フェスマッチ",
                            icon_url: "https://i.imgur.com/kkg0f8w.png",
                        },
                        description: description,
                        image: { url: fesImage },
                    };
                    pages.push(embed);
                } else {
                    // フェス開催中でない
                    const embed = {
                        color: matchInfo[match].color,
                        author: { name: `${result.rule.name} (${matchInfo[match].name})`, icon_url: matchInfo[match].icon },
                        description: description,
                        thumbnail: { url: ruleInfo[result.rule.name].img },
                        fields: [
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
            return await interaction.editReply({ embeds: [embed] });
        }
    },
};
