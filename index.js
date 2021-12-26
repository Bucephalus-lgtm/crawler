const cheerio = require("cheerio");
const axios = require("axios");
const { saveToDatabase } = require("./db");
const { saveCSVFile } = require("./csv");
const BASE_URL = 'https://stackoverflow.com';

let mergedArray = [];
(async () => {
    const fetchPage = async (url) => {
        try {
            // axios will give us the raw html file from the input url
            const result = await axios.get(url);
            // cheerio for parsing the html file
            const $ = cheerio.load(result.data);

            // Condition to check if the page exists or not?!
            const notFound = $('#questions > .ta-center > h2').text();
            const errorMessage = "No questions found. Perhaps you'd like to select a different tab?";
            // If found that errorMessage is found in the html
            // terminate 
            if (notFound === errorMessage) return mergedArray;

            // else proceed forth with parsing html elements
            const questionsSummary = $('.question-summary').map(async (index, element) => {
                // URL
                const linkDOM = $(element).children().last().find('a').attr('href');
                let link = `${BASE_URL}/${linkDOM}`;

                // Vote
                const vote = $(element).children().first().children().first().children().children().find('span').text();

                // Answer
                const answer = $(element).children().first().children().first().children().last().find('strong').text().replace(/\s\s+/g, ' ');

                // Views
                const view = $(element).children().first().children().last().text().trim().replace(/[^\d.-]/g, '');

                return {
                    uniqueURL: link,
                    upvote: vote,
                    answer,
                    referenceCount: view
                }
            }).get();

            // Get new page number
            const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
            // Next url found putting next number in the url
            const nextUrl = `${BASE_URL}/questions?tab=newest&page=${nextPageNumber}`;
            // mergedArray keeping update of total collected data so far
            mergedArray = mergedArray.concat.apply(mergedArray, await Promise.all(questionsSummary));
            // recur the function with nextUrl as the input
            return mergedArray.concat(await fetchPage(nextUrl));
        } catch (err) {
            console.log("Please try again!!!");
            console.error(err);
            throw err;
        }
    };

    console.log('Crawler started running...');
    const firstUrl = 'https://stackoverflow.com/questions?tab=newest&page=441057';
    const data = await fetchPage(firstUrl);

    console.log({ lengthOfTotalData: mergedArray.length });

    // Update database with the output obtained from the fetchPage function
    saveToDatabase(data);
})();


// 'SIGINT' from the terminal is supported on all platforms
// Can usually be generated with Ctrl+C 
process.on("SIGINT", function () {
    console.log("\nGracefully shutting down from SIGINT (Crtl-C)");
    // Dump json to csv
    saveCSVFile(mergedArray);
    process.exit();
});