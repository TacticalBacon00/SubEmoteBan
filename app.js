//**Importing shit**
var fs = require('fs');
var request = require('request');
var dictionaryJSON, subData;

//**Storing variables**
//Dictionary variables
var dictionaryArray = [];
var wordsArray = [];
var definitionsArray = [];
var definitionsCleaned = [];
var allWords = [];
//Twitch variables
var emoteArray = [];
var partneredChannelsArray = [];
var currentChannel;
//Filter variables
var finalList = [];
var currentEmote;
//Misc. variables
var workingString;
var safeWords = [];

//**Main Functions**
//Download the files
function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
//Assigns words and definitions separate arrays
var importDictionary = function(){
  //console.log(dictionaryJSON);
  for(var i in dictionaryJSON){
    wordsArray.push([i][0].toLowerCase());
    definitionsArray.push(dictionaryJSON[i].toLowerCase());
  }
};
//Removes symbols from the definition array
var sanitizer = function(){
  for(x=0; x<wordsArray.length; x++){
    definitionsArray[x] = definitionsArray[x].replace(/[^\w\s]/gi, '');
    //console.log("Running sanitizer");
  }
}
//Separates out words in the definitions
function definitionSeparator(){
  //console.log(wordsArray.length);
  for(i=0; i<wordsArray.length; i++){
    workingString += definitionsArray[i].split(" ");
    //console.log(definitionsArray);
  }
  definitionsCleaned = workingString.split(",");
}
//Puts all words in the dictionary into one array
var dictionaryCombiner = function(){
  allWords = allWords.concat(wordsArray);
  allWords = allWords.concat(definitionsCleaned);
  //console.log(wordsArray.length + " " + definitionsCleaned.length);
}
//Saves a list of all partnered channels into an array
var partnerListGenerator = function(){
  for(var i in subData.channels)
  partneredChannelsArray.push([i][0]);
}
//Saves emotes into an array
var emoteListGenerator = function(){
  for ( i=0; i<partneredChannelsArray.length; i++){
    currentChannel = partneredChannelsArray[i].toString(); //Storing the current channel for reference.
    //Cycles through each emote on the current channel.
    for (x = 0; x<subData.channels[currentChannel].emotes.length ; x++){
      emoteArray.push(subData.channels[currentChannel].emotes[x].code.toLowerCase());//Saves each emote into one array.
    }
    //Showing progress percentage every 1500 cycles through the channel counting/analyzing loop.
    if ((i%1500) == 0){console.log("Importing sub emote list: " + Math.ceil(((i/partneredChannelsArray.length)*100)) + "%");}
  }
};
//DOES THE SHIT
var filterRun = function(){
  for(i=0; i < emoteArray.length; i++){
    currentEmote = emoteArray[i].toString();
    if(allWords.indexOf(currentEmote) != -1){
      console.log("Added to the list of safe words ------------------------> " + currentEmote);
      //safeWords.push(currentEmote);
      continue;
    }
    finalList.push(currentEmote);
    //console.log(currentEmote);
    if ((i%1000) == 0){console.log("Completed: " + (i * allWords.length) + "/" + (allWords.length * emoteArray.length) + ". " + "Comparison at: " + Math.ceil(((i/emoteArray.length)*100)) + "%");}
  }
}
//Removes safe words from the emote array
var saveFile = function(){
  fs.writeFile('./output/blacklist.txt', finalList.join('\n'));
}
//Runs everything after download
var runProgram = function(){
  console.log("Importing dictionary and building libraries.");
  importDictionary();
  console.log("Removing non-alphabet characters.");
  sanitizer();
  console.log("Separating each word in the dictionary's definitions.");
  definitionSeparator();
  console.log("Combining all words in the dictionary.")
  dictionaryCombiner();
  console.log("Importing list of partnered channels.");
  partnerListGenerator();
  console.log("Generating list of emotes.");
  emoteListGenerator();
  console.log("Generating filter. Operations to perform: " + (allWords.length * emoteArray.length));
  filterRun();
  console.log("Saving blacklist to file at ./output/blacklist.txt");
  saveFile();
  console.log("SAVED!\nYou may now close out of the window.")
}

//Running stuff
console.log("\n\nThis program was created by TacticalBacon00 (http://twitch.tv/TacticalBacon00)\nfor use by Polar_G (http://twitch.tv/Polar_G)\n\n");
console.log("Downloading current files.");
download('https://github.com/adambom/dictionary/raw/master/dictionary.json', './libraries/dictionary.json', function(){console.log('Dictionary download done.');
download('https://twitchemotes.com/api_cache/v2/subscriber.json', './libraries/subscriber.json', function(){console.log('Sub emote download done.');
subData = require('./libraries/subscriber.json');
dictionaryJSON = require('./libraries/dictionary.json');

runProgram();});
});


//Testing
//console.log(safeWords);
