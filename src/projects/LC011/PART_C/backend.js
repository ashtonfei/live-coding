const CONFIG = {
  INDEX: "index.html",
  NAME: "LC011 PART C",
  DB_ID: "1dvMm-bYIaFWgvhOVFAJJ4YIHhZNE-A2jvwNuVcTcLeg",
  SHEET_NAME: {
    USERS: "users"
  },
  CACHE_EXPIRED_IN_SECONDS: 21600, // 6 hours
}

class App {
  constructor() {
    this.db = SpreadsheetApp.openById(CONFIG.DB_ID)
    this.cache = CacheService.getScriptCache()
  }

  createToken(user) {
    const token = Utilities.getUuid()
    this.cache.put(token, user.email, CONFIG.CACHE_EXPIRED_IN_SECONDS)
    return token
  }

  createItemObject(keys, values) {
    const item = {}
    keys.forEach((key, index) => item[key] = values[index])
    return item
  }

  validateToken(token) {
    const email = this.cache.get(token)
    if (!email) return false
    this.cache.put(token, email, CONFIG.CACHE_EXPIRED_IN_SECONDS)
    return email
  }



  getUserByEmail(email) {
    email = email.trim().toLowerCase()
    const ws = this.db.getSheetByName(CONFIG.SHEET_NAME.USERS)
    if (!ws) throw new Error(`${CONFIG.SHEET_NAME.USERS} was not found in the database.`)
    const [keys, ...records] = ws.getDataRange().getValues()
    const indexOfEmail = keys.indexOf("email")
    if (indexOfEmail === -1) throw new Error(`Header 'email' was not found in the table.`)
    const record = records.find(v => v[indexOfEmail].toString().trim().toLocaleLowerCase() == email)
    if (!record) return
    return this.createItemObject(keys, record)
  }

  login({ email, password, token }) {
    if (token) {
      const isValidToken = this.validateToken(token)
      if (!isValidToken) throw new Error(`The token is invalid, please login again.`)
      return {
        user: this.getUserByEmail(isValidToken),
        token,
      }
    }
    const user = this.getUserByEmail(email)
    if (!user) throw new Error(`${email} is not valid.`)
    if (password !== user.password) throw new Error(`Invalid Credentials!`)
    token = this.createToken(user)
    user.token = token
    return {
      user,
      token,
    }
  }

  logout({ token }) {
    this.cache.remove(token)
    return {
      success: true,
      message: "You've been logged out!"
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


function include_(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent()
}


