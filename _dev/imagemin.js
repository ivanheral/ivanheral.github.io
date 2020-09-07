var compress_images = require('compress-images'),
    input,
    output;

input = '_dev/files/**/*.{jpg,png}';
output = 'files/';
output_site = '_site/files/';

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
