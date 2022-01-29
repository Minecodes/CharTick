import { Command } from 'commander';
import gradient from 'gradient-string';
import scan from './scan.mjs';
import figlet from 'figlet';
import fs from 'fs';

const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms));
const { version, name, dependencies } = JSON.parse(fs.readFileSync("package.json", "utf8"));
const program = new Command();
program.version(version);
program.name(name);

program
    .option("-f, --folder <folder>", "Scan a folder") // Scan a folder

program.parse(process.argv);

const options = program.opts();
const start = async () => {
    let folder = ".";
    await console.clear();
    figlet("CHARTICK", (err, data) => {
        console.log(gradient.instagram.multiline(data));
    });

    await sleep(500);

    options.folder ? folder = options.folder : null;
    scan(folder);
}

start();