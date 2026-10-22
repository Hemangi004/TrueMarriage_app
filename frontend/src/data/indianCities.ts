export interface CityItem {
  city: string;
  state: string;
  country: string;
  displayName: string; // e.g. "Pune, Maharashtra"
}

export const CITIES_DATA: CityItem[] = [
  { city: 'Pune', state: 'Maharashtra', country: 'India', displayName: 'Pune, Maharashtra' },
  { city: 'Pimpri-Chinchwad', state: 'Maharashtra', country: 'India', displayName: 'Pimpri-Chinchwad, Maharashtra' },
  { city: 'Haveli', state: 'Maharashtra', country: 'India', displayName: 'Haveli, Maharashtra' },
  { city: 'Khed (Rajgurunagar)', state: 'Maharashtra', country: 'India', displayName: 'Khed (Rajgurunagar), Maharashtra' },
  { city: 'Ambegaon (Ghodegaon)', state: 'Maharashtra', country: 'India', displayName: 'Ambegaon (Ghodegaon), Maharashtra' },
  { city: 'Junnar', state: 'Maharashtra', country: 'India', displayName: 'Junnar, Maharashtra' },
  { city: 'Shirur (Ghodnadi)', state: 'Maharashtra', country: 'India', displayName: 'Shirur (Ghodnadi), Maharashtra' },
  { city: 'Daund', state: 'Maharashtra', country: 'India', displayName: 'Daund, Maharashtra' },
  { city: 'Indapur', state: 'Maharashtra', country: 'India', displayName: 'Indapur, Maharashtra' },
  { city: 'Baramati', state: 'Maharashtra', country: 'India', displayName: 'Baramati, Maharashtra' },
  { city: 'Purandar (Saswad)', state: 'Maharashtra', country: 'India', displayName: 'Purandar (Saswad), Maharashtra' },
  { city: 'Bhor', state: 'Maharashtra', country: 'India', displayName: 'Bhor, Maharashtra' },
  { city: 'Velhe', state: 'Maharashtra', country: 'India', displayName: 'Velhe, Maharashtra' },
  { city: 'Mulshi (Paud)', state: 'Maharashtra', country: 'India', displayName: 'Mulshi (Paud), Maharashtra' },
  { city: 'Maval (Vadgaon)', state: 'Maharashtra', country: 'India', displayName: 'Maval (Vadgaon), Maharashtra' },
  { city: 'Lonavala', state: 'Maharashtra', country: 'India', displayName: 'Lonavala, Maharashtra' },
  { city: 'Khandala', state: 'Maharashtra', country: 'India', displayName: 'Khandala, Maharashtra' },
  { city: 'Talegaon Dabhade', state: 'Maharashtra', country: 'India', displayName: 'Talegaon Dabhade, Maharashtra' },
  { city: 'Dehu', state: 'Maharashtra', country: 'India', displayName: 'Dehu, Maharashtra' },
  { city: 'Alandi', state: 'Maharashtra', country: 'India', displayName: 'Alandi, Maharashtra' },
  { city: 'Chakan', state: 'Maharashtra', country: 'India', displayName: 'Chakan, Maharashtra' },
  { city: 'Hinjewadi', state: 'Maharashtra', country: 'India', displayName: 'Hinjewadi, Maharashtra' },
  { city: 'Bhosari', state: 'Maharashtra', country: 'India', displayName: 'Bhosari, Maharashtra' },
  { city: 'Pimpri', state: 'Maharashtra', country: 'India', displayName: 'Pimpri, Maharashtra' },
  { city: 'Chinchwad', state: 'Maharashtra', country: 'India', displayName: 'Chinchwad, Maharashtra' },
  { city: 'Nigdi', state: 'Maharashtra', country: 'India', displayName: 'Nigdi, Maharashtra' },
  { city: 'Akurdi', state: 'Maharashtra', country: 'India', displayName: 'Akurdi, Maharashtra' },
  { city: 'Wakad', state: 'Maharashtra', country: 'India', displayName: 'Wakad, Maharashtra' },
  { city: 'Baner', state: 'Maharashtra', country: 'India', displayName: 'Baner, Maharashtra' },
  { city: 'Kothrud', state: 'Maharashtra', country: 'India', displayName: 'Kothrud, Maharashtra' },
  { city: 'Hadapsar', state: 'Maharashtra', country: 'India', displayName: 'Hadapsar, Maharashtra' },
  { city: 'Wagholi', state: 'Maharashtra', country: 'India', displayName: 'Wagholi, Maharashtra' },
  { city: 'Shikrapur', state: 'Maharashtra', country: 'India', displayName: 'Shikrapur, Maharashtra' },
  { city: 'Jejuri', state: 'Maharashtra', country: 'India', displayName: 'Jejuri, Maharashtra' },
  { city: 'Uruli Kanchan', state: 'Maharashtra', country: 'India', displayName: 'Uruli Kanchan, Maharashtra' },
  { city: 'Narayangaon', state: 'Maharashtra', country: 'India', displayName: 'Narayangaon, Maharashtra' },
  { city: 'Otur', state: 'Maharashtra', country: 'India', displayName: 'Otur, Maharashtra' },
  { city: 'Manchar', state: 'Maharashtra', country: 'India', displayName: 'Manchar, Maharashtra' },
  { city: 'Somatane', state: 'Maharashtra', country: 'India', displayName: 'Somatane, Maharashtra' },
  { city: 'Pashan', state: 'Maharashtra', country: 'India', displayName: 'Pashan, Maharashtra' },
  { city: 'Satara', state: 'Maharashtra', country: 'India', displayName: 'Satara, Maharashtra' },
  { city: 'Wai', state: 'Maharashtra', country: 'India', displayName: 'Wai, Maharashtra' },
  { city: 'Mahabaleshwar', state: 'Maharashtra', country: 'India', displayName: 'Mahabaleshwar, Maharashtra' },
  { city: 'Panchgani', state: 'Maharashtra', country: 'India', displayName: 'Panchgani, Maharashtra' },
  { city: 'Khandala (Shirwal)', state: 'Maharashtra', country: 'India', displayName: 'Khandala (Shirwal), Maharashtra' },
  { city: 'Shirwal', state: 'Maharashtra', country: 'India', displayName: 'Shirwal, Maharashtra' },
  { city: 'Koregaon', state: 'Maharashtra', country: 'India', displayName: 'Koregaon, Maharashtra' },
  { city: 'Phaltan', state: 'Maharashtra', country: 'India', displayName: 'Phaltan, Maharashtra' },
  { city: 'Lonand', state: 'Maharashtra', country: 'India', displayName: 'Lonand, Maharashtra' },
  { city: 'Man (Dahiwadi)', state: 'Maharashtra', country: 'India', displayName: 'Man (Dahiwadi), Maharashtra' },
  { city: 'Dahiwadi', state: 'Maharashtra', country: 'India', displayName: 'Dahiwadi, Maharashtra' },
  { city: 'Mhaswad', state: 'Maharashtra', country: 'India', displayName: 'Mhaswad, Maharashtra' },
  { city: 'Khatav (Vaduj)', state: 'Maharashtra', country: 'India', displayName: 'Khatav (Vaduj), Maharashtra' },
  { city: 'Vaduj', state: 'Maharashtra', country: 'India', displayName: 'Vaduj, Maharashtra' },
  { city: 'Aundh', state: 'Maharashtra', country: 'India', displayName: 'Aundh, Maharashtra' },
  { city: 'Karad', state: 'Maharashtra', country: 'India', displayName: 'Karad, Maharashtra' },
  { city: 'Ogalewadi', state: 'Maharashtra', country: 'India', displayName: 'Ogalewadi, Maharashtra' },
  { city: 'Umbraj', state: 'Maharashtra', country: 'India', displayName: 'Umbraj, Maharashtra' },
  { city: 'Patan', state: 'Maharashtra', country: 'India', displayName: 'Patan, Maharashtra' },
  { city: 'Koynanagar', state: 'Maharashtra', country: 'India', displayName: 'Koynanagar, Maharashtra' },
  { city: 'Jaoli (Medha)', state: 'Maharashtra', country: 'India', displayName: 'Jaoli (Medha), Maharashtra' },
  { city: 'Medha', state: 'Maharashtra', country: 'India', displayName: 'Medha, Maharashtra' },
  { city: 'Bhuinj', state: 'Maharashtra', country: 'India', displayName: 'Bhuinj, Maharashtra' },
  { city: 'Kolhapur', state: 'Maharashtra', country: 'India', displayName: 'Kolhapur, Maharashtra' },
  { city: 'Karvir', state: 'Maharashtra', country: 'India', displayName: 'Karvir, Maharashtra' },
  { city: 'Panhala', state: 'Maharashtra', country: 'India', displayName: 'Panhala, Maharashtra' },
  { city: 'Kodoli', state: 'Maharashtra', country: 'India', displayName: 'Kodoli, Maharashtra' },
  { city: 'Shahuwadi (Malkapur)', state: 'Maharashtra', country: 'India', displayName: 'Shahuwadi (Malkapur), Maharashtra' },
  { city: 'Malkapur (Kolhapur)', state: 'Maharashtra', country: 'India', displayName: 'Malkapur (Kolhapur), Maharashtra' },
  { city: 'Kagal', state: 'Maharashtra', country: 'India', displayName: 'Kagal, Maharashtra' },
  { city: 'Murgud', state: 'Maharashtra', country: 'India', displayName: 'Murgud, Maharashtra' },
  { city: 'Hatkanangale', state: 'Maharashtra', country: 'India', displayName: 'Hatkanangale, Maharashtra' },
  { city: 'Ichalkaranji', state: 'Maharashtra', country: 'India', displayName: 'Ichalkaranji, Maharashtra' },
  { city: 'Hupari', state: 'Maharashtra', country: 'India', displayName: 'Hupari, Maharashtra' },
  { city: 'Shirol', state: 'Maharashtra', country: 'India', displayName: 'Shirol, Maharashtra' },
  { city: 'Jaysingpur', state: 'Maharashtra', country: 'India', displayName: 'Jaysingpur, Maharashtra' },
  { city: 'Kurundwad', state: 'Maharashtra', country: 'India', displayName: 'Kurundwad, Maharashtra' },
  { city: 'Radhanagari', state: 'Maharashtra', country: 'India', displayName: 'Radhanagari, Maharashtra' },
  { city: 'Gaganbawda', state: 'Maharashtra', country: 'India', displayName: 'Gaganbawda, Maharashtra' },
  { city: 'Bhudargad (Gargoti)', state: 'Maharashtra', country: 'India', displayName: 'Bhudargad (Gargoti), Maharashtra' },
  { city: 'Gargoti', state: 'Maharashtra', country: 'India', displayName: 'Gargoti, Maharashtra' },
  { city: 'Gadhinglaj', state: 'Maharashtra', country: 'India', displayName: 'Gadhinglaj, Maharashtra' },
  { city: 'Ajra', state: 'Maharashtra', country: 'India', displayName: 'Ajra, Maharashtra' },
  { city: 'Chandgad', state: 'Maharashtra', country: 'India', displayName: 'Chandgad, Maharashtra' },
  { city: 'Goplapur', state: 'Maharashtra', country: 'India', displayName: 'Goplapur, Maharashtra' },
  { city: 'Sangli', state: 'Maharashtra', country: 'India', displayName: 'Sangli, Maharashtra' },
  { city: 'Miraj', state: 'Maharashtra', country: 'India', displayName: 'Miraj, Maharashtra' },
  { city: 'Kupwad', state: 'Maharashtra', country: 'India', displayName: 'Kupwad, Maharashtra' },
  { city: 'Walwa (Islampur)', state: 'Maharashtra', country: 'India', displayName: 'Walwa (Islampur), Maharashtra' },
  { city: 'Islampur', state: 'Maharashtra', country: 'India', displayName: 'Islampur, Maharashtra' },
  { city: 'Ashta', state: 'Maharashtra', country: 'India', displayName: 'Ashta, Maharashtra' },
  { city: 'Shirala', state: 'Maharashtra', country: 'India', displayName: 'Shirala, Maharashtra' },
  { city: 'Tasgaon', state: 'Maharashtra', country: 'India', displayName: 'Tasgaon, Maharashtra' },
  { city: 'Khanapur (Vita)', state: 'Maharashtra', country: 'India', displayName: 'Khanapur (Vita), Maharashtra' },
  { city: 'Vita', state: 'Maharashtra', country: 'India', displayName: 'Vita, Maharashtra' },
  { city: 'Atpadi', state: 'Maharashtra', country: 'India', displayName: 'Atpadi, Maharashtra' },
  { city: 'Kavathe Mahankal', state: 'Maharashtra', country: 'India', displayName: 'Kavathe Mahankal, Maharashtra' },
  { city: 'Palus', state: 'Maharashtra', country: 'India', displayName: 'Palus, Maharashtra' },
  { city: 'Kundal', state: 'Maharashtra', country: 'India', displayName: 'Kundal, Maharashtra' },
  { city: 'Kadegaon', state: 'Maharashtra', country: 'India', displayName: 'Kadegaon, Maharashtra' },
  { city: 'Jath', state: 'Maharashtra', country: 'India', displayName: 'Jath, Maharashtra' },
  { city: 'Solapur', state: 'Maharashtra', country: 'India', displayName: 'Solapur, Maharashtra' },
  { city: 'Barshi', state: 'Maharashtra', country: 'India', displayName: 'Barshi, Maharashtra' },
  { city: 'Vairag', state: 'Maharashtra', country: 'India', displayName: 'Vairag, Maharashtra' },
  { city: 'Akkalkot', state: 'Maharashtra', country: 'India', displayName: 'Akkalkot, Maharashtra' },
  { city: 'Mohol', state: 'Maharashtra', country: 'India', displayName: 'Mohol, Maharashtra' },
  { city: 'Madha', state: 'Maharashtra', country: 'India', displayName: 'Madha, Maharashtra' },
  { city: 'Kurduvadi', state: 'Maharashtra', country: 'India', displayName: 'Kurduvadi, Maharashtra' },
  { city: 'Karmala', state: 'Maharashtra', country: 'India', displayName: 'Karmala, Maharashtra' },
  { city: 'Pandharpur', state: 'Maharashtra', country: 'India', displayName: 'Pandharpur, Maharashtra' },
  { city: 'Sangola', state: 'Maharashtra', country: 'India', displayName: 'Sangola, Maharashtra' },
  { city: 'Malshiras', state: 'Maharashtra', country: 'India', displayName: 'Malshiras, Maharashtra' },
  { city: 'Akluj', state: 'Maharashtra', country: 'India', displayName: 'Akluj, Maharashtra' },
  { city: 'Natepute', state: 'Maharashtra', country: 'India', displayName: 'Natepute, Maharashtra' },
  { city: 'Mangalwedha', state: 'Maharashtra', country: 'India', displayName: 'Mangalwedha, Maharashtra' },
  { city: 'Nashik', state: 'Maharashtra', country: 'India', displayName: 'Nashik, Maharashtra' },
  { city: 'Sinnar', state: 'Maharashtra', country: 'India', displayName: 'Sinnar, Maharashtra' },
  { city: 'Dindori', state: 'Maharashtra', country: 'India', displayName: 'Dindori, Maharashtra' },
  { city: 'Vani (Nashik)', state: 'Maharashtra', country: 'India', displayName: 'Vani (Nashik), Maharashtra' },
  { city: 'Igatpuri', state: 'Maharashtra', country: 'India', displayName: 'Igatpuri, Maharashtra' },
  { city: 'Ghoti', state: 'Maharashtra', country: 'India', displayName: 'Ghoti, Maharashtra' },
  { city: 'Trimbakeshwar', state: 'Maharashtra', country: 'India', displayName: 'Trimbakeshwar, Maharashtra' },
  { city: 'Niphad', state: 'Maharashtra', country: 'India', displayName: 'Niphad, Maharashtra' },
  { city: 'Ozar (Nashik)', state: 'Maharashtra', country: 'India', displayName: 'Ozar (Nashik), Maharashtra' },
  { city: 'Pimpalgaon Baswant', state: 'Maharashtra', country: 'India', displayName: 'Pimpalgaon Baswant, Maharashtra' },
  { city: 'Lasalgaon', state: 'Maharashtra', country: 'India', displayName: 'Lasalgaon, Maharashtra' },
  { city: 'Yeola', state: 'Maharashtra', country: 'India', displayName: 'Yeola, Maharashtra' },
  { city: 'Chandwad', state: 'Maharashtra', country: 'India', displayName: 'Chandwad, Maharashtra' },
  { city: 'Nandgaon', state: 'Maharashtra', country: 'India', displayName: 'Nandgaon, Maharashtra' },
  { city: 'Manmad', state: 'Maharashtra', country: 'India', displayName: 'Manmad, Maharashtra' },
  { city: 'Malegaon', state: 'Maharashtra', country: 'India', displayName: 'Malegaon, Maharashtra' },
  { city: 'Baglan (Satana)', state: 'Maharashtra', country: 'India', displayName: 'Baglan (Satana), Maharashtra' },
  { city: 'Satana', state: 'Maharashtra', country: 'India', displayName: 'Satana, Maharashtra' },
  { city: 'Kalwan', state: 'Maharashtra', country: 'India', displayName: 'Kalwan, Maharashtra' },
  { city: 'Deola', state: 'Maharashtra', country: 'India', displayName: 'Deola, Maharashtra' },
  { city: 'Surgana', state: 'Maharashtra', country: 'India', displayName: 'Surgana, Maharashtra' },
  { city: 'Peint', state: 'Maharashtra', country: 'India', displayName: 'Peint, Maharashtra' },
  { city: 'Ahmednagar (Ahilyanagar)', state: 'Maharashtra', country: 'India', displayName: 'Ahmednagar (Ahilyanagar), Maharashtra' },
  { city: 'Rahata', state: 'Maharashtra', country: 'India', displayName: 'Rahata, Maharashtra' },
  { city: 'Shirdi', state: 'Maharashtra', country: 'India', displayName: 'Shirdi, Maharashtra' },
  { city: 'Sangamner', state: 'Maharashtra', country: 'India', displayName: 'Sangamner, Maharashtra' },
  { city: 'Kopargaon', state: 'Maharashtra', country: 'India', displayName: 'Kopargaon, Maharashtra' },
  { city: 'Shrirampur', state: 'Maharashtra', country: 'India', displayName: 'Shrirampur, Maharashtra' },
  { city: 'Nevasa', state: 'Maharashtra', country: 'India', displayName: 'Nevasa, Maharashtra' },
  { city: 'Shevgaon', state: 'Maharashtra', country: 'India', displayName: 'Shevgaon, Maharashtra' },
  { city: 'Pathardi', state: 'Maharashtra', country: 'India', displayName: 'Pathardi, Maharashtra' },
  { city: 'Jamkhed', state: 'Maharashtra', country: 'India', displayName: 'Jamkhed, Maharashtra' },
  { city: 'Karjat (Ahmednagar)', state: 'Maharashtra', country: 'India', displayName: 'Karjat (Ahmednagar), Maharashtra' },
  { city: 'Parner', state: 'Maharashtra', country: 'India', displayName: 'Parner, Maharashtra' },
  { city: 'Akole', state: 'Maharashtra', country: 'India', displayName: 'Akole, Maharashtra' },
  { city: 'Rahuri', state: 'Maharashtra', country: 'India', displayName: 'Rahuri, Maharashtra' },
  { city: 'Shrigonda', state: 'Maharashtra', country: 'India', displayName: 'Shrigonda, Maharashtra' },
  { city: 'Mumbai', state: 'Maharashtra', country: 'India', displayName: 'Mumbai, Maharashtra' },
  { city: 'Navi Mumbai', state: 'Maharashtra', country: 'India', displayName: 'Navi Mumbai, Maharashtra' },
  { city: 'Thane', state: 'Maharashtra', country: 'India', displayName: 'Thane, Maharashtra' },
  { city: 'Kalyan', state: 'Maharashtra', country: 'India', displayName: 'Kalyan, Maharashtra' },
  { city: 'Dombivli', state: 'Maharashtra', country: 'India', displayName: 'Dombivli, Maharashtra' },
  { city: 'Ulhasnagar', state: 'Maharashtra', country: 'India', displayName: 'Ulhasnagar, Maharashtra' },
  { city: 'Ambernath', state: 'Maharashtra', country: 'India', displayName: 'Ambernath, Maharashtra' },
  { city: 'Badlapur', state: 'Maharashtra', country: 'India', displayName: 'Badlapur, Maharashtra' },
  { city: 'Murbad', state: 'Maharashtra', country: 'India', displayName: 'Murbad, Maharashtra' },
  { city: 'Shahapur', state: 'Maharashtra', country: 'India', displayName: 'Shahapur, Maharashtra' },
  { city: 'Bhiwandi', state: 'Maharashtra', country: 'India', displayName: 'Bhiwandi, Maharashtra' },
  { city: 'Mira-Bhayandar', state: 'Maharashtra', country: 'India', displayName: 'Mira-Bhayandar, Maharashtra' },
  { city: 'Vasai-Virar', state: 'Maharashtra', country: 'India', displayName: 'Vasai-Virar, Maharashtra' },
  { city: 'Vasai', state: 'Maharashtra', country: 'India', displayName: 'Vasai, Maharashtra' },
  { city: 'Virar', state: 'Maharashtra', country: 'India', displayName: 'Virar, Maharashtra' },
  { city: 'Palghar', state: 'Maharashtra', country: 'India', displayName: 'Palghar, Maharashtra' },
  { city: 'Boisar', state: 'Maharashtra', country: 'India', displayName: 'Boisar, Maharashtra' },
  { city: 'Dahanu', state: 'Maharashtra', country: 'India', displayName: 'Dahanu, Maharashtra' },
  { city: 'Talasari', state: 'Maharashtra', country: 'India', displayName: 'Talasari, Maharashtra' },
  { city: 'Jawhar', state: 'Maharashtra', country: 'India', displayName: 'Jawhar, Maharashtra' },
  { city: 'Mokhada', state: 'Maharashtra', country: 'India', displayName: 'Mokhada, Maharashtra' },
  { city: 'Wada', state: 'Maharashtra', country: 'India', displayName: 'Wada, Maharashtra' },
  { city: 'Vikramgad', state: 'Maharashtra', country: 'India', displayName: 'Vikramgad, Maharashtra' },
  { city: 'Alibag', state: 'Maharashtra', country: 'India', displayName: 'Alibag, Maharashtra' },
  { city: 'Pen', state: 'Maharashtra', country: 'India', displayName: 'Pen, Maharashtra' },
  { city: 'Panvel', state: 'Maharashtra', country: 'India', displayName: 'Panvel, Maharashtra' },
  { city: 'Karjat (Raigad)', state: 'Maharashtra', country: 'India', displayName: 'Karjat (Raigad), Maharashtra' },
  { city: 'Neral', state: 'Maharashtra', country: 'India', displayName: 'Neral, Maharashtra' },
  { city: 'Matheran', state: 'Maharashtra', country: 'India', displayName: 'Matheran, Maharashtra' },
  { city: 'Khopoli', state: 'Maharashtra', country: 'India', displayName: 'Khopoli, Maharashtra' },
  { city: 'Roha', state: 'Maharashtra', country: 'India', displayName: 'Roha, Maharashtra' },
  { city: 'Mangaon', state: 'Maharashtra', country: 'India', displayName: 'Mangaon, Maharashtra' },
  { city: 'Mahad', state: 'Maharashtra', country: 'India', displayName: 'Mahad, Maharashtra' },
  { city: 'Poladpur', state: 'Maharashtra', country: 'India', displayName: 'Poladpur, Maharashtra' },
  { city: 'Shrivardhan', state: 'Maharashtra', country: 'India', displayName: 'Shrivardhan, Maharashtra' },
  { city: 'Mhasla', state: 'Maharashtra', country: 'India', displayName: 'Mhasla, Maharashtra' },
  { city: 'Murud (Janjira)', state: 'Maharashtra', country: 'India', displayName: 'Murud (Janjira), Maharashtra' },
  { city: 'Uran', state: 'Maharashtra', country: 'India', displayName: 'Uran, Maharashtra' },
  { city: 'Pali (Sudhagad)', state: 'Maharashtra', country: 'India', displayName: 'Pali (Sudhagad), Maharashtra' },
  { city: 'Ratnagiri', state: 'Maharashtra', country: 'India', displayName: 'Ratnagiri, Maharashtra' },
  { city: 'Chiplun', state: 'Maharashtra', country: 'India', displayName: 'Chiplun, Maharashtra' },
  { city: 'Khed (Ratnagiri)', state: 'Maharashtra', country: 'India', displayName: 'Khed (Ratnagiri), Maharashtra' },
  { city: 'Guhagar', state: 'Maharashtra', country: 'India', displayName: 'Guhagar, Maharashtra' },
  { city: 'Dapoli', state: 'Maharashtra', country: 'India', displayName: 'Dapoli, Maharashtra' },
  { city: 'Mandangad', state: 'Maharashtra', country: 'India', displayName: 'Mandangad, Maharashtra' },
  { city: 'Sangameshwar (Deorukh)', state: 'Maharashtra', country: 'India', displayName: 'Sangameshwar (Deorukh), Maharashtra' },
  { city: 'Deorukh', state: 'Maharashtra', country: 'India', displayName: 'Deorukh, Maharashtra' },
  { city: 'Rajapur', state: 'Maharashtra', country: 'India', displayName: 'Rajapur, Maharashtra' },
  { city: 'Lanja', state: 'Maharashtra', country: 'India', displayName: 'Lanja, Maharashtra' },
  { city: 'Ganpatipule', state: 'Maharashtra', country: 'India', displayName: 'Ganpatipule, Maharashtra' },
  { city: 'Kudal', state: 'Maharashtra', country: 'India', displayName: 'Kudal, Maharashtra' },
  { city: 'Kankavli', state: 'Maharashtra', country: 'India', displayName: 'Kankavli, Maharashtra' },
  { city: 'Sawantwadi', state: 'Maharashtra', country: 'India', displayName: 'Sawantwadi, Maharashtra' },
  { city: 'Malvan', state: 'Maharashtra', country: 'India', displayName: 'Malvan, Maharashtra' },
  { city: 'Vengurla', state: 'Maharashtra', country: 'India', displayName: 'Vengurla, Maharashtra' },
  { city: 'Devgad', state: 'Maharashtra', country: 'India', displayName: 'Devgad, Maharashtra' },
  { city: 'Vaibhavwadi', state: 'Maharashtra', country: 'India', displayName: 'Vaibhavwadi, Maharashtra' },
  { city: 'Dodamarg', state: 'Maharashtra', country: 'India', displayName: 'Dodamarg, Maharashtra' },
  { city: 'Chhatrapati Sambhaji Nagar (Aurangabad)', state: 'Maharashtra', country: 'India', displayName: 'Chhatrapati Sambhaji Nagar (Aurangabad), Maharashtra' },
  { city: 'Paithan', state: 'Maharashtra', country: 'India', displayName: 'Paithan, Maharashtra' },
  { city: 'Gangapur', state: 'Maharashtra', country: 'India', displayName: 'Gangapur, Maharashtra' },
  { city: 'Vaijapur', state: 'Maharashtra', country: 'India', displayName: 'Vaijapur, Maharashtra' },
  { city: 'Kannad', state: 'Maharashtra', country: 'India', displayName: 'Kannad, Maharashtra' },
  { city: 'Khuldabad', state: 'Maharashtra', country: 'India', displayName: 'Khuldabad, Maharashtra' },
  { city: 'Sillod', state: 'Maharashtra', country: 'India', displayName: 'Sillod, Maharashtra' },
  { city: 'Soegaon', state: 'Maharashtra', country: 'India', displayName: 'Soegaon, Maharashtra' },
  { city: 'Phulambri', state: 'Maharashtra', country: 'India', displayName: 'Phulambri, Maharashtra' },
  { city: 'Jalna', state: 'Maharashtra', country: 'India', displayName: 'Jalna, Maharashtra' },
  { city: 'Ambad', state: 'Maharashtra', country: 'India', displayName: 'Ambad, Maharashtra' },
  { city: 'Bhokardan', state: 'Maharashtra', country: 'India', displayName: 'Bhokardan, Maharashtra' },
  { city: 'Jafrabad', state: 'Maharashtra', country: 'India', displayName: 'Jafrabad, Maharashtra' },
  { city: 'Partur', state: 'Maharashtra', country: 'India', displayName: 'Partur, Maharashtra' },
  { city: 'Ghansawangi', state: 'Maharashtra', country: 'India', displayName: 'Ghansawangi, Maharashtra' },
  { city: 'Mantha', state: 'Maharashtra', country: 'India', displayName: 'Mantha, Maharashtra' },
  { city: 'Badnapur', state: 'Maharashtra', country: 'India', displayName: 'Badnapur, Maharashtra' },
  { city: 'Beed', state: 'Maharashtra', country: 'India', displayName: 'Beed, Maharashtra' },
  { city: 'Georai', state: 'Maharashtra', country: 'India', displayName: 'Georai, Maharashtra' },
  { city: 'Majalgaon', state: 'Maharashtra', country: 'India', displayName: 'Majalgaon, Maharashtra' },
  { city: 'Ambejogai', state: 'Maharashtra', country: 'India', displayName: 'Ambejogai, Maharashtra' },
  { city: 'Parli Vaijnath', state: 'Maharashtra', country: 'India', displayName: 'Parli Vaijnath, Maharashtra' },
  { city: 'Kaij', state: 'Maharashtra', country: 'India', displayName: 'Kaij, Maharashtra' },
  { city: 'Ashti (Beed)', state: 'Maharashtra', country: 'India', displayName: 'Ashti (Beed), Maharashtra' },
  { city: 'Patoda', state: 'Maharashtra', country: 'India', displayName: 'Patoda, Maharashtra' },
  { city: 'Shirur Kasar', state: 'Maharashtra', country: 'India', displayName: 'Shirur Kasar, Maharashtra' },
  { city: 'Wadwani', state: 'Maharashtra', country: 'India', displayName: 'Wadwani, Maharashtra' },
  { city: 'Dharur', state: 'Maharashtra', country: 'India', displayName: 'Dharur, Maharashtra' },
  { city: 'Dharashiv (Osmanabad)', state: 'Maharashtra', country: 'India', displayName: 'Dharashiv (Osmanabad), Maharashtra' },
  { city: 'Tuljapur', state: 'Maharashtra', country: 'India', displayName: 'Tuljapur, Maharashtra' },
  { city: 'Omerga', state: 'Maharashtra', country: 'India', displayName: 'Omerga, Maharashtra' },
  { city: 'Lohara', state: 'Maharashtra', country: 'India', displayName: 'Lohara, Maharashtra' },
  { city: 'Kalamb (Osmanabad)', state: 'Maharashtra', country: 'India', displayName: 'Kalamb (Osmanabad), Maharashtra' },
  { city: 'Paranda', state: 'Maharashtra', country: 'India', displayName: 'Paranda, Maharashtra' },
  { city: 'Bhoom', state: 'Maharashtra', country: 'India', displayName: 'Bhoom, Maharashtra' },
  { city: 'Washi (Osmanabad)', state: 'Maharashtra', country: 'India', displayName: 'Washi (Osmanabad), Maharashtra' },
  { city: 'Latur', state: 'Maharashtra', country: 'India', displayName: 'Latur, Maharashtra' },
  { city: 'Ausa', state: 'Maharashtra', country: 'India', displayName: 'Ausa, Maharashtra' },
  { city: 'Nilanga', state: 'Maharashtra', country: 'India', displayName: 'Nilanga, Maharashtra' },
  { city: 'Udgir', state: 'Maharashtra', country: 'India', displayName: 'Udgir, Maharashtra' },
  { city: 'Ahmedpur', state: 'Maharashtra', country: 'India', displayName: 'Ahmedpur, Maharashtra' },
  { city: 'Chakur', state: 'Maharashtra', country: 'India', displayName: 'Chakur, Maharashtra' },
  { city: 'Renapur', state: 'Maharashtra', country: 'India', displayName: 'Renapur, Maharashtra' },
  { city: 'Deoni', state: 'Maharashtra', country: 'India', displayName: 'Deoni, Maharashtra' },
  { city: 'Shirur Anantpal', state: 'Maharashtra', country: 'India', displayName: 'Shirur Anantpal, Maharashtra' },
  { city: 'Jalkot', state: 'Maharashtra', country: 'India', displayName: 'Jalkot, Maharashtra' },
  { city: 'Nanded', state: 'Maharashtra', country: 'India', displayName: 'Nanded, Maharashtra' },
  { city: 'Ardhapur', state: 'Maharashtra', country: 'India', displayName: 'Ardhapur, Maharashtra' },
  { city: 'Mudkhed', state: 'Maharashtra', country: 'India', displayName: 'Mudkhed, Maharashtra' },
  { city: 'Bhokar', state: 'Maharashtra', country: 'India', displayName: 'Bhokar, Maharashtra' },
  { city: 'Loha', state: 'Maharashtra', country: 'India', displayName: 'Loha, Maharashtra' },
  { city: 'Kandhar', state: 'Maharashtra', country: 'India', displayName: 'Kandhar, Maharashtra' },
  { city: 'Kinwat', state: 'Maharashtra', country: 'India', displayName: 'Kinwat, Maharashtra' },
  { city: 'Himayatnagar', state: 'Maharashtra', country: 'India', displayName: 'Himayatnagar, Maharashtra' },
  { city: 'Hadgaon', state: 'Maharashtra', country: 'India', displayName: 'Hadgaon, Maharashtra' },
  { city: 'Mahur', state: 'Maharashtra', country: 'India', displayName: 'Mahur, Maharashtra' },
  { city: 'Deglur', state: 'Maharashtra', country: 'India', displayName: 'Deglur, Maharashtra' },
  { city: 'Mukhed', state: 'Maharashtra', country: 'India', displayName: 'Mukhed, Maharashtra' },
  { city: 'Dharmabad', state: 'Maharashtra', country: 'India', displayName: 'Dharmabad, Maharashtra' },
  { city: 'Biloli', state: 'Maharashtra', country: 'India', displayName: 'Biloli, Maharashtra' },
  { city: 'Naigaon', state: 'Maharashtra', country: 'India', displayName: 'Naigaon, Maharashtra' },
  { city: 'Umri', state: 'Maharashtra', country: 'India', displayName: 'Umri, Maharashtra' },
  { city: 'Parbhani', state: 'Maharashtra', country: 'India', displayName: 'Parbhani, Maharashtra' },
  { city: 'Gangakhed', state: 'Maharashtra', country: 'India', displayName: 'Gangakhed, Maharashtra' },
  { city: 'Sonpeth', state: 'Maharashtra', country: 'India', displayName: 'Sonpeth, Maharashtra' },
  { city: 'Pathri', state: 'Maharashtra', country: 'India', displayName: 'Pathri, Maharashtra' },
  { city: 'Manwath', state: 'Maharashtra', country: 'India', displayName: 'Manwath, Maharashtra' },
  { city: 'Sailu', state: 'Maharashtra', country: 'India', displayName: 'Sailu, Maharashtra' },
  { city: 'Jintur', state: 'Maharashtra', country: 'India', displayName: 'Jintur, Maharashtra' },
  { city: 'Purna', state: 'Maharashtra', country: 'India', displayName: 'Purna, Maharashtra' },
  { city: 'Hingoli', state: 'Maharashtra', country: 'India', displayName: 'Hingoli, Maharashtra' },
  { city: 'Basmath', state: 'Maharashtra', country: 'India', displayName: 'Basmath, Maharashtra' },
  { city: 'Kalamnuri', state: 'Maharashtra', country: 'India', displayName: 'Kalamnuri, Maharashtra' },
  { city: 'Aundha Nagnath', state: 'Maharashtra', country: 'India', displayName: 'Aundha Nagnath, Maharashtra' },
  { city: 'Sengaon', state: 'Maharashtra', country: 'India', displayName: 'Sengaon, Maharashtra' },
  { city: 'Nagpur', state: 'Maharashtra', country: 'India', displayName: 'Nagpur, Maharashtra' },
  { city: 'Kamptee', state: 'Maharashtra', country: 'India', displayName: 'Kamptee, Maharashtra' },
  { city: 'Hingna', state: 'Maharashtra', country: 'India', displayName: 'Hingna, Maharashtra' },
  { city: 'Katol', state: 'Maharashtra', country: 'India', displayName: 'Katol, Maharashtra' },
  { city: 'Narkhed', state: 'Maharashtra', country: 'India', displayName: 'Narkhed, Maharashtra' },
  { city: 'Savner', state: 'Maharashtra', country: 'India', displayName: 'Savner, Maharashtra' },
  { city: 'Kalmeshwar', state: 'Maharashtra', country: 'India', displayName: 'Kalmeshwar, Maharashtra' },
  { city: 'Ramtek', state: 'Maharashtra', country: 'India', displayName: 'Ramtek, Maharashtra' },
  { city: 'Mouda', state: 'Maharashtra', country: 'India', displayName: 'Mouda, Maharashtra' },
  { city: 'Parseoni', state: 'Maharashtra', country: 'India', displayName: 'Parseoni, Maharashtra' },
  { city: 'Umred', state: 'Maharashtra', country: 'India', displayName: 'Umred, Maharashtra' },
  { city: 'Kuhi', state: 'Maharashtra', country: 'India', displayName: 'Kuhi, Maharashtra' },
  { city: 'Bhivapur', state: 'Maharashtra', country: 'India', displayName: 'Bhivapur, Maharashtra' },
  { city: 'Wardha', state: 'Maharashtra', country: 'India', displayName: 'Wardha, Maharashtra' },
  { city: 'Deoli', state: 'Maharashtra', country: 'India', displayName: 'Deoli, Maharashtra' },
  { city: 'Seloo', state: 'Maharashtra', country: 'India', displayName: 'Seloo, Maharashtra' },
  { city: 'Arvi', state: 'Maharashtra', country: 'India', displayName: 'Arvi, Maharashtra' },
  { city: 'Ashti (Wardha)', state: 'Maharashtra', country: 'India', displayName: 'Ashti (Wardha), Maharashtra' },
  { city: 'Karanja (Wardha)', state: 'Maharashtra', country: 'India', displayName: 'Karanja (Wardha), Maharashtra' },
  { city: 'Hinganghat', state: 'Maharashtra', country: 'India', displayName: 'Hinganghat, Maharashtra' },
  { city: 'Samudrapur', state: 'Maharashtra', country: 'India', displayName: 'Samudrapur, Maharashtra' },
  { city: 'Pulgaon', state: 'Maharashtra', country: 'India', displayName: 'Pulgaon, Maharashtra' },
  { city: 'Bhandara', state: 'Maharashtra', country: 'India', displayName: 'Bhandara, Maharashtra' },
  { city: 'Tumsar', state: 'Maharashtra', country: 'India', displayName: 'Tumsar, Maharashtra' },
  { city: 'Pauni', state: 'Maharashtra', country: 'India', displayName: 'Pauni, Maharashtra' },
  { city: 'Mohadi', state: 'Maharashtra', country: 'India', displayName: 'Mohadi, Maharashtra' },
  { city: 'Sakoli', state: 'Maharashtra', country: 'India', displayName: 'Sakoli, Maharashtra' },
  { city: 'Lakhani', state: 'Maharashtra', country: 'India', displayName: 'Lakhani, Maharashtra' },
  { city: 'Lakhandur', state: 'Maharashtra', country: 'India', displayName: 'Lakhandur, Maharashtra' },
  { city: 'Gondia', state: 'Maharashtra', country: 'India', displayName: 'Gondia, Maharashtra' },
  { city: 'Tirora', state: 'Maharashtra', country: 'India', displayName: 'Tirora, Maharashtra' },
  { city: 'Goregaon (Gondia)', state: 'Maharashtra', country: 'India', displayName: 'Goregaon (Gondia), Maharashtra' },
  { city: 'Amgaon', state: 'Maharashtra', country: 'India', displayName: 'Amgaon, Maharashtra' },
  { city: 'Salekasa', state: 'Maharashtra', country: 'India', displayName: 'Salekasa, Maharashtra' },
  { city: 'Sadak Arjuni', state: 'Maharashtra', country: 'India', displayName: 'Sadak Arjuni, Maharashtra' },
  { city: 'Arjuni Morgaon', state: 'Maharashtra', country: 'India', displayName: 'Arjuni Morgaon, Maharashtra' },
  { city: 'Deori', state: 'Maharashtra', country: 'India', displayName: 'Deori, Maharashtra' },
  { city: 'Chandrapur', state: 'Maharashtra', country: 'India', displayName: 'Chandrapur, Maharashtra' },
  { city: 'Warora', state: 'Maharashtra', country: 'India', displayName: 'Warora, Maharashtra' },
  { city: 'Bhadravati', state: 'Maharashtra', country: 'India', displayName: 'Bhadravati, Maharashtra' },
  { city: 'Chimur', state: 'Maharashtra', country: 'India', displayName: 'Chimur, Maharashtra' },
  { city: 'Nagbhid', state: 'Maharashtra', country: 'India', displayName: 'Nagbhid, Maharashtra' },
  { city: 'Sindewahi', state: 'Maharashtra', country: 'India', displayName: 'Sindewahi, Maharashtra' },
  { city: 'Brahmapuri', state: 'Maharashtra', country: 'India', displayName: 'Brahmapuri, Maharashtra' },
  { city: 'Mul', state: 'Maharashtra', country: 'India', displayName: 'Mul, Maharashtra' },
  { city: 'Ballarpur', state: 'Maharashtra', country: 'India', displayName: 'Ballarpur, Maharashtra' },
  { city: 'Rajura', state: 'Maharashtra', country: 'India', displayName: 'Rajura, Maharashtra' },
  { city: 'Gadchiroli', state: 'Maharashtra', country: 'India', displayName: 'Gadchiroli, Maharashtra' },
  { city: 'Chamorshi', state: 'Maharashtra', country: 'India', displayName: 'Chamorshi, Maharashtra' },
  { city: 'Armori', state: 'Maharashtra', country: 'India', displayName: 'Armori, Maharashtra' },
  { city: 'Kurkheda', state: 'Maharashtra', country: 'India', displayName: 'Kurkheda, Maharashtra' },
  { city: 'Desaiganj (Wadsa)', state: 'Maharashtra', country: 'India', displayName: 'Desaiganj (Wadsa), Maharashtra' },
  { city: 'Aheri', state: 'Maharashtra', country: 'India', displayName: 'Aheri, Maharashtra' },
  { city: 'Sironcha', state: 'Maharashtra', country: 'India', displayName: 'Sironcha, Maharashtra' },
  { city: 'Amravati', state: 'Maharashtra', country: 'India', displayName: 'Amravati, Maharashtra' },
  { city: 'Achalpur (Paratwada)', state: 'Maharashtra', country: 'India', displayName: 'Achalpur (Paratwada), Maharashtra' },
  { city: 'Chandur Bazar', state: 'Maharashtra', country: 'India', displayName: 'Chandur Bazar, Maharashtra' },
  { city: 'Morshi', state: 'Maharashtra', country: 'India', displayName: 'Morshi, Maharashtra' },
  { city: 'Warud', state: 'Maharashtra', country: 'India', displayName: 'Warud, Maharashtra' },
  { city: 'Daryapur', state: 'Maharashtra', country: 'India', displayName: 'Daryapur, Maharashtra' },
  { city: 'Anjangaon Surji', state: 'Maharashtra', country: 'India', displayName: 'Anjangaon Surji, Maharashtra' },
  { city: 'Chandur Railway', state: 'Maharashtra', country: 'India', displayName: 'Chandur Railway, Maharashtra' },
  { city: 'Dhamangaon Railway', state: 'Maharashtra', country: 'India', displayName: 'Dhamangaon Railway, Maharashtra' },
  { city: 'Dharni', state: 'Maharashtra', country: 'India', displayName: 'Dharni, Maharashtra' },
  { city: 'Chikhaldara', state: 'Maharashtra', country: 'India', displayName: 'Chikhaldara, Maharashtra' },
  { city: 'Tiwsa', state: 'Maharashtra', country: 'India', displayName: 'Tiwsa, Maharashtra' },
  { city: 'Akola', state: 'Maharashtra', country: 'India', displayName: 'Akola, Maharashtra' },
  { city: 'Murtizapur', state: 'Maharashtra', country: 'India', displayName: 'Murtizapur, Maharashtra' },
  { city: 'Akot', state: 'Maharashtra', country: 'India', displayName: 'Akot, Maharashtra' },
  { city: 'Balapur', state: 'Maharashtra', country: 'India', displayName: 'Balapur, Maharashtra' },
  { city: 'Patur', state: 'Maharashtra', country: 'India', displayName: 'Patur, Maharashtra' },
  { city: 'Telhara', state: 'Maharashtra', country: 'India', displayName: 'Telhara, Maharashtra' },
  { city: 'Buldhana', state: 'Maharashtra', country: 'India', displayName: 'Buldhana, Maharashtra' },
  { city: 'Chikhli', state: 'Maharashtra', country: 'India', displayName: 'Chikhli, Maharashtra' },
  { city: 'Mehkar', state: 'Maharashtra', country: 'India', displayName: 'Mehkar, Maharashtra' },
  { city: 'Khamgaon', state: 'Maharashtra', country: 'India', displayName: 'Khamgaon, Maharashtra' },
  { city: 'Malkapur (Buldhana)', state: 'Maharashtra', country: 'India', displayName: 'Malkapur (Buldhana), Maharashtra' },
  { city: 'Shegaon', state: 'Maharashtra', country: 'India', displayName: 'Shegaon, Maharashtra' },
  { city: 'Jalgaon Jamod', state: 'Maharashtra', country: 'India', displayName: 'Jalgaon Jamod, Maharashtra' },
  { city: 'Nandura', state: 'Maharashtra', country: 'India', displayName: 'Nandura, Maharashtra' },
  { city: 'Sindkhed Raja', state: 'Maharashtra', country: 'India', displayName: 'Sindkhed Raja, Maharashtra' },
  { city: 'Lonar', state: 'Maharashtra', country: 'India', displayName: 'Lonar, Maharashtra' },
  { city: 'Deulgaon Raja', state: 'Maharashtra', country: 'India', displayName: 'Deulgaon Raja, Maharashtra' },
  { city: 'Washim', state: 'Maharashtra', country: 'India', displayName: 'Washim, Maharashtra' },
  { city: 'Risod', state: 'Maharashtra', country: 'India', displayName: 'Risod, Maharashtra' },
  { city: 'Malegaon Jahangir', state: 'Maharashtra', country: 'India', displayName: 'Malegaon Jahangir, Maharashtra' },
  { city: 'Mangrulpir', state: 'Maharashtra', country: 'India', displayName: 'Mangrulpir, Maharashtra' },
  { city: 'Karanja Lad', state: 'Maharashtra', country: 'India', displayName: 'Karanja Lad, Maharashtra' },
  { city: 'Manora', state: 'Maharashtra', country: 'India', displayName: 'Manora, Maharashtra' },
  { city: 'Yavatmal', state: 'Maharashtra', country: 'India', displayName: 'Yavatmal, Maharashtra' },
  { city: 'Pusad', state: 'Maharashtra', country: 'India', displayName: 'Pusad, Maharashtra' },
  { city: 'Umarkhed', state: 'Maharashtra', country: 'India', displayName: 'Umarkhed, Maharashtra' },
  { city: 'Digras', state: 'Maharashtra', country: 'India', displayName: 'Digras, Maharashtra' },
  { city: 'Darwha', state: 'Maharashtra', country: 'India', displayName: 'Darwha, Maharashtra' },
  { city: 'Arni', state: 'Maharashtra', country: 'India', displayName: 'Arni, Maharashtra' },
  { city: 'Ghatanji', state: 'Maharashtra', country: 'India', displayName: 'Ghatanji, Maharashtra' },
  { city: 'Wani', state: 'Maharashtra', country: 'India', displayName: 'Wani, Maharashtra' },
  { city: 'Pandharkawada (Kelapur)', state: 'Maharashtra', country: 'India', displayName: 'Pandharkawada (Kelapur), Maharashtra' },
  { city: 'Ralegaon', state: 'Maharashtra', country: 'India', displayName: 'Ralegaon, Maharashtra' },
  { city: 'Jalgaon', state: 'Maharashtra', country: 'India', displayName: 'Jalgaon, Maharashtra' },
  { city: 'Bhusawal', state: 'Maharashtra', country: 'India', displayName: 'Bhusawal, Maharashtra' },
  { city: 'Chalisgaon', state: 'Maharashtra', country: 'India', displayName: 'Chalisgaon, Maharashtra' },
  { city: 'Pachora', state: 'Maharashtra', country: 'India', displayName: 'Pachora, Maharashtra' },
  { city: 'Amalner', state: 'Maharashtra', country: 'India', displayName: 'Amalner, Maharashtra' },
  { city: 'Chopda', state: 'Maharashtra', country: 'India', displayName: 'Chopda, Maharashtra' },
  { city: 'Raver', state: 'Maharashtra', country: 'India', displayName: 'Raver, Maharashtra' },
  { city: 'Yawal', state: 'Maharashtra', country: 'India', displayName: 'Yawal, Maharashtra' },
  { city: 'Jamner', state: 'Maharashtra', country: 'India', displayName: 'Jamner, Maharashtra' },
  { city: 'Erandol', state: 'Maharashtra', country: 'India', displayName: 'Erandol, Maharashtra' },
  { city: 'Parola', state: 'Maharashtra', country: 'India', displayName: 'Parola, Maharashtra' },
  { city: 'Dharangaon', state: 'Maharashtra', country: 'India', displayName: 'Dharangaon, Maharashtra' },
  { city: 'Muktainagar', state: 'Maharashtra', country: 'India', displayName: 'Muktainagar, Maharashtra' },
  { city: 'Bhadgaon', state: 'Maharashtra', country: 'India', displayName: 'Bhadgaon, Maharashtra' },
  { city: 'Bodwad', state: 'Maharashtra', country: 'India', displayName: 'Bodwad, Maharashtra' },
  { city: 'Dhule', state: 'Maharashtra', country: 'India', displayName: 'Dhule, Maharashtra' },
  { city: 'Shirpur', state: 'Maharashtra', country: 'India', displayName: 'Shirpur, Maharashtra' },
  { city: 'Sakri', state: 'Maharashtra', country: 'India', displayName: 'Sakri, Maharashtra' },
  { city: 'Sindkheda (Dondaicha)', state: 'Maharashtra', country: 'India', displayName: 'Sindkheda (Dondaicha), Maharashtra' },
  { city: 'Dondaicha', state: 'Maharashtra', country: 'India', displayName: 'Dondaicha, Maharashtra' },
  { city: 'Nandurbar', state: 'Maharashtra', country: 'India', displayName: 'Nandurbar, Maharashtra' },
  { city: 'Navapur', state: 'Maharashtra', country: 'India', displayName: 'Navapur, Maharashtra' },
  { city: 'Shahada', state: 'Maharashtra', country: 'India', displayName: 'Shahada, Maharashtra' },
  { city: 'Taloda', state: 'Maharashtra', country: 'India', displayName: 'Taloda, Maharashtra' },
  { city: 'Akkalkuwa', state: 'Maharashtra', country: 'India', displayName: 'Akkalkuwa, Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat', country: 'India', displayName: 'Ahmedabad, Gujarat' },
  { city: 'Surat', state: 'Gujarat', country: 'India', displayName: 'Surat, Gujarat' },
  { city: 'Vadodara (Baroda)', state: 'Gujarat', country: 'India', displayName: 'Vadodara (Baroda), Gujarat' },
  { city: 'Rajkot', state: 'Gujarat', country: 'India', displayName: 'Rajkot, Gujarat' },
  { city: 'Bhavnagar', state: 'Gujarat', country: 'India', displayName: 'Bhavnagar, Gujarat' },
  { city: 'Jamnagar', state: 'Gujarat', country: 'India', displayName: 'Jamnagar, Gujarat' },
  { city: 'Gandhinagar', state: 'Gujarat', country: 'India', displayName: 'Gandhinagar, Gujarat' },
  { city: 'Junagadh', state: 'Gujarat', country: 'India', displayName: 'Junagadh, Gujarat' },
  { city: 'Anand', state: 'Gujarat', country: 'India', displayName: 'Anand, Gujarat' },
  { city: 'Navsari', state: 'Gujarat', country: 'India', displayName: 'Navsari, Gujarat' },
  { city: 'Morbi', state: 'Gujarat', country: 'India', displayName: 'Morbi, Gujarat' },
  { city: 'Nadiad', state: 'Gujarat', country: 'India', displayName: 'Nadiad, Gujarat' },
  { city: 'Surendranagar', state: 'Gujarat', country: 'India', displayName: 'Surendranagar, Gujarat' },
  { city: 'Bharuch', state: 'Gujarat', country: 'India', displayName: 'Bharuch, Gujarat' },
  { city: 'Mehsana', state: 'Gujarat', country: 'India', displayName: 'Mehsana, Gujarat' },
  { city: 'Bhuj', state: 'Gujarat', country: 'India', displayName: 'Bhuj, Gujarat' },
  { city: 'Porbandar', state: 'Gujarat', country: 'India', displayName: 'Porbandar, Gujarat' },
  { city: 'Valsad', state: 'Gujarat', country: 'India', displayName: 'Valsad, Gujarat' },
  { city: 'Vapi', state: 'Gujarat', country: 'India', displayName: 'Vapi, Gujarat' },
  { city: 'Ankleshwar', state: 'Gujarat', country: 'India', displayName: 'Ankleshwar, Gujarat' },
  { city: 'Bardoli', state: 'Gujarat', country: 'India', displayName: 'Bardoli, Gujarat' },
  { city: 'Palanpur', state: 'Gujarat', country: 'India', displayName: 'Palanpur, Gujarat' },
  { city: 'Deesa', state: 'Gujarat', country: 'India', displayName: 'Deesa, Gujarat' },
  { city: 'Godhra', state: 'Gujarat', country: 'India', displayName: 'Godhra, Gujarat' },
  { city: 'Dahod', state: 'Gujarat', country: 'India', displayName: 'Dahod, Gujarat' },
  { city: 'Veraval (Somnath)', state: 'Gujarat', country: 'India', displayName: 'Veraval (Somnath), Gujarat' },
  { city: 'Somnath', state: 'Gujarat', country: 'India', displayName: 'Somnath, Gujarat' },
  { city: 'Dwarka', state: 'Gujarat', country: 'India', displayName: 'Dwarka, Gujarat' },
  { city: 'Gondal', state: 'Gujarat', country: 'India', displayName: 'Gondal, Gujarat' },
  { city: 'Jetpur', state: 'Gujarat', country: 'India', displayName: 'Jetpur, Gujarat' },
  { city: 'Botad', state: 'Gujarat', country: 'India', displayName: 'Botad, Gujarat' },
  { city: 'Amreli', state: 'Gujarat', country: 'India', displayName: 'Amreli, Gujarat' },
  { city: 'Mahuva', state: 'Gujarat', country: 'India', displayName: 'Mahuva, Gujarat' },
  { city: 'Dhoraji', state: 'Gujarat', country: 'India', displayName: 'Dhoraji, Gujarat' },
  { city: 'Upleta', state: 'Gujarat', country: 'India', displayName: 'Upleta, Gujarat' },
  { city: 'Patan', state: 'Gujarat', country: 'India', displayName: 'Patan, Gujarat' },
  { city: 'Siddhpur', state: 'Gujarat', country: 'India', displayName: 'Siddhpur, Gujarat' },
  { city: 'Visnagar', state: 'Gujarat', country: 'India', displayName: 'Visnagar, Gujarat' },
  { city: 'Vadnagar', state: 'Gujarat', country: 'India', displayName: 'Vadnagar, Gujarat' },
  { city: 'Unjha', state: 'Gujarat', country: 'India', displayName: 'Unjha, Gujarat' },
  { city: 'Kadi', state: 'Gujarat', country: 'India', displayName: 'Kadi, Gujarat' },
  { city: 'Kalol (Gandhinagar)', state: 'Gujarat', country: 'India', displayName: 'Kalol (Gandhinagar), Gujarat' },
  { city: 'Kalol (Panchmahal)', state: 'Gujarat', country: 'India', displayName: 'Kalol (Panchmahal), Gujarat' },
  { city: 'Himatnagar', state: 'Gujarat', country: 'India', displayName: 'Himatnagar, Gujarat' },
  { city: 'Idar', state: 'Gujarat', country: 'India', displayName: 'Idar, Gujarat' },
  { city: 'Modasa', state: 'Gujarat', country: 'India', displayName: 'Modasa, Gujarat' },
  { city: 'Vyara', state: 'Gujarat', country: 'India', displayName: 'Vyara, Gujarat' },
  { city: 'Songadh', state: 'Gujarat', country: 'India', displayName: 'Songadh, Gujarat' },
  { city: 'Chhota Udaipur', state: 'Gujarat', country: 'India', displayName: 'Chhota Udaipur, Gujarat' },
  { city: 'Dabhoi', state: 'Gujarat', country: 'India', displayName: 'Dabhoi, Gujarat' },
  { city: 'Halol', state: 'Gujarat', country: 'India', displayName: 'Halol, Gujarat' },
  { city: 'Mandvi (Kutch)', state: 'Gujarat', country: 'India', displayName: 'Mandvi (Kutch), Gujarat' },
  { city: 'Mandvi (Surat)', state: 'Gujarat', country: 'India', displayName: 'Mandvi (Surat), Gujarat' },
  { city: 'Mundra', state: 'Gujarat', country: 'India', displayName: 'Mundra, Gujarat' },
  { city: 'Gandhidham', state: 'Gujarat', country: 'India', displayName: 'Gandhidham, Gujarat' },
  { city: 'Anjar', state: 'Gujarat', country: 'India', displayName: 'Anjar, Gujarat' },
  { city: 'Sanand', state: 'Gujarat', country: 'India', displayName: 'Sanand, Gujarat' },
  { city: 'Dholka', state: 'Gujarat', country: 'India', displayName: 'Dholka, Gujarat' },
  { city: 'Viramgam', state: 'Gujarat', country: 'India', displayName: 'Viramgam, Gujarat' },
  { city: 'Dhrangadhra', state: 'Gujarat', country: 'India', displayName: 'Dhrangadhra, Gujarat' },
  { city: 'Wadhwan', state: 'Gujarat', country: 'India', displayName: 'Wadhwan, Gujarat' },
  { city: 'Limbdi', state: 'Gujarat', country: 'India', displayName: 'Limbdi, Gujarat' },
  { city: 'Chotila', state: 'Gujarat', country: 'India', displayName: 'Chotila, Gujarat' },
  { city: 'Wankaner', state: 'Gujarat', country: 'India', displayName: 'Wankaner, Gujarat' },
  { city: 'Halvad', state: 'Gujarat', country: 'India', displayName: 'Halvad, Gujarat' },
  { city: 'Talaja', state: 'Gujarat', country: 'India', displayName: 'Talaja, Gujarat' },
  { city: 'Palitana', state: 'Gujarat', country: 'India', displayName: 'Palitana, Gujarat' },
  { city: 'Sihor', state: 'Gujarat', country: 'India', displayName: 'Sihor, Gujarat' },
  { city: 'Keshod', state: 'Gujarat', country: 'India', displayName: 'Keshod, Gujarat' },
  { city: 'Manavadar', state: 'Gujarat', country: 'India', displayName: 'Manavadar, Gujarat' },
  { city: 'Una (Gir Somnath)', state: 'Gujarat', country: 'India', displayName: 'Una (Gir Somnath), Gujarat' },
  { city: 'Kodinar', state: 'Gujarat', country: 'India', displayName: 'Kodinar, Gujarat' },
  { city: 'Khambhat', state: 'Gujarat', country: 'India', displayName: 'Khambhat, Gujarat' },
  { city: 'Petlad', state: 'Gujarat', country: 'India', displayName: 'Petlad, Gujarat' },
  { city: 'Borsad', state: 'Gujarat', country: 'India', displayName: 'Borsad, Gujarat' },
  { city: 'Umreth', state: 'Gujarat', country: 'India', displayName: 'Umreth, Gujarat' },
  { city: 'Kapadvanj', state: 'Gujarat', country: 'India', displayName: 'Kapadvanj, Gujarat' },
  { city: 'Balasinor', state: 'Gujarat', country: 'India', displayName: 'Balasinor, Gujarat' },
  { city: 'Lunawada', state: 'Gujarat', country: 'India', displayName: 'Lunawada, Gujarat' },
  { city: 'Santrampur', state: 'Gujarat', country: 'India', displayName: 'Santrampur, Gujarat' },
  { city: 'Rajpipla', state: 'Gujarat', country: 'India', displayName: 'Rajpipla, Gujarat' },
  { city: 'Dediapada', state: 'Gujarat', country: 'India', displayName: 'Dediapada, Gujarat' },
  { city: 'Chikhli (Gujarat)', state: 'Gujarat', country: 'India', displayName: 'Chikhli (Gujarat), Gujarat' },
  { city: 'Bilimora', state: 'Gujarat', country: 'India', displayName: 'Bilimora, Gujarat' },
  { city: 'Umbergaon', state: 'Gujarat', country: 'India', displayName: 'Umbergaon, Gujarat' },
  { city: 'Dharampur', state: 'Gujarat', country: 'India', displayName: 'Dharampur, Gujarat' },
  { city: 'Radhanpur', state: 'Gujarat', country: 'India', displayName: 'Radhanpur, Gujarat' },
  { city: 'Harij', state: 'Gujarat', country: 'India', displayName: 'Harij, Gujarat' },
  { city: 'Dehgam', state: 'Gujarat', country: 'India', displayName: 'Dehgam, Gujarat' },
  { city: 'Mansa', state: 'Gujarat', country: 'India', displayName: 'Mansa, Gujarat' },
  { city: 'Bhiloda', state: 'Gujarat', country: 'India', displayName: 'Bhiloda, Gujarat' },
  { city: 'Meghraj', state: 'Gujarat', country: 'India', displayName: 'Meghraj, Gujarat' },
  { city: 'Jhagadia', state: 'Gujarat', country: 'India', displayName: 'Jhagadia, Gujarat' },
  { city: 'Amod', state: 'Gujarat', country: 'India', displayName: 'Amod, Gujarat' },
  { city: 'Jambusar', state: 'Gujarat', country: 'India', displayName: 'Jambusar, Gujarat' },
  { city: 'Padra', state: 'Gujarat', country: 'India', displayName: 'Padra, Gujarat' },
  { city: 'Karjan', state: 'Gujarat', country: 'India', displayName: 'Karjan, Gujarat' },
  { city: 'Savli', state: 'Gujarat', country: 'India', displayName: 'Savli, Gujarat' },
  { city: 'Bengaluru (Bangalore)', state: 'Karnataka', country: 'India', displayName: 'Bengaluru (Bangalore), Karnataka' },
  { city: 'Mysuru (Mysore)', state: 'Karnataka', country: 'India', displayName: 'Mysuru (Mysore), Karnataka' },
  { city: 'Mangaluru (Mangalore)', state: 'Karnataka', country: 'India', displayName: 'Mangaluru (Mangalore), Karnataka' },
  { city: 'Hubballi-Dharwad', state: 'Karnataka', country: 'India', displayName: 'Hubballi-Dharwad, Karnataka' },
  { city: 'Belagavi (Belgaum)', state: 'Karnataka', country: 'India', displayName: 'Belagavi (Belgaum), Karnataka' },
  { city: 'Kalaburagi (Gulbarga)', state: 'Karnataka', country: 'India', displayName: 'Kalaburagi (Gulbarga), Karnataka' },
  { city: 'Davanagere', state: 'Karnataka', country: 'India', displayName: 'Davanagere, Karnataka' },
  { city: 'Ballari (Bellary)', state: 'Karnataka', country: 'India', displayName: 'Ballari (Bellary), Karnataka' },
  { city: 'Vijayapura (Bijapur)', state: 'Karnataka', country: 'India', displayName: 'Vijayapura (Bijapur), Karnataka' },
  { city: 'Shivamogga (Shimoga)', state: 'Karnataka', country: 'India', displayName: 'Shivamogga (Shimoga), Karnataka' },
  { city: 'Tumakuru (Tumkur)', state: 'Karnataka', country: 'India', displayName: 'Tumakuru (Tumkur), Karnataka' },
  { city: 'Raichur', state: 'Karnataka', country: 'India', displayName: 'Raichur, Karnataka' },
  { city: 'Bidar', state: 'Karnataka', country: 'India', displayName: 'Bidar, Karnataka' },
  { city: 'Hospet (Hosapete)', state: 'Karnataka', country: 'India', displayName: 'Hospet (Hosapete), Karnataka' },
  { city: 'Udupi', state: 'Karnataka', country: 'India', displayName: 'Udupi, Karnataka' },
  { city: 'Hassan', state: 'Karnataka', country: 'India', displayName: 'Hassan, Karnataka' },
  { city: 'Bhadravathi', state: 'Karnataka', country: 'India', displayName: 'Bhadravathi, Karnataka' },
  { city: 'Chitradurga', state: 'Karnataka', country: 'India', displayName: 'Chitradurga, Karnataka' },
  { city: 'Kolar', state: 'Karnataka', country: 'India', displayName: 'Kolar, Karnataka' },
  { city: 'Mandya', state: 'Karnataka', country: 'India', displayName: 'Mandya, Karnataka' },
  { city: 'Chikkamagaluru', state: 'Karnataka', country: 'India', displayName: 'Chikkamagaluru, Karnataka' },
  { city: 'Bagalkot', state: 'Karnataka', country: 'India', displayName: 'Bagalkot, Karnataka' },
  { city: 'Ranebennur', state: 'Karnataka', country: 'India', displayName: 'Ranebennur, Karnataka' },
  { city: 'Gadag-Betageri', state: 'Karnataka', country: 'India', displayName: 'Gadag-Betageri, Karnataka' },
  { city: 'Gangavathi', state: 'Karnataka', country: 'India', displayName: 'Gangavathi, Karnataka' },
  { city: 'Sirsi', state: 'Karnataka', country: 'India', displayName: 'Sirsi, Karnataka' },
  { city: 'Karwar', state: 'Karnataka', country: 'India', displayName: 'Karwar, Karnataka' },
  { city: 'Bhatkal', state: 'Karnataka', country: 'India', displayName: 'Bhatkal, Karnataka' },
  { city: 'Kundapura', state: 'Karnataka', country: 'India', displayName: 'Kundapura, Karnataka' },
  { city: 'Puttur', state: 'Karnataka', country: 'India', displayName: 'Puttur, Karnataka' },
  { city: 'Bantwal', state: 'Karnataka', country: 'India', displayName: 'Bantwal, Karnataka' },
  { city: 'Karkala', state: 'Karnataka', country: 'India', displayName: 'Karkala, Karnataka' },
  { city: 'Moodbidri', state: 'Karnataka', country: 'India', displayName: 'Moodbidri, Karnataka' },
  { city: 'Chikkodi', state: 'Karnataka', country: 'India', displayName: 'Chikkodi, Karnataka' },
  { city: 'Gokak', state: 'Karnataka', country: 'India', displayName: 'Gokak, Karnataka' },
  { city: 'Athani', state: 'Karnataka', country: 'India', displayName: 'Athani, Karnataka' },
  { city: 'Nipani', state: 'Karnataka', country: 'India', displayName: 'Nipani, Karnataka' },
  { city: 'Bailhongal', state: 'Karnataka', country: 'India', displayName: 'Bailhongal, Karnataka' },
  { city: 'Sankeshwar', state: 'Karnataka', country: 'India', displayName: 'Sankeshwar, Karnataka' },
  { city: 'Jamkhandi', state: 'Karnataka', country: 'India', displayName: 'Jamkhandi, Karnataka' },
  { city: 'Mudhol', state: 'Karnataka', country: 'India', displayName: 'Mudhol, Karnataka' },
  { city: 'Ilkal', state: 'Karnataka', country: 'India', displayName: 'Ilkal, Karnataka' },
  { city: 'Badami', state: 'Karnataka', country: 'India', displayName: 'Badami, Karnataka' },
  { city: 'Guledgudda', state: 'Karnataka', country: 'India', displayName: 'Guledgudda, Karnataka' },
  { city: 'Rabkavi Banhatti', state: 'Karnataka', country: 'India', displayName: 'Rabkavi Banhatti, Karnataka' },
  { city: 'Sindhanur', state: 'Karnataka', country: 'India', displayName: 'Sindhanur, Karnataka' },
  { city: 'Manvi', state: 'Karnataka', country: 'India', displayName: 'Manvi, Karnataka' },
  { city: 'Lingasugur', state: 'Karnataka', country: 'India', displayName: 'Lingasugur, Karnataka' },
  { city: 'Basavakalyan', state: 'Karnataka', country: 'India', displayName: 'Basavakalyan, Karnataka' },
  { city: 'Humnabad', state: 'Karnataka', country: 'India', displayName: 'Humnabad, Karnataka' },
  { city: 'Bhalki', state: 'Karnataka', country: 'India', displayName: 'Bhalki, Karnataka' },
  { city: 'Aurad', state: 'Karnataka', country: 'India', displayName: 'Aurad, Karnataka' },
  { city: 'Indi', state: 'Karnataka', country: 'India', displayName: 'Indi, Karnataka' },
  { city: 'Sindgi', state: 'Karnataka', country: 'India', displayName: 'Sindgi, Karnataka' },
  { city: 'Muddebihal', state: 'Karnataka', country: 'India', displayName: 'Muddebihal, Karnataka' },
  { city: 'Basavana Bagewadi', state: 'Karnataka', country: 'India', displayName: 'Basavana Bagewadi, Karnataka' },
  { city: 'Talikoti', state: 'Karnataka', country: 'India', displayName: 'Talikoti, Karnataka' },
  { city: 'Koppal', state: 'Karnataka', country: 'India', displayName: 'Koppal, Karnataka' },
  { city: 'Kushtagi', state: 'Karnataka', country: 'India', displayName: 'Kushtagi, Karnataka' },
  { city: 'Yelburga', state: 'Karnataka', country: 'India', displayName: 'Yelburga, Karnataka' },
  { city: 'Haveri', state: 'Karnataka', country: 'India', displayName: 'Haveri, Karnataka' },
  { city: 'Byadgi', state: 'Karnataka', country: 'India', displayName: 'Byadgi, Karnataka' },
  { city: 'Hangal', state: 'Karnataka', country: 'India', displayName: 'Hangal, Karnataka' },
  { city: 'Shiggaon', state: 'Karnataka', country: 'India', displayName: 'Shiggaon, Karnataka' },
  { city: 'Challakere', state: 'Karnataka', country: 'India', displayName: 'Challakere, Karnataka' },
  { city: 'Hiriyur', state: 'Karnataka', country: 'India', displayName: 'Hiriyur, Karnataka' },
  { city: 'Hosadurga', state: 'Karnataka', country: 'India', displayName: 'Hosadurga, Karnataka' },
  { city: 'Tiptur', state: 'Karnataka', country: 'India', displayName: 'Tiptur, Karnataka' },
  { city: 'Madhugiri', state: 'Karnataka', country: 'India', displayName: 'Madhugiri, Karnataka' },
  { city: 'Sira', state: 'Karnataka', country: 'India', displayName: 'Sira, Karnataka' },
  { city: 'Kunigal', state: 'Karnataka', country: 'India', displayName: 'Kunigal, Karnataka' },
  { city: 'Channapatna', state: 'Karnataka', country: 'India', displayName: 'Channapatna, Karnataka' },
  { city: 'Ramanagara', state: 'Karnataka', country: 'India', displayName: 'Ramanagara, Karnataka' },
  { city: 'Kanakapura', state: 'Karnataka', country: 'India', displayName: 'Kanakapura, Karnataka' },
  { city: 'Magadi', state: 'Karnataka', country: 'India', displayName: 'Magadi, Karnataka' },
  { city: 'Maddur', state: 'Karnataka', country: 'India', displayName: 'Maddur, Karnataka' },
  { city: 'Malavalli', state: 'Karnataka', country: 'India', displayName: 'Malavalli, Karnataka' },
  { city: 'Srirangapatna', state: 'Karnataka', country: 'India', displayName: 'Srirangapatna, Karnataka' },
  { city: 'Pandavapura', state: 'Karnataka', country: 'India', displayName: 'Pandavapura, Karnataka' },
  { city: 'Channarayapatna', state: 'Karnataka', country: 'India', displayName: 'Channarayapatna, Karnataka' },
  { city: 'Arsikere', state: 'Karnataka', country: 'India', displayName: 'Arsikere, Karnataka' },
  { city: 'Sakleshpur', state: 'Karnataka', country: 'India', displayName: 'Sakleshpur, Karnataka' },
  { city: 'Holenarasipura', state: 'Karnataka', country: 'India', displayName: 'Holenarasipura, Karnataka' },
  { city: 'Belur', state: 'Karnataka', country: 'India', displayName: 'Belur, Karnataka' },
  { city: 'Tarikere', state: 'Karnataka', country: 'India', displayName: 'Tarikere, Karnataka' },
  { city: 'Kadur', state: 'Karnataka', country: 'India', displayName: 'Kadur, Karnataka' },
  { city: 'Mudigere', state: 'Karnataka', country: 'India', displayName: 'Mudigere, Karnataka' },
  { city: 'Sagar (Karnataka)', state: 'Karnataka', country: 'India', displayName: 'Sagar (Karnataka), Karnataka' },
  { city: 'Shikaripura', state: 'Karnataka', country: 'India', displayName: 'Shikaripura, Karnataka' },
  { city: 'Thirthahalli', state: 'Karnataka', country: 'India', displayName: 'Thirthahalli, Karnataka' },
  { city: 'Soraba', state: 'Karnataka', country: 'India', displayName: 'Soraba, Karnataka' },
  { city: 'Dandeli', state: 'Karnataka', country: 'India', displayName: 'Dandeli, Karnataka' },
  { city: 'Kumta', state: 'Karnataka', country: 'India', displayName: 'Kumta, Karnataka' },
  { city: 'Honnavar', state: 'Karnataka', country: 'India', displayName: 'Honnavar, Karnataka' },
  { city: 'Ankola', state: 'Karnataka', country: 'India', displayName: 'Ankola, Karnataka' },
  { city: 'Haliyal', state: 'Karnataka', country: 'India', displayName: 'Haliyal, Karnataka' },
  { city: 'Yellapur', state: 'Karnataka', country: 'India', displayName: 'Yellapur, Karnataka' },
  { city: 'Madikeri (Coorg)', state: 'Karnataka', country: 'India', displayName: 'Madikeri (Coorg), Karnataka' },
  { city: 'Somwarpet', state: 'Karnataka', country: 'India', displayName: 'Somwarpet, Karnataka' },
  { city: 'Virajpet', state: 'Karnataka', country: 'India', displayName: 'Virajpet, Karnataka' },
  { city: 'Kushalnagar', state: 'Karnataka', country: 'India', displayName: 'Kushalnagar, Karnataka' },
  { city: 'Chamarajanagar', state: 'Karnataka', country: 'India', displayName: 'Chamarajanagar, Karnataka' },
  { city: 'Kollegal', state: 'Karnataka', country: 'India', displayName: 'Kollegal, Karnataka' },
  { city: 'Gundlupet', state: 'Karnataka', country: 'India', displayName: 'Gundlupet, Karnataka' },
  { city: 'Chikkaballapur', state: 'Karnataka', country: 'India', displayName: 'Chikkaballapur, Karnataka' },
  { city: 'Gauribidanur', state: 'Karnataka', country: 'India', displayName: 'Gauribidanur, Karnataka' },
  { city: 'Chintamani', state: 'Karnataka', country: 'India', displayName: 'Chintamani, Karnataka' },
  { city: 'Bangarapet', state: 'Karnataka', country: 'India', displayName: 'Bangarapet, Karnataka' },
  { city: 'Kolar Gold Fields (KGF)', state: 'Karnataka', country: 'India', displayName: 'Kolar Gold Fields (KGF), Karnataka' },
  { city: 'Yadgir', state: 'Karnataka', country: 'India', displayName: 'Yadgir, Karnataka' },
  { city: 'Shahapur', state: 'Karnataka', country: 'India', displayName: 'Shahapur, Karnataka' },
  { city: 'Shorapur', state: 'Karnataka', country: 'India', displayName: 'Shorapur, Karnataka' },
  { city: 'Delhi', state: 'Delhi', country: 'India', displayName: 'Delhi, Delhi' },
  { city: 'New Delhi', state: 'Delhi', country: 'India', displayName: 'New Delhi, Delhi' },
  { city: 'Chandigarh', state: 'Chandigarh', country: 'India', displayName: 'Chandigarh, Chandigarh' },
  { city: 'Noida', state: 'Uttar Pradesh', country: 'India', displayName: 'Noida, Uttar Pradesh' },
  { city: 'Greater Noida', state: 'Uttar Pradesh', country: 'India', displayName: 'Greater Noida, Uttar Pradesh' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Ghaziabad, Uttar Pradesh' },
  { city: 'Gurugram (Gurgaon)', state: 'Haryana', country: 'India', displayName: 'Gurugram (Gurgaon), Haryana' },
  { city: 'Faridabad', state: 'Haryana', country: 'India', displayName: 'Faridabad, Haryana' },
  { city: 'Panipat', state: 'Haryana', country: 'India', displayName: 'Panipat, Haryana' },
  { city: 'Ambala', state: 'Haryana', country: 'India', displayName: 'Ambala, Haryana' },
  { city: 'Ambala Cantt', state: 'Haryana', country: 'India', displayName: 'Ambala Cantt, Haryana' },
  { city: 'Yamunanagar', state: 'Haryana', country: 'India', displayName: 'Yamunanagar, Haryana' },
  { city: 'Jagadhri', state: 'Haryana', country: 'India', displayName: 'Jagadhri, Haryana' },
  { city: 'Rohtak', state: 'Haryana', country: 'India', displayName: 'Rohtak, Haryana' },
  { city: 'Hisar', state: 'Haryana', country: 'India', displayName: 'Hisar, Haryana' },
  { city: 'Karnal', state: 'Haryana', country: 'India', displayName: 'Karnal, Haryana' },
  { city: 'Sonipat', state: 'Haryana', country: 'India', displayName: 'Sonipat, Haryana' },
  { city: 'Panchkula', state: 'Haryana', country: 'India', displayName: 'Panchkula, Haryana' },
  { city: 'Bhiwani', state: 'Haryana', country: 'India', displayName: 'Bhiwani, Haryana' },
  { city: 'Sirsa', state: 'Haryana', country: 'India', displayName: 'Sirsa, Haryana' },
  { city: 'Bahadurgarh', state: 'Haryana', country: 'India', displayName: 'Bahadurgarh, Haryana' },
  { city: 'Jind', state: 'Haryana', country: 'India', displayName: 'Jind, Haryana' },
  { city: 'Thanesar (Kurukshetra)', state: 'Haryana', country: 'India', displayName: 'Thanesar (Kurukshetra), Haryana' },
  { city: 'Kurukshetra', state: 'Haryana', country: 'India', displayName: 'Kurukshetra, Haryana' },
  { city: 'Kaithal', state: 'Haryana', country: 'India', displayName: 'Kaithal, Haryana' },
  { city: 'Rewari', state: 'Haryana', country: 'India', displayName: 'Rewari, Haryana' },
  { city: 'Palwal', state: 'Haryana', country: 'India', displayName: 'Palwal, Haryana' },
  { city: 'Hansi', state: 'Haryana', country: 'India', displayName: 'Hansi, Haryana' },
  { city: 'Narnaul', state: 'Haryana', country: 'India', displayName: 'Narnaul, Haryana' },
  { city: 'Fatehabad', state: 'Haryana', country: 'India', displayName: 'Fatehabad, Haryana' },
  { city: 'Tohana', state: 'Haryana', country: 'India', displayName: 'Tohana, Haryana' },
  { city: 'Ludhiana', state: 'Punjab', country: 'India', displayName: 'Ludhiana, Punjab' },
  { city: 'Amritsar', state: 'Punjab', country: 'India', displayName: 'Amritsar, Punjab' },
  { city: 'Jalandhar', state: 'Punjab', country: 'India', displayName: 'Jalandhar, Punjab' },
  { city: 'Patiala', state: 'Punjab', country: 'India', displayName: 'Patiala, Punjab' },
  { city: 'Bathinda', state: 'Punjab', country: 'India', displayName: 'Bathinda, Punjab' },
  { city: 'Mohali (SAS Nagar)', state: 'Punjab', country: 'India', displayName: 'Mohali (SAS Nagar), Punjab' },
  { city: 'Hoshiarpur', state: 'Punjab', country: 'India', displayName: 'Hoshiarpur, Punjab' },
  { city: 'Batala', state: 'Punjab', country: 'India', displayName: 'Batala, Punjab' },
  { city: 'Pathankot', state: 'Punjab', country: 'India', displayName: 'Pathankot, Punjab' },
  { city: 'Moga', state: 'Punjab', country: 'India', displayName: 'Moga, Punjab' },
  { city: 'Abohar', state: 'Punjab', country: 'India', displayName: 'Abohar, Punjab' },
  { city: 'Malerkotla', state: 'Punjab', country: 'India', displayName: 'Malerkotla, Punjab' },
  { city: 'Khanna', state: 'Punjab', country: 'India', displayName: 'Khanna, Punjab' },
  { city: 'Phagwara', state: 'Punjab', country: 'India', displayName: 'Phagwara, Punjab' },
  { city: 'Muktsar', state: 'Punjab', country: 'India', displayName: 'Muktsar, Punjab' },
  { city: 'Barnala', state: 'Punjab', country: 'India', displayName: 'Barnala, Punjab' },
  { city: 'Rajpura', state: 'Punjab', country: 'India', displayName: 'Rajpura, Punjab' },
  { city: 'Firozpur', state: 'Punjab', country: 'India', displayName: 'Firozpur, Punjab' },
  { city: 'Kapurthala', state: 'Punjab', country: 'India', displayName: 'Kapurthala, Punjab' },
  { city: 'Sunam', state: 'Punjab', country: 'India', displayName: 'Sunam, Punjab' },
  { city: 'Sangrur', state: 'Punjab', country: 'India', displayName: 'Sangrur, Punjab' },
  { city: 'Fazilka', state: 'Punjab', country: 'India', displayName: 'Fazilka, Punjab' },
  { city: 'Kotkapura', state: 'Punjab', country: 'India', displayName: 'Kotkapura, Punjab' },
  { city: 'Faridkot', state: 'Punjab', country: 'India', displayName: 'Faridkot, Punjab' },
  { city: 'Nabha', state: 'Punjab', country: 'India', displayName: 'Nabha, Punjab' },
  { city: 'Tarn Taran', state: 'Punjab', country: 'India', displayName: 'Tarn Taran, Punjab' },
  { city: 'Rupnagar (Ropar)', state: 'Punjab', country: 'India', displayName: 'Rupnagar (Ropar), Punjab' },
  { city: 'Jaipur', state: 'Rajasthan', country: 'India', displayName: 'Jaipur, Rajasthan' },
  { city: 'Jodhpur', state: 'Rajasthan', country: 'India', displayName: 'Jodhpur, Rajasthan' },
  { city: 'Kota', state: 'Rajasthan', country: 'India', displayName: 'Kota, Rajasthan' },
  { city: 'Bikaner', state: 'Rajasthan', country: 'India', displayName: 'Bikaner, Rajasthan' },
  { city: 'Ajmer', state: 'Rajasthan', country: 'India', displayName: 'Ajmer, Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan', country: 'India', displayName: 'Udaipur, Rajasthan' },
  { city: 'Bhilwara', state: 'Rajasthan', country: 'India', displayName: 'Bhilwara, Rajasthan' },
  { city: 'Alwar', state: 'Rajasthan', country: 'India', displayName: 'Alwar, Rajasthan' },
  { city: 'Bharatpur', state: 'Rajasthan', country: 'India', displayName: 'Bharatpur, Rajasthan' },
  { city: 'Sikar', state: 'Rajasthan', country: 'India', displayName: 'Sikar, Rajasthan' },
  { city: 'Pali', state: 'Rajasthan', country: 'India', displayName: 'Pali, Rajasthan' },
  { city: 'Sri Ganganagar', state: 'Rajasthan', country: 'India', displayName: 'Sri Ganganagar, Rajasthan' },
  { city: 'Chittorgarh', state: 'Rajasthan', country: 'India', displayName: 'Chittorgarh, Rajasthan' },
  { city: 'Hanumangarh', state: 'Rajasthan', country: 'India', displayName: 'Hanumangarh, Rajasthan' },
  { city: 'Kishangarh', state: 'Rajasthan', country: 'India', displayName: 'Kishangarh, Rajasthan' },
  { city: 'Beawar', state: 'Rajasthan', country: 'India', displayName: 'Beawar, Rajasthan' },
  { city: 'Tonk', state: 'Rajasthan', country: 'India', displayName: 'Tonk, Rajasthan' },
  { city: 'Dausa', state: 'Rajasthan', country: 'India', displayName: 'Dausa, Rajasthan' },
  { city: 'Sawai Madhopur', state: 'Rajasthan', country: 'India', displayName: 'Sawai Madhopur, Rajasthan' },
  { city: 'Jhunjhunu', state: 'Rajasthan', country: 'India', displayName: 'Jhunjhunu, Rajasthan' },
  { city: 'Churu', state: 'Rajasthan', country: 'India', displayName: 'Churu, Rajasthan' },
  { city: 'Barmer', state: 'Rajasthan', country: 'India', displayName: 'Barmer, Rajasthan' },
  { city: 'Jaisalmer', state: 'Rajasthan', country: 'India', displayName: 'Jaisalmer, Rajasthan' },
  { city: 'Nagaur', state: 'Rajasthan', country: 'India', displayName: 'Nagaur, Rajasthan' },
  { city: 'Makrana', state: 'Rajasthan', country: 'India', displayName: 'Makrana, Rajasthan' },
  { city: 'Didwana', state: 'Rajasthan', country: 'India', displayName: 'Didwana, Rajasthan' },
  { city: 'Kuchaman City', state: 'Rajasthan', country: 'India', displayName: 'Kuchaman City, Rajasthan' },
  { city: 'Sujangarh', state: 'Rajasthan', country: 'India', displayName: 'Sujangarh, Rajasthan' },
  { city: 'Sardarshahar', state: 'Rajasthan', country: 'India', displayName: 'Sardarshahar, Rajasthan' },
  { city: 'Ratangarh', state: 'Rajasthan', country: 'India', displayName: 'Ratangarh, Rajasthan' },
  { city: 'Fatehpur (Rajasthan)', state: 'Rajasthan', country: 'India', displayName: 'Fatehpur (Rajasthan), Rajasthan' },
  { city: 'Neem Ka Thana', state: 'Rajasthan', country: 'India', displayName: 'Neem Ka Thana, Rajasthan' },
  { city: 'Nawalgarh', state: 'Rajasthan', country: 'India', displayName: 'Nawalgarh, Rajasthan' },
  { city: 'Chirawa', state: 'Rajasthan', country: 'India', displayName: 'Chirawa, Rajasthan' },
  { city: 'Hindaun', state: 'Rajasthan', country: 'India', displayName: 'Hindaun, Rajasthan' },
  { city: 'Gangapur City', state: 'Rajasthan', country: 'India', displayName: 'Gangapur City, Rajasthan' },
  { city: 'Dholpur', state: 'Rajasthan', country: 'India', displayName: 'Dholpur, Rajasthan' },
  { city: 'Bari', state: 'Rajasthan', country: 'India', displayName: 'Bari, Rajasthan' },
  { city: 'Karanpur', state: 'Rajasthan', country: 'India', displayName: 'Karanpur, Rajasthan' },
  { city: 'Suratgarh', state: 'Rajasthan', country: 'India', displayName: 'Suratgarh, Rajasthan' },
  { city: 'Anupgarh', state: 'Rajasthan', country: 'India', displayName: 'Anupgarh, Rajasthan' },
  { city: 'Nohar', state: 'Rajasthan', country: 'India', displayName: 'Nohar, Rajasthan' },
  { city: 'Bhadra', state: 'Rajasthan', country: 'India', displayName: 'Bhadra, Rajasthan' },
  { city: 'Rawatsar', state: 'Rajasthan', country: 'India', displayName: 'Rawatsar, Rajasthan' },
  { city: 'Bhiwadi', state: 'Rajasthan', country: 'India', displayName: 'Bhiwadi, Rajasthan' },
  { city: 'Neemrana', state: 'Rajasthan', country: 'India', displayName: 'Neemrana, Rajasthan' },
  { city: 'Behror', state: 'Rajasthan', country: 'India', displayName: 'Behror, Rajasthan' },
  { city: 'Tijara', state: 'Rajasthan', country: 'India', displayName: 'Tijara, Rajasthan' },
  { city: 'Kotputli', state: 'Rajasthan', country: 'India', displayName: 'Kotputli, Rajasthan' },
  { city: 'Chomu', state: 'Rajasthan', country: 'India', displayName: 'Chomu, Rajasthan' },
  { city: 'Pushkar', state: 'Rajasthan', country: 'India', displayName: 'Pushkar, Rajasthan' },
  { city: 'Nathdwara', state: 'Rajasthan', country: 'India', displayName: 'Nathdwara, Rajasthan' },
  { city: 'Kankroli (Rajsamand)', state: 'Rajasthan', country: 'India', displayName: 'Kankroli (Rajsamand), Rajasthan' },
  { city: 'Rajsamand', state: 'Rajasthan', country: 'India', displayName: 'Rajsamand, Rajasthan' },
  { city: 'Abu Road', state: 'Rajasthan', country: 'India', displayName: 'Abu Road, Rajasthan' },
  { city: 'Mount Abu', state: 'Rajasthan', country: 'India', displayName: 'Mount Abu, Rajasthan' },
  { city: 'Sirohi', state: 'Rajasthan', country: 'India', displayName: 'Sirohi, Rajasthan' },
  { city: 'Jalore', state: 'Rajasthan', country: 'India', displayName: 'Jalore, Rajasthan' },
  { city: 'Bhinmal', state: 'Rajasthan', country: 'India', displayName: 'Bhinmal, Rajasthan' },
  { city: 'Balotra', state: 'Rajasthan', country: 'India', displayName: 'Balotra, Rajasthan' },
  { city: 'Banswara', state: 'Rajasthan', country: 'India', displayName: 'Banswara, Rajasthan' },
  { city: 'Dungarpur', state: 'Rajasthan', country: 'India', displayName: 'Dungarpur, Rajasthan' },
  { city: 'Sagwara', state: 'Rajasthan', country: 'India', displayName: 'Sagwara, Rajasthan' },
  { city: 'Pratapgarh (Rajasthan)', state: 'Rajasthan', country: 'India', displayName: 'Pratapgarh (Rajasthan), Rajasthan' },
  { city: 'Nimbahera', state: 'Rajasthan', country: 'India', displayName: 'Nimbahera, Rajasthan' },
  { city: 'Rawatbhata', state: 'Rajasthan', country: 'India', displayName: 'Rawatbhata, Rajasthan' },
  { city: 'Deoli', state: 'Rajasthan', country: 'India', displayName: 'Deoli, Rajasthan' },
  { city: 'Malpura', state: 'Rajasthan', country: 'India', displayName: 'Malpura, Rajasthan' },
  { city: 'Bandikui', state: 'Rajasthan', country: 'India', displayName: 'Bandikui, Rajasthan' },
  { city: 'Lalsot', state: 'Rajasthan', country: 'India', displayName: 'Lalsot, Rajasthan' },
  { city: 'Sojat', state: 'Rajasthan', country: 'India', displayName: 'Sojat, Rajasthan' },
  { city: 'Sumerpur', state: 'Rajasthan', country: 'India', displayName: 'Sumerpur, Rajasthan' },
  { city: 'Falna', state: 'Rajasthan', country: 'India', displayName: 'Falna, Rajasthan' },
  { city: 'Indore', state: 'Madhya Pradesh', country: 'India', displayName: 'Indore, Madhya Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh', country: 'India', displayName: 'Bhopal, Madhya Pradesh' },
  { city: 'Jabalpur', state: 'Madhya Pradesh', country: 'India', displayName: 'Jabalpur, Madhya Pradesh' },
  { city: 'Gwalior', state: 'Madhya Pradesh', country: 'India', displayName: 'Gwalior, Madhya Pradesh' },
  { city: 'Ujjain', state: 'Madhya Pradesh', country: 'India', displayName: 'Ujjain, Madhya Pradesh' },
  { city: 'Sagar', state: 'Madhya Pradesh', country: 'India', displayName: 'Sagar, Madhya Pradesh' },
  { city: 'Dewas', state: 'Madhya Pradesh', country: 'India', displayName: 'Dewas, Madhya Pradesh' },
  { city: 'Satna', state: 'Madhya Pradesh', country: 'India', displayName: 'Satna, Madhya Pradesh' },
  { city: 'Ratlam', state: 'Madhya Pradesh', country: 'India', displayName: 'Ratlam, Madhya Pradesh' },
  { city: 'Rewa', state: 'Madhya Pradesh', country: 'India', displayName: 'Rewa, Madhya Pradesh' },
  { city: 'Singrauli', state: 'Madhya Pradesh', country: 'India', displayName: 'Singrauli, Madhya Pradesh' },
  { city: 'Burhanpur', state: 'Madhya Pradesh', country: 'India', displayName: 'Burhanpur, Madhya Pradesh' },
  { city: 'Khandwa', state: 'Madhya Pradesh', country: 'India', displayName: 'Khandwa, Madhya Pradesh' },
  { city: 'Chhindwara', state: 'Madhya Pradesh', country: 'India', displayName: 'Chhindwara, Madhya Pradesh' },
  { city: 'Morena', state: 'Madhya Pradesh', country: 'India', displayName: 'Morena, Madhya Pradesh' },
  { city: 'Bhind', state: 'Madhya Pradesh', country: 'India', displayName: 'Bhind, Madhya Pradesh' },
  { city: 'Guna', state: 'Madhya Pradesh', country: 'India', displayName: 'Guna, Madhya Pradesh' },
  { city: 'Shivpuri', state: 'Madhya Pradesh', country: 'India', displayName: 'Shivpuri, Madhya Pradesh' },
  { city: 'Vidisha', state: 'Madhya Pradesh', country: 'India', displayName: 'Vidisha, Madhya Pradesh' },
  { city: 'Damoh', state: 'Madhya Pradesh', country: 'India', displayName: 'Damoh, Madhya Pradesh' },
  { city: 'Chhatarpur', state: 'Madhya Pradesh', country: 'India', displayName: 'Chhatarpur, Madhya Pradesh' },
  { city: 'Mandsaur', state: 'Madhya Pradesh', country: 'India', displayName: 'Mandsaur, Madhya Pradesh' },
  { city: 'Khargone', state: 'Madhya Pradesh', country: 'India', displayName: 'Khargone, Madhya Pradesh' },
  { city: 'Neemuch', state: 'Madhya Pradesh', country: 'India', displayName: 'Neemuch, Madhya Pradesh' },
  { city: 'Pithampur', state: 'Madhya Pradesh', country: 'India', displayName: 'Pithampur, Madhya Pradesh' },
  { city: 'Hoshangabad (Narmadapuram)', state: 'Madhya Pradesh', country: 'India', displayName: 'Hoshangabad (Narmadapuram), Madhya Pradesh' },
  { city: 'Itarsi', state: 'Madhya Pradesh', country: 'India', displayName: 'Itarsi, Madhya Pradesh' },
  { city: 'Sehore', state: 'Madhya Pradesh', country: 'India', displayName: 'Sehore, Madhya Pradesh' },
  { city: 'Betul', state: 'Madhya Pradesh', country: 'India', displayName: 'Betul, Madhya Pradesh' },
  { city: 'Seoni', state: 'Madhya Pradesh', country: 'India', displayName: 'Seoni, Madhya Pradesh' },
  { city: 'Datia', state: 'Madhya Pradesh', country: 'India', displayName: 'Datia, Madhya Pradesh' },
  { city: 'Nagda', state: 'Madhya Pradesh', country: 'India', displayName: 'Nagda, Madhya Pradesh' },
  { city: 'Dhar', state: 'Madhya Pradesh', country: 'India', displayName: 'Dhar, Madhya Pradesh' },
  { city: 'Alirajpur', state: 'Madhya Pradesh', country: 'India', displayName: 'Alirajpur, Madhya Pradesh' },
  { city: 'Jhabua', state: 'Madhya Pradesh', country: 'India', displayName: 'Jhabua, Madhya Pradesh' },
  { city: 'Barwani', state: 'Madhya Pradesh', country: 'India', displayName: 'Barwani, Madhya Pradesh' },
  { city: 'Sendhwa', state: 'Madhya Pradesh', country: 'India', displayName: 'Sendhwa, Madhya Pradesh' },
  { city: 'Sanawad', state: 'Madhya Pradesh', country: 'India', displayName: 'Sanawad, Madhya Pradesh' },
  { city: 'Maheshwar', state: 'Madhya Pradesh', country: 'India', displayName: 'Maheshwar, Madhya Pradesh' },
  { city: 'Badnawar', state: 'Madhya Pradesh', country: 'India', displayName: 'Badnawar, Madhya Pradesh' },
  { city: 'Mhow (Dr. Ambedkar Nagar)', state: 'Madhya Pradesh', country: 'India', displayName: 'Mhow (Dr. Ambedkar Nagar), Madhya Pradesh' },
  { city: 'Pachmarhi', state: 'Madhya Pradesh', country: 'India', displayName: 'Pachmarhi, Madhya Pradesh' },
  { city: 'Pipariya', state: 'Madhya Pradesh', country: 'India', displayName: 'Pipariya, Madhya Pradesh' },
  { city: 'Bina', state: 'Madhya Pradesh', country: 'India', displayName: 'Bina, Madhya Pradesh' },
  { city: 'Khurai', state: 'Madhya Pradesh', country: 'India', displayName: 'Khurai, Madhya Pradesh' },
  { city: 'Maihar', state: 'Madhya Pradesh', country: 'India', displayName: 'Maihar, Madhya Pradesh' },
  { city: 'Omkareshwar', state: 'Madhya Pradesh', country: 'India', displayName: 'Omkareshwar, Madhya Pradesh' },
  { city: 'Ashta', state: 'Madhya Pradesh', country: 'India', displayName: 'Ashta, Madhya Pradesh' },
  { city: 'Shajapur', state: 'Madhya Pradesh', country: 'India', displayName: 'Shajapur, Madhya Pradesh' },
  { city: 'Agar Malwa', state: 'Madhya Pradesh', country: 'India', displayName: 'Agar Malwa, Madhya Pradesh' },
  { city: 'Sarangpur', state: 'Madhya Pradesh', country: 'India', displayName: 'Sarangpur, Madhya Pradesh' },
  { city: 'Biaora', state: 'Madhya Pradesh', country: 'India', displayName: 'Biaora, Madhya Pradesh' },
  { city: 'Rajgarh (Biaora)', state: 'Madhya Pradesh', country: 'India', displayName: 'Rajgarh (Biaora), Madhya Pradesh' },
  { city: 'Raghogarh', state: 'Madhya Pradesh', country: 'India', displayName: 'Raghogarh, Madhya Pradesh' },
  { city: 'Chachoura', state: 'Madhya Pradesh', country: 'India', displayName: 'Chachoura, Madhya Pradesh' },
  { city: 'Kolaras', state: 'Madhya Pradesh', country: 'India', displayName: 'Kolaras, Madhya Pradesh' },
  { city: 'Dabra', state: 'Madhya Pradesh', country: 'India', displayName: 'Dabra, Madhya Pradesh' },
  { city: 'Ambikapur', state: 'Madhya Pradesh', country: 'India', displayName: 'Ambikapur, Madhya Pradesh' },
  { city: 'Sheopur', state: 'Madhya Pradesh', country: 'India', displayName: 'Sheopur, Madhya Pradesh' },
  { city: 'Tikamgarh', state: 'Madhya Pradesh', country: 'India', displayName: 'Tikamgarh, Madhya Pradesh' },
  { city: 'Niwari', state: 'Madhya Pradesh', country: 'India', displayName: 'Niwari, Madhya Pradesh' },
  { city: 'Orchha', state: 'Madhya Pradesh', country: 'India', displayName: 'Orchha, Madhya Pradesh' },
  { city: 'Panna', state: 'Madhya Pradesh', country: 'India', displayName: 'Panna, Madhya Pradesh' },
  { city: 'Balaghat', state: 'Madhya Pradesh', country: 'India', displayName: 'Balaghat, Madhya Pradesh' },
  { city: 'Waraseoni', state: 'Madhya Pradesh', country: 'India', displayName: 'Waraseoni, Madhya Pradesh' },
  { city: 'Mandla', state: 'Madhya Pradesh', country: 'India', displayName: 'Mandla, Madhya Pradesh' },
  { city: 'Dindori (MP)', state: 'Madhya Pradesh', country: 'India', displayName: 'Dindori (MP), Madhya Pradesh' },
  { city: 'Shahdol', state: 'Madhya Pradesh', country: 'India', displayName: 'Shahdol, Madhya Pradesh' },
  { city: 'Umaria', state: 'Madhya Pradesh', country: 'India', displayName: 'Umaria, Madhya Pradesh' },
  { city: 'Anuppur', state: 'Madhya Pradesh', country: 'India', displayName: 'Anuppur, Madhya Pradesh' },
  { city: 'Amarkantak', state: 'Madhya Pradesh', country: 'India', displayName: 'Amarkantak, Madhya Pradesh' },
  { city: 'Sidhi', state: 'Madhya Pradesh', country: 'India', displayName: 'Sidhi, Madhya Pradesh' },
  { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India', displayName: 'Lucknow, Uttar Pradesh' },
  { city: 'Kanpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Kanpur, Uttar Pradesh' },
  { city: 'Varanasi (Kashi / Banaras)', state: 'Uttar Pradesh', country: 'India', displayName: 'Varanasi (Kashi / Banaras), Uttar Pradesh' },
  { city: 'Agra', state: 'Uttar Pradesh', country: 'India', displayName: 'Agra, Uttar Pradesh' },
  { city: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', country: 'India', displayName: 'Prayagraj (Allahabad), Uttar Pradesh' },
  { city: 'Meerut', state: 'Uttar Pradesh', country: 'India', displayName: 'Meerut, Uttar Pradesh' },
  { city: 'Bareilly', state: 'Uttar Pradesh', country: 'India', displayName: 'Bareilly, Uttar Pradesh' },
  { city: 'Aligarh', state: 'Uttar Pradesh', country: 'India', displayName: 'Aligarh, Uttar Pradesh' },
  { city: 'Moradabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Moradabad, Uttar Pradesh' },
  { city: 'Saharanpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Saharanpur, Uttar Pradesh' },
  { city: 'Gorakhpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Gorakhpur, Uttar Pradesh' },
  { city: 'Firozabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Firozabad, Uttar Pradesh' },
  { city: 'Jhansi', state: 'Uttar Pradesh', country: 'India', displayName: 'Jhansi, Uttar Pradesh' },
  { city: 'Muzaffarnagar', state: 'Uttar Pradesh', country: 'India', displayName: 'Muzaffarnagar, Uttar Pradesh' },
  { city: 'Mathura', state: 'Uttar Pradesh', country: 'India', displayName: 'Mathura, Uttar Pradesh' },
  { city: 'Vrindavan', state: 'Uttar Pradesh', country: 'India', displayName: 'Vrindavan, Uttar Pradesh' },
  { city: 'Ayodhya', state: 'Uttar Pradesh', country: 'India', displayName: 'Ayodhya, Uttar Pradesh' },
  { city: 'Faizabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Faizabad, Uttar Pradesh' },
  { city: 'Budaun', state: 'Uttar Pradesh', country: 'India', displayName: 'Budaun, Uttar Pradesh' },
  { city: 'Rampur', state: 'Uttar Pradesh', country: 'India', displayName: 'Rampur, Uttar Pradesh' },
  { city: 'Shahjahanpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Shahjahanpur, Uttar Pradesh' },
  { city: 'Farrukhabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Farrukhabad, Uttar Pradesh' },
  { city: 'Fatehgarh', state: 'Uttar Pradesh', country: 'India', displayName: 'Fatehgarh, Uttar Pradesh' },
  { city: 'Maunath Bhanjan (Mau)', state: 'Uttar Pradesh', country: 'India', displayName: 'Maunath Bhanjan (Mau), Uttar Pradesh' },
  { city: 'Hapur', state: 'Uttar Pradesh', country: 'India', displayName: 'Hapur, Uttar Pradesh' },
  { city: 'Etawah', state: 'Uttar Pradesh', country: 'India', displayName: 'Etawah, Uttar Pradesh' },
  { city: 'Mirzapur', state: 'Uttar Pradesh', country: 'India', displayName: 'Mirzapur, Uttar Pradesh' },
  { city: 'Bulandshahr', state: 'Uttar Pradesh', country: 'India', displayName: 'Bulandshahr, Uttar Pradesh' },
  { city: 'Sambhal', state: 'Uttar Pradesh', country: 'India', displayName: 'Sambhal, Uttar Pradesh' },
  { city: 'Amroha', state: 'Uttar Pradesh', country: 'India', displayName: 'Amroha, Uttar Pradesh' },
  { city: 'Hardoi', state: 'Uttar Pradesh', country: 'India', displayName: 'Hardoi, Uttar Pradesh' },
  { city: 'Fatehpur (UP)', state: 'Uttar Pradesh', country: 'India', displayName: 'Fatehpur (UP), Uttar Pradesh' },
  { city: 'Raebareli', state: 'Uttar Pradesh', country: 'India', displayName: 'Raebareli, Uttar Pradesh' },
  { city: 'Orai (Jalaun)', state: 'Uttar Pradesh', country: 'India', displayName: 'Orai (Jalaun), Uttar Pradesh' },
  { city: 'Sitapur', state: 'Uttar Pradesh', country: 'India', displayName: 'Sitapur, Uttar Pradesh' },
  { city: 'Bahraich', state: 'Uttar Pradesh', country: 'India', displayName: 'Bahraich, Uttar Pradesh' },
  { city: 'Modinagar', state: 'Uttar Pradesh', country: 'India', displayName: 'Modinagar, Uttar Pradesh' },
  { city: 'Unnao', state: 'Uttar Pradesh', country: 'India', displayName: 'Unnao, Uttar Pradesh' },
  { city: 'Jaunpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Jaunpur, Uttar Pradesh' },
  { city: 'Lakhimpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Lakhimpur, Uttar Pradesh' },
  { city: 'Hathras', state: 'Uttar Pradesh', country: 'India', displayName: 'Hathras, Uttar Pradesh' },
  { city: 'Banda', state: 'Uttar Pradesh', country: 'India', displayName: 'Banda, Uttar Pradesh' },
  { city: 'Pilibhit', state: 'Uttar Pradesh', country: 'India', displayName: 'Pilibhit, Uttar Pradesh' },
  { city: 'Barabanki', state: 'Uttar Pradesh', country: 'India', displayName: 'Barabanki, Uttar Pradesh' },
  { city: 'Khurja', state: 'Uttar Pradesh', country: 'India', displayName: 'Khurja, Uttar Pradesh' },
  { city: 'Gonda', state: 'Uttar Pradesh', country: 'India', displayName: 'Gonda, Uttar Pradesh' },
  { city: 'Mainpuri', state: 'Uttar Pradesh', country: 'India', displayName: 'Mainpuri, Uttar Pradesh' },
  { city: 'Lalitpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Lalitpur, Uttar Pradesh' },
  { city: 'Etah', state: 'Uttar Pradesh', country: 'India', displayName: 'Etah, Uttar Pradesh' },
  { city: 'Deoria', state: 'Uttar Pradesh', country: 'India', displayName: 'Deoria, Uttar Pradesh' },
  { city: 'Ghazipur', state: 'Uttar Pradesh', country: 'India', displayName: 'Ghazipur, Uttar Pradesh' },
  { city: 'Sultanpur', state: 'Uttar Pradesh', country: 'India', displayName: 'Sultanpur, Uttar Pradesh' },
  { city: 'Azamgarh', state: 'Uttar Pradesh', country: 'India', displayName: 'Azamgarh, Uttar Pradesh' },
  { city: 'Bijnor', state: 'Uttar Pradesh', country: 'India', displayName: 'Bijnor, Uttar Pradesh' },
  { city: 'Basti', state: 'Uttar Pradesh', country: 'India', displayName: 'Basti, Uttar Pradesh' },
  { city: 'Chandausi', state: 'Uttar Pradesh', country: 'India', displayName: 'Chandausi, Uttar Pradesh' },
  { city: 'Akbarpur (Ambedkar Nagar)', state: 'Uttar Pradesh', country: 'India', displayName: 'Akbarpur (Ambedkar Nagar), Uttar Pradesh' },
  { city: 'Ballia', state: 'Uttar Pradesh', country: 'India', displayName: 'Ballia, Uttar Pradesh' },
  { city: 'Tanda', state: 'Uttar Pradesh', country: 'India', displayName: 'Tanda, Uttar Pradesh' },
  { city: 'Shamli', state: 'Uttar Pradesh', country: 'India', displayName: 'Shamli, Uttar Pradesh' },
  { city: 'Baghpat', state: 'Uttar Pradesh', country: 'India', displayName: 'Baghpat, Uttar Pradesh' },
  { city: 'Baraut', state: 'Uttar Pradesh', country: 'India', displayName: 'Baraut, Uttar Pradesh' },
  { city: 'Kairana', state: 'Uttar Pradesh', country: 'India', displayName: 'Kairana, Uttar Pradesh' },
  { city: 'Dadri', state: 'Uttar Pradesh', country: 'India', displayName: 'Dadri, Uttar Pradesh' },
  { city: 'Jewar', state: 'Uttar Pradesh', country: 'India', displayName: 'Jewar, Uttar Pradesh' },
  { city: 'Kosi Kalan', state: 'Uttar Pradesh', country: 'India', displayName: 'Kosi Kalan, Uttar Pradesh' },
  { city: 'Chhata', state: 'Uttar Pradesh', country: 'India', displayName: 'Chhata, Uttar Pradesh' },
  { city: 'Gokul', state: 'Uttar Pradesh', country: 'India', displayName: 'Gokul, Uttar Pradesh' },
  { city: 'Barsana', state: 'Uttar Pradesh', country: 'India', displayName: 'Barsana, Uttar Pradesh' },
  { city: 'Goverdhan', state: 'Uttar Pradesh', country: 'India', displayName: 'Goverdhan, Uttar Pradesh' },
  { city: 'Fatehpur Sikri', state: 'Uttar Pradesh', country: 'India', displayName: 'Fatehpur Sikri, Uttar Pradesh' },
  { city: 'Shikohabad', state: 'Uttar Pradesh', country: 'India', displayName: 'Shikohabad, Uttar Pradesh' },
  { city: 'Sirasaganj', state: 'Uttar Pradesh', country: 'India', displayName: 'Sirasaganj, Uttar Pradesh' },
  { city: 'Shuklaganj', state: 'Uttar Pradesh', country: 'India', displayName: 'Shuklaganj, Uttar Pradesh' },
  { city: 'Kannauj', state: 'Uttar Pradesh', country: 'India', displayName: 'Kannauj, Uttar Pradesh' },
  { city: 'Chhibramau', state: 'Uttar Pradesh', country: 'India', displayName: 'Chhibramau, Uttar Pradesh' },
  { city: 'Bilhaur', state: 'Uttar Pradesh', country: 'India', displayName: 'Bilhaur, Uttar Pradesh' },
  { city: 'Ghatampur', state: 'Uttar Pradesh', country: 'India', displayName: 'Ghatampur, Uttar Pradesh' },
  { city: 'Rath', state: 'Uttar Pradesh', country: 'India', displayName: 'Rath, Uttar Pradesh' },
  { city: 'Mahoba', state: 'Uttar Pradesh', country: 'India', displayName: 'Mahoba, Uttar Pradesh' },
  { city: 'Chitrakoot', state: 'Uttar Pradesh', country: 'India', displayName: 'Chitrakoot, Uttar Pradesh' },
  { city: 'Karwi', state: 'Uttar Pradesh', country: 'India', displayName: 'Karwi, Uttar Pradesh' },
  { city: 'Patna', state: 'Bihar', country: 'India', displayName: 'Patna, Bihar' },
  { city: 'Gaya', state: 'Bihar', country: 'India', displayName: 'Gaya, Bihar' },
  { city: 'Bhagalpur', state: 'Bihar', country: 'India', displayName: 'Bhagalpur, Bihar' },
  { city: 'Muzaffarpur', state: 'Bihar', country: 'India', displayName: 'Muzaffarpur, Bihar' },
  { city: 'Purnia', state: 'Bihar', country: 'India', displayName: 'Purnia, Bihar' },
  { city: 'Darbhanga', state: 'Bihar', country: 'India', displayName: 'Darbhanga, Bihar' },
  { city: 'Bihar Sharif', state: 'Bihar', country: 'India', displayName: 'Bihar Sharif, Bihar' },
  { city: 'Arrah (Bhojpur)', state: 'Bihar', country: 'India', displayName: 'Arrah (Bhojpur), Bihar' },
  { city: 'Begusarai', state: 'Bihar', country: 'India', displayName: 'Begusarai, Bihar' },
  { city: 'Katihar', state: 'Bihar', country: 'India', displayName: 'Katihar, Bihar' },
  { city: 'Munger', state: 'Bihar', country: 'India', displayName: 'Munger, Bihar' },
  { city: 'Chhapra (Saran)', state: 'Bihar', country: 'India', displayName: 'Chhapra (Saran), Bihar' },
  { city: 'Danapur', state: 'Bihar', country: 'India', displayName: 'Danapur, Bihar' },
  { city: 'Bettiah', state: 'Bihar', country: 'India', displayName: 'Bettiah, Bihar' },
  { city: 'Saharsa', state: 'Bihar', country: 'India', displayName: 'Saharsa, Bihar' },
  { city: 'Hajipur', state: 'Bihar', country: 'India', displayName: 'Hajipur, Bihar' },
  { city: 'Sasaram', state: 'Bihar', country: 'India', displayName: 'Sasaram, Bihar' },
  { city: 'Dehri', state: 'Bihar', country: 'India', displayName: 'Dehri, Bihar' },
  { city: 'Siwan', state: 'Bihar', country: 'India', displayName: 'Siwan, Bihar' },
  { city: 'Motihari', state: 'Bihar', country: 'India', displayName: 'Motihari, Bihar' },
  { city: 'Nawada', state: 'Bihar', country: 'India', displayName: 'Nawada, Bihar' },
  { city: 'Bagaha', state: 'Bihar', country: 'India', displayName: 'Bagaha, Bihar' },
  { city: 'Buxar', state: 'Bihar', country: 'India', displayName: 'Buxar, Bihar' },
  { city: 'Kishanganj', state: 'Bihar', country: 'India', displayName: 'Kishanganj, Bihar' },
  { city: 'Sitamarhi', state: 'Bihar', country: 'India', displayName: 'Sitamarhi, Bihar' },
  { city: 'Jamalpur', state: 'Bihar', country: 'India', displayName: 'Jamalpur, Bihar' },
  { city: 'Jehanabad', state: 'Bihar', country: 'India', displayName: 'Jehanabad, Bihar' },
  { city: 'Aurangabad (Bihar)', state: 'Bihar', country: 'India', displayName: 'Aurangabad (Bihar), Bihar' },
  { city: 'Madhubani', state: 'Bihar', country: 'India', displayName: 'Madhubani, Bihar' },
  { city: 'Samastipur', state: 'Bihar', country: 'India', displayName: 'Samastipur, Bihar' },
  { city: 'Bhabua (Kaimur)', state: 'Bihar', country: 'India', displayName: 'Bhabua (Kaimur), Bihar' },
  { city: 'Rajgir', state: 'Bihar', country: 'India', displayName: 'Rajgir, Bihar' },
  { city: 'Bodh Gaya', state: 'Bihar', country: 'India', displayName: 'Bodh Gaya, Bihar' },
  { city: 'Nalanda', state: 'Bihar', country: 'India', displayName: 'Nalanda, Bihar' },
  { city: 'Ranchi', state: 'Jharkhand', country: 'India', displayName: 'Ranchi, Jharkhand' },
  { city: 'Jamshedpur (Tatanagar)', state: 'Jharkhand', country: 'India', displayName: 'Jamshedpur (Tatanagar), Jharkhand' },
  { city: 'Dhanbad', state: 'Jharkhand', country: 'India', displayName: 'Dhanbad, Jharkhand' },
  { city: 'Bokaro Steel City', state: 'Jharkhand', country: 'India', displayName: 'Bokaro Steel City, Jharkhand' },
  { city: 'Deoghar', state: 'Jharkhand', country: 'India', displayName: 'Deoghar, Jharkhand' },
  { city: 'Hazaribagh', state: 'Jharkhand', country: 'India', displayName: 'Hazaribagh, Jharkhand' },
  { city: 'Giridih', state: 'Jharkhand', country: 'India', displayName: 'Giridih, Jharkhand' },
  { city: 'Ramgarh', state: 'Jharkhand', country: 'India', displayName: 'Ramgarh, Jharkhand' },
  { city: 'Medininagar (Daltonganj)', state: 'Jharkhand', country: 'India', displayName: 'Medininagar (Daltonganj), Jharkhand' },
  { city: 'Chirkunda', state: 'Jharkhand', country: 'India', displayName: 'Chirkunda, Jharkhand' },
  { city: 'Phusro', state: 'Jharkhand', country: 'India', displayName: 'Phusro, Jharkhand' },
  { city: 'Chaibasa', state: 'Jharkhand', country: 'India', displayName: 'Chaibasa, Jharkhand' },
  { city: 'Gumia', state: 'Jharkhand', country: 'India', displayName: 'Gumia, Jharkhand' },
  { city: 'Dumka', state: 'Jharkhand', country: 'India', displayName: 'Dumka, Jharkhand' },
  { city: 'Madhupur', state: 'Jharkhand', country: 'India', displayName: 'Madhupur, Jharkhand' },
  { city: 'Jhumri Telaiya (Koderma)', state: 'Jharkhand', country: 'India', displayName: 'Jhumri Telaiya (Koderma), Jharkhand' },
  { city: 'Hyderabad', state: 'Telangana', country: 'India', displayName: 'Hyderabad, Telangana' },
  { city: 'Secunderabad', state: 'Telangana', country: 'India', displayName: 'Secunderabad, Telangana' },
  { city: 'Warangal', state: 'Telangana', country: 'India', displayName: 'Warangal, Telangana' },
  { city: 'Nizamabad', state: 'Telangana', country: 'India', displayName: 'Nizamabad, Telangana' },
  { city: 'Karimnagar', state: 'Telangana', country: 'India', displayName: 'Karimnagar, Telangana' },
  { city: 'Ramagundam', state: 'Telangana', country: 'India', displayName: 'Ramagundam, Telangana' },
  { city: 'Khammam', state: 'Telangana', country: 'India', displayName: 'Khammam, Telangana' },
  { city: 'Mahabubnagar', state: 'Telangana', country: 'India', displayName: 'Mahabubnagar, Telangana' },
  { city: 'Nalgonda', state: 'Telangana', country: 'India', displayName: 'Nalgonda, Telangana' },
  { city: 'Adilabad', state: 'Telangana', country: 'India', displayName: 'Adilabad, Telangana' },
  { city: 'Siddipet', state: 'Telangana', country: 'India', displayName: 'Siddipet, Telangana' },
  { city: 'Miryalaguda', state: 'Telangana', country: 'India', displayName: 'Miryalaguda, Telangana' },
  { city: 'Jagtial', state: 'Telangana', country: 'India', displayName: 'Jagtial, Telangana' },
  { city: 'Mancherial', state: 'Telangana', country: 'India', displayName: 'Mancherial, Telangana' },
  { city: 'Nirmal', state: 'Telangana', country: 'India', displayName: 'Nirmal, Telangana' },
  { city: 'Suryapet', state: 'Telangana', country: 'India', displayName: 'Suryapet, Telangana' },
  { city: 'Kothagudem', state: 'Telangana', country: 'India', displayName: 'Kothagudem, Telangana' },
  { city: 'Bodhan', state: 'Telangana', country: 'India', displayName: 'Bodhan, Telangana' },
  { city: 'Kamareddy', state: 'Telangana', country: 'India', displayName: 'Kamareddy, Telangana' },
  { city: 'Sangareddy', state: 'Telangana', country: 'India', displayName: 'Sangareddy, Telangana' },
  { city: 'Vikarabad', state: 'Telangana', country: 'India', displayName: 'Vikarabad, Telangana' },
  { city: 'Visakhapatnam (Vizag)', state: 'Andhra Pradesh', country: 'India', displayName: 'Visakhapatnam (Vizag), Andhra Pradesh' },
  { city: 'Vijayawada', state: 'Andhra Pradesh', country: 'India', displayName: 'Vijayawada, Andhra Pradesh' },
  { city: 'Guntur', state: 'Andhra Pradesh', country: 'India', displayName: 'Guntur, Andhra Pradesh' },
  { city: 'Nellore', state: 'Andhra Pradesh', country: 'India', displayName: 'Nellore, Andhra Pradesh' },
  { city: 'Kurnool', state: 'Andhra Pradesh', country: 'India', displayName: 'Kurnool, Andhra Pradesh' },
  { city: 'Rajahmundry', state: 'Andhra Pradesh', country: 'India', displayName: 'Rajahmundry, Andhra Pradesh' },
  { city: 'Tirupati', state: 'Andhra Pradesh', country: 'India', displayName: 'Tirupati, Andhra Pradesh' },
  { city: 'Kakinada', state: 'Andhra Pradesh', country: 'India', displayName: 'Kakinada, Andhra Pradesh' },
  { city: 'Kadapa (Cuddapah)', state: 'Andhra Pradesh', country: 'India', displayName: 'Kadapa (Cuddapah), Andhra Pradesh' },
  { city: 'Anantapur', state: 'Andhra Pradesh', country: 'India', displayName: 'Anantapur, Andhra Pradesh' },
  { city: 'Eluru', state: 'Andhra Pradesh', country: 'India', displayName: 'Eluru, Andhra Pradesh' },
  { city: 'Vizianagaram', state: 'Andhra Pradesh', country: 'India', displayName: 'Vizianagaram, Andhra Pradesh' },
  { city: 'Proddatur', state: 'Andhra Pradesh', country: 'India', displayName: 'Proddatur, Andhra Pradesh' },
  { city: 'Nandyal', state: 'Andhra Pradesh', country: 'India', displayName: 'Nandyal, Andhra Pradesh' },
  { city: 'Ongole', state: 'Andhra Pradesh', country: 'India', displayName: 'Ongole, Andhra Pradesh' },
  { city: 'Adoni', state: 'Andhra Pradesh', country: 'India', displayName: 'Adoni, Andhra Pradesh' },
  { city: 'Madanapalle', state: 'Andhra Pradesh', country: 'India', displayName: 'Madanapalle, Andhra Pradesh' },
  { city: 'Machilipatnam', state: 'Andhra Pradesh', country: 'India', displayName: 'Machilipatnam, Andhra Pradesh' },
  { city: 'Tenali', state: 'Andhra Pradesh', country: 'India', displayName: 'Tenali, Andhra Pradesh' },
  { city: 'Chittoor', state: 'Andhra Pradesh', country: 'India', displayName: 'Chittoor, Andhra Pradesh' },
  { city: 'Hindupur', state: 'Andhra Pradesh', country: 'India', displayName: 'Hindupur, Andhra Pradesh' },
  { city: 'Bhimavaram', state: 'Andhra Pradesh', country: 'India', displayName: 'Bhimavaram, Andhra Pradesh' },
  { city: 'Guntakal', state: 'Andhra Pradesh', country: 'India', displayName: 'Guntakal, Andhra Pradesh' },
  { city: 'Dharmavaram', state: 'Andhra Pradesh', country: 'India', displayName: 'Dharmavaram, Andhra Pradesh' },
  { city: 'Gudivada', state: 'Andhra Pradesh', country: 'India', displayName: 'Gudivada, Andhra Pradesh' },
  { city: 'Narasaraopet', state: 'Andhra Pradesh', country: 'India', displayName: 'Narasaraopet, Andhra Pradesh' },
  { city: 'Tadipatri', state: 'Andhra Pradesh', country: 'India', displayName: 'Tadipatri, Andhra Pradesh' },
  { city: 'Mangalagiri', state: 'Andhra Pradesh', country: 'India', displayName: 'Mangalagiri, Andhra Pradesh' },
  { city: 'Chilakaluripet', state: 'Andhra Pradesh', country: 'India', displayName: 'Chilakaluripet, Andhra Pradesh' },
  { city: 'Srikakulam', state: 'Andhra Pradesh', country: 'India', displayName: 'Srikakulam, Andhra Pradesh' },
  { city: 'Tanuku', state: 'Andhra Pradesh', country: 'India', displayName: 'Tanuku, Andhra Pradesh' },
  { city: 'Tadepalligudem', state: 'Andhra Pradesh', country: 'India', displayName: 'Tadepalligudem, Andhra Pradesh' },
  { city: 'Chennai', state: 'Tamil Nadu', country: 'India', displayName: 'Chennai, Tamil Nadu' },
  { city: 'Coimbatore', state: 'Tamil Nadu', country: 'India', displayName: 'Coimbatore, Tamil Nadu' },
  { city: 'Madurai', state: 'Tamil Nadu', country: 'India', displayName: 'Madurai, Tamil Nadu' },
  { city: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', country: 'India', displayName: 'Tiruchirappalli (Trichy), Tamil Nadu' },
  { city: 'Salem', state: 'Tamil Nadu', country: 'India', displayName: 'Salem, Tamil Nadu' },
  { city: 'Tiruppur', state: 'Tamil Nadu', country: 'India', displayName: 'Tiruppur, Tamil Nadu' },
  { city: 'Erode', state: 'Tamil Nadu', country: 'India', displayName: 'Erode, Tamil Nadu' },
  { city: 'Vellore', state: 'Tamil Nadu', country: 'India', displayName: 'Vellore, Tamil Nadu' },
  { city: 'Thoothukudi (Tuticorin)', state: 'Tamil Nadu', country: 'India', displayName: 'Thoothukudi (Tuticorin), Tamil Nadu' },
  { city: 'Dindigul', state: 'Tamil Nadu', country: 'India', displayName: 'Dindigul, Tamil Nadu' },
  { city: 'Thanjavur', state: 'Tamil Nadu', country: 'India', displayName: 'Thanjavur, Tamil Nadu' },
  { city: 'Ranipet', state: 'Tamil Nadu', country: 'India', displayName: 'Ranipet, Tamil Nadu' },
  { city: 'Sivakasi', state: 'Tamil Nadu', country: 'India', displayName: 'Sivakasi, Tamil Nadu' },
  { city: 'Karur', state: 'Tamil Nadu', country: 'India', displayName: 'Karur, Tamil Nadu' },
  { city: 'Udhagamandalam (Ooty)', state: 'Tamil Nadu', country: 'India', displayName: 'Udhagamandalam (Ooty), Tamil Nadu' },
  { city: 'Hosur', state: 'Tamil Nadu', country: 'India', displayName: 'Hosur, Tamil Nadu' },
  { city: 'Nagercoil', state: 'Tamil Nadu', country: 'India', displayName: 'Nagercoil, Tamil Nadu' },
  { city: 'Kanchipuram', state: 'Tamil Nadu', country: 'India', displayName: 'Kanchipuram, Tamil Nadu' },
  { city: 'Kumarapalayam', state: 'Tamil Nadu', country: 'India', displayName: 'Kumarapalayam, Tamil Nadu' },
  { city: 'Karaikkudi', state: 'Tamil Nadu', country: 'India', displayName: 'Karaikkudi, Tamil Nadu' },
  { city: 'Neyveli', state: 'Tamil Nadu', country: 'India', displayName: 'Neyveli, Tamil Nadu' },
  { city: 'Cuddalore', state: 'Tamil Nadu', country: 'India', displayName: 'Cuddalore, Tamil Nadu' },
  { city: 'Kumbakonam', state: 'Tamil Nadu', country: 'India', displayName: 'Kumbakonam, Tamil Nadu' },
  { city: 'Tiruvannamalai', state: 'Tamil Nadu', country: 'India', displayName: 'Tiruvannamalai, Tamil Nadu' },
  { city: 'Pollachi', state: 'Tamil Nadu', country: 'India', displayName: 'Pollachi, Tamil Nadu' },
  { city: 'Rajapalayam', state: 'Tamil Nadu', country: 'India', displayName: 'Rajapalayam, Tamil Nadu' },
  { city: 'Gudiyatham', state: 'Tamil Nadu', country: 'India', displayName: 'Gudiyatham, Tamil Nadu' },
  { city: 'Pudukkottai', state: 'Tamil Nadu', country: 'India', displayName: 'Pudukkottai, Tamil Nadu' },
  { city: 'Vaniyambadi', state: 'Tamil Nadu', country: 'India', displayName: 'Vaniyambadi, Tamil Nadu' },
  { city: 'Ambur', state: 'Tamil Nadu', country: 'India', displayName: 'Ambur, Tamil Nadu' },
  { city: 'Nagapattinam', state: 'Tamil Nadu', country: 'India', displayName: 'Nagapattinam, Tamil Nadu' },
  { city: 'Rameswaram', state: 'Tamil Nadu', country: 'India', displayName: 'Rameswaram, Tamil Nadu' },
  { city: 'Kanyakumari', state: 'Tamil Nadu', country: 'India', displayName: 'Kanyakumari, Tamil Nadu' },
  { city: 'Kochi (Cochin)', state: 'Kerala', country: 'India', displayName: 'Kochi (Cochin), Kerala' },
  { city: 'Thiruvananthapuram (Trivandrum)', state: 'Kerala', country: 'India', displayName: 'Thiruvananthapuram (Trivandrum), Kerala' },
  { city: 'Kozhikode (Calicut)', state: 'Kerala', country: 'India', displayName: 'Kozhikode (Calicut), Kerala' },
  { city: 'Kollam (Quilon)', state: 'Kerala', country: 'India', displayName: 'Kollam (Quilon), Kerala' },
  { city: 'Thrissur', state: 'Kerala', country: 'India', displayName: 'Thrissur, Kerala' },
  { city: 'Alappuzha (Alleppey)', state: 'Kerala', country: 'India', displayName: 'Alappuzha (Alleppey), Kerala' },
  { city: 'Palakkad', state: 'Kerala', country: 'India', displayName: 'Palakkad, Kerala' },
  { city: 'Malappuram', state: 'Kerala', country: 'India', displayName: 'Malappuram, Kerala' },
  { city: 'Manjeri', state: 'Kerala', country: 'India', displayName: 'Manjeri, Kerala' },
  { city: 'Thalassery', state: 'Kerala', country: 'India', displayName: 'Thalassery, Kerala' },
  { city: 'Ponnani', state: 'Kerala', country: 'India', displayName: 'Ponnani, Kerala' },
  { city: 'Kannur', state: 'Kerala', country: 'India', displayName: 'Kannur, Kerala' },
  { city: 'Kottayam', state: 'Kerala', country: 'India', displayName: 'Kottayam, Kerala' },
  { city: 'Kasaragod', state: 'Kerala', country: 'India', displayName: 'Kasaragod, Kerala' },
  { city: 'Kanhangad', state: 'Kerala', country: 'India', displayName: 'Kanhangad, Kerala' },
  { city: 'Payyanur', state: 'Kerala', country: 'India', displayName: 'Payyanur, Kerala' },
  { city: 'Koyilandy', state: 'Kerala', country: 'India', displayName: 'Koyilandy, Kerala' },
  { city: 'Paravur', state: 'Kerala', country: 'India', displayName: 'Paravur, Kerala' },
  { city: 'Neyyattinkara', state: 'Kerala', country: 'India', displayName: 'Neyyattinkara, Kerala' },
  { city: 'Kayamkulam', state: 'Kerala', country: 'India', displayName: 'Kayamkulam, Kerala' },
  { city: 'Nedumangad', state: 'Kerala', country: 'India', displayName: 'Nedumangad, Kerala' },
  { city: 'Muvattupuzha', state: 'Kerala', country: 'India', displayName: 'Muvattupuzha, Kerala' },
  { city: 'Wayanad', state: 'Kerala', country: 'India', displayName: 'Wayanad, Kerala' },
  { city: 'Idukki', state: 'Kerala', country: 'India', displayName: 'Idukki, Kerala' },
  { city: 'Munnar', state: 'Kerala', country: 'India', displayName: 'Munnar, Kerala' },
  { city: 'Varkala', state: 'Kerala', country: 'India', displayName: 'Varkala, Kerala' },
  { city: 'Guruvayur', state: 'Kerala', country: 'India', displayName: 'Guruvayur, Kerala' },
  { city: 'Kolkata', state: 'West Bengal', country: 'India', displayName: 'Kolkata, West Bengal' },
  { city: 'Howrah', state: 'West Bengal', country: 'India', displayName: 'Howrah, West Bengal' },
  { city: 'Siliguri', state: 'West Bengal', country: 'India', displayName: 'Siliguri, West Bengal' },
  { city: 'Durgapur', state: 'West Bengal', country: 'India', displayName: 'Durgapur, West Bengal' },
  { city: 'Asansol', state: 'West Bengal', country: 'India', displayName: 'Asansol, West Bengal' },
  { city: 'Bardhaman (Burdwan)', state: 'West Bengal', country: 'India', displayName: 'Bardhaman (Burdwan), West Bengal' },
  { city: 'Malda (English Bazar)', state: 'West Bengal', country: 'India', displayName: 'Malda (English Bazar), West Bengal' },
  { city: 'Baharampur', state: 'West Bengal', country: 'India', displayName: 'Baharampur, West Bengal' },
  { city: 'Habra', state: 'West Bengal', country: 'India', displayName: 'Habra, West Bengal' },
  { city: 'Kharagpur', state: 'West Bengal', country: 'India', displayName: 'Kharagpur, West Bengal' },
  { city: 'Shantipur', state: 'West Bengal', country: 'India', displayName: 'Shantipur, West Bengal' },
  { city: 'Dankuni', state: 'West Bengal', country: 'India', displayName: 'Dankuni, West Bengal' },
  { city: 'Dhulian', state: 'West Bengal', country: 'India', displayName: 'Dhulian, West Bengal' },
  { city: 'Ranaghat', state: 'West Bengal', country: 'India', displayName: 'Ranaghat, West Bengal' },
  { city: 'Haldia', state: 'West Bengal', country: 'India', displayName: 'Haldia, West Bengal' },
  { city: 'Raiganj', state: 'West Bengal', country: 'India', displayName: 'Raiganj, West Bengal' },
  { city: 'Krishnanagar', state: 'West Bengal', country: 'India', displayName: 'Krishnanagar, West Bengal' },
  { city: 'Nabadwip', state: 'West Bengal', country: 'India', displayName: 'Nabadwip, West Bengal' },
  { city: 'Midnapore (Medinipur)', state: 'West Bengal', country: 'India', displayName: 'Midnapore (Medinipur), West Bengal' },
  { city: 'Jalpaiguri', state: 'West Bengal', country: 'India', displayName: 'Jalpaiguri, West Bengal' },
  { city: 'Balurghat', state: 'West Bengal', country: 'India', displayName: 'Balurghat, West Bengal' },
  { city: 'Basirhat', state: 'West Bengal', country: 'India', displayName: 'Basirhat, West Bengal' },
  { city: 'Bankura', state: 'West Bengal', country: 'India', displayName: 'Bankura, West Bengal' },
  { city: 'Chakdaha', state: 'West Bengal', country: 'India', displayName: 'Chakdaha, West Bengal' },
  { city: 'Darjeeling', state: 'West Bengal', country: 'India', displayName: 'Darjeeling, West Bengal' },
  { city: 'Alipurduar', state: 'West Bengal', country: 'India', displayName: 'Alipurduar, West Bengal' },
  { city: 'Purulia', state: 'West Bengal', country: 'India', displayName: 'Purulia, West Bengal' },
  { city: 'Kalimpong', state: 'West Bengal', country: 'India', displayName: 'Kalimpong, West Bengal' },
  { city: 'Cooch Behar', state: 'West Bengal', country: 'India', displayName: 'Cooch Behar, West Bengal' },
  { city: 'Bolpur (Santiniketan)', state: 'West Bengal', country: 'India', displayName: 'Bolpur (Santiniketan), West Bengal' },
  { city: 'Bhubaneswar', state: 'Odisha', country: 'India', displayName: 'Bhubaneswar, Odisha' },
  { city: 'Cuttack', state: 'Odisha', country: 'India', displayName: 'Cuttack, Odisha' },
  { city: 'Rourkela', state: 'Odisha', country: 'India', displayName: 'Rourkela, Odisha' },
  { city: 'Berhampur', state: 'Odisha', country: 'India', displayName: 'Berhampur, Odisha' },
  { city: 'Sambalpur', state: 'Odisha', country: 'India', displayName: 'Sambalpur, Odisha' },
  { city: 'Puri', state: 'Odisha', country: 'India', displayName: 'Puri, Odisha' },
  { city: 'Balasore (Baleshwar)', state: 'Odisha', country: 'India', displayName: 'Balasore (Baleshwar), Odisha' },
  { city: 'Bhadrak', state: 'Odisha', country: 'India', displayName: 'Bhadrak, Odisha' },
  { city: 'Baripada', state: 'Odisha', country: 'India', displayName: 'Baripada, Odisha' },
  { city: 'Jharsuguda', state: 'Odisha', country: 'India', displayName: 'Jharsuguda, Odisha' },
  { city: 'Jeypore', state: 'Odisha', country: 'India', displayName: 'Jeypore, Odisha' },
  { city: 'Bargarh', state: 'Odisha', country: 'India', displayName: 'Bargarh, Odisha' },
  { city: 'Rayagada', state: 'Odisha', country: 'India', displayName: 'Rayagada, Odisha' },
  { city: 'Angul', state: 'Odisha', country: 'India', displayName: 'Angul, Odisha' },
  { city: 'Dhenkanal', state: 'Odisha', country: 'India', displayName: 'Dhenkanal, Odisha' },
  { city: 'Kendujhar (Keonjhar)', state: 'Odisha', country: 'India', displayName: 'Kendujhar (Keonjhar), Odisha' },
  { city: 'Paradip', state: 'Odisha', country: 'India', displayName: 'Paradip, Odisha' },
  { city: 'Konark', state: 'Odisha', country: 'India', displayName: 'Konark, Odisha' },
  { city: 'Raipur', state: 'Chhattisgarh', country: 'India', displayName: 'Raipur, Chhattisgarh' },
  { city: 'Bhilai', state: 'Chhattisgarh', country: 'India', displayName: 'Bhilai, Chhattisgarh' },
  { city: 'Durg', state: 'Chhattisgarh', country: 'India', displayName: 'Durg, Chhattisgarh' },
  { city: 'Bilaspur', state: 'Chhattisgarh', country: 'India', displayName: 'Bilaspur, Chhattisgarh' },
  { city: 'Korba', state: 'Chhattisgarh', country: 'India', displayName: 'Korba, Chhattisgarh' },
  { city: 'Rajnandgaon', state: 'Chhattisgarh', country: 'India', displayName: 'Rajnandgaon, Chhattisgarh' },
  { city: 'Raigarh', state: 'Chhattisgarh', country: 'India', displayName: 'Raigarh, Chhattisgarh' },
  { city: 'Jagdalpur', state: 'Chhattisgarh', country: 'India', displayName: 'Jagdalpur, Chhattisgarh' },
  { city: 'Ambikapur', state: 'Chhattisgarh', country: 'India', displayName: 'Ambikapur, Chhattisgarh' },
  { city: 'Dhamtari', state: 'Chhattisgarh', country: 'India', displayName: 'Dhamtari, Chhattisgarh' },
  { city: 'Mahasamund', state: 'Chhattisgarh', country: 'India', displayName: 'Mahasamund, Chhattisgarh' },
  { city: 'Kanker', state: 'Chhattisgarh', country: 'India', displayName: 'Kanker, Chhattisgarh' },
  { city: 'Dehradun', state: 'Uttarakhand', country: 'India', displayName: 'Dehradun, Uttarakhand' },
  { city: 'Haridwar', state: 'Uttarakhand', country: 'India', displayName: 'Haridwar, Uttarakhand' },
  { city: 'Roorkee', state: 'Uttarakhand', country: 'India', displayName: 'Roorkee, Uttarakhand' },
  { city: 'Haldwani', state: 'Uttarakhand', country: 'India', displayName: 'Haldwani, Uttarakhand' },
  { city: 'Rudrapur', state: 'Uttarakhand', country: 'India', displayName: 'Rudrapur, Uttarakhand' },
  { city: 'Kashipur', state: 'Uttarakhand', country: 'India', displayName: 'Kashipur, Uttarakhand' },
  { city: 'Rishikesh', state: 'Uttarakhand', country: 'India', displayName: 'Rishikesh, Uttarakhand' },
  { city: 'Nainital', state: 'Uttarakhand', country: 'India', displayName: 'Nainital, Uttarakhand' },
  { city: 'Mussoorie', state: 'Uttarakhand', country: 'India', displayName: 'Mussoorie, Uttarakhand' },
  { city: 'Pithoragarh', state: 'Uttarakhand', country: 'India', displayName: 'Pithoragarh, Uttarakhand' },
  { city: 'Almora', state: 'Uttarakhand', country: 'India', displayName: 'Almora, Uttarakhand' },
  { city: 'Kotdwar', state: 'Uttarakhand', country: 'India', displayName: 'Kotdwar, Uttarakhand' },
  { city: 'Shimla', state: 'Himachal Pradesh', country: 'India', displayName: 'Shimla, Himachal Pradesh' },
  { city: 'Dharamshala', state: 'Himachal Pradesh', country: 'India', displayName: 'Dharamshala, Himachal Pradesh' },
  { city: 'Solan', state: 'Himachal Pradesh', country: 'India', displayName: 'Solan, Himachal Pradesh' },
  { city: 'Mandi', state: 'Himachal Pradesh', country: 'India', displayName: 'Mandi, Himachal Pradesh' },
  { city: 'Kullu', state: 'Himachal Pradesh', country: 'India', displayName: 'Kullu, Himachal Pradesh' },
  { city: 'Manali', state: 'Himachal Pradesh', country: 'India', displayName: 'Manali, Himachal Pradesh' },
  { city: 'Baddi', state: 'Himachal Pradesh', country: 'India', displayName: 'Baddi, Himachal Pradesh' },
  { city: 'Nahan', state: 'Himachal Pradesh', country: 'India', displayName: 'Nahan, Himachal Pradesh' },
  { city: 'Sundernagar', state: 'Himachal Pradesh', country: 'India', displayName: 'Sundernagar, Himachal Pradesh' },
  { city: 'Hamirpur (HP)', state: 'Himachal Pradesh', country: 'India', displayName: 'Hamirpur (HP), Himachal Pradesh' },
  { city: 'Bilaspur (HP)', state: 'Himachal Pradesh', country: 'India', displayName: 'Bilaspur (HP), Himachal Pradesh' },
  { city: 'Chamba', state: 'Himachal Pradesh', country: 'India', displayName: 'Chamba, Himachal Pradesh' },
  { city: 'Srinagar', state: 'Jammu & Kashmir', country: 'India', displayName: 'Srinagar, Jammu & Kashmir' },
  { city: 'Jammu', state: 'Jammu & Kashmir', country: 'India', displayName: 'Jammu, Jammu & Kashmir' },
  { city: 'Anantnag', state: 'Jammu & Kashmir', country: 'India', displayName: 'Anantnag, Jammu & Kashmir' },
  { city: 'Baramulla', state: 'Jammu & Kashmir', country: 'India', displayName: 'Baramulla, Jammu & Kashmir' },
  { city: 'Udhampur', state: 'Jammu & Kashmir', country: 'India', displayName: 'Udhampur, Jammu & Kashmir' },
  { city: 'Kathua', state: 'Jammu & Kashmir', country: 'India', displayName: 'Kathua, Jammu & Kashmir' },
  { city: 'Sopore', state: 'Jammu & Kashmir', country: 'India', displayName: 'Sopore, Jammu & Kashmir' },
  { city: 'Leh', state: 'Ladakh', country: 'India', displayName: 'Leh, Ladakh' },
  { city: 'Kargil', state: 'Ladakh', country: 'India', displayName: 'Kargil, Ladakh' },
  { city: 'Panaji', state: 'Goa', country: 'India', displayName: 'Panaji, Goa' },
  { city: 'Margao', state: 'Goa', country: 'India', displayName: 'Margao, Goa' },
  { city: 'Vasco da Gama', state: 'Goa', country: 'India', displayName: 'Vasco da Gama, Goa' },
  { city: 'Mapusa', state: 'Goa', country: 'India', displayName: 'Mapusa, Goa' },
  { city: 'Ponda', state: 'Goa', country: 'India', displayName: 'Ponda, Goa' },
  { city: 'Bicholim', state: 'Goa', country: 'India', displayName: 'Bicholim, Goa' },
  { city: 'Curchorem', state: 'Goa', country: 'India', displayName: 'Curchorem, Goa' },
  { city: 'Canacona', state: 'Goa', country: 'India', displayName: 'Canacona, Goa' },
  { city: 'Guwahati', state: 'Assam', country: 'India', displayName: 'Guwahati, Assam' },
  { city: 'Silchar', state: 'Assam', country: 'India', displayName: 'Silchar, Assam' },
  { city: 'Dibrugarh', state: 'Assam', country: 'India', displayName: 'Dibrugarh, Assam' },
  { city: 'Jorhat', state: 'Assam', country: 'India', displayName: 'Jorhat, Assam' },
  { city: 'Nagaon', state: 'Assam', country: 'India', displayName: 'Nagaon, Assam' },
  { city: 'Tinsukia', state: 'Assam', country: 'India', displayName: 'Tinsukia, Assam' },
  { city: 'Tezpur', state: 'Assam', country: 'India', displayName: 'Tezpur, Assam' },
  { city: 'Bongaigaon', state: 'Assam', country: 'India', displayName: 'Bongaigaon, Assam' },
  { city: 'Shillong', state: 'Meghalaya', country: 'India', displayName: 'Shillong, Meghalaya' },
  { city: 'Tura', state: 'Meghalaya', country: 'India', displayName: 'Tura, Meghalaya' },
  { city: 'Agartala', state: 'Tripura', country: 'India', displayName: 'Agartala, Tripura' },
  { city: 'Aizawl', state: 'Mizoram', country: 'India', displayName: 'Aizawl, Mizoram' },
  { city: 'Imphal', state: 'Manipur', country: 'India', displayName: 'Imphal, Manipur' },
  { city: 'Kohima', state: 'Nagaland', country: 'India', displayName: 'Kohima, Nagaland' },
  { city: 'Dimapur', state: 'Nagaland', country: 'India', displayName: 'Dimapur, Nagaland' },
  { city: 'Gangtok', state: 'Sikkim', country: 'India', displayName: 'Gangtok, Sikkim' },
  { city: 'Itanagar', state: 'Arunachal Pradesh', country: 'India', displayName: 'Itanagar, Arunachal Pradesh' },
  { city: 'Puducherry (Pondicherry)', state: 'Puducherry', country: 'India', displayName: 'Puducherry (Pondicherry), Puducherry' },
  { city: 'Karaikal', state: 'Puducherry', country: 'India', displayName: 'Karaikal, Puducherry' },
  { city: 'Port Blair', state: 'Andaman & Nicobar Islands', country: 'India', displayName: 'Port Blair, Andaman & Nicobar Islands' },
  { city: 'Daman', state: 'Dadra & Nagar Haveli and Daman & Diu', country: 'India', displayName: 'Daman, Dadra & Nagar Haveli and Daman & Diu' },
  { city: 'Diu', state: 'Dadra & Nagar Haveli and Daman & Diu', country: 'India', displayName: 'Diu, Dadra & Nagar Haveli and Daman & Diu' },
  { city: 'Silvassa', state: 'Dadra & Nagar Haveli and Daman & Diu', country: 'India', displayName: 'Silvassa, Dadra & Nagar Haveli and Daman & Diu' },
  { city: 'Manchester', state: 'United Kingdom', country: 'United Kingdom', displayName: 'Manchester, United Kingdom' },
  { city: 'Birmingham', state: 'United Kingdom', country: 'United Kingdom', displayName: 'Birmingham, United Kingdom' },
  { city: 'Edinburgh', state: 'United Kingdom', country: 'United Kingdom', displayName: 'Edinburgh, United Kingdom' },
  { city: 'Glasgow', state: 'United Kingdom', country: 'United Kingdom', displayName: 'Glasgow, United Kingdom' },
  { city: 'Leicester', state: 'United Kingdom', country: 'United Kingdom', displayName: 'Leicester, United Kingdom' },
  { city: 'Dubai', state: 'United Arab Emirates', country: 'United Arab Emirates', displayName: 'Dubai, United Arab Emirates' },
  { city: 'Abu Dhabi', state: 'United Arab Emirates', country: 'United Arab Emirates', displayName: 'Abu Dhabi, United Arab Emirates' },
  { city: 'Sharjah', state: 'United Arab Emirates', country: 'United Arab Emirates', displayName: 'Sharjah, United Arab Emirates' },
  { city: 'Singapore', state: 'Singapore', country: 'Singapore', displayName: 'Singapore, Singapore' },
  { city: 'Kuala Lumpur', state: 'Malaysia', country: 'Malaysia', displayName: 'Kuala Lumpur, Malaysia' },
  { city: 'Toronto', state: 'Canada', country: 'Canada', displayName: 'Toronto, Canada' },
  { city: 'Vancouver', state: 'Canada', country: 'Canada', displayName: 'Vancouver, Canada' },
  { city: 'Calgary', state: 'Canada', country: 'Canada', displayName: 'Calgary, Canada' },
  { city: 'Ottawa', state: 'Canada', country: 'Canada', displayName: 'Ottawa, Canada' },
  { city: 'Montreal', state: 'Canada', country: 'Canada', displayName: 'Montreal, Canada' },
  { city: 'Edmonton', state: 'Canada', country: 'Canada', displayName: 'Edmonton, Canada' },
  { city: 'Brampton', state: 'Canada', country: 'Canada', displayName: 'Brampton, Canada' },
  { city: 'Mississauga', state: 'Canada', country: 'Canada', displayName: 'Mississauga, Canada' },
  { city: 'New York', state: 'United States', country: 'United States', displayName: 'New York, United States' },
  { city: 'San Jose (Silicon Valley)', state: 'United States', country: 'United States', displayName: 'San Jose (Silicon Valley), United States' },
  { city: 'San Francisco', state: 'United States', country: 'United States', displayName: 'San Francisco, United States' },
  { city: 'Sunnyvale', state: 'United States', country: 'United States', displayName: 'Sunnyvale, United States' },
  { city: 'Fremont', state: 'United States', country: 'United States', displayName: 'Fremont, United States' },
  { city: 'Seattle', state: 'United States', country: 'United States', displayName: 'Seattle, United States' },
  { city: 'Chicago', state: 'United States', country: 'United States', displayName: 'Chicago, United States' },
  { city: 'Dallas', state: 'United States', country: 'United States', displayName: 'Dallas, United States' },
  { city: 'Houston', state: 'United States', country: 'United States', displayName: 'Houston, United States' },
  { city: 'Austin', state: 'United States', country: 'United States', displayName: 'Austin, United States' },
  { city: 'Los Angeles', state: 'United States', country: 'United States', displayName: 'Los Angeles, United States' },
  { city: 'Atlanta', state: 'United States', country: 'United States', displayName: 'Atlanta, United States' },
  { city: 'Boston', state: 'United States', country: 'United States', displayName: 'Boston, United States' },
  { city: 'Washington D.C.', state: 'United States', country: 'United States', displayName: 'Washington D.C., United States' },
  { city: 'Jersey City', state: 'United States', country: 'United States', displayName: 'Jersey City, United States' },
  { city: 'Edison', state: 'United States', country: 'United States', displayName: 'Edison, United States' },
  { city: 'San Diego', state: 'United States', country: 'United States', displayName: 'San Diego, United States' },
  { city: 'Phoenix', state: 'United States', country: 'United States', displayName: 'Phoenix, United States' },
  { city: 'Sydney', state: 'Australia', country: 'Australia', displayName: 'Sydney, Australia' },
  { city: 'Melbourne', state: 'Australia', country: 'Australia', displayName: 'Melbourne, Australia' },
  { city: 'Brisbane', state: 'Australia', country: 'Australia', displayName: 'Brisbane, Australia' },
  { city: 'Perth', state: 'Australia', country: 'Australia', displayName: 'Perth, Australia' },
  { city: 'Adelaide', state: 'Australia', country: 'Australia', displayName: 'Adelaide, Australia' },
  { city: 'Auckland', state: 'New Zealand', country: 'New Zealand', displayName: 'Auckland, New Zealand' },
  { city: 'Wellington', state: 'New Zealand', country: 'New Zealand', displayName: 'Wellington, New Zealand' },
  { city: 'Doha', state: 'Qatar', country: 'Qatar', displayName: 'Doha, Qatar' },
  { city: 'Riyadh', state: 'Saudi Arabia', country: 'Saudi Arabia', displayName: 'Riyadh, Saudi Arabia' },
  { city: 'Jeddah', state: 'Saudi Arabia', country: 'Saudi Arabia', displayName: 'Jeddah, Saudi Arabia' },
  { city: 'Dammam', state: 'Saudi Arabia', country: 'Saudi Arabia', displayName: 'Dammam, Saudi Arabia' },
  { city: 'Kuwait City', state: 'Kuwait', country: 'Kuwait', displayName: 'Kuwait City, Kuwait' },
  { city: 'Muscat', state: 'Oman', country: 'Oman', displayName: 'Muscat, Oman' },
  { city: 'Manama', state: 'Bahrain', country: 'Bahrain', displayName: 'Manama, Bahrain' },
  { city: 'Berlin', state: 'Germany', country: 'Germany', displayName: 'Berlin, Germany' },
  { city: 'Munich', state: 'Germany', country: 'Germany', displayName: 'Munich, Germany' },
  { city: 'Frankfurt', state: 'Germany', country: 'Germany', displayName: 'Frankfurt, Germany' },
  { city: 'Hamburg', state: 'Germany', country: 'Germany', displayName: 'Hamburg, Germany' },
  { city: 'Dublin', state: 'Ireland', country: 'Ireland', displayName: 'Dublin, Ireland' },
  { city: 'Amsterdam', state: 'Netherlands', country: 'Netherlands', displayName: 'Amsterdam, Netherlands' },
  { city: 'Paris', state: 'France', country: 'France', displayName: 'Paris, France' },
  { city: 'Zurich', state: 'Switzerland', country: 'Switzerland', displayName: 'Zurich, Switzerland' },
  { city: 'Geneva', state: 'Switzerland', country: 'Switzerland', displayName: 'Geneva, Switzerland' },
  { city: 'Stockholm', state: 'Sweden', country: 'Sweden', displayName: 'Stockholm, Sweden' },
];

/**
 * Fast lookup indices for high-speed sub-millisecond prefix & substring search
 */
interface IndexedCity {
  item: CityItem;
  cLower: string;
  sLower: string;
  dLower: string;
  cleanTokens: string[];
}

const INDEXED_CITIES: IndexedCity[] = CITIES_DATA.map((item) => {
  const cLower = item.city.toLowerCase();
  const sLower = item.state.toLowerCase();
  const dLower = item.displayName.toLowerCase();
  const tokens = (cLower + " " + sLower).replace(/[(),\-\/]/g, " ").split(/\s+/).filter(Boolean);
  return { item, cLower, sLower, dLower, cleanTokens: tokens };
});

/**
 * Searches the city/town/taluka database by prefix or substring.
 * Returns up to `limit` ranked recommendations.
 */
export const searchCities = (query: string, limit = 12): CityItem[] => {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const qClean = q.replace(/[(),\-\/]/g, " ").trim();

  const exactMatches: CityItem[] = [];
  const startsWithMatches: CityItem[] = [];
  const tokenPrefixMatches: CityItem[] = [];
  const substringMatches: CityItem[] = [];

  for (const entry of INDEXED_CITIES) {
    if (entry.cLower === q || entry.dLower === q) {
      exactMatches.push(entry.item);
    } else if (entry.cLower.startsWith(q)) {
      startsWithMatches.push(entry.item);
    } else if (entry.cleanTokens.some((t) => t.startsWith(qClean))) {
      tokenPrefixMatches.push(entry.item);
    } else if (entry.dLower.includes(q) || entry.cLower.includes(q)) {
      substringMatches.push(entry.item);
    }
  }

  const combined = [
    ...exactMatches,
    ...startsWithMatches,
    ...tokenPrefixMatches,
    ...substringMatches,
  ];

  const seen = new Set<string>();
  const results: CityItem[] = [];
  for (const item of combined) {
    if (!seen.has(item.displayName)) {
      seen.add(item.displayName);
      results.push(item);
      if (results.length >= limit) break;
    }
  }

  return results;
};

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const STATE_ALIASES: Record<string, string> = {
  'orissa': 'Odisha',
  'uttaranchal': 'Uttarakhand',
  'pondicherry': 'Puducherry',
  'nct of delhi': 'Delhi',
  'national capital territory of delhi': 'Delhi',
  'delhi ncr': 'Delhi',
  'jammu & kashmir': 'Jammu and Kashmir',
  'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
  'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
};

export const normalizeStateName = (stateRaw?: string | null): string => {
  if (!stateRaw) return '';
  const trimmed = stateRaw.trim();
  const lower = trimmed.toLowerCase();
  if (STATE_ALIASES[lower]) return STATE_ALIASES[lower];
  const exact = INDIAN_STATES.find((s) => s.toLowerCase() === lower);
  if (exact) return exact;
  const partial = INDIAN_STATES.find((s) => lower.includes(s.toLowerCase()));
  if (partial) return partial;
  return trimmed;
};

// Dynamic in-memory cache for live Photon results so lookups are 0ms once discovered
const DYNAMIC_CITIES_CACHE = new Map<string, CityItem>();

/**
 * Free API Live Lookup via Photon (OpenStreetMap):
 * Whenever user types 3+ letters and query is a smaller town/village not in the top list,
 * queries Photon with geographic prioritization for India with 300ms debounce.
 * Formats results as "City / Town, State".
 */
export const searchCitiesLive = async (
  query: string,
  limit = 12,
  signal?: AbortSignal
): Promise<CityItem[]> => {
  // 1. Instant 0ms local results first
  const localResults = searchCities(query, limit);

  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) {
    return localResults;
  }

  const liveResults: CityItem[] = [];
  const seen = new Set<string>(localResults.map((r) => r.displayName.toLowerCase()));

  // 1.5. If user typed a 6-digit Indian Pincode, query India Post API
  if (/^\d{6}$/.test(cleanQuery)) {
    try {
      const pinUrl = `https://api.postalpincode.in/pincode/${cleanQuery}`;
      const pinRes = await fetch(pinUrl, { signal });
      if (pinRes.ok) {
        const pinData = await pinRes.json();
        const postOffices = pinData?.[0]?.PostOffice || [];
        for (const po of postOffices) {
          const poName = (po.Name || '').trim();
          const poState = (po.State || '').trim();
          const poDistrict = (po.District || '').trim();
          if (!poName) continue;
          const normState = normalizeStateName(poState);
          const display = poDistrict && poDistrict.toLowerCase() !== poName.toLowerCase()
            ? `${poName} (${poDistrict}), ${normState}`
            : `${poName}, ${normState}`;
          const key = display.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            const item: CityItem = {
              city: poName,
              state: normState,
              country: 'India',
              displayName: display,
            };
            DYNAMIC_CITIES_CACHE.set(key, item);
            DYNAMIC_CITIES_CACHE.set(poName.toLowerCase(), item);
            liveResults.push(item);
          }
        }
        if (liveResults.length > 0) {
          return [...localResults, ...liveResults].slice(0, limit);
        }
      }
    } catch {
      // Fall through to text lookup
    }
  }

  // 2. Primary: Photon (OpenStreetMap geocoding engine)
  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&lat=20.5937&lon=78.9629&limit=15`;
    const res = await fetch(url, { signal });
    if (res.ok) {
      const data = await res.json();

      for (const feature of data?.features || []) {
        const props = feature?.properties;
        if (!props) continue;

        // Restrict strictly to India
        const isIndia =
          props.countrycode === 'IN' ||
          (props.country && props.country.toLowerCase() === 'india');
        if (!isIndia) continue;

        const osmKey = (props.osm_key || '').toLowerCase();
        const osmVal = (props.osm_value || '').toLowerCase();
        const pType = (props.type || '').toLowerCase();

        const isPlace =
          osmKey === 'place' ||
          osmKey === 'boundary' ||
          ['city', 'town', 'village', 'hamlet', 'suburb', 'neighbourhood', 'administrative', 'locality', 'district', 'county', 'house'].includes(osmVal) ||
          ['city', 'town', 'village', 'hamlet', 'district', 'county', 'locality', 'suburb'].includes(pType);

        if (!isPlace) continue;

        const rawCity = (props.name || props.city || props.town || props.village || props.locality || props.hamlet || '').trim();
        let rawState = (props.state || '').trim();
        const rawCounty = (props.county || props.district || '').trim();

        if (!rawCity) continue;

        if (!rawState && rawCounty) {
          rawState = rawCounty;
        }
        if (!rawState) {
          rawState = 'India';
        }

        const normalizedState = normalizeStateName(rawState);
        // Show taluka/district if helpful
        const displayName = rawCounty && rawCounty.toLowerCase() !== rawCity.toLowerCase() && rawCounty.toLowerCase() !== normalizedState.toLowerCase() && !rawCounty.toLowerCase().includes('district')
          ? `${rawCity} (${rawCounty.replace(/ taluka| tehsil/gi, '')}), ${normalizedState}`
          : `${rawCity}, ${normalizedState}`;
        const key = displayName.toLowerCase();

        if (!seen.has(key)) {
          seen.add(key);
          const item: CityItem = {
            city: rawCity,
            state: normalizedState,
            country: 'India',
            displayName,
          };

          // Cache in memory for instant subsequent lookups
          DYNAMIC_CITIES_CACHE.set(key, item);
          liveResults.push(item);
        }
      }
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return localResults;
    }
  }

  // 3. Secondary fallback: OpenStreetMap Nominatim if fewer than 3 results found
  if (liveResults.length < 3 && cleanQuery.length >= 3) {
    try {
      const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&countrycodes=in&format=json&addressdetails=1&limit=10`;
      const nomRes = await fetch(nomUrl, {
        signal,
        headers: { Accept: 'application/json' },
      });
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        for (const item of nomData || []) {
          const addr = item?.address || {};
          const cityName = (item?.name || addr?.village || addr?.town || addr?.city || addr?.hamlet || addr?.suburb || '').trim();
          const stateName = (addr?.state || '').trim();
          const countyName = (addr?.county || addr?.state_district || '').trim();
          if (!cityName) continue;

          const normState = stateName ? normalizeStateName(stateName) : (countyName || 'India');
          const display = countyName && countyName.toLowerCase() !== cityName.toLowerCase() && countyName.toLowerCase() !== normState.toLowerCase()
            ? `${cityName} (${countyName.replace(/ taluka| tehsil/gi, '')}), ${normState}`
            : `${cityName}, ${normState}`;
          const key = display.toLowerCase();

          if (!seen.has(key)) {
            seen.add(key);
            const cItem: CityItem = {
              city: cityName,
              state: normState,
              country: 'India',
              displayName: display,
            };
            DYNAMIC_CITIES_CACHE.set(key, cItem);
            liveResults.push(cItem);
          }
        }
      }
    } catch {
      // Ignore fallback errors
    }
  }

  // Merge and prioritize:
  // 1. Exact match on city name
  // 2. Starts-with match on city name
  // 3. Live results (villages/towns found directly by live search engines)
  // 4. Local results
  const qLower = cleanQuery.toLowerCase();
  const allCandidates = [...liveResults, ...localResults];

  allCandidates.sort((a, b) => {
    const aCityLower = a.city.toLowerCase();
    const bCityLower = b.city.toLowerCase();

    const aExact = aCityLower === qLower ? 2 : 0;
    const bExact = bCityLower === qLower ? 2 : 0;
    if (aExact !== bExact) return bExact - aExact;

    const aStarts = aCityLower.startsWith(qLower) ? 1 : 0;
    const bStarts = bCityLower.startsWith(qLower) ? 1 : 0;
    if (aStarts !== bStarts) return bStarts - aStarts;

    return 0;
  });

  const finalResults: CityItem[] = [];
  const finalSeen = new Set<string>();
  for (const item of allCandidates) {
    const k = item.displayName.toLowerCase();
    if (!finalSeen.has(k)) {
      finalSeen.add(k);
      finalResults.push(item);
    }
  }

  return finalResults.slice(0, Math.max(limit, 16));
};

