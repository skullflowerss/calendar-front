import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { calendarAPI } from "../api";
import { convertEventsToDate } from "../helpers";
import {
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onSetActiveEvent,
  onUpdateEvent,
} from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {
  const dispatch = useDispatch();

  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    try {
      if (calendarEvent.id) {
        await calendarAPI.put(`/events/${calendarEvent.id}`, calendarEvent);
        dispatch(onUpdateEvent({ ...calendarEvent, user }));
        return;
      }
      const { data } = await calendarAPI.post("/events", calendarEvent);
      console.log(data);
      dispatch(
        onAddNewEvent({
          ...calendarEvent,
          id: data.evento.id,
          user,
        })
      );
    } catch (error) {
      console.log(error);
      Swal.fire("Error saving", error.response.data.msg, "error");
    }
  };

  const deleteEvent = async () => {
    try {
      const res = await calendarAPI.delete(`/events/${activeEvent.id}`);
      console.log(res);
      dispatch(onDeleteEvent());
    } catch (error) {
      console.log(error);
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

  const startLoadingEvents = async () => {
    try {
      const { data } = await calendarAPI.get("/events");
      const events = convertEventsToDate(data.eventos);
      // dispatch(startLoadingEvents(events));
      dispatch(onLoadEvents(events));
    } catch (error) {
      console.log(error);
    }
  };

  return {
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,
    deleteEvent,
    setActiveEvent,
    startLoadingEvents,
    startSavingEvent,
  };
};
