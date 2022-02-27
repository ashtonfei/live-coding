# LIVE CODING

All my live coding projects published on YouTube channel can be found here in the projects folder.
[![Live Coding Projects](https://user-images.githubusercontent.com/16481229/136651006-e3f14efa-f68c-42fc-bf1b-e39556abfbf3.png)](https://www.youtube.com/watch?v=uwD91dKRw2w&list=PLQhwjnEjYj8ClqO6NG2fFka53xVOzIN_b)

## List of projects

| Index                                                                          | Project Folder                         | YouTube                               | Date released | Category                   | About                                                                                         |
| ------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------- | ------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| [LC001](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC001) | Google Doc Automation with DocPro      | [Watch](https://youtu.be/uwD91dKRw2w) | 4/Oct/2021    | `document`                 | Create a doc with data from sheet automatically with `text`, `image`, and `table` replacement |
| [LC002](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC002) | Send & Track Gmail                     | [Watch](https://youtu.be/P8L3yRpSngI) | 9/Oct/2021    | `spreadsheet`              | Send an email and track it with apps script                                                   |
| [LC003](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC003) | Google Doc to Web App                  | [Watch](https://youtu.be/rIZ7UC3kNWU) | 10/Oct/2021   | `doc`                      | Turn a google doc into a web app                                                              |
| [LC004](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC004) | Form with Multiple Dependent Dropdowns | [Watch](https://youtu.be/J-YEwIDwl_8) | 11/Oct/2021   | `spreadsheet`              | A form built with multiple dependent dropdowns                                                |
| [LC005](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC005) | Build a Project with TypeScript        | [Watch](https://youtu.be/CLGUsqHGqrw) | 13/Oct/2021   | `spreadsheet`              | Build a Poroject with TypeScript and Clasp                                                    |
| [LC006](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC006) | Mail Merge with Draft as Template      | [Watch](https://youtu.be/LzaF8wIs4rw) | 22/Oct/2021   | `spreadsheet`              | Mail merge with Gmail Draft as a template                                                     |
| [LC007](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC007) | Read Data from PDF to Sheet            | [Watch](https://youtu.be/RHniZAqBHzk) | 7/Nov/2021    | `spreadsheet`              | Read text data from PDF with ORC provided by Google Drive API                                 |
| [LC008](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC008) | IMDb Web Crawler                       | [Watch](https://youtu.be/vjU8JUyUdwY) | 19/Nov/2021   | `spreadsheet`              | A web scrapper built with apps script                                                         |
| [LC009](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC009) | Dependent Dropdowns in Google Sheet    | [Watch](https://youtu.be/1H21-aF4A2o) | 19/Nov/2021   | `spreadsheet`              | Create dependent dropdowns in Google Sheet                                                    |
| [LC010](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC010) | CRUD App with Vue/Bootstrap/GAS        | [Watch](https://youtu.be/X9XaSLdqP20) | 11/Dec/2021   | `spreadsheet`              | A CRUD Web App with Vue/Bootstrap/GAS                                                         |
| [LC011](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC011) | Web App with Router & State Mgmt       | [Watch](https://youtu.be/PSlsVAZSt_U) | 1/Jan/2022    | `spreadsheet`              | A Web App with Vue/Vuex/VueRouter/Vuetify/GAS                                                 |
| [LC012](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC012) | Clock In/Out with Google Forms         | [Watch](https://youtu.be/4r0bR61XP38) | 5/Feb/2022    | `spreadsheet` `googleform` | Clock In/Out with Google Forms and Apps Script                                                |
| [LC013](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC013) | Document Signing with Google Form      | [Watch](https://youtu.be/oAgUVpRhLRg) | 16/Feb/2022   | `googledoc` `googleform`   | Add Signature with Google Form and Google Doc                                                 |
| [LC014](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC014) | World Tides Notification               | [Watch](https://youtu.be/Q3bMQMVasRQ) | 24/Feb/2022   | `googlesheet`              | Create Tide Events in Google Calendar                                                         |
| [LC015](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC015) | Rich Text Formatter                    | [Watch](https://youtu.be/EsBhbjdrI-k) | 27/Feb/2022   | `googlesheet`              | A rich text formatter for Google Sheet                                                        |

## Build commands

Install node packages

```bash
npm install
```

Push the local project to the remote Google Apps Script project

```bash
npm run push --i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; clasp push
```

Pull the remote Google Apps Script project to local

```bash
npm run pull --i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; clasp pull
```

Open the remote Google Apps Script project

```bash
npm run open --i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; clasp open
```

Build a document.md from JSDOC

```bash
npm run doc --i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; jsdoc2md *.js > DOCUMENT.md
```
