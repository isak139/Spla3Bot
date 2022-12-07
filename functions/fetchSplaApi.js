const getSchedule = async (url, interaction) => {
    try {
        const res = await fetch(url);
        if (res.ok) {
            return await res.json();
        } else {
            const embed = {
                color: 0xff0000,
                description: "Error: Could not fetch data",
            };
            await interaction.editReply({ embeds: [embed] });
            return;
        }
    } catch (e) {
        console.log(e);
        const embed = {
            color: 0xff0000,
            description: "Error: Some error occurred",
        };
        await interaction.editReply({ embeds: [embed] });
        return;
    }
};

module.exports = getSchedule;
