const _createMenu_ =
  (ui = SpreadsheetApp.getUi()) => (items, caption = null) => {
    const menu = caption ? ui.createMenu(caption) : ui.createAddonMenu();
    const createMenuItem = ({ title, items, caption, fn, sep }) => {
      if (title && items) {
        return menu.addSubMenu(_createMenu_(ui)(items, title));
      }
      if (caption && fn) return menu.addItem(caption, fn);

      if (sep) return menu.addSeparator();
    };
    items.forEach(createMenuItem);
    return menu;
  };

const fnToBeDone = () => {
  SpreadsheetApp.getUi().alert("FN to be done.");
};

const MENU_ITEMS = [
  // menu item object with caption and fn
  { caption: "Func A", fn: "fnToBeDone" },
  // menu separator object with sep = true
  { sep: true },
  // Sub menu object with title and items
  {
    title: "Sub Menu",
    items: [
      { caption: "Func A", fn: "fnToBeDone" },
      { sep: true },
      {
        title: "Sub Menu",
        items: [
          { caption: "Func A ", fn: "fnToBeDone" },
          { caption: "Func B ", fn: "fnToBeDone" },
          { caption: "Func C", fn: "fnToBeDone" },
        ],
      },
    ],
  },
  { caption: "Func B", fn: "fnToBeDone" },
];

const onOpen = () => {
  const ui = SpreadsheetApp.getUi();
  const buildMenu = _createMenu_(ui);
  // create a custom menu
  const menu = buildMenu(MENU_ITEMS, "LC022");
  // create an addon menu
  const addonMenu = buildMenu(MENU_ITEMS);
  menu.addToUi();
  addonMenu.addToUi();
};
