const fs = require("fs");
const path = require("path");
const process = require("process");


const args = process.argv;
if (args.length < 3) {
    throw new Error("Call the Script with one argument, the benchmark json file to split");
}

const fileName = args[2];
const testSets = {};
const fileContent = JSON.parse(fs.readFileSync(path.resolve(fileName), "utf-8"));

for (let i = 0; i < fileContent.benchmarks.length; ++i) {
    const result = fileContent.benchmarks[i];
    const setName = result.name.split(":")[0].trim();

    const set = testSets[setName] = testSets[setName] || [];
    set.push(result);
}

const testSetKeys = Object.keys(testSets);
for (let i = 0; i < testSetKeys.length; ++i) {
    const setName = testSetKeys[i];
    const set = testSets[setName];

    const output = {
        benchmarks: set,
        platform: fileContent.platform
    };

    fs.writeFileSync(path.resolve(".", setName, fileName), JSON.stringify(output, undefined, "    "), "utf-8");
}
