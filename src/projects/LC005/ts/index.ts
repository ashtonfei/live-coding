const APP_NAME: string = "LC005";

function sendEmail(): void {
	// TBD
	// Collect email
	const ui = new UiPro.Ui(APP_NAME, SpreadsheetApp.getUi());

	const email: string = ui
		.input("Please enter the email address:")
		.getResponseText();
	// College subject
	const subject: string = ui
		.input("Please enter the email subject:")
		.getResponseText();
	// College name
	const name: string = ui
		.input("Please enter the recipent name:")
		.getResponseText();
	// College message
	const message: string = ui
		.input("Please enter the email message:")
		.getResponseText();
	const htmlBody: string = MailPro.createHtmlBodyFromFile("html/email.html", {
		name,
		message,
	});

	// Send Email
	const options: GoogleAppsScript.Gmail.GmailAdvancedOptions = {
		htmlBody: htmlBody,
	};

	const emailData: MailPro.EmailData = {
		subject: subject,
		recipient: email,
		body: message,
		options: options,
	};
	const sentEmail: GoogleAppsScript.Gmail.GmailThread =
		MailPro.sendEmail(emailData);
	const html: string = `
        <p>Your email has been sent successfully</p>
        <p>You can check it by click on this <a href="${sentEmail.getPermalink()}" target="_blank">link</a>.</p>
    `;
	ui.dialog(html);
}

function onOpen() {
	SpreadsheetApp.getUi()
		.createMenu(APP_NAME)
		.addItem("Sent email", "sendEmail")
		.addToUi();
}
