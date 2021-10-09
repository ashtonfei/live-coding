# live-coding

All my live coding projects published on YouTube channel can be found here in the projects folder.

## List of projects

| Index | Project Folder                        | YouTube                              | Date released | Category   | About                                                                                         |
| ----- | ------------------------------------- | ------------------------------------ | ------------- | ---------- | --------------------------------------------------------------------------------------------- |
| LC001 | [Google Doc Automation with DocPro]() | [Link](https://youtu.be/uwD91dKRw2w) | 4/Oct/2021    | `document` | Create a doc with data from sheet automatically with `text`, `image`, and 'table' replacement |

## Build commands

Install node packages

```bash
npm install
```

Push the local project to the remote Google Apps Script project

```bash
npm run push -i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; clasp push
```

Pull the remote Google Apps Script project to local

```bash
npm run pull -i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; clasp pull
```

Open the remote Google Apps Script project

```bash
npm run open -i=[project_index=LC001]
```

or

```bash
cd ./src/projects/[project folder]; clasp open
```
