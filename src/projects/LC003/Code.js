const APP_NAME = "LC003 - Google Doc to Web Application"

function test(){
  const doc = DocumentApp.getActiveDocument()
  const links = Drive.Files.get(doc.getId()).exportLinks
  console.log(links)
}

function getHtmlFromDoc(){
  const id = DocumentApp.getActiveDocument().getId()
  const url = `https://docs.google.com/feeds/download/documents/export/Export?id=${id}&exportFormat=html`
  const response = UrlFetchApp.fetch(url, {
    headers:{
      "Authorization": "Bearer " + ScriptApp.getOAuthToken()
    }
  }).getContentText()
  return response
}

function doGet(){
  const content = getHtmlFromDoc()
  const htmloutput = HtmlService.createHtmlOutput().setContent(content).setTitle(APP_NAME)
  return htmloutput
}

