// UrlFetchApp API https://www.imdb.com/search/title/?companies=co0001799 DONE

// RegExp scrap data form the HTML Done

// Save data to Spreatsheet

const APP_NAME = "LC008"
const TEST_URL = "https://www.imdb.com/search/title/?companies=co0001799"
const RE = {
  LISTER_ITEM: /<div class="lister-item mode-advanced">(.|\n)*?<\/p>\s+<\/div>\s*<\/div>/gmi,
  LISTER_ITEM_IMAGE: /<div class="lister-item-image float-left">(.|\n)*?<\/div>/gmi,
  LISTER_ITEM_CONTENT: /<div class="lister-item-content">(.|\n)*?<\/div>/gmi,
  TITLE: /adv_li_tt"\n*>(.|\n)*?<\/a>/gmi,
  YEAR: /<span class="lister-item-year text-muted unbold">(.|\n)*?<\/span>/gmi,
}
const SHEET_NAME = {
  COMPANYES: "Companies"
}

class App{
  constructor(){
    this.name = APP_NAME
    this.ss = SpreadsheetApp.getActive()
  }

  /**
   * Get the html content form URL
   * @param {string} url The URL of the web site
   * @returns {string} The HTML content in string
   */
  getHtmlContent(url=TEST_URL){
    const response = UrlFetchApp.fetch(url)
    const content = response.getContentText()
    return content
  }

  /**
   * Get the lister item image URL form the HTML content
   * @param {string} htmlContent The HTML content
   * @returns {strin} The URL of image
   */
  getListerItemImageUrl(htmlContent){
    const matches = htmlContent.match(RE.LISTER_ITEM_IMAGE)
    return matches[0].split('loadlate="')[1].split('"')[0]
  }

  getInnerHtmlContent(htmlContent){
    const startIndex = htmlContent.indexOf(">")
    const endIndex = htmlContent.lastIndexOf("</")
    return htmlContent.slice(startIndex + 1, endIndex)
  }

  getListerItemContent(htmlContent){
    const matches = htmlContent.match(RE.LISTER_ITEM_CONTENT)
    const content = matches[0]
    const title = this.getInnerHtmlContent(content.match(RE.TITLE)[0])
    const year = this.getInnerHtmlContent(content.match(RE.YEAR)[0])
    return {
      title,
      year,
      // more items can be added here
    }
  }

  /**
   * Get the lister items form the HTML content
   * @param {string} htmlContent The HTML content
   * @returns {string[]} An array of lister items
   */
  getListerItems(htmlContent){
    const matches = htmlContent.match(RE.LISTER_ITEM)
    return matches
  }

  valuesToSheet(values, sheetname){
    const ws = this.ss.getSheetByName(sheetname) || this.ss.insertSheet(sheetname)
    ws.clear()
    ws.getRange(1,1,values.length, values[0].length).setValues(values)
    ws.activate()
  }

  getMoviesForCompany(url=TEST_URL, companyName="Sony"){
    const movies = []
    const htmlContent = this.getHtmlContent(url)
    const listerItems = this.getListerItems(htmlContent)
    listerItems.forEach(listerItemContent => {
      const image = this.getListerItemImageUrl(listerItemContent)
      const {title, year} = this.getListerItemContent(listerItemContent)
      movies.push({
        title, 
        year,
        image
      })
    })
    
    const values = movies.map(movie => {
      return [
        movie.title,
        movie.year,
        `=IMAGE("${movie.image}")`,
        movie.image
      ]
    })
    values.unshift(["Title", "Year", "Image", "Image URL"])
    this.valuesToSheet(values, companyName)
  }

  updateAllCompanies(){
    const ws = this.ss.getSheetByName(SHEET_NAME.COMPANYES)
    const values = ws.getDataRange().getDisplayValues().slice(1)
    values.forEach(([companyName, url]) => {
      this.getMoviesForCompany(url, companyName)
    })
  }
}

const updateAllCompanies = () => new App().updateAllCompanies()
const onOpen = () => {
  SpreadsheetApp.getUi().createMenu(APP_NAME).addItem("Update movies", "updateAllCompanies").addToUi()
}








