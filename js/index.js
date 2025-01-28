// Classe représentant un Pokémon
class Pokemon {
  constructor(name, image, stats) {
      this.name = name;
      this.image = image;
      this.stats = stats;
  }

  // Méthode statique pour récupérer un Pokémon depuis l'API
  static async fetchPokemon(number) {
      try {
          const response = await fetch(`${basic_url}pokemon/${number}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          return new Pokemon(
              data.forms[0].name,
              data.sprites.front_default,
              {
                  hp: getBaseStat(data, "hp"),
                  attack: getBaseStat(data, "attack"),
                  defense: getBaseStat(data, "defense"),
                  specialAttack: getBaseStat(data, "special-attack"),
                  specialDefense: getBaseStat(data, "special-defense"),
                  speed: getBaseStat(data, "speed"),
              }
          );
      } catch (error) {
          console.error('Error fetching Pokémon:', error);
          throw error; // Propager l'erreur pour gestion ultérieure
      }
  }
}

// const basic_url = 'https://tyradex.vercel.app/api/v1/';
const basic_url = 'https://pokeapi.co/api/v2/';
let radarChart; // Variable pour stocker l'instance du graphique
let pokemonRed = null;
let pokemonBlue = null;

// Fonction pour mettre à jour le radar chart
function updateRadarChart(pokemon1, pokemon2) {
  const ctx = document.getElementById('comparison-chart').getContext('2d');

  // Données du graphique
  const data = {
      labels: ['PV', 'Attaque', 'Défense', 'Attaque Spéciale', 'Défense Spéciale', 'Vitesse'],
      datasets: [
          {
              label: pokemon1.name,
              data: [
                  pokemon1.stats.hp,
                  pokemon1.stats.attack,
                  pokemon1.stats.defense,
                  pokemon1.stats.specialAttack,
                  pokemon1.stats.specialDefense,
                  pokemon1.stats.speed,
              ],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
          },
          {
              label: pokemon2.name,
              data: [
                  pokemon2.stats.hp,
                  pokemon2.stats.attack,
                  pokemon2.stats.defense,
                  pokemon2.stats.specialAttack,
                  pokemon2.stats.specialDefense,
                  pokemon2.stats.speed,
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
          },
      ],
  };

  // Options du graphique
  const options = {
      responsive: true,
      plugins: {
          legend: {
              position: 'top',
          },
      },
      scales: {
          r: {
              angleLines: {
                  display: true,
              },
              suggestedMin: 0,
              suggestedMax: 150,
          },
      },
  };

  // Détruire l'ancien graphique s'il existe
  if (radarChart) radarChart.destroy();

  // Créer un nouveau graphique
  radarChart = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: options,
  });
}

// Create a new XMLHttpRequest object
var xhr = new XMLHttpRequest();

document.querySelector("#red-select")
.addEventListener('change', () => setPokemon('red'));

document.querySelector("#blue-select")
.addEventListener('change', () => setPokemon('blue'));

var sel = document.getElementById('red-select');
sel[0] = new Option( 'select pokemon', 4);
for(var i = 1;i<1026;i++){
    sel[i] = new Option( i,i);	
}

var sel = document.getElementById('blue-select');
sel[0] = new Option( 'select pokemon', 7);
for(var i = 1;i<1026;i++){
    sel[i] = new Option( i,i);	
}

setPokemon('red');
setPokemon('blue');

// Fonction utilitaire pour récupérer une statistique de base
function getBaseStat(data, name) {
  const stat = data.stats.find(s => s.stat.name === name);
  return stat ? stat.base_stat : null;
}

// Fonction principale pour définir un Pokémon
async function setPokemon(side) {
  // const pokemonNumber = document.getElementById(`${side}-pokemon-number`).value;
  const pokemonNumber = document.getElementById(`${side}-select`).value;
  try {
      const pokemon = await Pokemon.fetchPokemon(pokemonNumber);
      displayPokemon(side, pokemon);

      // Mettre à jour les variables globales
      if (side === 'red') {
          pokemonRed = pokemon;
      } else if (side === 'blue') {
          pokemonBlue = pokemon;
      }

      // Mettre à jour le radar chart si les deux Pokémon sont définis
      if (pokemonRed && pokemonBlue) {
          updateRadarChart(pokemonRed, pokemonBlue);
      }
  } catch (error) {
      console.error('Failed to set Pokémon:', error);
      alert('Impossible de récupérer les données du Pokémon. Veuillez vérifier le numéro.');
  }
}

// Fonction pour afficher les données d'un Pokémon
function displayPokemon(side, pokemon) {
  document.getElementById(`${side}-name`).innerText = pokemon.name;
  document.getElementById(`${side}-image`).src = pokemon.image;
  document.getElementById(`${side}-base-hp`).innerText = pokemon.stats.hp;
  document.getElementById(`${side}-base-attack`).innerText = pokemon.stats.attack;
  document.getElementById(`${side}-base-defense`).innerText = pokemon.stats.defense;
  document.getElementById(`${side}-base-special-attack`).innerText = pokemon.stats.specialAttack;
  document.getElementById(`${side}-base-special-defense`).innerText = pokemon.stats.specialDefense;
  document.getElementById(`${side}-base-speed`).innerText = pokemon.stats.speed;
}