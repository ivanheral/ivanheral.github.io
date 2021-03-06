function styleInject(t, e) {
    void 0 === e && (e = {});
    var n = e.insertAt;
    if (t && 'undefined' != typeof document) {
        var i = document.head || document.getElementsByTagName('head')[0],
            a = document.createElement('style');
        (a.type = 'text/css'),
            'top' === n && i.firstChild ? i.insertBefore(a, i.firstChild) : i.appendChild(a),
            a.styleSheet ? (a.styleSheet.cssText = t) : a.appendChild(document.createTextNode(t));
    }
}
function $(t, e) {
    return 'string' == typeof t ? (e || document).querySelector(t) : t || null;
}
function getOffset(t) {
    var e = t.getBoundingClientRect();
    return {
        top: e.top + (document.documentElement.scrollTop || document.body.scrollTop),
        left: e.left + (document.documentElement.scrollLeft || document.body.scrollLeft),
    };
}
function isElementInViewport(t) {
    var e = t.getBoundingClientRect();
    return (
        e.top >= 0 &&
        e.left >= 0 &&
        e.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        e.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}
function getElementContentWidth(t) {
    var e = window.getComputedStyle(t),
        n = parseFloat(e.paddingLeft) + parseFloat(e.paddingRight);
    return t.clientWidth - n;
}
function fire(t, e, n) {
    var i = document.createEvent('HTMLEvents');
    i.initEvent(e, !0, !0);
    for (var a in n) i[a] = n[a];
    return t.dispatchEvent(i);
}
function getTopOffset(t) {
    return t.titleHeight + t.margins.top + t.paddings.top;
}
function getLeftOffset(t) {
    return t.margins.left + t.paddings.left;
}
function getExtraHeight(t) {
    return t.margins.top + t.margins.bottom + t.paddings.top + t.paddings.bottom + t.titleHeight + t.legendHeight;
}
function getExtraWidth(t) {
    return t.margins.left + t.margins.right + t.paddings.left + t.paddings.right;
}
function _classCallCheck$3(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
}
function floatTwo(t) {
    return parseFloat(t.toFixed(2));
}
function fillArray(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
    n || (n = i ? t[0] : t[t.length - 1]);
    var a = new Array(Math.abs(e)).fill(n);
    return (t = i ? a.concat(t) : t.concat(a));
}
function getStringWidth(t, e) {
    return (t + '').length * e;
}
function getBarHeightAndYAttr(t, e) {
    var n = void 0,
        i = void 0;
    return t <= e ? ((n = e - t), (i = t)) : ((n = t - e), (i = e)), [n, i];
}
function equilizeNoOfElements(t, e) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : e.length - t.length;
    return n > 0 ? (t = fillArray(t, n)) : (e = fillArray(e, n)), [t, e];
}
function truncateString(t, e) {
    if (t) return t.length > e ? t.slice(0, e - 3) + '...' : t;
}
function shortenLargeNumber(t) {
    var e = void 0;
    if ('number' == typeof t) e = t;
    else if ('string' == typeof t && ((e = Number(t)), Number.isNaN(e))) return t;
    var n = Math.floor(Math.log10(Math.abs(e)));
    if (n <= 2) return e;
    var i = Math.floor(n / 3),
        a = Math.pow(10, n - 3 * i) * +(e / Math.pow(10, n)).toFixed(1);
    return Math.round(100 * a) / 100 + ' ' + ['', 'K', 'M', 'B', 'T'][i];
}
function getSplineCurvePointsStr(t, e) {
    for (var n = [], i = 0; i < t.length; i++) n.push([t[i], e[i]]);
    var a = function(t, e) {
            var n = e[0] - t[0],
                i = e[1] - t[1];
            return { length: Math.sqrt(Math.pow(n, 2) + Math.pow(i, 2)), angle: Math.atan2(i, n) };
        },
        r = function(t, e, n, i) {
            var r = a(e || t, n || t),
                s = r.angle + (i ? Math.PI : 0),
                o = 0.2 * r.length;
            return [t[0] + Math.cos(s) * o, t[1] + Math.sin(s) * o];
        };
    return (function(t, e) {
        return t.reduce(function(t, n, i, a) {
            return 0 === i ? n[0] + ',' + n[1] : t + ' ' + e(n, i, a);
        }, '');
    })(n, function(t, e, n) {
        var i = r(n[e - 1], n[e - 2], t),
            a = r(t, n[e - 1], n[e + 1], !0);
        return 'C ' + i[0] + ',' + i[1] + ' ' + a[0] + ',' + a[1] + ' ' + t[0] + ',' + t[1];
    });
}
function limitColor(t) {
    return t > 255 ? 255 : t < 0 ? 0 : t;
}
function lightenDarkenColor(t, e) {
    var n = getColor(t),
        i = !1;
    '#' == n[0] && ((n = n.slice(1)), (i = !0));
    var a = parseInt(n, 16),
        r = limitColor((a >> 16) + e),
        s = limitColor(((a >> 8) & 255) + e),
        o = limitColor((255 & a) + e);
    return (i ? '#' : '') + (o | (s << 8) | (r << 16)).toString(16);
}
function isValidColor(t) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t);
}
function $$1(t, e) {
    return 'string' == typeof t ? (e || document).querySelector(t) : t || null;
}
function createSVG(t, e) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', t);
    for (var i in e) {
        var a = e[i];
        if ('inside' === i) $$1(a).appendChild(n);
        else if ('around' === i) {
            var r = $$1(a);
            r.parentNode.insertBefore(n, r), n.appendChild(r);
        } else
            'styles' === i
                ? 'object' === (void 0 === a ? 'undefined' : _typeof$2(a)) &&
                  Object.keys(a).map(function(t) {
                      n.style[t] = a[t];
                  })
                : ('className' === i && (i = 'class'), 'innerHTML' === i ? (n.textContent = a) : n.setAttribute(i, a));
    }
    return n;
}
function renderVerticalGradient(t, e) {
    return createSVG('linearGradient', { inside: t, id: e, x1: 0, x2: 0, y1: 0, y2: 1 });
}
function setGradientStop(t, e, n, i) {
    return createSVG('stop', { inside: t, style: 'stop-color: ' + n, offset: e, 'stop-opacity': i });
}
function makeSVGContainer(t, e, n, i) {
    return createSVG('svg', { className: e, inside: t, width: n, height: i });
}
function makeSVGDefs(t) {
    return createSVG('defs', { inside: t });
}
function makeSVGGroup(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : void 0,
        i = { className: t, transform: e };
    return n && (i.inside = n), createSVG('g', i);
}
function makePath(t) {
    return createSVG('path', {
        className: arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
        d: t,
        styles: {
            stroke: arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'none',
            fill: arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 'none',
            'stroke-width': arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 2,
        },
    });
}
function makeGradient(t, e) {
    var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        i = 'path-fill-gradient-' + e + '-' + (n ? 'lighter' : 'default'),
        a = renderVerticalGradient(t, i),
        r = [1, 0.6, 0.2];
    return (
        n && (r = [0.4, 0.2, 0]),
        setGradientStop(a, '0%', e, r[0]),
        setGradientStop(a, '50%', e, r[1]),
        setGradientStop(a, '100%', e, r[2]),
        i
    );
}
function percentageBar(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : PERCENTAGE_BAR_DEFAULT_DEPTH,
        r = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 'none';
    return createSVG('rect', {
        className: 'percentage-bar',
        x: t,
        y: e,
        width: n,
        height: i,
        fill: r,
        styles: {
            stroke: lightenDarkenColor(r, -25),
            'stroke-dasharray': '0, ' + (i + n) + ', ' + n + ', ' + i,
            'stroke-width': a,
        },
    });
}
function heatSquare(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 'none',
        r = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {},
        s = { className: t, x: e, y: n, width: i, height: i, fill: a };
    return (
        Object.keys(r).map(function(t) {
            s[t] = r[t];
        }),
        createSVG('rect', s)
    );
}
function legendBar(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 'none',
        a = arguments[4];
    a = arguments.length > 5 && void 0 !== arguments[5] && arguments[5] ? truncateString(a, LABEL_MAX_CHARS) : a;
    var r = { className: 'legend-bar', x: 0, y: 0, width: n, height: '2px', fill: i },
        s = createSVG('text', {
            className: 'legend-dataset-text',
            x: 0,
            y: 0,
            dy: 2 * FONT_SIZE + 'px',
            'font-size': 1.2 * FONT_SIZE + 'px',
            'text-anchor': 'start',
            fill: FONT_FILL,
            innerHTML: a,
        }),
        o = createSVG('g', { transform: 'translate(' + t + ', ' + e + ')' });
    return o.appendChild(createSVG('rect', r)), o.appendChild(s), o;
}
function makeText(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {},
        r = a.fontSize || FONT_SIZE;
    return createSVG('text', {
        className: t,
        x: e,
        y: n,
        dy: (void 0 !== a.dy ? a.dy : r / 2) + 'px',
        'font-size': r + 'px',
        fill: a.fill || FONT_FILL,
        'text-anchor': a.textAnchor || 'start',
        innerHTML: i,
    });
}
function makeVertLine(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
    a.stroke || (a.stroke = BASE_LINE_COLOR);
    var r = createSVG('line', {
            className: 'line-vertical ' + a.className,
            x1: 0,
            x2: 0,
            y1: n,
            y2: i,
            styles: { stroke: a.stroke },
        }),
        s = createSVG('text', {
            x: 0,
            y: n > i ? n + LABEL_MARGIN : n - LABEL_MARGIN - FONT_SIZE,
            dy: FONT_SIZE + 'px',
            'font-size': FONT_SIZE + 'px',
            'text-anchor': 'middle',
            innerHTML: e + '',
        }),
        o = createSVG('g', { transform: 'translate(' + t + ', 0)' });
    return o.appendChild(r), o.appendChild(s), o;
}
function makeHoriLine(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
    a.stroke || (a.stroke = BASE_LINE_COLOR),
        a.lineType || (a.lineType = ''),
        a.shortenNumbers && (e = shortenLargeNumber(e));
    var r = createSVG('line', {
            className: 'line-horizontal ' + a.className + ('dashed' === a.lineType ? 'dashed' : ''),
            x1: n,
            x2: i,
            y1: 0,
            y2: 0,
            styles: { stroke: a.stroke },
        }),
        s = createSVG('text', {
            x: n < i ? n - LABEL_MARGIN : n + LABEL_MARGIN,
            y: 0,
            dy: FONT_SIZE / 2 - 2 + 'px',
            'font-size': FONT_SIZE + 'px',
            'text-anchor': n < i ? 'end' : 'start',
            innerHTML: e + '',
        }),
        o = createSVG('g', { transform: 'translate(0, ' + t + ')', 'stroke-opacity': 1 });
    return (0 !== s && '0' !== s) || (o.style.stroke = 'rgba(27, 31, 35, 0.6)'), o.appendChild(r), o.appendChild(s), o;
}
function yLine(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    i.pos || (i.pos = 'left'),
        i.offset || (i.offset = 0),
        i.mode || (i.mode = 'span'),
        i.stroke || (i.stroke = BASE_LINE_COLOR),
        i.className || (i.className = '');
    var a = -1 * AXIS_TICK_LENGTH,
        r = 'span' === i.mode ? n + AXIS_TICK_LENGTH : 0;
    return (
        'tick' === i.mode && 'right' === i.pos && ((a = n + AXIS_TICK_LENGTH), (r = n)),
        (a += i.offset),
        (r += i.offset),
        makeHoriLine(t, e, a, r, {
            stroke: i.stroke,
            className: i.className,
            lineType: i.lineType,
            shortenNumbers: i.shortenNumbers,
        })
    );
}
function xLine(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    i.pos || (i.pos = 'bottom'),
        i.offset || (i.offset = 0),
        i.mode || (i.mode = 'span'),
        i.stroke || (i.stroke = BASE_LINE_COLOR),
        i.className || (i.className = '');
    var a = n + AXIS_TICK_LENGTH,
        r = 'span' === i.mode ? -1 * AXIS_TICK_LENGTH : n;
    return (
        'tick' === i.mode && 'top' === i.pos && ((a = -1 * AXIS_TICK_LENGTH), (r = 0)),
        makeVertLine(t, e, a, r, { stroke: i.stroke, className: i.className, lineType: i.lineType })
    );
}
function yMarker(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    i.labelPos || (i.labelPos = 'right');
    var a = createSVG('text', {
            className: 'chart-label',
            x: 'left' === i.labelPos ? LABEL_MARGIN : n - getStringWidth(e, 5) - LABEL_MARGIN,
            y: 0,
            dy: FONT_SIZE / -2 + 'px',
            'font-size': FONT_SIZE + 'px',
            'text-anchor': 'start',
            innerHTML: e + '',
        }),
        r = makeHoriLine(t, '', 0, n, {
            stroke: i.stroke || BASE_LINE_COLOR,
            className: i.className || '',
            lineType: i.lineType,
        });
    return r.appendChild(a), r;
}
function yRegion(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {},
        r = t - e,
        s = createSVG('rect', {
            className: 'bar mini',
            styles: { fill: 'rgba(228, 234, 239, 0.49)', stroke: BASE_LINE_COLOR, 'stroke-dasharray': n + ', ' + r },
            x: 0,
            y: 0,
            width: n,
            height: r,
        });
    a.labelPos || (a.labelPos = 'right');
    var o = createSVG('text', {
            className: 'chart-label',
            x: 'left' === a.labelPos ? LABEL_MARGIN : n - getStringWidth(i + '', 4.5) - LABEL_MARGIN,
            y: 0,
            dy: FONT_SIZE / -2 + 'px',
            'font-size': FONT_SIZE + 'px',
            'text-anchor': 'start',
            innerHTML: i + '',
        }),
        l = createSVG('g', { transform: 'translate(0, ' + e + ')' });
    return l.appendChild(s), l.appendChild(o), l;
}
function datasetBar(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : '',
        r = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0,
        s = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 0,
        o = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : {},
        l = getBarHeightAndYAttr(e, o.zeroLine),
        u = _slicedToArray(l, 2),
        c = u[0],
        h = u[1];
    (h -= s), 0 === c && ((c = o.minHeight), (h -= o.minHeight));
    var d = createSVG('rect', {
        className: 'bar mini',
        style: 'fill: ' + i,
        'data-point-index': r,
        x: t,
        y: h,
        width: n,
        height: c,
    });
    if ((a += '') || a.length) {
        d.setAttribute('y', 0), d.setAttribute('x', 0);
        var f = createSVG('text', {
                className: 'data-point-value',
                x: n / 2,
                y: 0,
                dy: (FONT_SIZE / 2) * -1 + 'px',
                'font-size': FONT_SIZE + 'px',
                'text-anchor': 'middle',
                innerHTML: a,
            }),
            p = createSVG('g', { 'data-point-index': r, transform: 'translate(' + t + ', ' + h + ')' });
        return p.appendChild(d), p.appendChild(f), p;
    }
    return d;
}
function datasetDot(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : '',
        r = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0,
        s = createSVG('circle', { style: 'fill: ' + i, 'data-point-index': r, cx: t, cy: e, r: n });
    if ((a += '') || a.length) {
        s.setAttribute('cy', 0), s.setAttribute('cx', 0);
        var o = createSVG('text', {
                className: 'data-point-value',
                x: 0,
                y: 0,
                dy: (FONT_SIZE / 2) * -1 - n + 'px',
                'font-size': FONT_SIZE + 'px',
                'text-anchor': 'middle',
                innerHTML: a,
            }),
            l = createSVG('g', { 'data-point-index': r, transform: 'translate(' + t + ', ' + e + ')' });
        return l.appendChild(s), l.appendChild(o), l;
    }
    return s;
}
function getPaths(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
        a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {},
        r = e
            .map(function(e, n) {
                return t[n] + ',' + e;
            })
            .join('L');
    i.spline && (r = getSplineCurvePointsStr(t, e));
    var s = makePath('M' + r, 'line-graph-path', n);
    if (i.heatline) {
        var o = makeGradient(a.svgDefs, n);
        s.style.stroke = 'url(#' + o + ')';
    }
    var l = { path: s };
    if (i.regionFill) {
        var u = makeGradient(a.svgDefs, n, !0),
            c = 'M' + t[0] + ',' + a.zeroLine + 'L' + r + 'L' + t.slice(-1)[0] + ',' + a.zeroLine;
        l.region = makePath(c, 'region-fill', 'none', 'url(#' + u + ')');
    }
    return l;
}
function translate(t, e, n, i) {
    var a = 'string' == typeof e ? e : e.join(', ');
    return [t, { transform: n.join(', ') }, i, STD_EASING, 'translate', { transform: a }];
}
function translateVertLine(t, e, n) {
    return translate(t, [n, 0], [e, 0], MARKER_LINE_ANIM_DUR);
}
function translateHoriLine(t, e, n) {
    return translate(t, [0, n], [0, e], MARKER_LINE_ANIM_DUR);
}
function animateRegion(t, e, n, i) {
    var a = e - n,
        r = t.childNodes[0];
    return [
        [r, { height: a, 'stroke-dasharray': r.getAttribute('width') + ', ' + a }, MARKER_LINE_ANIM_DUR, STD_EASING],
        translate(t, [0, i], [0, n], MARKER_LINE_ANIM_DUR),
    ];
}
function animateBar(t, e, n, i) {
    var a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
        r = getBarHeightAndYAttr(n, (arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {}).zeroLine),
        s = _slicedToArray$2(r, 2),
        o = s[0],
        l = s[1];
    return (
        (l -= a),
        'rect' !== t.nodeName
            ? [
                  [t.childNodes[0], { width: i, height: o }, UNIT_ANIM_DUR, STD_EASING],
                  translate(
                      t,
                      t
                          .getAttribute('transform')
                          .split('(')[1]
                          .slice(0, -1),
                      [e, l],
                      MARKER_LINE_ANIM_DUR,
                  ),
              ]
            : [[t, { width: i, height: o, x: e, y: l }, UNIT_ANIM_DUR, STD_EASING]]
    );
}
function animateDot(t, e, n) {
    return 'circle' !== t.nodeName
        ? [
              translate(
                  t,
                  t
                      .getAttribute('transform')
                      .split('(')[1]
                      .slice(0, -1),
                  [e, n],
                  MARKER_LINE_ANIM_DUR,
              ),
          ]
        : [[t, { cx: e, cy: n }, UNIT_ANIM_DUR, STD_EASING]];
}
function animatePath(t, e, n, i, a) {
    var r = [],
        s = n
            .map(function(t, n) {
                return e[n] + ',' + t;
            })
            .join('L');
    a && (s = getSplineCurvePointsStr(e, n));
    var o = [t.path, { d: 'M' + s }, PATH_ANIM_DUR, STD_EASING];
    if ((r.push(o), t.region)) {
        var l = e[0] + ',' + i + 'L',
            u = 'L' + e.slice(-1)[0] + ', ' + i,
            c = [t.region, { d: 'M' + l + s + u }, PATH_ANIM_DUR, STD_EASING];
        r.push(c);
    }
    return r;
}
function animatePathStr(t, e) {
    return [t, { d: e }, UNIT_ANIM_DUR, STD_EASING];
}
function _toConsumableArray$1(t) {
    if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
    }
    return Array.from(t);
}
function animateSVGElement(t, e, n) {
    var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 'linear',
        a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : void 0,
        r = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : {},
        s = t.cloneNode(!0),
        o = t.cloneNode(!0);
    for (var l in e) {
        var u = void 0;
        u =
            'transform' === l
                ? document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform')
                : document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        var c = r[l] || t.getAttribute(l),
            h = e[l],
            d = {
                attributeName: l,
                from: c,
                to: h,
                begin: '0s',
                dur: n / 1e3 + 's',
                values: c + ';' + h,
                keySplines: EASING[i],
                keyTimes: '0;1',
                calcMode: 'spline',
                fill: 'freeze',
            };
        a && (d.type = a);
        for (var f in d) u.setAttribute(f, d[f]);
        s.appendChild(u), a ? o.setAttribute(l, 'translate(' + h + ')') : o.setAttribute(l, h);
    }
    return [s, o];
}
function animateSVG(t, e) {
    var n = [],
        i = [];
    e.map(function(t) {
        var e = t[0],
            a = e.parentNode,
            r = void 0,
            s = void 0;
        t[0] = e;
        var o = animateSVGElement.apply(void 0, _toConsumableArray$1(t)),
            l = _slicedToArray$1(o, 2);
        (r = l[0]), (s = l[1]), n.push(s), i.push([r, a]), a.replaceChild(r, e);
    });
    var a = t.cloneNode(!0);
    return (
        i.map(function(t, i) {
            t[1].replaceChild(n[i], t[0]), (e[i][0] = n[i]);
        }),
        a
    );
}
function runSMILAnimation(t, e, n) {
    if (0 !== n.length) {
        var i = animateSVG(e, n);
        e.parentNode == t && (t.removeChild(e), t.appendChild(i)),
            setTimeout(function() {
                i.parentNode == t && (t.removeChild(i), t.appendChild(e));
            }, REPLACE_ALL_NEW_DUR);
    }
}
function downloadFile(t, e) {
    var n = document.createElement('a');
    n.style = 'display: none';
    var i = new Blob(e, { type: 'image/svg+xml; charset=utf-8' }),
        a = window.URL.createObjectURL(i);
    (n.href = a),
        (n.download = t),
        document.body.appendChild(n),
        n.click(),
        setTimeout(function() {
            document.body.removeChild(n), window.URL.revokeObjectURL(a);
        }, 300);
}
function prepareForExport(t) {
    var e = t.cloneNode(!0);
    e.classList.add('chart-container'),
        e.setAttribute('xmlns', 'http://www.w3.org/2000/svg'),
        e.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    var n = $.create('style', { innerHTML: CSSTEXT });
    e.insertBefore(n, e.firstChild);
    var i = $.create('div');
    return i.appendChild(e), i.innerHTML;
}
function _classCallCheck$2(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
}
function dataPrep(t, e) {
    t.labels = t.labels || [];
    var n = t.labels.length,
        i = t.datasets,
        a = new Array(n).fill(0);
    return (
        i || (i = [{ values: a }]),
        i.map(function(t) {
            if (t.values) {
                var i = t.values;
                i =
                    (i = i.map(function(t) {
                        return isNaN(t) ? 0 : t;
                    })).length > n
                        ? i.slice(0, n)
                        : fillArray(i, n - i.length, 0);
            } else t.values = a;
            t.chartType || (AXIS_DATASET_CHART_TYPES.includes(e), (t.chartType = e));
        }),
        t.yRegions &&
            t.yRegions.map(function(t) {
                if (t.end < t.start) {
                    var e = [t.end, t.start];
                    (t.start = e[0]), (t.end = e[1]);
                }
            }),
        t
    );
}
function zeroDataPrep(t) {
    var e = t.labels.length,
        n = new Array(e).fill(0),
        i = {
            labels: t.labels.slice(0, -1),
            datasets: t.datasets.map(function(t) {
                return { name: '', values: n.slice(0, -1), chartType: t.chartType };
            }),
        };
    return (
        t.yMarkers && (i.yMarkers = [{ value: 0, label: '' }]),
        t.yRegions && (i.yRegions = [{ start: 0, end: 0, label: '' }]),
        i
    );
}
function getShortenedLabels(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
        n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
        i = t / e.length;
    i <= 0 && (i = 1);
    var a = i / DEFAULT_CHAR_WIDTH;
    return e.map(function(t, e) {
        return (
            (t += '').length > a &&
                (n
                    ? e % Math.ceil(t.length / a) != 0 && (t = '')
                    : (t = a - 3 > 0 ? t.slice(0, a - 3) + ' ...' : t.slice(0, a) + '..')),
            t
        );
    });
}
function getMonthName(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        n = MONTH_NAMES[t];
    return e ? n.slice(0, 3) : n;
}
function _classCallCheck$4(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
}
function getComponent(t, e, n) {
    var i = Object.keys(componentConfigs).filter(function(e) {
            return t.includes(e);
        }),
        a = componentConfigs[i[0]];
    return Object.assign(a, { constants: e, getData: n }), new ChartComponent(a);
}
function _toConsumableArray$2(t) {
    if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
    }
    return Array.from(t);
}
function normalize(t) {
    if (0 === t) return [0, 0];
    if (isNaN(t)) return { mantissa: -6755399441055744, exponent: 972 };
    var e = t > 0 ? 1 : -1;
    if (!isFinite(t)) return { mantissa: 4503599627370496 * e, exponent: 972 };
    t = Math.abs(t);
    var n = Math.floor(Math.log10(t));
    return [e * (t / Math.pow(10, n)), n];
}
function getChartRangeIntervals(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        n = Math.ceil(t),
        i = Math.floor(e),
        a = n - i,
        r = a,
        s = 1;
    a > 5 && (a % 2 != 0 && (a = ++n - i), (r = a / 2), (s = 2)),
        a <= 2 && (s = a / (r = 4)),
        0 === a && ((r = 5), (s = 1));
    for (var o = [], l = 0; l <= r; l++) o.push(i + s * l);
    return o;
}
function getChartIntervals(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
        n = normalize(t),
        i = _slicedToArray$4(n, 2),
        a = i[0],
        r = i[1],
        s = e ? e / Math.pow(10, r) : 0,
        o = getChartRangeIntervals((a = a.toFixed(6)), s);
    return (o = o.map(function(t) {
        return t * Math.pow(10, r);
    }));
}
function calcChartIntervals(t) {
    function e(t, e) {
        for (var n = getChartIntervals(t), i = n[1] - n[0], a = 0, r = 1; a < e; r++) (a += i), n.unshift(-1 * a);
        return n;
    }
    var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
        i = Math.max.apply(Math, _toConsumableArray$2(t)),
        a = Math.min.apply(Math, _toConsumableArray$2(t)),
        r = [];
    if (i >= 0 && a >= 0) normalize(i)[1], (r = n ? getChartIntervals(i, a) : getChartIntervals(i));
    else if (i > 0 && a < 0) {
        var s = Math.abs(a);
        i >= s
            ? (normalize(i)[1], (r = e(i, s)))
            : (normalize(s)[1],
              (r = e(s, i).map(function(t) {
                  return -1 * t;
              })));
    } else if (i <= 0 && a <= 0) {
        var o = Math.abs(a),
            l = Math.abs(i);
        normalize(o)[1],
            (r = (r = n ? getChartIntervals(o, l) : getChartIntervals(o)).reverse().map(function(t) {
                return -1 * t;
            }));
    }
    return r;
}
function getZeroIndex(t) {
    var e = getIntervalSize(t);
    return t.indexOf(0) >= 0 ? t.indexOf(0) : t[0] > 0 ? (-1 * t[0]) / e : (-1 * t[t.length - 1]) / e + (t.length - 1);
}
function getIntervalSize(t) {
    return t[1] - t[0];
}
function getValueRange(t) {
    return t[t.length - 1] - t[0];
}
function scale(t, e) {
    return floatTwo(e.zeroLine - t * e.scaleMultiplier);
}
function getClosestInArray(t, e) {
    var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
        i = e.reduce(function(e, n) {
            return Math.abs(n - t) < Math.abs(e - t) ? n : e;
        }, []);
    return n ? e.indexOf(i) : i;
}
function _toConsumableArray(t) {
    if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
    }
    return Array.from(t);
}
function _classCallCheck$1(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
}
function _possibleConstructorReturn(t, e) {
    if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !e || ('object' != typeof e && 'function' != typeof e) ? t : e;
}
function _inherits(t, e) {
    if ('function' != typeof e && null !== e)
        throw new TypeError('Super expression must either be null or a function, not ' + typeof e);
    (t.prototype = Object.create(e && e.prototype, {
        constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 },
    })),
        e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
}
function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
}
function getChartByType() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'line',
        e = arguments[1],
        n = arguments[2];
    return 'axis-mixed' === t
        ? ((n.type = 'line'), new AxisChart(e, n))
        : chartTypes[t]
        ? new chartTypes[t](e, n)
        : void console.error('Undefined chart type: ' + t);
}
var css =
    '.chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ol,.graph-svg-tip ul{padding-left:0;display:-webkit-box;display:-ms-flexbox;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;-webkit-box-flex:1;-ms-flex:1;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:" ";border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}';
