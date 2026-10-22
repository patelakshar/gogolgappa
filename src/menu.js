// Transcribed from the printed truck menu; prices from the handwritten price list.
// Item: [name, ingredients, price in £]. Leave price off to show none.
export const CONTACT = {
  phone: '07405983207', // call + WhatsApp
  instagram: 'golgappa.uk',
  email: 'info.golgappadotcom@gmail.com',
  address: '144 Cherry Hinton Road, Cambridge CB1 7AJ',
}

export const MAINS = [
  {
    id: 'chaat', title: 'Chaat', note: 'Pani puri & Indian street snacks', img: '/img/cut/chaat.webp',
    alt: 'Plate of pani puri and dahi puri chaat with sev and pomegranate, Gol Gappa Cambridge',
    items: [
      ['Pani Puri', 'Semolina puri shells, boiled potatoes, chickpeas, mint, coriander, green chilli, tamarind, spices, black salt', '2.99'],
      ['Dahi Puri', 'Puri, yogurt, potatoes, tamarind chutney, mint chutney, sev, spices', '4.99'],
      ['Sev Puri', 'Papdi, potatoes, onions, tomatoes, tamarind chutney, mint chutney, sev', '5.99'],
      ['Bhel', 'Puffed rice, sev, peanuts, onions, tomatoes, chutneys, coriander, spices', '4.99'],
      ['Papdi Chaat', 'Papdi, yogurt, potatoes, chickpeas, chutneys, sev', '4.99'],
      ['Samosa Chaat', 'Samosa, chickpeas, yogurt, chutneys, onions, spices', '4.99'],
    ],
  },
  {
    id: 'sandwiches', title: 'Sandwiches', note: 'Bombay-style, buttered and grilled', img: '/img/cut/sandwich.webp',
    alt: 'Grilled vegetable cheese sandwich',
    items: [
      ['Bombay Sandwich', 'Bread, boiled potatoes, cucumber, tomato, onion, mint chutney, butter', '4.99'],
      ['Bombay Grilled Sandwich', 'Bread, vegetables, butter, cheese (optional), chutney', '5.99'],
      ['Cheese Sandwich', 'Bread, cheese, butter', '4.99'],
      ['Schezwan Sandwich', 'Bread, vegetables, spicy Schezwan sauce, butter', '6.99'],
      ['Paneer Tikka Sandwich', 'Bread, paneer, yogurt marinade, spices, onions, capsicum', '6.99'],
    ],
  },
  {
    id: 'burgers', title: 'Burgers', note: 'Crispy aloo tikki in a soft bun', img: '/img/cut/burger.webp',
    alt: 'Crispy tikki burger with lettuce and tomato',
    items: [
      ['Aloo Tikki Burger', 'Bun, potato patty, lettuce, sauces', '4.99'],
      ['Aloo Tikki Cheese Burger', 'Bun, potato patty, cheese, sauces, veggies', '5.99'],
    ],
  },
  {
    id: 'wraps', title: 'Wraps', note: 'Rolled warm in flatbread', img: '/img/cut/wrap.webp',
    alt: 'Paneer wraps cut in half on paper',
    items: [
      ['Vegetable Wrap', 'Flatbread, vegetables, sauces, chutney', '4.99'],
      ['Aloo Tikki Wrap', 'Flatbread, potato tikki, chutney, salad', '5.49'],
      ['Paneer Tikka Wrap', 'Flatbread, paneer, yogurt marinade, onions, capsicum', '6.99'],
    ],
  },
  {
    id: 'vadapav', title: 'Vada Pav', note: "Mumbai's favourite bun", img: '/img/cut/vadapav.webp',
    alt: 'Vada pav with green chutney and fried chilli',
    items: [
      ['Bombay Vada Pav', 'Bun, fried potato vada, garlic chutney, green chutney', '3.99'],
      ['Butter Vada Pav', 'Bun, vada, butter, chutneys', '4.99'],
      ['Masala Fry Vada Pav', 'Vada, spices, butter, chutneys', '5.49'],
      ['Masala Cheese Vada Pav', 'Bun, vada, cheese, spices, chutneys', '5.99'],
    ],
  },
  {
    id: 'dabeli', title: 'Dabeli', note: 'Sweet, spicy, crunchy', img: '/img/cut/dabeli.webp',
    alt: 'Dabeli topped with pomegranate, peanuts and sev',
    items: [
      ['Butter Dabeli', 'Bun, mashed potato, dabeli masala, peanuts, pomegranate, chutneys, butter', '3.99'],
      ['Grilled Dabeli', 'Bun, mashed potato, dabeli masala, peanuts, pomegranate, chutneys, grilled with butter', '4.99'],
      ['Cheese Dabeli', 'Bun, potato filling, cheese, chutneys', '5.99'],
    ],
  },
  {
    id: 'samosa', title: 'Samosa', note: 'Golden pastry, spiced filling', img: '/img/cut/samosa.webp',
    alt: 'Two samosas with tamarind chutney',
    items: [
      ['Punjabi Samosa', 'Flour pastry, potato filling, peas, spices', '2.49'],
      ['Cocktail Samosa', 'Pastry, spiced potato filling', '2.99'],
      ['Chinese Paneer Samosa', 'Pastry, paneer, noodles, soy sauce, vegetables', '3.99'],
    ],
  },
  {
    id: 'springroll', title: 'Spring Roll', note: 'Indo-Chinese crunch', img: '/img/cut/springroll.webp',
    alt: 'Vegetable spring rolls with dipping sauce',
    items: [
      ['Vegetable Spring Roll', 'Wrapper, cabbage, carrot, capsicum, soy sauce', '2.99'],
      ['Cheese Spring Roll', 'Wrapper, vegetables, cheese', '3.99'],
    ],
  },
  {
    id: 'fries', title: 'Fries', note: 'Salted, spiced or loaded', img: '/img/cut/fries.webp',
    alt: 'Bowl of spiced fries',
    items: [
      ['Regular Fries', 'Potatoes, salt, oil', '2.99'],
      ['Peri-Peri Fries', 'Potatoes, peri-peri seasoning', '3.50'],
      ['Cheesy Loaded Fries', 'Potatoes, cheese sauce, herbs', '4.99'],
    ],
  },
]

