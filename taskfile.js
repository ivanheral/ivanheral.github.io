var bs = require('browser-sync')
var historyApiFallback = require('connect-history-api-fallback')
bs({server: '_site', middleware: [historyApiFallback()]})

export default async function (task) {
    await task.clear(['css','js']).parallel(['js', 'vendors', 'css'])
    await task.watch('_dev/css/**/*.*', 'css')
    await task.watch('_dev/js/**/*.js', 'js')
    await task.watch('_site/**/*.*', 'changes')
}

export async function css(task) {
    await task.source('_dev/css/app.sass').sass().autoprefixer({
        browsers: ['last 5 versions']
    }).postcss({plugins: [require('cssnano')]}).target(['_site/css', 'css'])
}

export async function changes(task) {
    bs.reload('*')   
}

export async function vendors(task) {
    await task.source('_dev/js/vendors/*.js').browserify().uglify().target(['_site/js', 'js'])
}

export async function js(task) {
    await task.source('_dev/js/app.js').browserify({
            transform: [require("babelify").configure({
                presets: ['env']
            })]
        }).uglify().target(['_site/js', 'js'])
}
