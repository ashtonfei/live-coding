const CONFIG = {
  INDEX: "index.html",
  NAME: "LC011 PART B",
  DB_ID: "1dvMm-bYIaFWgvhOVFAJJ4YIHhZNE-A2jvwNuVcTcLeg",
}

class App{
  constructor(){
    this.db = SpreadsheetApp.openById(CONFIG.DB_ID)
  }

  login({email, password}) {
    if (password !== "password") {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }
    return {
      user: {name: "Ashton Fei", token: "password"},
      success: true,
      message: "Welcome!",
    }
  }

  logout({token}){
    return {
      success: true,
      message: "You've been logged out!",
    }
  }
}

const app = new App()

const login = (params) => {
  params = JSON.parse(params)
  const data = app.login(params)
  return JSON.stringify(data)
}

const logout = (params) => {
  params = JSON.parse(params)
  const data = app.logout(params)
  return JSON.stringify(data)
}

function doGet() {
  return HtmlService.createTemplateFromFile(CONFIG.INDEX)
    .evaluate()
    .setTitle(CONFIG.NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
}


function include_(filename){
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}