export const SIPS = [
  {
    id: 'lassi', title: 'Lassi', img: '/img/cut/lassi.webp', alt: 'Glass of lassi topped with pistachio and saffron',
    items: [
      ['Regular Lassi', 'Yogurt, sugar or salt, cardamom', '3.99'],
      ['Mango Lassi', 'Yogurt, mango pulp, sugar', '4.99'],
      ['Dry Fruit Lassi', 'Yogurt, mixed dry fruits, sugar', '4.99'],
    ],
  },
  {
    id: 'drinks', title: 'Drinks', img: '/img/cut/drinks.webp', alt: 'Iced cola with a lemon slice',
    items: [['Coca-Cola', '', '2.50'], ['Pepsi', '', '2.50'], ['Sprite', '', '2.50']],
  },
  { id: 'chai', title: 'Chai', img: '/img/cut/chai.webp', alt: 'Masala chai in a clay kulhad', items: [['Masala Tea', '', '1.99']] },
]

export const ALL = [...MAINS, ...SIPS]

// Opening day falls on Diwali 2026.
export const OPENING = new Date(2026, 10, 8)
export const PROMO = [
  'Opening Sunday 8 November',
  'Diwali offer · Pani Puri, Dahi Puri & Sev Puri £1.99 each · Cash only',
  'Bring your family & friends',
  'The real taste of India',
  'Pani puri · Chaat · Vada pav · Dabeli',
  'Crispy. Chatpata. Irresistible.',
]

// Hero ring: cut-out dishes plus three type cards, cycled around the wheel.
export const SHOTS = [
  { img: '/img/cut/chaat.webp', t: 'Chaat', id: 'chaat' },
  { v: 'word', t: 'Crispy', bg: '#ffd23f', fg: '#14210f', sub: 'Golden samosas, spring rolls & fries' },
  { img: '/img/cut/vadapav.webp', t: 'Vada Pav', id: 'vadapav' },
  { img: '/img/cut/samosa.webp', t: 'Samosa', id: 'samosa' },
  { img: '/img/cut/lassi.webp', t: 'Lassi', id: 'lassi' },
  { v: 'word', t: 'Chatpata', bg: '#d8372b', fg: '#fff', sub: 'Tangy, spicy, sweet — all in one bite' },
  { img: '/img/cut/burger.webp', t: 'Burgers', id: 'burgers' },
  { img: '/img/cut/dabeli.webp', t: 'Dabeli', id: 'dabeli' },
  { img: '/img/cut/sandwich.webp', t: 'Sandwiches', id: 'sandwiches' },
  { v: 'word', t: 'Irresistible', bg: '#145c25', fg: '#ffd23f', sub: 'One bite is never enough' },
  { img: '/img/cut/wrap.webp', t: 'Wraps', id: 'wraps' },
  { img: '/img/cut/fries.webp', t: 'Fries', id: 'fries' },
  { img: '/img/cut/springroll.webp', t: 'Spring Roll', id: 'springroll' },
  { img: '/img/cut/chai.webp', t: 'Chai', id: 'chai' },
  { img: '/img/cut/drinks.webp', t: 'Drinks', id: 'drinks' },
]

// Shown on the page and sent to Google as FAQPage data, so keep the two identical by keeping them here.
export const FAQ = [
  ['Where is the Gol Gappa food truck?', "Find us at 144 Cherry Hinton Road, Cambridge CB1 7AJ. We also trade across Cambridge and towns within 20 miles, including Ely, Newmarket, St Ives, Huntingdon, St Neots, Royston, Saffron Walden and Haverhill. Follow @golgappa.uk on Instagram to see where we are today."],
  ['Where can I get pani puri in Cambridge?', 'At Gol Gappa, 144 Cherry Hinton Road, Cambridge CB1 7AJ. We make pani puri, dahi puri and sev puri fresh at the truck window, along with chaat, vada pav and masala chai.'],
  ['What is pani puri (gol gappa)?', 'Crispy, hollow puri shells filled with potato and chickpeas, then dipped in tangy mint and tamarind water. It goes by many names across India: pani puri, gol gappa, puchka and pani ke patashe.'],
  ["What's on the menu?", 'Pani puri and chaat (dahi puri, sev puri, bhel, papdi chaat, samosa chaat), vada pav, dabeli, Bombay sandwiches, aloo tikki burgers, wraps, samosas, spring rolls, fries, lassi, soft drinks and masala chai.'],
  ['Is the food vegetarian?', 'Yes. Everything on our menu is vegetarian.'],
  ['How do I order?', 'Come to the truck window, or call or WhatsApp us on 07405983207.'],
  ['When do you open, and is there a Diwali offer?', 'Our opening day is Sunday 8 November 2026, on Diwali. On Diwali day, pani puri, dahi puri and sev puri are £1.99 each, cash only.'],
  ['Do you cater for allergies?', 'Please tell our staff about any allergies before you order and we will help you choose.'],
]
