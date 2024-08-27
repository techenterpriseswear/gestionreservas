import Reservas from './classes/Reservas.js';
import UI from './classes/UI.js';

import { fechaSele, 
    horaSele , 
    nombreSele , 
    telefonoSele , 
    personasSele , 
    formulario , 
    contenedorReservas , 
    DivMostrarReservas } from './selectores.js';



const ui = new UI();
export let DB;

const administrarReservas = new Reservas();



let editando ;
const reservaObj = {
    fecha: '',
    hora:'',
    nombre:'',
    telefono:'',
    personas:'',
   
}



export function datosReserva(e){

    reservaObj[e.target.name] = e.target.value;

    console.log(reservaObj)
    

}




//validar y agregar nueva reserva

export function nuevaReserva(e) {
    e.preventDefault();


    const { fecha, hora, nombre , telefono, personas } = reservaObj;

    //validar

    if( fecha === '' || hora === '' || nombre === '' || telefono === '' || personas === '') {

        ui.imprimirAlerta('Todos los campos son obligatorios','error');
        return;

    }

    if(editando) {
        ui.imprimirAlerta('Editado correctamente');

        administrarReservas.editarReserva({...reservaObj});

        //editar en IndexDB

        const transaction = DB.transaction(['reservas'], 'readwrite');
        const objectStore = transaction.objectStore('reservas');
        objectStore.put(reservaObj);

        transaction.oncomplete = () =>{

            const submit = document.querySelector('input[type="submit"]')
            submit.value = 'RESERVAR MESA';
            editando = false;


        }
        transaction.onerror = () => {
            console.log("hubo un error")
        }




     

    } else {
        reservaObj.id = Date.now();


        administrarReservas.agregarReserva({...reservaObj})


        //insetar registro en indexed db

        const transaction = DB.transaction(['reservas'],'readwrite');

        const objectStore = transaction.objectStore('reservas');

        objectStore.add(reservaObj)
        
        transaction.oncomplete = function(){
            console.log('Cita Agregada');
        }
        ui.imprimirAlerta('Se agrego correctamente');
       
    }

    //generar id unico

 

    //Reiniciar el objeto

    reiniciarObjeto();

   

    formulario.reset();

    //mostrar html reservas

    ui.imprimirReservas();


}

export function reiniciarObjeto() {
    reservaObj.fecha = '';
    reservaObj.hora = '';
    reservaObj.nombre = '';
    reservaObj.personas = '';
    reservaObj.telefono = '';

}

export function eliminarReserva(id) {

    const transaction =DB.transaction(['reservas'],'readwrite');
    const objectStore = transaction.objectStore('reservas');
    objectStore.delete(id);
    transaction.oncomplete = () => {
        console.log(`Cita {id} eliminada...`);
        ui.imprimirReservas()
        RevisarRestoReservas();
    }
    transaction.onerror = () => {
        console.log('Hubo un error');
    }


    RevisarRestoReservas();
}

export function RevisarRestoReservas(){
    
    
    let transaction = DB.transaction(['reservas'], 'readwrite');
    let objectStore = transaction.objectStore('reservas');
    const total = objectStore.count()
    total.onsuccess = function() {
        console.log(total.result)
        
        if(total.result === 0) {
            DivMostrarReservas.style.display = "none"
        }
       
    }

        // if(administrarReservas.reservas.length === 0) {
        //     DivMostrarReservas.style.display = "none"
        // }

}

//cargar los datos y modo edicion

export function cargarEdicion(reserva) {
    const { fecha, hora, nombre , telefono, personas, id } = reserva;

    horaSele.value = hora;
    fechaSele.value = fecha;
    nombreSele.value = nombre;
    telefonoSele.value = telefono;
    personasSele.value = personas;

    reservaObj.hora  = hora;
    reservaObj.fecha = fecha;
    reservaObj.nombre = nombre;
    reservaObj.telefono = telefono;
    reservaObj.personas = personas;
    reservaObj.id = id;

    //cambiar texto boton
    const submit = document.querySelector('input[type="submit"]')
    submit.value = 'Guardar Cambios';

    editando = true;
}

export function crearDB() {
   
    const crearDB = window.indexedDB.open('reservas', 1);

    //si hay erro
    crearDB.onerror = function() {
        console.log('Hubo un error');
    }
     crearDB.onsuccess = function() {
         console.log('BD Creada');
         DB =crearDB.result;
         ui.imprimirReservas();

        //  ui.imprimirReservas();
     }

     crearDB.onupgradeneeded = function(e){
         const db = e.target.result;
         const objectStore = db.createObjectStore('reservas',{
             keyPath: 'id',
             autoincrement: true
         });
         //definir todsa las columnas
         objectStore.createIndex('nombre','nombre', { unique:false });
         objectStore.createIndex('personas','personas', { unique:false });
         objectStore.createIndex('telefono','telefono', { unique:false });
         objectStore.createIndex('fecha','fecha', { unique:false });
         objectStore.createIndex('hora','hora', { unique:false });
         objectStore.createIndex('id','id', { unique:true });

         console.log('DB creada y Lista');
     }
    
    
    
    
    }