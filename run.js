const path = require("path")

const config = require(path.join(__dirname, "config"))
const autodoc = require(path.join(__dirname, "autodoc"))

console.log(`Scanning mudlib ${config.mudlib }...`)
autodoc()
console.log(`Scan complete. Documentation files have been written.`)
