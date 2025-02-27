const form = document.querySelector('.searchbar');
const input = form.querySelector('input[type="search"]');
const resultsContainer = document.querySelector('.results');
const resultsCounter = document.querySelector('header p');
const helperMessage = document.querySelector('.helper');

const randomButton = document.getElementById('btn2');
const infoButton = document.getElementById('btn3');

var numA = 0;
var numB = 1;

var searchTerm = "";
var randomFlag = false;

/* mouseOver messages */
randomButton.addEventListener('mouseover', () => {
    helperMessage.innerHTML = `

            Feeling lucky?
        /
(\\  /)
(  . .)
c('')('')`;
});

infoButton.addEventListener('mouseover', () => {
    helperMessage.innerHTML = `

            Need some help?
        /
(\\  /)
(  . .)
c('')('')`;
});

helperMessage.addEventListener('mouseover', () => {
    helperMessage.innerHTML = `

        Hover over icons for some information.
        /
(\\  /)
(  . .)
c('')('')`;
});



/* onClick */
helperMessage.addEventListener('click', function () {

    // randomly generate number 1 - 10
    randomNum = Math.floor(Math.random() * 50) + 1;

    // helper messages
    if (randomNum == 50) {
        helperMessage.innerHTML = `

            please stop clicking me
        /
(\\  /)
(  . .)
c('')('')`;
    }
    else if (randomNum > 5){
        helperMessage.innerHTML = `

            hi my name is mips
        /
(\\  /)
(  . .)
c('')('')`;
    }
    else {
        helperMessage.innerHTML = `

        mips is also a CPU architecture 
        /
(\\  /)
(  . .)
c('')('')`;
    }
});

randomButton.addEventListener('click', function () {
    randomFlag = true;
});


/* helpMenu popup */
function openInfoMenu() {
    document.querySelector(".infoMenu").style.display = "flex";
}

function closeInfoMenu() {
    document.querySelector(".infoMenu").style.display = "none";
}


/* onSubmit */
form.addEventListener('submit', function (event) {
    event.preventDefault();

    var searchTerm = input.value;

    // credits
    if (searchTerm == "whomadethis") {
        resultsCounter.textContent = '';
        helperMessage.innerHTML = `
ʕ •ᴥ• ʔ	
made by eric`
        return;
    }

    // check randomButton flag
    if (randomFlag) {
        randomFlag = false;

        // curated random
        numA = Math.floor(Math.random() * 100);
        numB = Math.floor(Math.random() * 100);

        if (numA == numB) {
            input.value = "Raspberry Hangover";
            searchTerm = input.value;
            searchWikipedia(searchTerm);
            return;
        }

        // promise pending
        let temp = randomSearch();
        // promise resolved
        temp.then(function (result) {
            input.value = result;
            searchTerm = input.value;
            searchWikipedia(searchTerm);
        })
        return;
    }

    // 'if' prevents search error
    if (searchTerm) {
        searchWikipedia(searchTerm);
    }
});


/* fetch randomSearch */
async function randomSearch() {

    var url = "https://en.wikipedia.org/w/api.php";

    var params = {
        action: "query",
        format: "json",
        list: "random",
        rnlimit: "100"
    };

    url = url + "?origin=*";
    Object.keys(params).forEach(function (key) { url += "&" + key + "=" + params[key]; });

    return fetch(url)
        .then(response => response.json())
        .then(function (response) {
            var randoms = response.query.random;

            // skip unsuable searches 
            for (var a in randoms) {
                // if usable search found, return
                if (!randoms[a].title.includes(":")) {
                    searchTerm = randoms[a].title;
                    break;
                }
                a++;
            }
            return searchTerm;
        })
        .catch(function (error) { console.log(error); });
}


/* fetch from Wikipedia */
function searchWikipedia(searchTerm) {
    var url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=500&srsearch=${encodeURIComponent(searchTerm)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.query.search)
        })
        .catch(error => alert('Error: ' + error))
}

/* list of results */
function displayResults(results) {
    resultsContainer.innerHTML = '';
    helperMessage.innerHTML = '';

    // # Results + ASCII
    if (results.length >= 500) {
        resultsCounter.textContent = "Results: 500+";
    }
    else {
        resultsCounter.textContent = `Results: ${results.length}`;

        // Special Message for no results
        if (results.length == 0) {
            helperMessage.innerHTML = `
            Oops. No results found.
            Try a different search.
        /
(\\  /)
(  . .)
c('')('')`;
        }

    }

    // Card for each Result
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result';
        resultElement.innerHTML = `
                <h2>${result.title}</h2>
                <p>${result.snippet}</p>
                <div> 
                    <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank"> Read More </a>
                </div>`;
        resultsContainer.appendChild(resultElement);
    });
};
