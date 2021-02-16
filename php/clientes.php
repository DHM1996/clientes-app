<?php 

function actualizarCliente($numeroCliente,$nombre,$apellido,$documento,$sexo,
                       $fechaNacimiento,$provincia,$localidad,$calle,$altura,
                       $departamento,$codigoArea,$telefono,$correo){
    
    if (validarCampos($nombre,$apellido,$documento,$sexo,
    $fechaNacimiento,$provincia,$localidad,$calle,$altura,
    $departamento,$codigoArea,$telefono,$correo)){
        $query = "UPDATE CLIENTES SET 
        nombre='$nombre',
        apellido='$apellido',
        documento='$documento',
        sexo='$sexo',
        fecha_nacimiento='$fechaNacimiento',
        provincia='$provincia',
        localidad='$localidad',
        calle='$calle',
        altura='$altura',
        departamento='$departamento',
        codigo_area='$codigoArea',
        telefono='$telefono',
        correo='$correo'
        WHERE numero_cliente='$numeroCliente'";

        $resultado = realizarConsulta($query);
        echo $resultado;
    }
    else{
        $error = "Error: Ha ocurrido un error al insertar los datos en la base
        de datos, verifique los datos ingresados e intentelo nuevamente";
        echo $error;
    }
}


function calcularCantidadDePaginas(){  
    $query = "SELECT count(*) as cantReg FROM CLIENTES";
    $resultado = realizarConsulta(($query));
    $json = json_decode($resultado);
    if($json){
        $json[0]->cantPag = ceil($json[0]->cantReg/REGXPAG); 
        $json = json_encode($json);
        echo $json;
    }
    else{
        echo $resultado;
    } 
}


function crearCliente($nombre,$apellido,$documento,$sexo,$fechaNacimiento,
                        $provincia,$localidad,$calle,$altura,$departamento,
                        $codigoArea,$telefono,$correo){
    
    if (validarCampos($nombre,$apellido,$documento,$sexo,$fechaNacimiento,
    $provincia,$localidad,$calle,$altura,$departamento,
    $codigoArea,$telefono,$correo)){

        $query= "INSERT INTO CLIENTES VALUES 
        (0,
        '$nombre',
        '$apellido',
        '$documento',
        '$sexo',
        '$fechaNacimiento',
        '$provincia',
        '$localidad',
        '$calle',
        '$altura',
        '$departamento',
        '$codigoArea',
        '$telefono',
        '$correo')";                 
            
        $resultado = realizarConsulta($query);
        echo $resultado;
    }
    else{
        $error = "Error: Ha ocurrido un error al insertar los datos en la base
        de datos, verifique los datos ingresados e intentelo nuevamente";
        echo $error;
    }
}


function eliminarCliente($numeroCliente){
    $query = "DELETE FROM CLIENTES WHERE numero_cliente=$numeroCliente";
    $resultado = realizarConsulta($query);
    echo $resultado; 
}


function leerClientePorDocumento($documento,$nombreUbicaciones){
    $query="";

    if ($nombreUbicaciones){
        $query = "SELECT CLIENTES.numero_cliente,
        CLIENTES.nombre,
        CLIENTES.apellido,
        CLIENTES.documento, 
        CLIENTES.sexo,
        CLIENTES.fecha_nacimiento,
        CLIENTES.calle,
        CLIENTES.altura,
        CLIENTES.departamento,
        CLIENTES.codigo_area,
        CLIENTES.telefono,
        CLIENTES.correo,
        PROVINCIAS.provincia,
        LOCALIDADES.localidad 
        FROM CLIENTES
        LEFT JOIN PROVINCIAS ON CLIENTES.provincia = PROVINCIAS.id
        LEFT JOIN LOCALIDADES ON CLIENTES.localidad = LOCALIDADES.id WHERE CLIENTES.documento LIKE $documento";
    }
    else{
        $query = "SELECT * FROM CLIENTES WHERE documento=$documento";
    }
    
    $resultado = realizarConsulta($query);
    echo $resultado;
}


