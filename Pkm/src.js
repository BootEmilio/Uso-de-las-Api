document.getElementById('fetchPokemon').addEventListener('click', function() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            return response.json();
        })
        .then(data => {
            displayPokemon([data]);
        })
        .catch(error => {
            document.getElementById('pokemonContainer').innerHTML = `<p>${error.message}</p>`;
        });
});

document.getElementById('fetchGeneration').addEventListener('click', function() {
    const generation = document.getElementById('generationSelect').value;
    if (generation) {
        fetch(`https://pokeapi.co/api/v2/generation/${generation}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Generation not found');
                }
                return response.json();
            })
            .then(data => {
                const pokemonPromises = data.pokemon_species.map(pokemon => {
                    return fetch(pokemon.url.replace('pokemon-species', 'pokemon'))
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Pokémon details not found');
                            }
                            return response.json();
                        });
                });
                return Promise.all(pokemonPromises);
            })
            .then(pokemonData => {
                displayPokemon(pokemonData);
            })
            .catch(error => {
                document.getElementById('pokemonContainer').innerHTML = `<p>${error.message}</p>`;
            });
    } else {
        document.getElementById('pokemonContainer').innerHTML = `<p>Please select a generation.</p>`;
    }
});

function displayPokemon(pokemonList) {
    const pokemonContainer = document.getElementById('pokemonContainer');
    pokemonContainer.innerHTML = '';
    pokemonList.forEach(data => {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');
        pokemonCard.innerHTML = `
            <h2>${data.name}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p><strong>Height:</strong> ${data.height}</p>
            <p><strong>Weight:</strong> ${data.weight}</p>
            <p><strong>Type:</strong> ${data.types.map(type => type.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong></p>
            <ul>
                ${data.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
            </ul>
        `;
        pokemonContainer.appendChild(pokemonCard);
    });
}
