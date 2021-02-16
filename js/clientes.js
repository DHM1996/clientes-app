//constantes y variables
const TIEMPOMENSAJE = 5000;

//Ajax
var peticion_formulario = obtener_xhr();
var peticion_clientes = obtener_xhr();


/*Indican si el campo del formulario está completo o no*/
var campos = new Array();
campos["nombre"] = false;
campos["apellido"] = false;
campos["documento"] = false;
campos["masculino"] = false;
campos["femenino"] = false;
campos["nacimiento"] = false;
campos["provincia"] = false;
campos["localidad"] = false;
campos["calle"] = false;
campos["altura"] = false;
campos["departamento"] = true;
campos["codigo"] = false;
campos["telefono"] = false;
campos["correo"] = false;


//Campos formulario
var nombre = document.querySelector("#nombre"),
    apellido = document.querySelector("#apellido"),
    documento = document.querySelector("#documento"),
    masculino = document.querySelector("#masculino"),
    femenino = document.querySelector("#femenino"),
    nacimiento = document.querySelector("#nacimiento"),
    provincia = document.querySelector("#provincia"),
    localidad = document.querySelector("#localidad"),
    calle = document.querySelector("#calle"),
    altura = document.querySelector("#altura"),
    departamento = document.querySelector("#departamento"),
    codigo = document.querySelector("#codigo"),
    telefono = document.querySelector("#telefono"),
    correo = document.querySelector("#correo"),
    numeroCliente=document.querySelector("#numeroCliente"),
    transaccion=document.querySelector("#transaccion");

// variables auxiliares
var fijarLocalidad = false;
    esEdicion = false;
    pagina = 1;

//Funciones

function autocompletarFormulario(){
    if (peticion_clientes.readyState == READY_STATE_COMPLETE){
        if(peticion_clientes.status == OK){
            if(json = obtenerjson(peticion_clientes.responseText)){
                
                //Extraigo los datos del cliente del json
                datos = json[0];

                //Completo los campos del formulario con la información recibida

                //Datos personales
                nombre.value = datos.nombre;
                apellido.value = datos.apellido;
                documento.value = datos.documento;
                nacimiento.value = datos.fecha_nacimiento;
                if(datos.sexo == "M"){
                    seleccionarSexo(null,"masculino");
                }
                else{
                    seleccionarSexo(null,"femenino");
                }
                
                //Dirección
                provincia.value = datos.provincia;
                fijarLocalidad = datos.localidad;
                enviarPeticion(peticion_formulario,"POST",cargarLocalidades,url,"transaccion=leerLocalidades&id_provincia="+provincia.value);
                calle.value = datos.calle;
                altura.value = datos.altura;
                departamento.value = datos.departamento;
                
                //Contacto
                codigo.value = datos.codigo_area;
                telefono.value = datos.telefono;
                correo.value = datos.correo;
                
                //Transacción
                numeroCliente.value = datos.numero_cliente;
                transaccion.value="actualizarCliente";
                document.querySelector("#enviar").value="Actualizar";
                
                //Valido los datos con los que complete el formulario
                validarFormularioCompleto();

                //Muestro el formulario
                modal.style.display="block";
            }
            else{
                mostrarMensaje("error",peticion_clientes.responseText)
            }
        }
    }
}


function cargarLocalidades(){
    if (peticion_formulario.readyState == READY_STATE_COMPLETE){
        if(peticion_formulario.status == OK){
            if(json = obtenerjson(peticion_formulario.responseText)){
                //Cargo la opcion por defecto (sin selección de localidad)
                var opciones = "<option value = 0> - </option>";
                //Cargo las localidades
                for (var i = 0 ; i < json.length ; i++)
                    opciones += "<option value='"+ json[i].id+ "'>" +json[i].localidad + "</option>";
                localidad.innerHTML = opciones;
                //Detecto la selección de una localidad y valido
                localidad.addEventListener("change", validarLocalidad);   
                //En caso de que sea una edición selecciono automaticamente la localidad
                if(fijarLocalidad){
                    localidad.value = fijarLocalidad;
                    validarLocalidad();
                    fijarLocalidad = false;
                }
            }
            else{
                mostrarMensaje("error",peticion_formulario.responseText);
            }
        }
    }
}


