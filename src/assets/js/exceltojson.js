/* xlsx.js (C) 2013-present SheetJS -- http://sheetjs.com */
/*global Uint8Array, console */
/* exported export_xlsx */
/* eslint no-use-before-define:0 */
var XLSX = require('xlsx');
var electron = require('electron').remote;
var ipcRenderer = require('electron').ipcRenderer;
var btn = document.createElement("BUTTON");
var t = document.createTextNode("CLICK ME");


ipcRenderer.send('on-send-data-to-render');
ipcRenderer.on('previewdata', function (event, eventdata) {
      console.log(eventdata);
      var HTMLOUT = document.getElementById('htmlout');
      HTMLOUT.innerHTML('eventdata');
		});


btn.appendChild(t);
btn.classList.add("btn", "btn-info");

var process_wb = (function () {
  var HTMLOUT = document.getElementById('htmlout');
  var XPORT = document.getElementById('xport');
  var pilihan = document.getElementById('pilihan');

  return function process_wb(wb) {
    //XPORT.disabled = false;
    HTMLOUT.innerHTML = "";
    document.body.appendChild(btn);
    wb.SheetNames.forEach(function (sheetName) {
      var json = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        raw: true
      });
      var data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
        header: 1
      });
      var htmlstr = XLSX.utils.sheet_to_html(wb.Sheets[sheetName], {
        editable: true
      });



      var keys = [];
      for (var k in json[0]) keys.push(k);



      var dt ;
    
       console.log(json.length);
       console.log(json);
       for (var i=0; i<json.length; i++)
       for (var name in json[i]) {
         dt=json[i][name];
           console.log(dt);
           HTMLOUT.innerHTML += dt;
       }
       
     
      

     if(pilihan.hasChildNodes() === true){
       while(pilihan.hasChildNodes()){
         pilihan.removeChild(pilihan.childNodes[0]);
       }
     }
     
     
      for (i = 0; i < keys.length; i++) {
       
        var newDiv = document.createElement("div");
        var newInput = document.createElement("input");
        var newLabel = document.createElement("label");
        var textLabel = document.createTextNode(keys[i]);


        newInput.setAttribute("type", "checkbox");
        newInput.setAttribute("checked",true);
        newInput.classList.add("form-check-input");
        newLabel.classList.add("form-check-label", "m-1");
        newDiv.classList.add("form-check","form-check-inline");

        newLabel.appendChild(newInput);
        newLabel.appendChild(textLabel);

        newDiv.appendChild(newLabel);
       
        pilihan.appendChild(newDiv);

      }



    });
  };
})();

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36810333-1']);
_gaq.push(['_trackPageview']);

(function () {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();



var do_file = (function () {
  return function do_file(files) {
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      data = new Uint8Array(data);
      process_wb(XLSX.read(data, {
        type: 'array'
      }));
    };
    reader.readAsArrayBuffer(f);
  };
})();

(function () {
  var drop = document.getElementById('drop');

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    do_file(e.dataTransfer.files);
  }

  function handleDragover(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }

  //drop.addEventListener('dragenter', handleDragover, false);
  //drop.addEventListener('dragover', handleDragover, false);
  //drop.addEventListener('drop', handleDrop, false);
})();

(function () {
  var readf = document.getElementById('readf');

  function handleF( /*e*/ ) {
    var o = electron.dialog.showOpenDialog({
      title: 'Select a file',
      filters: [{
        name: "Spreadsheets",
        extensions: "xls|xlsx|xlsm|xlsb|xml|xlw|xlc|csv|txt|dif|sylk|slk|prn|ods|fods|uos|dbf|wks|123|wq1|qpw|htm|html".split("|")
      }],
      properties: ['openFile']
    });
    if (o.length > 0) process_wb(XLSX.readFile(o[0]));
  }
  //readf.addEventListener('click', handleF, false);
})();

(function () {
  var xlf = document.getElementById('xlf');

  function handleFile(e) {
    do_file(e.target.files);
  }
  xlf.addEventListener('change', handleFile, false);
})();

var export_xlsx = (function () {
  var HTMLOUT = document.getElementById('htmlout');
  var XTENSION = "xls|xlsx|xlsm|xlsb|xml|csv|txt|dif|sylk|slk|prn|ods|fods|htm|html".split("|")
  return function () {
    var wb = XLSX.utils.table_to_book(HTMLOUT);
    var o = electron.dialog.showSaveDialog({
      title: 'Save file as',
      filters: [{
        name: "Spreadsheets",
        extensions: XTENSION
      }]
    });
    console.log(o);
    XLSX.writeFile(wb, o);
    electron.dialog.showMessageBox({
      message: "Exported data to " + o,
      buttons: ["OK"]
    });
  };
})();
void export_xlsx;
