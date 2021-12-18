const APP_NAME = "CRUD APP with Vue/Bootstrap/GAS"
const DATABSE_ID = "1bU3JhYH2FRRetvm7j0_TI_7XCRaDcRi77ycswb83z-A"

function doGet() {
  return HtmlService.createTemplateFromFile("index.html")
    .evaluate()
    .setTitle(APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}


function link(filename){
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}