function cargarProvincias(){
    if (peticion_formulario.readyState == READY_STATE_COMPLETE){
        if(peticion_formulario.status == OK){
            if(json = obtenerjson(peticion_formulario.responseText)){
                //Cargo la opción por defecto (Sin selección de provincia)
                var opciones = "<option value=0 > - </option>";
                //Cargo las provincias
                for (var i = 0; i < json.length ; i++)
                    opciones += "<option value = '" + json[i].id + "'>" + json[i].provincia + "</option>";
                provincia.innerHTML = opciones;
                //Hasta que no se seleccione una provincia se muestra el valor por defecto en localidad (sin selección de localidad)
                localidad.innerHTML="<option value=0> - </option>";
                //Detecto la selección de una provincia y la valido
                provincia.addEventListener("change",validarProvincia);
                //Cargo las localidades de la provincia seleccionada
                provincia.addEventListener("change",obtenerLocalidades);
            }
            else{
                mostrarMensaje("error",peticion_formulario.responseText)
            }
        }
    }
}


function cargarBusquedaPorDocumento(){
    //Inicializo búsqueda por documento
    var btnConsultar =  document.querySelector("#boton-consultar");
    btnConsultar.addEventListener("click",function(){
        var input = document.querySelector("#busqueda-input");
        var expRegDocumento = /^\d{8}$/;
        if(expRegDocumento.test(input.value)){
            enviarPeticion(peticion_clientes,"POST",mostrarResultadosBusqueda,url,"transaccion=leerClientePorDocumento&documento="+input.value+"&nombreUbicaciones=true");
        }
        else{
            mostrarMensaje("error","El documento ingresado no es válido.");
        }
    });
}


function cargarClientes(){
    if (peticion_clientes.readyState == READY_STATE_COMPLETE){
        if(peticion_clientes.status == 200){
            if(json = obtenerjson(peticion_clientes.responseText)){
                //Si no hay clientes en la página se carga automaticamente la página anterior
                if(json.length==0 && pagina>1){
                    cargarPagina(pagina-1);
                    return;
                }
                //Sino se crear la tabla de clientes
                crearTablaClientes(json);
            }
            else{
                mostrarMensaje("error",peticion_clientes.responseText);
            }
        }
    }
}


function cargarDocumento(){
    //inicializo fecha y hora
    setInterval(mostrarfechaYHora,1000);

    //Cargo la busqueda por documento
    cargarBusquedaPorDocumento();
    
    //Cargo la primera página de clientes
    cargarPagina(1);
    
    //Cargo el formulario
    cargarFormulario();
}


function cargarFormulario(){
    
    modal = document.querySelector("#modal");
    formulario = document.querySelector("#formulario");

    //Obtengo provincias y programo la carga de localidades
    obtenerProvincias();

    //Detección de escritura para validación
    document.querySelectorAll(".grupo__input--texto").forEach((input) => input.addEventListener("keyup",validarTexto));

    //Controles de la fecha de nacimiento
    limitarFecha();
    nacimiento.addEventListener("change",validarNacimiento);
    
    //Elección de un solo sexo
    masculino.addEventListener("click",seleccionarSexo);
    femenino.addEventListener("click",seleccionarSexo);
    
    //Envío del formulario
    formulario.addEventListener("submit",enviarFormulario);
    
    //Borrar
    document.querySelector("#borrar").addEventListener("click",function(e){
        e.preventDefault();
        resetearFormulario(false);
    })

    //Botón cancelar
    document.querySelector("#cancelar").addEventListener("click",function(e){
        e.preventDefault();
        modal.style.display="none";
        resetearFormulario(true);
    });

    //Botón registrar utilizado para mostrar el formulario
    document.querySelector("#boton-registro").addEventListener("click",function(){
        modal.style.display="inline-block";
    })
}


function cargarPagina(numPagina){
    pagina = parseInt(numPagina,10);
    enviarPeticion(peticion_clientes,"POST",cargarPaginacion,url,"transaccion=calcularCantidadDePaginas");  
}


