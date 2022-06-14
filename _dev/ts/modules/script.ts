export const add_tag = (type: any, s: string | string[]) => {
    document.getElementsByTagName('head')[0].appendChild(
        Object.assign(document.createElement(type), {
            type: 'text/javascript',
            src: s.indexOf('https') > -1 ? s : `/js/modules/${s}.js`,
        }),
    );
};
