var randomColor = require('randomcolor'); 

/*var myData = {
    "Classical music": 10,
    "Alternative rock": 14,
    "Pop": 2,
    "Jazz": 12
};

var Piechart = function (options) {

    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;

    this.drawPieSlice = function (ctx, centerX, centerY, radius, startAngle, endAngle, color) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fill()
    }

    this.draw = function () {

        var total_value = 0
        var color_index = 0

        for (var categ in this.options.data) {
            var val = this.options.data[categ]
            total_value += val
        }
        var start_angle = 0
        var s = getComputedStyle(this.canvas)
        var w = s.width
        var h = s.height
        this.canvas.width = 720
        this.canvas.height = 405

        for (categ in this.options.data) {
            val = this.options.data[categ]
            var slice_angle = 2 * Math.PI * val / total_value
            this.drawPieSlice(
                this.ctx,
                this.canvas.width / 2,
                this.canvas.height / 2,
                Math.min(this.canvas.width / 2, this.canvas.height / 2),
                start_angle,
                start_angle + slice_angle,
                this.colors[color_index % this.colors.length]
            );
            start_angle += slice_angle;
            color_index++;
        }
    }
}

var myPiechart = new Piechart(
    {   canvas: myCanvas,
        data: myData,
        colors: ["#673AB7", "#3F51B5", "#2196F3", "#03A9F4"]    }
);

myPiechart.draw();*/

var myCanvas = document.getElementById("myCanvas");

var Test = new BarGraph({
    canvas: myCanvas
});




Test.draw([{
    title: "cine",
    val: 3
}, {
    title: "random",
    val: 2
}, {
    title: "opinión",
    val: 4
}, {
    title: "tutorial",
    val: 9
}]);


function BarGraph(options) {

    this.width = 720;
    this.ctx = options.canvas.getContext("2d");
    this.canvas = options.canvas;
    this.height = 405;
    this.maxValue;
    this.margin = 3;

    this.draw = function (arr) {

        var numOfBars = arr.length;
        var ratio;
        var maxBarHeight;
        var gradient;
        var largestValue;
        var colors = randomColor({
            count: arr.length,
            luminosity: 'light',
            hue: 'blue'
         });


        var s = getComputedStyle(this.canvas)
        var w = s.width
        var h = s.height
        this.canvas.width = 720
        this.canvas.height = 405

        barWidth = this.width / numOfBars - this.margin * 2;
        maxBarHeight = this.height;

        var largestValue = 0;
        for (i = 0; i < arr.length; i += 1) {
            if (arr[i].val > largestValue)
                largestValue = arr[i].val;
        }

        for (i = 0; i < arr.length; i += 1) {

            ratio = arr[i].val / largestValue;
            if (this.maxValue)
                ratio = arr[i].val / this.maxValue;

            barHeight = ratio * maxBarHeight;
            this.ctx.fillStyle='#000';
            this.ctx.fillRect((this.margin + i * this.width / numOfBars) -1,
                this.height - barHeight + 2,
                barWidth+1,
                barHeight-45);

            this.ctx.fillStyle = colors[i];
 
            this.ctx.fillRect(this.margin + i * this.width / numOfBars,
                this.height - barHeight,
                barWidth,
                barHeight-45);
            




            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = "#263238";
            this.ctx.font = "28px sans-serif";
            this.ctx.textAlign = "center";

            try {
                this.ctx.fillText(parseInt(arr[i].val, 10),
                    i * this.width / numOfBars + (this.width / numOfBars) / 2,
                    this.height - barHeight + 30);
                this.ctx.fillText(arr[i].title,
                    i * this.width / numOfBars + (this.width / numOfBars) / 2,
                    this.canvas.height-10);
            } catch (ex) {}
        }
    };
}