import AutoComplete from 'enquirer/lib/prompts/autocomplete.js';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

let run = true;

function scan(folder) {
    function scanFile(file) {
        console.clear();
        console.log(chalk.bgRed.white(`Scanning ${path.join(folder, file)}`));
        const index = fs.readFileSync(`${path.join(folder, file)}`, "utf8").toLowerCase().split("");
        let f = [];
        index.filter(i => {
            if (/^[ -~]+$/.test(i)) {
                i !== " " ? f.push(i) : null;
            }
        })
        // list how often each letter appears
        const letters = {};
        f.forEach(letter => {
            if (letters[letter]) {
                letters[letter]++;
            } else {
                letters[letter] = 1;
            }
        });

        const sorted = Object.keys(letters).sort((a, b) => letters[b] - letters[a]);
        for (let i = 0; i < sorted.length; i++) {
            if (letters[sorted[i]] > 0) {
                console.log(`${chalk.bgRed.white(sorted[i] + " : ")}${chalk.bgBlue.white((letters[sorted[i]] / f.length) * 100 + "%")}`);
            }
        }
    }

    fs.readdir(path.join(folder), (err, files) => {
        if (files.length > 0) {
            const prompt = new AutoComplete({
                name: "files",
                message: "Select a file to scan",
                choices: files
            });
            prompt.run().then(answer => {
                fs.statSync(path.join(folder, answer)).isDirectory() ? scan(path.join(folder, answer)) : scanFile(path.join(answer));
            })
        } else {
            console.log("No files found");
        }
    })
}

export default (folder) => {
    scan(folder);
}