function cargarPaginacion(){
    if (peticion_clientes.readyState == READY_STATE_COMPLETE){
        if(peticion_clientes.status == OK){
            var json = obtenerjson(peticion_clientes.responseText);
            if(json){
                //Leo los datos del json
                cantPag = json[0].cantPag;
                cantReg = json[0].cantReg;
                //Muestro la cantidad de resultados
                var textoResultados = "<p> Número de resultados: <b>" + cantReg + "</b>.</p>";
                document.querySelector("#contenedor-cantidad").innerHTML = textoResultados;
                if(cantReg>0){ 
                    //-----Muestro las información de paginación-----
                    var texto = "<p>";
                    texto += "Página <b>" + pagina + "</b> de <b>" + cantPag + "</b>.<br>";
                    //flecha atras
                    texto +="<a class='numpag numpag--atras' id='numpag--atras' href='#'> &laquo </a>";
                    //Números de página
                    for (var i=1; i<=cantPag;i++){
                        if(i == pagina){
                            texto +="<b class='numpag--seleccion'> "+ i + " </b>";
                            continue;
                        }
                        texto +="<a class='numpag numpag--numero' href='#' data-numpag="+i+"> "+ i + " </a>";
                    }
                    //flecha adelante
                    texto +="<a class='numpag numpag--adelante' id='numpag--adelante' href='#'> &raquo </a>"; 
                    document.querySelector("#contenedor-paginacion").innerHTML=texto;
                    //-----Agrego funcionalidad-----
                    //flecha atras
                    document.querySelector("#numpag--atras").addEventListener("click",function(){
                        if(pagina > 1){
                            cargarPagina(pagina-1);
                        }
                    });
                    //Números
                    document.querySelectorAll(".numpag--numero").forEach(pagina=>pagina.addEventListener("click",function(e){
                        cargarPagina(e.target.dataset.numpag);
                    }));
                    //flecha adelante
                    document.querySelector("#numpag--adelante").addEventListener("click",function(){
                        if(pagina < cantPag){
                            cargarPagina(pagina+1);
                        }
                    })   
                }
                else{
                    document.querySelector("#contenedor-paginacion").innerHTML="";
                }
                //Cargo los datos de los clientes de la página
                enviarPeticion(peticion_clientes,"POST",cargarClientes,url,"transaccion=leerPaginaClientes&pagina="+pagina);
            }
            else{
                mostrarMensaje("error",peticion_clientes.responseText);
            }     
        }
    }   
}


