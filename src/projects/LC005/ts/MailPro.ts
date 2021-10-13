namespace MailPro {
	export interface EmailData {
		subject: string;
		recipient: string;
		body: string;
		options?: GoogleAppsScript.Gmail.GmailAdvancedOptions;
	}

	export function createHtmlBodyFromFile(
		filename: string,
		data: object = {}
	): string {
		const template: GoogleAppsScript.HTML.HtmlTemplate =
			HtmlService.createTemplateFromFile(filename);
		Object.entries(data).forEach(([key, value]) => (template[key] = value));
		return template.evaluate().getContent();
	}
	export function getSentEmailBySubject(
		subject: string
	): GoogleAppsScript.Gmail.GmailThread {
		const query = `in:sent subject:${subject}`;
		return GmailApp.search(query, 0, 1)[0];
	}

	export function sendEmail(
		emailData: EmailData
	): GoogleAppsScript.Gmail.GmailThread {
		GmailApp.sendEmail(
			emailData.recipient,
			emailData.subject,
			emailData.body,
			emailData.options
		);
		return getSentEmailBySubject(emailData.subject);
	}
}
