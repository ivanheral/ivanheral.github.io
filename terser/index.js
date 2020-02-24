'use strict';
var NAME = "terser";

var t = require("terser");
function setError(ctx, msg) {
	const error = msg
		.replace(ctx.root, "")
		.replace(": ", ": \n\n  ")
		.replace(" while parsing", "\n\nwhile parsing")
		.concat("\n");

	ctx.emit("plugin_error", {
		plugin: NAME,
		error
	});

	return new Buffer(
		`console.error('${NAME}: Bundle error! Check CLI output.');`
	);
}

module.exports = function (task) {
  task.plugin('terser', { every:false }, function* (files, opts) {
    opts = opts || {};
    
 
    for (const file of files) {
			try {
			
				var out = t.minify(file.data.toString(), opts);
				file.data = new Buffer(out.code);
			} catch (err) {
				file.data = setError(task, err.message);
			}
		}
		this._.files = files;
  });
}
