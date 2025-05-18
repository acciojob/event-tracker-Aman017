import React, { useState } from "react";
import './../styles/App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setSelectedEvent(null);
    setEventTitle('');
    setEventLocation('');
    setShowModal(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setSelectedDate(null);
    setEventTitle(event.title);
    setEventLocation(event.location);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!eventTitle.trim()) return;

    if (selectedEvent) {
      setEvents(events.map(event =>
        event === selectedEvent
          ? { ...event, title: eventTitle, location: eventLocation }
          : event
      ));
    } else {
      setEvents([...events, {
        id: Date.now(),
        title: eventTitle,
        location: eventLocation,
        date: selectedDate,
      }]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = () => {
    setEvents(events.filter(event => event !== selectedEvent));
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedEvent(null);
    setEventTitle('');
    setEventLocation('');
  };

  const filteredEvents = events.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.date);
    if (filter === 'past') return eventDate < now;
    if (filter === 'upcoming') return eventDate >= now;
    return true;
  });

  const renderCalendarDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(currentYear, currentMonth, i);
      const dayEvents = filteredEvents.filter(event =>
        new Date(event.date).toDateString() === day.toDateString()
      );
      const isPast = day < new Date();

      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${isPast ? 'past' : 'upcoming'}`}
          data-testid={`calendar-day-${i}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{i}</div>
          {dayEvents.map(event => (
            <div
              key={event.id}
              className={`event ${isPast ? 'past-event' : 'upcoming-event'}`}
              data-testid={`event-${event.id}`}
              onClick={(e) => handleEventClick(event, e)}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="App">
      <h1>Event Tracker Calendar</h1>

      <div className="filter-buttons">
        <button className="btn" onClick={() => setFilter('all')} data-testid="filter-all">All Events</button>
        <button className="btn" onClick={() => setFilter('past')} data-testid="filter-past">Past Events</button>
        <button className="btn" onClick={() => setFilter('upcoming')} data-testid="filter-upcoming">Upcoming Events</button>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          {new Date(currentYear, currentMonth, 1).toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </div>
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          {renderCalendarDays()}
        </div>
      </div>

      {showModal && (
        <div className="mm-popup__box" data-testid="modal">
          <div className="mm-popup__box__header">
            <h3>{selectedEvent ? 'Edit Event' : 'Create Event'}</h3>
          </div>
          <div className="mm-popup__box__body">
            <input
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="mm-popup__input"
              data-testid="event-title-input"
            />
            <input
              type="text"
              placeholder="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="mm-popup__input"
              data-testid="event-location-input"
            />
          </div>
          <div className="mm-popup__box__footer">
            {selectedEvent && (
              <button
                className="mm-popup__btn mm-popup__btn--danger"
                onClick={handleDelete}
                data-testid="delete-event"
              >
                Delete
              </button>
            )}
            <div className="mm-popup__box__footer__right-space">
              <button
                className="mm-popup__btn mm-popup__btn--success"
                onClick={handleSave}
                data-testid="save-event"
              >
                {selectedEvent ? 'Save Changes' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
