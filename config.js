const chalk = require("chalk")
const fs = require("fs")

global.ownerNumber = ["6285823360959@s.whatsapp.net"]
global.nomerOwner = "6285823360959"
global.nomorOwner = ['6285823360959']
global.namaDeveloper = "A TEAM DVloper | Mr Blaxe"
global.namaBot = "[DDS] Diam² mematikan"
global.packname = ""
global.author = "By Mr Blaxe | "
global.thumb = fs.readFileSync("./thumb.jpg")

let file = require.resolve(__filename) 
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})

/*

Thanks To By ADITYA STORE JB
Di Tulis Dan Di Fix Oleh ADITYA STORE JB
Ubah Nomor Owner?
Ganti Di File ./owner.json

*/