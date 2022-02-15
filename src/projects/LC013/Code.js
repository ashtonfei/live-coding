const DOC_TEMPLATE_ID = "12DWJ3F5PSzlPI2H2E80DfKm9F8o1lyy0ab1tBgJR4-g"
const PDF_FOLDER_NAME = "PDFs"
const FILE_NAME_PREFIX = "LC013 Document Signing with Google Form"
const SUBJECT_PREFIX = "LC013"
const IMAGE_WIDTH = 400

// GmailApp
/**
 * @param {Object} e
 * @param {FormApp.FormResponse} e.response
 */
function _onFormSubmit(e) {
  e.response.getResponseForItem
  const values = getResponses_(e.response)
  const docCopy = createDocCopy_(values)
  updateDocCopy_(docCopy, values)
  sendDocument_(docCopy, values)
}


/**
 * @param {FormApp.FormResponse} response
 */
function getResponses_(response){
  const items = response.getItemResponses()
  const values = {}
  items.forEach(item => {
    const title = item.getItem().getTitle()
    let value = item.getResponse()
    let type = "Text"
    if (item.getItem().getType() === FormApp.ItemType.FILE_UPLOAD) {
      type = "Image"
      value = value[0]
    }
    values[title] = {type, value}
  })

  const email = response.getRespondentEmail()
  values["_email"] = email
  return values
}

/**
 * @param {DriveApp.Folder} parentFolder
 * @param {string} name
 * @returns {DriveApp.Folder}
 */
function getFolderByName_(parentFolder, name){
  const folders = parentFolder.getFoldersByName(name)
  if (folders.hasNext()) return folders.next()
  return parentFolder.createFolder(name)
}

function getPDFFolder_(){
  const template = DriveApp.getFileById(DOC_TEMPLATE_ID)
  const currentFolder = template.getParents().next()
  const folder = getFolderByName_(currentFolder, PDF_FOLDER_NAME)
  return folder
}

function createFileName_(values){
  const name = values["Name"] ? values["Name"].value : ""
  const company = values["Company"] ?  values["Company"].value : ""
  return `${FILE_NAME_PREFIX} ${name} ${company} ${new Date().toLocaleString()}`
}

function createDocCopy_(values){
  const template = DriveApp.getFileById(DOC_TEMPLATE_ID)
  const folder = getPDFFolder_()
  const fileName = createFileName_(values)
  const docCopy = template.makeCopy(folder).setName(fileName)
  return docCopy
}

/**
 * @param {DocumentApp.Body} body
 */
function updateImage_(body, placeholder, imageId){
  const findOne = body.getParagraphs().find(p => p.findText(placeholder))
  if (!findOne) return 
  const imageBlob = DriveApp.getFileById(imageId).getBlob()
  const indexOfTheFindOne = body.getChildIndex(findOne)

  const image = body.insertImage(indexOfTheFindOne + 1, imageBlob)
  const width = image.getWidth()
  const height = image.getHeight()
  const ratio = IMAGE_WIDTH / width
  image.setWidth(IMAGE_WIDTH).setHeight(height * ratio)
  
  findOne.removeFromParent()
}

/**
 * @param {DriveApp.File} docCopy
 */
function updateDocCopy_(docCopy, values){
  const doc = DocumentApp.openById(docCopy.getId())
  const body = doc.getBody()

  // replace the placeholders
  Object.entries(values).forEach(([key, item]) => {
    const placeholder = `{{${key}}}`
    const {type, value} = item
    if (type === "Text") {
      body.replaceText(placeholder, value)
    }else if (type === "Image") {
      updateImage_(body, placeholder, value)
    }
  })
  doc.saveAndClose()
}

function createSubject_(values){
  const name = values["Name"] ? values["Name"].value : ""
  const company = values["Company"] ?  values["Company"].value : ""
  return `${SUBJECT_PREFIX} [${name}] [${company}] ${new Date().toLocaleString()}`
}

/**
 * @param {DriveApp.File} docCopy
 */
function sendDocument_(docCopy, values){
  const recipient = values["_email"]
  if (!recipient) return

  const folder = getPDFFolder_()
  const pdf = folder.createFile(docCopy.getAs("application/pdf"))
    .setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

  const subject = createSubject_(values)  
  const name = values["Name"] ? values["Name"].value : ""
  // const company = values["Company"] ?  values["Company"].value : ""

  const options = {
    bcc: "",
    cc: "",
    htmlBody: `
      <p>Hello ${name},</p>
      <p>Here is your signed document <a href="${pdf.getUrl()}">PDF</a>.</p>
      <p>Thanks,<br>Ashton Fei</p>
    `,
    attachments: [pdf.getBlob()]
  }
  GmailApp.sendEmail(recipient, subject, "", options)
}





