function leerClientePorNumero($numeroCliente,$nombreUbicaciones){
    $query="";

    if($nombreUbicaciones){
        $query = "SELECT CLIENTES.numero_cliente,
        CLIENTES.nombre,
        CLIENTES.apellido,
        CLIENTES.documento, 
        CLIENTES.sexo,
        CLIENTES.fecha_nacimiento,
        CLIENTES.calle,
        CLIENTES.altura,
        CLIENTES.departamento,
        CLIENTES.codigo_area,
        CLIENTES.telefono,
        CLIENTES.correo,
        PROVINCIAS.provincia,
        LOCALIDADES.localidad 
        FROM CLIENTES
        LEFT JOIN PROVINCIAS ON CLIENTES.provincia = PROVINCIAS.id
        LEFT JOIN LOCALIDADES ON CLIENTES.localidad = LOCALIDADES.id WHERE CLIENTES.documento LIKE $numeroCliente";
    }
    else{
        $query = "SELECT * FROM CLIENTES WHERE numero_cliente=$numeroCliente";
    }
    
    $resultado = realizarConsulta($query);
    echo $resultado;
}


function leerPaginaClientes($pagina){
    if(ctype_digit($pagina)){
        $inicio = ($pagina - 1) * REGXPAG;
        
        $query = "SELECT 
        CLIENTES.numero_cliente,
        CLIENTES.nombre,
        CLIENTES.apellido,
        CLIENTES.documento, 
        CLIENTES.sexo,
        CLIENTES.fecha_nacimiento,
        CLIENTES.calle,
        CLIENTES.altura,
        CLIENTES.departamento,
        CLIENTES.codigo_area,
        CLIENTES.telefono,
        CLIENTES.correo,
        PROVINCIAS.provincia,
        LOCALIDADES.localidad 
        FROM CLIENTES
        LEFT JOIN PROVINCIAS ON CLIENTES.provincia = PROVINCIAS.id
        LEFT JOIN LOCALIDADES ON CLIENTES.localidad = LOCALIDADES.id
        LIMIT $inicio,".REGXPAG;
        
        $resultado = realizarConsulta($query);
        echo $resultado;
    }
    else{
        $error = "Error: El numero de página debe ser un número entero positivo.";
        echo $error;
    } 
}


function validarCampos($nombre,$apellido,$documento,$sexo,$fechaNacimiento,
$provincia,$localidad,$calle,$altura,$departamento,
$codigoArea,$telefono,$correo){

    $expRegulares = array(
        "texto"  => '/^[a-zA-ZÀ-ÿ\s]{1,40}$/', 
        "correo" => '/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/',
        "codigoArea" => '/^\d{3,4}$/',
        "telefono" => '/^\d{7,14}$/',
        "documento" => '/^\d{8}/', 
        "departamento" => '/^\d{1,2}[a-zA-z]{0,1}$/',
        "altura" => '/^\d{1,4}$/',
        "calle" => '/^[0-9a-zA-Z. ]+$/',
    );
    
      return $nombre;
            preg_match($expRegulares["texto"],$nombre);
            preg_match($expRegulares["texto"],$apellido) &&
            preg_match($expRegulares["documento"],$documento)&&
            ($sexo == 'M' || $sexo=='F')&&
            validarFechaNacimiento($fechaNacimiento)&&
            validarProvincia($provincia) == 1;
            validarLocalidad($localidad) == 1 &&
            preg_match($expRegulares["calle"],$calle) &&
            preg_match($expRegulares["altura"],$altura) &&
            preg_match($expRegulares["departamento"],$departamento) &&
            preg_match($expRegulares["codigoArea"],$codigoArea) &&
            preg_match($expRegulares["telefono"],$telefono) && 
            preg_match($expRegulares["correo"],$correo);
}


function validarFechaNacimiento($fechaNacimiento){
    date_default_timezone_set("America/Argentina/Buenos_Aires");
    $valores = explode('-', $fechaNacimiento);
    //verifico que sea una fecha
    if (count($valores) != 3){
        return 0;
    }
    if(!checkdate($valores[1], $valores[2], $valores[0])){
        return 0;
    } 
    //verifico que sea anterior a la fecha actual
    $fecha_actual = date("Y-m-d");
    if ($fechaNacimiento > $fecha_actual){
        return 0;
    }
    return 1;
}

?>