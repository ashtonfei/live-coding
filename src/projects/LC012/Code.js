const CONFIG = {
  APP_NAME: "Clock In/Out",
  FORM_ID: {
    CLOCK_IN: "1lNWFSJljh3dJmFN6IgPy0kwqej5HZrLjyZ8TOjkRxJY",
    CLOCK_OUT: "1BVlHVxqxQP8pqsiEfDvYBoD0P5ZBYboJ3dhNMdHsZ2U",
  },
  SHEET_NAME: {
    RESPONSES: "Responses",
    NAMES: "Names",
  },
  HEADER: {
    NAME: "Name",
    CLOCK_IN: "Clock In",
    CLOCK_OUT: "Clock Out",
    HOURS: "Hours",
  },
  NO_MORE_NAMES: "No more names",
  NAMES: ["Ashton", "Billy", "Chris", "Doris", "Ella", "Frank", "Green"],
}

function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu(CONFIG.APP_NAME)
    .addItem("Update form names", "updateFormNames")
    .addToUi()
}

function getNames_(){
  const ws = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME.NAMES) 
  if (!ws) return CONFIG.NAMES
  const names = ws.getDataRange().getDisplayValues().slice(1).map(v => v[0])
  return names
}

function updateFormNames(){
  const formClockIn = FormApp.openById(CONFIG.FORM_ID.CLOCK_IN)
  const formClockOut = FormApp.openById(CONFIG.FORM_ID.CLOCK_OUT)

  const nameItemClockIn = getFormItemByTitle_(formClockIn, CONFIG.HEADER.NAME).asListItem()
  const names = getNames_()
  names.sort()
  nameItemClockIn.setChoiceValues(names)

  const nameItemClockOut = getFormItemByTitle_(formClockOut, CONFIG.HEADER.NAME).asListItem()
  nameItemClockOut.setChoiceValues([CONFIG.NO_MORE_NAMES])
}

/**
 * @param {object} e
 * @param {SpreadsheetApp.Range} e.range
 */
function _onFormSubmit(e) {
  if (!e) throw new Error("You can't run this function manaully, it only can be triggered by form submission!")
  const {range} = e
  const sheet = range.getSheet()
  const formUrl = sheet.getFormUrl()
  if (formUrl.includes(CONFIG.FORM_ID.CLOCK_IN)){
    handleClockIn_(e)
  } else if (formUrl.includes(CONFIG.FORM_ID.CLOCK_OUT)){
    handleClockOut_(e)
  }
}

function handleNamedValues_(values){
  const newValues = {}
  Object.entries(values).forEach(([key, value]) => {
    newValues[key] = Array.isArray(value) ? value.join(",") : value
  })
  return newValues
}

function createRowData_(headers, values, currentValues){
  return headers.map((header, index) => {
    if (values.hasOwnProperty(header)) {
      return values[header]
    } else if (header === CONFIG.HEADER.HOURS){
      return "=IF(RC[-1]>0,(RC[-1]-RC[-2])/1000*60*60,0)"
    } else {
      return currentValues ? currentValues[index] : null
    }
  })
}

/**
 * @param {Date} date1
 * @param {Date} date2
 */
function isSameDate_(date1, date2){
  if (typeof date1 === "string") date1 = new Date(date1)
  if (typeof date2 === "string") date2 = new Date(date1)
  return date1.toDateString() === date2.toDateString()
}

function outputResponse_(values, isClockIn=true){
  const ws = SpreadsheetApp.getActive().getSheetByName(CONFIG.SHEET_NAME.RESPONSES)
  const [headers, ...records] = ws.getDataRange().getValues()

  if (isClockIn){
    const rowData = createRowData_(headers, values)
    ws.getRange(records.length + 2, 1, 1, headers.length).setValues([rowData])
  } else {
    let findRowIndex = 0
    const nameIndex = headers.indexOf(CONFIG.HEADER.NAME)
    const clockInIndex = headers.indexOf(CONFIG.HEADER.CLOCK_IN)
    for (let rowIndex = records.length - 1; rowIndex >= 0; rowIndex -- ){
      const nameInRow = records[rowIndex][nameIndex]
      const clockInInRow = records[rowIndex][clockInIndex]
      if (!isSameDate_(clockInInRow, values["Timestamp"])) {
        break
      }
      if (nameInRow === values[CONFIG.HEADER.NAME]) {
        findRowIndex = rowIndex + 2
        break
      }
    }
    if (findRowIndex > 0){
      const rowData = createRowData_(headers, values, records[findRowIndex - 2])
      ws.getRange(findRowIndex, 1, 1, headers.length).setValues([rowData])
    }
  }
}

/**
 * @param {FormApp.Form} form
 */
function getFormItemByTitle_(form, title){
  return form.getItems().find(item => item.getTitle() === title)
}

function updateNameFields_(name, isClockIn=true){
  const formClockIn = FormApp.openById(CONFIG.FORM_ID.CLOCK_IN)
  const formClockOut = FormApp.openById(CONFIG.FORM_ID.CLOCK_OUT)

  const nameItemClockIn = getFormItemByTitle_(formClockIn, CONFIG.HEADER.NAME).asListItem()
  const nameItemClockOut = getFormItemByTitle_(formClockOut, CONFIG.HEADER.NAME).asListItem()

  if (isClockIn){
    const namesClockIn = nameItemClockIn.getChoices().map(item => item.getValue()).filter(v => v !== name)
    namesClockIn.sort()
    if (namesClockIn.length === 0) namesClockIn.push(CONFIG.NO_MORE_NAMES)
    nameItemClockIn.setChoiceValues(namesClockIn)
    
    const namesClockOut = nameItemClockOut.getChoices().map(item => item.getValue())
    namesClockOut.push(name)
    namesClockOut.sort()
    if (namesClockOut.length === 0) namesClockOut.push(CONFIG.NO_MORE_NAMES)
    nameItemClockOut.setChoiceValues(namesClockOut)
  }else{
    const namesClockOut = nameItemClockOut.getChoices().map(item => item.getValue()).filter(v => v !== name)
    namesClockOut.sort()
    if (namesClockOut.length === 0) namesClockOut.push(CONFIG.NO_MORE_NAMES)
    nameItemClockOut.setChoiceValues(namesClockOut)

    const namesClockIn = nameItemClockIn.getChoices().map(item => item.getValue())
    namesClockIn.push(name)
    namesClockIn.sort()
    if (namesClockIn.length === 0) namesClockIn.push(CONFIG.NO_MORE_NAMES)
    nameItemClockIn.setChoiceValues(namesClockIn)
  }
}

function handleClockIn_(e){
  const {namedValues} = e
  values = handleNamedValues_(namedValues)
  values[CONFIG.HEADER.CLOCK_IN] = values["Timestamp"]
  outputResponse_(values, true)

  updateNameFields_(values[CONFIG.HEADER.NAME], true)
}


function handleClockOut_(e){
  const {namedValues} = e
  values = handleNamedValues_(namedValues)
  values[CONFIG.HEADER.CLOCK_OUT] = values["Timestamp"]
  outputResponse_(values, false)

  updateNameFields_(values[CONFIG.HEADER.NAME], false)
}






















