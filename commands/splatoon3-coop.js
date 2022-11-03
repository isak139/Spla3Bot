const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
//const buttonPages = require("../functions/pagination");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("coop").setDescription("Answer Splatoon3 coop information"),

    run: async ({ interaction }) => {
        const coopInfo = await (await fetch("https://spla3.yuu26.com/api/coop-grouping-regular/now")).json();
        const coopImgs = JSON.parse(fs.readFileSync("././resources/splatoon3-coopImgs.json", "utf8")).coopImgs;

        const startDate = coopInfo.results[0].start_time;
        const endDate = coopInfo.results[0].end_time;
        const weapons = coopInfo.results[0].weapons;

        const description = `${startDate.slice(5, 7)}/${startDate.slice(8, 10)} ${startDate.slice(11, 13)}:00 ~ ${endDate.slice(5, 7)}/${endDate.slice(8, 10)} ${endDate.slice(11, 13)}:00`;

        const img = coopImgs[coopInfo.results[0].stage.id];

        const fields = [
            {
                name: "ブキ",
                value: `${weapons[0].name}\n${weapons[1].name}\n${weapons[2].name}\n${weapons[3].name}`,
                inline: true,
            },
            {
                name: "ステージ",
                value: coopInfo.results[0].stage.name,
                inline: true,
            },
        ];
        const embed = new EmbedBuilder()
            .setColor("#FFAA00")
            .setAuthor({
                name: "サーモンラン",
                iconURL: "https://i.imgur.com/QthCIvF.png",
            })
            .setDescription(description)
            .addFields(fields)
            .setImage(img);
        return await interaction.editReply({ embeds: [embed] });
    },
};
