// program to pack suitcase - AD. 11 April 2025

var num_shirts = 5;
var num_trousers = 5;
var num_shorts = 5;
var actual_temperature = 15;
var temperature_check = 22;
var suitcase = 0;

function pack_suitcase(num_shirts, num_trousers, num_shorts) {
  var shirts_packed = 0;
  var trousers_packed = 0;
  var shorts_packed = 0;

  // Pack shirts
  while (num_shirts > 0) {
    shirts_packed++; // add 1 shirt
    num_shirts--; // reduce the number of shirts
  }
  console.log("Packed: " + num_shirts + " shirts\n")

  if (actual_temperature < temperature_check) {
      
      // pack trousers
    while (num_trousers > 0) {
      trousers_packed++; // add 1 trouser
      num_trousers--; // reduce trouser count
    }
    console.log('Packed pairs of trousers: ' + suitcase);
  } else {
    while (num_shorts > 0) {
      shorts_packed++; // add 1 short
      num_shorts--; // reduce shorts counter
    }
    console.log('Packed shorts: ' + shorts_packed);
  }
  
    console.log('Suitcase packed with: ' + (shirts_packed + trousers_packed + shorts_packed) + " items");
}

pack_suitcase(num_shirts, num_trousers, num_shorts);
