const json2csv  = require("json2csv");
const fs = require("fs");
const path = require("path");

const directories = ["sync", "parallel-dynamic", "parallel-transpiled", "paralleljs", "threadsjs", "hamstersjs" ];

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
            let cleanName = nameParts.join(":").trim().replace(/\.0/g, ",0"); // Unify Monte carlo names

            if (cleanName.endsWith("(projects: 8, runs: 1,000,000)")) {
                cleanName = cleanName.replace("(projects: 8, runs: 1,000,000)", "");
            }

            if (cleanName.endsWith("(projects: 8, runs: 100,000)")) {
                cleanName = cleanName.replace("(projects: 8, runs: 100,000)", "100k");
            }

            cleanName = cleanName.replace("simjs", "");
            cleanName = cleanName.replace("Monte Carlo", "Risk Profiling");

            if (cleanName === "Mandelbrot 10000x10000, 1000") {
                cleanName = "Mandelbrot";
            }

            return cleanName.trim();
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


        let set = directory;
        if (set === "paralleljs") {
            set = "Parallel.js";
        } else if (set === "hamstersjs") {
            set = "Hamsters.js";
        } else if (set === "threadsjs") {
            set = "Threads.js";
        }
        if (set === "parallel-transpiled") {
            set = "Parallel.es";
        } else if (set === "parallel-dynamic") {
            set = "parallel-es-dynamic";
        }

        json.directory = set;
        json.file =  file;
        outputs.push(json2csv({ data: json, fields, hasCSVColumnTitle: first, unwindPath: "benchmarks"}));
    }
}

fs.writeFileSync(path.join(__dirname, "benchmarks.csv"), outputs.join("\n"));
