const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'messageDelete',
    async execute (client, message) {
        const logChannel = client.channels.cache.get(client.data.get(`guild.${message.guild.id}.logChannel`));
        try {
            const logChannel = client.channels.cache.get(client.data.get(`guild.${message.guild.id}.logChannel`));
            if (logChannel === undefined) return;
            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: 'MESSAGE_DELETE',
            });
            const deletionLog = fetchedLogs.entries.first();
            const { executor, target } = deletionLog;
            let deleteEmbed = new MessageEmbed()
                .setAuthor(message.author.username + '#' + message.author.discriminator, `${message.author.displayAvatarURL({ dynamic: true })}?size=1024`)
                .setDescription(`:wastebasket: Message deleted in <#${message.channelId}>`)
                .setColor("RED")
                .addField("Message", `${message.content}`)
                .addField(`Message ID`, `${message.id}`, true)
                .addField(`Author`, `<@!${message.author.id}>`, true)
                .addField(`Author ID`, `${message.author.id}`, true)
                .addField(`Deleted by (not 100% accurate)`, `<@!${executor.id}>`, true)
                .setFooter(`${message.guild.name}`)
                .setTimestamp();
            logChannel.send({content: '----------Start of log----------',embeds: [deleteEmbed]});
        } catch (err) {
            try {
                if (message.reactions.message.embeds.type = 'rich') {
                    logChannel.send({content:`----------Start of log----------\n:wastebasket: Embed deleted in <#${message.channelId}>\nMessage ID: ${message.id}\nAuthor: <@!${message.author.id}>\nAuthor ID: ${message.author.id}\nEmbeds:\n`, embeds: message.reactions.message.embeds});
                };
            } catch (err) {
                console.log(err);
            }
            console.log(err);
        }
    },
};
