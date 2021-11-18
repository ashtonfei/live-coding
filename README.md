# LIVE CODING

All my live coding projects published on YouTube channel can be found here in the projects folder.
[![Live Coding Projects](https://user-images.githubusercontent.com/16481229/136651006-e3f14efa-f68c-42fc-bf1b-e39556abfbf3.png)](https://www.youtube.com/watch?v=uwD91dKRw2w&list=PLQhwjnEjYj8ClqO6NG2fFka53xVOzIN_b)

## List of projects

| Index                                                                          | Project Folder                         | YouTube                               | Date released | Category      | About                                                                                         |
| ------------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------- | ------------- | ------------- | --------------------------------------------------------------------------------------------- |
| [LC001](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC001) | Google Doc Automation with DocPro      | [Watch](https://youtu.be/uwD91dKRw2w) | 4/Oct/2021    | `document`    | Create a doc with data from sheet automatically with `text`, `image`, and `table` replacement |
| [LC002](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC002) | Send & Track Gmail                     | [Watch](https://youtu.be/P8L3yRpSngI) | 9/Oct/2021    | `spreadsheet` | Send an email and track it with apps script                                                   |
| [LC003](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC003) | Google Doc to Web App                  | [Watch](https://youtu.be/rIZ7UC3kNWU) | 10/Oct/2021   | `doc`         | Turn a google doc into a web app                                                              |
| [LC004](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC004) | Form with Multiple Dependent Dropdowns | [Watch](https://youtu.be/J-YEwIDwl_8) | 11/Oct/2021   | `spreadsheet` | A form built with multiple dependent dropdowns                                                |
| [LC005](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC005) | Build a Project with TypeScript        | [Watch](https://youtu.be/CLGUsqHGqrw) | 13/Oct/2021   | `spreadsheet` | Build a Poroject with TypeScript and Clasp                                                    |
| [LC006](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC006) | Mail Merge with Draft as Template      | [Watch](https://youtu.be/LzaF8wIs4rw) | 22/Oct/2021   | `spreadsheet` | Mail merge with Gmail Draft as a template                                                     |
| [LC007](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC007) | Read Data from PDF to Sheet            | [Watch](https://youtu.be/RHniZAqBHzk) | 7/Nov/2021    | `spreadsheet` | Read text data from PDF with ORC provided by Google Drive API                                 |
| [LC008](https://github.com/ashtonfei/live-coding/tree/main/src/projects/LC008) | IMDb Web Crawler                       | [Watch](https://youtu.be/vjU8JUyUdwY) | 19/Nov/2021   | `spreadsheet` | A web scrapper built with apps script                                                         |

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
