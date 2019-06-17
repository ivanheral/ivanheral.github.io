var ApexCharts = require('apexcharts');

var options = {
    chart: {
        type: 'bar',
    },
    series: [
        {
            name: 'sales',
            data: [30, 40, 35],
        },
    ],
    xaxis: {
        categories: [1991, 1992, 1993],
    },
};

var chart = new ApexCharts(document.querySelector('#dashboard_div'), options);
chart.render();
