var fs = require('fs');

var randomizeNumberList = function (num) {
  var list = [];
  while (num > 0) {
    nextNum = Math.ceil(Math.random() * num)
    list.push(nextNum);
    num -= nextNum;
  }
  return list;
};

var randomListsForArgs = function () {
  var nums = Array.prototype.slice.call(arguments);
  return nums.map(function (num) {
    return randomizeNumberList(num);
  })
}

var randomItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
}

var writeLine = function (array) {
  var line = array.reduce(function (parentString, word) {
    return parentString + word + " ";
  }, "");
  return line.slice(0,1).toUpperCase() + line.slice(1);
}


var writeRandomHaikuList = function (syllableDict) {
  var syllables = randomListsForArgs(5, 7, 5);
  return syllables.map(function (line) {
    return line.map(function (numberOfSyllables) {
      randomWordObj = randomItem(syllableDict[numberOfSyllables]);
      return randomWordObj.word;
    })
  })
};

var writeHaiku = function (syllableDict) {
  return writeRandomHaikuList(syllableDict).reduce(function (parentStr, array) {
    return parentStr + writeLine(array) + '\n';
    }, "")
};




fs.readFile('cmudict.txt', {encoding: 'utf8'}, function (err, data) {
  if (err) throw err;

  // parse dict file
  // put into readable accessible format

  
  var lines = data.split('\n');
  var syllableDict = lines.reduce(function(syllDict, line) {
    var wordPhoneme = line.split('  ');
    var word = wordPhoneme[0].toLowerCase();
    var phoneme = wordPhoneme[1];
    var syllables = phoneme.split(/\d/).length - 1;
    var wordObj = {
      word: word,
      syllables: syllables,
      phoneme: phoneme,
    }
    // check if this is first word that has this many syllables
    if (!syllDict[syllables]) syllDict[syllables] = [];

    if (!/[\)\(\.]/.test(word))
      syllDict[syllables].push(wordObj);

    return syllDict;
  }, {})

  var rando = writeHaiku(syllableDict);
  console.log(rando);
});