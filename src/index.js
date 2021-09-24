require('dotenv').config();
const WebSocket = require('ws');

const {
  URL: url, USER_UID: userUid, CRED: cred, DISPLAY_NAME: displayName, ROOM_NUMBER: roomNumber,
} = process.env;

const ws = new WebSocket(url);

let step = 0;
let voites = {};
let developers = {};
let submitedNumber;

// get the most frequent number from array, ex.: getMostFequentNumber([1, 5, 8, 5, 3, 5, 3]) === 5
function getMostFequentNumber(arr) {
  const res = {};
  let max;
  for (const num of arr) {
    if (!max) max = num;
    if (!res[`${num}`]) res[`${num}`] = 0;
    res[`${num}`]++;
    if (res[`${max}`] < res[`${num}`]) max = num;
  }
  return max;
}

// get name and id of each developers
function updateDevelopersList(message) {
  try {
    const data = JSON.parse(message);
    const { estimates } = data.d.b.d || {};
    developers = Object.values(estimates).reduce(
      (acc, { developer: { userUid: id, displayName: name } }) => ({ ...acc, [id]: name }),
      {},
    );
    console.log(developers);
  } catch (err) {
    console.error(err);
  }
}

function voteHandler({ user, value }) {
  console.log(`${developers[`${user}`]} submited ${value}`);
  voites[`${user}`] = value;

  const toSubmit = getMostFequentNumber(Object.values(voites));

  const votesTotal = Object.keys(voites).length;
  const votesNeeded = Math.trunc(Object.keys(developers)/2);
  if (submitedNumber !== toSubmit && votesTotal >= votesNeeded) {
    submitedNumber = toSubmit;
    console.log(`=== WE SUBMIT ${toSubmit}`);
    ws.send(`{"t":"d","d":{"r":${step},"a":"m","b":{"p":"/pokerRooms/${roomNumber}/estimates/${userUid}","d":{"developer":{"displayName":"${displayName}","userUid":"${userUid}"},"updatedAt":{".sv":"timestamp"},"storyPoints":"${toSubmit}"}}}}`);
  }
}

function sendInitMessages() {
  ws.send(`{"t":"d","d":{"r":${step++},"a":"s","b":{"c":{"sdk.js.7-8-1":1}}}}`);
  ws.send(`{"t":"d","d":{"r":${step++},"a":"auth","b":{"cred":"${cred}"}}}`);
  ws.send(`{"t":"d","d":{"r":${step++},"a":"q","b":{"p":"/users/${userUid}","h":""}}}`);
  ws.send(`{"t":"d","d":{"r":${step++},"a":"m","b":{"p":"/status/${userUid}","d":{"status":"online","timestamp":{".sv":"timestamp"}}}}}`);
  ws.send(`{"t":"d","d":{"r":${step++},"a":"om","b":{"p":"/status/${userUid}","d":{"status":"offline","timestamp":{".sv":"timestamp"}}}}}`);
  ws.send(`{"t":"d","d":{"r":${step++},"a":"m","b":{"p":"/status/${userUid}","d":{"status":"online","timestamp":{".sv":"timestamp"}}}}}`);
  ws.send(`{"t":"d","d":{"r":${step++},"a":"q","b":{"p":"/pokerRooms/${roomNumber}","h":""}}}`);
}

function messageHandler(originMessage) {
  const message = originMessage.toString();
  step++;
  // console.log(`received: ${step}: ${message}`);

  // send init after first incoming message
  if (step === 1) sendInitMessages();

  // update developers list
  if (!Object.keys(developers).length && message.match(/"developer"/)) updateDevelopersList(message);

  // checking new estimate
  const match = message.match(/estimates\/(\w+).*?"storyPoints":"(\d+)"}/);
  if (match && match[1] !== userUid) voteHandler({ user: match[1], value: match[2] });

  // clear all estimates
  if (message.match(/"storyPoints":null}/)) {
    console.log('=== RESET ===');
    voites = [];
    submitedNumber = undefined;
  }
}

setInterval(() => ws.send('0'), 1000 * 60); // send 0 each minute to stay alive
ws.on('open', () => console.log('=== Ready ==='));
ws.on('message', messageHandler);
