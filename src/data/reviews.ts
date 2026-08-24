import type { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    targetType: 'tour',
    targetId: 'tour-sri-lanka-highlights',
    targetTitle: 'Sri Lanka Grand Highlights & Heritage',
    authorName: 'Eleanor & James Vance',
    authorCountry: 'United Kingdom',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2026-06-14',
    title: 'The most extraordinary holiday of our lives!',
    content: 'From the moment our chauffeur-guide Roshan welcomed us at Colombo airport with fragrant jasmine garlands, we were treated like royalty. Sigiriya at sunrise was magical, the scenic train to Ella took our breath away, and tracking a leopard in Yala on our morning safari was unforgettable. The attention to detail from LankaVoyage was flawless.',
    tripType: 'Couple / Honeymoon',
    verifiedTraveler: true,
    photos: [
      'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'approved',
    replyFromManagement: {
      responderName: 'Dinesh Perera, Head of Experience',
      date: '2026-06-15',
      text: 'Dear Eleanor & James, it was an honor hosting you across Sri Lanka. We are thrilled you spotted the Yala leopard and loved the tea country train!'
    }
  },
  {
    id: 'rev-2',
    targetType: 'tour',
    targetId: 'tour-wildlife-safari',
    targetTitle: 'Wild Sri Lanka: Leopards, Whales & Elephants',
    authorName: 'Marcus & Sophia Lindqvist',
    authorCountry: 'Sweden',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2026-07-02',
    title: 'Unbelievable wildlife encounters and 5-star service',
    content: 'We saw three blue whales in Mirissa on a modern catamaran, hundreds of elephants at Minneriya, and a female leopard sleeping on a boulder in Yala. Our vehicle was spotless, super comfortable, and our naturalist guide had eagle eyes. Outstanding organization!',
    tripType: 'Family Vacation',
    verifiedTraveler: true,
    status: 'approved'
  },
  {
    id: 'rev-3',
    targetType: 'tour',
    targetId: 'tour-luxury-honeymoon',
    targetTitle: 'Enchanted Ceylon: Luxury & Honeymoon Romance',
    authorName: 'Camille & Julien Laurent',
    authorCountry: 'France',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2026-07-28',
    title: 'Pure magic and romance in Ceylon',
    content: 'The private pool villa at Uga Ulagalla and the 100-torch candlelight dinner on the beach in Bentota were beyond our wildest dreams. Everything was effortless and bespoke. We are already planning our anniversary return with LankaVoyage!',
    tripType: 'Couple / Honeymoon',
    verifiedTraveler: true,
    photos: [
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'approved'
  },
  {
    id: 'rev-4',
    targetType: 'tour',
    targetId: 'tour-ella-hill-country',
    targetTitle: 'Ella & Highland Misty Tea Escapes',
    authorName: 'Liam O’Connor',
    authorCountry: 'Australia',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2026-08-05',
    title: 'Breathtaking hikes and the best tea on earth',
    content: 'Hiking Little Adam’s Peak at 6:00 AM with the mountain mist clearing below was spiritual. The colonial atmosphere at The Grand Hotel and the Ceylon tea masterclass were absolute highlights. 10/10 recommendation for LankaVoyage.',
    tripType: 'Solo Explorer',
    verifiedTraveler: true,
    status: 'approved'
  },
  {
    id: 'rev-5',
    targetType: 'general',
    authorName: 'David & Hannah Schmidt',
    authorCountry: 'Germany',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    date: '2026-08-18',
    title: 'Customized our dream 14-day family itinerary',
    content: 'We used LankaVoyage’s custom tour builder to put together a 14-day route with our 3 teenagers. The combination of culture, surfing in Weligama, safaris, and train rides kept all of us entertained every single day. Reliable, luxurious, and deeply warm hospitality.',
    tripType: 'Family Vacation',
    verifiedTraveler: true,
    status: 'approved'
  }
];
