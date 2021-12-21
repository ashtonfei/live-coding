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
    records.reverse()
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

  generateNewId(keys, records){
    if (records.length === 0) return 1
    const lastRecord = records[records.length - 1]
    const indexOfId = keys.indexOf("id")
    const lastId = lastRecord[indexOfId]
    return lastId + 1
  }

  createItem(sheetName, jsonData){
    const ws = this.database.getSheetByName(sheetName)
    if (!ws) throw new Error(`${sheetName} was not found in the database!`)
    const data = JSON.parse(jsonData)
    const [headers, ...records] = ws.getDataRange().getValues()
    const keys = this.createKeys(headers)
    const id = this.generateNewId(keys, records)
    const newRecord = keys.map((key) => {
      if (key === "id") return id
      return data.hasOwnProperty(key) ? data[key] : null
    })
    ws.appendRow(newRecord)
    const item = this.creaetItemObject(keys, newRecord)
    return JSON.stringify(item)
  }

  updateItem(sheetName, jsonData){
    const ws = this.database.getSheetByName(sheetName)
    if (!ws) throw new Error(`${sheetName} was not found in the database!`)
    const data = JSON.parse(jsonData)
    const [headers, ...records] = ws.getDataRange().getValues()
    const keys = this.createKeys(headers)
    const indexOfId = keys.indexOf("id")
    const recordIndex = records.findIndex(record => record[indexOfId] == data.id)
    if (recordIndex === -1) throw new Error(`Record ${data.id} was not found in the database!`)
    const values = keys.map((key) => {
      return data.hasOwnProperty(key) ? data[key] : null
    })
    ws.getRange(recordIndex + 2, 1, 1, values.length).setValues([values])
    const item = this.creaetItemObject(keys, values)
    return JSON.stringify(item)
  }

  deleteItem(sheetName, jsonData){
    const ws = this.database.getSheetByName(sheetName)
    if (!ws) throw new Error(`${sheetName} was not found in the database!`)
    const {id} = JSON.parse(jsonData)
    const [headers, ...records] = ws.getDataRange().getValues()
    const keys = this.createKeys(headers)
    const indexOfId = keys.indexOf("id")
    const recordIndex = records.findIndex(record => record[indexOfId] == id)
    if (recordIndex === -1) throw new Error(`Record ${data.id} was not found in the database!`)
    ws.deleteRow(recordIndex + 2)
    return JSON.stringify({message: `Record with id ${id} has been deleted successfully.`})
  }
}

const api = new API()
const getItems = (jsonData) => {
  const {sheetName, pageSize, page} = JSON.parse(jsonData)
  const data = api.getItems(sheetName, pageSize, page)
  return JSON.stringify(data)
}

const createItem = (sheetName, jsonData) => api.createItem(sheetName, jsonData)
const updateItem = (sheetName, jsonData) => api.updateItem(sheetName, jsonData)
const deleteItem = (sheetName, jsonData) => api.deleteItem(sheetName, jsonData)












