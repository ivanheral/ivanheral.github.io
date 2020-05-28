export const add_script = s => {
    document.getElementsByTagName('head')[0].appendChild(
        Object.assign(document.createElement('script'), {
            type: 'text/javascript',
            src: s.indexOf('https') > -1 ? s : `/js/modules/${s}.js`,
        }),
    );
};
