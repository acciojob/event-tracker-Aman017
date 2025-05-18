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

  // Generate days for current month
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
      // Update existing event
      setEvents(events.map(event => 
        event === selectedEvent 
          ? { ...event, title: eventTitle, location: eventLocation } 
          : event
      ));
    } else {
      // Create new event
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

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add actual days of the month
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
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{i}</div>
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={`event ${isPast ? 'past-event' : 'upcoming-event'}`}
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
        <button onClick={() => setFilter('all')}>All Events</button>
        <button onClick={() => setFilter('past')}>Past Events</button>
        <button onClick={() => setFilter('upcoming')}>Upcoming Events</button>
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
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedEvent ? 'Edit Event' : 'Add Event'}</h2>
            <input
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
            <div className="modal-buttons">
              {selectedEvent && (
                <button className="delete" onClick={handleDelete}>Delete</button>
              )}
              <button className="save" onClick={handleSave}>
                {selectedEvent ? 'Update' : 'Save'}
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;