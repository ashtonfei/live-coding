const CONFIG = {
  INDEX: "index.html",
  NAME: "LC011",
}

function doGet() {
  return HtmlService.createTemplateFromFile(CONFIG.INDEX)
    .evaluate()
    .setTitle(CONFIG.NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}


function include_(filename){
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}