# Hedera Consensus Service Chat Tutorial

An example web app which demonstrates how you can use decentralized pub-sub messaging on the Hedera Consensus Service.
It is based on Cooper Kunz example that you can find [here](https://github.com/hashgraph/hedera-hcs-chat-js) but updated for the version 2 of the Hedera-js SDK.

### Built With

- [Hedera Hashgraph](https://www.hedera.com/) - The enterprise grade public network
- [Hedera Hashgraph's JavaScript SDK](https://github.com/hashgraph/hedera-sdk-js) - The easiest way to use Hedera in JavaScript
- [Express.js](https://expressjs.com/) - A fast, unopinionated web framework for node.js
- [Socket.io](https://socket.io/) - A realtime client to server framework for node.js

### Prerequisites

This demo assumes that you have an account on the Hedera Testnet. For example:

```
ACCOUNT_ID=0.0.123456789
PRIVATE_KEY=302e020100300506032b657004220420f4361ec73dc43e568f1620a7b7ecb7330790b8a1c7620f1ce353aa1de4f0eaa6
```

If you don't have one yet, sign up at [portal.hedera.com](https://portal.hedera.com/).

## Getting Started

You can clone this repository by running the following command:

```
git clone https://github.com/Kizumonogatari/hedera-chat.git
```

Copy the `.env.sample` file and rename the copy to `.env`

Then update the newly renamed `.env` file with your Hedera Testnet account info as indicated. For example:

```
ACCOUNT_ID=0.0.123456789
PRIVATE_KEY=302e020100300506032b657004220420f4361ec73dc43e568f1620a7b7ecb7330790b8a1c7620f1ce353aa1de4f0eaa6
TOPIC_ID=0.0.28583
```
The `TOPIC_ID` is used when connecting to an existing topic. If you don't have one, you can leave it as is.

After downloading and setting up our environment, we'll install our packages via [npm](https://docs.npmjs.com/about-npm/).

```
npm install
```

If installing the dependencies was succesful, now try to run the server!

```
node server.js
```

After running your server, it will prompt you to configure your chat, e.g.

```
Should we create a new HCS topic, or connect to an existing one?
```

If you choose to create a new one, it'll automatically create and give you a topic ID (that you can re-use by using "connect to an existing one" next time you launch the server)
If everything was configured properly, the chat should now open at a random port location.

You can additionally run another instance of the chat application by creating a new terminal, and running the application again. This will find another unused, random port location, and deploy multiple instances to your local machine. With the environment configurability, you can test out multi-client chats.

### Disclaimer

This is just a simple demo application. Please use responsibly.

### LICENSE

[Apache 2.0](LICENSE)