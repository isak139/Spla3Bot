const getSchedule = async (url, interaction) => {
    try {
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok && "results" in json) {
            if (json.results.length > 0) {
                return json;
            }
        }
        const embed = {
            color: 0xff0000,
            description: "Error: Could not fetch data",
        };
        await interaction.reply({ embeds: [embed] });
        return;
    } catch (e) {
        console.log(e);
        const embed = {
            color: 0xff0000,
            description: "Error: Some error occurred",
        };
        await interaction.reply({ embeds: [embed] });
        return;
    }
};

module.exports = getSchedule;
