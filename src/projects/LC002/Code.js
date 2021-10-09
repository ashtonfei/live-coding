const APP_NAME = "LC002"
const SN_EMAIL = "Email"
const SN_Tracking = "Tracking"

const App = class {
  constructor(name=APP_NAME){
    this.name = name
    this.ss = SpreadsheetApp.getActive()
    this.sheetEmail = null
    this.setSheetEmail()
    this.sheetTracking = null
    this.setSheetTracking()
  }

  setSheetEmail(name=SN_EMAIL){
    const sheet = this.ss.getSheetByName(name)
    if (!sheet) throw new Error(`Sheet with name "${name}" was not found.`)
    this.sheetEmail = sheet
    return this
  }

  setSheetTracking(name=SN_Tracking){
    const sheet = this.ss.getSheetByName(name)
    if (sheet) {
      this.sheetTracking = sheet
    }else{
      this.sheetTracking = this.ss.insertSheet(name)
    }
    return this
  }

  getEmailData(){
    const values = this.sheetEmail.getDataRange().getValues().slice(1)
    const emailData = {}
    values.forEach(([key, value]) =>{
      key = key.toString().trim()
      emailData[key] = value
    })
    return emailData
  }

  getSentEmail(subject){
    const query = `in:sent subject:${subject}`
    const threads = GmailApp.search(query, 0, 1)
    if (threads.length === 0) return
    return threads[0]
  }


  sendEmail({to, cc, bcc, subject, body}){
    const options = {
      cc,
      bcc,
      htmlBody: body.includes("</") ? body : null
    }
    GmailApp.sendEmail(to, subject, body, options)
    const sentEmail = this.getSentEmail(subject)
    if (!sentEmail) return console.error("No email sent was found.")
    return sentEmail
  }

  /**
   * JSDOC
   * @param {GmailApp.GmailThread} sentEmail The sent email object
   */
  trackEmail(sentEmail){
    const id = sentEmail.getId()
    const subject = sentEmail.getFirstMessageSubject()
    const sentAt = sentEmail.getLastMessageDate()
    const link = sentEmail.getPermalink()
    const headers = [
      "Thread ID",
      "Subject",
      "Sent At",
      "Link"
    ]
    this.sheetTracking.getRange(1, 1, 1, headers.length).setValues([headers])
    this.sheetTracking.appendRow([id, subject, sentAt, link]).activate()
  }

  sendAndTrackEmail(){
    const emailData = this.getEmailData()
    const sentEmail = this.sendEmail(emailData)
    this.trackEmail(sentEmail)
    // more functions
  }
}



function sendAndTrackEmail() {
  const app = new App()
  app.sendAndTrackEmail()
}

function onOpen(){
  const ui = SpreadsheetApp.getUi()
  ui.createMenu(APP_NAME)
    .addItem("Send & track email", "sendAndTrackEmail")
    .addToUi()
}
