/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const CONFIG = {
  TITLE: "GAS VUE3 TEMPLATE",
};

function doGet(e) {
  return HtmlService.createTemplateFromFile("index.html")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(CONFIG.TITLE);
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function apiSetCount(payload) {
  payload = JSON.parse(payload);
  const ws = SpreadsheetApp.getActive().getSheetByName("Sheet1");
  ws.getRange("A1").setValue(payload.count);
  return JSON.stringify({
    success: true,
    message: "Count has been set!",
  });
}
