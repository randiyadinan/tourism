import type { Destination } from '../types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest-sigiriya',
    slug: 'sigiriya',
    name: 'Sigiriya',
    sinhalaName: 'සීගිරිය',
    province: 'Central Province',
    tagline: 'The Ancient Lion Rock Fortress & 8th Wonder',
    shortDescription: 'Marvel at King Kashyapa’s 5th-century palace citadel rising 200 meters above emerald jungle canopies.',
    overview: 'Sigiriya is a breathtaking UNESCO World Heritage site and an ancient masterpiece of architecture, urban planning, hydraulic engineering, and fresco artistry. Crowned by a fortress atop a colossal sheer monolith, Sigiriya captures the imagination with its water gardens, mirror wall inscriptions, and the legendary lion paw gate.',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'November to April (Dry & sunny)',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 180,
    rating: 4.95,
    reviewCount: 428,
    popularActivities: ['Sigiriya Rock Fortress Climb', 'Pidurangala Sunrise Hike', 'Minneriya Elephant Gathering Safari', 'Hiriwadunna Village Tour'],
    attractions: [
      {
        name: 'Sigiriya Lion Rock Citadel',
        description: 'Ascend through ancient landscaped water gardens and sky-high staircases flanked by colossal lion paws.',
        image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$36 per person'
      },
      {
        name: 'Pidurangala Rock',
        description: 'Climb this nearby rock formation before dawn for panoramic sunrise views of Sigiriya Lion Rock emerging from morning mist.',
        image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$3 per person'
      },
      {
        name: 'Dambulla Golden Cave Temple',
        description: 'Just 25 minutes away, discover five sacred caves housing over 150 Buddha statues with ancient mural-adorned ceilings.',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$10 per person'
      }
    ],
    coordinates: { lat: 7.9570, lng: 80.7603 },
    climate: { temperature: '26°C - 32°C', rainfall: 'Moderate (Monsoon in Oct-Dec)' },
    featured: true
  },
  {
    id: 'dest-ella',
    slug: 'ella',
    name: 'Ella',
    sinhalaName: 'ඇල්ල',
    province: 'Uva Province',
    tagline: 'Misty Peaks, Tea Hills & The Nine Arches Bridge',
    shortDescription: 'A serene mountain enclave famed for pine forests, dramatic ravines, tea estates, and iconic colonial railway bridges.',
    overview: 'Nestled deep in the central highlands, Ella is Sri Lanka’s favorite nature sanctuary. Whether catching the blue train curving over Demodara Nine Arches Bridge, trekking to Little Adam’s Peak at sunrise, or tasting world-famous Ceylon single-estate black tea, Ella delights the soul with crisp mountain breezes.',
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'January to May & July to September',
    recommendedDuration: '3 - 4 Days',
    startingPrice: 220,
    rating: 4.92,
    reviewCount: 512,
    popularActivities: ['Nine Arches Bridge Visit', 'Ella to Kandy Scenic Train', 'Little Adam’s Peak Hike', 'Ravana Falls & Zipline', 'Tea Factory Tasting'],
    attractions: [
      {
        name: 'Demodara Nine Arches Bridge',
        description: 'A 91-meter stone viaduct built without steel during the British colonial era surrounded by lush emerald tea terraces.',
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free entry'
      },
      {
        name: 'Little Adam’s Peak',
        description: 'A gentle 45-minute trek rewarding travelers with a 360-degree vista over the Ella Gap and plunging valleys.',
        image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free entry'
      },
      {
        name: 'Ravana Waterfall & Caves',
        description: 'A dramatic 25-meter multi-tier cascading waterfall tied to the epic Ramayana legend.',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free entry'
      }
    ],
    coordinates: { lat: 6.8667, lng: 81.0466 },
    climate: { temperature: '18°C - 26°C', rainfall: 'Crisp mountain climate' },
    featured: true
  },
  {
    id: 'dest-kandy',
    slug: 'kandy',
    name: 'Kandy',
    sinhalaName: 'මහනුවර',
    province: 'Central Province',
    tagline: 'The Sacred Royal Capital & Temple of the Tooth',
    shortDescription: 'The cultural heartland of Sri Lanka, surrounded by forested mountains, a tranquil lake, and royal heritage.',
    overview: 'The last royal capital of Sri Lanka before British colonization, Kandy is home to the sacred Temple of the Sacred Tooth Relic (Sri Dalada Maligawa). Stroll around Kandy Lake, explore the world-renowned Royal Botanical Gardens in Peradeniya, and witness colorful traditional Kandyan fire dances.',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'December to April & July/August (Esala Perahera festival)',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 195,
    rating: 4.88,
    reviewCount: 384,
    popularActivities: ['Temple of the Tooth Blessing', 'Peradeniya Botanical Gardens', 'Kandyan Cultural Dance Show', 'Ceylon Spice Sanctuary'],
    attractions: [
      {
        name: 'Temple of the Sacred Tooth Relic',
        description: 'Golden-roofed temple sanctuary venerating the physical tooth relic of Lord Gautama Buddha.',
        image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$15 per person'
      },
      {
        name: 'Royal Botanical Gardens, Peradeniya',
        description: '147 acres of rare tropical flora, iconic palm avenues, giant Javan fig tree, and an orchid house with over 4,000 species.',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$10 per person'
      }
    ],
    coordinates: { lat: 7.2906, lng: 80.6337 },
    climate: { temperature: '22°C - 28°C', rainfall: 'Lush tropical highland' },
    featured: true
  },
  {
    id: 'dest-galle',
    slug: 'galle',
    name: 'Galle',
    sinhalaName: 'ගාල්ල',
    province: 'Southern Province',
    tagline: '17th-Century Dutch Fortified Coastal Charm',
    shortDescription: 'Cobblestone alleyways, boutique villas, rampart ocean sunsets, and vibrant maritime heritage.',
    overview: 'Galle Fort is a living UNESCO World Heritage fortress built by the Portuguese and fortified by the Dutch East India Company. Enclosed by thick sea-facing ramparts, it blends European colonial architecture with tropical South Asian artistry, artisan jewelry boutiques, and seaside cafes.',
    heroImage: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'November to April (Calm blue waters)',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 210,
    rating: 4.90,
    reviewCount: 460,
    popularActivities: ['Galle Fort Ramparts Sunset Walk', 'Lighthouse Photo Shoot', 'Maritime Archaeology Museum', 'Stilt Fishermen Watching'],
    attractions: [
      {
        name: 'Galle Dutch Fort & Lighthouse',
        description: 'Iconic white lighthouse perched on the point of the fortress with crashing Indian Ocean waves below.',
        image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free entry to fort'
      }
    ],
    coordinates: { lat: 6.0535, lng: 80.2210 },
    climate: { temperature: '27°C - 31°C', rainfall: 'Tropical coastal breeze' },
    featured: true
  },
  {
    id: 'dest-yala',
    slug: 'yala',
    name: 'Yala National Park',
    sinhalaName: 'යාල',
    province: 'Southern / Uva Province',
    tagline: 'The Realm of the Sri Lankan Leopard & Wild Elephants',
    shortDescription: 'The premier safari park boasting the highest density of leopards on earth and untamed coastal scrublands.',
    overview: 'Yala National Park is Sri Lanka’s crown jewel for wildlife conservation. Its diverse ecosystems span moist monsoon forests to coastal wetlands. Home to the endangered Sri Lankan leopard (Panthera pardus kotiya), sloth bears, Asian elephants, crocodiles, and over 215 bird species.',
    heroImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'February to July (Best wildlife sightings)',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 260,
    rating: 4.96,
    reviewCount: 390,
    popularActivities: ['4x4 Leopard Safari Jeep Tour', 'Luxury Glamping Under the Stars', 'Bird Watching at Kumana', 'Sithulpawwa Rock Monastery'],
    attractions: [
      {
        name: 'Yala Block 1 Leopard Sanctuary',
        description: 'World-famous safari zone where wild leopards rest atop ancient granite boulders.',
        image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$45 per vehicle + park permit'
      }
    ],
    coordinates: { lat: 6.3683, lng: 81.5215 },
    climate: { temperature: '28°C - 34°C', rainfall: 'Dry zone, warm and sunny' },
    featured: true
  },
  {
    id: 'dest-nuwara-eliya',
    slug: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    sinhalaName: 'නුවරඑළිය',
    province: 'Central Province',
    tagline: 'Little England & Pure Ceylon High-Grown Tea',
    shortDescription: 'Chilly misty peaks, colonial country houses, manicured golf courses, and endless rolling tea plantations.',
    overview: 'Perched at 1,868 meters elevation beneath Mount Pedro, Nuwara Eliya is Sri Lanka’s coolest haven. Established by British planters as a highland retreat, it features Tudor-style cottages, Gregory Lake water sports, strawberry farms, and world-class high-grown Ceylon tea estates.',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'February to May (Spring blossom season)',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 205,
    rating: 4.87,
    reviewCount: 310,
    popularActivities: ['Pedro Tea Estate Tour', 'Gregory Lake Boating', 'Horton Plains & World’s End Trek', 'Grand Hotel High Tea'],
    attractions: [
      {
        name: 'Horton Plains & World’s End',
        description: 'A protected highland plateau terminating at a dramatic 880-meter vertical sheer cliff drop into tea valleys.',
        image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$25 per person'
      }
    ],
    coordinates: { lat: 6.9497, lng: 80.7891 },
    climate: { temperature: '12°C - 20°C', rainfall: 'Cool mountain mist & crisp evenings' },
    featured: true
  },
  {
    id: 'dest-colombo',
    slug: 'colombo',
    name: 'Colombo',
    sinhalaName: 'කොළඹ',
    province: 'Western Province',
    tagline: 'Cosmopolitan Capital, Rooftop Bars & Colonial Grandeur',
    shortDescription: 'The vibrant commercial metropolis where historic colonial forts meet luxury oceanfront towers and street food markets.',
    overview: 'Colombo is an energetic gateway blending Dutch, British, and modern Asian culture. Explore the bustling markets of Pettah, sip cocktails at sunset over Galle Face Green, tour the National Museum, and dine at world-renowned Ministry of Crab.',
    heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'Year-round (Best Nov - April)',
    recommendedDuration: '1 - 2 Days',
    startingPrice: 150,
    rating: 4.82,
    reviewCount: 295,
    popularActivities: ['Colombo Heritage Walking Tour', 'Galle Face Green Sunset Stroll', 'Pettah Floating Market', 'Lotus Tower Observation Deck'],
    attractions: [
      {
        name: 'Gangaramaya Buddhist Temple',
        description: 'Vibrant lakeside temple complex displaying an eclectic collection of sacred artifacts, wood carvings, and jade statues.',
        image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$4 per person'
      }
    ],
    coordinates: { lat: 6.9271, lng: 79.8612 },
    climate: { temperature: '27°C - 32°C', rainfall: 'Tropical coastal' },
    featured: false
  },
  {
    id: 'dest-mirissa',
    slug: 'mirissa',
    name: 'Mirissa',
    sinhalaName: 'මිරිස්ස',
    province: 'Southern Province',
    tagline: 'Blue Whales, Coconut Tree Hill & Golden Sands',
    shortDescription: 'A paradise for marine encounters, famous for blue whale watching expeditions and idyllic palm-fringed bays.',
    overview: 'Mirissa is the premier marine safari hub of the Indian Ocean. Witness the majestic Blue Whale—the largest animal to ever exist on earth—just miles offshore. In the evenings, relax on crescent beaches lined with fresh seafood barbecues and swaying coconut palms.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'November to April (Whale migration season)',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 190,
    rating: 4.93,
    reviewCount: 478,
    popularActivities: ['Blue Whale & Dolphin Catamaran Safari', 'Coconut Tree Hill Sunset', 'Parrot Rock Tide Crossing', 'Secret Beach Snorkeling'],
    attractions: [
      {
        name: 'Coconut Tree Hill',
        description: 'A breathtaking dome-shaped palm promontory rising above turquoise ocean breaks.',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free'
      }
    ],
    coordinates: { lat: 5.9483, lng: 80.4578 },
    climate: { temperature: '28°C - 32°C', rainfall: 'Warm coastal sunshine' },
    featured: true
  },
  {
    id: 'dest-bentota',
    slug: 'bentota',
    name: 'Bentota',
    sinhalaName: 'බෙන්තොට',
    province: 'Southern Province',
    tagline: 'Golden Beach Resorts, Water Sports & River Safaris',
    shortDescription: 'Sri Lanka’s luxury beach haven, known for calm estuaries, water skiing, Geoffrey Bawa architecture, and sea turtle hatcheries.',
    overview: 'Located where the Bentota Ganga river meets the Indian Ocean, Bentota offers luxury 5-star beachfront resorts, jet-skiing, romantic Madu Ganga boat safaris through mangrove tunnels, and tranquil ayurvedic wellness sanctuaries.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'October to April',
    recommendedDuration: '2 - 4 Days',
    startingPrice: 175,
    rating: 4.85,
    reviewCount: 340,
    popularActivities: ['Madu Ganga River Boat Safari', 'Kosgoda Sea Turtle Hatchery', 'Brief Garden by Bevis Bawa', 'Jet Ski & Wakeboarding'],
    attractions: [
      {
        name: 'Madu Ganga Mangrove Lagoon',
        description: 'Glide through ancient mangrove tunnels to discover cinnamon island workshops and fish spa therapy.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        entranceFee: '$20 per private boat'
      }
    ],
    coordinates: { lat: 6.4258, lng: 79.9958 },
    climate: { temperature: '28°C - 31°C', rainfall: 'Tropical seaside' },
    featured: false
  },
  {
    id: 'dest-arugam-bay',
    slug: 'arugam-bay',
    name: 'Arugam Bay',
    sinhalaName: 'ආරුගම් බේ',
    province: 'Eastern Province',
    tagline: 'World-Class Point Breaks, Bohemian Vibes & Lagoons',
    shortDescription: 'One of the top ten surf destinations in the world with pristine right-hand point breaks and laid-back surf culture.',
    overview: 'Arugam Bay is a sun-kissed haven on Sri Lanka’s eastern coast. Renowned worldwide among surfers for its peeling right-hand reef points, it also offers wild elephant safaris at nearby Kumana and serene lagoon boat trips.',
    heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'May to September (Prime surf season with dry sunny skies)',
    recommendedDuration: '3 - 5 Days',
    startingPrice: 195,
    rating: 4.89,
    reviewCount: 280,
    popularActivities: ['Main Point Surfing', 'Whiskey Point Surf Lessons', 'Pottuvil Lagoon Canoe Safari', 'Kudumbigala Monastery'],
    attractions: [
      {
        name: 'Main Point Surf Break',
        description: 'World-standard peeling right-hand point break attracting international surfers.',
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free'
      }
    ],
    coordinates: { lat: 6.8418, lng: 81.8347 },
    climate: { temperature: '29°C - 35°C', rainfall: 'Dry and sunny May-Sep' },
    featured: false
  },
  {
    id: 'dest-jaffna',
    slug: 'jaffna',
    name: 'Jaffna',
    sinhalaName: 'යාපනය',
    province: 'Northern Province',
    tagline: 'Vibrant Tamil Culture, Nallur Temple & Island Forts',
    shortDescription: 'Rich northern heritage, ornate Hindu kovils, Palmyrah palms, distinct spicy crab curries, and remote island ferries.',
    overview: 'Jaffna is an authentic cultural jewel at the northern tip of the island. Experience the grandeur of the Nallur Kandaswamy Kovil, explore Portuguese and Dutch forts, take a boat to Delft Island with wild horses, and savor authentic Jaffna culinary traditions.',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'January to September',
    recommendedDuration: '2 - 3 Days',
    startingPrice: 230,
    rating: 4.86,
    reviewCount: 215,
    popularActivities: ['Nallur Kovil Puja Ceremony', 'Delft Island Wild Horses Ferry', 'Jaffna Fort Exploration', 'Authentic Jaffna Crab Curry Feast'],
    attractions: [
      {
        name: 'Nallur Kandaswamy Hindu Kovil',
        description: 'A magnificent sacred Dravidian temple with golden gopuram spires and chanting ceremonies.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free entry (dress code applies)'
      }
    ],
    coordinates: { lat: 9.6615, lng: 80.0255 },
    climate: { temperature: '28°C - 33°C', rainfall: 'Sunny northern tropical' },
    featured: false
  },
  {
    id: 'dest-trincomalee',
    slug: 'trincomalee',
    name: 'Trincomalee',
    sinhalaName: 'ත්‍රිකුණාමලය',
    province: 'Eastern Province',
    tagline: 'Deep Natural Harbors, Pigeon Island & Koneswaram Temple',
    shortDescription: 'Pristine turquoise waters, coral reefs at Pigeon Island, and clifftop Hindu shrines overlooking Swami Rock.',
    overview: 'Trincomalee holds one of the finest deep-water natural harbors in the world. Famous for Pigeon Island National Park snorkeling with harmless reef sharks and sea turtles, and the clifftop Koneswaram Kovil perched above crashing turquoise waves.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
    ],
    bestTimeToVisit: 'March to October (Calm seas & crystal clarity)',
    recommendedDuration: '3 - 4 Days',
    startingPrice: 225,
    rating: 4.91,
    reviewCount: 320,
    popularActivities: ['Pigeon Island Coral Snorkeling', 'Koneswaram Temple on Swami Rock', 'Nilaveli Beach Relaxation', 'Whale Watching (May - Oct)'],
    attractions: [
      {
        name: 'Koneswaram Temple & Swami Rock',
        description: 'Ancient sacred temple atop Lovers Leap cliff with breathtaking turquoise Indian Ocean views.',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        entranceFee: 'Free entry'
      }
    ],
    coordinates: { lat: 8.5874, lng: 81.2152 },
    climate: { temperature: '28°C - 34°C', rainfall: 'Warm coastal dry season March-October' },
    featured: false
  }
];
