var randomColor = require('randomcolor'); 

var myCanvas = document.getElementById("test");

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
            this.ctx.fillStyle='#ddd';
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