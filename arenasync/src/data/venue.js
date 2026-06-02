const venue = {
  id: 1,
  name: 'Downtown Soccer Field',
  address: '123 King St W, Toronto, ON',
  fieldType: 'Artificial Turf',
  capacity: 10,
  facilities: ['Floodlights', 'Parking'],
  bookings: [
    {
      id: 1,
      match: 'Sunday Morning Kickabout',
      organizer: 'Carlos Mendez',
      date: 'Sun, Jun 7',
      time: '10:00 AM',
      players: 10,
    },
    {
      id: 2,
      match: 'Wednesday Evening 5-a-side',
      organizer: 'Sara Ivanova',
      date: 'Wed, Jun 4',
      time: '7:00 PM',
      players: 12,
    },
  ],
}

export default venue