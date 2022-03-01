const CONFIG = {
  APP_NAME: "Twilio",
  SHEET_NAME: {
    APP: "App",
    MESSAGE: "Message",
  }
}

function getAppData_(){
  const sheetApp = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME.APP)
  const values = sheetApp.getDataRange().getDisplayValues()
  return {
    SID: values[0][1].trim(), // B1
    TOKEN: values[1][1].trim(), // B2
    FROM: values[2][1].trim(), // B3
  }
}

function sendMessage_({to, body}, {SID, TOKEN, FROM}){
  const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`
  const token = Utilities.base64Encode(`${SID}:${TOKEN}`)
  const payload = {
    Body: body,
    To: to,
    From: FROM
  }
  const options = {
    method: "POST", // by default is "GET"
    headers: {
      "Authorization": "Basic " + token
    },
    payload,
    muteHttpExceptions: true, // it's false by default
  }
  try{
    const response = UrlFetchApp.fetch(url, options)
    return JSON.parse(response.getContentText())
  }catch(error){
    return error.message
  }
}

function sendMessages(){
  const ui = SpreadsheetApp.getUi()
  const ss = SpreadsheetApp.getActive()
  try{
    const confirm = ui.alert(`${CONFIG.APP_NAME} [Confirm]`, 'Are you sure to send these messages?', ui.ButtonSet.YES_NO)
    if (confirm !== ui.Button.YES) return ss.toast(CONFIG.APP_NAME, "Cancelled!")
    ss.toast(CONFIG.APP_NAME, "Sending messages ...")
    const appData = getAppData_()
    const sheetMessage = ss.getSheetByName(CONFIG.SHEET_NAME.MESSAGE)
    const [headers, ...rows] = sheetMessage.getDataRange().getDisplayValues()
    const results = []
    let successCount = 0
    let errorCount = 0
    rows.forEach(([to, body]) => {
      const message = {to, body}
      const result = sendMessage_(message, appData)
      if (result.message) {
        results.push([`Error: ${result.message} => ${result.more_info}`, new Date()])
        errorCount ++
      } else if (typeof result === "string") {
        results.push([`Error: ${result}`, new Date()])
        errorCount ++
      } else {
        results.push([`Success: ${message.body}`, new Date()])
        successCount ++
      }
    })
    if (results.length) sheetMessage.getRange(2, 3, results.length, results[0].length).setValues(results)
    const message = `Done!\nSuccess: ${successCount}\nError: ${errorCount}`
    ui.alert(`${CONFIG.APP_NAME} [Message]`, message, ui.ButtonSet.OK)
  }catch(error){
    ui.alert(`${CONFIG.APP_NAME} [Error]`, error.message, ui.ButtonSet.OK)
  }
}

function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu(CONFIG.APP_NAME)
    .addItem("Send messages", "sendMessages")
    .addToUi()
}