const KEY_TRIGGER_INSTALLED = "triggerInstalled";

function toast_(msg, title = "Toast", timeoutInSeconds = 5) {
  return SpreadsheetApp.getActive().toast(msg, title, timeoutInSeconds);
}

/**
 * @param {Function} fn - The function to be debounced
 * @param {number} ms - The delay time in milliseconds
 * @returns {Function} A debounced version of the passed function
 */
function debounce_(fn, ms) {
  return function (...args) {
    // 1. save state of the function call
    const storage = PropertiesService.getUserProperties();
    const state = Date.now().toString();
    const key = fn.name;
    storage.setProperty(key, state);

    // 2. delay the process
    Utilities.sleep(ms);

    // 3. Check state
    if (storage.getProperty(key) != state) {
      return console.log("Ignored");
    }
    fn(...args);
    console.log("Invokded");
  };
}

/**
 * @param {GoogleAppsScript.Events.SheetsOnEdit} e
 */
function onEdit_(e) {
  const data = {
    old: e.oldValue ?? "No old value",
    new: e.value ?? "No new value",
    range: e.range.getA1Notation(),
  };
  const msg = JSON.stringify(data, null, 2);
  toast_(msg, "OnEdit");
}

function onEditDebounced(e) {
  debounce_(onEdit_, 3000)(e);
}

function onEdit(e) {
  onEditDebounced(e);
}

function uninstallOnEditTrigger() {
  const triggerFunctionName = "onEditDebounced";
  ScriptApp.getProjectTriggers().forEach((trigger) => {
    if (trigger.getHandlerFunction() != triggerFunctionName) return;
    if (trigger.getEventType() != ScriptApp.EventType.ON_EDIT) return;
    ScriptApp.deleteTrigger(trigger);
  });
  PropertiesService.getScriptProperties().deleteProperty(KEY_TRIGGER_INSTALLED);
  onOpen();
}

function installOnEditTrigger() {
  const triggerFunctionName = "onEditDebounced";
  uninstallOnEditTrigger();
  ScriptApp.newTrigger(triggerFunctionName)
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  PropertiesService.getScriptProperties().setProperty(
    KEY_TRIGGER_INSTALLED,
    true,
  );
  onOpen();
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu("Script");
  const triggerInstalled = PropertiesService.getScriptProperties().getProperty(
    KEY_TRIGGER_INSTALLED,
  );
  if (triggerInstalled) {
    menu.addItem("Uninstall onEdit trigger", "uninstallOnEditTrigger");
  } else {
    menu.addItem("Install onEdit trigger", "installOnEditTrigger");
  }
  menu.addToUi();
}
