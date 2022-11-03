const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require("discord.js");

async function buttonPages(interaction, pages, time = 60000) {
  if (!interaction) {
    throw new Error("Please provide an interaction argument");
  }
  if (!pages) {
    throw new Error("Please provide a page argument");
  }
  if (!Array.isArray(pages)) {
    throw new Error("Pages must be an array");
  }
  if (typeof time !== "number") {
    throw new Error("Time must be a number");
  }
  if (parseInt(time) < 30000) {
    throw new Error("Time must be greater than 30 Seconds");
  }

  //await interaction.deferReply();

  if (pages.length === 1) {
    const page = await interaction.editReply({
      embeds: pages,
      components: [],
      fetchReply: true
    });

    return page;
  }

  const prev = new ButtonBuilder()
    .setCustomId("prev")
    .setEmoji("◀️")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);
  const next = new ButtonBuilder()
    .setCustomId("next")
    .setEmoji("▶️")
    .setStyle(ButtonStyle.Primary);
  const first = new ButtonBuilder()
    .setCustomId("first")
    .setEmoji("⏪")
    .setStyle(ButtonStyle.Success)
    .setDisabled(true);
  const last = new ButtonBuilder()
    .setCustomId("last")
    .setEmoji("⏩")
    .setStyle(ButtonStyle.Success);

  const buttonRow = new ActionRowBuilder().addComponents(
    first,
    prev,
    next,
    last
  );
  let index = 0;

  const currentPage = await interaction.editReply({
    embeds: [pages[index]],
    components: [buttonRow],
    fetchReply: true
  });

  const collector = await currentPage.createMessageComponentCollector({
    ComponentType: ComponentType.Button,
    time
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id) {
      return i.reply({
        content: "You can't use these buttons",
        ephemeral: true
      });
    }

    await i.deferUpdate();
    if (i.customId === "first") {
      index = 0;
    } else if (i.customId === "prev") {
      if (index > 0) {
        index--;
      }
    } else if (i.customId === "next") {
      if (index < pages.length - 1) {
        index++;
      }
    } else if (i.customId === "last") {
      index = pages.length - 1;
    }

    if (index === 0) {
      prev.setDisabled(true);
      first.setDisabled(true);
    } else {
      prev.setDisabled(false);
      first.setDisabled(false);
    }
    if (index === pages.length - 1) {
      next.setDisabled(true);
      last.setDisabled(true);
    } else {
      next.setDisabled(false);
      last.setDisabled(false);
    }

    await currentPage.edit({
      embeds: [pages[index]],
      components: [buttonRow]
    });

    collector.resetTimer();
  });

  collector.on("end", async () => {
    await currentPage.edit({
      embeds: [pages[index]],
      components: []
    });
  });
  return currentPage;
}

module.exports = buttonPages;
