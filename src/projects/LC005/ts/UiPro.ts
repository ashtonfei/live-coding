namespace UiPro {
	export enum ALERT_TYPE {
		SUCCESS = "SUCCESS",
		FAILED = "FAILED",
		WARNING = "WARNING",
		INFO = "INFO",
	}
	export class Ui {
		name: string;
		ui: GoogleAppsScript.Base.Ui;
		constructor(name: string, ui: GoogleAppsScript.Base.Ui) {
			this.name = name;
			this.ui = ui;
		}
		input(message: string): GoogleAppsScript.Base.PromptResponse {
			return this.ui.prompt(
				this.name,
				message,
				this.ui.ButtonSet.YES_NO_CANCEL
			);
		}
		alert(message: string, type: ALERT_TYPE = ALERT_TYPE.WARNING): void {
			this.ui.alert(`${this.name} [${type}]`, message, this.ui.ButtonSet.OK);
		}
		dialog(html: string) {
			const ui: GoogleAppsScript.HTML.HtmlOutput =
				HtmlService.createHtmlOutput(html);
			this.ui.showModalDialog(ui, this.name);
		}
	}
}
