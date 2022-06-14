import bs from 'taskr-servor';
import e from 'child_process';

export async function dev(task) {
    await task
        .clear(['css', 'js', 'sw.js', 'manifest.json', '_site/sw.js', '_site/manifest.json'])
        .parallel(['ts', 'css']);
    await task.watch('_dev/css/**', 'css');
    await task.watch('_dev/ts/**', 'ts');
    await task.watch('_posts/**', 'markdown');
    bs.start({
        root: '_site',
        port: 3000,
    });
}

export async function prod(task) {
    await task.clear(['css', 'ts']).parallel(['ts', 'css', 'pwa']);
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

export async function ts(task) {
    await task
        .source('_dev/ts/**/*.*')
        .esbuild({
            esbuild: {
                minify: true,
            },
        })
        .target(['_site/js', './js']);
}