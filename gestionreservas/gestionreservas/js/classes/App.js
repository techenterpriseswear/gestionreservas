import { datosReserva,nuevaReserva,crearDB, RevisarRestoReservas , DB } from '../funciones.js';
import { fechaSele, 
    horaSele , 
    nombreSele , 
    telefonoSele , 
    personasSele , 
    formulario , 
    contenedorReservas , 
    DivMostrarReservas } from '../selectores.js';


class App {
    
    constructor(){
        this.initApp();
       
        this.IndexDbStart();
        

    }
    initApp(){
            let DB;
            document.addEventListener("DOMContentLoaded", () => {
                    var openRequest = window.indexedDB.open("reservas",1);

                    openRequest.onsuccess = function(e) {
                        console.log("Success!");
                        DB = e.target.result;
                        console.log(DB)
                        let transaction = DB.transaction(['reservas'], 'readwrite');
                        let objectStore = transaction.objectStore('reservas');
                        const total = objectStore.count();
                       
                        total.onsuccess = function() {
                            console.log(total.result)
                            console.log("EY")
                            
                            if(total.result === 0) {
                                DivMostrarReservas.style.display = "none"
                            }
                        
                        }
                        // const total = DB.count()
                        // total.onsuccess = function() {
                        //     console.log(total.result)
                            
                        //     if(total.result === 0) {
                        //         DivMostrarReservas.style.display = "none"
                        //     }
                        
                        // }
                    }
            

                    openRequest.onerror = function (event) {
                        console.log('The database is opened failed');
                      };
                    
                    // let transaction = DB.transaction(['reservas'], 'readwrite');
                    // let objectStore = transaction.objectStore('reservas');
                    // const total = objectStore.count()
                    // total.onsuccess = function() {
                    //     console.log(total.result)
                        
                    //     if(total.result === 0) {
                    //         DivMostrarReservas.style.display = "none"
                    //     }
                    
                    // }

       
            });



            //Registra Eventos

            eventListeners()

            function eventListeners(){
                fechaSele.addEventListener('input',datosReserva);
                horaSele.addEventListener('change',datosReserva);
                nombreSele.addEventListener('input',datosReserva);
                telefonoSele.addEventListener('input',datosReserva);
                personasSele.addEventListener('input',datosReserva);




                formulario.addEventListener('submit',nuevaReserva);
                
            }





    }

    
    IndexDbStart(){
       
        crearDB()
    }
    
    BorrarHeading() {
        RevisarRestoReservas()
    }
}

export default App;