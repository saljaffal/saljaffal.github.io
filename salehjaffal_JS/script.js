//create namespace object to hold app information
const pokemon = {};

//pokemon.starterPokemon = '';

//store API base urls within variables 
pokemon.dataUrl = `https://pokeapi.co/api/v2/pokemon?limit=151`;

//create a randomizer function
pokemon.randomizer = function(x) {
    
    let j = Math.floor(Math.random() * x.length);

    return j;
}
//set counter to check when the user attacks
pokemon.counter = 1;

//set select to check when the user picks a pokemon
pokemon.select = 0;

//
pokemon.opponentID = 0;

//create a function which sets pokemon
class Character {
    constructor(pokemonData) {
        this.name = pokemonData.name;
        this.front = pokemonData.sprites.front_default;
        this.back = pokemonData.sprites.back_default;
        this.hover = pokemonData.sprites.front_shiny;
        this.hp = 100;
        this.moves = [];
        for (let i=0;i<4;i++){
        this.moves.push(pokemonData.moves[i].move.name);
        }
    }
}


//make an ajax call to Pokemon API to get 151 pokemon names 
pokemon.fetchPokemon = function() {

    const pokemonResponse = $.ajax({
        url: `${pokemon.dataUrl}`,
        method: 'GET',
        dataType: 'json',
        async: 'false'
    });

    return pokemonResponse;
}

//function to fetch the pokemon data as per the selected name 
pokemon.fetchPokemonData = function(selectedPokemonUrl) {

    const selectedPokemonResponse = $.ajax({
        url: `${selectedPokemonUrl}`,
        method: 'GET',
        dataType: 'json',
        async: 'false'
    });

    return selectedPokemonResponse;
}

//function to display the starter pokemons for the user to select
pokemon.fetchStarterPokemon = function(pokemonData) {

    //fetch data of the starter pokemons
    let bulbaDetails = pokemon.fetchPokemonData(pokemonData.results[0].url);
    let charDetails = pokemon.fetchPokemonData(pokemonData.results[3].url);
    let squirDetails = pokemon.fetchPokemonData(pokemonData.results[6].url);
    
    //display Bulbasaur as an option
    bulbaDetails.done(function(bulbaData) {

        const bulba = new Character(bulbaData);

        $(`.user`).append(`
            <li class= '${bulba.name}'>
            <img src="${bulba.front}" alt="Picture of ${bulba.name}">
            <p>${bulba.name}</p>
            </li>
        `);

        $(`.${bulba.name} img`).hover(function() {
            $(this).attr('src', `${bulba.hover}`);}, function () {
            $(this).attr('src', `${bulba.front}`);                    
        });
    });

    //display Charmander as an option
    charDetails.done(function(charData) {

        const char = new Character(charData);
            
        $(`.user`).append(`
            <li class= '${char.name}'>
            <img src="${char.front}" alt="Picture of ${char.name}">
            <p>${char.name}</p>
            </li>
        `);

        $(`.${char.name} img`).hover(function() {
            
            $(this).attr('src', `${char.hover}`);}, function () {
            $(this).attr('src', `${char.front}`);
        });
    });

    //display Squirtle as an option
    squirDetails.done(function(squirData) {

        const squir = new Character(squirData);
            
        $(`.user`).append(`
            <li class= '${squir.name}'>
            <img src="${squir.front}" alt="Picture of ${squir.name}">
            <p>${squir.name}</p>
            </li>
        `);
        $(`.${squir.name} img`).hover(function() {

            $(this).attr('src', `${squir.hover}`);}, function () {
            $(this).attr('src', `${squir.front}`);
        });
    });
}

pokemon.fetchOpponentPokemon = function(pokemonData) {

    //if pokemone is selected then fetch a random pokemon
    if (pokemon.select === 0){
        pokemon.opponentID = pokemon.randomizer(pokemonData.results);
    }

    pokemon.select++;

    let oppoDetails = pokemon.fetchPokemonData(pokemonData.results[pokemon.opponentID].url);
    
    //set up opponent pokemons
    oppoDetails.done(function(oppoData) {

        const oppo = new Character(oppoData);
            
        if (pokemon.counter === 1) {
            $(`.opponent`).html(`
                <li class= '${oppo.name}'>
                <p>A wild ${oppo.name} appears!</p>
                <img src="${oppo.front}" alt="Picture of Opponent ${oppo.name}">
                </li>
            `); 
        }
        else {
            $(`.opponent`).html(`
                <li class= '${oppo.name}'>
                <p>${oppo.name}</p>
                <div class="health>
                    <label for="health">HP:</label>
                    <progress id="health" value="100" max="100"></progress>
                </div>
                <img src="${oppo.front}" alt="Picture of Opponent ${oppo.name}">
                </li>
            `);
        }

    //check if the user picked an attack
        if (pokemon.counter%2 === 0) {
            
            //raandomize the opponent attack
            let j = pokemon.randomizer(oppo.moves);
            
            setTimeout(function() {
                $(`.opponent p`).html(`${oppo.name} uses ${oppo.moves[j]}!`),
                $(`.opponent img`).addClass("attackOppo"),
                setTimeout(function () { 
                    $(`.opponent img`).removeClass("attackOppo");
                }, 500),
                setTimeout(function () { 
                    $(`.moves`).removeClass("hide");
                }, 500)
            }, 2000);

            pokemon.counter++;
        }
    }); 
}


