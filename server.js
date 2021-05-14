/* configure access to our .env */
require("dotenv").config();

const express = require("express");
const app = express()
const http = require("http").createServer(app);
const io = require("socket.io")(http);

/* include express.js & socket.io */
const inquirer = require("inquirer");
const open = require("open");
const TextDecoder = require("text-encoding").TextDecoder;

/* hedera.js */
const {
    Client,
    TopicMessageSubmitTransaction,
    TopicId,
    TopicCreateTransaction,
    TopicMessageQuery
} = require("@hashgraph/sdk");

/* utilities */
const questions = require("./utils.js").initQuestions;
const UInt8ToString = require("./utils.js").UInt8ToString;
const secondsToDate = require("./utils.js").secondsToDate;
const log = require("./utils.js").handleLog;
const sleep = require("./utils.js").sleep;

/* init variables */
const specialChar = "ℏ";
var operatorAccount = "";
var client = Client.forTestnet();
var topicId = "";
var logStatus = "default";

/* configure our env based on prompted input */
async function init() {
    inquirer.prompt(questions).then(async function(answers) {
        try {
            configureAccount();
            if(answers.existingTopicId != undefined) {
                configureExistingTopic(answers.existingTopicId);
            } else {
                await configureNewTopic();
            }
            runChat();
        } catch (error) {
            log("Error: init() failed", error, logStatus);
            process.exit(1);
        }
    });
}

function runChat() {
    app.use(express.static("public"));
    http.listen(0, function() {
        const randomInstancePort = http.address().port;
        open("http://localhost:" + randomInstancePort);
    });
    io.on("connection", function(client) {
        subscribeToTopic();
        io.emit("connect message", operatorAccount + specialChar + client.id + specialChar + topicId);
        client.on("chat message", function(msg) {
            log("Message received.", "", logStatus);
            const formattedMessage = operatorAccount + specialChar + client.id + specialChar + msg;
            sendHCSMessage(formattedMessage);
        });
        client.on("disconnect", function() {
            io.emit("disconnect message", operatorAccount + specialChar + client.id);
        });
    })
}

init(); // process arguments & handoff to runChat()

/* helper hedera functions */
/* have feedback, questions, etc.? please feel free to file an issue! */
async function sendHCSMessage(msg) {
    try {
        await new TopicMessageSubmitTransaction({
            topicId: topicId,
            message: msg
        }).execute(client);
        log("TopicMessageSubmitTransaction()", msg, logStatus);
    } catch(error) {
        log("ERROR: TopicMessageSubmitTransaction()", error, logStatus);
    }
}

function subscribeToTopic() {
    try {
        new TopicMessageQuery()
            .setTopicId(topicId)
            .setStartTime(0)
            .subscribe(
                client,
                (message) => {
                    msg = Buffer.from(message.contents, "utf-8").toString();
                    running_hash = Buffer.from(message.runningHash, "utf-8").toString();
                    log("Response from TopicMessageQuery", msg, logStatus);
                    io.emit("chat message", msg + specialChar + message.sequenceNumber + specialChar + UInt8ToString(message.runningHash) + specialChar + secondsToDate(message.consensusTimestamp));
                }
            );
        // io.emit("chat message", message + specialChar)
        log("TopicMessageQuery()", topicId.toString(), logStatus);
    } catch(error) {
        log("ERROR: TopicMessageQuery()", error, logStatus);
        process.exit(1);
    }
}

// topic id: 0.0.621124
async function createNewTopic() {
    try {
        const transaction = new TopicCreateTransaction();
        const txResponse = await transaction.execute(client);
        log("TopicCreateTransaction()", `submitted tx ${txResponse}`, logStatus);
        await sleep(3000);  // wait until Hedera reaches consensus
        const receipt = await txResponse.getReceipt(client);
        const newTopicId = receipt.topicId;
        log("TopicCreateTransaction()", `success! new topic ${newTopicId}`, logStatus);
        return newTopicId;
    } catch(error) {
        log("ERROR: TopicCreateTransaction()", error, logStatus);
        process.exit(1);
    }
}

/* helper init functions */
function configureAccount() {
    try {
        log("init()", "using default .env config", logStatus);
        operatorAccount = process.env.ACCOUNT_ID;
        client.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);
    } catch (error) {
        log("ERROR: configureAccount()", error, logStatus);
        process.exit(1);
    }
}

async function configureNewTopic() {
    log("init()", "creating new topic", logStatus);
    topicId = await createNewTopic();
    log("ConsensusTopicCreateTransaction()", "waiting for new HCS Topic & mirror node (may take a few seconds)", logStatus);
    await sleep(9000);
    return;
}

async function configureExistingTopic(existingTopicId) {
    log("init()", "connecting to existing topic", logStatus);
    if(existingTopicId === "") {
        topicId = TopicId.fromString(process.env.TOPIC_ID);
    } else {
        topicId = TopicId.fromString(existingTopicId);
    }
}