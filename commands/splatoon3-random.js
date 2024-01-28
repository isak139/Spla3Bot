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
        .addSubcommand((subcommand) => subcommand.setName("weapon").setDescription("Answer information about weapons at random"))
        .addSubcommand((subcommand) => subcommand.setName("weapon-vc").setDescription("Answer information about weapons at random (Voice Channel)"))
        .addSubcommand((subcommand) => subcommand.setName("weapon-private").setDescription("Answer information about weapons at random (alpha, bravo)"))
        .addSubcommand((subcommand) => subcommand.setName("stage").setDescription("Answer information about stages at random"))
        .addSubcommand((subcommand) => subcommand.setName("rule").setDescription("Answer information about rules at random"))
        .addSubcommand((subcommand) => subcommand.setName("title").setDescription("Answer information about titles at random")),

    run: async ({ interaction }) => {
        if (interaction.options.getSubcommand() == "weapon") {
            const weapon = Object.entries(weaponInfo)[Math.floor(Math.random() * Object.entries(weaponInfo).length)];
            const embed = {
                color: 0xfee75c,
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
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() == "weapon-vc") {
            // 使用者がVCにいない場合はエラー
            if (!interaction.member.voice.channel) {
                return await interaction.reply({ content: "このコマンドを使うにはVCに入ってください.", ephemeral: true });
            }
            // vc情報を取得
            const vcInfo = interaction.member.voice.channel;
            // vcメンバーの名前を取得
            const vcMembers = vcInfo.members.map((member) => member);
            //ブキのリスト
            const weapons = Object.entries(weaponInfo);
            //ブキガチャの結果のリスト
            const results = [...Array(vcMembers.length)].map(() => weapons[Math.floor(Math.random() * weapons.length)]);
            // ブキをランダムに選択し，個人宛メッセージとして投稿
            for (let i = 0; i < vcMembers.length; i++) {
                const weapon = results[i];
                const indivisualEmbed = {
                    color: 0xfee75c,
                    author: {
                        name: "ランダムブキ VC",
                        icon_url: "https://i.imgur.com/LjHn7tr.png",
                    },
                    title: "あなたのブキ",
                    description: weapon[0],
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
                // 個人宛にダイレクトメッセージ
                vcMembers[i].user.send({ embeds: [indivisualEmbed] });
            }
            // 全体向けに投稿
            const description = results.map((result, index) => `${vcMembers[index].user.toString()}のブキ：${result[0]}`).join("\n");
            const embed = {
                color: 0xfee75c,
                author: {
                    name: "ランダムブキ VC",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                description: description,
            };
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() == "weapon-private") {
            // 使用者がVCにいない場合はエラー
            if (!interaction.member.voice.channel) {
                return await interaction.reply({ content: "このコマンドを使うにはVCに入ってください.", ephemeral: true });
            }
            // alphaの正規表現
            const alphaRegex = new RegExp(/(アルフ|alpha|あるふ|α)/);
            // bravoの正規表現
            const bravoRegex = new RegExp(/(ブラボ|bravo|ぶらぼ|β|ベータ|べーた)/);
            // alphaチームのチャンネル
            const alphaChannel = interaction.guild.channels.cache.find((channel) => alphaRegex.test(channel.name));
            // bravoチームのチャンネル
            const bravoChannel = interaction.guild.channels.cache.find((channel) => bravoRegex.test(channel.name));
            // チャンネルが見つからない場合はエラー
            if (!alphaChannel || !bravoChannel) {
                return await interaction.reply({ content: "αまたはβチームのVCが見つかりませんでした.", ephemeral: true });
            }
            // vc情報を取得
            const alphaVCMembers = alphaChannel.members.map((member) => member);
            const bravoVCMembers = bravoChannel.members.map((member) => member);
            // メンバーが居ないときはメッセージ alpha
            if (alphaVCMembers.length == 0) {
                return await interaction.reply({ content: "アルファチームのVCにメンバーが居ません.", ephemeral: true });
            }
            // メンバーが居ないときはメッセージ bravo
            if (bravoVCMembers.length == 0) {
                return await interaction.reply({ content: "ブラボーチームのVCにメンバーが居ません.", ephemeral: true });
            }
            //ブキのリスト
            const weapons = Object.entries(weaponInfo);
            //ブキガチャの結果のリスト alpha
            const alphaResults = [...Array(alphaVCMembers.length)].map(() => weapons[Math.floor(Math.random() * weapons.length)]);
            //ブキガチャの結果のリスト bravo
            const bravoResults = [...Array(bravoVCMembers.length)].map(() => weapons[Math.floor(Math.random() * weapons.length)]);
            // ブキをランダムに選択し，個人宛メッセージとして投稿 alpha
            for (let i = 0; i < alphaVCMembers.length; i++) {
                const weapon = alphaResults[i];
                const indivisualEmbed = {
                    color: 0xfee75c,
                    author: {
                        name: "ランダムブキ VC",
                        icon_url: "https://i.imgur.com/LjHn7tr.png",
                    },
                    title: "あなたのブキ",
                    description: weapon[0],
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
                // 個人宛にダイレクトメッセージ
                alphaVCMembers[i].user.send({ embeds: [indivisualEmbed] });
            }
            // ブキをランダムに選択し，個人宛メッセージとして投稿 bravo
            for (let i = 0; i < bravoVCMembers.length; i++) {
                const weapon = bravoResults[i];
                const indivisualEmbed = {
                    color: 0xfee75c,
                    author: {
                        name: "ランダムブキ VC",
                        icon_url: "https://i.imgur.com/LjHn7tr.png",
                    },
                    title: "あなたのブキ",
                    description: weapon[0],
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
                // 個人宛にダイレクトメッセージ
                bravoVCMembers[i].user.send({ embeds: [indivisualEmbed] });
            }
            // 全体向けに投稿 alpha
            const alphaDescription = alphaResults.map((result, index) => `${alphaVCMembers[index].user.toString()}のブキ：${result[0]}`).join("\n");
            const alphaEmbed = {
                color: 0xfee75c,
                author: {
                    name: "アルファチーム",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                description: alphaDescription,
            };
            await interaction.reply({ embeds: [alphaEmbed] });
            // 全体向けに投稿 bravo
            const bravoDescription = bravoResults.map((result, index) => `${bravoVCMembers[index].user.toString()}のブキ：${result[0]}`).join("\n");
            const bravoEmbed = {
                color: 0xfee75c,
                author: {
                    name: "ブラボーチーム",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                description: bravoDescription,
            };
            return await interaction.followUp({ embeds: [bravoEmbed] });
        } else if (interaction.options.getSubcommand() == "stage") {
            const stage = Object.entries(stageInfo)[Math.floor(Math.random() * Object.entries(stageInfo).length)];
            const embed = {
                color: 0xfee75c,
                author: {
                    name: "ランダムステージ",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                title: stage[0],
                image: { url: stage[1].image },
            };
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() == "rule") {
            const rule = Object.entries(ruleInfo)[Math.floor(Math.random() * Object.entries(ruleInfo).length)];
            const embed = {
                color: 0xfee75c,
                author: {
                    name: "ランダムルール",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                title: rule[0],
                image: { url: rule[1].image },
            };
            return interaction.reply({ embeds: [embed] });
        } else if (interaction.options.getSubcommand() == "title") {
            const first = titleInfo.first[Math.floor(Math.random() * titleInfo.first.length)];
            const second = titleInfo.second[Math.floor(Math.random() * titleInfo.second.length)];
            const embed = {
                color: 0xfee75c,
                author: {
                    name: "ランダム二つ名",
                    icon_url: "https://i.imgur.com/LjHn7tr.png",
                },
                title: `\`${first}\` \`${second}\``,
            };
            return interaction.reply({ embeds: [embed] });
        } else {
            const embed = { title: "Error" };
            return await interaction.reply({ embeds: [embed] });
        }
    },
};
