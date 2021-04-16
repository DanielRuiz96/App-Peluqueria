
let pagina=1;
const cita={
    nombre: '',
    fecha:'',
    hora:'',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();

    // Resalta el div actual segun tab que se presiona.

    mostrarSeccion();

    //Oculta o muestra una seccion segun el tab.

    cambiarSeccion();

    // Paginacion siguiente y anterior.

    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual o mostrar la paginacion

    botonesPaginador();

    //Muestra el resumen de la cita 

    mostrarResumen();

    // Almacena el nombre de la cita en el objeto.
    nombreCita();

    //Almacena la fecha de la cita en el objeto 

    fechaCita();

    //Desahabilita dias pasados

    desabilitarFechaAnterior();

    // Almacena hora correcta

    horaCita();

})

function iniciarApp(){
    mostrarServicios();
}

async function mostrarServicios(){
    //console.log('consultando..')

    try {
        const resultado= await fetch('./servicios.json')
        const db = await resultado.json();
        const servicios=db.servicios;
       

        // Generar HTML

        servicios.forEach(servicio => {
            const {id,nombre,precio}=servicio;
            

            //DOM Scripting 

            const nombreServicio=document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            console.log(nombreServicio);

            //Generar Precio Servicio

            const precioServicio=document.createElement('P');
            precioServicio.textContent=`$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar Div contenedor

            const servicioDiv=document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio=id;

            // Inyectar precio y nombre al div de servicio

            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // Inyectarlo en el HTML

            document.querySelector('#servicios').appendChild(servicioDiv);

            // Selecciona un servicio para la cita

            servicioDiv.onclick=seleccionarServicio;

        });
    } catch (error) {
        console.log('error');
    }
}


function seleccionarServicio(e){
    
    let elemento;
    // Forzar que el elemento al cal le damos click sea el DIV
    if(e.target.tagName === 'P'){
        elemento =e.target.parentElement;
    }else{
        elemento=e.target;
    }
  
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id=parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{

        elemento.classList.add('seleccionado');

        const servicioObj ={
            id:parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        //console.log(servicioObj);

        agregarServicio(servicioObj);
    }
    
}

function cambiarSeccion(){
    const enlaces=document.querySelectorAll('.tabs button')
    enlaces.forEach(enlace => {
        enlace.addEventListener('click',e =>{
            e.preventDefault();
            pagina=parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        })
    });
}

function mostrarSeccion(){

    const seccionAnterior =  document.querySelector('.mostrar-seccion');

    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    
    const seccionActual= document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');


    // Eliminar la clase de actual en el tab anterior
    const tabAnterior=document.querySelector('.tabs .actual');

    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }
    //Resalta el Tab Actual

    const tab=document.querySelector(`[data-paso="${pagina}"]`)
    tab.classList.add('actual');
}

function paginaSiguiente(){

    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click',()=>{
        pagina++;
        botonesPaginador();
    })

}

function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click',()=>{
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina==1){
        paginaAnterior.classList.add('ocultar');
        
     }else if (pagina==3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // Estamos en la pagina 3, carga el resumen de la cita
       
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen(){
    // Destructuring

    const {nombre,fecha,hora,servicios}= cita;

    // Seleccionar el el resumen
    const resumenDiv=document.querySelector('.contenido-resumen');
    
    
    // Limpiar HTML

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    //Validacion Objeto

   

    if(Object.values(cita).includes('')){
        const noServicios=document.createElement('P');
        noServicios.textContent='Faltan datos de Servicios,hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumen Div
        resumenDiv.appendChild(noServicios);
    
        console.log('El Objeto esta vacio')

        return;
    }

        const headdingCita= document.createElement('H3');
        headdingCita.textContent='Resumen de Cita';

        const nombreCita= document.createElement('P');
        nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`

        const fechaCita= document.createElement('P');
        fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`

        const horaCita= document.createElement('P');
        horaCita.innerHTML = `<span>Hora:</span> ${hora}`

        const serviciosCita = document.createElement('DIV');
        serviciosCita.classList.add('resumen-servicios');

        const headdingServicios= document.createElement('H3');
        headdingServicios.textContent='Resumen de Servicios';
        serviciosCita.appendChild(headdingServicios);

        let cantidad=0;
        // Iterar sobre el arreglo de servicios

        servicios.forEach(servicio => {

            const {nombre,precio}=servicio;
            const contenedorServicio=document.createElement('DIV');
            contenedorServicio.classList.add('contenedor-servicio');

            const textoServicio=document.createElement('P');
            textoServicio.textContent=nombre;
            
            const precioServicio=document.createElement('P');
            precioServicio.textContent=precio;
            precioServicio.classList.add('precio');

            const totalServicio= precio.split('$')
            cantidad+= parseInt(totalServicio[1].trim())
            // Colocar texto y precio en el Div

            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            serviciosCita.appendChild(contenedorServicio);

        });


        resumenDiv.appendChild(headdingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);
        resumenDiv.appendChild(serviciosCita);
        
        const cantidadPagar=document.createElement('P');
        cantidadPagar.classList.add('total');
        cantidadPagar.innerHTML=`<span>Total a pagar: </span> $${cantidad}`
        resumenDiv.appendChild(cantidadPagar);

    
}

function eliminarServicio(id){
    const {servicios}=cita;
    cita.servicios=servicios.filter(servicio=>servicio.id !==id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios}=cita;
    cita.servicios=[...servicios,servicioObj];


}

function nombreCita(){
    const nombreInput=document.querySelector('#nombre');
    nombreInput.addEventListener('input',(e)=>{

        const nombreTexto =e.target.value.trim();

        // Validacion de nombreTexto debe tener algo

        if(nombreTexto==='' || nombreTexto.length <3){
            mostrarAlerta('Nombre no Valido','error');
        }else{
            const alerta=document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre=nombreTexto;
        }


     })
    
}

function mostrarAlerta(mensaje, tipo){
    
    // Si hay una alerta previa, entonces no crear otra

    const alertaPrevia=document.querySelector('.alerta')
    if(alertaPrevia){
        return;
    }
    
    const alerta=document.createElement('DIV')
    alerta.textContent=mensaje;
    alerta.classList.add('alerta');

    if(tipo ==='error'){
        alerta.classList.add('error');
    }

    const formulario =document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la Alerta despues de 3 segundos

    setTimeout(()=>{
        alerta.remove();
    },2000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
        const dia = new Date(e.target.value).getUTCDay();

        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value=' ';
            mostrarAlerta('Fines de Semana No Permitidos', 'error');
        }else{
            cita.fecha =fechaInput.value;
            console.log(cita);
        }
        
    })
}

function desabilitarFechaAnterior(){
    const inputFecha=document.querySelector("#fecha");
    const fechaAhora=new Date();
    const year= fechaAhora.getFullYear();
    const mes= fechaAhora.getMonth()+1;
    const dia=fechaAhora.getDate()+1;

    //Formato deseado: AAAA-MM-DD

    const fechaDeshabilitar=`${year}-${mes}-${dia}`
    inputFecha.min=fechaDeshabilitar;
}

function horaCita(){
    const inputHora =document.querySelector('#hora');
    inputHora.addEventListener('input',e =>{

        const horaCita=e.target.value;
        const hora=horaCita.split(':');
        if(hora[0]<10 || hora[0]>18){
            mostrarAlerta('Hora no valida','error');
            setTimeout(()=>{
                inputHora.value=' ';
            },2000)
        
        }else{
            cita.hora=horaCita;
        }
    })
}