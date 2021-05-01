const fs = require("fs")
const async = require("async")
const config = require("./config.js") 

module.exports = file => {

    const processFileData = ( file, data, callback ) => {
        const lines = data.split("\n")
        let line = 0

        while(line++ < lines.length) {
            config.tags.forEach( tag => {
                const regexp = new RegExp( tag[0] )
                if( regexp.exec( lines[line] ) !== null ) {
                    console.log(`${file} - ${tag[1]} - ${lines[line]}`)
                }
            })
        }
        // callback( "We done with " + file )
    }

    const queue = async.queue ( ( task, callback ) => {
        try {
            const data = fs.readFileSync( task.file, "utf8" )
            processFileData( task.file, data, callback )
        } catch( err ) {
            callback( err )
        }
    }, 4 )

    queue.push( { file: file }, ( err, res ) => {
        if(err) console.error( err )
        else console.log( res )
    })

}