function crearTablaClientes(json){
    //Creo la tabla
    var tabla = "<table class='tabla-clientes'>";
        tabla += "<thead>";
            tabla += "<th class='tabla-clientes__th'> N° cliente </th>";
            tabla += "<th class='tabla-clientes__th'> Nombre y Apellido</th>";
            tabla += "<th class='tabla-clientes__th'> Documento </th>";
            tabla += "<th class='tabla-clientes__th'> Sexo </th>";
            tabla += "<th class='tabla-clientes__th'> Fecha de Nacimiento </th>";
            tabla += "<th class='tabla-clientes__th'> Dirección </th>";
            tabla += "<th class='tabla-clientes__th'> Localidad </th>";
            tabla += "<th class='tabla-clientes__th'> Provincia </th>";
            tabla += "<th class='tabla-clientes__th'> Teléfono</th>";
            tabla += "<th class='tabla-clientes__th'> Correo electrónico </th>";
            tabla += "<th class='tabla-clientes__th'> Editar </th>";
            tabla += "<th class='tabla-clientes__th'> Eliminar </th>";
        tabla += "</thead>";
        tabla += "<tbody>";
        for (var i=0 ; i<json.length; i++){
            tabla += "<tr>";
                tabla += "<td class='tabla-clientes__td'>"+ json[i].numero_cliente +"</td>";
                tabla += "<td class='tabla-clientes__td'>"+ json[i].nombre + " " + json[i].apellido + "</td>";
                tabla += "<td class='tabla-clientes__td'>"+ json[i].documento +"</td>";
                tabla += "<td class='tabla-clientes__td'>"+ json[i].sexo +"</td>";
                tabla += "<td class='tabla-clientes__td' >"+ json[i].fecha_nacimiento +"</td>";
                tabla += "<td class='tabla-clientes__td'>"+ json[i].calle + " " + json[i].altura + " " + json[i].departamento +"</td>";
                tabla += "<td class='tabla-clientes__td' >"+ json[i].localidad +"</td>";
                tabla += "<td class='tabla-clientes__td'>"+ json[i].provincia +"</td>";
                tabla += "<td class='tabla-clientes__td'>"+ "("+ json[i].codigo_area + ") " + json[i].telefono +"</td>";
                tabla += "<td class='tabla-clientes__td' >"+ json[i].correo +"</td>";
                tabla += "<td class='tabla-clientes__td tabla-clientes__td--editar'>" + "<a href='#' class ='tabla-clientes__editar' data-id='" +json[i].numero_cliente+ "' >Editar</a>"+ " </td>";
                tabla += "<td class='tabla-clientes__td tabla-clientes__td--eliminar'>" +"<a href='#' class = 'tabla-clientes__eliminar' data-id='" +json[i].numero_cliente + "' >Eliminar</a>"+ " </td>";
            tabla += "</tr>"
        }
        tabla += "</tbody>";
    tabla += "</table>";
    document.querySelector("#contenedor-tabla").innerHTML = tabla;
    
    //eventos eliminar
    var btnsEliminar = document.querySelectorAll(".tabla-clientes__eliminar");
    for(var i=0; i< btnsEliminar.length; i++)
        btnsEliminar[i].addEventListener("click",eliminarCliente);
    
    //eventos editar
    var btnsEditar = document.querySelectorAll(".tabla-clientes__editar");
    for(var i =0; i<btnsEditar.length;i++)
        btnsEditar[i].addEventListener("click",editarCliente);
}


function editarCliente(evento){
    datos = "transaccion=leerClientePorNumero&nombreUbicaciones=false";
    datos += "&numero_cliente="+evento.target.dataset.id;
    enviarPeticion(peticion_clientes,"POST",autocompletarFormulario,url,datos);
}


function eliminarCliente(evento){
    numeroCliente = evento.target.dataset.id;
    var conf = confirm("¿Está seguro que desea eliminar el cliente n°: " + numeroCliente + "?" );
    if(conf){
        datos = "transaccion=eliminarCliente";
        datos += "&numero_cliente="+numeroCliente;
        enviarPeticion(peticion_clientes,"POST",finalizarEliminacion,url,datos)
    }
}


function enviarFormulario(e){
    
    e.preventDefault();

    if(campos["nombre"] & campos["apellido"] & campos["documento"] & (campos["masculino"] | campos["femenino"]) &
       campos["nacimiento"] & campos["provincia"] & campos["localidad"] & campos["calle"] & campos["altura"] & 
       campos["codigo"] & campos["telefono"] & campos["correo"] &campos["departamento"]) {       
        
        conf = confirm("¿Está seguro que desea enviar el formulario?");
            
        if(conf)
                
                var datos = "transaccion=" + transaccion.value;
                esEdicion = false;
                
                if(transaccion.value == "actualizarCliente"){
                    datos += "&numero_cliente="+numeroCliente.value;
                    esEdicion = true;
                }
                
                datos += "&nombre=" + nombre.value
                datos += "&apellido="+ apellido.value;
                datos += "&documento="+ documento.value;
                datos += "&sexo=" + ((masculino.checked)?"M":"F"); 
                datos += "&fecha_nacimiento="+ nacimiento.value;
                datos += "&provincia="+provincia.value;
                datos += "&localidad="+ localidad.value;
                datos += "&calle="+ calle.value;
                datos += "&altura="+ altura.value;
                datos += "&departamento="+ departamento.value;
                datos += "&codigo_area="+ codigo.value;
                datos += "&telefono="+ telefono.value;
                datos += "&correo="+ correo.value;
                
                enviarPeticion(peticion_formulario,"POST",finalizarEnvio,url,datos);

                document.querySelector("#modal").style.display = "none";
                
                resetearFormulario(true);

               
    }

    else{
        validarFormularioCompleto();
        alert("No se han completado todos los campos o la información proporcionada es incorrecta.");
    } 
}


