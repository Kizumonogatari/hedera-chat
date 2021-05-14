var initQuestions = [
    {
        type: "list",
        name: "topic",
        message: "Should we create a new topic, or connect to existing one?",
        choices: ["Create a new topic", "Connect to an existing topic"],
        filter: function(val) {
            return val.toLowerCase();
        }
    },
    {
        type: "input",
        name: "existingTopicId",
        message: "What's the topic ID?\n[Empty will default to the value at process.env.TOPIC_ID\n",
        when: (answers) => !answers.topic.includes("create")
    }
];

function UInt8ToString(array) {
    var str = "";
    for (var i = 0; i < array.length; i++) {
        str += array[i]
    }
    return str;
}

function secondsToDate(time) {
    var date = new Date(1970, 0, 1);
    date.setSeconds(time.seconds);
    return date;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function handleLog(event, log, status) {
    log = "" + log;
    if (status === "default") {
        console.log(event + " " + log);
    } else if (status === "minimal") {
        console.log(event);
    } else {
        if (log.toString() !== log && log["runningHash"] !== undefined) {
            console.log(event);
            console.log("\t message: " + log.toString());
            console.log("\t runningHash: " + UInt8ToString(log["runningHash"]));
            console.log("\t consensusTimestamp: " + secondsToDate(log["consensusTimestamp"]));
        } else {
            console.log(event + " " + log);
        }
    }
}

module.exports = {
    initQuestions,
    UInt8ToString,
    secondsToDate,
    sleep,
    handleLog
};