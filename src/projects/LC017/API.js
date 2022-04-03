class Api{
  constructor(){
    this.ss = SpreadsheetApp.getActive()
  }

  /**
   * Protect all sheets in current spreadsheet
   */
  protectSheets(){
    const sheets = this.ss.getSheets()
    const editors = this.ss.getEditors()
    sheets.forEach(sheet => {
      const protection = sheet.protect().removeEditors(editors)
      // make some ranges in the sheet editable
      // protection.setUnprotectedRanges()
    })
  }
  /**
   * Unprotect sheet with given names
   * @param {String} sheetName Comma separated sheet names
   */
  unprotectSheets(sheetNames){
    const names = sheetNames.split(",").map(v => v.trim()).filter(v => v !== "")
    names.forEach(name => {
      const ws = this.ss.getSheetByName(name)
      if (!ws) return
      ws.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(p => p.remove())
      ws.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(p => p.remove())
    })
  }

  doPost(e){
    const {action, names} = e.parameter // .../api?action=protect&names=sheet1,sheet2,sheet3
    if (!action) throw new Error("Invalid request!")
    if (action === 'protect') {
      return this.protectSheets()
    }
    if (action === 'unprotect' && names) {
      return this.unprotectSheets(names)
    }
    throw new Error("Invalid request!")
  }
}

this._api = new Api()
const doPost = (e) => _api.doPost(e)