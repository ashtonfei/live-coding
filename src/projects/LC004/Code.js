const APP_NAME = "LC004 Form with Multiple Dependent Dropdowns"
const FILES_FOLDER_NAME = "Images"

/**
 * Link the html file to another one
 */
function link(filename){
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

/**
 * Create a file on google drive
 */
function createFile(data, name){
  const id = SpreadsheetApp.getActive().getId()
  const currentFolder = DriveApp.getFileById(id).getParents().next()
  const folders = currentFolder.getFoldersByName(FILES_FOLDER_NAME)
  let folder = null
  if (folders.hasNext()) {
    folder = folders.next()
  }else{
    folder = currentFolder.createFolder(FILES_FOLDER_NAME)
  }
  const [fileType, fileData] = data.slice(5).split(";base64,")
  const decodedFileData = Utilities.base64Decode(fileData)
  const blob = Utilities.newBlob(decodedFileData, fileType).setName(name)
  const file = folder.createFile(blob)
  return file
}

/**
 * Handle get request
 */
function doGet() {
  return HtmlService.createTemplateFromFile("index.html").evaluate().setTitle(APP_NAME)
}

/**
 * Handle post request
 */
function doPost(e){
  const postData = e.parameter
  const uuid = Utilities.getUuid()
  const image = createFile(postData.data, postData.profile)
  //save to spreadsheet
  const ws = SpreadsheetApp.getActive().getSheetByName("Responses")
  ws.appendRow([uuid, postData.college, postData.department, postData.teacher, postData.profile, image.getUrl()])
  const html = `Thanks for your submission! \n${uuid}`
  return HtmlService.createHtmlOutput(html).setTitle("Success!")
}

