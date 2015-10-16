"use strict";

var gl, program, canvas;
var curVertices;
var selectedVertex;
var r,g,b,a;
var colors;
var pointColors;
var gridCoord;

window.onload = function init()
{
    canvas = document.getElementById( "canvas" );
    gl = canvas.getContext("webgl");
    //  Load shaders and initialize attribute buffers
    curVertices = new Array();
    colors = new Array();
    pointColors = new Array();
    selectedVertex = new Array();
    gridCoord = new Array();

    //Grid points
    for(var i = -1; i < canvas.width; i += 0.1){
		gridCoord.push([i,1]);
		gridCoord.push([i,-1]);
		gridCoord.push([1,i]);
		gridCoord.push([-1,i]);
	}

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    canvas.addEventListener("mousedown", addPoint, false);
    canvas.addEventListener("mousedown", getVertexInfo, false);
    setInterval(render, 1);
};

function render() {
	var checkBox2 = document.getElementById("ShowGrid");
   	if(checkBox2.checked)
   		showGrid();
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    var checkBox = document.getElementById("ShowVertices");

    r = document.getElementById("r").value;
    g = document.getElementById("g").value;
    b = document.getElementById("b").value;
    a = document.getElementById("a").value;

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(curVertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var colorId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    renderVertex();

    if(checkBox.checked){
        renderPoints();
    }
}

function renderVertex(){
	gl.drawArrays( gl.TRIANGLES, 0, curVertices.length);
}

function renderPoints(){
	gl.bufferData( gl.ARRAY_BUFFER, flatten(pointColors), gl.STATIC_DRAW );
    gl.drawArrays(gl.POINTS, 0, curVertices.length);
}

function showVertices(){
    render();
}

function getMousePosition(event){
    var x = event.x - canvas.offsetLeft;
    var y = event.y - canvas.offsetTop;
    
    x = -1.0+(2.0*x/canvas.width);
    y = -1.0+(2.0*(canvas.height-y))/canvas.height;

    return [x,y];
}

function addPoint(){
	r = document.getElementById("r").value;
    g = document.getElementById("g").value;
    b = document.getElementById("b").value;
    a = document.getElementById("a").value;
    var snapToGrid = document.getElementById("SnapToGrid");
    var v = getMousePosition(event);
    var check = false;
    for(var i = 0; i < curVertices.length; i++){
        if((curVertices[i][0]-0.05<v[0]&&curVertices[i][0]+0.05>v[0])&&(curVertices[i][1]-0.05<v[1]&&curVertices[i][1]+0.05>v[1])){
          check = true;
          return 1;
        }
    }
    if(!check){
        if(document.getElementById("mode").value == "1"){
            if(curVertices.length >= 3){
                var length = curVertices.length;
                curVertices.push(curVertices[length-2]);
                pushColors();
                render();
                curVertices.push(curVertices[length-1]);
				pushColors();
                render();
            }
        }
        if(snapToGrid.checked){
        	var xAux = v[0];
        	var yAux = v[1];

        	if(xAux%0.1 < 0.1/2) xAux -= (xAux%0.1);
        	else xAux += (0.1-(xAux%0.1));
        	if(yAux%0.1 < 0.1/2) yAux -= (yAux%0.1);
        	else yAux += (0.1-(yAux%0.1));

        	curVertices.push([xAux,yAux]);
        }
        else curVertices.push(v); 
        pushColors();
        render();
    }
}

function pushColors(){
	colors.push([r,g,b,a]);
	pointColors.push([0.0,0.0,0.0,1.0]);	
}

function getVertexInfo(){
        var v = getMousePosition(event);
        var uiX = document.getElementById("coordX");
        var uiY = document.getElementById("coordY");
        var r1 = document.getElementById("r1");
        var g1 = document.getElementById("g1");
        var b1 = document.getElementById("b1");
        var a1 = document.getElementById("a1");

        for(var i = 0; i < curVertices.length; i++){
            if((curVertices[i][0]-0.05<v[0]&&curVertices[i][0]+0.05>v[0])&&(curVertices[i][1]-0.05<v[1]&&curVertices[i][1]+0.05>v[1])){
              uiX.value = curVertices[i][0];
              uiY.value = curVertices[i][1];  
              r1.value = colors[i][0];
              g1.value = colors[i][1];
              b1.value = colors[i][2];
              a1.value = colors[i][3];
              selectedVertex = [curVertices[i][0], curVertices[i][1]];
            }
        }
}

function setVertexInfo(){
        var uiX = document.getElementById("coordX");
        var uiY = document.getElementById("coordY");
        var r1 = document.getElementById("r1");
        var g1 = document.getElementById("g1");
        var b1 = document.getElementById("b1");
        var a1 = document.getElementById("a1");

        for(var i = 0; i < curVertices.length; i++){
            if(curVertices[i][0] == selectedVertex[0] && curVertices[i][1] == selectedVertex[1]){
                curVertices[i] = [uiX.value, uiY.value];
                colors[i] = [r1.value, g1.value, b1.value, a1.value];
                render();
            }
        }
}

function flatten( v )
{
    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}
