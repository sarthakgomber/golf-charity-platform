// src/seeders/initialData.js
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const User = require('../models/User')
const Charity = require('../models/Charity')

const charities = [
  {
    name: "St. Jude Children's Research Hospital",
    description:
      "Finding cures. Saving children's lives. St. Jude leads the way the world understands, treats and defeats childhood cancer and other life-threatening diseases.",
    website: 'https://www.stjude.org',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/St._Jude_Children%27s_Research_Hospital_logo.svg/320px-St._Jude_Children%27s_Research_Hospital_logo.svg.png',
    category: 'Health',
    isActive: true,
  },
  {
    name: 'World Wildlife Fund',
    description:
      "Protecting endangered species and habitats worldwide. WWF works to stop the degradation of the planet's natural environment and build a future where humans live in harmony with nature.",
    website: 'https://www.worldwildlife.org',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/WWF_logo.svg/200px-WWF_logo.svg.png',
    category: 'Environment',
    isActive: true,
  },
  {
    name: 'Doctors Without Borders',
    description:
      'Medical humanitarian assistance where its needed most. MSF provides emergency medical care to those affected by conflict, epidemics, disasters and exclusion from healthcare.',
    website: 'https://www.doctorswithoutborders.org',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/MSF_Logo.svg/200px-MSF_Logo.svg.png',
    category: 'Humanitarian',
    isActive: true,
  },
  {
    name: 'Cancer Research UK',
    description:
      'The world\'s leading cancer charity, funding research to help prevent, diagnose and treat cancer. Working to accelerate a world where more people survive cancer.',
    website: 'https://www.cancerresearchuk.org',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Cancer_Research_UK.svg/320px-Cancer_Research_UK.svg.png',
    category: 'Health',
    isActive: true,
  },
  {
    name: 'Rainforest Alliance',
    description:
      'Working to conserve biodiversity and ensure sustainable livelihoods by transforming land-use practices, business practices, and consumer behavior.',
    website: 'https://www.rainforest-alliance.org',
    logo: '',
    category: 'Environment',
    isActive: true,
  },
  {
    name: 'Save the Children',
    description:
      "Fighting for children's rights in the UK and around the world. We ensure all children have a safe, healthy and happy childhood.",
    website: 'https://www.savethechildren.org.uk',
    logo: '',
    category: 'Children',
    isActive: true,
  },
  {
    name: 'British Heart Foundation',
    description:
      'The UK\'s largest independent funder of cardiovascular research. We fight for every heartbeat — funding research, caring for patients, and educating the public.',
    website: 'https://www.bhf.org.uk',
    logo: '',
    category: 'Health',
    isActive: true,
  },
]

const adminUser = {
  name: 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@parandpurpose.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  role: 'admin',
  isActive: true,
}

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing
    await Charity.deleteMany()
    await User.deleteMany({ role: 'admin' })

    // Seed charities
    const createdCharities = await Charity.insertMany(charities)
    console.log(`✅ ${createdCharities.length} charities seeded`)

    // Seed admin user
    await User.create(adminUser)
    console.log(`✅ Admin user created: ${adminUser.email}`)

    console.log('\n🎉 Data import complete!')
    console.log(`Admin email:    ${adminUser.email}`)
    console.log(`Admin password: ${adminUser.password}`)
    process.exit()
  } catch (error) {
    console.error('❌ Seeder error:', error)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    await Charity.deleteMany()
    await User.deleteMany()
    console.log('✅ All data destroyed')
    process.exit()
  } catch (error) {
    console.error('❌ Destroy error:', error)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}