
# Web Scrapping with Cheerio and Axios 

This is a web crawler built on the top of Node.js for harvesting 
the unique question url, and their corresponding info like referenceCount(s),
upvote(s) and answer(s) from [stackoverflow](https://stackoverflow.com/questions).


## Installation & Use

First get the repo ready on your PC by cloning it from github
```
  git clone https://github.com/Bucephalus-lgtm/crawler.git
```

Then, install the required library 

```bash
  cd crawler
  npm install 
```

Then, simply run
```bash
npm start
```
    
## Features
#### What our crawler do?

- Find every unique question url from the site.
- Total reference counts for every URL.
- Total count of upvotes and answers for every question.
- Data saved in mongoDB after processed fully.
- Data saved as CSV file whenever it gets killed.


## Methodology

 - Whole script written in asynchronous mode.
 - Within a nameless async function(to run immediately), function ```fetchPage(url)``` is called with the [url](https://stackoverflow.com/questions) as input.
 - This function is responsible for parsing the HTML elements and thus
 - obtaining the required fields.
 - Within ```fetchPage(url)```
    - Axios make the HTTP request to the input url.
    - Cheerio then parses the html file.
    - Check if this is the index of the end page.
    - If end page return array with data harvested so far, *i.e.* **mergedArray**.
    - Else proceed forth.
    - Query written for extracting the required field.
    - Then we increment the current page by 1.
    - Thus **nextUrl** obtained.
    - Update the **mergedArray** with this current page's harvested datas.
    - Recursively call the function ```fetchPage(url)``` with the **nextUrl**.
- After the ```fetchPage(url)``` function gets called, saved the datas to mongodb database.
- Importantly, we keep checking for the node.js process killed.
- When the process is killed, the data harvested so far gets saved as **output.csv** in the root directory.


## Author

- [@Bhargab Nath](https://github.com/Bucephalus-lgtm)
