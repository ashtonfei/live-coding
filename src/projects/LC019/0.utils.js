function createQueryString(params) {
  if (!params) return "";
  const queryString = Object.entries(params)
    .map(([paramKey, paramValue]) => {
      if (Array.isArray(paramValue)) {
        return paramValue.map((value) => `${paramKey}=${value}`).join("&");
      } else {
        return `${paramKey}=${paramValue}`;
      }
    })
    .join("&");
  return encodeURI(queryString);
}

function createPdfExportRequest(spreadsheetId, token, options = {}) {
  // SpreadsheetApp.getActive()
  const queryParams = {
    size: "A4",
    fitw: true,
    gridlines: false,
    top_margin: 0.25,
    right_margin: 0.25,
    left_margin: 0.25,
    bottom_margin: 0.25,
    ...options,
    format: "pdf",
  };

  const queryString = createQueryString(queryParams);
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?${queryString}`;
  return {
    url,
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    muteHttpExceptions: true,
  };
}
