/**
 * @param {Function[]} rules - A list of functions which return true or an error message
 * @param {any} value - The value to be checked
 * @returns {string[]} A list of error messages
 */
const createValidator_ = (rules) => (value) =>
  rules
    .map((rule) => rule(value))
    .filter((v) => v !== true)
    .map((v) => `${v}\nYour input: ${value}`);

/**
 * @param {string} title - The title of the prompt
 * @param {string} msg - The message body of the prompt
 * @param {Function[]|undefined} rules - A list of validator functions
 * @returns {string|null} return null if cancelled else return the value entered
 */
const createInput_ = (title) => (msg) => (rules) => {
  const ui = SpreadsheetApp.getUi();
  const input = ui.prompt(title, msg, ui.ButtonSet.OK_CANCEL);
  if (input.getSelectedButton() !== ui.Button.OK) return null;
  const value = input.getResponseText();
  if (!rules) return value;
  const validator = createValidator_(rules);
  const firstErrorMessage = validator(value)[0];
  if (!firstErrorMessage) return value;
  return createInput_(title)(firstErrorMessage)(rules);
};

const createAlert_ =
  (buttons = SpreadsheetApp.getUi().ButtonSet.OK) => (title) => (msg) =>
    SpreadsheetApp.getUi().alert(title, msg, buttons);

const success_ = createAlert_()("✅ SUCCESS");
const warning_ = createAlert_()("⚠️ WARNING");
const error_ = createAlert_()("❗️ERROR");

const nameInput_ = createInput_("👉 Name")("Enter your name here:");
const nameRules = [
  (name) => name.length >= 3 || "❗️ Name should have 3 letters at least.",
  (name) => name.length <= 10 || "❗️ Name should have 10 letters at most.",
  (name) => /^[a-zA-Z]$/.test(name) || "❗️ Only letters are allowed.",
  (name) =>
    /^[A-Z][a-z]+$/.test(name) ||
    "❗️Only and the first letter must be upper case.",
  (name) =>
    ["Alice", "Bob", "Chris", "Doris", "Ella"].includes(name) === false ||
    `❗️ "${name}" was already used, try another one please.`,
];

const getName = () => {
  const name = nameInput_(nameRules);
  if (name === null) {
    return warning_("Action was cancelled.");
  }
  success_(`The name entered was ${name}.`);
};

const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu("LC021")
    .addItem("Get name", "getName")
    .addToUi();
};
