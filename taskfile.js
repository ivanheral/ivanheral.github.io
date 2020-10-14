import bs from 'taskr-servor';
import e from 'child_process';

export async function dev(task) {
    await task
        .clear(['css', 'js', 'sw.js', 'manifest.json', '_site/sw.js', '_site/manifest.json'])
        .parallel(['js', 'css']);
    await task.watch('_dev/css/**', 'css');
    await task.watch('_dev/js/**', 'js');
    await task.watch('_posts/**', 'markdown');
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

export async function markdown(task) {
    e.exec('jekyll build', (error, stdout, stderr) => {});
}

export async function css(task) {
    await task
        .source('_dev/css/app.sass')
        .sass()
        .postcss({
            plugins: [require('cssnano')],
        })
        .target(['_site/css', 'css']);
}

export async function pwa(task) {
    await task.source('_dev/pwa/manifest.json').target(['_site', './']);
    await task
        .source('_dev/pwa/sw.js')
        .terser()
        .target(['_site', './']);
}

export async function js(task) {
    await task
        .source('_dev/js/**/*.*')
        .esbuild({
            minify: true,
        })
        .target(['_site/js', './js']);
}
