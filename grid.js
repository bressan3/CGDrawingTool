document.write('<script type="text/javascript" src="shape2d.js"></script>');

function showGrid(){
	program = initShaders( gl, "grid-vertex-shader", "grid-fragment-shader" );
    gl.useProgram(program);
    if(gl == null) console.log("GL is null");
	var checkbox = document.getElementById("ShowGrid");
	if(checkbox.checked){
		// Load the data into the GPU
	    var bufferId = gl.createBuffer();
	    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	    gl.bufferData( gl.ARRAY_BUFFER, flatten(gridCoord), gl.STATIC_DRAW );

	    // Associate our shader variables with our data buffer
	    var vPosition = gl.getAttribLocation( program, "vPosition" );
	    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	    gl.enableVertexAttribArray( vPosition );

	   	//gl.clear( gl.COLOR_BUFFER_BIT );
	    gl.drawArrays( gl.LINES, 0, gridCoord.length);
	} else {
		gl.clearColor(1.0,1.0,1.0,1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
}



