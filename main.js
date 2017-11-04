
var idiomas = ['esp','ing'];

var palabras = [];
var inxPal = 4

var dataInit = {};
var dataEnd = {};
var status = 0;


var lenDataNivel = 0;

var count_win = 0;
var count_dan = 0;


Plotly.d3.csv("https://cibernomano.github.io/Dictionary/test.csv", function(err, rows){
    let datos = '';
    var inxs = gerRandomArray(rows.length);
    var i = 0;
    for(var inx in inxs){
        i = inxs[inx] 
        
        var value = {}
        value['index']=i;
        value['label']=rows[i][idiomas[0]];
        value['idioma']=idiomas[0];
        palabras.push(value);

        var value = {}
        value['index']=i;
        value['label']=rows[i][idiomas[1]];
        value['idioma']=idiomas[1];
        palabras.push(value);
    }

    nivel();
});

function nivel(){
    count_win = 0;
    count_dan = 0;
    
    let dataTem = palabras.slice(0, inxPal);
    var inxs = gerRandomArray(dataTem.length);
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
        inxPal=inxPal+2; 
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
    <br><br>
    <div class="row">`;
        datos=datos+'<div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">';
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
        document.getElementById(dataInit.id).hidden = true;
        document.getElementById(dataEnd.id).hidden = true;


        if(dataInit.index == dataEnd.index){
            count_win++
            document.getElementById('count_win').textContent = count_win;
        }else{
            count_dan++
            document.getElementById('count_dan').textContent = count_dan;
        }
        
        //count_win
        //count_dan
    }
    if(lenDataNivel <= 0){
        setTimeout( val => {
            nivel();
        },2000)
    }
}

function udoStatus(){

    document.getElementById(dataInit.id).classList.add('btn-primary')
    document.getElementById(dataInit.id).classList.remove('btn-warning')
    status=0;
}


function gerRandomArray(len){
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

/*
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');

/*
const bodyId = document.getElementById('bodyId');


const menuPrincipal = ['ib_m','oanda_m','poloniex_m']

function setMenuPrincipal(menuP){
    menuPrincipal.forEach( m => {
        document.getElementById(m.replace('_m','')).hidden = !(m===menuP)
        //console.log(document.getElementById(m))
        if(m===menuP){
            document.getElementById(m).classList.add("active") 
        } else {
            document.getElementById(m).classList.remove("active"); 
        }
    });
}


var logOutBool = false;

btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    
    const auth = firebase.auth();
    console.log('Loggea usuario')
    //btnLogout.hidden = false
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(err => console.log(err.message))

});


function rand() {
    return Math.random();
}
/** */