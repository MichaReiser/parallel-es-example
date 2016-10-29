const json2csv  = require("json2csv");
const fs = require("fs");
const path = require("path");

const directories = ["parallel-dynamic", "parallel-transpiled", "sync" ];

const outputs = [];
const fields = [
    {
        label: "Set",
        value: "directory",
    }, {
        label: "File",
        value: "file"
    }, {
        label: "Name",
        value: function (row) {
            const [set, ...nameParts] = row.benchmarks.name.split(":");
            return nameParts.join(":").trim();
        }
    },{
        label: "Margin of Error",
        value: "benchmarks.stats.moe"
    }, {
        label: "Relative Margin of Error",
        value: "benchmarks.stats.rme"
    }, {
        label: "Standard Error of the mean",
        value: "benchmarks.stats.sem"
    }, {
        label: "Standard Deviation",
        value: "benchmarks.stats.deviation"
    }, {
        label: "Mean (s)",
        value: "benchmarks.stats.mean"
    }, {
        label: "Variance",
        value: "benchmarks.stats.variance"
    }, {
        label: "Time Stamp",
        value: function (row) {
            // http://stackoverflow.com/questions/1703505/excel-date-to-unix-timestamp
            const timestamp = row.benchmarks.times.timeStamp;
            return new Date(timestamp).toISOString().split(".")[0].replace("T", " ");
        }
    }, {
        label: "Browser",
        value: "platform.name"
    }, {
        label: "Browser Version",
        value: "platform.version"
    }, {
        label: "OS",
        value: "platform.os.family"
    }, {
        label: "OS Version",
        value: "platform.os.version"
    }, {
        label: "OS Architecture",
        value: "platform.os.architecture"
    }
];

for (const directory of directories) {
    for (const file of fs.readdirSync(path.resolve(directory))) {
        if (!file.endsWith(".json")) {
            continue;
        }

        const first = outputs.length === 0;

        const fileContent = fs.readFileSync(path.join(__dirname, directory, file), "utf-8");
        const json = JSON.parse(fileContent);

        json.directory = directory;
        json.file =  file;
        outputs.push(json2csv({ data: json, fields, hasCSVColumnTitle: first, unwindPath: "benchmarks"}));
    }
}

fs.writeFileSync(path.join(__dirname, "benchmarks.csv"), outputs.join("\n"));
