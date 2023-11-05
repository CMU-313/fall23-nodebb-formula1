const Iroh = require("iroh");
const fs = require('fs');
const path = require('path');

// Constants for current working directory and directories to ignore
const cwd = __dirname;
var ignores = new Set(['node_modules', 'install', 'coverage'])

// Function to run Iroh on individual files
// Performs analysis for Variables, Loops, and IF statements
function runIroh(code) {
    let stage;

    try {
        stage = new Iroh.Stage(code);
        eval(stage.script)

        // console.log(stage)
        // Create a listener for variables
        stage.addListener(Iroh.VAR)
        .on("after", (e) => {
            // This logs the variable's 'name' and 'value'
            // console.log(e.name, "=>", e.value);
        });

        // Create a listener for Loops
        stage.addListener(Iroh.LOOP)
        .on("enter", function(e) {
            // We enter the loop
            console.log(" ".repeat(e.indent) + "loop enter");
        })
        .on("leave", function(e) {
            // We leave the loop
            console.log(" ".repeat(e.indent) + "loop leave");
        });

        // Create a listener for conditionals
        stage.addListener(Iroh.IF)
        .on("enter", function(e) {
            // we enter the if
            // console.log(" ".repeat(e.indent) + "if enter");
        })
        .on("leave", function(e) {
            // we leave the if
            console.log(" ".repeat(e.indent) + "if leave");
        });
        eval(stage.script);
    } catch (error) {
        console.log(error)
        return;
    }    
}

// Search through ALL of the directories in the codebase and run iroh
function searchDirectories(filepath) {
    // Get the current directory (not the absolute path)
    var directory = /[^/]*$/.exec(filepath)[0];

    // Base Case: Check if it is a .js file or not
    if (path.extname(filepath) == ".js") {
        fs.readFile(filepath, 'utf8', (_, data) => {
            // Run Iroh on each line
            runIroh(data);
        });
    } else if (!fs.statSync(filepath).isFile() && !ignores.has(directory)) {
        // We are inside a directory, so loop through each of the subdirectories recursively
        fs.readdir(filepath, (_, files) => {
            files.forEach((filename) => {
                const filePath = path.join(filepath, filename);
                searchDirectories(filePath) 
            });
        });
    }
}

// Perform the search on the entire filesystem
searchDirectories(cwd)