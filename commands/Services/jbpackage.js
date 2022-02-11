const axios = require('axios');
const Vibrant = require('node-vibrant');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'package',
    description: 'Get the info of a jailbreak package via Canister',
    usage: 'canister [query]',
    cooldown: 2,
    aliases: ['tweak', 'tweakinfo', 'packageinfo', 'package'],
    async execute(client, message, args) {
        const wait = await message.channel.send('Please wait...');
        if (!args[0]) {message.reply('Please provide a query!');}
        else {
            const input = '' + args;
            const query = input.split(' ').join('%20');
            const info = await axios.get('https://api.canister.me/v1/community/packages/search?query=' + query + '&searchFields=identifier,name,author,maintainer&responseFields=identifier,name,description,packageIcon,repository.uri,repository.name,author,latestVersion,depiction,section,price,maintainer');
            if (!info.data.data[0]) {
                wait.delete();
                message.reply('No results found!').then(x => {
                    setTimeout(() => {
                        message.delete();
                        x.delete();
                    }, 4000);
                });
            } else {
                try {
                    let color = null
                    try {
                        const icon = info.data.data[0].packageIcon;
                        if (info.data.data[0].packageIcon.startsWith('http:') || info.data.data[0].packageIcon.startsWith('https:')) {
                            color = await Vibrant.from(info.data.data[0].packageIcon || 'https://repo.packix.com/api/Packages/60bfb71987ca62001c6585e6/icon/download?size=medium&hash=2').getPalette()
                            color = color.Vibrant.hex
                        } else {
                            color = '#fccc04'
                            info.data.data[0].packageIcon = undefined
                        }
                    } catch {
                        color = '#fccc04'
                        info.data.data[0].packageIcon = undefined
                    }
                    const embed = new MessageEmbed()
                        .setTitle(info.data.data[0].name || 'what')
                        .setDescription(info.data.data[0].description || 'No description provided.')
                        .setThumbnail(info.data.data[0].packageIcon || 'https://repo.packix.com/api/Packages/60bfb71987ca62001c6585e6/icon/download?size=medium&hash=2')
                        .setColor(color || '#fccc04')
                        .addFields(
                            { name: 'Author', value: info.data.data[0].author.toString() || 'Unknown', inline: true },
                            { name: 'Version', value: info.data.data[0].latestVersion.toString() || 'Unknown', inline: true },
                            { name: 'Price', value: info.data.data[0].price.toString() || 'Unknown', inline: true },
                            { name: 'Bundle ID', value: info.data.data[0].identifier.toString(), inline: true },
                            { name: 'Repository', value: '[' + info.data.data[0].repository.name + ']' + '(' + info.data.data[0].repository.uri + ')', inline: true },
                        )
                        .setFooter('Powered by Canister')
                        .setTimestamp()
                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setStyle('LINK')
                                .setURL(info.data.data[0].depiction || 'https://404.github.io/')
                                .setEmoji('🔍')
                                .setLabel('View Depiction'),
                            new MessageButton()
                                .setEmoji('931391570320715887')
                                .setStyle('LINK')
                                .setURL(`https://sharerepo.stkc.win/v2/?pkgman=cydia&repo=${info.data.data[0].repository.uri}`)
                                .setLabel('Add Repo To Cydia'),
                            new MessageButton()
                                .setStyle('LINK')
                                .setURL('https://sharerepo.stkc.win/v2/?pkgman=sileo&repo=' + info.data.data[0].repository.uri)
                                .setEmoji('931390952411660358')
                                .setLabel('Add Repo To Sileo'),
                            new MessageButton()
                                .setEmoji('931391570639478834')
                                .setStyle('LINK')
                                .setURL(`https://sharerepo.stkc.win/v2/?pkgman=zebra&repo=${info.data.data[0].repository.uri}`)
                                .setLabel('Add Repo To Zebra'),
                            new MessageButton()
                                .setEmoji('931391570404573235')
                                .setStyle('LINK')
                                .setURL(`https://sharerepo.stkc.win/v2/?pkgman=installer&repo=${info.data.data[0].repository.uri}`)
                                .setLabel('Add Repo To Installer')
                        );
                    wait.delete();
                    message.reply({ embeds: [embed], components:[row] , allowedMentions: { repliedUser: false } });
                } catch(error) {
                    console.log(error)
                    wait.delete();
                    message.reply('An error occurred!').then(x => {
                        setTimeout(() => {
                            message.delete();
                            x.delete();
                        },4000);
                    }); 
                }
            }
        }
    },
};