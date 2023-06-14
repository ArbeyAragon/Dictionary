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

var voice;
configVoices();

var spentchCom = false;
var textData = "frases_ing_chat.csv";
var inxs = [];
var data_list = [];
var main_index = 3;
var min_index = 0;
var data_list_level = [];

var lang_selected_1 = null;
var lang_selected_2 = null;
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
      if ("Google UK English Female" == v.name) {
        voice = v;
      }
    }
  };
}

function speak(text) {
  var msg = new SpeechSynthesisUtterance();
  msg.volume = 1;
  msg.voice = voice;
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
    "https://raw.githubusercontent.com/ArbeyAragon/Dictionary/master/dictionaries"; //window.location.href.split("/").slice(3,-1).join('/');
  console.log(path + "/" + dictionaryFile);
  Plotly.d3.csv(path + "/" + dictionaryFile, function (err, rows) {
    data_list = rows;
    inxs = getRandomArray(data_list.length);
    renderTable();
    //console.log(data_list);
    //console.log(inxs);
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
  
  if((main_index-min_index) > 12){
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
    html =
      `<li class="list-group-item list-group-item-primary"> ${data_list_level[i]["esp"]}  =  ${data_list_level[i]["ing"]} </li>` +
      html;
  }
  html = html + "</ul>";
  document.getElementById("inittable").innerHTML = html;
}

function renderGame() {
  document.getElementById("btnesp").innerHTML = renderButtons("esp");
  document.getElementById("btning").innerHTML = renderButtons("ing");
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
    if (keyLanguage == "ing") {
      var label = data_list_level[index]["ing"];
      speak(label);
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
    } else {
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
    }
  }
}

function validateWin(index) {
  console.log("0-Win");
  var val1 = "";
  var val2 = "";
  try {
    val1 = lang_selected_1.split("_").slice(0, -1).join("_");
  } catch (error) {}

  try {
    val2 = lang_selected_2.split("_").slice(0, -1).join("_");
  } catch (error) {}

  if (val1 == val2 && lang_selected_1 != null && lang_selected_2 != null) {
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
        lang_selected_1 = null;
        lang_selected_2 = null;
        if (len_data == 0) {
          main_index += 3;
          levelFinished();
        }
        is_validating = false;
      }, 4000);
    }
  } else if (lang_selected_1 != null && lang_selected_2 != null) {
    if (!is_validating) {
      is_validating = true;
      len_data--;
      lose_counter++;
      document.getElementById("count_dan").textContent = lose_counter;
      count_total--;
      document.getElementById("count_total").textContent = count_total;

      document.getElementById(lang_selected_1).hidden = true;
      document.getElementById(lang_selected_2).hidden = true;
      lang_selected_1 = null;
      lang_selected_2 = null;
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
}
