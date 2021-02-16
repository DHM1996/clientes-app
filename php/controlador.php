<?php 

require "clientes.php";
require "ubicaciones.php";
require "consultas.php";
require "config.php";


if (isset($_POST ["transaccion"])){
    $transaccion = $_POST ["transaccion"];

    /* Transacciones Clientes*/
    if ($transaccion == "actualizarCliente"){
        if (
            isset($_POST["numero_cliente"]) &
            isset($_POST["nombre"]) &
            isset($_POST["apellido"]) &
            isset($_POST["documento"]) &
            isset($_POST["sexo"]) &
            isset($_POST["fecha_nacimiento"]) &
            isset($_POST["provincia"]) &
            isset($_POST["localidad"]) &
            isset($_POST["calle"]) &
            isset($_POST["altura"]) &
            isset($_POST["departamento"])&
            isset($_POST["codigo_area"])&
            isset($_POST["telefono"])&
            isset($_POST["correo"])
        ){
            actualizarCliente(
                $_POST["numero_cliente"],
                $_POST["nombre"],
                $_POST["apellido"],
                $_POST["documento"],
                $_POST["sexo"],
                $_POST["fecha_nacimiento"],
                $_POST["provincia"],
                $_POST["localidad"],
                $_POST["calle"],
                $_POST["altura"],
                $_POST["departamento"],
                $_POST["codigo_area"],
                $_POST["telefono"],
                $_POST["correo"]
            );
        }
        else{
            $error = "Error: No se ha podido actualizar el cliente porque los 
                    datos recibidos están incompletos.";
            echo $error;
        }
    }

    else if($transaccion == "calcularCantidadDePaginas"){
        calcularCantidadDePaginas();
    }

    else if($transaccion == "crearCliente"){
        if (
            isset($_POST["nombre"]) &
            isset($_POST["apellido"]) &
            isset($_POST["documento"]) &
            isset($_POST["sexo"]) &
            isset($_POST["fecha_nacimiento"]) &
            isset($_POST["provincia"]) &
            isset($_POST["localidad"]) &
            isset($_POST["calle"]) &
            isset($_POST["altura"]) &
            isset($_POST["departamento"])&
            isset($_POST["codigo_area"])&
            isset($_POST["telefono"])&
            isset($_POST["correo"])
        ){
            crearCliente(
                $_POST["nombre"],
                $_POST["apellido"],
                $_POST["documento"],
                $_POST["sexo"],
                $_POST["fecha_nacimiento"],
                $_POST["provincia"],
                $_POST["localidad"],
                $_POST["calle"],
                $_POST["altura"],
                $_POST["departamento"],
                $_POST["codigo_area"],
                $_POST["telefono"],
                $_POST["correo"]
            );
        }
        else{
            $error = "Error: No se ha podido crear el cliente porque los
                     datos recibidos están incompletos.";
            echo $error;
        }
    }

    else if($transaccion == "eliminarCliente"){
        if(isset($_POST["numero_cliente"])){
            eliminarCliente($_POST["numero_cliente"]);
        }
        else{
            $error = "Error: No se ha podido eliminar el cliente porque no se ha 
            recibido el número de cliente";
            echo $error;
        }
    }

    else if($transaccion == "leerClientePorDocumento"){
        if(!isset($_POST["documento"])){
            $error = "Error: No se ha podido leer la información del cliente porque no
            se ha indicado el numero de documento";
            echo $error;
            return;
        }
        if (!isset($_POST["nombreUbicaciones"])){
            $error = "Error: No se ha podido leer la información del cliente porque no
            se ha indicado si desea o no obtener el nombre de las ubicaciones";
            echo $error;
            return;
        }
        $nombreUbicaciones = false;
        if($_POST["nombreUbicaciones"]=="true"){
            $nombreUbicaciones=true;
        }
        leerClientePorDocumento($_POST["documento"],$nombreUbicaciones);
    }

    else if($transaccion == "leerClientePorNumero"){
        if (!isset($_POST["numero_cliente"])){
            $error = "Error: No se ha podido leer la información del cliente porque no
            se ha indicado el numero de cliente";
            echo $error;
            return;
        }
        if (!isset($_POST["nombreUbicaciones"])){
            $error = "Error: No se ha podido leer la información del cliente porque no
            se ha indicado si desea o no obtener el nombre de las ubicaciones";
            echo $error;
            return;
        }
        $nombreUbicaciones = false;
        if($_POST["nombreUbicaciones"]=="true"){
            $nombreUbicaciones=true;
        }
        leerClientePorNumero($_POST["numero_cliente"],$nombreUbicaciones);
    }

    else if($transaccion == "leerPaginaClientes"){
        if (isset($_POST["pagina"])){
            leerPaginaClientes($_POST["pagina"]);
        }
        else{
            $error = "Error: No se ha podido leer la página porque no se ha
                    recibido el número de página";
            echo $error;
        }
    }

    /* Transacciones ubicaciones*/

    else if($transaccion == "leerProvincias"){
        leerProvincias();
    }

    else if($transaccion == "leerLocalidades"){
        if (isset($_POST["id_provincia"])){
            leerLocalidades($_POST["id_provincia"]);
        }
        else{
            $error= "Error: No se han podido leer las localidades porque no se ha
            recibido el numero de provincia";
            echo $error;
        }
    }
      
} 

else {
    $error = "Error: No ha especificado una transacción.";
    echo $error;
}

?>