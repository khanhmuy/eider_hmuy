const ytdl = require('ytdl-core');
const axios = require('axios');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'videoinfo',
    description: 'Get the information of a youtube video',
    usage: 'videoinfo [video_id] or [url]',
    cooldown: 2,
    aliases: ['videoinfo', 'ytvidinfo', 'vidinfo'],
    async execute(client, message, args) {
        if (!args[0]) {
            message.reply('Please provide a video id or link!');
        } else {
            let embed = '';
            let id = ';'
            if (args[0].match(/https:\/\/www.youtube.com\/watch\?v=./)) {
                id = args[0].slice(32, 43);
            } if (args[0].match(/https:\/\/youtu.be\/./)) {
                id = args[0].slice('https://youtu.be/'.length);
            } if (!args[0].match(/https:\/\/www.youtube.com\/watch\?v=./) && !args[0].match(/https:\/\/youtu.be\/./)) {
                id = args[0];
            }
            const wait = await message.channel.send('Getting video info...');
            try {
                const info = await ytdl.getInfo(id);
                const minutes = Math.floor(info.videoDetails.lengthSeconds / 60);
                let seconds = '';
                let rawSeconds = info.videoDetails.lengthSeconds - minutes * 60;
                if (rawSeconds < 10) {
                    seconds = '0' + rawSeconds;
                } else {seconds = rawSeconds};
                const duration = `${minutes}:${seconds}`;
                const dislike = await axios.get('https://returnyoutubedislikeapi.com/votes?videoId=' + id);
                const dislikeCount = dislike.data.dislikes
                const likeCount = info.videoDetails.likes;
                const views = info.videoDetails.viewCount;
                const title = info.videoDetails.title;
                const channel = info.videoDetails.ownerChannelName;
                const channelUrl = info.videoDetails.author.channel_url;
                const subs = info.videoDetails.author.subscriber_count;
                const uploadDate = info.videoDetails.publishDate;
                const thumbnail = info.videoDetails.thumbnails[3].url;
                const link = 'https://www.youtube.com/watch?v=' + id;
                const rawDescription = info.videoDetails.description;
                let description = '';
                var descriptionLength = rawDescription.length;
                if (descriptionLength > 995) {
                    description = rawDescription.slice(0, 995) + ' (...)';
                } else {
                    description = rawDescription;
                }
                embed = new MessageEmbed()
                    .setTitle('' + title)
                    .setColor('#FF0000')
                    .setURL(link)
                    .setThumbnail(thumbnail)
                    .setTimestamp()
                    .addFields(
                        { name: 'Date created: ', value: "" + uploadDate, inline: true },
                        { name: 'Duration:', value: '' + duration, inline: true },
                        { name: 'Category:', value: '' + info.videoDetails.category, inline: true },
                        { name: '👀', value: "" + views, inline: true },
                        { name: '👍', value: "" + likeCount, inline: true },
                        { name: '👎', value: "" + dislikeCount, inline: true },
                        { name: 'Description:', value: '' + description},
                        { name: 'Channel: ', value: "" + '[' + channel + '](' + channelUrl + ')', inline: true },
                        { name: 'Subscribers: ', value: "" + subs , inline: true },
                        { name: 'Video link: ', value: '' + link },
                    )
                    .setFooter('Requested by ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    wait.delete();
                    message.reply({ embeds: [embed] });
            }
            catch (error) {
                console.log(error);
                wait.delete();
                message.reply('An error occurred! Please double check your video id or link!')
            }
            
        }
    },
};