<!DOCTYPE html>


<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="description" content= " Sistema que permite gestiónar la consulta, la creación, 
    la eliminación y la actualización de clientes.">
   
    <title>Gestión de Clientes</title>
    
    <!-- Hojas de estilo -->
    <link rel="stylesheet" href="../css/normalize.css"/>
    <link rel="stylesheet" href="../css/clientes.css"/>
</head>

<body>
    <div class="encabezado">
        <i class="encabezado__logo fas fa-handshake"></i>
        <h2 class="encabezado__titulo">Gestión de Clientes</h2>
        <div class="encabezado__fecha-hora" id="fecha-hora"></div>
    </div>

    <div class="contenido">
        <!-- Barra de control superior-->
        <div class="barra">
            <div class="barra__mensaje" id="mensaje">
                <i class="barra__mensaje-icono fas" id="mensaje-icono"></i>
                <p class="barra__mensaje-texto" id="mensaje-texto"></p>    
            </div>
            <div class="barra__busqueda">
                <input class="barra__busqueda-input" id="busqueda-input" placeholder="Buscar por documento">
                <button class="barra__busqueda-boton-conultar barra__boton" id="boton-consultar"><p>Consultar</p></button>
            </div>
            <button class=" barra__boton-registro barra__boton" id="boton-registro"><p>Nuevo cliente</p></button>
        </div>

        <!--Contenedor de la cantidad de resultados encontrados-->
        <div class="contenedor-cantidad" id="contenedor-cantidad"></div>

        <!--Contenedor de la tabla de resultados-->
        <div class="contenedor-tabla" id="contenedor-tabla"></div>
        
        <!-- Contenedor del control de páginas -->
        <div class="contenedor-paginacion" id="contenedor-paginacion"></div>
    </div>

    <!--Ventana modal para el registro de clientes -->
    <div class="modal" id="modal">
        <div class="ventana">
            <form class="formulario" id="formulario">
                <div class="formulario__seccion-encabezado">
                    <h2 class="formulario__titulo">Formulario de Registro</h2>
                </div>
                <div class="formulario__seccion-campos">
                    <h3 class="formulario__subtitulo">Datos Personales</h3>
                    <div class="grupo" id=grupo_nombre>
                        <label class = "grupo__etiqueta" for="nombre"> Nombres</label>
                        <input class="grupo__input--texto" id="nombre" type="text" placeholder="Juan"/>
                        <i class="grupo__icono-validacion fas" id=validacion-nombre></i>
                        <p class="grupo__error" id="error-nombre">Solo puede contener letras y espacios.</p> 
                    </div>
                    <div class="grupo" id="grupo_apellido">
                        <label class="grupo__etiqueta" for="apellido" >Apellido:</label>
                        <input class="grupo__input--texto" id="apellido" type="text" placeholder="Fernández"/>
                        <i class="grupo__icono-validacion fas " id=validacion-apellido></i>
                        <p class="grupo__error" id="error-apellido">Solo puede contener letras y espacios.</p> 
                    </div>         
                    <div class="grupo" id="grupo_documento">
                        <label class="grupo__etiqueta" for="documento" >Documento:</label>
                        <input class="grupo__input--texto" id="documento" type="text" placeholder="12345678"/>
                        <i class="grupo__icono-validacion fas"id=validacion-documento></i>
                        <p class="grupo__error" id="error-documento">Debe ser un número de 8 dígitos.</p>                  
                    </div>
                    <div class="grupo" id="grupo_nacimiento">
                        <label class="grupo__etiqueta" for="nacimiento" >Fecha de nacimiento:</label>
                        <input class="grupo__input--fecha" id="nacimiento" type="date"/>
                        <p class="grupo__error" id="error-nacimiento">Debe ingresar una fecha de nacimiento.</p>       
                    </div>
                    <div class="grupo" id="grupo_sexo">
                        <label class="grupo__etiqueta">Sexo:</label>
                        <input class=" grupo__input--opcion" id="femenino" type="radio">
                        <label for="femenino">Femenino</label>
                        <input class="grupo__input--opcion" id="masculino" type="radio">
                        <label for="masculino">Masculino</label>
                        <p class="grupo__error" id="error-sexo">Debe seleccionar un sexo.</p>     
                    </div>
                    <div class="grupo"></div>
                    <h3 class="formulario__subtitulo">Dirección</h3>
                    <div class="grupo" id="grupo_provincia">
                        <label class="grupo__etiqueta" for="provincia" >Provincia:</label>
                        <select class="grupo__input--seleccion" id="provincia"></select>
                        <p class="grupo__error" id="error-provincia">Debe seleccionar una provincia.</p>  
                    </div>
                    <div class="grupo" id="grupo_localidad"> 
                        <label class="grupo__etiqueta" for="localidad" >Localidad:</label>
                        <select class="grupo__input--seleccion" id="localidad"></select>
                        <p class="grupo__error" id="error-localidad">Debe seleccionar una localidad.</p>
                    </div>
                    <div class="grupo"></div>
                    <div class="grupo" id="grupo_calle">
                        <label class="grupo__etiqueta" for="calle" >Calle:</label>
                        <input class="grupo__input--texto" id="calle" type="text" placeholder=" Bulnes"/>
                        <i class="grupo__icono-validacion fas" id=validacion-calle></i>
                        <p class="grupo__error" id="error-calle">La calle indicada no es válida.</p>
                    </div>
                    <div class="grupo" id="grupo_altura">
                        <label class="grupo__etiqueta" for="altura">Altura:</label>
                        <input class="grupo__input--texto" id="altura" type="text" placeholder="1234"/>
                        <i class="grupo__icono-validacion fas " id=validacion-altura></i>
                        <p class="grupo__error" id="error-altura">Debe ser un número (1 a 4 dígitos)</p>
                    </div>
                    <div class="grupo" id="grupo_departamento">
                        <label class="grupo__etiqueta" for = "departamento" >Departamento:</label>
                        <input class="grupo__input--texto" id="departamento" type="text" placeholder="11F"/>
                        <i class="grupo__icono-validacion fas" id=validacion-departamento ></i>
                        <p class="grupo__error" id="error-departamento">Debe contener 1 o 2 dígitos para el número y 1 letra.</p>
                    </div>
                    <h3 class="formulario__subtitulo">Contacto</h3>
                    <div class="grupo" id="grupo_telefono">
                        <label class="grupo__etiqueta">Telefono:</label>
                        <label for="codigo">Cod:</label>
                        <input class="grupo__input--texto" id="codigo" type="text" placeholder="011"/>
                        <i class="grupo__icono-validacion fas" id=validacion-codigo></i>
                        <label for="telefono">Tel:</label>
                        <input class="grupo__input--texto" id="telefono" type="text" placeholder="12345678"/>
                        <i class="grupo__icono-validacion fas" id=validacion-telefono></i>
                        <p class="grupo__error" id="error-codigo">El codigo ingresado no es válido</p>
                        <p class="grupo__error" id="error-telefono">El teléfono ingresado no es válido</p>
                    </div>           
                    <div class="grupo" id="grupo_correo">
                        <label class="grupo__etiqueta" for="correo" >Correo:</label>
                        <input class="grupo__input--texto" id="correo" type="text" placeholder="juanfernandez@hotmail.com.ar"/>
                        <i class="grupo__icono-validacion fas" id=validacion-correo></i>
                        <p class="grupo__error" id="error-correo">El correo electrónico ingresado no es válido</p>     
                    </div>
                </div>
                <div class="formulario__seccion-control">
                    <input class="formulario__transaccion" type="hidden" id="transaccion" value="crearCliente"/>
                    <input class="formulario__numero-cliente"  type="hidden" id="numeroCliente" value=""/>
                    <input class="formulario__boton" id = "enviar" type="submit" value="Insertar"/>
                    <input class="formulario__boton" id = "borrar" type="reset" value="Borrar"/>
                    <input class="formulario__boton" id = "cancelar" type="reset"value="Cancelar"/>
                </div>
            </form>
        </div>
    </div>

    <!--JavasScript-->
    <script src="../js/ajax.js"></script>
    <script src="../js/clientes.js"></script>

    <!--Iconos-->
    <script src="https://kit.fontawesome.com/2c36e9b7b1.js" crossorigin="anonymous"></script>
</body>

</html>