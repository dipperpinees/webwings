import Docker from 'dockerode';

var docker = new Docker({ socketPath: '/var/run/docker.sock' });

(async () => {
    const logStream = await docker.getContainer('71bf3ffc63de061690d4bfaf2b1451b2fa2fa456d728443c60b490d845bdd3b7').logs({
        follow: true, // true to stream the logs
        stdout: true, // true for stdout logs
        stderr: true, // true for stderr logs
        since: 1709825041
    });

    logStream.on('data', (chunk) => {
        console.log(chunk.toString('utf8'));
    });

    logStream.on('end', () => {
        console.log('Stream ended');
    });

    logStream.on('error', (err) => {
        console.error('Error:', err.message);
    });
})();
