"use strict"

const fs = require("fs")
const path = require("path")

const config = require(path.join(__dirname, "config"))
const processFiles = require(path.join(__dirname, "process_file"))
const removeDir = require(path.join(__dirname, "remove_dir"))

const autodoc = () => {

    // Config information
    const baseDirectory = config.mudlib 
    const autodocDirectory = path.join(baseDirectory, config.documents)
   
    // autodoctime information
    const directoryStack = []

    // First recursively remove the autodoc directories
    removeDir(autodocDirectory)

    // Reset the directory stack to work with discovery of mudlib directories
    directoryStack.splice(0, directoryStack.length)
    directoryStack.push( `${baseDirectory}/`)

    while( directoryStack.length > 0 ) {
        const dirPath = directoryStack.shift()

        // Discover sub-directories in the current directory and add them to the stack
        fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(dir => dir.isDirectory())
            .map( dir => `${dirPath}${dir.name}/`)
            .filter( dir => config.filters.termRegex.exec( dir ) === null )
            .filter( dir => config.filters.paths.indexOf(dir ) === -1 )
            .forEach( dir => directoryStack.push( dir ) )

        // Now find all the source files in the current and process them
        const files = fs.readdirSync(dirPath, { withFileTypes: true })
            .filter( file => file.isFile() )
            .filter( file => config.filters.termRegex.exec( file.name ) === null )
            .filter( file => file.name.endsWith(".c"))
            .map( file => `${dirPath}${file.name}` )

        if( files.length ) processFiles( files )
    }

}

module.exports = autodoc
