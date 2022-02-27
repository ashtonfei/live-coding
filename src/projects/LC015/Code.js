const SETTINGS = {
  APP_NAME: "RichText Formatter",
  SHEET_NAME: {
    STYLES: "Styles"
  }
}

function test(){
  const styles = getStyle_()
  // console.log(styles)
  // const indexes = findAllIndexes_("apple", "google")
  // console.log(indexes)
  const activeCell = SpreadsheetApp.getActive().getActiveCell()
  const value = activeCell.getRichTextValue()
  const newValue = updateRichTextValue_(value, styles)
  activeCell.setRichTextValue(newValue)
}

function getStyle_() {
  const ss = SpreadsheetApp.getActive()
  const sheet = ss.getSheetByName(SETTINGS.SHEET_NAME.STYLES)
  const styles = {}
  const [, ...values] = sheet.getDataRange().getRichTextValues()
  values.forEach(rowValues => {
    const key = rowValues[0].getText()
    const runs = rowValues[0].getRuns()
    styles[key] = runs.map(run => {
      const length = run.getEndIndex() - run.getStartIndex()
      run["length"] = length
      return run
    }).filter(run => run.length > 0)
  })
  return styles
}

/**
 * @param {string} text
 * @param {string} keyword
 * @returns {number[]}
 */
function findAllIndexes_(text, keyword){
  const re = new RegExp(keyword, "g") // add "i" flag for case insensitive
  return [...text.matchAll(re)].map(item => item.index)
}

/**
 * @param {SpreadsheetApp.RichTextValue} value
 * @param {Object} styles
 */
function updateRichTextValue_(value, styles){
  const text = value.getText()
  const copyValue = value.copy()
  Object.entries(styles).forEach(([keyword, runs]) => {
    const indexes = findAllIndexes_(text, keyword)
    indexes.forEach(index => {
      let startIndex = index
      runs.forEach(run => {
        const endIndex = startIndex + run.length
        copyValue.setTextStyle(startIndex, endIndex, run.getTextStyle())
        startIndex += run.length
      })
    })
  })
  return copyValue.build()
}


function applyStyles(){
  const ss = SpreadsheetApp.getActive()
  const styles = getStyle_()
  const activeRange = ss.getActiveRange()
  const values = activeRange.getRichTextValues()
  const newValues = values.map(rowValues => {
    return rowValues.map(value => updateRichTextValue_(value, styles))
  })
  activeRange.setRichTextValues(newValues)
}


function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu(SETTINGS.APP_NAME)
    .addItem("Format", "applyStyles")
    .addToUi()
}