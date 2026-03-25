// backend/src/seeders/initialData.js
const mongoose = require('mongoose');
const Charity = require('../models/Charity');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const charities = [
  {
    name: "St. Jude Children's Research Hospital",
    description: "Finding cures. Saving children's lives.",
    website: "https://www.stjude.org",
    logo: "stjude-logo.png"
  },
  {
    name: "World Wildlife Fund",
    description: "Protecting endangered species and habitats worldwide.",
    website: "https://www.worldwildlife.org",
    logo: "wwf-logo.png"
  },
  {
    name: "Doctors Without Borders",
    description: "Medical humanitarian assistance where it's needed most.",
    website: "https://www.doctorswithoutborders.org",
    logo: "msf-logo.png"
  }
];

const importData = async () => {
  try {
    await Charity.deleteMany();
    await Charity.insertMany(charities);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Charity.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
