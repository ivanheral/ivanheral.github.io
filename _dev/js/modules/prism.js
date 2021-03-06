var e = (function(e) {
    var a = /\blang(?:uage)?-([\w-]+)\b/i,
        n = 0,
        t = {
            manual: e.Prism && e.Prism.manual,
            disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
            util: {
                encode: function e(a) {
                    return a instanceof r
                        ? new r(a.type, e(a.content), a.alias)
                        : Array.isArray(a)
                        ? a.map(e)
                        : a
                              .replace(/&/g, '&amp;')
                              .replace(/</g, '&lt;')
                              .replace(/\u00a0/g, ' ');
                },
                type: function(e) {
                    return Object.prototype.toString.call(e).slice(8, -1);
                },
                objId: function(e) {
                    return e.__id || Object.defineProperty(e, '__id', { value: ++n }), e.__id;
                },
                clone: function e(a, n) {
                    var r,
                        s,
                        i = t.util.type(a);
                    switch (((n = n || {}), i)) {
                        case 'Object':
                            if (((s = t.util.objId(a)), n[s])) return n[s];
                            for (var l in ((n[s] = r = {}), a)) a.hasOwnProperty(l) && (r[l] = e(a[l], n));
                            return r;
                        case 'Array':
                            return (
                                (s = t.util.objId(a)),
                                n[s]
                                    ? n[s]
                                    : ((n[s] = r = []),
                                      a.forEach(function(a, t) {
                                          r[t] = e(a, n);
                                      }),
                                      r)
                            );
                        default:
                            return a;
                    }
                },
                getLanguage: function(e) {
                    for (; e && !a.test(e.className); ) e = e.parentElement;
                    return e ? (e.className.match(a) || [, 'none'])[1].toLowerCase() : 'none';
                },
                currentScript: function() {
                    if ('undefined' == typeof document) return null;
                    if ('currentScript' in document) return document.currentScript;
                    try {
                        throw new Error();
                    } catch (t) {
                        var e = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(t.stack) || [])[1];
                        if (e) {
                            var a = document.getElementsByTagName('script');
                            for (var n in a) if (a[n].src == e) return a[n];
                        }
                        return null;
                    }
                },
            },
            languages: {
                extend: function(e, a) {
                    var n = t.util.clone(t.languages[e]);
                    for (var r in a) n[r] = a[r];
                    return n;
                },
                insertBefore: function(e, a, n, r) {
                    var s = (r = r || t.languages)[e],
                        i = {};
                    for (var l in s)
                        if (s.hasOwnProperty(l)) {
                            if (l == a) for (var o in n) n.hasOwnProperty(o) && (i[o] = n[o]);
                            n.hasOwnProperty(l) || (i[l] = s[l]);
                        }
                    var u = r[e];
                    return (
                        (r[e] = i),
                        t.languages.DFS(t.languages, function(a, n) {
                            n === u && a != e && (this[a] = i);
                        }),
                        i
                    );
                },
                DFS: function e(a, n, r, s) {
                    s = s || {};
                    var i = t.util.objId;
                    for (var l in a)
                        if (a.hasOwnProperty(l)) {
                            n.call(a, l, a[l], r || l);
                            var o = a[l],
                                u = t.util.type(o);
                            'Object' !== u || s[i(o)]
                                ? 'Array' !== u || s[i(o)] || ((s[i(o)] = !0), e(o, n, l, s))
                                : ((s[i(o)] = !0), e(o, n, null, s));
                        }
                },
            },
            plugins: {},
            highlightAll: function(e, a) {
                t.highlightAllUnder(document, e, a);
            },
            highlightAllUnder: function(e, a, n) {
                var r = {
                    callback: n,
                    container: e,
                    selector:
                        'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code',
                };
                t.hooks.run('before-highlightall', r),
                    (r.elements = Array.prototype.slice.apply(r.container.querySelectorAll(r.selector))),
                    t.hooks.run('before-all-elements-highlight', r);
                for (var s, i = 0; (s = r.elements[i++]); ) t.highlightElement(s, !0 === a, r.callback);
            },
            highlightElement: function(n, r, s) {
                var i = t.util.getLanguage(n),
                    l = t.languages[i];
                n.className = n.className.replace(a, '').replace(/\s+/g, ' ') + ' language-' + i;
                var o = n.parentNode;
                o &&
                    'pre' === o.nodeName.toLowerCase() &&
                    (o.className = o.className.replace(a, '').replace(/\s+/g, ' ') + ' language-' + i);
                var u = { element: n, language: i, grammar: l, code: n.textContent };
                function c(e) {
                    (u.highlightedCode = e),
                        t.hooks.run('before-insert', u),
                        (u.element.innerHTML = u.highlightedCode),
                        t.hooks.run('after-highlight', u),
                        t.hooks.run('complete', u),
                        s && s.call(u.element);
                }
                if ((t.hooks.run('before-sanity-check', u), !u.code))
                    return t.hooks.run('complete', u), void (s && s.call(u.element));
                if ((t.hooks.run('before-highlight', u), u.grammar))
                    if (r && e.Worker) {
                        var g = new Worker(t.filename);
                        (g.onmessage = function(e) {
                            c(e.data);
                        }),
                            g.postMessage(JSON.stringify({ language: u.language, code: u.code, immediateClose: !0 }));
                    } else c(t.highlight(u.code, u.grammar, u.language));
                else c(t.util.encode(u.code));
            },
            highlight: function(e, a, n) {
                var s = { code: e, grammar: a, language: n };
                return (
                    t.hooks.run('before-tokenize', s),
                    (s.tokens = t.tokenize(s.code, s.grammar)),
                    t.hooks.run('after-tokenize', s),
                    r.stringify(t.util.encode(s.tokens), s.language)
                );
            },
            matchGrammar: function(e, a, n, s, i, l, o) {
                for (var u in n)
                    if (n.hasOwnProperty(u) && n[u]) {
                        var c = n[u];
                        c = Array.isArray(c) ? c : [c];
                        for (var g = 0; g < c.length; ++g) {
                            if (o && o == u + ',' + g) return;
                            var d = c[g],
                                p = d.inside,
                                f = !!d.lookbehind,
                                h = !!d.greedy,
                                m = 0,
                                y = d.alias;
                            if (h && !d.pattern.global) {
                                var b = d.pattern.toString().match(/[imsuy]*$/)[0];
                                d.pattern = RegExp(d.pattern.source, b + 'g');
                            }
                            d = d.pattern || d;
                            for (var F = s, v = i; F < a.length; v += a[F].length, ++F) {
                                var k = a[F];
                                if (a.length > e.length) return;
                                if (!(k instanceof r)) {
                                    if (h && F != a.length - 1) {
                                        if (((d.lastIndex = v), !(_ = d.exec(e)))) break;
                                        for (
                                            var w = _.index + (f && _[1] ? _[1].length : 0),
                                                A = _.index + _[0].length,
                                                x = F,
                                                $ = v,
                                                S = a.length;
                                            x < S && ($ < A || (!a[x].type && !a[x - 1].greedy));
                                            ++x
                                        )
                                            ($ += a[x].length) <= w && (++F, (v = $));
                                        if (a[F] instanceof r) continue;
                                        (j = x - F), (k = e.slice(v, $)), (_.index -= v);
                                    } else {
                                        d.lastIndex = 0;
                                        var _ = d.exec(k),
                                            j = 1;
                                    }
                                    if (_) {
                                        f && (m = _[1] ? _[1].length : 0),
                                            (A = (w = _.index + m) + (_ = _[0].slice(m)).length);
                                        var E = k.slice(0, w),
                                            O = k.slice(A),
                                            P = [F, j];
                                        E && (++F, (v += E.length), P.push(E));
                                        var z = new r(u, p ? t.tokenize(_, p) : _, y, _, h);
                                        if (
                                            (P.push(z),
                                            O && P.push(O),
                                            Array.prototype.splice.apply(a, P),
                                            1 != j && t.matchGrammar(e, a, n, F, v, !0, u + ',' + g),
                                            l)
                                        )
                                            break;
                                    } else if (l) break;
                                }
                            }
                        }
                    }
            },
            tokenize: function(e, a) {
                var n = [e],
                    r = a.rest;
                if (r) {
                    for (var s in r) a[s] = r[s];
                    delete a.rest;
                }
                return t.matchGrammar(e, n, a, 0, 0, !1), n;
            },
            hooks: {
                all: {},
                add: function(e, a) {
                    var n = t.hooks.all;
                    (n[e] = n[e] || []), n[e].push(a);
                },
                run: function(e, a) {
                    var n = t.hooks.all[e];
                    if (n && n.length) for (var r, s = 0; (r = n[s++]); ) r(a);
                },
            },
            Token: r,
        };
    function r(e, a, n, t, r) {
        (this.type = e),
            (this.content = a),
            (this.alias = n),
            (this.length = 0 | (t || '').length),
            (this.greedy = !!r);
    }
    if (
        ((e.Prism = t),
        (r.stringify = function e(a, n) {
            if ('string' == typeof a) return a;
            if (Array.isArray(a)) {
                var r = '';
                return (
                    a.forEach(function(a) {
                        r += e(a, n);
                    }),
                    r
                );
            }
            var s = {
                    type: a.type,
                    content: e(a.content, n),
                    tag: 'span',
                    classes: ['token', a.type],
                    attributes: {},
                    language: n,
                },
                i = a.alias;
            i && (Array.isArray(i) ? Array.prototype.push.apply(s.classes, i) : s.classes.push(i)),
                t.hooks.run('wrap', s);
            var l = '';
            for (var o in s.attributes) l += ' ' + o + '="' + (s.attributes[o] || '').replace(/"/g, '&quot;') + '"';
            return '<' + s.tag + ' class="' + s.classes.join(' ') + '"' + l + '>' + s.content + '</' + s.tag + '>';
        }),
        !e.document)
    )
        return (
            e.addEventListener &&
                (t.disableWorkerMessageHandler ||
                    e.addEventListener(
                        'message',
                        function(a) {
                            var n = JSON.parse(a.data),
                                r = n.language,
                                s = n.immediateClose;
                            e.postMessage(t.highlight(n.code, t.languages[r], r)), s && e.close();
                        },
                        !1,
                    )),
            t
        );
    var s = t.util.currentScript();
    function i() {
        t.manual || t.highlightAll();
    }
    if ((s && ((t.filename = s.src), s.hasAttribute('data-manual') && (t.manual = !0)), !t.manual)) {
        var l = document.readyState;
        'loading' === l || ('interactive' === l && s && s.defer)
            ? document.addEventListener('DOMContentLoaded', i)
            : window.requestAnimationFrame
            ? window.requestAnimationFrame(i)
            : window.setTimeout(i, 16);
    }
    return t;
})(
    'undefined' != typeof window
        ? window
        : 'undefined' != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope
        ? self
        : {},
);
'undefined' != typeof module && module.exports && (module.exports = e),
    'undefined' != typeof global && (global.Prism = e),
    (e.languages.markup = {
        comment: /<!--[\s\S]*?-->/,
        prolog: /<\?[\s\S]+?\?>/,
        doctype: {
            pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
            greedy: !0,
        },
        cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
        tag: {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s\/>])))+)?\s*\/?>/i,
            greedy: !0,
            inside: {
                tag: { pattern: /^<\/?[^\s>\/]+/i, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } },
                'attr-value': {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
                    inside: { punctuation: [/^=/, { pattern: /^(\s*)["']|["']$/, lookbehind: !0 }] },
                },
                punctuation: /\/?>/,
                'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } },
            },
        },
        entity: /&#?[\da-z]{1,8};/i,
    }),
    (e.languages.markup.tag.inside['attr-value'].inside.entity = e.languages.markup.entity),
    e.hooks.add('wrap', function(e) {
        'entity' === e.type && (e.attributes.title = e.content.replace(/&amp;/, '&'));
    }),
    Object.defineProperty(e.languages.markup.tag, 'addInlined', {
        value: function(a, n) {
            var t = {};
            (t['language-' + n] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: !0,
                inside: e.languages[n],
            }),
                (t.cdata = /^<!\[CDATA\[|\]\]>$/i);
            var r = { 'included-cdata': { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: t } };
            r['language-' + n] = { pattern: /[\s\S]+/, inside: e.languages[n] };
            var s = {};
            (s[a] = {
                pattern: RegExp(
                    '(<__[\\s\\S]*?>)(?:<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\s*|[\\s\\S])*?(?=<\\/__>)'.replace(/__/g, a),
                    'i',
                ),
                lookbehind: !0,
                greedy: !0,
                inside: r,
            }),
                e.languages.insertBefore('markup', 'cdata', s);
        },
    }),
    (e.languages.xml = e.languages.extend('markup', {})),
    (e.languages.html = e.languages.markup),
    (e.languages.mathml = e.languages.markup),
    (e.languages.svg = e.languages.markup),
    (function(e) {
        var a = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
        (e.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
                inside: {
                    rule: /^@[\w-]+/,
                    'selector-function-argument': {
                        pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
                        lookbehind: !0,
                        alias: 'selector',
                    },
                },
            },
            url: {
                pattern: RegExp('url\\((?:' + a.source + '|[^\n\r()]*)\\)', 'i'),
                inside: { function: /^url/i, punctuation: /^\(|\)$/ },
            },
            selector: RegExp('[^{}\\s](?:[^{};"\']|' + a.source + ')*?(?=\\s*\\{)'),
            string: { pattern: a, greedy: !0 },
            property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
            important: /!important\b/i,
            function: /[-a-z0-9]+(?=\()/i,
            punctuation: /[(){};:,]/,
        }),
            (e.languages.css.atrule.inside.rest = e.languages.css);
        var n = e.languages.markup;
        n &&
            (n.tag.addInlined('style', 'css'),
            e.languages.insertBefore(
                'inside',
                'attr-value',
                {
                    'style-attr': {
                        pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
                        inside: {
                            'attr-name': { pattern: /^\s*style/i, inside: n.tag.inside },
                            punctuation: /^\s*=\s*['"]|['"]\s*$/,
                            'attr-value': { pattern: /.+/i, inside: e.languages.css },
                        },
                        alias: 'language-css',
                    },
                },
                n.tag,
            ));
    })(e),
    (e.languages.clike = {
        comment: [
            { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
            { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
        ],
        string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
        'class-name': {
            pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: !0,
            inside: { punctuation: /[.\\]/ },
        },
        keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
        boolean: /\b(?:true|false)\b/,
        function: /\w+(?=\()/,
        number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
        operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*\/~^%]/,
        punctuation: /[{}[\];(),.:]/,
    }),
    (e.languages.javascript = e.languages.extend('clike', {
        'class-name': [
            e.languages.clike['class-name'],
            {
                pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
                lookbehind: !0,
            },
        ],
        keyword: [
            { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
            {
                pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: !0,
            },
        ],
        number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
        function: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        operator: /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*\/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/,
    })),
    (e.languages.javascript[
        'class-name'
    ][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/),
    e.languages.insertBefore('javascript', 'keyword', {
        regex: {
            pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^\/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
            lookbehind: !0,
            greedy: !0,
        },
        'function-variable': {
            pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
            alias: 'function',
        },
        parameter: [
            {
                pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
                lookbehind: !0,
                inside: e.languages.javascript,
            },
            { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i, inside: e.languages.javascript },
            {
                pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
                lookbehind: !0,
                inside: e.languages.javascript,
            },
            {
                pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
                lookbehind: !0,
                inside: e.languages.javascript,
            },
        ],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
    }),
    e.languages.insertBefore('javascript', 'string', {
        'template-string': {
            pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
            greedy: !0,
            inside: {
                'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
                    lookbehind: !0,
                    inside: {
                        'interpolation-punctuation': { pattern: /^\${|}$/, alias: 'punctuation' },
                        rest: e.languages.javascript,
                    },
                },
                string: /[\s\S]+/,
            },
        },
    }),
    e.languages.markup && e.languages.markup.tag.addInlined('script', 'javascript'),
    (e.languages.js = e.languages.javascript);
