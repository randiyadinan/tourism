import type { Tour } from '../types';

export const INITIAL_TOURS: Tour[] = [
  {
    id: 'tour-sri-lanka-highlights',
    slug: 'sri-lanka-classic-highlights',
    title: 'Sri Lanka Grand Highlights & Heritage',
    subtitle: 'Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Galle Fort',
    tagline: 'The definitive 10-day luxury journey across the Pearl of the Indian Ocean.',
    category: 'Cultural & Heritage',
    durationDays: 10,
    durationNights: 9,
    pricePerPerson: 1290,
    originalPrice: 1490,
    discountPercent: 13,
    featured: true,
    published: true,
    rating: 4.96,
    reviewCount: 142,
    difficulty: 'Moderate',
    groupSizeMax: 8,
    startLocation: 'Bandaranaike Intl Airport (CMB)',
    endLocation: 'Colombo / Airport (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Experience the absolute pinnacle of Sri Lanka in pure luxury. Journey from the ancient 5th-century rock citadel of Sigiriya to the sacred Buddhist kingdom of Kandy, through the emerald rolling hills of Nuwara Eliya aboard the scenic blue train, track wild leopards in Yala National Park, and unwind within the cobblestone charm of 17th-century Galle Dutch Fort.',
    highlights: [
      'Climb the UNESCO Sigiriya Lion Rock Citadel and Dambulla Cave Temple',
      'Witness the sacred evening Theva Puja drumming ritual at Kandy Temple of the Tooth',
      'Ride the world-famous blue train through misty tea estates from Nuwara Eliya to Ella',
      'Private 4x4 leopard and wild elephant safari in Yala National Park Block 1',
      'Sunset ramparts walk and boutique heritage stay inside Galle Dutch Fort',
      'Private air-conditioned luxury vehicle and dedicated English-speaking chauffeur-guide throughout'
    ],
    destinations: ['Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Galle'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Journey to the Cultural Triangle',
        destination: 'Sigiriya / Habarana',
        description: 'Warm VIP welcome at Bandaranaike International Airport by your LankaVoyage chauffeur-guide with fresh jasmine garlands. Relax as you drive through rural coconut plantations to your luxury forest resort in the Cultural Triangle.',
        highlights: ['VIP airport meet & greet', 'Scenic drive through rural villages', 'Welcome dinner at eco-luxury resort'],
        mealsIncluded: ['Dinner'],
        accommodation: 'Aliya Resort & Spa / Cinnamon Lodge Habarana (5-Star)',
        driveTime: '3.5 Hours'
      },
      {
        day: 2,
        title: 'Sigiriya Lion Rock & Minneriya Elephant Gathering',
        destination: 'Sigiriya',
        description: 'Morning ascent of the 5th-century Sigiriya Lion Rock before the tropical heat. Admire ancient frescoes and water gardens. In the late afternoon, take a private 4x4 safari in Minneriya to witness wild elephant herds gathering at sunset.',
        highlights: ['Sigiriya summit fortress climb', 'Frescoes & Mirror Wall', 'Minneriya wild elephant safari'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Aliya Resort & Spa / Cinnamon Lodge Habarana',
        optionalActivities: ['Pidurangala sunset hike', 'Hiriwadunna village catamaran tour']
      },
      {
        day: 3,
        title: 'Dambulla Golden Cave Temple & Sacred Kandy',
        destination: 'Kandy',
        description: 'Explore the 2,000-year-old Dambulla Rock Cave Temples adorned with gilded Buddha statues. Drive to the hill capital of Kandy, visiting a Matale spice garden en route. In the evening, attend the sacred Theva ceremony at the Temple of the Tooth Relic.',
        highlights: ['Dambulla UNESCO Cave Temple', 'Matale spice garden sensory tour', 'Temple of the Tooth Relic evening ritual'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Earl’s Regency / The Golden Crown Hotel Kandy (5-Star)',
        driveTime: '2.5 Hours'
      },
      {
        day: 4,
        title: 'Peradeniya Botanical Gardens & Highland Tea Country',
        destination: 'Nuwara Eliya',
        description: 'Walk through Peradeniya Royal Botanical Gardens with rare orchids and majestic royal palm avenues. Ascend through cascading waterfalls (Ramboda Falls) into Nuwara Eliya ("Little England"). Visit a premier tea factory for plucking and tasting.',
        highlights: ['Royal Botanical Gardens Peradeniya', 'Ramboda Falls viewpoint', 'Ceylon single-estate tea factory & tasting'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'The Grand Hotel Nuwara Eliya / Heritance Tea Factory (Heritage Luxury)',
        driveTime: '2.5 Hours'
      },
      {
        day: 5,
        title: 'Scenic Blue Train to Ella & Nine Arches Bridge',
        destination: 'Ella',
        description: 'Board the historic blue train in reserved 1st class observation seats from Nanu Oya to Ella—a journey hailed as one of the world’s most scenic. Check into your mountain-view lodge and visit the iconic Demodara Nine Arches Bridge.',
        highlights: ['Iconic scenic hill country train ride', 'Nine Arches stone railway bridge', 'Sunset over Ella Gap'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: '98 Acres Resort & Spa / EKHO Ella (Luxury Mountain Resort)'
      },
      {
        day: 6,
        title: 'Little Adam’s Peak Hike & Journey to Yala Wildlife',
        destination: 'Yala National Park',
        description: 'Hike Little Adam’s Peak at dawn for 360-degree mountain panoramas. Stop by Ravana Waterfall before descending to the wild southern plains of Yala. Check into your safari glamping camp or coastal resort.',
        highlights: ['Little Adam’s Peak sunrise trek', 'Ravana cascading waterfall', 'Evening sundowners overlooking wilderness'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Cinnamon Wild Yala / Jetwing Yala (5-Star Eco Lodge)',
        driveTime: '3 Hours'
      },
      {
        day: 7,
        title: 'Dawn Leopard Safari in Yala & South Coast',
        destination: 'Galle / Weligama',
        description: 'Embark on an early morning 4x4 game drive through Yala Block 1 tracking leopards, elephants, and sloth bears. Afternoon drive along the scenic south coast, observing traditional stilt fishermen, to the historic fortified city of Galle.',
        highlights: ['Dawn 4x4 leopard game drive', 'Stilt fishermen at Koggala', 'Arrival in UNESCO Galle Fort'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Fort Bazaar / Le Grand Galle by Asia Leisure (5-Star Luxury)',
        driveTime: '2.5 Hours'
      },
      {
        day: 8,
        title: 'Galle Fort Heritage & Sunset Over Indian Ocean',
        destination: 'Galle',
        description: 'Take a guided walking tour of Galle Dutch Fort’s cobblestone alleyways, Dutch Reformed Church, and iconic lighthouse. Enjoy leisure time in chic jewelry and antique boutiques, followed by cocktails on the ramparts.',
        highlights: ['Galle Fort historic rampart walk', 'Galle Lighthouse & colonial mansions', 'Sunset cocktail on fort ramparts'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Fort Bazaar / Le Grand Galle'
      },
      {
        day: 9,
        title: 'Bentota Coastal Bliss & Madu River Mangrove Safari',
        destination: 'Bentota / Colombo',
        description: 'Travel north along the golden coast. Enjoy a boat safari through the mangrove tunnels of the Madu River with a stop at a cinnamon island. Arrive in the vibrant capital of Colombo for a farewell dinner at the historic Galle Face Hotel.',
        highlights: ['Madu River mangrove safari', 'Kosgoda turtle conservation project', 'Galle Face Green oceanfront farewell dinner'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'The Galle Face Hotel / Shangri-La Colombo (5-Star Luxury)'
      },
      {
        day: 10,
        title: 'Colombo City Tour & Departure',
        destination: 'Colombo / Airport',
        description: 'Morning Colombo city discovery including Gangaramaya Temple, Independence Memorial Hall, and Old Dutch Hospital shopping. Chauffeur transfer to Bandaranaike International Airport for your return flight.',
        highlights: ['Colombo city & temple sights', 'Souvenir shopping for Ceylon tea & gems', 'Airport drop-off with fond memories'],
        mealsIncluded: ['Breakfast'],
        accommodation: 'Departure Flight'
      }
    ],
    inclusions: [
      '9 Nights luxury 5-star & heritage boutique hotel accommodations',
      'Daily gourmet buffet breakfasts and fine dining dinners',
      'Private air-conditioned luxury vehicle throughout the tour with unlimited mileage',
      'Dedicated English-speaking professional chauffeur-guide (certified Sri Lanka Tourist Board)',
      'All highway tolls, fuel, vehicle insurance, parking fees, and driver accommodation',
      'Sigiriya Lion Rock Citadel VIP entrance ticket',
      'Dambulla Golden Cave Temple entrance ticket',
      'Kandy Temple of the Tooth Relic VIP entry',
      'Minneriya National Park 4x4 safari with private jeep and tracker',
      'Yala National Park Block 1 4x4 game drive with tracker',
      'Reserved 1st class scenic blue train tickets (Nanu Oya to Ella)',
      'Madu River mangrove boat safari',
      'Tea factory tour and single-estate Ceylon tea tasting masterclass',
      'Complimentary chilled bottled water, wet towels, and fresh king coconuts during travel',
      'All local government taxes, service charges, and 24/7 concierge support'
    ],
    exclusions: [
      'International roundtrip flights',
      'Sri Lanka ETA Tourist Visa ($50 online)',
      'Lunches (except where specified)',
      'Alcoholic beverages and personal expenses',
      'Optional activities and tips for driver/guide'
    ],
    accommodationType: '5-Star Luxury Resorts & Heritage Boutique Hotels',
    transportType: 'Private Luxury Sedan / High-Roof Van with Air Conditioning & Wi-Fi',
    importantInfo: [
      'Modest attire covering shoulders and knees is strictly mandatory when visiting Buddhist and Hindu temples.',
      'Train ticket issuance is subject to Sri Lanka Railway department allocations; LankaVoyage guarantees 1st or 2nd class reserved seats.',
      'Safari jeep seating is strictly private for your party.'
    ],
    faqs: [
      {
        question: 'Can we customize the stops or add extra nights?',
        answer: 'Absolutely. Every LankaVoyage tour can be tailored. You can add nights in Galle, upgrade to private helicopter transfers, or adjust the pace using our Custom Tour Builder.'
      },
      {
        question: 'Are national park permits and jeep fees included in the price?',
        answer: 'Yes, all national park entry tickets, private 4x4 jeeps, and tracker fees for Minneriya and Yala are 100% included in the displayed price.'
      },
      {
        question: 'What is the dress code for religious temples?',
        answer: 'White or light-colored attire is respectful. Shoulders and knees must be fully covered, and shoes/hats must be removed before entering temple courtyards.'
      }
    ]
  },
  {
    id: 'tour-cultural-triangle',
    slug: 'cultural-triangle-sacred-realms',
    title: 'Cultural Triangle & Sacred Kingdoms',
    subtitle: 'Anuradhapura, Polonnaruwa, Sigiriya, Dambulla & Kandy',
    tagline: 'Immerse in 2,500 years of ancient hydraulic civilisations, sacred relics, and golden cave temples.',
    category: 'Cultural & Heritage',
    durationDays: 6,
    durationNights: 5,
    pricePerPerson: 820,
    originalPrice: 950,
    discountPercent: 14,
    featured: true,
    published: true,
    rating: 4.93,
    reviewCount: 98,
    difficulty: 'Moderate',
    groupSizeMax: 10,
    startLocation: 'Colombo (CMB)',
    endLocation: 'Colombo (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Walk in the footsteps of ancient Sinhalese monarchs across the UNESCO Cultural Triangle. Marvel at the colossal white stupas of Anuradhapura, the medieval ruins of Polonnaruwa, the sky fortress of Sigiriya, the cave paintings of Dambulla, and the Temple of the Tooth in Kandy.',
    highlights: [
      'The sacred Jaya Sri Maha Bodhi tree in Anuradhapura (oldest recorded human-planted tree on earth)',
      'Sigiriya 5th-century Lion Rock fortress climb',
      'Bicycle tour through medieval royal stone palaces of Polonnaruwa',
      'Dambulla golden cave temples and reclining Buddha statues',
      'Kandyan traditional dance performance and Tooth Relic puja'
    ],
    destinations: ['Sigiriya', 'Kandy'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Transfer to Anuradhapura Ancient City',
        destination: 'Anuradhapura',
        description: 'Airport welcome and transfer to Sri Lanka’s first ancient kingdom. Visit the sacred Ruwanwelisaya Great Stupa and Jaya Sri Maha Bodhi.',
        highlights: ['Ruwanwelisaya Great Stupa', 'Jaya Sri Maha Bodhi tree'],
        mealsIncluded: ['Dinner'],
        accommodation: 'Ulagalla by Uga Escapes / Forest Rock Garden (5-Star Heritage Luxury)'
      },
      {
        day: 2,
        title: 'Polonnaruwa Medieval Kingdom by Bicycle & Minneriya',
        destination: 'Polonnaruwa / Sigiriya',
        description: 'Cycle among the 12th-century stone ruins of Polonnaruwa, including the Gal Vihara rock statues. Late afternoon elephant safari at Minneriya.',
        highlights: ['Gal Vihara granite rock Buddha statues', 'Royal Palace of King Parakramabahu', 'Minneriya elephant safari'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Aliya Resort & Spa Sigiriya'
      },
      {
        day: 3,
        title: 'Sigiriya Lion Citadel & Pidurangala Sunrise',
        destination: 'Sigiriya',
        description: 'Sunrise photography at Pidurangala rock followed by ascending Sigiriya Lion Rock Fortress. Afternoon relaxing Ayurvedic massage.',
        highlights: ['Sigiriya fortress climb', 'Pidurangala panoramic view', 'Ayurvedic head & shoulder therapy'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Aliya Resort & Spa Sigiriya'
      },
      {
        day: 4,
        title: 'Dambulla Cave Temples & Matale Spices to Kandy',
        destination: 'Kandy',
        description: 'Tour the five cavern sanctuaries of Dambulla, explore a Matale spice farm, and reach Kandy. Witness a traditional Kandyan cultural fire dance.',
        highlights: ['Dambulla Cave Temples', 'Kandyan fire-dancing ceremony'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'The Golden Crown Hotel Kandy'
      },
      {
        day: 5,
        title: 'Temple of the Tooth & Peradeniya Royal Gardens',
        destination: 'Kandy',
        description: 'Morning veneration at Sri Dalada Maligawa. Afternoon stroll through the world-famous Peradeniya Royal Botanical Gardens.',
        highlights: ['Temple of the Tooth Relic', 'Royal Botanical Gardens'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'The Golden Crown Hotel Kandy'
      },
      {
        day: 6,
        title: 'Pinnawala Elephant Sanctuary & Departure',
        destination: 'Colombo Airport',
        description: 'Visit the Pinnawala Elephant orphanage or Millennium Elephant Foundation before airport drop-off for your flight home.',
        highlights: ['Elephant bathing in the river', 'Colombo airport drop-off'],
        mealsIncluded: ['Breakfast'],
        accommodation: 'Departure'
      }
    ],
    inclusions: [
      '5 Nights in 5-star heritage hotels',
      'Daily breakfast and dinner',
      'Private air-conditioned transport with chauffeur-guide',
      'All UNESCO site entrance fees (Anuradhapura, Polonnaruwa, Sigiriya, Dambulla, Kandy)',
      'Minneriya National Park safari jeep',
      'Kandyan dance cultural performance tickets'
    ],
    exclusions: ['International flights', 'Lunch meals', 'Gratuities'],
    accommodationType: '5-Star Luxury & Heritage Eco-Resorts',
    transportType: 'Private Air-Conditioned Luxury Vehicle',
    importantInfo: ['Dress modestly for all ancient ruins and active religious temples.'],
    faqs: [
      { question: 'Is cycling in Polonnaruwa suitable for children?', answer: 'Yes, the paths are completely flat and shaded with minimal traffic.' }
    ]
  },
  {
    id: 'tour-ella-hill-country',
    slug: 'ella-hill-country-nature-escape',
    title: 'Ella & Highland Misty Tea Escapes',
    subtitle: 'Nuwara Eliya, Horton Plains, Ella & Little Adam’s Peak',
    tagline: 'Crisp mountain air, world-famous train journeys, cascading waterfalls, and luxury tea bungalows.',
    category: 'Hill Country & Nature',
    durationDays: 5,
    durationNights: 4,
    pricePerPerson: 740,
    originalPrice: 850,
    discountPercent: 13,
    featured: true,
    published: true,
    rating: 4.95,
    reviewCount: 112,
    difficulty: 'Moderate',
    groupSizeMax: 8,
    startLocation: 'Kandy / Colombo (CMB)',
    endLocation: 'Colombo / South Coast',
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Escape into the cool highlands of Sri Lanka. Hike along misty ridges, stay in restored 19th-century colonial tea planters’ bungalows, ride the legendary blue locomotive over the Nine Arches Bridge, and stand on the brink of World’s End cliff.',
    highlights: [
      'Ride the scenic blue train in 1st class from Nanu Oya to Ella',
      'Horton Plains National Park & World’s End 880m sheer cliff hike',
      'Demodara Nine Arches Bridge & Little Adam’s Peak sunrise trek',
      'Single-estate Ceylon tea masterclass and high tea at The Grand Hotel'
    ],
    destinations: ['Nuwara Eliya', 'Ella'],
    itinerary: [
      {
        day: 1,
        title: 'Ascend to Nuwara Eliya via Ramboda Falls',
        destination: 'Nuwara Eliya',
        description: 'Drive up winding mountain passes passing tea pluckers and waterfalls to Nuwara Eliya. High tea at The Grand Hotel.',
        highlights: ['Ramboda Falls', 'Colonial architecture', 'High Tea at The Grand Hotel'],
        mealsIncluded: ['Dinner'],
        accommodation: 'Heritance Tea Factory / The Grand Hotel'
      },
      {
        day: 2,
        title: 'Horton Plains & World’s End Sunrise Hike',
        destination: 'Nuwara Eliya',
        description: 'Early morning expedition to Horton Plains plateau. Hike to World’s End precipice and Baker’s Falls.',
        highlights: ['World’s End cliff view', 'Baker’s Falls', 'Montane cloud forest'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Heritance Tea Factory'
      },
      {
        day: 3,
        title: 'Scenic Blue Train Ride to Ella',
        destination: 'Ella',
        description: 'Board the iconic blue train through emerald valleys and tunnels to Ella. Visit the Demodara Nine Arches Bridge.',
        highlights: ['Reserved scenic train ride', 'Nine Arches Bridge'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: '98 Acres Resort & Spa Ella'
      },
      {
        day: 4,
        title: 'Little Adam’s Peak & Ravana Falls',
        destination: 'Ella',
        description: 'Sunrise trek up Little Adam’s Peak followed by Ravana Falls and Flying Ravana Mega Zipline adventure.',
        highlights: ['Little Adam’s Peak', 'Ravana Falls & Zipline'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: '98 Acres Resort & Spa Ella'
      },
      {
        day: 5,
        title: 'Highland Descent to Coast or Airport',
        destination: 'Colombo / Galle',
        description: 'Descend through Southern waterfalls to your next coastal destination or Colombo International Airport.',
        highlights: ['Scenic mountain road descent', 'Drop-off'],
        mealsIncluded: ['Breakfast'],
        accommodation: 'Departure'
      }
    ],
    inclusions: [
      '4 Nights boutique highland resort accommodation',
      'Daily breakfast and dinner',
      'Private air-conditioned transportation',
      'Reserved 1st class scenic train ticket',
      'Horton Plains entrance & 4x4 transfer',
      'Ceylon tea factory masterclass'
    ],
    exclusions: ['International airfare', 'Personal purchases'],
    accommodationType: 'Boutique Tea Bungalows & 5-Star Eco Resorts',
    transportType: 'Private Luxury Vehicle + Scenic Railway',
    importantInfo: ['Bring warm fleeces and comfortable walking boots for early mornings.'],
    faqs: [{ question: 'What is the temperature in Nuwara Eliya?', answer: 'Night temperatures can dip to 10°C - 14°C, making warm layers essential.' }]
  },
  {
    id: 'tour-wildlife-safari',
    slug: 'wildlife-safari-predators-giants',
    title: 'Wild Sri Lanka: Leopards, Whales & Elephants',
    subtitle: 'Yala, Udawalawe, Minneriya & Mirissa Marine Safari',
    tagline: 'The ultimate big-game wildlife safari in Asia across land and ocean.',
    category: 'Wildlife & Safari',
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 1050,
    originalPrice: 1200,
    discountPercent: 12,
    featured: true,
    published: true,
    rating: 4.98,
    reviewCount: 165,
    difficulty: 'Easy',
    groupSizeMax: 6,
    startLocation: 'Colombo (CMB)',
    endLocation: 'Colombo (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Sri Lanka is often called the "African Safari of Asia". Experience the world’s highest leopard density in Yala, observe orphaned elephant rehabilitation in Udawalawe, witness massive wild elephant herds in Minneriya, and cruise alongside colossal Blue Whales in the deep Indian Ocean.',
    highlights: [
      'Two private 4x4 game drives in Yala National Park Block 1 with expert naturalists',
      'VIP Catamaran Blue Whale & Dolphin expedition in Mirissa',
      'Udawalawe Elephant Transit Home milk-feeding observation',
      'Minneriya elephant gathering at sunset',
      'Luxury glamping under starlit wilderness skies'
    ],
    destinations: ['Yala', 'Mirissa', 'Sigiriya'],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Minneriya Elephant Safari',
        destination: 'Sigiriya / Habarana',
        description: 'Airport arrival and transfer to Habarana. Evening 4x4 safari watching wild elephants around Minneriya tank.',
        highlights: ['Minneriya elephant gathering safari'],
        mealsIncluded: ['Dinner'],
        accommodation: 'Cinnamon Lodge Habarana'
      },
      {
        day: 2,
        title: 'Sigiriya Rock & Udawalawe National Park',
        destination: 'Udawalawe',
        description: 'Morning climb of Sigiriya Lion Rock, then travel south to the savanna grasslands of Udawalawe.',
        highlights: ['Sigiriya Lion Rock', 'Udawalawe savanna landscapes'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Grand Udawalawe Safari Resort'
      },
      {
        day: 3,
        title: 'Elephant Transit Home & Yala National Park',
        destination: 'Yala',
        description: 'Visit the Born Free-supported Elephant Transit Home to watch feeding of rescued calves. Arrive in Yala for evening sundowners.',
        highlights: ['Udawalawe Elephant Transit Home', 'Yala safari camp check-in'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Cinnamon Wild Yala / Kulu Safaris Glamping'
      },
      {
        day: 4,
        title: 'Dawn & Dusk Dual Leopard Safaris in Yala',
        destination: 'Yala',
        description: 'Full-day wildlife immersion with dawn and afternoon 4x4 game drives tracking leopards, sloth bears, and mugger crocodiles.',
        highlights: ['Sri Lankan Leopard tracking', 'Sloth bear and bird watching', 'Bush breakfast'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Cinnamon Wild Yala'
      },
      {
        day: 5,
        title: 'Mirissa Coast & Sunset Coconut Tree Hill',
        destination: 'Mirissa',
        description: 'Drive along the south coast to Mirissa. Evening walk up Coconut Tree Hill for sunset over the ocean.',
        highlights: ['Coconut Tree Hill', 'Seafood dinner on the beach'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Sri Sharavi Beach Villas & Spa / Weligama Bay Resort'
      },
      {
        day: 6,
        title: 'VIP Blue Whale & Dolphin Catamaran Safari',
        destination: 'Mirissa',
        description: 'Morning luxury catamaran cruise into the Indian Ocean to observe Blue Whales and spinner dolphins with marine biologists.',
        highlights: ['Blue Whale encounter', 'Dolphin pod watching'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Sri Sharavi Beach Villas & Spa'
      },
      {
        day: 7,
        title: 'Galle Fort Stroll & Airport Departure',
        destination: 'Colombo Airport',
        description: 'Morning stroll around Galle Dutch Fort before private express highway transfer to Colombo Airport.',
        highlights: ['Galle Fort', 'Airport drop-off'],
        mealsIncluded: ['Breakfast'],
        accommodation: 'Departure'
      }
    ],
    inclusions: [
      '6 Nights in luxury safari lodges and beachfront resorts',
      'All meals on safari days (Breakfast, Lunch, Dinner in Yala)',
      'Private 4x4 safari jeeps with veteran naturalist guides for 3 national parks',
      'All National Park entrance fees and conservation levies',
      'VIP Whale Watching Catamaran cruise ticket',
      'Private transport throughout in AC luxury van'
    ],
    exclusions: ['International flights', 'Gratuities for safari trackers'],
    accommodationType: 'Luxury Safari Glamping & 5-Star Beach Resorts',
    transportType: 'Private Luxury Vehicle + 4x4 Safari Jeeps',
    importantInfo: ['Our whale watching partners adhere strictly to ethical distance regulations.'],
    faqs: [{ question: 'What is the best time for Blue Whales in Mirissa?', answer: 'November through April offers the calmest seas and highest sighting probability (95%+).' }]
  },
  {
    id: 'tour-luxury-honeymoon',
    slug: 'romantic-luxury-sri-lanka-honeymoon',
    title: 'Enchanted Ceylon: Luxury & Honeymoon Romance',
    subtitle: 'Private Pool Villas, Tea Bungalows, Seaplane & Beachfront Dinners',
    tagline: 'An unforgettable romantic sanctuary designed for couples seeking ultra-luxury, seclusion, and pure indulgence.',
    category: 'Luxury & Honeymoon',
    durationDays: 8,
    durationNights: 7,
    pricePerPerson: 1680,
    originalPrice: 1950,
    discountPercent: 14,
    featured: true,
    published: true,
    rating: 4.99,
    reviewCount: 88,
    difficulty: 'Easy',
    groupSizeMax: 2,
    startLocation: 'Colombo (CMB)',
    endLocation: 'Colombo (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Celebrate your love amidst Ceylon’s most breathtaking landscapes. Indulge in private plunge pool villas at Ulagalla, scenic helicopter or seaplane transfers, colonial elegance at Ceylon Tea Trails, candlelight beach dinners in Bentota, and couples Ayurvedic spa rituals.',
    highlights: [
      'Private plunge pool villa stays at Uga Ulagalla and Cape Weligama',
      'Couples’ 90-minute Royal Ayurvedic Shirodhara massage session',
      'Candlelight 5-course lobster dinner on a secluded private beach',
      'Private high tea in rolling tea hills of Nuwara Eliya',
      'Chilled champagne & tropical fruit welcome in every suite'
    ],
    destinations: ['Sigiriya', 'Nuwara Eliya', 'Bentota', 'Galle'],
    itinerary: [
      {
        day: 1,
        title: 'VIP Arrival & Luxury Estate Sanctuary',
        destination: 'Sigiriya / Anuradhapura',
        description: 'Chauffeured in a luxury Mercedes/BMW sedan to your 20-acre private pool villa at Uga Ulagalla. Enjoy champagne and an evening horseback ride.',
        highlights: ['Private pool villa check-in', 'Champagne welcome', 'Estate horseback ride'],
        mealsIncluded: ['Dinner'],
        accommodation: 'Uga Ulagalla Resort (Ultra Luxury Pool Villa)'
      },
      {
        day: 2,
        title: 'Sigiriya Sunrise & Private Treehouse Champagne Dinner',
        destination: 'Sigiriya',
        description: 'Private guided climb of Sigiriya Lion Rock at first light. Afternoon couples spa treatment followed by an exclusive dinner served atop a treehouse overlooking rice fields.',
        highlights: ['Sigiriya VIP sunrise tour', 'Couples massage', 'Private romantic treehouse dining'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Uga Ulagalla Resort'
      },
      {
        day: 3,
        title: 'Scenic Highlands & Ceylon Tea Planter Villa',
        destination: 'Hatton / Nuwara Eliya',
        description: 'Drive through misty valleys to a restored colonial tea planter bungalow at Ceylon Tea Trails. Enjoy afternoon cream tea on the manicured lawn.',
        highlights: ['Ceylon Tea Trails', 'Colonial butler service', 'Lawn croquet & afternoon tea'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Ceylon Tea Trails / Heritance Tea Factory'
      },
      {
        day: 4,
        title: 'Tea Masterclass & Castlereagh Reservoir Boat Cruise',
        destination: 'Highland Lakes',
        description: 'Guided tour of high-grown tea estates and a private wooden boat cruise across the misty waters of Castlereagh lake.',
        highlights: ['Castlereagh private boat ride', 'Private tea sommelier tasting'],
        mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Ceylon Tea Trails'
      },
      {
        day: 5,
        title: 'Clifftop Ocean Sanctuary in Weligama / Galle',
        destination: 'Weligama / Galle',
        description: 'Descend to Cape Weligama perched 40 meters above the Indian Ocean. Relax in the 60-meter crescent infinity pool.',
        highlights: ['Cape Weligama ocean villa', 'Infinity pool sunset view'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Cape Weligama / Fort Bazaar (Ultra Luxury)'
      },
      {
        day: 6,
        title: 'Private Catamaran Sunset Cruise & Galle Fort',
        destination: 'Galle',
        description: 'Private walking tour of historic Galle Fort cobblestone avenues, followed by a private sunset catamaran cruise with canapés and wine.',
        highlights: ['Galle Fort historic tour', 'Private sunset yacht cruise with wine'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Cape Weligama'
      },
      {
        day: 7,
        title: 'Private Beach Candlelight Lobster Dinner',
        destination: 'Bentota / South Coast',
        description: 'Day of leisure in your private ocean cabana. As night falls, enjoy an intimate table set in the sand illuminated by 100 torches with fresh grilled lobster.',
        highlights: ['Couples beach cabana', '100-torch candlelight lobster dinner'],
        mealsIncluded: ['Breakfast', 'Dinner'],
        accommodation: 'Cape Weligama / Saman Villas Bentota'
      },
      {
        day: 8,
        title: 'Fond Farewells & Airport VIP Lounge',
        destination: 'Colombo Airport',
        description: 'Private transfer along the expressway to Colombo Airport with Silk Route VIP lounge access prior to departure.',
        highlights: ['Silk Route VIP airport service', 'Farewell gift package'],
        mealsIncluded: ['Breakfast'],
        accommodation: 'Departure'
      }
    ],
    inclusions: [
      '7 Nights in ultra-luxury private pool villas and boutique suites',
      'All gourmet meals (Full board at Tea Trails, Half board at beach resorts)',
      'Bottle of French Champagne & welcome treats at every hotel',
      'Private 100-torch beachfront lobster dinner for two',
      'Couples 90-minute Ayurvedic spa ritual',
      'Private luxury vehicle with dedicated chauffeur-host',
      'Silk Route VIP airport check-in assistance'
    ],
    exclusions: ['International flights'],
    accommodationType: 'Ultra-Luxury Private Pool Villas & Relais & Châteaux Properties',
    transportType: 'Private Mercedes Sedan / Luxury Prado SUV',
    importantInfo: ['Special honeymoon amenities require marriage certificate within 12 months for select hotel bonuses.'],
    faqs: [{ question: 'Can we arrange a private helicopter transfer?', answer: 'Yes, we can arrange Cinnamon Air seaplane or private helicopter charters on request.' }]
  },
  {
    id: 'tour-south-coast-beach',
    slug: 'south-coast-sun-surf-culture',
    title: 'South Coast Sun, Surf & Tropical Bliss',
    subtitle: 'Bentota, Galle Fort, Mirissa, Tangalle & Hiriketiya',
    tagline: 'Golden sands, peeling surf breaks, colonial ramparts, and seaside coconut groves.',
    category: 'Beach & Coastal',
    durationDays: 7,
    durationNights: 6,
    pricePerPerson: 790,
    originalPrice: 890,
    discountPercent: 11,
    featured: false,
    published: true,
    rating: 4.90,
    reviewCount: 92,
    difficulty: 'Easy',
    groupSizeMax: 12,
    startLocation: 'Colombo (CMB)',
    endLocation: 'Colombo (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Unwind along the sun-drenched southern coastline of Sri Lanka. From the tranquil mangrove lagoons of Bentota to the UNESCO fortifications of Galle, the bohemian surf coves of Hiriketiya, and the whale-watching waters of Mirissa.',
    highlights: [
      'Madu River mangrove safari & turtle conservation center',
      'Galle Dutch Fort walking tour and ramparts sunset',
      'Blue Whale watching cruise in Mirissa',
      'Surf coaching session in gentle Weligama Bay'
    ],
    destinations: ['Bentota', 'Galle', 'Mirissa'],
    itinerary: [
      { day: 1, title: 'Arrival & Bentota Golden Beach', destination: 'Bentota', description: 'Transfer to Bentota beachfront luxury resort.', highlights: ['Beach check-in'], mealsIncluded: ['Dinner'], accommodation: 'Cinnamon Bentota Beach' },
      { day: 2, title: 'Madu River Mangroves & Sea Turtle Hatchery', destination: 'Bentota', description: 'Boat safari through mangrove lagoons and visit Kosgoda turtle hatchery.', highlights: ['Madu River safari', 'Sea turtle release'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Cinnamon Bentota Beach' },
      { day: 3, title: 'Galle Dutch Fort Heritage Discovery', destination: 'Galle', description: 'Explore Galle Fort, boutique shopping, and lighthouse sunset.', highlights: ['Galle Fort', 'Lighthouse walk'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Le Grand Galle' },
      { day: 4, title: 'Mirissa Blue Whale Cruise & Coconut Tree Hill', destination: 'Mirissa', description: 'Morning ocean cruise for Blue Whales. Evening at Coconut Tree Hill.', highlights: ['Whale watching', 'Coconut Tree Hill'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Weligama Bay Marriott Resort' },
      { day: 5, title: 'Weligama Surf Lesson & Beach Club Evening', destination: 'Mirissa', description: 'Morning surf coaching followed by relaxation at coastal beach clubs.', highlights: ['Surf lesson', 'Seafood BBQ'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Weligama Bay Marriott Resort' },
      { day: 6, title: 'Hiriketiya Horseshoe Bay Leisure Day', destination: 'Tangalle / Hiriketiya', description: 'Spend the day in the stunning horseshoe bay of Hiriketiya.', highlights: ['Hiriketiya bay relaxation'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Weligama Bay Marriott Resort' },
      { day: 7, title: 'Colombo Highway Transfer & Departure', destination: 'Colombo Airport', description: 'Expressway transfer to airport for your flight home.', highlights: ['Airport transfer'], mealsIncluded: ['Breakfast'], accommodation: 'Departure' }
    ],
    inclusions: ['6 Nights 5-star beachfront resorts', 'Daily breakfast & dinner', 'Private AC vehicle', 'Whale watching ticket', 'Madu River boat safari'],
    exclusions: ['International flights', 'Lunch meals'],
    accommodationType: '5-Star Beach Resorts',
    transportType: 'Private AC Van / Sedan',
    importantInfo: ['Best seas November to April on the South Coast.'],
    faqs: [{ question: 'Is this tour family-friendly?', answer: 'Extremely family-friendly with calm swimming pools, gentle waves, and turtle hatcheries.' }]
  },
  {
    id: 'tour-active-adventure',
    slug: 'active-adventure-trekking-whitewater',
    title: 'Pure Adrenaline: Peaks, Rapids & Wilderness',
    subtitle: 'Kitulgala White Water, Knuckles Range, Ella Zipline & Yala Safari',
    tagline: 'White water rafting, canyoning, mountain summits, and wild leopard tracking for intrepid explorers.',
    category: 'Active Adventure',
    durationDays: 8,
    durationNights: 7,
    pricePerPerson: 960,
    originalPrice: 1100,
    discountPercent: 12,
    featured: false,
    published: true,
    rating: 4.94,
    reviewCount: 76,
    difficulty: 'Challenging',
    groupSizeMax: 8,
    startLocation: 'Colombo (CMB)',
    endLocation: 'Colombo (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'An action-packed adventure designed for thrill-seekers. Conquer Grade 3 & 4 rapids on the Kelani River in Kitulgala, trek the mist-wrapped trails of the UNESCO Knuckles Mountain Range, fly over tea hills on the Flying Ravana Zipline, and safari deep into Yala.',
    highlights: [
      'Kitulgala white water rafting and waterfall canyoning jumps',
      'Knuckles Mountain Range cloud forest trek and hidden waterfalls',
      'Flying Ravana mega zipline and Little Adam’s Peak trail in Ella',
      'Yala National Park 4x4 leopard game drive'
    ],
    destinations: ['Kandy', 'Ella', 'Yala'],
    itinerary: [
      { day: 1, title: 'Arrival & Kitulgala White Water Rafting', destination: 'Kitulgala', description: 'Raft Grade 3 rapids on the Kelani River where Bridge on the River Kwai was filmed.', highlights: ['White water rafting', 'Waterfall abseiling'], mealsIncluded: ['Dinner'], accommodation: 'Palmstone Retreat Kitulgala' },
      { day: 2, title: 'Kitulgala Rainforest Trekking & Kandy', destination: 'Kandy', description: 'Morning rainforest trek to natural rock pools, then drive to Kandy.', highlights: ['Natural rock slides', 'Kandy arrival'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'The Grand Kandyan' },
      { day: 3, title: 'Knuckles Mountain Range Trek', destination: 'Knuckles', description: 'Guided 14km hike through UNESCO Knuckles cloud forests and crystal streams.', highlights: ['Knuckles peaks', 'Hidden waterfalls'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Knuckles Wild Glamping' },
      { day: 4, title: 'Highland Scenic Train to Ella', destination: 'Ella', description: 'Board the scenic mountain train to Ella.', highlights: ['Scenic train', 'Nine Arches Bridge'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'EKHO Ella' },
      { day: 5, title: 'Flying Ravana Zipline & Ella Rock Trek', destination: 'Ella', description: 'Hike to the summit of Ella Rock and experience South Asia’s fastest mega zipline.', highlights: ['Ella Rock summit', 'Mega zipline'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'EKHO Ella' },
      { day: 6, title: 'Yala National Park Leopard Safari', destination: 'Yala', description: 'Descend to Yala for a sunset 4x4 leopard safari.', highlights: ['Yala leopard safari'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Jetwing Yala' },
      { day: 7, title: 'South Coast Surf Coaching & Weligama', destination: 'Weligama', description: 'Surf coaching session and seaside barbecue.', highlights: ['Surf coaching', 'Beach sunset'], mealsIncluded: ['Breakfast', 'Dinner'], accommodation: 'Weligama Bay Resort' },
      { day: 8, title: 'Departure to Airport', destination: 'Colombo Airport', description: 'Express transfer to airport.', highlights: ['Departure'], mealsIncluded: ['Breakfast'], accommodation: 'Departure' }
    ],
    inclusions: ['7 Nights accommodation', 'All adventure gear, rafting permits, and certified guides', 'Knuckles trek permit', 'Yala safari jeep', 'AC transport'],
    exclusions: ['International airfare'],
    accommodationType: 'Adventure Eco-Lodges & 4-Star Resorts',
    transportType: 'Private 4x4 & Luxury AC Van',
    importantInfo: ['Requires good baseline fitness for Knuckles and Ella Rock treks.'],
    faqs: [{ question: 'Is white water rafting safe in Kitulgala?', answer: 'Yes, international safety standards, life vests, and certified river guides are provided.' }]
  },
  {
    id: 'tour-ayurveda-wellness',
    slug: 'ayurveda-panchakarma-wellness-retreat',
    title: 'Serenity Ceylon: 8-Day Authentic Ayurvedic Sanctuary',
    subtitle: 'Bentota, Kandy & Central Herbal Gardens',
    tagline: 'Restore harmony to mind, body, and spirit with doctor-guided ancient herbal therapies, yoga, and organic nutrition.',
    category: 'Ayurveda & Wellness',
    durationDays: 8,
    durationNights: 7,
    pricePerPerson: 1350,
    originalPrice: 1550,
    discountPercent: 13,
    featured: false,
    published: true,
    rating: 4.96,
    reviewCount: 64,
    difficulty: 'Easy',
    groupSizeMax: 4,
    startLocation: 'Colombo (CMB)',
    endLocation: 'Colombo (CMB)',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    overview: 'Immerse yourself in 3,000-year-old healing traditions. Under the care of Ayurvedic physicians (Vaidyas), receive daily personalized treatments, Shirodhara forehead oil therapy, herbal steam baths, sunrise yoga sessions, and farm-to-table organic Ayurvedic cuisine.',
    highlights: [
      'Daily personal consultation with certified Ayurvedic doctor',
      '2.5 hours of daily customized herbal treatments (Abhyanga, Shirodhara, Pinda Sweda)',
      'Daily sunrise and sunset yoga & mindfulness meditation classes',
      'Nutritious 3-course Ayurvedic tri-dosha balancing meals'
    ],
    destinations: ['Bentota', 'Kandy'],
    itinerary: [
      { day: 1, title: 'Arrival & Ayurvedic Doctor Consultation', destination: 'Bentota / Wadduwa', description: 'Arrive at the oceanfront wellness sanctuary. Meet your Ayurvedic physician for pulse diagnosis and constitution profiling.', highlights: ['Pulse diagnosis', 'Custom treatment program creation'], mealsIncluded: ['Dinner'], accommodation: 'Siddhalepa Ayurveda Health Resort / Heritance Maha Gedara' },
      { day: 2, title: 'Full Body Abhyanga & Herbal Steam Detox', destination: 'Bentota', description: 'Morning yoga followed by synchronized four-hand herbal oil massage and herbal steam bath.', highlights: ['Sunrise yoga', 'Abhyanga massage'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Heritance Maha Gedara' },
      { day: 3, title: 'Shirodhara Mind Calming Therapy', destination: 'Bentota', description: 'Experience the blissful Shirodhara treatment with a steady stream of medicated warm oil to the forehead.', highlights: ['Shirodhara therapy', 'Ayurvedic nutrition workshop'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Heritance Maha Gedara' },
      { day: 4, title: 'Herbal Garden Walk & Medicine Preparation', destination: 'Bentota', description: 'Tour the resort’s organic medicinal herb gardens and learn how herbal concoctions are brewed.', highlights: ['Herbal garden tour', 'Meditation session'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Heritance Maha Gedara' },
      { day: 5, title: 'Pinda Sweda Herbal Compress Therapy', destination: 'Bentota', description: 'Warm herbal poultice massage to relieve muscular tension and joint vitality.', highlights: ['Pinda Sweda', 'Beach yoga at sunset'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Heritance Maha Gedara' },
      { day: 6, title: 'Spiritual Excursion to Kandy Temple & Herbal Spices', destination: 'Kandy', description: 'Day excursion to the sacred Temple of the Tooth and Matale organic spice farm.', highlights: ['Temple of the Tooth', 'Organic spice sanctuary'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Heritance Maha Gedara' },
      { day: 7, title: 'Flower Bath Blessing & Rejuvenation Wrap', destination: 'Bentota', description: 'Traditional aromatic herbal flower bath ritual and farewell wellness consultation with your doctor.', highlights: ['Floral blessing bath', 'Home care wellness plan'], mealsIncluded: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Heritance Maha Gedara' },
      { day: 8, title: 'Refreshed Departure', destination: 'Colombo Airport', description: 'Private transfer to Colombo Airport with lasting vitality and inner peace.', highlights: ['Airport transfer'], mealsIncluded: ['Breakfast'], accommodation: 'Departure' }
    ],
    inclusions: ['7 Nights in Ayurvedic wellness resort', 'All organic Ayurvedic meals (Full Board)', 'Daily 2.5 hours of doctor-prescribed treatments', 'Daily yoga & meditation', 'All herbal medicines during stay'],
    exclusions: ['International airfare'],
    accommodationType: 'Specialist Luxury Ayurveda Sanctuary',
    transportType: 'Private Luxury AC Sedan',
    importantInfo: ['Alcohol and smoking are not permitted in Ayurvedic sanctuaries to support body detoxification.'],
    faqs: [{ question: 'What is Shirodhara?', answer: 'A profound relaxation technique where warm herbalized oil is continuously poured over the forehead center.' }]
  }
];
