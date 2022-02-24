const SETTINGS = {
  API_KEY: "f03405ee-fe4c-4f61-93b5-2a82b875fadb",
  API_ENDPOINT: "https://www.worldtides.info/api/v3",
  DAYS: 7,
  STEP: 3600,
  ADDRESS: "Bangkok, Thailand",
  CACHE_KEY: "tides",
  SHEET_NAME: "Tides",
  EVENT_TIME: 60, // in mins
  HIGH_COLOR: CalendarApp.EventColor.PALE_RED,
  LOW_COLOR: CalendarApp.EventColor.YELLOW,
}

function test(){
  getLocation_()
}

function buildApi_({date, days, step, lat, lon}){
  return `${SETTINGS.API_ENDPOINT}?key=${SETTINGS.API_KEY}&date=${date}&days=${days}&step=${step}&lat=${lat}&lon=${lon}&extremes`
}

function getLocation_(address=SETTINGS.ADDRESS){
  const {status, results} = Maps.newGeocoder().geocode(address)
  if (status === "OK") {
    const location = results[0].geometry.location
    const coordinates = {
      lat: location.lat,
      lon: location.lng
    } 
    return coordinates
  }
}

function cacheTides_(tides){
  const cache = CacheService.getScriptCache()
  cache.put(SETTINGS.CACHE_KEY, JSON.stringify(tides), 21600)
}

function saveTidesToSheet_(tides){
  const ss = SpreadsheetApp.getActive()
  const ws = ss.getSheetByName(SETTINGS.SHEET_NAME) || ss.insertSheet(SETTINGS.SHEET_NAME)
  const values = tides.map(({date, type, height}) => [new Date(date), type, height])
  values.unshift(["Date", "Type", "Height"])
  ws.clear()
  ws.getRange(1,1,values.length, values[0].length).setValues(values)
}


function getTides_(useCache=true){
  const cache = CacheService.getScriptCache()
  let tides = cache.get(SETTINGS.CACHE_KEY)
  if (tides && useCache){
    tides = JSON.parse(tides)
    saveTidesToSheet_(tides)
    return tides
  }

  const {lat, lon} = getLocation_()

  const params = {
    date: new Date().toISOString().slice(0,10),
    days: SETTINGS.DAYS,
    step: SETTINGS.STEP,
    lat,
    lon,
  }
  const api = buildApi_(params)

  const response = UrlFetchApp.fetch(api)
  const data = JSON.parse(response.getContentText())
  tides = data.extremes
  cacheTides_(tides)
  saveTidesToSheet_(tides)
  return tides
}

function createTideEvent_({date, type, height}){
  const startTime = new Date(date)
  const endTime = new Date(startTime.getTime() + SETTINGS.EVENT_TIME * 60 * 1000)
  const title = `${type} Tide [${height}]`
  const events = CalendarApp.getEvents(startTime, endTime)
  const findEvent = events.find(e => e.getTitle() === title)
  if (findEvent) return
  CalendarApp.createEvent(title, startTime, endTime).setColor(type === "High" ? SETTINGS.HIGH_COLOR : SETTINGS.LOW_COLOR )
}

function createTideEvents(){
  const tides = getTides_()
  tides.forEach(tide => createTideEvent_(tide))
}


function deleteTideEvents(){
  const startTime = new Date("2022-02-23")
  const endTime = new Date("2022-03-10")
  const events = CalendarApp.getEvents(startTime, endTime)
  events.forEach(event => {
    const title = event.getTitle()
    if (title.startsWith("High Tide") || title.startsWith("Low Tide")) event.deleteEvent()
  })
}







