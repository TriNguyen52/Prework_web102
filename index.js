/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// Import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// Create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// Remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// Grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// Create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // Loop over each item in the data
    for (const game of games) {
        // Create a new div element, which will become the game card
        const gameCard = document.createElement("div");

        // Add the class game-card to the list
        gameCard.classList.add("game-card");

        // Set the inner HTML using a template literal to display some info about each game
        // TIP: if your images are not displaying, make sure there is space between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <img src="${game.img}" alt="${game.name}" class="game-image">
            <h3 class="game-name">${game.name}</h3>
            <p class="game-description">${game.description}</p>
            <p class="goal">Goal: $${game.goal.toLocaleString()}</p>
        `;

        // Append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// Call the function we just defined using the correct variable
// Later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/**************************************************************************************
 * Search bar function
 */

// Function to filter games based on search query
function searchGames(query) {
    const filteredGames = GAMES_JSON.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase())
    );
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
}

// Add event listener to the search button
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    const query = document.getElementById('search-bar').value;
    searchGames(query);
});

// Add event listener to the search bar for Enter key
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchGames(searchBar.value);
    }
});

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// Grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// Use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => total + game.backers, 0);

// Set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = totalContributions.toLocaleString();

// Grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// Set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// Grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = GAMES_JSON.length.toLocaleString();

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * Skills used: functions, filter
 */

// Show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // Use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // Use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    return unfundedGames;
}

// Show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // Use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // Use the function we previously created to add funded games to the DOM
    addGamesToPage(fundedGames);    
    return fundedGames;
}

// Show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // Add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// Select each button in the "Our Games" section
const unfundedGamesBtn = document.getElementById("unfunded-btn");
const fundedGamesBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// Add event listeners with the correct functions to each button
unfundedGamesBtn.addEventListener("click", filterUnfundedOnly);
fundedGamesBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
 */

// Grab the description container
const descriptionContainer = document.getElementById("description-container");

// Use filter or reduce to count the number of unfunded games
const unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;

// Create a string that explains the number of unfunded games using the ternary operator
const unfundedGamesString = unfundedGamesCount === 1 ? 
    `There is 1 unfunded game currently.` : 
    `There are ${unfundedGamesCount} unfunded games currently.`;

// Create a new DOM element containing the template string and append it to the description container
const unfundedGamesElement = document.createElement("p");
unfundedGamesElement.innerHTML = unfundedGamesString;
descriptionContainer.appendChild(unfundedGamesElement);

/*************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// Use destructuring and the spread operator to grab the first and second games
const [topGame, runnerUp] = sortedGames;

// Create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameElement = document.createElement("h2");
topGameElement.innerHTML = topGame.name;
firstGameContainer.appendChild(topGameElement);

// Do the same for the runner-up item
const runnerUpElement = document.createElement("h2");
runnerUpElement.innerHTML = runnerUp.name;
secondGameContainer.appendChild(runnerUpElement);