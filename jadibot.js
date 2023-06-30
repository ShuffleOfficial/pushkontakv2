const { modul } = require("./module");
const { baileys, boom, chalk, fs, FileType, path, process, PhoneNumber } = modul;
const { Boom } = boom
const { default: makeWaSocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, generateWAMessage, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = baileys
const color = (text, color) => { return !color ? chalk.green(text) : chalk.keyword(color)(text) }
const log = (pino = require("pino"));
const qrcode = require("qrcode");
const { smsg } = require('./myfunc')
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

if (global.conns instanceof Array) console.log()
else global.conns = []

const jadibot = async (client, msg, from) => {
const { sendImage, sendMessage } = client;
const { reply, sender } = msg;
const { state } = useSingleFileAuthState(`./data/${from}.json`)

const connectToWhatsApp = () => {
const client = makeWaSocket({ logger: pino ({ level: 'silent' }), printQRInTerminal: true, auth: state, browser: ["SC Simple By Ziro-MD", "Dekstop", "3.0"]})
console.log(color('[ SC BY ZiroMD ]\n', 'red'),color('\nInfo Script :\n➸ Baileys : Multi Device\n➸ Nama Script : Ziro-MD\n➸ Creator : ZIRO\n\nFollow My Social Media Account All Yes :\n➸ My Youtube : Ziro-MD OFFICIAL`\n➸ My Instagram : @ziro_md\n\nDonase Me For Support :\n➸ DONASI : https://saweria.co/ZiroMD\n\nThanks\n', 'red'))

store.bind(client.ev)

client.ev.on('messages.upsert', async chatUpdate => {
try {
m = chatUpdate.messages[0]
if (!m.message) return
m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
if (!client.public && !m.key.fromMe && chatUpdate.type === 'notify') return
if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
msg = smsg(client, m, store)
require('./kw')(client, msg, chatUpdate, store)
} catch (err) {
console.log(err)}})

client.ev.on("connection.update", async up => {
const { lastDisconnect, connection } = up;
if (connection == "connecting") return
if (connection){
if (connection != "connecting") console.log("Connecting to jadibot..")
}
console.log(up)
if (up.qr) await sendImage(from, await qrcode.toDataURL(up.qr,{scale : 8}), 'Scan QR ini untuk jadi bot sementara\n\n1. Klik titik tiga di pojok kanan atas\n2. Ketuk WhatsApp Web\n3. Scan QR ini \nQR Expired dalam 30 detik', m)
console.log(connection)
if (connection == "open") {
client.id = client.decodeJid(client.user.id)
client.time = Date.now()
global.conns.push(client)
user = `${client.decodeJid(client.user.id)}`
txt = `*Terdeteksi User Jadibot*\n\n _× User : @${user.split("@")[0]}_`
sendMessage(`6281228070013@s.whatsapp.net`,{text: txt, mentions : [user]})
}
if (connection === 'close') {
lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? connectToWhatsApp() : ''
}
})

client.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

client.ev.on('contacts.update', update => {
for (let contact of update) {
let id = client.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

client.getName = (jid, withoutContact  = false) => {
id = client.decodeJid(jid)
withoutContact = client.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = client.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === client.decodeJid(client.user.id) ?
client.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

client.public = true

client.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

client.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

const { getImg } = require('./functions')

client.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await client.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

client.sendButMessage = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
client.sendMessage(jid, buttonMessage, { quoted, ...options })
}

}
connectToWhatsApp()
}

module.exports = { jadibot, conns }

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})