function finalizarEliminacion(){
    if (peticion_clientes.readyState == READY_STATE_COMPLETE){
        if(peticion_clientes.status == OK){
            var resultado = peticion_clientes.responseText;
            if(resultado.indexOf("Exito")>-1){
                mostrarMensaje("confirmacion","El cliente ha sido eliminado exitosamente.");
                cargarPagina(pagina);
            }
            else{
                mostrarMensaje("error",resultado);
            }
        }
    }
}


function finalizarEnvio(){
    if (peticion_formulario.readyState == READY_STATE_COMPLETE){
        if(peticion_formulario.status == OK){
            respuesta = peticion_formulario.responseText;
            if(respuesta.indexOf("Exito")>-1){
                //Si se envió correctamente recargo la página para ver los cambios
                cargarPagina(pagina);
                //En caso de que se haya editado un cliente se muestra el mensaje correspondiente
                //y se coloca la variable de control esedicion en false
                if (esEdicion){
                    mostrarMensaje("confirmacion","Los datos del cliente se modificaron correctamente")
                    esEdicion = false;
                }
                //Sino se trató de una creación por lo que se muestra el mensaje correspondiente
                else{
                    mostrarMensaje("confirmacion","El cliente se creó con éxito");
                }  
            }
            else{
                mostrarMensaje("error",peticion_formulario.responseText);
            }
        }
    }
}


function limitarFecha(){
    var f = new Date();
    var dia = f.getDate();
    if (dia < 10)
        dia="0"+ dia;
     var mes = f.getMonth() + 1;
    if(mes<10)  
        mes="0"+ mes;              
    var anio = f.getFullYear();
    var min = (anio-120) + "-" + mes + "-" + dia;
    var max = anio +"-"+mes+"-"+dia;
    nacimiento.setAttribute("max",max);
    nacimiento.setAttribute("min",min);
}


function limpiarMensaje(){
    var mensaje = document.querySelector("#mensaje");
    var mensajeTexto = document.querySelector("#mensaje-texto");
    var mensajeIcono = document.querySelector("#mensaje-icono");
    mensajeTexto.innerHTML ="";
    mensaje.classList.remove("barra__mensaje--confirmacion");
    mensaje.classList.remove("barra__mensaje--error");
    mensajeIcono.classList.remove("fa-check");
    mensajeIcono.classList.remove("fa-times");
}


