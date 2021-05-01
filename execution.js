"use strict"

const fs = require("fs") 

module.exports = {
    last_run: () => {
        try {
            if(fs.existsSync("last_run")) {
                return parseInt( fs.readFileSync("last_run") )
            } else {
                return 0
            }
        } catch(err) {
            console.log(err) 
            return 0 
        }        
    },
    record_run: () => {

    }
}

