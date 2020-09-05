var compress_images = require('compress-images'),
    input,
    output;

input = 'dev/files/**/*.{jpg,png}';
output = 'files/';
output_site = '_site/files/';

var fs = require('fs');
var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

deleteFolderRecursive('./files');

compress_images(
    input,
    output,
    {
        compress_force: false,
        statistic: true,
        autoupdate: true,
    },
    false,
    {
        jpg: {
            engine: 'mozjpeg',
            command: ['-quality', '30'],
        },
    },
    {
        png: {
            engine: 'pngquant',
            command: ['--quality=30-60'],
        },
    },
    {
        svg: {
            engine: 'svgo',
            command: '--multipass',
        },
    },
    {
        gif: {
            engine: 'gifsicle',
            command: ['--colors', '64', '--use-col=web'],
        },
    },
    function() {},
);

compress_images(
    input,
    output_site,
    {
        compress_force: false,
        statistic: true,
        autoupdate: true,
    },
    false,
    {
        jpg: {
            engine: 'mozjpeg',
            command: ['-quality', '30'],
        },
    },
    {
        png: {
            engine: 'pngquant',
            command: ['--quality=30-60'],
        },
    },
    {
        svg: {
            engine: 'svgo',
            command: '--multipass',
        },
    },
    {
        gif: {
            engine: 'gifsicle',
            command: ['--colors', '64', '--use-col=web'],
        },
    },
    function() {},
);
