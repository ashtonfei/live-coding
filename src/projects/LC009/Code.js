const REGION = {
  "EMEA": ["France", "Filand", "Denmark"],
  "AP": ["Japan", "China", "Thailand"],
}

const REGION_DEMO = {
  "EMEA": ["France", "Filand", "Denmark"],
  "AP": ["Japan", "China", "Thailand"],
  "NA": ["Canada", "US"]
}

const CITY_DEMO = {
  "France": ['France 1'],
  "Filand": ['Filand 1'],
  "Denmark": ['Denmark 1'],
  "Japan": ['Japan 1'],
  "China": ['China 1'],
  "Thailand": ['Thailand 1'],
  "Canada": ['Canada 1'],
  "US": ['US 1'],
}



/**
 * This is the trigger function when a cell is editted
 * @param {object} e
 * @param {SpreadsheetApp.Range} e.range
 * @param {string} e.value
 * @param {string} e.oldValue
 * @returns {void}
 */
function onEdit(e) {
  const range = e.range
  const {rowStart, rowEnd, columnStart, columnEnd} = range
  const value = e.value
  if (rowStart !== rowEnd) return
  if (columnStart !== columnEnd) return

  const currentCell = {
    value,
    rowStart,
    columnStart,
    sheet: range.getSheet()
  }

  const targetCell = {
    name: "Data",
    editColumn: 4,
    editRowStart: 2,
    rowOffset: 0,
    columnOffset: 1
  }
  updateCellValidation(currentCell, targetCell, REGION) 

  const targetCellDemo = {
    name: "Demo",
    editColumn: 1,
    editRowStart: 2,
    rowOffset: 0,
    columnOffset: 1
  }
  updateCellValidation(currentCell, targetCellDemo, REGION_DEMO)

  const targetCellCityDemo = {
    name: "Demo",
    editColumn: 2,
    editRowStart: 2,
    rowOffset: 0,
    columnOffset: 1
  }
  updateCellValidation(currentCell, targetCellCityDemo, CITY_DEMO)
}

/**
 * @param {object} currentCell
 * @param {string} currentCell.value
 * @param {number} currentCell.rowStart
 * @param {number} currentCell.columnStart
 * @param {SpreadsheetApp.Sheet} currentCell.sheet
 * 
 * @param {object} targetCell
 * @param {string} targetCell.name
 * @param {number} targetCell.editColumn
 * @param {number} targetCell.editRowStart
 * @param {number} targetCell.rowOffset
 * @param {number} targetCell.columnOffset
 * 
 * @param {object} data
 * @returns {void}
 */
function updateCellValidation(currentCell, targetCell, data){
  if (currentCell.sheet.getName() !== targetCell.name) return
  if (currentCell.rowStart < targetCell.editRowStart) return
  if (currentCell.columnStart !== targetCell.editColumn) return
  const row = currentCell.rowStart + targetCell.rowOffset
  const column = currentCell.columnStart + targetCell.columnOffset
  const targetRange = currentCell.sheet.getRange(row, column)
  const items = data[currentCell.value]
  if (!items) return
  const dataValidation = SpreadsheetApp.newDataValidation().requireValueInList(items).build()
  targetRange.setDataValidation(dataValidation)
  targetRange.setValue(null)
}





















