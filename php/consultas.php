<?php 

function realizarConsulta($query){
    $mysql = new mysqli(SERVER,USER,PASS,DB); 
    if ($mysql->connect_error) {
        $error =" Error de conexión n°: <b>". $mysql->connect_errno."</b> :".
                 "Mensaje del error: ".$mysql->connect_error.".";
        return $error;
    }
    $mysql->query("SET CHARACTER SET UTF8");
    $resultado = $mysql->query($query);

    //Consultas que no devuelven datos y son exitosas
    if($resultado === true){
        mysqli_close($mysql);
        return "Exito";
    }

    //Si devuelve resultados devuelvo un json con los resultados
    else if($resultado){
        $json = obtenerJson($resultado);
        $resultado->free();
        mysqli_close($mysql);
        return $json;
    }
    //Sino devuelvo el error
    $error = "Error: Se ha producido un error al realizar la consulta en la 
    base de datos.
    <br>
    <b> Mensaje del error: </b>".$mysql->error;
    mysqli_close($mysql);
    return $error;
}


function obtenerJson($resultadoConsulta){
    if(!$resultadoConsulta){
        return "null";
    }
    else{
        $arreglo = array();
        $i = 0;
        while($fila = $resultadoConsulta->fetch_assoc()){
            $arreglo[$i] = $fila;
            $i++;
        }
        return json_encode($arreglo);
    }
}

?>