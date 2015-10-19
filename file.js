document.write('<script type="text/javascript" src="shape2d.js"></script>');

function writeFile(){

    var textToWrite;

    textToWrite = "%Coordinates\n";
    for (var i = 0; i < curVertices.length; i++){
        textToWrite += curVertices[i][0]+","+curVertices[i][1]+"\n";
    }
    textToWrite += "%Colors\n";
    for (var i = 0; i < colors.length; i++){
        textToWrite += colors[i][0]+","+colors[i][1]+","+colors[i][2]+","+colors[i][3]+"\n";
    }

    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = document.getElementById("fileName").value;
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function readFile(){
var fileInput = document.getElementById("choseFile");
var text;

fileInput.addEventListener('change', function(e) {
    var file = fileInput.files[0];
    var textType = /text.*/;

    if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
            text = reader.result;
            console.log(text);

            curVertices = [];
            colors = [];
            pointColors = [];
            var xAux ="";
            var yAux = "";
            var i;

            for(i = 13; text[i] != "%"; i++){
                while(text[i] != ','){
                    xAux += text[i];
                    i++;
                } i++;
                while(text[i] != '\n'){
                    yAux += text[i];
                    i++;
                }
                curVertices.push([xAux, yAux]);
                console.log(xAux);
                console.log(yAux);
                xAux = "";
                yAux = "";
            }

            var rAux = "";
            var gAux = "";
            var bAux = "";
            var aAux = "";
            
            for (var j = i+8; j < text.length; j++){
                while(text[j] != ','){
                    rAux += text[j];
                    j++;
                } j++;
                while(text[j] != ','){
                    gAux += text[j];
                    j++;
                } j++;
                while(text[j] != ','){
                    bAux += text[j];
                    j++;
                } j++;
                while(text[j] != '\n'){
                    aAux += text[j];
                    j++;
                }
                colors.push([rAux, gAux, bAux, aAux]);
                pointColors.push([0.0,0.0,0.0,1.0]);
                var rAux = "";
                var gAux = "";
                var bAux = "";
                var aAux = "";
                console.log(rAux+","+gAux+","+bAux+","+aAux);
            }
        }
        reader.readAsText(file);
    } else {
        fileDisplayArea.innerText = "File not supported!"
        return -1;
    }
    });
}


