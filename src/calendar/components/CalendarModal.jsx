import { differenceInSeconds } from 'date-fns';
import { addHours } from 'date-fns/esm';
import { es } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'
import { useCalendarStore } from '../../hooks';
import { useUiStore } from '../../hooks/useUiStore';
registerLocale('es', es);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

  const { events, activeEvent, startSavingEvent } = useCalendarStore()

  const { isDateModalOpen, closeDateModal } = useUiStore()
  
  // const [isOpen, setIsOpen] = useState(true)

  const [formSubmited, setFormSubmited] = useState(false)

  const [formValues, setFormValues] = useState({
    title: 'hikaru',
    notes: 'Lock',
    start: new Date(),
    end: addHours(new Date(),2)
  })

 const titleClass = useMemo(() => {
    if(!formSubmited) return '';
    return (formValues.title.length > 0) ? '' : 'is-invalid'

    }, [formValues.title,formSubmited])


  const onInputChange = ({target}) =>{
    setFormValues({
      ...formValues,
      [target.name] : target.value
    })
  }
  
  const onCloseModal = () =>{
    // console.log("close")
    closeDateModal()
    
  }

  const onDateChange = (event, element) =>{
    setFormValues({
      ...formValues,
      [element]: event
    })
  }


  const onSubmit = async (event) =>{
    event.preventDefault();
    setFormSubmited(true);
    const diff = differenceInSeconds(formValues.end, formValues.start)
  
    if(isNaN(diff) || diff <= 0){
      Swal.fire('Error in dates', 'check dates', 'error')
      throw new Error('Error in dates')
      return;
    }

    if(formValues.title.length <= 0) return

    console.log(formValues)

    await startSavingEvent(formValues)
    closeDateModal()
    setFormSubmited(false)
    
  }
  useEffect(() => {
    if(activeEvent != null){
      setFormValues({...activeEvent})
    }
  }, [activeEvent])


  return (
    <Modal 
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
         style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
    >
    <h1> Nuevo evento </h1>
    <hr />
    <form className="container" onSubmit={onSubmit}>

        <div className="form-group mb-2">
            <label>Fecha y hora inicio</label>
            {/* <input className="form-control" placeholder="Fecha inicio" /> */}
            <DatePicker selected={formValues.start} className="form-control" 
              onChange={(event) => onDateChange(event, 'start')} 
              dateFormat="Pp"
              showTimeSelect
              locale="es"
              timeCaption='Hora'
              />
        </div>

        <div className="form-group mb-2">
            <label>Fecha y hora fin</label>
            {/* <input className="form-control" placeholder="Fecha inicio" /> */}
            <DatePicker selected={formValues.end} className="form-control" 
              minDate={formValues.start}
              onChange={(event) => onDateChange(event, 'end')} 
              dateFormat="Pp" 
              showTimeSelect
              locale="es"
              timeCaption='Hora'
              />
        </div>

        <hr />
        <div className="form-group mb-2">
            <label>Titulo y notas</label>
            <input 
                type="text" 
                className={`form-control ${titleClass}`}
                placeholder="Título del evento"
                name="title"
                autoComplete="off"
                value={formValues.title}
                onChange={onInputChange}
            />
            <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group mb-2">
            <textarea 
                type="text" 
                className="form-control"
                placeholder="Notas"
                rows="5"
                name="notes"
                value={formValues.notes}
                onChange={onInputChange}
            ></textarea>
            <small id="emailHelp" className="form-text text-muted">Información adicional</small>
        </div>

        <button
            type="submit"
            className="btn btn-outline-primary btn-block"
        >
            <i className="far fa-save"></i>
            <span> Guardar</span>
        </button>

    </form>
    </Modal>
  )
}
