<?php

function leerLocalidades($id_provincia){
    $query = "SELECT * FROM LOCALIDADES WHERE id_provincia=$id_provincia";
    $respuesta = realizarConsulta($query);
    echo $respuesta;
}


function leerProvincias(){
    $query = "SELECT * FROM PROVINCIAS";
    $respuesta = realizarConsulta($query);
    echo $respuesta;
}


function validarProvincia($id_provincia){
    $query = "SELECT * FROM PROVINCIAS WHERE id = $id_provincia";
    $mysql = new mysqli(SERVER,USER,PASS,DB);
    if ($mysql->connect_error) {
        return -1;
    }
    $resultado = $mysql->query($query);
    $ok = 0;
    if ($resultado->num_rows == 1){
        $ok=1;
    }
    $resultado->free();
    mysqli_close($mysql);
    return $ok; 
}


function validarLocalidad($idLocalidad){
    $query = "SELECT * FROM LOCALIDADES WHERE id = $idLocalidad";
    $mysql = new mysqli(SERVER,USER,PASS,DB);
    if ($mysql->connect_error) {
        return -1;
    }
    $resultado = $mysql->query($query);
    $ok=0;
    if ($resultado->num_rows == 1){
        $ok = 1;
    }
    $resultado->free();
    mysqli_close($mysql);
    return $ok;
}

?>