styleInject(css);
var asyncGenerator = (function() {
        function t(t) {
            this.value = t;
        }
        function e(e) {
            function n(t, e) {
                return new Promise(function(n, a) {
                    var o = { key: t, arg: e, resolve: n, reject: a, next: null };
                    s ? (s = s.next = o) : ((r = s = o), i(t, e));
                });
            }
            function i(n, r) {
                try {
                    var s = e[n](r),
                        o = s.value;
                    o instanceof t
                        ? Promise.resolve(o.value).then(
                              function(t) {
                                  i('next', t);
                              },
                              function(t) {
                                  i('throw', t);
                              },
                          )
                        : a(s.done ? 'return' : 'normal', s.value);
                } catch (t) {
                    a('throw', t);
                }
            }
            function a(t, e) {
                switch (t) {
                    case 'return':
                        r.resolve({ value: e, done: !0 });
                        break;
                    case 'throw':
                        r.reject(e);
                        break;
                    default:
                        r.resolve({ value: e, done: !1 });
                }
                (r = r.next) ? i(r.key, r.arg) : (s = null);
            }
            var r, s;
            (this._invoke = n), 'function' != typeof e.return && (this.return = void 0);
        }
        return (
            'function' == typeof Symbol &&
                Symbol.asyncIterator &&
                (e.prototype[Symbol.asyncIterator] = function() {
                    return this;
                }),
            (e.prototype.next = function(t) {
                return this._invoke('next', t);
            }),
            (e.prototype.throw = function(t) {
                return this._invoke('throw', t);
            }),
            (e.prototype.return = function(t) {
                return this._invoke('return', t);
            }),
            {
                wrap: function(t) {
                    return function() {
                        return new e(t.apply(this, arguments));
                    };
                },
                await: function(e) {
                    return new t(e);
                },
            }
        );
    })(),
    _typeof =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function(t) {
                  return typeof t;
              }
            : function(t) {
                  return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
              };
