var ApexCharts = require('apexcharts');

var options = {
    chart: {
        type: 'bar',
    },
    series: [
        {
            name: 'size (KB)',
            data: [4.38, 7.72, 24.9],
        },
    ],
    xaxis: {
        categories: ['Javascript', 'Css', 'Vendors'],
    },
};

var chart = new ApexCharts(document.querySelector('#dashboard_div'), options);
chart.render();
