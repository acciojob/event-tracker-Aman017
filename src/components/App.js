import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';

const localizer = momentLocalizer(moment);

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const Button = styled.button`
  margin: 0 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.primary ? '#007bff' : '#f0f0f0'};
  color: ${props => props.primary ? 'white' : 'black'};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 8px 0;
`;

function App() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSelectSlot = (slotInfo) => {
    setCurrentEvent({
      start: slotInfo.start,
      end: slotInfo.end || moment(slotInfo.start).add(1, 'hour').toDate()
    });
    setEventTitle('');
    setEventLocation('');
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    setCurrentEvent(event);
    setEventTitle(event.title);
    setEventLocation(event.location || '');
    setShowModal(true);
  };

  const handleSave = () => {
    if (currentEvent.id) {
      // Update existing event
      setEvents(events.map(e => 
        e.id === currentEvent.id ? 
        { ...e, title: eventTitle, location: eventLocation } : e
      ));
    } else {
      // Add new event
      setEvents([...events, {
        id: Date.now(),
        title: eventTitle,
        location: eventLocation,
        start: currentEvent.start,
        end: currentEvent.end
      }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setEvents(events.filter(e => e.id !== currentEvent.id));
    setShowModal(false);
  };

  const filteredEvents = events.filter(event => {
    const now = new Date();
    if (filter === 'past') return event.start < now;
    if (filter === 'upcoming') return event.start >= now;
    return true;
  });

  const eventStyleGetter = (event) => {
    const isPast = event.start < new Date();
    return {
      style: {
        backgroundColor: isPast ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)',
        color: 'white',
        borderRadius: '4px',
        border: 'none'
      }
    };
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Event Tracker Calendar</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Button 
          primary={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Events
        </Button>
        <Button 
          primary={filter === 'upcoming'}
          onClick={() => setFilter('upcoming')}
          style={{ margin: '0 10px' }}
        >
          Upcoming
        </Button>
        <Button 
          primary={filter === 'past'}
          onClick={() => setFilter('past')}
        >
          Past
        </Button>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '70vh' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        defaultView="month"
      />

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>{currentEvent.id ? 'Edit Event' : 'Create Event'}</h2>
            <div>
              <label>Title:</label>
              <Input
                type="text"
                placeholder="Event Title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </div>
            <div>
              <label>Location:</label>
              <Input
                type="text"
                placeholder="Event Location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
              {currentEvent.id && (
                <Button 
                  style={{ backgroundColor: '#dc3545', color: 'white', margin: '0 10px' }} 
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
              <Button primary onClick={handleSave}>Save</Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}

export default App;