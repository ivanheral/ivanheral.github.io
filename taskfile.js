const execa = require('execa')
var bs = require('browser-sync')
var historyApiFallback = require('connect-history-api-fallback')

export default async function (task) {
    await task.clear(['css','js']).parallel(['js', 'vendors', 'fetch', 'css']).start('jekyll').start('server')
    await task.watch('_dev/css/**/*.*', 'css')
    await task.watch('_dev/js/**/*.js', 'changes')
}

export async function css(task) {
    await task.source('_dev/css/app.sass').sass().autoprefixer({
        browsers: ['last 5 versions']
    }).postcss({plugins: [require('cssnano')]}).target('css')
    bs.reload('css/app.css')
}

export async function changes(task) {
    await task.start('js')
    await task.start('vendors')
    bs.reload('js/**/*.js')
}

export async function vendors(task) {
    await task.source('_dev/js/vendors/*.js').browserify().uglify().target('js')
}

export async function fetch(task) {
    await task.source('_dev/js/vendors/ie/fetch.js').browserify({
            transform: [require("babelify").configure({
                presets: ['env']
            })]
        }).uglify().target('js')
}

export async function js(task) {
    await task.source('_dev/js/app.js').browserify({
            transform: [require("babelify").configure({
                presets: ['env']
            })]
        }).target('js')
}

export async function jekyll(task) {
  	execa('jekyll', ['serve']).then(result => {
	})
}

export async function server(task) {
    bs({server: '_site', middleware: [historyApiFallback()]})
}
