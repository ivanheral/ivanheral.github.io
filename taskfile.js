import bs from './server/servor';
bs.start({
    root: '_site',
    port: 3000
});

export default async function(task) {
    await task.clear(['css', 'js']).parallel(['js', 'css', 'pwa']);
    await task.watch('dev/css/**/*.*', 'css');
    await task.watch('dev/js/**/*.js', 'js');
    await task.watch('dev/pwa/**/*', 'pwa');
}

export async function css(task) {
    await task
        .source('dev/css/app.sass')
        .sass()
        .autoprefixer({
            browsers: ['last 5 versions'],
        })
        .postcss({
            plugins: [require('cssnano')],
        })
        .target(['_site/css', 'css']);
}

export async function pwa(task) {
    await task.source('dev/pwa/manifest.json').target(['./_site', './']);
    await task.source('dev/pwa/sw.js').terser().target(['./_site', './']);
}

export async function js(task) {
    await task
        .source('dev/js/**/*.js')
        .terser()
        .target(['_site/js', 'js']);
}
