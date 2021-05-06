const fs = require("fs")
const path = require("path")

const configObj = JSON.parse( fs.readFileSync(path.join(__dirname, "config.json") ) )

configObj.filters.paths = configObj.filters.paths.map( elem => {
    return `${configObj.mudlib}${elem}`
}) 

configObj.filters.termRegex = new RegExp(configObj.filters.terms.join("|"))

module.exports = configObj
