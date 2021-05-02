const fs = require("fs")
const async = require("async")
const config = require("./config.js") 
const XRegExp = require("xregexp")

module.exports = file => {

    const processFileData = ( file, data, callback ) => {
        const mudlibFileName = file.slice(config.mudlib.length)
        let localFileName = mudlibFileName.slice( mudlibFileName.lastIndexOf("/") + 1 ).slice(0, -2)
        const lines = data.split("\n")
        let lineNumber = 0
        

        while(lineNumber < lines.length) {
            
            let tagNumber = 0
            
            while(tagNumber < config.tags.length ) {
                const tag = config.tags[tagNumber]
                const regexp = new RegExp( tag.expression )
                const result = regexp.exec( lines[lineNumber] )

                // No matches
                if( result !== null ) {
                
                    let out = "" 

                    if( tag.expression.startsWith("^") ) { // we have a single-line start to an annotation block
                        if( result.length > 1 ) { // we had capture groups, therefore it's a function name
                            const functionName = `${result.slice(1).join(" ").trim()}`
                            localFileName = functionName

                            out += `Described in ${mudlibFileName} at line ${lineNumber}\n`

                            // let's find the prototype
                            const regexString = `^[\\w\\s]*\\s*${functionName}\\s*\\(.*\\)$`
                            const funcRegex = new RegExp( regexString, "m" )
                            const regexResults = funcRegex.exec( data )

                            if( regexResults !== null ) {
                                out += `Prototype: ${regexResults[0]}`
                            }
                        }
                        lineNumber++ // go to the next line after the tag
                        while( lines[lineNumber].startsWith("//")) {
                            out += lines[lineNumber].slice(2).trim() + "\n" 
                            lineNumber++
                        }
                    }

                    if(out.length) {
                        console.log(`:: Writing to ${config.mudlib}${config.documents}/${tag.directory}/${localFileName} ::`)
                        console.log(out)
                    }
                }

                tagNumber++ 
            }

            lineNumber ++ 
        }
        callback( null )
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
        // else console.log( res )
    })

}
