const ipcRenderer = require("electron").ipcRenderer;
        
ipcRenderer.on('fill-direct-toPrint', (event, content) => {
  document.getElementById('htmlout').innerHTML = content;
  // ipcRenderer.send("readyToPrint");
})
ipcRenderer.on('fill-PrintTo-PDF', (event, content) => {
  document.getElementById('htmlout').innerHTML = content;
});