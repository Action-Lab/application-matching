# application-matching
Display Google Forms data on web page and vote for preferences, used by Liberal Arts Action Lab to display community partner applications

## Live example
https://action-lab.org/apply/partners-and-proposals/

## Requirements
- Google Form responses must appear in Google Sheets, which must be published. Insert URLs in main.js
- manually insert "Display" column in "Partners" Google Sheet, and manually insert "y" to approve display
- manually insert "Title" column in "Partners" Google Sheet, and manually insert short text to display title
- paste iframes for Google Form and also for this application-matching repo in the public web pages
- NOTE: do NOT use this for high-security data, since the Google Sheet ID is visible in the code

## Credits
Created by Ilya Ilyankou (@ilyankou) for Liberal Arts Action Lab, Hartford CT

## Dependencies
- Tabletop v1.5.2, https://github.com/jsoma/tabletop
- jQuery v3.2.1, https://jquery.com/