//function to check which starter pokemon selected and set up the user side
pokemon.setupStarterPokemon = function(starterName, starterData) {

    //check which pokemon is selected and set up the user side to battle
    if (starterName === 'bulbasaur') {

        let bulbaDetails = pokemon.fetchPokemonData(starterData.results[0].url);

        bulbaDetails.done(function(bulbaData) {
    
            const bulba = new Character(bulbaData);
                
            $(`.user`).html(`
                <li class= '${bulba.name}'>
                <img src="${bulba.back}" alt="Picture of ${bulba.name}'s back">
                <p>Horrah! you selected ${bulba.name}!</p>
                </li>
            `);

            setTimeout( function() {
                $(`.${bulba.name}`).html(`
                    <img src="${bulba.back}" alt="Picture of ${bulba.name}'s back">
                    <div class="health>
                        <label for="health">HP:</label>
                        <progress id="health" value="100" max="100"></progress>
                    </div>
                    <p>${bulba.name}</p>
                    `), $(`.user`).append(`
                    <ul class= 'moves'>
                    Select an attack:
                        <li> ${bulba.moves[0]}</li>
                        <li> ${bulba.moves[1]}</li>
                        <li> ${bulba.moves[2]}</li>
                        <li> ${bulba.moves[3]}</li>
                    </ul>
                `);
            }, 3000);
        });
    }
    else if (starterName === 'charmander') {
        
        let charDetails = pokemon.fetchPokemonData(starterData.results[3].url);

        charDetails.done(function(charData) {
            
            const char = new Character(charData);
                
            $(`.user`).html(`
                <li class= '${char.name}'>
                <img src="${char.back}" alt="Picture of ${char.name}'s back">
                <p>Horrah! you selected ${char.name}!</p>
                </li>
            `);

            setTimeout( function() {
                $(`.${char.name}`).html(`
                    <img src="${char.back}" alt="Picture of ${char.name}'s back">
                    <div class="health>
                        <label for="health">HP:</label>
                        <progress id="health" value="100" max="100"></progress>
                    </div>
                    <p>${char.name}</p>
                `), 
                $(`.user`).append(`
                    <ul class= 'moves'>
                    Select an attack:
                        <li> ${char.moves[0]}</li>
                        <li> ${char.moves[1]}</li>
                        <li> ${char.moves[2]}</li>
                        <li> ${char.moves[3]}</li>
                    </ul>
                `);
            }, 3000);
        });
    }
    else {
        let squirDetails = pokemon.fetchPokemonData(starterData.results[6].url);

        squirDetails.done(function(squirData) {
    
            const squir = new Character(squirData);
                
            $(`.user`).html(`
                <li class= '${squir.name}'>
                <img src="${squir.back}" alt="Picture of ${squir.name}'s back">
                <p>Horrah! you selected ${squir.name}!</p>
                </li>
            `);

            setTimeout( function() {
                $(`.${squir.name}`).html(`
                    <img src="${squir.back}" alt="Picture of ${squir.name}'s back">
                    <div class="health>
                        <label for="health">HP:</label>
                        <progress id="health" value="100" max="100"></progress>
                    </div>
                    <p>${squir.name}</p>
                `), 
                $(`.user`).append(`
                    <ul class= 'moves'>
                    Select an attack:
                        <li> ${squir.moves[0]}</li>
                        <li> ${squir.moves[1]}</li>
                        <li> ${squir.moves[2]}</li>
                        <li> ${squir.moves[3]}</li>
                    </ul>
                `);
            }, 3000);
        });
    }

    //event listner if an attack is picked
    $('.user').on('click', '.moves li', function(e) {

        pokemon.counter++;
        console.log(pokemon.counter);
        let pokeName = this.parentElement.parentElement.childNodes[1].className;
        let attackName = this.innerText;

        $(`.user p`).html(`
            ${pokeName} uses ${attackName}!
        `);

        $(`.user img`).addClass("attackUser");
        $(`.moves`).addClass("hide");

        setTimeout(function () { 
            $(`.user img`).removeClass("attackUser");
        }, 500);

        pokemon.displayOpponentPokemon();

        setTimeout(function () { 
            $(`.user p`).html(`${pokeName}`);
        }, 2000);
    });

    setTimeout( function() {
        pokemon.displayOpponentPokemon();
    }, 2000);
    
}

//create a function to display the pokemons
pokemon.displayUserPokemon = function() {
    const pokemonName = pokemon.fetchPokemon();

    pokemonName.done(function(starterPokemonData) {
        console.log(starterPokemonData);
        
        pokemon.fetchStarterPokemon(starterPokemonData);

        $('.user').on('click', 'li', function(e) {
            if (pokemon.select === 0) {
            pokemon.starterPokemon =  `${e.currentTarget.className}`;
            pokemon.setupStarterPokemon(e.currentTarget.className, starterPokemonData);
            }
        });
    });
};

pokemon.displayOpponentPokemon = function() {

    const pokemonName = pokemon.fetchPokemon();

    pokemonName.done(function(opponentPokemonData) {
        //console.log(starterPokemonData);
        
        pokemon.fetchOpponentPokemon(opponentPokemonData);
    });

}


//create init function (we are trying ES6 style for this project)
pokemon.init = function()  {
    
    pokemon.displayUserPokemon();


};

//doc ready 
$(function() {
    pokemon.init();
});