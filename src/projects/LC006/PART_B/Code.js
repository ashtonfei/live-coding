const APP_NAME = "LC006"
const HEADERS = [
  "draft",
  "status",
  "thread",
  "timestamp",
  "subject",
  "to",
  "cc",
  "bcc",
  "attachments",
  "{{placeholderOne}}",
  "{{placeholderTwo}}",
  "{{placeholderThree}}",
]
const STATUS = {
  SUCCESS: "Scucess",
  FAILED: "Failed",
}

class App{
  constructor(){
    this.name = APP_NAME
    this.ss = SpreadsheetApp.getActive()
    this.headers = HEADERS
    this.draftIdSep = ":"
  }

  /**
   * Grabe all drafts from your Gmail and create a data valiation
   * @returns {SpreadsheetApp.DataValidation} The draft data validation
   */
  createDraftValidation(){
    const drafts = GmailApp.getDrafts().map((draft)=>{
      const id = draft.getId()
      const subject = draft.getMessage().getSubject()
      return `${subject}${this.draftIdSep}${id}`
    })
    return SpreadsheetApp.newDataValidation()
      .requireValueInList(drafts)
      .setAllowInvalid(false)
      .build()
  }

  /**
   * Add the default heders
   * @param {SpreadsheetApp.Sheet} ws The Google Sheet object
   * @returns {void}
   */
  updateTemplate(ws){
    ws.getRange(1,1, 1, this.headers.length).setValues([this.headers])
    const draftValidation = this.createDraftValidation()
    ws.getRange("A2:A").setDataValidation(draftValidation)
  }

  updateDraftValidations(){
    const draftValidation = this.createDraftValidation()
    this.ss.getSheets().forEach(sheet => {
      const a1Value = sheet.getRange("A1").getDisplayValue()
      if (a1Value === this.headers[0]){
        sheet.getRange("A2:A").setDataValidation(draftValidation)
      }
    })
  }

  createTemplate(){
    const ui = SpreadsheetApp.getUi()
    const nameInput = ui.prompt(`${APP_NAME}`, "Please enter the template name here:" ,ui.ButtonSet.OK_CANCEL)
    if (nameInput.getSelectedButton() !== ui.Button.OK) return
    const name = nameInput.getResponseText().trim()
    const ws = this.ss.getSheetByName(name)
    if (ws) return ui.alert(`${APP_NAME} [Warning]`, `We already have a sheet with name "${name}", pick another one!`, ui.ButtonSet.OK)
    const template = this.ss.insertSheet(name)
    this.updateTemplate(template)
    template.activate()
    ui.alert(`${APP_NAME} [Success]`, `The new template has been created!`, ui.ButtonSet.OK)
  }

  getDraftHtmlBody(draftId){
    const draft = GmailApp.getDraft(draftId)
    return draft.getMessage().getBody()
  }

  createAttachments(lines){
    const attachments = []
    if (lines === "") return attachments
    lines.split("\n").forEach(line => {
      let id = line
      if (id.includes("/d/")){
        id = line.split("/d/")[1].split("/")[0]
      }
      try{
        const file = DriveApp.getFileById(id)
        attachments.push(file.getBlob())
      }catch(err){
        // pass
      }
    })
    return attachments
  }

  createImageBlob(url){
    if (url === "") return
    try{
      return UrlFetchApp.fetch(url).getBlob()
    }catch(err){
      // pass
    }
  }

  handleRowData(rowValues, headers){
    const emailData = {}
    emailData.inlineImages = {}
    const placeholders = {}
    const emailDataKeys = this.headers.slice(0, 9)

    headers.forEach((header, index) => {
      if (emailDataKeys.includes(header)){
        if (header === "attachments"){
          emailData[header] = this.createAttachments(rowValues[index])
        }else{
          emailData[header] = rowValues[index]
        }
      }else{
        if (header.startsWith("{{image")){
          const imageBlob = this.createImageBlob(rowValues[index])
          placeholders[header] = `<img src="cid:${header}">`
          emailData.inlineImages[header] = imageBlob
        }else{
          placeholders[header] = rowValues[index]
        }
      }
    })
    return {
      emailData,
      placeholders
    }
  }

  updateHtmlBody(htmlBody, placeholders ){
    Object.entries(placeholders).forEach(([key, value])=>{
      const regex = new RegExp(key, "gi")
      htmlBody = htmlBody.replace(regex, value)
    })
    return htmlBody
  }

  getSentEmailBySubject(subject){
    return GmailApp.search(`in:sent subject:${subject}`, 0, 1)[0]
  }

  /**
   * @returns {GmailApp.GmailThread}
   */
  sendEmail(rowValues, headers){
    const {emailData, placeholders} = this.handleRowData(rowValues, headers)
    // get draft html body
    const draftId = emailData.draft.split(this.draftIdSep)[1]
    const draftHtmlBody = this.getDraftHtmlBody(draftId)

    // get placeholders data
    const htmlBody = this.updateHtmlBody(draftHtmlBody, placeholders)
    
    const options = {
      cc: emailData.cc,
      bcc: emailData.bcc,
      attachments: emailData.attachments,
      htmlBody,
      inlineImages: emailData.inlineImages,
    }
    try{
      GmailApp.sendEmail(emailData.to, emailData.subject, "", options)
      const sentEmail = this.getSentEmailBySubject(emailData.subject)
      return sentEmail
    }catch(err){
      return err.message
    }
  }

  run(){
    const ui = SpreadsheetApp.getUi()
    const ws = this.ss.getActiveSheet()
    const a1Value = ws.getRange("A1").getDisplayValue()
    if (a1Value !== this.headers[0]) {
      return ui.alert(`${this.name} [Warning]`, "Current sheet is not a valid template, select another one", ui.ButtonSet.OK)
    }
    const [headers, ...values] = ws.getDataRange().getValues()
    values.forEach((rowValues, index) => {
      if (values[index][2] === ""){
        const result = this.sendEmail(rowValues, headers)
        if (typeof result === "string"){
          values[index][1] = `${STATUS.FAILED} - ${result}`
          values[index][2] = ""
          values[index][3] = ""
        }else{
          values[index][1] = STATUS.SUCCESS
          values[index][2] = result.getId()
          values[index][3] = new Date()
        }
      }
    })
    ws.getRange(2, 1, values.length, values[0].length).setValues(values)
  }
}

/**
 * Check active sheet and sent emails with row data
 */
function run() {
  new App().run()
}


function createTemplate(){
  new App().createTemplate()
}

function updateDraftValidations(){
  new App().updateDraftValidations()
}

function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu(APP_NAME)
    .addItem("Mail merge", "run")
    .addSeparator()
    .addItem("Create template", "createTemplate")
    .addItem("Update draft validations", "updateDraftValidations")
    .addToUi()
}


