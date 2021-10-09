const APP_NAME = "DocPro"
const REPORTS_NAME = "New Docs"

/**
 * The App class
 */
class App{
  /**
   * @param {string} name The name of your application
   */
  constructor(name=APP_NAME){
    this.name = name
    this.ss = SpreadsheetApp.getActive()
    this.currentFolder = DriveApp.getFileById(this.ss.getId()).getParents().next()
    this.reportsFolder = null
    this.setReportsFolder() // set the default folder for reports
    this.template = null
    this.sheetTextPlaceholders = null
    this.sheetImagePlaceholders = null
    this.sheetsTablePlaceholders = []
  }

  /**
   * Add a function to set a folder for new reports
   */
  setReportsFolder(name = REPORTS_NAME){
    const folders = this.currentFolder.getFoldersByName(name)
    if (folders.hasNext()) {
      this.reportsFolder = folders.next()
    }else{
      this.reportsFolder = this.currentFolder.createFolder(name)
    }
    return this
  }

  /**
   * Set the do template by the document id
   */
  setTemplateById(id){
    this.template = DriveApp.getFileById(id) // Need to use DriveApp API here
    return this
  }

  /**
   * Set the sheet for text placeholders by sheet name
   */
  setTextPlaceholdersSheetByName(name){
    this.sheetTextPlaceholders = this.ss.getSheetByName(name)
    return this
  }
  /**
   * Get text placeholders from sheet
   */
  getTextPlaceholders(){
    const values = this.sheetTextPlaceholders.getDataRange().getDisplayValues().slice(1)
    const placeholders = {}
    values.forEach(([key, value])=>{
      key = key.toString().trim()
      if (key !== "") placeholders[key] = value // remove empty keys
    })
    return placeholders
  }

  /**
   * Set the image placeholders sheet by name
   */
  setImagePlaceholdersSheetByName(name){
    this.sheetImagePlaceholders = this.ss.getSheetByName(name)
    return this
  }

  getImagePlaceholders(){
    const placeholders = {}
    const values = this.sheetImagePlaceholders.getDataRange().getValues().slice(1)
    values.forEach(([key, id, url, width, height])=>{
      key = key.toString().trim()
      if (key !== "") placeholders[key] = {id, url, width, height}
    })
    return placeholders
  }

  /**
   * Set the table placeholders sheets by names
   */
  setTablePlaceholdersSheetsByNames(names){
    names.forEach(name => {
      const sheet = this.ss.getSheetByName(name)
      if (sheet) this.sheetsTablePlaceholders.push(sheet)
    })
    return this
  }

  getTablePlaceholders(){
    const placeholders = {}
    this.sheetsTablePlaceholders.forEach(sheet => {
      const values = sheet.getDataRange().getDisplayValues()
      const bgColors = sheet.getDataRange().getBackgrounds()
      const colors = sheet.getDataRange().getFontColors()
      placeholders[sheet.getName()] = values.map((rowValues, rowIndex) => {
        return rowValues.map((cellValue, columnIndex)=>{
          // let's add more table attribute to the table placeholders data
          return {
            value: cellValue,
            bgColor: bgColors[rowIndex][columnIndex],
            style: {
              FOREGROUND_COLOR: colors[rowIndex][columnIndex]
            }
          }
        })
      })
    })
    return placeholders
  }

  makeCopyOfTemplate(name){
    const copy = this.template.makeCopy(name, this.reportsFolder) // update the reports folder
    return DocumentApp.openById(copy.getId())
  }
  

  /**
   * Create a new doc and update the placeholders
   */
  createDoc(){
    const textPlaceholders = this.getTextPlaceholders()
    const imagePlaceholders = this.getImagePlaceholders()
    const tablePlaceholders = this.getTablePlaceholders()

    const newDocName = `${this.name} ${new Date().toLocaleString()}`
    const newDoc = this.makeCopyOfTemplate(newDocName)
    
    DocPro.replaceTextPlaceholders(newDoc, textPlaceholders)
    DocPro.replaceImagePlaceholders(newDoc, imagePlaceholders)
    DocPro.replaceTablePlaceholders(newDoc, tablePlaceholders)
    return newDoc
  }
}

/**
 * Run this function to create a doc with a template and data in the spreadsheet
 */
function createDoc(){
  // add a try catch block to improve end user UX/UI
  // to be complated
  const ui = SpreadsheetApp.getUi()
  const confirm = ui.alert(`${APP_NAME} [Confirmation]`, "Are you sure to create a new report?", ui.ButtonSet.YES_NO)
  if (confirm !== ui.Button.YES) return // exit function if user clicks No or "X" (close)
  try{
    const app = new App()
      .setTemplateById("1zsSEzBQMNmyGal4Lr3LChSqzxVX_zDkC_fYMq3gR-Xo")
      .setTextPlaceholdersSheetByName("Text")
      .setImagePlaceholdersSheetByName("Image")
      .setTablePlaceholdersSheetsByNames(["{{tableOne}}"]) // if you have more table sheets, add the names here
      .setReportsFolder("I like anothter folder") // overide the default
    const doc = app.createDoc()
    ui.alert(`${APP_NAME} [Success]`, `New doc has been created.\n${doc.getUrl()}`, ui.ButtonSet.OK)
  }catch(err){
    ui.alert(`${APP_NAME} [Error]`, err.message, ui.ButtonSet.OK)
  }
}

/**
 * Function is triggered every time the spreadsheet is opened
 */
function onOpen(){
  const ui = SpreadsheetApp.getUi()
  ui.createMenu(APP_NAME)
    .addItem("Create doc", "createDoc")
    .addToUi()
}