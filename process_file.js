const fs = require("fs")
const async = require("async")
const config = require("./config.js") 

function readFiles( files ) {
    files.forEach( file => {
        const fileData = fs.readFileSync( file, "utf8" )
        processFileData( file, fileData, writeFile )
    })
}

function writeFile( file, data, options ) {
    assurePathExists(file)

    fs.writeFileSync(file, data, options) ;
}

function processFileData ( file, data, writeFileCallback ) {
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
            
                let header = ""
                let doc = "" 
                let footer = ""
                let prototype = ""
                let options = { flag: "w" }
                let startLineNumber = lineNumber + 1

                if(tag.includeLineNumber === true) {
                    doc += `File: ${mudlibFileName} - Line: ${startLineNumber}\n`
                }

                if( tag.type === "function" && result.length > 1 ) {
                    const functionName = `${result.slice(1).join(" ").trim()}`
                    localFileName = functionName
                    
                    const len = functionName.length 
                    const center = 40 - Math.ceil(len / 2)
                    const left = center - 2
                    const right = 80 - left - 4 - len 

                    header = `${":".repeat(left)}  ${functionName}  ${":".repeat(right)}\n\n`
                    footer = `\n(Described in ${mudlibFileName} at line ${lineNumber + 1})\n`

                    // let's find the prototype
                    const regexString = `^[\\w\\s]*\\s*${functionName}\\s*\\(.*\\)$`
                    const funcRegex = new RegExp( regexString, "m" )
                    const regexResults = funcRegex.exec( data )

                    if( regexResults !== null ) {
                        prototype = `\nPrototype: ${regexResults[0]}\n`
                    }
                } else if( tag.type === "documentation" ) {
                }

                if( tag.expression.startsWith("^") ) { // we have a single-line start to an annotation block
                    lineNumber++ // go to the next line after the tag
                    while( lines[lineNumber].startsWith("//")) {
                        doc += lines[lineNumber].slice(2).trim() + "\n" 
                        lineNumber++
                    }
                } else {
                    options = { flag: "a" }

                    doc += `${result[1]}\n` ;
                }

                doc = `${header}${prototype}${doc}${footer}`
                
                if(doc.length) {
                    const outFileName = `${config.mudlib}${config.documents}/${tag.directory}/${localFileName}`
                    writeFileCallback( outFileName, doc, options )
                } 
            }

            tagNumber++ 
        }

        lineNumber ++ 
    }
}

function assurePathExists( file ) {
    const dir = file.slice(0, file.lastIndexOf("/") )

    if( fs.existsSync( dir ) ) {
        const stat = fs.statSync( dir ) 
        if( stat.isFile() ) throw `${dir} already exists, but is a file`
        
        return true 
    }
    
    if( fs.mkdirSync( dir, { recursive: true } ) === undefined ) throw `Error recursively creating directory ${dir}`

    return true 
}

module.exports = readFiles
