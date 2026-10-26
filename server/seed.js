const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('./models/Listing');

dotenv.config();

const sampleListings = [
  {
    title: 'Introduction to Algorithms (CLRS 3rd Edition)',
    description: 'Hardcover textbook in excellent condition. All pages intact with minimal pencil annotations in chapters 1-4. Ideal for CS201/CS202 Data Structures & Algorithms coursework.',
    category: 'Books',
    listingType: 'Exchange',
    price: 0,
    itemCondition: 'Like New',
    status: 'Available',
    contactDetails: {
      name: 'Soumya Patel',
      email: 'soumya.patel@campus.edu',
      phone: '+91 98765 43210',
      campusLocation: 'Aryabhatta Hostel, Room 204',
    },
    itemLocation: 'Hostel Block 3 Ground Common Room',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=800&q=80',
    tags: ['CS', 'Algorithms', 'Textbook', 'Core Course'],
  },
  {
    title: 'Casio FX-991EX ClassWiz Scientific Calculator',
    description: 'High-speed scientific calculator with 552 functions and high-resolution LCD display. Available for semester-long or exam week borrowing. Comes with sliding protective case.',
    category: 'Electronics',
    listingType: 'Borrow',
    price: 50,
    itemCondition: 'Like New',
    status: 'Available',
    contactDetails: {
      name: 'Rahul Sharma',
      email: 'rahul.s@campus.edu',
      phone: '+91 98111 22334',
      campusLocation: 'Ramanujan Hall, Room 112',
    },
    itemLocation: 'Ramanujan Hall or Mechanical Dept Lobby',
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
    tags: ['Calculator', 'Math', 'Engineering', 'Exam Tool'],
  },
  {
    title: 'Complete Engineering Drawing Board & Mini Drafter Set',
    description: 'Full imperial size wooden drawing board with brass edges, mini drafter with clamp, 360-degree protractor scale, and T-Square. Ready for EDG freshman lab.',
    category: 'Stationery',
    listingType: 'Exchange',
    price: 0,
    itemCondition: 'Gently Used',
    status: 'Available',
    contactDetails: {
      name: 'Priya Iyer',
      email: 'priya.iyer@campus.edu',
      phone: '+91 97234 56789',
      campusLocation: 'Sarojini Naidu Bhavan, Room 418',
    },
    itemLocation: 'Civil Engineering Block A entrance',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    tags: ['Drawing Board', 'Engineering Drawing', 'Freshman', 'Stationery'],
  },
  {
    title: 'FOUND: Sony WH-CH520 Wireless Bluetooth Headphones (Beige)',
    description: 'Found left behind on a study desk on the 2nd floor silent reading zone. Beige color, fully charged with minor scuff on left ear cup. Please verify serial number or device name in bluetooth to claim.',
    category: 'Lost & Found',
    listingType: 'Lost & Found',
    price: 0,
    itemCondition: 'N/A',
    status: 'Available',
    contactDetails: {
      name: 'Central Library Helpdesk',
      email: 'library.helpdesk@campus.edu',
      phone: '+91 80 2345 6789',
      campusLocation: 'Central Library, Ground Floor Circulations',
    },
    itemLocation: 'Central Library, 2nd Floor Reading Cubicle #14',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    tags: ['Lost and Found', 'Headphones', 'Electronics', 'Library'],
  },
  {
    title: 'LOST: Black Leather Titan Raga Wallet & Student RFID Card',
    description: 'Lost on Thursday afternoon between the Food Court and the Academic Complex. Contains University ID card for Souvik Roy (Roll: 2023CS042) and Metro transit pass. Cash is not needed, please return IDs.',
    category: 'Lost & Found',
    listingType: 'Lost & Found',
    price: 0,
    itemCondition: 'N/A',
    status: 'Available',
    contactDetails: {
      name: 'Souvik Roy',
      email: 'souvik.roy@campus.edu',
      phone: '+91 99001 12233',
      campusLocation: 'Kalam Hall, Room 308',
    },
    itemLocation: 'Between Student Activity Center & Food Court walkway',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    tags: ['Lost Wallet', 'ID Card', 'Urgent', 'Student Card'],
  },
  {
    title: 'Arduino Uno R3 Starter Kit with Sensor Modules',
    description: 'Includes Arduino Uno board, breadboard, jumper wires, ultrasonic sensor HC-SR04, DHT11 temp/humidity sensor, 16x2 LCD display, and servo motor. Willing to exchange for Raspberry Pi Pico or borrow for semester.',
    category: 'Electronics',
    listingType: 'Exchange',
    price: 0,
    itemCondition: 'Brand New',
    status: 'Available',
    contactDetails: {
      name: 'Vikram Sengupta',
      email: 'vikram.sg@campus.edu',
      phone: '+91 98450 99887',
      campusLocation: 'Bhabha Hostel, Room 105',
    },
    itemLocation: 'IoT & Robotics Lab (Room 304, Tech Park)',
    imageUrl: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
    tags: ['Arduino', 'Embedded Systems', 'IoT', 'Sensors'],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campusloop_lite';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding.');

    await Listing.deleteMany({});
    console.log('Cleared existing listings.');

    const created = await Listing.insertMany(sampleListings);
    console.log(`Successfully seeded ${created.length} listings into CampusLoop Lite!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