$.create = function(t, e) {
    var n = document.createElement(t);
    for (var i in e) {
        var a = e[i];
        if ('inside' === i) $(a).appendChild(n);
        else if ('around' === i) {
            var r = $(a);
            r.parentNode.insertBefore(n, r), n.appendChild(r);
        } else
            'styles' === i
                ? 'object' === (void 0 === a ? 'undefined' : _typeof(a)) &&
                  Object.keys(a).map(function(t) {
                      n.style[t] = a[t];
                  })
                : i in n
                ? (n[i] = a)
                : n.setAttribute(i, a);
    }
    return n;
};
var BASE_MEASURES = {
        margins: { top: 10, bottom: 10, left: 20, right: 20 },
        paddings: { top: 20, bottom: 40, left: 30, right: 10 },
        baseHeight: 240,
        titleHeight: 20,
        legendHeight: 30,
        titleFontSize: 12,
    },
    INIT_CHART_UPDATE_TIMEOUT = 700,
    CHART_POST_ANIMATE_TIMEOUT = 400,
    DEFAULT_AXIS_CHART_TYPE = 'line',
    AXIS_DATASET_CHART_TYPES = ['line', 'bar'],
    AXIS_LEGEND_BAR_SIZE = 100,
    BAR_CHART_SPACE_RATIO = 0.5,
    MIN_BAR_PERCENT_HEIGHT = 0,
    LINE_CHART_DOT_SIZE = 4,
    DOT_OVERLAY_SIZE_INCR = 4,
    PERCENTAGE_BAR_DEFAULT_DEPTH = 2,
    DEFAULT_CHAR_WIDTH = 7,
    TOOLTIP_POINTER_TRIANGLE_HEIGHT = 5,
    DEFAULT_CHART_COLORS = [
        'light-blue',
        'blue',
        'violet',
        'red',
        'orange',
        'yellow',
        'green',
        'light-green',
        'purple',
        'magenta',
        'light-grey',
        'dark-grey',
    ],
    HEATMAP_COLORS_GREEN = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
    DEFAULT_COLORS = {
        bar: DEFAULT_CHART_COLORS,
        line: DEFAULT_CHART_COLORS,
        pie: DEFAULT_CHART_COLORS,
        percentage: DEFAULT_CHART_COLORS,
        heatmap: HEATMAP_COLORS_GREEN,
        donut: DEFAULT_CHART_COLORS,
    },
    _createClass$2 = (function() {
        function t(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                (i.enumerable = i.enumerable || !1),
                    (i.configurable = !0),
                    'value' in i && (i.writable = !0),
                    Object.defineProperty(t, i.key, i);
            }
        }
        return function(e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
        };
    })(),
    SvgTip = (function() {
        function t(e) {
            var n = e.parent,
                i = void 0 === n ? null : n,
                a = e.colors,
                r = void 0 === a ? [] : a;
            _classCallCheck$3(this, t),
                (this.parent = i),
                (this.colors = r),
                (this.titleName = ''),
                (this.titleValue = ''),
                (this.listValues = []),
                (this.titleValueFirst = 0),
                (this.x = 0),
                (this.y = 0),
                (this.top = 0),
                (this.left = 0),
                this.setup();
        }
        return (
            _createClass$2(t, [
                {
                    key: 'setup',
                    value: function() {
                        this.makeTooltip();
                    },
                },
                {
                    key: 'refresh',
                    value: function() {
                        this.fill(), this.calcPosition();
                    },
                },
                {
                    key: 'makeTooltip',
                    value: function() {
                        var t = this;
                        (this.container = $.create('div', {
                            inside: this.parent,
                            className: 'graph-svg-tip comparison',
                            innerHTML:
                                '<span class="title"></span>\n\t\t\t\t<ul class="data-point-list"></ul>\n\t\t\t\t<div class="svg-pointer"></div>',
                        })),
                            this.hideTip(),
                            (this.title = this.container.querySelector('.title')),
                            (this.dataPointList = this.container.querySelector('.data-point-list')),
                            this.parent.addEventListener('mouseleave', function() {
                                t.hideTip();
                            });
                    },
                },
                {
                    key: 'fill',
                    value: function() {
                        var t = this,
                            e = void 0;
                        this.index && this.container.setAttribute('data-point-index', this.index),
                            (e = this.titleValueFirst
                                ? '<strong>' + this.titleValue + '</strong>' + this.titleName
                                : this.titleName + '<strong>' + this.titleValue + '</strong>'),
                            (this.title.innerHTML = e),
                            (this.dataPointList.innerHTML = ''),
                            this.listValues.map(function(e, n) {
                                var i = t.colors[n] || 'black',
                                    a = 0 === e.formatted || e.formatted ? e.formatted : e.value,
                                    r = $.create('li', {
                                        styles: { 'border-top': '3px solid ' + i },
                                        innerHTML:
                                            '<strong style="display: block;">' +
                                            (0 === a || a ? a : '') +
                                            '</strong>\n\t\t\t\t\t' +
                                            (e.title ? e.title : ''),
                                    });
                                t.dataPointList.appendChild(r);
                            });
                    },
                },
                {
                    key: 'calcPosition',
                    value: function() {
                        var t = this.container.offsetWidth;
                        (this.top = this.y - this.container.offsetHeight - TOOLTIP_POINTER_TRIANGLE_HEIGHT),
                            (this.left = this.x - t / 2);
                        var e = this.parent.offsetWidth - t,
                            n = this.container.querySelector('.svg-pointer');
                        if (this.left < 0) (n.style.left = 'calc(50% - ' + -1 * this.left + 'px)'), (this.left = 0);
                        else if (this.left > e) {
                            var i = 'calc(50% + ' + (this.left - e) + 'px)';
                            (n.style.left = i), (this.left = e);
                        } else n.style.left = '50%';
                    },
                },
                {
                    key: 'setValues',
                    value: function(t, e) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                            i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : [],
                            a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : -1;
                        (this.titleName = n.name),
                            (this.titleValue = n.value),
                            (this.listValues = i),
                            (this.x = t),
                            (this.y = e),
                            (this.titleValueFirst = n.valueFirst || 0),
                            (this.index = a),
                            this.refresh();
                    },
                },
                {
                    key: 'hideTip',
                    value: function() {
                        (this.container.style.top = '0px'),
                            (this.container.style.left = '0px'),
                            (this.container.style.opacity = '0');
                    },
                },
                {
                    key: 'showTip',
                    value: function() {
                        (this.container.style.top = this.top + 'px'),
                            (this.container.style.left = this.left + 'px'),
                            (this.container.style.opacity = '1');
                    },
                },
            ]),
            t
        );
    })(),
    PRESET_COLOR_MAP = {
        'light-blue': '#7cd6fd',
        blue: '#5e64ff',
        violet: '#743ee2',
        red: '#ff5858',
        orange: '#ffa00a',
        yellow: '#feef72',
        green: '#28a745',
        'light-green': '#98d85b',
        purple: '#b554ff',
        magenta: '#ffa3ef',
        black: '#36114C',
        grey: '#bdd3e6',
        'light-grey': '#f0f4f7',
        'dark-grey': '#b8c2cc',
    },
    getColor = function(t) {
        return PRESET_COLOR_MAP[t] || t;
    },
    _slicedToArray = (function() {
        function t(t, e) {
            var n = [],
                i = !0,
                a = !1,
                r = void 0;
            try {
                for (
                    var s, o = t[Symbol.iterator]();
                    !(i = (s = o.next()).done) && (n.push(s.value), !e || n.length !== e);
                    i = !0
                );
            } catch (t) {
                (a = !0), (r = t);
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (a) throw r;
                }
            }
            return n;
        }
        return function(e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
        };
    })(),
    _typeof$2 =
        'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function(t) {
                  return typeof t;
              }
            : function(t) {
                  return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype
                      ? 'symbol'
                      : typeof t;
              },
    AXIS_TICK_LENGTH = 6,
    LABEL_MARGIN = 4,
    LABEL_MAX_CHARS = 15,
    FONT_SIZE = 10,
    BASE_LINE_COLOR = '#dadada',
    FONT_FILL = '#555b51',
    makeOverlay = {
        bar: function(t) {
            var e = void 0;
            'rect' !== t.nodeName && ((e = t.getAttribute('transform')), (t = t.childNodes[0]));
            var n = t.cloneNode();
            return (n.style.fill = '#000000'), (n.style.opacity = '0.4'), e && n.setAttribute('transform', e), n;
        },
        dot: function(t) {
            var e = void 0;
            'circle' !== t.nodeName && ((e = t.getAttribute('transform')), (t = t.childNodes[0]));
            var n = t.cloneNode(),
                i = t.getAttribute('r'),
                a = t.getAttribute('fill');
            return (
                n.setAttribute('r', parseInt(i) + DOT_OVERLAY_SIZE_INCR),
                n.setAttribute('fill', a),
                (n.style.opacity = '0.6'),
                e && n.setAttribute('transform', e),
                n
            );
        },
        heat_square: function(t) {
            var e = void 0;
            'circle' !== t.nodeName && ((e = t.getAttribute('transform')), (t = t.childNodes[0]));
            var n = t.cloneNode(),
                i = t.getAttribute('r'),
                a = t.getAttribute('fill');
            return (
                n.setAttribute('r', parseInt(i) + DOT_OVERLAY_SIZE_INCR),
                n.setAttribute('fill', a),
                (n.style.opacity = '0.6'),
                e && n.setAttribute('transform', e),
                n
            );
        },
    },
    updateOverlay = {
        bar: function(t, e) {
            var n = void 0;
            'rect' !== t.nodeName && ((n = t.getAttribute('transform')), (t = t.childNodes[0]));
            var i = ['x', 'y', 'width', 'height'];
            Object.values(t.attributes)
                .filter(function(t) {
                    return i.includes(t.name) && t.specified;
                })
                .map(function(t) {
                    e.setAttribute(t.name, t.nodeValue);
                }),
                n && e.setAttribute('transform', n);
        },
        dot: function(t, e) {
            var n = void 0;
            'circle' !== t.nodeName && ((n = t.getAttribute('transform')), (t = t.childNodes[0]));
            var i = ['cx', 'cy'];
            Object.values(t.attributes)
                .filter(function(t) {
                    return i.includes(t.name) && t.specified;
                })
                .map(function(t) {
                    e.setAttribute(t.name, t.nodeValue);
                }),
                n && e.setAttribute('transform', n);
        },
        heat_square: function(t, e) {
            var n = void 0;
            'circle' !== t.nodeName && ((n = t.getAttribute('transform')), (t = t.childNodes[0]));
            var i = ['cx', 'cy'];
            Object.values(t.attributes)
                .filter(function(t) {
                    return i.includes(t.name) && t.specified;
                })
                .map(function(t) {
                    e.setAttribute(t.name, t.nodeValue);
                }),
                n && e.setAttribute('transform', n);
        },
    },
    _slicedToArray$2 = (function() {
        function t(t, e) {
            var n = [],
                i = !0,
                a = !1,
                r = void 0;
            try {
                for (
                    var s, o = t[Symbol.iterator]();
                    !(i = (s = o.next()).done) && (n.push(s.value), !e || n.length !== e);
                    i = !0
                );
            } catch (t) {
                (a = !0), (r = t);
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (a) throw r;
                }
            }
            return n;
        }
        return function(e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
        };
    })(),
    UNIT_ANIM_DUR = 350,
    PATH_ANIM_DUR = 350,
    MARKER_LINE_ANIM_DUR = UNIT_ANIM_DUR,
    REPLACE_ALL_NEW_DUR = 250,
    STD_EASING = 'easein',
    _slicedToArray$1 = (function() {
        function t(t, e) {
            var n = [],
                i = !0,
                a = !1,
                r = void 0;
            try {
                for (
                    var s, o = t[Symbol.iterator]();
                    !(i = (s = o.next()).done) && (n.push(s.value), !e || n.length !== e);
                    i = !0
                );
            } catch (t) {
                (a = !0), (r = t);
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (a) throw r;
                }
            }
            return n;
        }
        return function(e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
        };
    })(),
    EASING = {
        ease: '0.25 0.1 0.25 1',
        linear: '0 0 1 1',
        easein: '0.1 0.8 0.2 1',
        easeout: '0 0 0.58 1',
        easeinout: '0.42 0 0.58 1',
    },
    CSSTEXT =
        ".chart-container{position:relative;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif}.chart-container .axis,.chart-container .chart-label{fill:#555b51}.chart-container .axis line,.chart-container .chart-label line{stroke:#dadada}.chart-container .dataset-units circle{stroke:#fff;stroke-width:2}.chart-container .dataset-units path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container .dataset-path{stroke-width:2px}.chart-container .path-group path{fill:none;stroke-opacity:1;stroke-width:2px}.chart-container line.dashed{stroke-dasharray:5,3}.chart-container .axis-line .specific-value{text-anchor:start}.chart-container .axis-line .y-line{text-anchor:end}.chart-container .axis-line .x-line{text-anchor:middle}.chart-container .legend-dataset-text{fill:#6c7680;font-weight:600}.graph-svg-tip{position:absolute;z-index:99999;padding:10px;font-size:12px;color:#959da5;text-align:center;background:rgba(0,0,0,.8);border-radius:3px}.graph-svg-tip ul{padding-left:0;display:flex}.graph-svg-tip ol{padding-left:0;display:flex}.graph-svg-tip ul.data-point-list li{min-width:90px;flex:1;font-weight:600}.graph-svg-tip strong{color:#dfe2e5;font-weight:600}.graph-svg-tip .svg-pointer{position:absolute;height:5px;margin:0 0 0 -5px;content:' ';border:5px solid transparent;border-top-color:rgba(0,0,0,.8)}.graph-svg-tip.comparison{padding:0;text-align:left;pointer-events:none}.graph-svg-tip.comparison .title{display:block;padding:10px;margin:0;font-weight:600;line-height:1;pointer-events:none}.graph-svg-tip.comparison ul{margin:0;white-space:nowrap;list-style:none}.graph-svg-tip.comparison li{display:inline-block;padding:5px 10px}",
    _createClass$1 = (function() {
        function t(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                (i.enumerable = i.enumerable || !1),
                    (i.configurable = !0),
                    'value' in i && (i.writable = !0),
                    Object.defineProperty(t, i.key, i);
            }
        }
        return function(e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
        };
    })(),
    BaseChart = (function() {
        function t(e, n) {
            if (
                (_classCallCheck$2(this, t),
                (this.parent = 'string' == typeof e ? document.querySelector(e) : e),
                !(this.parent instanceof HTMLElement))
            )
                throw new Error('No `parent` element to render on was provided.');
            (this.rawChartArgs = n),
                (this.title = n.title || ''),
                (this.type = n.type || ''),
                (this.realData = this.prepareData(n.data)),
                (this.data = this.prepareFirstData(this.realData)),
                (this.colors = this.validateColors(n.colors, this.type)),
                (this.config = {
                    showTooltip: 1,
                    showLegend: 1,
                    isNavigable: n.isNavigable || 0,
                    animate: void 0 !== n.animate ? n.animate : 1,
                    truncateLegends: n.truncateLegends || 0,
                }),
                (this.measures = JSON.parse(JSON.stringify(BASE_MEASURES)));
            var i = this.measures;
            this.setMeasures(n),
                this.title.length || (i.titleHeight = 0),
                this.config.showLegend || (i.legendHeight = 0),
                (this.argHeight = n.height || i.baseHeight),
                (this.state = {}),
                (this.options = {}),
                (this.initTimeout = INIT_CHART_UPDATE_TIMEOUT),
                this.config.isNavigable && (this.overlays = []),
                this.configure(n);
        }
        return (
            _createClass$1(t, [
                {
                    key: 'prepareData',
                    value: function(t) {
                        return t;
                    },
                },
                {
                    key: 'prepareFirstData',
                    value: function(t) {
                        return t;
                    },
                },
                {
                    key: 'validateColors',
                    value: function(t, e) {
                        var n = [];
                        return (
                            (t = (t || []).concat(DEFAULT_COLORS[e])).forEach(function(t) {
                                var e = getColor(t);
                                isValidColor(e) ? n.push(e) : console.warn('"' + t + '" is not a valid color.');
                            }),
                            n
                        );
                    },
                },
                { key: 'setMeasures', value: function() {} },
                {
                    key: 'configure',
                    value: function() {
                        var t = this,
                            e = this.argHeight;
                        (this.baseHeight = e),
                            (this.height = e - getExtraHeight(this.measures)),
                            (this.boundDrawFn = function() {
                                return t.draw(!0);
                            }),
                            window.addEventListener('resize', this.boundDrawFn),
                            window.addEventListener('orientationchange', this.boundDrawFn);
                    },
                },
                {
                    key: 'destroy',
                    value: function() {
                        window.removeEventListener('resize', this.boundDrawFn),
                            window.removeEventListener('orientationchange', this.boundDrawFn);
                    },
                },
                {
                    key: 'setup',
                    value: function() {
                        this.makeContainer(), this.updateWidth(), this.makeTooltip(), this.draw(!1, !0);
                    },
                },
                {
                    key: 'makeContainer',
                    value: function() {
                        this.parent.innerHTML = '';
                        var t = { inside: this.parent, className: 'chart-container' };
                        this.independentWidth && (t.styles = { width: this.independentWidth + 'px' }),
                            (this.container = $.create('div', t));
                    },
                },
                {
                    key: 'makeTooltip',
                    value: function() {
                        (this.tip = new SvgTip({ parent: this.container, colors: this.colors })), this.bindTooltip();
                    },
                },
                { key: 'bindTooltip', value: function() {} },
                {
                    key: 'draw',
                    value: function() {
                        var t = this,
                            e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                            n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        this.updateWidth(),
                            this.calc(e),
                            this.makeChartArea(),
                            this.setupComponents(),
                            this.components.forEach(function(e) {
                                return e.setup(t.drawArea);
                            }),
                            this.render(this.components, !1),
                            n &&
                                ((this.data = this.realData),
                                setTimeout(function() {
                                    t.update(t.data);
                                }, this.initTimeout)),
                            this.renderLegend(),
                            this.setupNavigation(n);
                    },
                },
                { key: 'calc', value: function() {} },
                {
                    key: 'updateWidth',
                    value: function() {
                        (this.baseWidth = getElementContentWidth(this.parent)),
                            (this.width = this.baseWidth - getExtraWidth(this.measures));
                    },
                },
                {
                    key: 'makeChartArea',
                    value: function() {
                        this.svg && this.container.removeChild(this.svg);
                        var t = this.measures;
                        (this.svg = makeSVGContainer(
                            this.container,
                            'frappe-chart chart',
                            this.baseWidth,
                            this.baseHeight,
                        )),
                            (this.svgDefs = makeSVGDefs(this.svg)),
                            this.title.length &&
                                (this.titleEL = makeText('title', t.margins.left, t.margins.top, this.title, {
                                    fontSize: t.titleFontSize,
                                    fill: '#666666',
                                    dy: t.titleFontSize,
                                }));
                        var e = getTopOffset(t);
                        (this.drawArea = makeSVGGroup(
                            this.type + '-chart chart-draw-area',
                            'translate(' + getLeftOffset(t) + ', ' + e + ')',
                        )),
                            this.config.showLegend &&
                                ((e += this.height + t.paddings.bottom),
                                (this.legendArea = makeSVGGroup(
                                    'chart-legend',
                                    'translate(' + getLeftOffset(t) + ', ' + e + ')',
                                ))),
                            this.title.length && this.svg.appendChild(this.titleEL),
                            this.svg.appendChild(this.drawArea),
                            this.config.showLegend && this.svg.appendChild(this.legendArea),
                            this.updateTipOffset(getLeftOffset(t), getTopOffset(t));
                    },
                },
                {
                    key: 'updateTipOffset',
                    value: function(t, e) {
                        this.tip.offset = { x: t, y: e };
                    },
                },
                {
                    key: 'setupComponents',
                    value: function() {
                        this.components = new Map();
                    },
                },
                {
                    key: 'update',
                    value: function(t) {
                        t || console.error('No data to update.'),
                            (this.data = this.prepareData(t)),
                            this.calc(),
                            this.render(this.components, this.config.animate);
                    },
                },
                {
                    key: 'render',
                    value: function() {
                        var t = this,
                            e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.components,
                            n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                        this.config.isNavigable &&
                            this.overlays.map(function(t) {
                                return t.parentNode.removeChild(t);
                            });
                        var i = [];
                        e.forEach(function(t) {
                            i = i.concat(t.update(n));
                        }),
                            i.length > 0
                                ? (runSMILAnimation(this.container, this.svg, i),
                                  setTimeout(function() {
                                      e.forEach(function(t) {
                                          return t.make();
                                      }),
                                          t.updateNav();
                                  }, CHART_POST_ANIMATE_TIMEOUT))
                                : (e.forEach(function(t) {
                                      return t.make();
                                  }),
                                  this.updateNav());
                    },
                },
                {
                    key: 'updateNav',
                    value: function() {
                        this.config.isNavigable && (this.makeOverlay(), this.bindUnits());
                    },
                },
                { key: 'renderLegend', value: function() {} },
                {
                    key: 'setupNavigation',
                    value: function() {
                        var t = this,
                            e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                        this.config.isNavigable &&
                            e &&
                            (this.bindOverlay(),
                            (this.keyActions = {
                                13: this.onEnterKey.bind(this),
                                37: this.onLeftArrow.bind(this),
                                38: this.onUpArrow.bind(this),
                                39: this.onRightArrow.bind(this),
                                40: this.onDownArrow.bind(this),
                            }),
                            document.addEventListener('keydown', function(e) {
                                isElementInViewport(t.container) &&
                                    ((e = e || window.event), t.keyActions[e.keyCode] && t.keyActions[e.keyCode]());
                            }));
                    },
                },
                { key: 'makeOverlay', value: function() {} },
                { key: 'updateOverlay', value: function() {} },
                { key: 'bindOverlay', value: function() {} },
                { key: 'bindUnits', value: function() {} },
                { key: 'onLeftArrow', value: function() {} },
                { key: 'onRightArrow', value: function() {} },
                { key: 'onUpArrow', value: function() {} },
                { key: 'onDownArrow', value: function() {} },
                { key: 'onEnterKey', value: function() {} },
                { key: 'addDataPoint', value: function() {} },
                { key: 'removeDataPoint', value: function() {} },
                { key: 'getDataPoint', value: function() {} },
                { key: 'setCurrentDataPoint', value: function() {} },
                { key: 'updateDataset', value: function() {} },
                {
                    key: 'export',
                    value: function() {
                        var t = prepareForExport(this.svg);
                        downloadFile(this.title || 'Chart', [t]);
                    },
                },
            ]),
            t
        );
    })(),
    MONTH_NAMES = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    _slicedToArray$3 = (function() {
        function t(t, e) {
            var n = [],
                i = !0,
                a = !1,
                r = void 0;
            try {
                for (
                    var s, o = t[Symbol.iterator]();
                    !(i = (s = o.next()).done) && (n.push(s.value), !e || n.length !== e);
                    i = !0
                );
            } catch (t) {
                (a = !0), (r = t);
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (a) throw r;
                }
            }
            return n;
        }
        return function(e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
        };
    })(),
    _createClass$3 = (function() {
        function t(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                (i.enumerable = i.enumerable || !1),
                    (i.configurable = !0),
                    'value' in i && (i.writable = !0),
                    Object.defineProperty(t, i.key, i);
            }
        }
        return function(e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
        };
    })(),
    ChartComponent = (function() {
        function t(e) {
            var n = e.layerClass,
                i = void 0 === n ? '' : n,
                a = e.layerTransform,
                r = void 0 === a ? '' : a,
                s = e.constants,
                o = e.getData,
                l = e.makeElements,
                u = e.animateElements;
            _classCallCheck$4(this, t),
                (this.layerTransform = r),
                (this.constants = s),
                (this.makeElements = l),
                (this.getData = o),
                (this.animateElements = u),
                (this.store = []),
                (this.labels = []),
                (this.layerClass = i),
                (this.layerClass = 'function' == typeof this.layerClass ? this.layerClass() : this.layerClass),
                this.refresh();
        }
        return (
            _createClass$3(t, [
                {
                    key: 'refresh',
                    value: function(t) {
                        this.data = t || this.getData();
                    },
                },
                {
                    key: 'setup',
                    value: function(t) {
                        this.layer = makeSVGGroup(this.layerClass, this.layerTransform, t);
                    },
                },
                {
                    key: 'make',
                    value: function() {
                        this.render(this.data), (this.oldData = this.data);
                    },
                },
                {
                    key: 'render',
                    value: function(t) {
                        var e = this;
                        (this.store = this.makeElements(t)),
                            (this.layer.textContent = ''),
                            this.store.forEach(function(t) {
                                e.layer.appendChild(t);
                            }),
                            this.labels.forEach(function(t) {
                                e.layer.appendChild(t);
                            });
                    },
                },
                {
                    key: 'update',
                    value: function() {
                        var t = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                        this.refresh();
                        var e = [];
                        return t && (e = this.animateElements(this.data) || []), e;
                    },
                },
            ]),
            t
        );
    })(),
    componentConfigs = {
        donutSlices: {
            layerClass: 'donut-slices',
            makeElements: function(t) {
                return t.sliceStrings.map(function(e, n) {
                    var i = makePath(e, 'donut-path', t.colors[n], 'none', t.strokeWidth);
                    return (i.style.transition = 'transform .3s;'), i;
                });
            },
            animateElements: function(t) {
                return this.store.map(function(e, n) {
                    return animatePathStr(e, t.sliceStrings[n]);
                });
            },
        },
        pieSlices: {
            layerClass: 'pie-slices',
            makeElements: function(t) {
                return t.sliceStrings.map(function(e, n) {
                    var i = makePath(e, 'pie-path', 'none', t.colors[n]);
                    return (i.style.transition = 'transform .3s;'), i;
                });
            },
            animateElements: function(t) {
                return this.store.map(function(e, n) {
                    return animatePathStr(e, t.sliceStrings[n]);
                });
            },
        },
        percentageBars: {
            layerClass: 'percentage-bars',
            makeElements: function(t) {
                var e = this;
                return t.xPositions.map(function(n, i) {
                    return percentageBar(n, 0, t.widths[i], e.constants.barHeight, e.constants.barDepth, t.colors[i]);
                });
            },
            animateElements: function(t) {
                if (t) return [];
            },
        },
        yAxis: {
            layerClass: 'y axis',
            makeElements: function(t) {
                var e = this;
                return t.positions.map(function(n, i) {
                    return yLine(n, t.labels[i], e.constants.width, {
                        mode: e.constants.mode,
                        pos: e.constants.pos,
                        shortenNumbers: e.constants.shortenNumbers,
                    });
                });
            },
            animateElements: function(t) {
                var e = t.positions,
                    n = t.labels,
                    i = this.oldData.positions,
                    a = this.oldData.labels,
                    r = equilizeNoOfElements(i, e),
                    s = _slicedToArray$3(r, 2);
                (i = s[0]), (e = s[1]);
                var o = equilizeNoOfElements(a, n),
                    l = _slicedToArray$3(o, 2);
                return (
                    (a = l[0]),
                    (n = l[1]),
                    this.render({ positions: i, labels: n }),
                    this.store.map(function(t, n) {
                        return translateHoriLine(t, e[n], i[n]);
                    })
                );
            },
        },
        xAxis: {
            layerClass: 'x axis',
            makeElements: function(t) {
                var e = this;
                return t.positions.map(function(n, i) {
                    return xLine(n, t.calcLabels[i], e.constants.height, {
                        mode: e.constants.mode,
                        pos: e.constants.pos,
                    });
                });
            },
            animateElements: function(t) {
                var e = t.positions,
                    n = t.calcLabels,
                    i = this.oldData.positions,
                    a = this.oldData.calcLabels,
                    r = equilizeNoOfElements(i, e),
                    s = _slicedToArray$3(r, 2);
                (i = s[0]), (e = s[1]);
                var o = equilizeNoOfElements(a, n),
                    l = _slicedToArray$3(o, 2);
                return (
                    (a = l[0]),
                    (n = l[1]),
                    this.render({ positions: i, calcLabels: n }),
                    this.store.map(function(t, n) {
                        return translateVertLine(t, e[n], i[n]);
                    })
                );
            },
        },
        yMarkers: {
            layerClass: 'y-markers',
            makeElements: function(t) {
                var e = this;
                return t.map(function(t) {
                    return yMarker(t.position, t.label, e.constants.width, {
                        labelPos: t.options.labelPos,
                        mode: 'span',
                        lineType: 'dashed',
                    });
                });
            },
            animateElements: function(t) {
                var e = equilizeNoOfElements(this.oldData, t),
                    n = _slicedToArray$3(e, 2);
                this.oldData = n[0];
                var i = (t = n[1]).map(function(t) {
                        return t.position;
                    }),
                    a = t.map(function(t) {
                        return t.label;
                    }),
                    r = t.map(function(t) {
                        return t.options;
                    }),
                    s = this.oldData.map(function(t) {
                        return t.position;
                    });
                return (
                    this.render(
                        s.map(function(t, e) {
                            return { position: s[e], label: a[e], options: r[e] };
                        }),
                    ),
                    this.store.map(function(t, e) {
                        return translateHoriLine(t, i[e], s[e]);
                    })
                );
            },
        },
        yRegions: {
            layerClass: 'y-regions',
            makeElements: function(t) {
                var e = this;
                return t.map(function(t) {
                    return yRegion(t.startPos, t.endPos, e.constants.width, t.label, { labelPos: t.options.labelPos });
                });
            },
            animateElements: function(t) {
                var e = equilizeNoOfElements(this.oldData, t),
                    n = _slicedToArray$3(e, 2);
                this.oldData = n[0];
                var i = (t = n[1]).map(function(t) {
                        return t.endPos;
                    }),
                    a = t.map(function(t) {
                        return t.label;
                    }),
                    r = t.map(function(t) {
                        return t.startPos;
                    }),
                    s = t.map(function(t) {
                        return t.options;
                    }),
                    o = this.oldData.map(function(t) {
                        return t.endPos;
                    }),
                    l = this.oldData.map(function(t) {
                        return t.startPos;
                    });
                this.render(
                    o.map(function(t, e) {
                        return { startPos: l[e], endPos: o[e], label: a[e], options: s[e] };
                    }),
                );
                var u = [];
                return (
                    this.store.map(function(t, e) {
                        u = u.concat(animateRegion(t, r[e], i[e], o[e]));
                    }),
                    u
                );
            },
        },
        heatDomain: {
            layerClass: function() {
                return 'heat-domain domain-' + this.constants.index;
            },
            makeElements: function(t) {
                var e = this,
                    n = this.constants,
                    i = n.index,
                    a = n.colWidth,
                    r = n.rowHeight,
                    s = n.squareSize,
                    o = n.xTranslate,
                    l = 0;
                return (
                    (this.serializedSubDomains = []),
                    t.cols.map(function(t, n) {
                        1 === n &&
                            e.labels.push(
                                makeText('domain-name', o, -12, getMonthName(i, !0).toUpperCase(), { fontSize: 9 }),
                            ),
                            t.map(function(t, n) {
                                if (t.fill) {
                                    var i = { 'data-date': t.yyyyMmDd, 'data-value': t.dataValue, 'data-day': n },
                                        a = heatSquare('day', o, l, s, t.fill, i);
                                    e.serializedSubDomains.push(a);
                                }
                                l += r;
                            }),
                            (l = 0),
                            (o += a);
                    }),
                    this.serializedSubDomains
                );
            },
            animateElements: function(t) {
                if (t) return [];
            },
        },
        barGraph: {
            layerClass: function() {
                return 'dataset-units dataset-bars dataset-' + this.constants.index;
            },
            makeElements: function(t) {
                var e = this.constants;
                return (
                    (this.unitType = 'bar'),
                    (this.units = t.yPositions.map(function(n, i) {
                        return datasetBar(t.xPositions[i], n, t.barWidth, e.color, t.labels[i], i, t.offsets[i], {
                            zeroLine: t.zeroLine,
                            barsWidth: t.barsWidth,
                            minHeight: e.minHeight,
                        });
                    })),
                    this.units
                );
            },
            animateElements: function(t) {
                var e = t.xPositions,
                    n = t.yPositions,
                    i = t.offsets,
                    a = t.labels,
                    r = this.oldData.xPositions,
                    s = this.oldData.yPositions,
                    o = this.oldData.offsets,
                    l = this.oldData.labels,
                    u = equilizeNoOfElements(r, e),
                    c = _slicedToArray$3(u, 2);
                (r = c[0]), (e = c[1]);
                var h = equilizeNoOfElements(s, n),
                    d = _slicedToArray$3(h, 2);
                (s = d[0]), (n = d[1]);
                var f = equilizeNoOfElements(o, i),
                    p = _slicedToArray$3(f, 2);
                (o = p[0]), (i = p[1]);
                var v = equilizeNoOfElements(l, a),
                    y = _slicedToArray$3(v, 2);
                (l = y[0]),
                    (a = y[1]),
                    this.render({
                        xPositions: r,
                        yPositions: s,
                        offsets: o,
                        labels: a,
                        zeroLine: this.oldData.zeroLine,
                        barsWidth: this.oldData.barsWidth,
                        barWidth: this.oldData.barWidth,
                    });
                var g = [];
                return (
                    this.store.map(function(a, r) {
                        g = g.concat(animateBar(a, e[r], n[r], t.barWidth, i[r], { zeroLine: t.zeroLine }));
                    }),
                    g
                );
            },
        },
        lineGraph: {
            layerClass: function() {
                return 'dataset-units dataset-line dataset-' + this.constants.index;
            },
            makeElements: function(t) {
                var e = this.constants;
                return (
                    (this.unitType = 'dot'),
                    (this.paths = {}),
                    e.hideLine ||
                        (this.paths = getPaths(
                            t.xPositions,
                            t.yPositions,
                            e.color,
                            { heatline: e.heatline, regionFill: e.regionFill, spline: e.spline },
                            { svgDefs: e.svgDefs, zeroLine: t.zeroLine },
                        )),
                    (this.units = []),
                    e.hideDots ||
                        (this.units = t.yPositions.map(function(n, i) {
                            return datasetDot(
                                t.xPositions[i],
                                n,
                                t.radius,
                                e.color,
                                e.valuesOverPoints ? t.values[i] : '',
                                i,
                            );
                        })),
                    Object.values(this.paths).concat(this.units)
                );
            },
            animateElements: function(t) {
                var e = t.xPositions,
                    n = t.yPositions,
                    i = t.values,
                    a = this.oldData.xPositions,
                    r = this.oldData.yPositions,
                    s = this.oldData.values,
                    o = equilizeNoOfElements(a, e),
                    l = _slicedToArray$3(o, 2);
                (a = l[0]), (e = l[1]);
                var u = equilizeNoOfElements(r, n),
                    c = _slicedToArray$3(u, 2);
                (r = c[0]), (n = c[1]);
                var h = equilizeNoOfElements(s, i),
                    d = _slicedToArray$3(h, 2);
                (s = d[0]),
                    (i = d[1]),
                    this.render({
                        xPositions: a,
                        yPositions: r,
                        values: i,
                        zeroLine: this.oldData.zeroLine,
                        radius: this.oldData.radius,
                    });
                var f = [];
                return (
                    Object.keys(this.paths).length &&
                        (f = f.concat(animatePath(this.paths, e, n, t.zeroLine, this.constants.spline))),
                    this.units.length &&
                        this.units.map(function(t, i) {
                            f = f.concat(animateDot(t, e[i], n[i]));
                        }),
                    f
                );
            },
        },
    },
    _slicedToArray$4 = (function() {
        function t(t, e) {
            var n = [],
                i = !0,
                a = !1,
                r = void 0;
            try {
                for (
                    var s, o = t[Symbol.iterator]();
                    !(i = (s = o.next()).done) && (n.push(s.value), !e || n.length !== e);
                    i = !0
                );
            } catch (t) {
                (a = !0), (r = t);
            } finally {
                try {
                    !i && o.return && o.return();
                } finally {
                    if (a) throw r;
                }
            }
            return n;
        }
        return function(e, n) {
            if (Array.isArray(e)) return e;
            if (Symbol.iterator in Object(e)) return t(e, n);
            throw new TypeError('Invalid attempt to destructure non-iterable instance');
        };
    })(),
    _createClass = (function() {
        function t(t, e) {
            for (var n = 0; n < e.length; n++) {
                var i = e[n];
                (i.enumerable = i.enumerable || !1),
                    (i.configurable = !0),
                    'value' in i && (i.writable = !0),
                    Object.defineProperty(t, i.key, i);
            }
        }
        return function(e, n, i) {
            return n && t(e.prototype, n), i && t(e, i), e;
        };
    })(),
    _get = function t(e, n, i) {
        null === e && (e = Function.prototype);
        var a = Object.getOwnPropertyDescriptor(e, n);
        if (void 0 === a) {
            var r = Object.getPrototypeOf(e);
            return null === r ? void 0 : t(r, n, i);
        }
        if ('value' in a) return a.value;
        var s = a.get;
        if (void 0 !== s) return s.call(i);
    },
    AxisChart = (function(t) {
        function e(t, n) {
            _classCallCheck$1(this, e);
            var i = _possibleConstructorReturn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, t, n));
            return (
                (i.barOptions = n.barOptions || {}),
                (i.lineOptions = n.lineOptions || {}),
                (i.type = n.type || 'line'),
                (i.init = 1),
                i.setup(),
                i
            );
        }
        return (
            _inherits(e, t),
            _createClass(e, [
                {
                    key: 'setMeasures',
                    value: function() {
                        this.data.datasets.length <= 1 &&
                            ((this.config.showLegend = 0), (this.measures.paddings.bottom = 30));
                    },
                },
                {
                    key: 'configure',
                    value: function(t) {
                        _get(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'configure', this).call(
                            this,
                            t,
                        ),
                            (t.axisOptions = t.axisOptions || {}),
                            (t.tooltipOptions = t.tooltipOptions || {}),
                            (this.config.xAxisMode = t.axisOptions.xAxisMode || 'span'),
                            (this.config.yAxisMode = t.axisOptions.yAxisMode || 'span'),
                            (this.config.xIsSeries = t.axisOptions.xIsSeries || 0),
                            (this.config.shortenYAxisNumbers = t.axisOptions.shortenYAxisNumbers || 0),
                            (this.config.formatTooltipX = t.tooltipOptions.formatTooltipX),
                            (this.config.formatTooltipY = t.tooltipOptions.formatTooltipY),
                            (this.config.valuesOverPoints = t.valuesOverPoints);
                    },
                },
                {
                    key: 'prepareData',
                    value: function() {
                        return dataPrep(
                            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.data,
                            this.type,
                        );
                    },
                },
                {
                    key: 'prepareFirstData',
                    value: function() {
                        return zeroDataPrep(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.data);
                    },
                },
                {
                    key: 'calc',
                    value: function() {
                        var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                        this.calcXPositions(),
                            t || this.calcYAxisParameters(this.getAllYValues(), 'line' === this.type),
                            this.makeDataByIndex();
                    },
                },
                {
                    key: 'calcXPositions',
                    value: function() {
                        var t = this.state,
                            e = this.data.labels;
                        (t.datasetLength = e.length),
                            (t.unitWidth = this.width / t.datasetLength),
                            (t.xOffset = t.unitWidth / 2),
                            (t.xAxis = {
                                labels: e,
                                positions: e.map(function(e, n) {
                                    return floatTwo(t.xOffset + n * t.unitWidth);
                                }),
                            });
                    },
                },
                {
                    key: 'calcYAxisParameters',
                    value: function(t) {
                        var e = calcChartIntervals(
                                t,
                                arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'false',
                            ),
                            n = this.height / getValueRange(e),
                            i = getIntervalSize(e) * n,
                            a = this.height - getZeroIndex(e) * i;
                        (this.state.yAxis = {
                            labels: e,
                            positions: e.map(function(t) {
                                return a - t * n;
                            }),
                            scaleMultiplier: n,
                            zeroLine: a,
                        }),
                            this.calcDatasetPoints(),
                            this.calcYExtremes(),
                            this.calcYRegions();
                    },
                },
                {
                    key: 'calcDatasetPoints',
                    value: function() {
                        var t = this.state,
                            e = function(e) {
                                return e.map(function(e) {
                                    return scale(e, t.yAxis);
                                });
                            };
                        t.datasets = this.data.datasets.map(function(t, n) {
                            var i = t.values,
                                a = t.cumulativeYs || [];
                            return {
                                name: t.name,
                                index: n,
                                chartType: t.chartType,
                                values: i,
                                yPositions: e(i),
                                cumulativeYs: a,
                                cumulativeYPos: e(a),
                            };
                        });
                    },
                },
                {
                    key: 'calcYExtremes',
                    value: function() {
                        var t = this.state;
                        if (this.barOptions.stacked)
                            return void (t.yExtremes = t.datasets[t.datasets.length - 1].cumulativeYPos);
                        (t.yExtremes = new Array(t.datasetLength).fill(9999)),
                            t.datasets.map(function(e) {
                                e.yPositions.map(function(e, n) {
                                    e < t.yExtremes[n] && (t.yExtremes[n] = e);
                                });
                            });
                    },
                },
                {
                    key: 'calcYRegions',
                    value: function() {
                        var t = this.state;
                        this.data.yMarkers &&
                            (this.state.yMarkers = this.data.yMarkers.map(function(e) {
                                return (e.position = scale(e.value, t.yAxis)), e.options || (e.options = {}), e;
                            })),
                            this.data.yRegions &&
                                (this.state.yRegions = this.data.yRegions.map(function(e) {
                                    return (
                                        (e.startPos = scale(e.start, t.yAxis)),
                                        (e.endPos = scale(e.end, t.yAxis)),
                                        e.options || (e.options = {}),
                                        e
                                    );
                                }));
                    },
                },
                {
                    key: 'getAllYValues',
                    value: function() {
                        var t,
                            e = this,
                            n = 'values';
                        if (this.barOptions.stacked) {
                            n = 'cumulativeYs';
                            var i = new Array(this.state.datasetLength).fill(0);
                            this.data.datasets.map(function(t, a) {
                                var r = e.data.datasets[a].values;
                                t[n] = i = i.map(function(t, e) {
                                    return t + r[e];
                                });
                            });
                        }
                        var a = this.data.datasets.map(function(t) {
                            return t[n];
                        });
                        return (
                            this.data.yMarkers &&
                                a.push(
                                    this.data.yMarkers.map(function(t) {
                                        return t.value;
                                    }),
                                ),
                            this.data.yRegions &&
                                this.data.yRegions.map(function(t) {
                                    a.push([t.end, t.start]);
                                }),
                            (t = []).concat.apply(t, _toConsumableArray(a))
                        );
                    },
                },
                {
                    key: 'setupComponents',
                    value: function() {
                        var t = this,
                            e = [
                                [
                                    'yAxis',
                                    {
                                        mode: this.config.yAxisMode,
                                        width: this.width,
                                        shortenNumbers: this.config.shortenYAxisNumbers,
                                    },
                                    function() {
                                        return this.state.yAxis;
                                    }.bind(this),
                                ],
                                [
                                    'xAxis',
                                    { mode: this.config.xAxisMode, height: this.height },
                                    function() {
                                        var t = this.state;
                                        return (
                                            (t.xAxis.calcLabels = getShortenedLabels(
                                                this.width,
                                                t.xAxis.labels,
                                                this.config.xIsSeries,
                                            )),
                                            t.xAxis
                                        );
                                    }.bind(this),
                                ],
                                [
                                    'yRegions',
                                    { width: this.width, pos: 'right' },
                                    function() {
                                        return this.state.yRegions;
                                    }.bind(this),
                                ],
                            ],
                            n = this.state.datasets.filter(function(t) {
                                return 'bar' === t.chartType;
                            }),
                            i = this.state.datasets.filter(function(t) {
                                return 'line' === t.chartType;
                            }),
                            a = n.map(function(e) {
                                var i = e.index;
                                return [
                                    'barGraph-' + e.index,
                                    {
                                        index: i,
                                        color: t.colors[i],
                                        stacked: t.barOptions.stacked,
                                        valuesOverPoints: t.config.valuesOverPoints,
                                        minHeight: t.height * MIN_BAR_PERCENT_HEIGHT,
                                    },
                                    function() {
                                        var t = this.state,
                                            e = t.datasets[i],
                                            a = this.barOptions.stacked,
                                            r = this.barOptions.spaceRatio || BAR_CHART_SPACE_RATIO,
                                            s = t.unitWidth * (1 - r),
                                            o = s / (a ? 1 : n.length),
                                            l = t.xAxis.positions.map(function(t) {
                                                return t - s / 2;
                                            });
                                        a ||
                                            (l = l.map(function(t) {
                                                return t + o * i;
                                            }));
                                        var u = new Array(t.datasetLength).fill('');
                                        this.config.valuesOverPoints &&
                                            (u = a && e.index === t.datasets.length - 1 ? e.cumulativeYs : e.values);
                                        var c = new Array(t.datasetLength).fill(0);
                                        return (
                                            a &&
                                                (c = e.yPositions.map(function(t, n) {
                                                    return t - e.cumulativeYPos[n];
                                                })),
                                            {
                                                xPositions: l,
                                                yPositions: e.yPositions,
                                                offsets: c,
                                                labels: u,
                                                zeroLine: t.yAxis.zeroLine,
                                                barsWidth: s,
                                                barWidth: o,
                                            }
                                        );
                                    }.bind(t),
                                ];
                            }),
                            r = i.map(function(e) {
                                var n = e.index;
                                return [
                                    'lineGraph-' + e.index,
                                    {
                                        index: n,
                                        color: t.colors[n],
                                        svgDefs: t.svgDefs,
                                        heatline: t.lineOptions.heatline,
                                        regionFill: t.lineOptions.regionFill,
                                        spline: t.lineOptions.spline,
                                        hideDots: t.lineOptions.hideDots,
                                        hideLine: t.lineOptions.hideLine,
                                        valuesOverPoints: t.config.valuesOverPoints,
                                    },
                                    function() {
                                        var t = this.state,
                                            e = t.datasets[n],
                                            i =
                                                t.yAxis.positions[0] < t.yAxis.zeroLine
                                                    ? t.yAxis.positions[0]
                                                    : t.yAxis.zeroLine;
                                        return {
                                            xPositions: t.xAxis.positions,
                                            yPositions: e.yPositions,
                                            values: e.values,
                                            zeroLine: i,
                                            radius: this.lineOptions.dotSize || LINE_CHART_DOT_SIZE,
                                        };
                                    }.bind(t),
                                ];
                            }),
                            s = [
                                [
                                    'yMarkers',
                                    { width: this.width, pos: 'right' },
                                    function() {
                                        return this.state.yMarkers;
                                    }.bind(this),
                                ],
                            ];
                        e = e.concat(a, r, s);
                        var o = ['yMarkers', 'yRegions'];
                        (this.dataUnitComponents = []),
                            (this.components = new Map(
                                e
                                    .filter(function(e) {
                                        return !o.includes(e[0]) || t.state[e[0]];
                                    })
                                    .map(function(e) {
                                        var n = getComponent.apply(void 0, _toConsumableArray(e));
                                        return (
                                            (e[0].includes('lineGraph') || e[0].includes('barGraph')) &&
                                                t.dataUnitComponents.push(n),
                                            [e[0], n]
                                        );
                                    }),
                            ));
                    },
                },
                {
                    key: 'makeDataByIndex',
                    value: function() {
                        var t = this;
                        this.dataByIndex = {};
                        var e = this.state,
                            n = this.config.formatTooltipX,
                            i = this.config.formatTooltipY;
                        e.xAxis.labels.map(function(a, r) {
                            var s = t.state.datasets.map(function(e, n) {
                                var a = e.values[r];
                                return {
                                    title: e.name,
                                    value: a,
                                    yPos: e.yPositions[r],
                                    color: t.colors[n],
                                    formatted: i ? i(a) : a,
                                };
                            });
                            t.dataByIndex[r] = {
                                label: a,
                                formattedLabel: n ? n(a) : a,
                                xPos: e.xAxis.positions[r],
                                values: s,
                                yExtreme: e.yExtremes[r],
                            };
                        });
                    },
                },
                {
                    key: 'bindTooltip',
                    value: function() {
                        var t = this;
                        this.container.addEventListener('mousemove', function(e) {
                            var n = t.measures,
                                i = getOffset(t.container),
                                a = e.pageX - i.left - getLeftOffset(n),
                                r = e.pageY - i.top;
                            r < t.height + getTopOffset(n) && r > getTopOffset(n)
                                ? t.mapTooltipXPosition(a)
                                : t.tip.hideTip();
                        });
                    },
                },
                {
                    key: 'mapTooltipXPosition',
                    value: function(t) {
                        var e = this.state;
                        if (e.yExtremes) {
                            var n = getClosestInArray(t, e.xAxis.positions, !0);
                            if (n >= 0) {
                                var i = this.dataByIndex[n];
                                this.tip.setValues(
                                    i.xPos + this.tip.offset.x,
                                    i.yExtreme + this.tip.offset.y,
                                    { name: i.formattedLabel, value: '' },
                                    i.values,
                                    n,
                                ),
                                    this.tip.showTip();
                            }
                        }
                    },
                },
                {
                    key: 'renderLegend',
                    value: function() {
                        var t = this,
                            e = this.data;
                        e.datasets.length > 1 &&
                            ((this.legendArea.textContent = ''),
                            e.datasets.map(function(e, n) {
                                var i = AXIS_LEGEND_BAR_SIZE,
                                    a = legendBar(i * n, '0', i, t.colors[n], e.name, t.config.truncateLegends);
                                t.legendArea.appendChild(a);
                            }));
                    },
                },
                {
                    key: 'makeOverlay',
                    value: function() {
                        var t = this;
                        if (this.init) return void (this.init = 0);
                        this.overlayGuides &&
                            this.overlayGuides.forEach(function(t) {
                                var e = t.overlay;
                                e.parentNode.removeChild(e);
                            }),
                            (this.overlayGuides = this.dataUnitComponents.map(function(t) {
                                return { type: t.unitType, overlay: void 0, units: t.units };
                            })),
                            void 0 === this.state.currentIndex &&
                                (this.state.currentIndex = this.state.datasetLength - 1),
                            this.overlayGuides.map(function(e) {
                                var n = e.units[t.state.currentIndex];
                                (e.overlay = makeOverlay[e.type](n)), t.drawArea.appendChild(e.overlay);
                            });
                    },
                },
                {
                    key: 'updateOverlayGuides',
                    value: function() {
                        this.overlayGuides &&
                            this.overlayGuides.forEach(function(t) {
                                var e = t.overlay;
                                e.parentNode.removeChild(e);
                            });
                    },
                },
                {
                    key: 'bindOverlay',
                    value: function() {
                        var t = this;
                        this.parent.addEventListener('data-select', function() {
                            t.updateOverlay();
                        });
                    },
                },
                {
                    key: 'bindUnits',
                    value: function() {
                        var t = this;
                        this.dataUnitComponents.map(function(e) {
                            e.units.map(function(e) {
                                e.addEventListener('click', function() {
                                    var n = e.getAttribute('data-point-index');
                                    t.setCurrentDataPoint(n);
                                });
                            });
                        }),
                            this.tip.container.addEventListener('click', function() {
                                var e = t.tip.container.getAttribute('data-point-index');
                                t.setCurrentDataPoint(e);
                            });
                    },
                },
                {
                    key: 'updateOverlay',
                    value: function() {
                        var t = this;
                        this.overlayGuides.map(function(e) {
                            var n = e.units[t.state.currentIndex];
                            updateOverlay[e.type](n, e.overlay);
                        });
                    },
                },
                {
                    key: 'onLeftArrow',
                    value: function() {
                        this.setCurrentDataPoint(this.state.currentIndex - 1);
                    },
                },
                {
                    key: 'onRightArrow',
                    value: function() {
                        this.setCurrentDataPoint(this.state.currentIndex + 1);
                    },
                },
                {
                    key: 'getDataPoint',
                    value: function() {
                        var t =
                                arguments.length > 0 && void 0 !== arguments[0]
                                    ? arguments[0]
                                    : this.state.currentIndex,
                            e = this.state;
                        return {
                            index: t,
                            label: e.xAxis.labels[t],
                            values: e.datasets.map(function(e) {
                                return e.values[t];
                            }),
                        };
                    },
                },
                {
                    key: 'setCurrentDataPoint',
                    value: function(t) {
                        var e = this.state;
                        (t = parseInt(t)) < 0 && (t = 0),
                            t >= e.xAxis.labels.length && (t = e.xAxis.labels.length - 1),
                            t !== e.currentIndex &&
                                ((e.currentIndex = t), fire(this.parent, 'data-select', this.getDataPoint()));
                    },
                },
                {
                    key: 'addDataPoint',
                    value: function(t, n) {
                        var i =
                            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.state.datasetLength;
                        _get(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), 'addDataPoint', this).call(
                            this,
                            t,
                            n,
                            i,
                        ),
                            this.data.labels.splice(i, 0, t),
                            this.data.datasets.map(function(t, e) {
                                t.values.splice(i, 0, n[e]);
                            }),
                            this.update(this.data);
                    },
                },
                {
                    key: 'removeDataPoint',
                    value: function() {
                        var t =
                            arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : this.state.datasetLength - 1;
                        this.data.labels.length <= 1 ||
                            (_get(
                                e.prototype.__proto__ || Object.getPrototypeOf(e.prototype),
                                'removeDataPoint',
                                this,
                            ).call(this, t),
                            this.data.labels.splice(t, 1),
                            this.data.datasets.map(function(e) {
                                e.values.splice(t, 1);
                            }),
                            this.update(this.data));
                    },
                },
                {
                    key: 'updateDataset',
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                        (this.data.datasets[e].values = t), this.update(this.data);
                    },
                },
                {
                    key: 'updateDatasets',
                    value: function(t) {
                        this.data.datasets.map(function(e, n) {
                            t[n] && (e.values = t[n]);
                        }),
                            this.update(this.data);
                    },
                },
            ]),
            e
        );
    })(BaseChart),
    chartTypes = { bar: AxisChart, line: AxisChart },
    Chart = function t(e, n) {
        return _classCallCheck(this, t), getChartByType(n.type, e, n);
    };
export { Chart, AxisChart };
