google.charts.load('current', {
  'packages': ['corechart', 'controls', 'table']
});

google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard() {

  var data1 = google.visualization.arrayToDataTable([
    ['Tematica', 'posts'],
    ['Cine', 3],
    ['Random', 2],
    ['Opinión', 4],
    ['Tutorial', 9]
  ]);

  var data2 = google.visualization.arrayToDataTable([
    ['Tematica', 'posts'],
    ['Cine', 3],
    ['Random', 2],
    ['Opinión', 4],
    ['Tutorial', 9]
  ]);

  var dashboard = new google.visualization.Dashboard(
    document.getElementById('dashboard_div'));

  var donutRangeSlider = new google.visualization.ControlWrapper({
    'controlType': 'NumberRangeFilter',
    'containerId': 'filter_div',
    'options': {
      'filterColumnLabel': 'posts'
    }
  });

  var columnChart = new google.visualization.ChartWrapper({
    'chartType': 'ColumnChart',
    'containerId': 'chart_div',
    'options': {
      'height': '360',
      hAxis: {
        title: ''
      },
      vAxis: {
        title: ''
      },
      colors: ['#1da1f2'],
      chartArea: {
        left: 30,
        top: 80,
        width: "100%",
        height: "70%"
      },
      'animation': {
        duration: 1000,
        easing: 'out'
      },
      bar: {
        groupWidth: '85%'
      }
    }
  });

  var table = new google.visualization.ChartWrapper({
    'chartType': 'Table',
    'containerId': 'table_div',
    'options': {}
  })

  google.visualization.events.addListener(table, 'select', function () {

    var selectedItem = table.getChart().getSelection()[0];
    if (selectedItem) {
      var name = data1.getValue(selectedItem.row, 0);

      table.setView({
        'columns': [0, 1, 2]
      });
      columnChart.setOption('hAxis.viewWindow.max', 4);
      dashboard.bind(donutRangeSlider, [columnChart], table);
      dashboard.draw(data2);
    }
  });


  dashboard.bind(donutRangeSlider, [columnChart, table]);
  dashboard.draw(data1);
}

window.onresize = function () {
  drawDashboard()
}