angular.module('app', ['ngRoute'])
  // .config(function($routeProvider) {
  //   $routeProvider
  //     .when('/song', {
  //       templateUrl: 'publice/index.html',
  //       //controller: 'songCon'
  //       directive:'ghVisualization'
  //     })
     
  // })
   .directive('ghVisualization', function () {

   return {
    restrict: 'E',
    scope: {
      val: '=',
      grouped: '='
    },
    link: function () {
 var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(200);
  var array=[["26.jpg","4.jpg","9.jpg","28.jpg","11.jpg","38.jpg","16.jpg","33.jpg"],["10.jpg","20.jpg","22.jpg",
              "19.jpg","21.jpg","12.jpg","31.jpg","1.jpg"],["23.jpg","12.jpg","18.jpg","17.jpg","40.jpg","41.jpg","7.jpg","34.jpg"],
             ["13.jpg","32.jpg","19.jpg","30.jpg","37.jpg","25.jpg","29.jpg","35.jpg"]];

var svgHeight = '900';
var svgWidth = '950';
var barPadding = '1';
var arra=[];
//function to bring any item to the bigening

 d3.selection.prototype.moveToFront = function() {  
        return this.each(function(){
        this.parentNode.appendChild(this);
                });
    };

 var svg = d3.select("body")
             .attr("class", "B_svg")
             .append("svg")
             .attr("width", svgWidth)
             .attr("height", svgHeight)   
             .attr("x", 5)
             .attr("y", 5)
             .attr("class", "foo");
 var rect=  svg.append('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
      .attr('y', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding)
     .attr('height', svgHeight / frequencyData.length - barPadding)
     .attr("class", "foo");
     
              

 function creatimg(arr,i,j){
       arra.push(d3.select("svg")
           .append('image')
           .attr("xlink:href",arr)
           .attr("width",85)
           .attr("height", 85)
           .attr('x', i*125)
           .attr("y",5+(125*j))
           .style("opacity", 1)
           .on("mouseover", function(){ d3.select(this).attr("width",230).attr("height",230).style("opacity",1).moveToFront();})
           .on("mouseout",function(){d3.select(this).attr("width",70).attr("height",70).style("opacity",1);}));

     };
 function renderChart() {
      requestAnimationFrame(renderChart);
     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);
     console.log(frequencyData)
    svg.selectAll('image')
        .data(frequencyData)
        .attr('height', function(d) {
           return d-25;
        });
  } ;
 // render the table(s)
for(var j=0;j<array.length;j++){
    for(var i=0;i<array[j].length;i++){
          creatimg(array[j][i],i,j)
      } 
  }
 renderChart();

  })
  .controller('songCon', function($scope,song){
  	  $scope.moving= song.moving();
      
   
  })

 