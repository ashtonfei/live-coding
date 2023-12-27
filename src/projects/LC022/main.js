/**
 * @param {string} value The value to be checked
 * @returns {boolean} true if it's valid formula
 */
const isFormula_ = (value) => /^=.*[)}"a-z0-9]+$/i.test(value);

/**
 * @pram {string[]} headers The headers of the row values in the sheet
 * @pram {objec} item The item object with headers as keys
 * @pram {any[]} values The current values of the row
 * @pram {string[]} formulas The current formulas of the row
 * @returns {any[]} A list of values for the row
 */
const createRowValues_ = (headers) => (values, formulas) => (item) =>
  headers.map((header, index) => {
    const value = header in item ? item[header] : values?.[index];
    const formula = formulas?.[index];
    if (!formula) return value;
    return isFormula_(value) ? value : formula;
  });

/**
 * @pram {string[]} headers The headers of the row values in the sheet
 * @pram {objec[]} items The item objects with headers as keys
 * @pram {any[][]} values The current values of the range
 * @pram {string[][]} formulas The current formulas of the range
 * @returns {any[][]} A list of values for the range
 */
const createRangeValues_ = (headers) => (values, formulas) => (items) =>
  items.map((item, i) =>
    createRowValues_(headers)(values?.[i], formulas?.[i])(item)
  );

const test = () => {
  const headers = ["name", "email", "age", "gender"];
  const values = [
    ["Ashton", "", "", ""],
    ["Ella Zheng", "Link", "", ""],
  ];
  const formulas = [
    ["", "=TODAY()", "", ""],
    ["", `=HYPERLINK(RC[-1];"Link")`, "", ""],
  ];
  const createRangeValues = createRangeValues_(headers)(values, formulas);
  const ashton = {
    name: "Ashton Fei",
    email: "=NOW()",
    age: 30,
    gender: "Male",
  };
  const ella = {
    name: "Ella Fei",
    email: "ella@gmail.com",
    age: 38,
    gender: "Female",
  };
  const users = [ashton, ella];
  const userValues = createRangeValues(users);
  console.log(userValues);
};

const updateActiveRange = () => {
  const title = "Update active range";
  const ss = SpreadsheetApp.getActive();
  const rangeList = ss.getActiveRangeList();
  if (rangeList === null) return ss.toast("No selected ranges.", title);
  const range = rangeList.getRanges()[0];
  const [headers, ...values] = range.getValues();
  const formulas = range.getFormulas().slice(0);
  console.log(headers);
  console.log(values);
  console.log(formulas);
};

const onOpen = () => {
  const menu = SpreadsheetApp.getUi().createMenu("LC022");
  menu.addItem("Update active range", "updateActiveRange");
  menu.addToUi();
};
