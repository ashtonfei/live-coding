class API{
  constructor(){
    this.name = APP_NAME
    this.app = SpreadsheetApp
    this.database = this.app.openById(DATABSE_ID)
  }

  createKeys(headers){
    return headers.map(header => header.toString().trim())
  }

  creaetItemObject(keys, values){
    const item = {}
    keys.forEach((key, index) => item[key] = values[index])
    return item
  }

  getItems(sheetName, pageSize=15, page=1){
    const ws = this.database.getSheetByName(sheetName)
    if (!ws) throw new Error(`${sheetName} was not found in the database!`)
    const [headers, ...records] = ws.getDataRange().getValues()
    const keys = this.createKeys(headers)

    const startIndex = (page - 1) * pageSize
    const items = records.slice(startIndex, startIndex + pageSize).map(values => this.creaetItemObject(keys, values))
    return {
      items,
      pages: Math.ceil(records.length/pageSize),
      pageSize,
      page,
    }
  }
}

const api = new API()
const getItems = (jsonData) => {
  const {sheetName, pageSize, page} = JSON.parse(jsonData)
  const data = api.getItems(sheetName, pageSize, page)
  return JSON.stringify(data)
}