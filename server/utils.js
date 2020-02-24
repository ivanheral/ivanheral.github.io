module.exports = {
    open_browser: port => {
        const open = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open';
        require('child_process').exec(`${open} http://localhost:${port}`);
    },
};
