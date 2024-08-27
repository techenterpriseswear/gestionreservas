// Agrega dados ala objeto de reserva
class Reservas{
    constructor(){
        this.reservas = [];
    }

    agregarReserva(reserva) {
        this.reservas = [...this.reservas,reserva];

        console.log(this.reservas);


    }

    eliminarReserva(id) {
        this.reservas = this.reservas.filter( reserva => reserva.id !== id )
    }

    editarReserva(reservaActualizada){
        this.reservas = this.reservas.map( reserva => reserva.id === reservaActualizada.id ? reservaActualizada : reserva )
    }

}

export default Reservas;