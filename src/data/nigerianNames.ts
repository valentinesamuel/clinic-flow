// Nigerian Names for Mock Data
// Comprehensive collection of authentic Nigerian names by ethnicity and gender

export const NIGERIAN_FIRST_NAMES = {
  male: [
    // Igbo
    'Chukwuemeka', 'Obinna', 'Ikenna', 'Chinedu', 'Chijioke', 'Kelechi',
    'Nnamdi', 'Emeka', 'Ugochukwu', 'Chidiebere', 'Ifeanyi', 'Tochukwu',
    // Yoruba
    'Olumide', 'Tunde', 'Adeola', 'Kunle', 'Femi', 'Biodun', 'Segun',
    'Adeyemi', 'Olaleye', 'Babatunde', 'Oluwaseun', 'Ayodeji',
    // Hausa
    'Ibrahim', 'Musa', 'Abdullahi', 'Yusuf', 'Hassan', 'Abubakar',
    'Mohammed', 'Suleiman', 'Usman', 'Bello', 'Aliyu', 'Aminu',
    // Others
    'David', 'Samuel', 'Daniel', 'Peter', 'John', 'Michael',
  ],
  female: [
    // Igbo
    'Adaobi', 'Ngozi', 'Chiamaka', 'Amaka', 'Chinwe', 'Ifunanya',
    'Nneka', 'Ifeoma', 'Ebele', 'Chioma', 'Adaeze', 'Chidimma',
    // Yoruba
    'Folake', 'Adenike', 'Funmilayo', 'Adeola', 'Omolara', 'Titilayo',
    'Yetunde', 'Olayinka', 'Morenike', 'Tolulope', 'Bukola', 'Ronke',
    // Hausa
    'Fatima', 'Aisha', 'Zainab', 'Hadiza', 'Hauwa', 'Halima',
    'Maryam', 'Bilkisu', 'Rahama', 'Jamila', 'Amina', 'Sadiya',
    // Others
    'Blessing', 'Grace', 'Favour', 'Joy', 'Peace', 'Faith',
  ],
};

export const NIGERIAN_LAST_NAMES = [
  // Igbo
  'Eze', 'Okafor', 'Nwosu', 'Okonkwo', 'Okoro', 'Nnamdi',
  'Ugochukwu', 'Chukwu', 'Onyeka', 'Obiora', 'Anyanwu', 'Nwachukwu',
  // Yoruba
  'Adeleke', 'Adeyemi', 'Olaleye', 'Ogunleye', 'Adekunle', 'Olawale',
  'Adesanya', 'Oladipo', 'Bakare', 'Fashola', 'Oyelaran', 'Akintola',
  // Hausa
  'Ibrahim', 'Abubakar', 'Yusuf', 'Hassan', 'Bello', 'Mohammed',
  'Suleiman', 'Danjuma', 'Garba', 'Abdullahi', 'Musa', 'Lawal',
  // Others
  'Adamu', 'Ogbonna', 'Ezeji', 'Igwe', 'Agu', 'Udeh',
];

// Generate a random Nigerian name
export const generateNigerianName = (gender: 'male' | 'female'): { firstName: string; lastName: string } => {
  const firstNames = NIGERIAN_FIRST_NAMES[gender];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = NIGERIAN_LAST_NAMES[Math.floor(Math.random() * NIGERIAN_LAST_NAMES.length)];
  return { firstName, lastName };
};

// Common Nigerian phone prefixes (MTN, Glo, Airtel, 9mobile)
export const NIGERIAN_PHONE_PREFIXES = [
  '0803', '0806', '0813', '0816', '0810', '0814', // MTN
  '0805', '0807', '0815', '0811', '0905',         // Glo
  '0802', '0808', '0812', '0708', '0902',         // Airtel
  '0809', '0817', '0818', '0909',                 // 9mobile
];

// Generate a random Nigerian phone number
export const generateNigerianPhone = (): string => {
  const prefix = NIGERIAN_PHONE_PREFIXES[Math.floor(Math.random() * NIGERIAN_PHONE_PREFIXES.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${suffix}`;
};

// Common Nigerian cities by state
export const NIGERIAN_CITIES: Record<string, string[]> = {
  lagos: ['Lagos Island', 'Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Yaba', 'Ikoyi', 'Apapa'],
  fct: ['Maitama', 'Wuse', 'Garki', 'Asokoro', 'Gwarinpa', 'Jabi', 'Kubwa', 'Lugbe'],
  rivers: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Oyigbo', 'Bonny'],
  kano: ['Kano City', 'Nassarawa', 'Fagge', 'Tarauni', 'Gwale'],
  oyo: ['Ibadan', 'Ogbomoso', 'Oyo', 'Iseyin', 'Eruwa'],
  anambra: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Ozubulu'],
  enugu: ['Enugu', 'Nsukka', 'Ngwo', 'Udi', 'Agbani'],
  delta: ['Warri', 'Asaba', 'Sapele', 'Ughelli', 'Effurun'],
};

// Common Nigerian street names
export const NIGERIAN_STREETS = [
  'Broad Street', 'Marina Road', 'Commercial Avenue', 'Hospital Road',
  'Church Street', 'Market Road', 'School Road', 'Airport Road',
  'Ahmadu Bello Way', 'Adeola Odeku Street', 'Awolowo Road', 'Moshood Abiola Way',
  'Herbert Macaulay Way', 'Bode Thomas Street', 'Ogunlana Drive', 'Allen Avenue',
];

// Generate a random Nigerian address
export const generateNigerianAddress = (state?: string): string => {
  const selectedState = state || Object.keys(NIGERIAN_CITIES)[Math.floor(Math.random() * Object.keys(NIGERIAN_CITIES).length)];
  const cities = NIGERIAN_CITIES[selectedState] || ['Unknown City'];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const street = NIGERIAN_STREETS[Math.floor(Math.random() * NIGERIAN_STREETS.length)];
  const number = Math.floor(Math.random() * 200) + 1;
  return `${number} ${street}, ${city}`;
};
