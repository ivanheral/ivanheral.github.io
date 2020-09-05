import bs from 'taskr-servor';

export async function dev(task) {
    await task.clear(['css', 'js']).parallel(['js', 'css', 'pwa_out']);
    await task.watch('dev/css/**', 'css');
    await task.watch('dev/js/**', 'js');
    await task.watch('dev/pwa/**', 'pwa_out');
    bs.start({
        root: '_site',
        port: 3000,
    });
}

export async function prod(task) {
    await task.clear(['css', 'js']).parallel(['js', 'css', 'pwa']);
    bs.start({
        root: '_site',
        port: 3000,
    });
}

export async function css(task) {
    await task
        .source('dev/css/app.sass')
        .sass()
        .postcss({
            plugins: [require('cssnano')],
        })
        .target(['./_site/css', './css']);
}

export async function pwa(task) {
    await task.source('dev/pwa/manifest.json').target('./_site');
    await task
        .source('dev/pwa/sw.js')
        .terser()
        .target(['./_site', './']);
}

export async function pwa_out(task) {
    await task.source('dev/pwa_out/manifest.json').target('./_site');
    await task.source('dev/pwa_out/sw.js').target(['./_site', './']);
}

export async function js(task) {
    await task
        .source('dev/js/**/*.js')
        .terser()
        .target(['./_site/js', './js']);
}
