// const { spawn } = require("child_process");

// const spawnSync = (command, args, options = {}, cb) => {
//   const chillProcess = spawn(command, args, options);
//   return new Promise((resolve, reject) => {
//     let errMessage = "";
//     chillProcess.on('error', function (err) {
//       reject(err);
//     });
//     chillProcess.on('close', (code) => {
//       if (code === 0) {
//         resolve(code);
//       } else {
//         reject(new Error(errMessage));
//       }
//     });
//     chillProcess.stdout.on('data', (data) => {
//       cb(`${data}`);
//     });

//     chillProcess.stderr.on('data', (data) => {
//       errMessage += `${data}`;
//       cb(`${data}`);
//     });
//   });
// }

// spawnSync("/bin/bash", ["-c", "kubectl get deployments"], {}, console.log)

const execSync = require("util").promisify(require("child_process").exec);

execSync(`kubectl logs -l app=d33c73a7-98df-423a-b20c-d97ca956f69c --timestamps=true --since-time="2024-04-12T09:42:14.836Z"`).then(({stdout}) => {
  const logs = stdout.split("\n").filter(log => !!log);
  const logData = logs.map((log) => {
    return {
      time: log.substring(0, log.indexOf(" ")),
      log: log.substring(log.indexOf(" ") + 1)
    }
  })
  console.log(logData)
})

// const chunkArray = (originalArray, chunkSize) => {
//   const chunkedArrays = [];
//   for (let i = 0; i < originalArray.length; i += chunkSize) {
//     chunkedArrays.push(originalArray.slice(i, i + chunkSize));
//   }
//   return chunkedArrays;
// }

// (async () => {
//   const {stdout} = await execSync(`kubectl get pods -l app=7580bc3b-07a0-4535-b497-11a031e9f572`);
//   console.log(stdout.split(/(\s+)/).filter(str => !!str.trim())[7]);
// }) ()
// const Cloudflare = require('cloudflare');

// const cloudflare = new Cloudflare({
//   apiEmail: "hiepnguyenno01@gmail.com", // This is the default and can be omitted
//   apiKey: "Bearer CZHgOk3z_9RZepl9sRU4i3xfIy369o0oZ5R5PZkF", // This is the default and can be omitted,
// });

// (async () => {
//   const zone = await cloudflare.zones
//     .get({ zone_id: '9e1eea509ca1d2b3b0f1aa901958e9eb' })

//   console.log(zone)
// }) ()

