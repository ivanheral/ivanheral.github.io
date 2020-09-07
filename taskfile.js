import bs from 'taskr-servor';

export async function dev(task) {
    await task.clear(['css', 'js']).parallel(['js', 'css', 'pwa_out']);
    await task.watch('./_dev/css/**', 'css');
    await task.watch('./_dev/js/**', 'js');
    await task.watch('./_dev/pwa/**', 'pwa_out');
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
        .source('./_dev/css/app.sass')
        .sass()
        .postcss({
            plugins: [require('cssnano')],
        })
        .target(['./_site/css', './css']);
}

export async function pwa(task) {
    await task.source('./_dev/pwa/manifest.json').target('./_site');
    await task
        .source('./_dev/pwa/sw.js')
        .terser()
        .target(['./_site', './']);
}

export async function pwa_out(task) {
    await task.source('./_dev/pwa_out/manifest.json').target('./_site');
    await task.source('./_dev/pwa_out/sw.js').target(['./_site', './']);
}

export async function js(task) {
    await task
        .source('./_dev/js/**/*.js')
        .terser()
        .target(['./_site/js', './js']);
}
