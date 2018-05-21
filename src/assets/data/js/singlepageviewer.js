
'use strict';

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFSinglePageViewer) {
  alert('Please build the pdfjs-dist library using\n' +
        '  `gulp dist-install`');
}

// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
  '../../node_modules/pdfjs-dist/build/pdf.worker.js';

// Some PDFs need external cmaps.
//
var CMAP_URL = '../../node_modules/pdfjs-dist/cmaps/';
var CMAP_PACKED = true;

var DEFAULT_URL = '../pdf/test.pdf';
var SEARCH_FOR = ''; // try 'Mozilla';

var container = document.getElementById('viewerContainer');

// (Optionally) enable hyperlinks within PDF files.
var pdfLinkService = new pdfjsViewer.PDFLinkService();

var pdfSinglePageViewer = new pdfjsViewer.PDFSinglePageViewer({
  container: container,
  linkService: pdfLinkService,
});
pdfLinkService.setViewer(pdfSinglePageViewer);

// (Optionally) enable find controller.
var pdfFindController = new pdfjsViewer.PDFFindController({
  pdfViewer: pdfSinglePageViewer,
});
pdfSinglePageViewer.setFindController(pdfFindController);

container.addEventListener('pagesinit', function () {
  // We can use pdfSinglePageViewer now, e.g. let's change default scale.
  pdfSinglePageViewer.currentScaleValue = 'page-width';

  if (SEARCH_FOR) { // We can try search for things
    pdfFindController.executeCommand('find', {query: SEARCH_FOR});
  }
});

// Loading document.
pdfjsLib.getDocument({
  url: DEFAULT_URL,
  cMapUrl: CMAP_URL,
  cMapPacked: CMAP_PACKED,
}).then(function(pdfDocument) {
  // Document loaded, specifying document for the viewer and
  // the (optional) linkService.
  pdfSinglePageViewer.setDocument(pdfDocument);

  pdfLinkService.setDocument(pdfDocument, null);
});