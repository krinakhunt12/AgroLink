
import { Home, ShoppingBag, UserPlus, HelpCircle, LayoutDashboard, LogIn } from 'lucide-react';
import type { NavItem, Product } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'મુખ્ય પૃષ્ઠ', translationKey: 'nav.home', path: '/', icon: Home },
  { label: 'બજાર (Market)', translationKey: 'nav.market', path: '/market', icon: ShoppingBag },
  { label: 'મારી ખેતી', translationKey: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'રજીસ્ટ્રેશન', translationKey: 'nav.register', path: '/register', icon: UserPlus },
  { label: 'લોગિન', translationKey: 'nav.login', path: '/login', icon: LogIn },
];

export const CATEGORIES = [
  'તમામ',
  'અનાજ',
  'શાકભાજી',
  'દાળ અને કઠોળ',
  'મસાલા',
  'ફળ',
  'ઓર્ગેનિક',
  'ડેરી પ્રોડક્ટ્સ',
  'બિયારણ',
  'ખેતી ઓજારો'
];

export const MOCK_WEATHER = [
  { city: "અમરેલી (Amreli)", temp: "32°C", condition: "ચોખ્ખું આકાશ", icon: "Sun", bg: "from-orange-400 to-yellow-300" },
  { city: "રાજકોટ (Rajkot)", temp: "34°C", condition: "આંશિક વાદળછાયું", icon: "Cloud", bg: "from-blue-400 to-blue-200" },
  { city: "સુરત (Surat)", temp: "30°C", condition: "ભેજવાળું", icon: "CloudRain", bg: "from-gray-600 to-gray-400" },
  { city: "બનાસકાંઠા (B.K.)", temp: "35°C", condition: "તડકો", icon: "Sun", bg: "from-orange-500 to-yellow-400" }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'ગીર કેસર કેરી (Gir Kesar)',
    category: 'ફળ',
    price: 1200,
    unit: '20 કિલો',
    farmerName: 'રામજીભાઈ પટેલ',
    location: 'તાલાલા, ગીર',
    image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4f4716?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    isNegotiable: true,
    isVerified: true,
    stock: 50
  },
  {
    id: '2',
    name: 'દેશી ઘઉં (ટુકડા)',
    category: 'અનાજ',
    price: 600,
    unit: '20 કિલો',
    farmerName: 'કાનજીભાઈ આહિર',
    location: 'ભાલ પ્રદેશ',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
    isNegotiable: false,
    isVerified: true,
    stock: 200
  },
  {
    id: '3',
    name: 'તાજા ટામેટા',
    category: 'શાકભાજી',
    price: 400,
    unit: '20 કિલો',
    farmerName: 'સુરેશભાઈ ઠાકોર',
    location: 'ડીસા',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    isNegotiable: true,
    isVerified: false,
    stock: 30
  }
];

export const MARKET_RATES_TICKER = [
  "કપાસ: ₹1500-1650", "જીરું: ₹5000-5800", "ઘઉં: ₹550-650", "મગફળી: ₹1200-1400", "ચણા: ₹900-1050", "એરંડા: ₹1100-1200", "બાજરી: ₹400-500"
];

// Added missing constants required by Home, AiAssistant and FloatingAiChat
export const SEO_KEYWORDS = [
  "ખેતી", "ખેડૂત", "બજાર ભાવ", "Gujarat Agriculture", "Farmer Market", "Organic Farming", "Kisan", "APMC Rates", "Direct Selling"
];

export const MOCK_SCHEMES = [
  {
    tag: "નવી યોજના",
    title: "પ્રધાનમંત્રી કિસાન સન્માન નિધિ",
    desc: "ખેડૂતોને વાર્ષિક ₹6,000 ની આર્થિક સહાય સીધી બેંક ખાતામાં.",
    link: "https://pmkisan.gov.in/"
  },
  {
    tag: "સબસિડી",
    title: "સોલર પંપ સબસિડી યોજના",
    desc: "ખેતરમાં સોલર પંપ લગાવવા માટે 80% સુધીની સરકારી સબસિડી.",
    link: "https://ikhedut.gujarat.gov.in/"
  }
];

export const MOCK_NEWS = [
  {
    date: "12 May",
    title: "કપાસના ભાવમાં રેકોર્ડ બ્રેક ઉછાળો, ખેડૂતોમાં ખુશી",
    source: "APMC News"
  },
  {
    date: "10 May",
    title: "ગુજરાતમાં આ વર્ષે સામાન્ય કરતા વધુ વરસાદની આગાહી",
    source: "Weather Dept"
  },
  {
    date: "08 May",
    title: "નવી ડ્રોન ટેકનોલોજી પર સરકાર આપશે 40% સબસિડી",
    source: "Agri Dept"
  }
];

export const MOCK_VIDEOS = [
  {
    title: "કેસર કેરીની ખેતી કેવી રીતે કરવી?",
    thumbnail: "https://images.unsplash.com/photo-1553272725-086100aecf5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    duration: "10:24",
    views: "50K",
    videoUrl: "#"
  },
  {
    title: "ઓર્ગેનિક ખાતર બનાવવાની રીત",
    thumbnail: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    duration: "08:15",
    views: "32K",
    videoUrl: "#"
  },
  {
    title: "ટપક સિંચાઈ પદ્ધતિના ફાયદા",
    thumbnail: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    duration: "12:40",
    views: "15K",
    videoUrl: "#"
  },
  {
    title: "કપાસમાં રોગ નિયંત્રણ",
    thumbnail: "https://images.unsplash.com/photo-1594314489370-17e57c617b7b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    duration: "06:50",
    views: "22K",
    videoUrl: "#"
  }
];

export const SUGGESTED_QUESTIONS = [
  "આજે કપાસના ભાવ શું છે?",
  "કેસર કેરીની ખેતી વિશે જણાવો.",
  "ગુજરાત સરકારની નવી યોજનાઓ કઈ છે?",
  "ચોમાસામાં કયો પાક લેવો જોઈએ?",
  "મગફળીમાં આવતા રોગોનું નિયંત્રણ કેવી રીતે કરવું?"
];
