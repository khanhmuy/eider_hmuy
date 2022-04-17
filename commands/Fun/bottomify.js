const {encode, decode} = require('bottomify');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'bottomify',
    description: 'Bottomify some text',
    cooldown: 2,
    usage: 'bottomify <text>',
    aliases: [ 'bottomify', 'bottomifytext', 'bottomifytext', 'bottom' ],
    execute(client, message, args) {
        try {
            if (!args[0]) {
                return message.channel.send('You need to provide some text to bottomify!').then(x => {
                    setTimeout(() => {
                        message.delete();
                        x.delete();
                    }, 3000)
                });
            } else {
                const text = encode(args.join(' '));
                const embed = new MessageEmbed()
                    .setAuthor(message.author.username, `${message.author.displayAvatarURL({ dynamic: true })}?size=1024`)
                    .setColor('BLUE')
                    .setDescription(text);
                message.delete();
                message.channel.send({embeds: [embed]});
            }
        } catch (error) {
            console.log(error);
            message.reply('There was an error trying to execute that command!');
        }
    },
};