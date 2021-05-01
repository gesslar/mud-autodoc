"use strict"

const fs = require("fs")
const config = require("./config.js") 
const { dirname } = require("path")
const configObj = require("./config.js")
const processFile = require("./process_file")

// Config information
const baseDirectory = config.mudlib 
const autodocDirectory = baseDirectory + config.documents 

// Runtime information
const directoryStack = [ `${baseDirectory}/` ]
const files_to_process = [] 

const run = () => {

    while( directoryStack.length > 0 ) {
        const dirPath = directoryStack.shift()

        // console.log( dirPath )
        // Discover sub-directories in the current directory and add them to the stack
        fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(dir => dir.isDirectory())
            .map( dir => `${dirPath}${dir.name}/`)
            .filter( dir => config.filters.termRegex.exec( dir ) === null )
            .filter( dir => config.filters.paths.indexOf(dir ) === -1 )
            .forEach( dir => directoryStack.push( dir ) )

        // Now find all the source files in the current and process them
        fs.readdirSync(dirPath, { withFileTypes: true })
            .filter( file => file.isFile() )
            .filter( file => config.filters.termRegex.exec( file.name ) === null )
            .filter( file => file.name.endsWith(".c"))
            .map( file => `${dirPath}${file.name}` )
            .forEach( file => processFile(file) )
    }

}

// Start the scan
run()
