const form = document.querySelector('.search-bar');
const input = form.querySelector('input[type="search"]');
const resultsContainer = document.querySelector('.results');
const resultsCounter = document.querySelector('header p');
const helperMessage = document.querySelector('.helper');

const randomButton = document.getElementById('btn2');

var randomFlag = false;

/* Generate Random Search */
var randomOptions = ['dog', 'cat', 'sheep', 'orange', 'bandwidth',
    'chalk', 'tax', 'Clemson University', 'ribbon', 'pupil',
    'teacher', 'personality', 'recursion', 'tone', 'Upton Sinclair',
    'snail', 'sisyphus', 'Washington', 'Alan Turing', 'adobe',
    'L Hôpitals rule', 'taro', 'Oil tanker', 'Boston', 'Don Quixote',
    'Antarctica', 'Manila', 'Impressionism', 'Demi-Glace', 'Pyotr Ilyich Tchaikovsky'];


randomButton.addEventListener("click", function () {
    randomFlag = true;
});


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

    // check if Random button pressed
    if (randomFlag) {
        searchTerm = randomOptions[Math.floor(Math.random() * randomOptions.length)];
        input.value = searchTerm;
        randomFlag = false;
    }

    // 'if' prevents search error
    if (searchTerm) {
        searchWikipedia(searchTerm);
    }
});


/* fetch from Wikipedia */
function searchWikipedia(searchTerm) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=500&srsearch=${encodeURIComponent(searchTerm)}`;

    fetch(url).then
        (response => response.json()).then
        (data => {
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
                <a href="https://en.wikipedia.org/?curid=${result.pageid}" target="_blank"> Read More </a>`;
        resultsContainer.appendChild(resultElement);
    });
};
