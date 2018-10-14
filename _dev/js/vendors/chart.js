google.charts.load("current", {
  packages: ["corechart", "controls", "table"]
});

google.charts.setOnLoadCallback(drawDashboard);

function drawDashboard() {

  var data = google.visualization.arrayToDataTable([
    ["Tematica", "posts"],
    ["Cine", 3],
    ["Random", 2],
    ["Opinión", 4],
    ["Tutorial", 9]
  ]);
  
var data2 = [];

data2['Cine'] = google.visualization.arrayToDataTable([
    ["Tematica", "posts"],
    ["Cine", 13],
    ["Random", 22],
    ["Opinión", 34],
    ["Tutorial", 39]
  ]);

  var dashboard = new google.visualization.Dashboard(
    document.getElementById("dashboard_div")
  );

  var control = new google.visualization.ControlWrapper({
    controlType: "NumberRangeFilter",
    containerId: "filter_div",
    options: {
      filterColumnLabel: "posts"
    }
  });

  var chart = new google.visualization.ChartWrapper({
    chartType: "ScatterChart",
    containerId: "chart_div",
    options: {
      height: "360",
      hAxis: {
        title: ""
      },
      vAxis: {
        title: ""
      },
      colors: ["#1da1f2"],
      chartArea: {
        left: 30,
        top: 80,
        width: "100%",
        height: "70%"
      },
      animation: {
        duration: 1000,
        easing: "out"
      },
      bar: {
        groupWidth: "85%"
      }
    }
  });

  google.visualization.events.addListener(chart, "select", function() {
    var selectedItem = chart.getChart().getSelection()[0];

    var name = data.getValue(selectedItem.row, 0);
    //var new_data = test_2['Cine'];
    //console.log(new_data);    
    dashboard.bind(control, [chart]);

    dashboard.draw(data2['Cine']);
  });

  dashboard.bind(control, [chart]);
  dashboard.draw(data);
}

window.onresize = function() {
  drawDashboard();
};