function mostrarfechaYHora(){

    var meses = new Array (
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre");

    var f = new Date();

    var horas = f.getHours();
    if (horas < 10){
        horas = "0" + horas;
    }

    var minutos = f.getMinutes();
    if(minutos < 10){
        minutos = "0" + minutos;
    }

    var fecha = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
    
    var hora = horas + ":" + minutos;
    
    document.querySelector("#fecha-hora").innerHTML = "<p> "+ fecha + "<br>" + hora + "<p>";
 }


 function mostrarMensaje(tipo,texto){

    var mensaje = document.querySelector("#mensaje");
    var mensajeTexto = document.querySelector("#mensaje-texto");
    var mensajeIcono = document.querySelector("#mensaje-icono");

    mensajeTexto.innerHTML = texto;
    if (tipo == "confirmacion"){
        mensaje.classList.add("barra__mensaje--confirmacion");
        mensajeIcono.classList.add("fa-check");
    }
    else if(tipo == "error"){
        mensaje.classList.add("barra__mensaje--error");
        mensajeIcono.classList.add("fa-times");
    }
    setTimeout(limpiarMensaje,TIEMPOMENSAJE);
}


 function mostrarResultadosBusqueda(){
    if (peticion_clientes.readyState == READY_STATE_COMPLETE){
        if(peticion_clientes.status == OK){
            json = obtenerjson(peticion_clientes.responseText);
            if(json){
                //Se muestra la cantidad de resultados
                document.querySelector("#contenedor-cantidad").innerHTML = "Número de resultados: <b>"+json.length+"</b>.";
                //Se muestra el resultado obtenido en la tabla
                crearTablaClientes(json);
                //Se agrega un botón para poder volver atras
                document.querySelector("#contenedor-paginacion").innerHTML = "<button class ='barra__busqueda-volver barra__boton' id='busqueda-volver'>Volver</button>";
                document.querySelector("#busqueda-volver").addEventListener("click",function(){
                    //Al hacer click en el botón se limpia el campo de búsqueda
                    document.querySelector("#busqueda-input").value="";
                    //Se carga la última página que se había consultado
                    cargarPagina(pagina);
                });
            }
            else{
                mostrarMensaje("error",peticion_clientes.responseText);
            }
        }
    }
}

function obtenerLocalidades(e){
    numeroProvincia = e.target.value;
    if(numeroProvincia != 0){
        var transaccion = "transaccion=leerLocalidades";
        transaccion += "&id_provincia="+numeroProvincia;
        enviarPeticion(peticion_formulario,"POST",cargarLocalidades,url,transaccion);
    }
}


function obtenerProvincias(){
    enviarPeticion(peticion_formulario,"POST",cargarProvincias,url,"transaccion=leerProvincias");
}


function resetearFormulario(resetearTransaccion){

    //Borro todos los campos
    document.querySelector("#formulario").reset();

    //pongo todas las variables de validacion en false nuevamente
    for (key in campos) {
        campos[key]= false;
    }
    campos["departamento"] = true;

    //Oculto todos los posible errores que se estaban mostrando
    var errores = document.querySelectorAll(".grupo__error");
    for( var i = 0; i<errores.length;i++){
        errores[i].style.display = "none";
    }

    //Quito la clase error a todos los campos que la contengan (el texto en rojo)
    var textInputs= document.querySelectorAll(".grupo__input--texto");
    for( var i = 0; i<textInputs.length;i++){
        textInputs[i].classList.remove("grupo__input--texto-i");
    }

    //Oculto todos los iconos de confirmación y error que se estaban mostrando
    var iconos =  document.querySelectorAll(".grupo__icono-validacion");
    for( var i=0;i<iconos.length;i++){
        iconos[i].classList.remove("grupo__icono-validacion-i");
        iconos[i].classList.remove("grupo__icono-validacion-c");
        iconos[i].classList.remove("fa-times-circle");
        iconos[i].classList.remove("fa-check-circle");
    }

    //Elimino localidades cargadas y marco la opción por defecto
    localidad.innerHTML = "<option value=0 > - </option>";
    localidad.value = "0";

    //marco la opción por defecto para el campo provincia
    localidad.value = "0";


    if(resetearTransaccion){
        transaccion.value = "crearCliente";
        numeroCliente.value = "";
        document.querySelector("#enviar").value = "Insertar"
    }
    
}


function seleccionarSexo(e,sexo){
    if(e)
        var sexo = e.target.id;
    if(sexo == "masculino"){
        femenino.checked = false;
        masculino.checked = true;
    }
    else{
        masculino.checked = false;
        femenino.checked = true;
    }
    validarSexo();
}


function validarConExpReg(expRegular,idCampo){
    //obtengo el campo a partir de se id
    var campo = document.querySelector("#"+idCampo);
    //obtengo el icono
    var icono = document.querySelector("#validacion-"+campo.id);
    //obtengo el error
    var error = document.querySelector("#error-"+campo.id);
    //Si el campo esta vacío
    if(campo.value==""){
        //Elimino icono correcto
        campo.classList.remove("grupo__input--texto-c");
        icono.classList.remove("fa-check-circle");
        icono.classList.remove("grupo__icono-validacion-c");
        //Si el campo es dapartamento (no obligatorio)
        if(idCampo == "departamento"){
            //no muestro error con campo vacio
            campo.classList.remove("grupo__input--texto-i");
            icono.classList.remove("fa-times-circle");
            icono.classList.remove("grupo__icono-validacion-i");
            error.style.display = "none";
            //indico que es correcto
            campos["departamento"] = true;
        }
        //Si el campo no es departamento 
        else{
            //muestro el error
            campo.classList.add("grupo__input--texto-i");
            icono.classList.add("fa-times-circle");
            icono.classList.add("grupo__icono-validacion-i");
            error.style.display = "block";
            //indico que es incorrecto
            campos[idCampo] = false;
        }
    }
    //Si la información completada es correcta quito errores y muestro icono correcto
    else if(expRegular.test(campo.value)){
        campos[campo.id] = true;
        campo.classList.remove("grupo__input--texto-i");
        icono.classList.remove("fa-times-circle");
        icono.classList.remove("grupo__icono-validacion-i");
        icono.classList.add("fa-check-circle");
        icono.classList.add("grupo__icono-validacion-c");
        error.style.display = "none";
    }
    //Si es incorrecta quito icono correcto y muestro errores
    else{
        campos[idCampo] = false;
        campo.classList.add("grupo__input--texto-i");
        campo.classList.remove("grupo__input--texto-c");
        icono.classList.remove("fa-check-circle");
        icono.classList.remove("grupo__icono-validacion-c");
        icono.classList.add("fa-times-circle");
        icono.classList.add("grupo__icono-validacion-i");
        error.style.display = "block";
    }
}


function validarFormularioCompleto(){
    document.querySelectorAll(".grupo__input--texto").forEach((input) => validarTexto(null,input.id));
    validarProvincia();
    validarLocalidad();
    validarNacimiento();
    validarSexo();
}

function validarLocalidad(){
    var error =  document.querySelector("#error-localidad");
    if (!localidad.value || localidad.value=="0"){
        campos["localidad"] = false;
        error.style.display = "block";
    }
    else{
        campos["localidad"] = true;
        error.style.display = "none";
    }
}


function validarNacimiento(){
    var error =  document.querySelector("#error-nacimiento");
    if(!nacimiento.value){
        campos["nacimiento"] = false;
        error.style.display = "block";
    }
    else{
        campos["nacimiento"] = true;
        error.style.display = "none";
    }
}


function validarProvincia(){
    var error =  document.querySelector("#error-provincia");
    if (!provincia.value || provincia.value=="0"){
        campos["provincia"] = false;
        error.style.display = "block";
        localidad.innerHTML = "<option value=0 > - </option>";
        localidad.value = "0";
    }
    else{
        campos["provincia"] = true;
        error.style.display = "none";
    }
}


function validarSexo(){
    var error =  document.querySelector("#error-sexo");
    if(masculino.checked & !femenino.checked){
        campos["masculino"] = true;
        campos["femenino"] = false;
        error.style.display = "none";
    }
    else if (!masculino.checked & femenino.checked){
        campos["femenino"] = true;
        campos["masculino"] = false;
        error.style.display = "none";
    }
    else{
        campos["femenino"] = false;
        campos["masculino"] = false;
        error.style.display = "block";
    }
}


function validarTexto(evento,id){

    var expRegulares = {
        texto: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
        correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
        codigo: /^\d{3,4}$/,
        telefono: /^\d{7,14}$/, 
        documento: /^\d{8}$/, 
        departamento: /^\d{1,2}[a-zA-z]{0,1}$/,
        altura:  /^\d{1,4}$/,
        calle: /^[0-9a-zA-Z. ]+$/
    }

    if(evento){
        id = evento.target.id;
    }

    switch(id){
        case "nombre":
            validarConExpReg(expRegulares.texto,id);
            break;
        case "apellido":
            validarConExpReg(expRegulares.texto,id);
            break;
        case "documento":
            validarConExpReg(expRegulares.documento,id);
            break;
        case "calle":
            validarConExpReg(expRegulares.calle,id);
            break;
        case "altura":
            validarConExpReg(expRegulares.altura,id);
            break;
        case "departamento":
            validarConExpReg(expRegulares.departamento,id);
            break;
        case "codigo":
            validarConExpReg(expRegulares.codigo,id);
            break;
        case "telefono":
            validarConExpReg(expRegulares.telefono,id);
            break;
        case "correo":
            validarConExpReg(expRegulares.correo,id);
            break;    
    }
}

window.addEventListener("load",cargarDocumento);