/**
 * Validates if the given text represents a valid city, town, taluka or village.
 * Accepts:
 * 1. Exact or token match in top ~1,200 local database
 * 2. Any dynamically cached town/village from live search
 * 3. Any standard "City, State" where State is a recognized Indian state
 * 4. Any custom town or village name with at least 2 alphabetic characters (not digits only)
 */
export const isValidCity = (input?: string | null): boolean => {
  if (!input || !input.trim()) return false;
  const trimmed = input.trim();
  const val = trimmed.toLowerCase();
  const baseCity = val.split(",")[0].trim().replace(/[(),\-\/]/g, " ");

  // 1. Static local database match
  const inStatic = INDEXED_CITIES.some(
    (e) =>
      e.cLower === val ||
      e.dLower === val ||
      e.cleanTokens.includes(baseCity) ||
      e.cLower.split(" ")[0] === val
  );
  if (inStatic) return true;

  // 2. Dynamic cache match
  if (DYNAMIC_CITIES_CACHE.has(val)) {
    return true;
  }

  // 3. Recognized "City, State" pattern with valid Indian state
  const parts = trimmed.split(',').map((s) => s.trim());
  if (parts.length >= 2 && parts[0].length >= 2 && parts[1].length >= 2) {
    const candidateState = parts[parts.length - 1].toLowerCase();
    const isStateValid =
      INDIAN_STATES.some((s) => s.toLowerCase() === candidateState) ||
      !!STATE_ALIASES[candidateState];
    if (isStateValid) {
      return true;
    }
  }

  // 4. Flexible custom village, town or city entry (2-50 characters, NO numbers allowed)
  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (letters && letters.length >= 2 && trimmed.length <= 50 && !/\d/.test(trimmed)) {
    return true;
  }

  return false;
};

