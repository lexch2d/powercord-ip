const { Plugin } = require("powercord/entities")
const { getModule , channels } = require("powercord/webpack")
const { get } = require("powercord/http")
const { createBotMessage } = getModule([ "createBotMessage" ], false)
const { receiveMessage }   = getModule([ "receiveMessage" ], false)

module.exports = class IP extends Plugin {
    constructor() {
        super()
    }
    
    async sendBotMessage(content, title, footer, author, url, footerURL ) {
        const received = createBotMessage(channels.getChannelId())
        received.author.username = "IP"

        console.log(received)
        received.embeds.push({
            color: 0x0099ff,
            title: title,
            url: url,
            author: {
                name: author,
            },
            description: content,
            // timestamp: ts,
            footer: {
                text: footer,
                icon_url: footerURL,
            },
        })
        return receiveMessage(received.channel_id, received)
    }

    async startPlugin() {
        const { sendBotMessage } = this

        powercord.api.commands.registerCommand({
            command: "ip",
            description: "reverse ip location command",
            usage: "{c}",
            executor: async (args) => { // i feel like theres a issue i just don't know it yet
                if (args.length != 1) {
                    sendBotMessage(".ip 123.123.123.123", "example:")
                    return
                }
                const [ ip ] = args

                if ((ip) && (ip.match(/[\d+\.]+/))) {
                    get(`https://ipinfo.io/${ip}/geo`).then(async response => {
                        const { body } = response
                        if ((body) && (!body.bogon)) {
                            sendBotMessage(`${body.ip} is located in ${body.country}, state of ${body.region}, city of ${body.city}`, "found:", `(${body.loc.replace(",",", ")})`)
                        } else {
                            sendBotMessage("couldn't find information")
                        }
                    })
        
                }


            }
        })
    }
    
    pluginWillUnload() {
        powercord.api.commands.unregisterCommand("ip")
        
    }
}