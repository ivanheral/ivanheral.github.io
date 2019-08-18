var compress_images = require('compress-images'),
    input,
    output;

input = 'dev/files/**/*.{jpg,png}';
output = 'files/';

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
            command: ['-quality', '50'],
        },
    },
    {
        png: {
            engine: 'pngquant',
            command: ['--quality=20-50'],
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