/**
 * Cleanly formats any custom village, town, or city name entered by the user.
 * Preserves state if provided (e.g. "bhoj, karnataka" -> "Bhoj, Karnataka").
 * If single word/name (e.g. "bhoj" -> "Bhoj").
 */
export const formatCustomPlace = (input?: string | null): string => {
  if (!input) return '';
  const trimmed = input.trim();
  if (!trimmed) return '';

  const parts = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const formattedCity = parts[0]
      .split(/(\s+|[()\-/\\])/)
      .map((part) => {
        if (/^(\s+|[()\-/\\])$/.test(part) || !part) return part;
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join('');
    const statePart = parts.slice(1).join(', ').trim();
    const normalizedState = normalizeStateName(statePart);
    return `${formattedCity}, ${
      normalizedState ||
      statePart
        .split(/(\s+|[()\-/\\])/)
        .map((p) =>
          /^(\s+|[()\-/\\])$/.test(p) || !p
            ? p
            : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        )
        .join('')
    }`;
  }

  return trimmed
    .split(/(\s+|[()\-/\\])/)
    .map((part) => {
      if (/^(\s+|[()\-/\\])$/.test(part) || !part) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
};

/**
 * Resolves a recognized canonical "City, State" or properly formatted place string.
 * If user entered a custom town or village not in static list, formats it with proper Title Case
 * without overwriting it with unrelated cities from live search or prefix matching.
 */
export const getCanonicalCity = (input?: string | null): string | null => {
  if (!input || !input.trim()) return null;
  const trimmed = input.trim();
  const val = trimmed.toLowerCase();

  // 1. Check exact displayName or exact city match in static local database
  const exact = INDEXED_CITIES.find((e) => e.dLower === val || e.cLower === val);
  if (exact) return exact.item.displayName;

  // 2. If user entered a "City, State" where state matches a recognized Indian state
  const parts = trimmed.split(',').map((s) => s.trim());
  if (parts.length >= 2 && parts[0].length >= 2 && parts[1].length >= 2) {
    const normalizedState = normalizeStateName(parts[parts.length - 1]);
    const isStateValid = INDIAN_STATES.some((s) => s.toLowerCase() === normalizedState.toLowerCase());
    if (isStateValid) {
      return formatCustomPlace(trimmed);
    }
  }

  // 3. User entered a custom town or village name: format it cleanly and accept it (no numbers, max 50 chars)
  const letters = trimmed.match(/[a-zA-Z\u0900-\u0D7F]/g);
  if (letters && letters.length >= 2 && trimmed.length <= 50 && !/\d/.test(trimmed)) {
    return formatCustomPlace(trimmed);
  }

  return null;
};
