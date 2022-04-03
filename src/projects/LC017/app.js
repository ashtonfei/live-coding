this.CONFIG = {
  NAME: "LC017",
  API: "https://script.google.com/macros/s/AKfycby0xdOzEo8igw5cGNGk89vaS6a55JVrEgYdHxjgNKYrZieybrSZHphOC9lBTIaf94fa/exec",
  SN: {
    RESPONSES: "Responses",
  },
  HEADER: {
    FORM: ["Timestamp", "Email", "Comments", "Created By"]
  }
}

class App{
  constructor(){
    this.ss = SpreadsheetApp.getActive()
    this.user = Session.getActiveUser().getEmail()
  }

  request(action, names=[]){
    const url = `${CONFIG.API}?action=${action}&names=${names.join(".")}`
    UrlFetchApp.fetch(url, {
      method: "post"
    })
  }

  protectSheets(){
    const action = "protect"
    this.request(action)
  }

  unprotectSheets(names){
    const action = "unprotect"
    this.request(action, names)
  }

  showForm(){
    const template = HtmlService.createTemplateFromFile("form.html")
    const ui = SpreadsheetApp.getUi()
    const title = `${CONFIG.NAME} - Demo Form`
    const html = template.evaluate().setTitle(title)
    ui.showSidebar(html)
  }

  submit(payload){
    payload = JSON.parse(payload)
    const values = [
      new Date(),
      payload.email,
      payload.comments,
      this.user,
    ]
    const ws = this.ss.getSheetByName(CONFIG.SN.RESPONSES) || this.ss.insertSheet(CONFIG.SN.RESPONSES)
    this.unprotectSheets([CONFIG.SN.RESPONSES])
    SpreadsheetApp.flush()
    ws.getRange(1,1, 1, CONFIG.HEADER.FORM.length).setValues([CONFIG.HEADER.FORM])
    const lastRow = ws.getLastRow()
    ws.getRange(lastRow + 1, 1, 1, values.length).setValues([values])
    SpreadsheetApp.flush()
    this.protectSheets()
  }

  onOpen(e){
    const ui = SpreadsheetApp.getUi()
    const menu = ui.createMenu(CONFIG.NAME)
    menu.addItem("Open Form", "showForm")
    menu.addToUi()
  }
}

this._app = new App()

const showForm = () => _app.showForm()
const onOpen = (e) => _app.onOpen(e)
const submit = (payload) => _app.submit(payload)