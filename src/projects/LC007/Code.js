const FOLDER_NAME_PDFS = "PDFs" // The source folder name of your PDF files

// 1. PDF -> Google Doc
/**
 * Convert a PDF file into a Google Doc
 * @param {string} id The id of the PDF
 * @returns {DocumentApp.Document} The Google Doc object
 */
function convertPdfToDoc(id, ocrLanguage="en"){
  const pdf = DriveApp.getFileById(id)
  const resource = {
    title: pdf.getName(),
    mimeType: pdf.getMimeType()
  }
  const mediaData = pdf.getBlob()
  const options = {
    convert: true,
    orc: true,
    ocrLanguage
  }
  const newFile = Drive.Files.insert(resource, mediaData, options)
  return DocumentApp.openById(newFile.id)
}
// 2. Read text from Google Doc
/**
 * Read text content form the PDF file
 * @param {string} id The id of the PDF file
 * @param {boolean} trashDocFile Delete or keep the Google Doc
 * @returns {string} The text content on the PDF file
 */
function readTextFromPdf(id, trashDocFile=true){
  const doc = convertPdfToDoc(id)
  const text = doc.getBody().getText()
  DriveApp.getFileById(doc.getId()).setTrashed(trashDocFile)
  return text
}

function getPdfFiles(folderName=FOLDER_NAME_PDFS){
  const ss = SpreadsheetApp.getActive()
  const currentFolder = DriveApp.getFileById(ss.getId()).getParents().next()
  const folders = currentFolder.getFoldersByName(folderName)
  if (!folders.hasNext()) return []
  const folder = folders.next()
  const files = folder.getFilesByType(MimeType.PDF)
  const ids = []
  while(files.hasNext()){
    ids.push(files.next().getId())
  }
  return ids
}

function getInvoiceDataFromText(text){
  const lines = text.split("\n")
  return {
    invoice: lines[3],
    balance: lines[lines.length -1].slice("Balance Due $ ".length)
  }
}

// 3. Scrap the info from the text and output to Google Sheet
function exportToSheet(){
  const values = [
    ["Invoice #", "Balance"]
  ]
  const ids = getPdfFiles()
  ids.forEach(id => {
     const text = readTextFromPdf(id)
     const {invoice, balance} = getInvoiceDataFromText(text)
      values.push([
        invoice,
        balance
      ])
  })

  const outputSheet = SpreadsheetApp.getActive().getActiveSheet()
  outputSheet.clear()
  outputSheet.getRange(1,1,values.length, values[0].length).setValues(values)
}

function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu("LC007")
    .addItem("Import data", "exportToSheet")
    .addToUi()
}








