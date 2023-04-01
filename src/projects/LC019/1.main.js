function exportAsPdfAndSendWithEmail() {
  const params = {
    fomrat: "Letter",
    gid: "2084945952",
  };
  const spreadsheetId = "17x-QlsExfM4JdYomBw3BIpMXOYnqmGpEnToOkDKggg4";
  const token = ScriptApp.getOAuthToken();
  const requestA = createPdfExportRequest(spreadsheetId, token, params);
  const requestB = createPdfExportRequest(spreadsheetId, token, params);
  const [responseA, responseB] = UrlFetchApp.fetchAll([requestA, requestB]);

  const blobs = [];
  if (responseA.getResponseCode() == 200) {
    const blob = responseA.getBlob().setName("request a.pdf");
    blobs.push(blob);
  }
  if (responseB.getResponseCode() == 200) {
    const blob = responseB.getBlob().setName("request b.pdf");
    blobs.push(blob);
  }

  if (blobs.length === 0) {
    throw new Error("There is PDF exported.");
  }

  const email = Session.getActiveUser().getEmail();
  const subject = "This is a test for LC019";
  const body = "This is a test message";
  const options = {
    attachments: blobs,
  };
  GmailApp.sendEmail(email, subject, body, options);
}

function getSpreadsheetsInCurrentFolder() {
  const ss = SpreadsheetApp.getActive();
  const parents = DriveApp.getFileById(ss.getId()).getParents();
  const folder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const spreadsheets = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  const data = [];
  while (spreadsheets.hasNext()) {
    const spreadsheet = spreadsheets.next();
    data.push({
      id: spreadsheet.getId(),
      name: spreadsheet.getName(),
    });
  }
  return data.filter((v) => v.id != ss.getId());
}

function sendMutipleSpreadsheetsAsPdfs() {
  const spreadsheets = getSpreadsheetsInCurrentFolder();
  const options = {
    size: "A4",
    top_margin: 0,
    right_margin: 0,
    bottom_margin: 0,
    left_margin: 0,
  };
  const token = ScriptApp.getOAuthToken();
  const requests = spreadsheets.map(({ id }) => {
    return createPdfExportRequest(id, token, options);
  });

  const responses = UrlFetchApp.fetchAll(requests);

  const attachments = [];
  responses.forEach((response, index) => {
    const name = spreadsheets[index].name;
    if (response.getResponseCode() != 200) return;
    attachments.push(response.getBlob().setName(`${name}.pdf`));
  });

  if (attachments.length === 0) {
    throw new Error("There is PDF exported.");
  }

  const email = Session.getActiveUser().getEmail();
  const subject = "Multiple Spreadsheets to PDFs";
  const body = "This is a test message";
  GmailApp.sendEmail(email, subject, body, { attachments });
}

function mergeSpreadsheetsAsPdf() {
  // spreadsheets
  // merge into one spreadsheet
  // export the merged spreadsheets as pdf
  // you do the rest
}
