import { addHours } from 'date-fns'
import React from 'react'
import { useCalendarStore, useUiStore } from '../../hooks'

export const FabDelete = () => {

    const {deleteEvent, hasEventSelected} = useCalendarStore()

    const handleClicDelete = () =>{
      deleteEvent()
    }

  return (
    <button
        className='btn btn-danger fab-danger'
        onClick={handleClicDelete}
        style={{ display: hasEventSelected ? '' : 'none'}}
    >
        <i className='fas fa-trash-alt'></i>
    </button>
  )
}
