#!/usr/bin/env node
const fs = require('fs');
const url = require('url');
const path = require('path');
const http = require('http');
const utils = require('./utils');
const cwd = process.cwd();
const isPortAvailable = require('./port.js');

const mime = Object.entries(require('./types.json')).reduce(
    (all, [type, exts]) =>
        Object.assign(
            all,
            ...exts.map(ext => ({
                [ext]: type,
            })),
        ),
    {},
);

const sendError = (res, resource, status) => {
    res.writeHead(status);
    res.end();
};

const watch =
    process.platform === 'linux'
        ? (path, cb) => {
              if (fs.statSync(path).isDirectory()) {
                  fs.watch(path, cb);
                  fs.readdirSync(path).forEach(entry => watch(`${path}/${entry}`, cb));
              }
          }
        : (path, cb) =>
              fs.watch(
                  path,
                  {
                      recursive: true,
                  },
                  cb,
              );

const sendFile = (res, resource, status, file, ext) => {
    res.writeHead(status, {
        'Content-Type': mime[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
    });
    res.write(file, 'binary');
    res.end();
};

const sendMessage = (res, channel, data) => {
    res.write(`event: ${channel}\nid: 0\ndata: ${data}\n`);
    res.write('\n\n');
};

const isRouteRequest = uri =>
    uri
        .split('/')
        .pop()
        .indexOf('.') === -1
        ? true
        : false;

const start = options => {
  const root = options.root || ".";
  const fallback = options.fallback || "index.html";
  const port = parseInt(options.port) || 8080;
  const reloadScript = `
  <script>
    const source = new EventSource('http://localhost:${port+1}');
    source.onmessage = function(e){ location.reload(true)};
  </script>
  `;
  (async function () {
    var status = await isPortAvailable(port);
    console.log(`Port ${port} ${status ? "is":"is not"} available!`)

    http
      .createServer((_request, res) => {
        res.writeHead(200, {
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        })
        sendMessage(res, 'connected', 'awaiting change')
        setInterval(sendMessage, 60000, res, 'ping', 'still waiting')
        watch(root, () => {

          sendMessage(res, 'message', 'reloading page')
        })
      })
      .listen(port + 1)

    http
      .createServer((req, res) => {
        const pathname = url.parse(req.url).pathname;
        const isRoute = isRouteRequest(pathname)
        const status = isRoute && pathname !== '/' ? 301 : 200
        const resource = isRoute ? `/${fallback}` : decodeURI(pathname)
        const uri = path.join(cwd, root, resource)
        const ext = uri.replace(/^.*[\.\/\\]/, '').toLowerCase()
        fs.stat(uri, (err, _stat) => {
          if (err) return sendError(res, resource, 404)
          fs.readFile(uri, 'binary', (err, file) => {
            if (err) return sendError(res, resource, 500)
            if (isRoute) file += reloadScript
            sendFile(res, resource, status, file, ext)
          })
        })
      })
      .listen(port, () => {
        utils.open_browser(port);
      })
  })()
}

module.exports = {
    start: start,
};
