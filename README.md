# YNAB Assistant  <!-- omit in toc -->

An assistant for YNAB:
- Scrape Chase Bank real-time notification emails to create YNAB transactions in real-time.
- Scrape Amazon Order emails to add memos about what was purchased on unapproved YNAB transactions.
- Use hard-coded categorization rules to update categories for unapproved YNAB transactions.

**Table of Contents**
- [How It Works](#how-it-works)
- [To-do List](#to-do-list)
  - [High Priority](#high-priority)
  - [Low Priority](#low-priority)
- [File Guide](#file-guide)
- [Useful Knowledge](#useful-knowledge)
  - [Reading Emails with IMAP](#reading-emails-with-imap)
  - [Using Puppeteer to Scrape Websites](#using-puppeteer-to-scrape-websites)
  - [How to Organize the Project](#how-to-organize-the-project)
  - [Data Layer](#data-layer)
- [License](#license)

# How It Works

Flag color usage:  
- blue = we created the amazon transaction, but we don't have order details in the memo yet  
- yellow = we didn't create the transaction, but we added order details to the memo  
- green = we created the transaction, and if its an amazon transaction we added order details to the memo  

# To-do List

## High Priority
- reconnect imap if needed?
- add try/catch logic so the app keeps running
- check processed bit on amazonOrders and avoid processing them more than once
- do auto-categorization task (copy from vue app)
- improve comparison logic for matching amazon orders with unapproved transactions

## Low Priority
- Build a README.md generator that can create the ascii art for the file tree and fill in a description of each file using a special comment block at the top (or something a little more adaptable/portable/configureable/etc).
- Add one of these badges in here in an appropriate way: https://www.npmjs.com/package/eslint-config-standard (and maybe do the same for other things I've used)
- git pre-commit hook for standard js: https://standardjs.com/#is-there-a-git-pre-commit-hook
- pretty output for standard js: https://standardjs.com/#how-do-i-make-the-output-all-colorful-and-pretty
- add params so we can do stuff like compact db with an argument to the command to run the app
- should probably ignore the data folder in .gitignore but i want to be sure i dont need that data preserved
- turn on more strict type-checking in tsconfig.json

# File Guide

| File/Folder&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|-------------|-------------|
| .vscode/                              | Contains workspace settings for VSCode. <br /> [User and Workspace Settings](https://code.visualstudio.com/docs/getstarted/settings)  |
| ├─ extensions.json                    | Specifies recommended VSCode extensions to use when working with this project. <br /> [Workspace recommended extensions](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) |
| ├─ launch.json                        | Specifies configurations for running the application. |
| └─ settings.json                      | Specifies VSCode workspace settings specific to this project. <br /> [Settings file locations](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations) |
| data/                                 | Local "database" to store info scraped from emails so we never scrape the same data twice. |
| ├─ amazon-orders-data                 | nedb database for Amazon orders data obtained from scraping emails. |
| └─ chase-transactions-data            | nedb database for transactions data obtained from scraping emails. |
| dist/                                 | output from building typescript files as defined by tsconfig.json |
| node_modules/                         | *"npm install" will install the "dependencies" from package.json in this folder.* <br /> [npm-install](https://docs.npmjs.com/cli/install)  |
| src/                                  | |
| ├─ data/                              | |
| ├─ tests/                             | |
| ├─ lib/                               | |
| │  ├─ amazon-email-scraper.js         | |
| │  ├─ amazon-order-details-scraper.js | |
| │  ├─ amazon-orders-processor.js      | |
| │  ├─ chase-email-scraper.js          | |
| │  ├─ chase-transactions-processor.js | |
| │  ├─ db.js                           | |
| │  ├─ email.js                        | |
| │  └─ ynab.js                         | |
| └─ app.ts                             | |
| .editorconfig                         | |
| .gitignore                            | Specifies intentionally untracked files to ignore for version control. <br />[.gitignore](https://git-scm.com/docs/gitignore) |
| app.js                                | The main part of the app. |
| package-lock.json                     | Ignored via .gitignore. It is automatically generated for any operations where npm modifies either the node_modules tree or package.json. <br /> *Documentation seems to indicate that it is supposed to be committed to source repositories.* <br />[npm-package-lock.json](https://docs.npmjs.com/configuring-npm/package-lock-json.html) |
| package.json                          | Provides information to npm to identify the project as well as handle the project's dependencies. <br /> [npm-package.json](https://docs.npmjs.com/configuring-npm/package-json.html) |
| README.md                             | This documentation serves as the starting point for anyone wishing to familiarize themselves with the project. It uses Markdown syntax for formatting. |
| tsconfig.json                         | TypeScript configuration file. |

# Useful Knowledge

## Reading Emails with IMAP 

Decided to use IMAP to deal with reading gmail messages.  

[IMAP Spec](https://tools.ietf.org/html/rfc3501)  

There are several libraries to use for dealing with IMAP in node.js:  
[imap-simple](https://github.com/chadxz/imap-simple)  
[node-imap](https://github.com/mscdex/node-imap)  
[imap-flow](https://github.com/andris9/imapflow)  

I went with the imap-simple. It's built on top of node-imap but looks much easier to use.  

## Using Puppeteer to Scrape Websites

This was pretty helpful, and it includes links that cover things like how to avoid getting shut down by Amazon:  
https://zenscrape.com/how-to-scrape-amazon-product-information-with-nodejs-and-puppeteer/

## How to Organize the Project

https://labs.mlssoccer.com/a-javascript-project-structure-i-can-finally-live-with-52b778041b72

## Data Layer

From comments (clean up):  

    The sole purpose of this module is to provide dead-simple persistence of data that has been processed / needs to be processed.

    It should:
    - make interacting with the data as simple as possible

    It shouldn't:
    - leak abstractions or otherwise require consumers to work with the data store's syntax for querying / retrieving data

# License

Copyright (c) 2020 Nathan Fast