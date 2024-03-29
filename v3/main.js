var startButton = document
  .getElementById("btnStart")
  .addEventListener("click", start);

var udoButton = document
  .getElementById("btnUdo")
  .addEventListener("click", udoActionv);
var errorButton = document.getElementById("btnLabelError");

var initPanel = document.getElementById("init");
var worldsPanel = document.getElementById("worlds");
var gamePanel = document.getElementById("main");

const lang1 = "esp";
const lang2 = "ing";
const lang3 = "sue";

var voiceIng;
var voiceSue;
configVoices();

var spentchCom = false;
var textData = "frases_ing_sue.csv";
var inxs = [];
var data_list = [];
var main_index = 3;
var min_index = 0;
var data_list_level = [];

var lang_selected_1 = null;
var lang_selected_2 = null;
var lang_selected_3 = null;
var len_data = 0;

var count_total = 0;
var win_counter = 0;
var lose_counter = 0;
var is_validating = false;

function configVoices() {
  if (!("speechSynthesis" in window)) {
    alert("Your browser is not supported. If google chrome, please upgrade!!");
  } else {
    console.log("Puede hablar");
    spentchCom = true;
  }

  var voiceMap = [];
  window.speechSynthesis.onvoiceschanged = function (e) {
    var voices = speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      voiceMap[v.name] = v;
      console.log(v.name);

      //valida si ["english", "united", "states"] estan en el nombre de la voz todos y lo asigna a un booleano
      const isIng = ["english", "united", "states"].every((item) =>
        v.name.toLowerCase().includes(item)
      );

      const isSue = ["swedish", "sweden"].every((item) =>
        v.name.toLowerCase().includes(item)
      );

      if (isIng) {
        console.log("***************0");
        voiceIng = v;
      } else if (isSue) {
        console.log("***************1");
        voiceSue = v;
      }
    }
  };
}

function speakIng(text) {
  var msg = new SpeechSynthesisUtterance();
  msg.volume = 1;
  msg.voice = voiceIng;
  msg.rate = 1;
  msg.Pitch = 1;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  //console.log(voice)
}


function speakSue(text) {
  var msg = new SpeechSynthesisUtterance();
  msg.volume = 1;
  msg.voice = voiceSue;
  msg.rate = 1;
  msg.Pitch = 1;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  //console.log(voice)
}

function start() {
  selectedDictionary(textData);
  initPanel.hidden = true;
  worldsPanel.hidden = false;
  runGame();
}

function runGame() {
  win_counter = 0;
  lose_counter = 0;

  document.getElementById("count_win").textContent = win_counter;
  document.getElementById("count_dan").textContent = lose_counter;

  var counter = 5;
  var idVar = setInterval(() => {
    document.getElementById("counter").innerHTML = counter;
    if (counter == 0) {
      clearInterval(idVar);
      worldsPanel.hidden = true;
      gamePanel.hidden = false;
      ////////////////////////////////////////////////
      renderGame();
    }
    counter--;
  }, 1000);
}

function selectedDictionary(dictionaryFile) {
  textData = dictionaryFile;
  const path =
    "https://raw.githubusercontent.com/ArbeyAragon/Dictionary/master/dictionaries";
  console.log(path + "/" + dictionaryFile);
  
  fetch(path + "/" + dictionaryFile)
    .then(response => response.text())
    .then(data => {
      const lines = data.split("\n").filter(line => line.trim() !== '');
      const rows = lines.map(line => {
        const columns = line.split(/"\s*,\s*"/);
        if (columns.length === 3) {
          return {
            esp: columns[0].replace(/^"|"$/g, ""),
            ing: columns[1].replace(/^"|"$/g, ""),
            sue: columns[2].replace(/^"|"$/g, ""),
          };
        }
      }).filter(row => row !== undefined);
      
      data_list = rows;
      inxs = getRandomArray(data_list.length);
      renderTable();
    });
}


