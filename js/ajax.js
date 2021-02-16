var READY_STATE_UNINITIALIZED = 0;
var READY_STATE_LOADING = 1;
var READY_STATE_LOADED = 2;
var READY_STATE_INTERACTIVE = 3;
var READY_STATE_COMPLETE = 4;
var OK = 200;

var url = "controlador.php";

function obtener_xhr() {
    if(window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }
}


function enviarPeticion(peticion_http,metodo,funcion,url,datos) {
    if (peticion_http){
        peticion_http.open(metodo,url,true);
        peticion_http.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        peticion_http.onreadystatechange = funcion;
        peticion_http.send(datos);
    }
}


function obtenerjson(texto){
    try {
        var json = JSON.parse(texto);
    }
    catch (e) {
        return null;
    }
    return json;
}
