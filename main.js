
var idiomas = ['esp','ing'];
var idmSpetch = idiomas[1]

var spentchCom = false;


var voice;

////voice load 

function checkCompatibilty () {
    if(!('speechSynthesis' in window)){
        alert('Your browser is not supported. If google chrome, please upgrade!!');
    }else{
        console.log("Puede hablar")
        spentchCom = true;
    }
};

checkCompatibilty();

var voiceMap = [];

function loadVoices () {
    var voices = speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
        var v = voices[i];
        voiceMap[v.name] = v;
        if('Google UK English Female' == v.name){
            voice=v;
        }
    };
};

window.speechSynthesis.onvoiceschanged = function(e){
    loadVoices();
};


var palabras = [];
var inxPal = 4

var dataInit = {};
var dataEnd = {};
var status = 0;


var lenDataNivel = 0;

var count_win = 0;
var count_dan = 0;

var idByHide = [];

var textData = 'test.csv';
var rows_raw = [];
var listaKeys = [];
var indexKey = 0;
var indexKey2 = 0;

var inxs;

function speak (text) {
    var msg = new SpeechSynthesisUtterance();
    msg.volume = 1;
    msg.voice = voice;
    msg.rate = 1;
    msg.Pitch = 1;
    msg.text = text;
    window.speechSynthesis.speak(msg);
    console.log(voice)
};

function selectedDictionary(dictionaryFile){
    
    document.getElementById("btnStart").disabled = false;
    textData = dictionaryFile;

    Plotly.d3.csv("https://raw.githubusercontent.com/ArbeyAragon/Dictionary/master/dictionaries/"+dictionaryFile, function(err, rows){
        rows_raw = rows;
        listaKeys = Object.keys(rows_raw[0]).filter((val) => {
            return 'esp' !== val
        });
        inxs = getRandomArray(rows_raw.length);
    });

}

function changeData(){
    palabras = [];
    let datos = '';
    var i = 0;
    for(var inx in inxs){
        i = inxs[inx] 
        
        var value = {}
        value['index']=i;
        value['label']=rows_raw[i][idiomas[0]].toLowerCase();
        value['idioma']=idiomas[0];
        palabras.push(value);

        var value = {}
        value['index']=i;
        value['label']=rows_raw[i][listaKeys[indexKey]].toLowerCase();
        value['idioma']=idiomas[1];
        palabras.push(value);
    }   
    indexKey2=indexKey
    indexKey++;
    if(indexKey == listaKeys.length){
        indexKey = 0; 
    }
    inxPal=inxPal+2;
}

function start(){
    document.getElementById('init').hidden = true;
    document.getElementById('main').hidden = false;
    nivel();
}

function nivel(){
    
    changeData();

    count_win = 0;
    count_dan = 0;
    idByHide = [];
    
    let dataTem = palabras.slice(0, inxPal);
    var inxs = getRandomArray(dataTem.length);
    var i = 0;
    data = [];
    for(var inx in inxs){
        i = inxs[inx] 
        data.push(dataTem[i])
    }
    lenDataNivel = dataTem.length;

    setMess(dataTem);
    let interval = 5;
    var myTimer = setInterval( val => {
        document.getElementById('time').textContent = interval;
        interval--;
    }, 1000);

    setTimeout( val => {
        clearInterval(myTimer);
        setData(data);
    },5000)

}

function setMess(data){
    status=0;
    let datos = ''
    let  len = data.length-1;
    datos = datos + '<ul class="list-group">';
        for(var i = 0 ; i <= len ; i+=2){
            datos=`<li class="list-group-item list-group-item-primary"> ${data[i+1].label}  =  ${data[i].label} </li>`+datos
        }
    datos = datos + '</ul>';
    datos = datos + '<h1 id="time" ></h1>';
    document.getElementById('tabla_game').innerHTML = datos;
}


function setData(data){
    status=0;
    let datos = ''
    let  len = data.length-1;
    datos = datos + `
    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
        <button type="button" class="btn btn-secondary" onclick="udoStatus()">Udo</button> 
        <p style="font-size:36px;"><a class="text-success">Win: </a><a href="#" id="count_win" class="text-success">0</a>  </p>
        <p style="font-size:36px;"><a class="text-danger">Losse: </a><a href="#" id="count_dan" class="text-danger">0</a>  </p>
    </div>
    <br>
    <h1>${listaKeys[indexKey2]}</h1>
    <br>
    <div class="row">`;
        datos=datos+'<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">';
        for(var i = 0 ; i <= len ; i++){
            datos=datos+`<button id="id_${i}" onclick="setMenuPrincipal('id_${i}','${data[i].index}','${data[i].label}','${data[i].idioma}')" 
                type="button" class="btn btn-primary btn-lg border">${data[i].label}</button>`
        }
        datos=datos+'</div>';
    datos = datos + '</div>';
    document.getElementById('tabla_game').innerHTML = datos;
}


function setMenuPrincipal(id,index,label, idioma){
    let val = {
        'id': id,
        'index': index,
        'label': label,
        'idioma': idioma
    }
    if(status == 0 || dataInit && (dataInit.id == id)){
        document.getElementById(id).classList.remove('btn-primary')
        document.getElementById(id).classList.add('btn-warning')
        status=1;
        dataInit=val;
        
    }else{

        status=0;
        dataEnd=val;
        lenDataNivel-=2;

        document.getElementById(dataInit.id).disabled = true;
        document.getElementById(dataEnd.id).disabled = true;
        idByHide.push(dataInit.id);
        idByHide.push(dataEnd.id);
        setTimeout(() => {
            idByHide.forEach((valueId) => {
                document.getElementById(valueId).hidden = true;    
            });
            idByHide = [];
        }, 2000)
        
        if(dataInit.index == dataEnd.index){
            count_win++
            document.getElementById('count_win').textContent = count_win;
        }else{
            count_dan++
            document.getElementById('count_dan').textContent = count_dan;
        }

    }
    if(spentchCom && (idioma == idmSpetch)){
        speak(label)
    }

    if(lenDataNivel <= 0){
        setTimeout( val => {
            if(count_dan>=1){
                inxPal=inxPal-2;
            }
            nivel();
        },2000)
    }
}

function udoStatus(){

    document.getElementById(dataInit.id).classList.add('btn-primary')
    document.getElementById(dataInit.id).classList.remove('btn-warning')
    status=0;
}


function getRandomArray(len){
    var randomArray = []
    var randomArrayTem = []
    for(var i = 0 ; i < len ; i++){ randomArrayTem.push(i); }
    for(var i = 0 ; i < len ; i++){
        let temp = randomArrayTem.length;
        let valR = getRandomInt(0, temp-1);
        
        randomArray.push(randomArrayTem[valR]);
        randomArrayTem.splice(valR, 1);
    }
    return randomArray;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

