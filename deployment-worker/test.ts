import Docker from 'dockerode';

var docker = new Docker({host: 'http://35.240.180.5', port: 2375});

(async () => {
    const image = await docker.listImages()
    console.log(image)
})();
