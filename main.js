


function setData(data, index){
    let datos = ''
    let  len = data.length-1;
    datos = datos + '<div class="row">';
    for(var i = 0 ; i <= len ; i++){
        if( i == 0 ){
            datos=datos+'<div  class="col-lg-2 col-centered  center-block">';
        }
        datos=datos+`<button onclick="setMenuPrincipal('${data[i]}','${index[i]}')" type="button" class="btn btn-primary btn-lg border">${data[i]}</button>`
        if( i%2 == 1 ){
            datos=datos+'</div><div  class="col-lg-2 col-centered  center-block">';//<br>
        }
        if( i == len ){
            datos=datos+'</div>';
        }
    }
    datos = datos + '</div>';
    document.getElementById('tabla_game').innerHTML = datos;
}

setData(['name', 'nombre', 'dance', 'bailar'],[0,1,2,3]);


function setMenuPrincipal(label, i){
    console.log(label)
    console.log(i)
}


Plotly.d3.csv("https://cibernomano.github.io/Dictionary/test.csv", function(err, rows){
    console.log(rows)
});/** */

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