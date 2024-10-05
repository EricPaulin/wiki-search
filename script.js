const form = document.querySelector('.search-bar');
const input = form.querySelector('input[type="search"]');
const resultsContainer = document.querySelector('.results');
const resultsCounter = document.querySelector('header p');
const helperMessage = document.querySelector('.helper');

const randomButton = document.getElementById('btn2');

var searchTerm = "";
var randomFlag = false;


randomButton.addEventListener("click", function () {
    randomFlag = true;
});


/* onSubmit */
form.addEventListener('submit', function (event) {
    event.preventDefault();

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
function randomSearch() {

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
                    searchTerm= randoms[a].title;
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
         _________________________
        /                                            \\
        |        No results found.      |
        |               Try again              |
         \\__________________________/
                |/
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