function getRandomArray(len) {
  var randomArray = [];
  var randomArrayTem = [];
  for (var i = 0; i < len; i++) {
    randomArrayTem.push(i);
  }
  for (var i = 0; i < len; i++) {
    let valR = getRandomInt(0, randomArrayTem.length - 1);
    randomArray.push(randomArrayTem[valR]);
    randomArrayTem.splice(valR, 1);
  }
  return randomArray;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderTable() {
  data_list_level = [];

  if (main_index - min_index > 12) {
    min_index += 3;
  }
  for (var i = min_index; i < main_index; i++) {
    data_list_level.push(data_list[inxs[i]]);
  }

  len_data = data_list_level.length;
  console.log(data_list_level);
  let html = "";
  let len = data_list_level.length;
  html = html + '<ul class="list-group">';
  for (var i = 0; i < len; i++) {
    //${data_list_level[i][lang1]}  =  
    html =
      `<li class="list-group-item list-group-item-primary"> ${data_list_level[i][lang2]}   =  ${data_list_level[i][lang3]} </li>` +
      html;
  }
  html = html + "</ul>";
  document.getElementById("inittable").innerHTML = html;
}

function renderGame() {
  document.getElementById("btnlang1").innerHTML = renderButtons(lang1);
  document.getElementById("btnlang2").innerHTML = renderButtons(lang2);
  document.getElementById("btnlang3").innerHTML = renderButtons(lang3);
}

function renderButtons(keyLanguage) {
  var html = "";
  let len = data_list_level.length;
  let randArr = getRandomArray(len);
  for (var i = 0; i < len; i++) {
    var index = randArr[i];
    html =
      html +
      `<button id="id_${index}_${keyLanguage}" onclick="clickButton('${keyLanguage}', 'id_${index}_${keyLanguage}', '${index}')" 
            type="button" class="btn btn-primary btn-lg border">${data_list_level[index][keyLanguage]}</button>`;
  }
  return html;
}

function clickButton(keyLanguage, id_button, index) {
  index = parseInt(index);
  if (!is_validating) {
    if (keyLanguage == lang1) {
      if (lang_selected_1 != null) {
        document
          .getElementById(lang_selected_1)
          .classList.remove("btn-warning");
        document.getElementById(lang_selected_1).classList.add("btn-primary");
      }
      document.getElementById(id_button).classList.remove("btn-primary");
      document.getElementById(id_button).classList.add("btn-warning");
      lang_selected_1 = id_button;
      validateWin(index);
    } else if (keyLanguage == lang2) {
      var label = data_list_level[index][lang2];
      speakIng(label);
      if (lang_selected_2 != null) {
        document
          .getElementById(lang_selected_2)
          .classList.remove("btn-warning");
        document.getElementById(lang_selected_2).classList.add("btn-primary");
      }
      document.getElementById(id_button).classList.remove("btn-primary");
      document.getElementById(id_button).classList.add("btn-warning");
      lang_selected_2 = id_button;
      validateWin(index);
    } else if (keyLanguage == lang3) {
      var label = data_list_level[index][lang3];
      speakSue(label);
      if (lang_selected_3 != null) {
        document
          .getElementById(lang_selected_3)
          .classList.remove("btn-warning");
        document.getElementById(lang_selected_3).classList.add("btn-primary");
      }
      document.getElementById(id_button).classList.remove("btn-primary");
      document.getElementById(id_button).classList.add("btn-warning");
      lang_selected_3 = id_button;
      validateWin(index);
    }
  }
}

function validateWin(index) {
  console.log("0-Win");
  var val1 = "";
  var val2 = "";
  var val3 = "";
  try {
    val1 = lang_selected_1.split("_").slice(0, -1).join("_");
  } catch (error) {}

  try {
    val2 = lang_selected_2.split("_").slice(0, -1).join("_");
  } catch (error) {}

  try {
    val3 = lang_selected_3.split("_").slice(0, -1).join("_");
  } catch (error) {}
  

  if (val1 == val2 && val3 == val2 && lang_selected_1 != null && lang_selected_2 != null && lang_selected_3 != null) {
    if (!is_validating) {
      is_validating = true;
      console.log("1-Win");
      win_counter++;
      document.getElementById("count_win").textContent = win_counter;
      count_total++;
      document.getElementById("count_total").textContent = count_total;
      console.log(win_counter);

      console.log(data_list_level);
      len_data--;
      setTimeout(() => {
        console.log("2-Win");
        document.getElementById(lang_selected_1).hidden = true;
        document.getElementById(lang_selected_2).hidden = true;
        document.getElementById(lang_selected_3).hidden = true;
        lang_selected_1 = null;
        lang_selected_2 = null;
        lang_selected_3 = null;
        if (len_data == 0) {
          main_index += 3;
          levelFinished();
        }
        is_validating = false;
      }, 4000);
    }
  } else if (lang_selected_1 != null && lang_selected_2 != null && lang_selected_3 != null) {
    if (!is_validating) {
      is_validating = true;
      len_data--;
      lose_counter++;
      document.getElementById("count_dan").textContent = lose_counter;
      count_total--;
      document.getElementById("count_total").textContent = count_total;

      document.getElementById(lang_selected_1).hidden = true;
      document.getElementById(lang_selected_2).hidden = true;
      document.getElementById(lang_selected_3).hidden = true;
      lang_selected_1 = null;
      lang_selected_2 = null;
      lang_selected_3 = null;
      if (len_data == 0) {
        levelFinished();
      }
      is_validating = false;
    }
  }
}

function levelFinished() {
  gamePanel.hidden = true;
  worldsPanel.hidden = false;
  renderTable();
  runGame();
}

function udoActionv() {
  if (lang_selected_1 != null) {
    document.getElementById(lang_selected_1).classList.remove("btn-warning");
    document.getElementById(lang_selected_1).classList.add("btn-primary");
    lang_selected_1 = null;
  }

  if (lang_selected_2 != null) {
    document.getElementById(lang_selected_2).classList.remove("btn-warning");
    document.getElementById(lang_selected_2).classList.add("btn-primary");
    lang_selected_2 = null;
  }

  if (lang_selected_3 != null) {
    document.getElementById(lang_selected_3).classList.remove("btn-warning");
    document.getElementById(lang_selected_3).classList.add("btn-primary");
    lang_selected_3 = null;
  }
}
