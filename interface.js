document.write('<script type="text/javascript" src="shape2d.js"></script>');

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