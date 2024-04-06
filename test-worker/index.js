// const {Worker} = require('node:worker_threads');

// const worker = new Worker("/home/hiepnguyenn223/khoa-luan-hiepnk/test-worker/worker-1.js");
// console.log(worker)
// console.log(process.pid)
// worker.on('message', (message) => {
//     console.log('Worker thread returned:', message);
// });

// worker.on("exit", (code) => {
//     console.log("exit", code);
// })
const {spawn} = require("child_process");

const ls = spawn("node", ["worker-1.js", "test"]);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
}); 

setTimeout(() => {
  process.kill(ls.pid)
}, 3000)