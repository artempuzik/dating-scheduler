export type ZodiacSign = 
  | 'Aries' 
  | 'Taurus' 
  | 'Gemini' 
  | 'Cancer' 
  | 'Leo' 
  | 'Virgo' 
  | 'Libra' 
  | 'Scorpio' 
  | 'Sagittarius' 
  | 'Capricorn' 
  | 'Aquarius' 
  | 'Pisces';

export const zodiacSymbols: Record<ZodiacSign, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
};

export const zodiacDates: Record<ZodiacSign, { start: string; end: string }> = {
  Aries: { start: '03-21', end: '04-19' },
  Taurus: { start: '04-20', end: '05-20' },
  Gemini: { start: '05-21', end: '06-20' },
  Cancer: { start: '06-21', end: '07-22' },
  Leo: { start: '07-23', end: '08-22' },
  Virgo: { start: '08-23', end: '09-22' },
  Libra: { start: '09-23', end: '10-22' },
  Scorpio: { start: '10-23', end: '11-21' },
  Sagittarius: { start: '11-22', end: '12-21' },
  Capricorn: { start: '12-22', end: '01-19' },
  Aquarius: { start: '01-20', end: '02-18' },
  Pisces: { start: '02-19', end: '03-20' }
};

export const compatibilityDescriptions: Record<ZodiacSign, Record<ZodiacSign, string>> = {
  Aries: {
    Aries: "Two Aries create an exciting and dynamic relationship, but may need to work on patience.",
    Taurus: "Aries and Taurus can balance each other well, with Taurus providing stability.",
    Gemini: "Aries and Gemini make a lively pair with great communication.",
    Cancer: "Aries and Cancer may need to work on understanding each other's emotional needs.",
    Leo: "Aries and Leo create a passionate and energetic partnership.",
    Virgo: "Aries and Virgo can learn from each other's different approaches to life.",
    Libra: "Aries and Libra form a harmonious and balanced relationship.",
    Scorpio: "Aries and Scorpio create an intense and transformative connection.",
    Sagittarius: "Aries and Sagittarius make an adventurous and optimistic pair.",
    Capricorn: "Aries and Capricorn can complement each other's strengths and weaknesses.",
    Aquarius: "Aries and Aquarius form an innovative and forward-thinking partnership.",
    Pisces: "Aries and Pisces may need to bridge their different approaches to life."
  },
  Taurus: {
    Aries: "Taurus and Aries can balance each other well, with Taurus providing stability.",
    Taurus: "Two Taurus create a stable and sensual relationship.",
    Gemini: "Taurus and Gemini may need to work on understanding each other's needs.",
    Cancer: "Taurus and Cancer form a nurturing and secure partnership.",
    Leo: "Taurus and Leo create a luxurious and passionate connection.",
    Virgo: "Taurus and Virgo make a practical and harmonious pair.",
    Libra: "Taurus and Libra can learn from each other's different perspectives.",
    Scorpio: "Taurus and Scorpio form an intense and loyal relationship.",
    Sagittarius: "Taurus and Sagittarius may need to bridge their different approaches.",
    Capricorn: "Taurus and Capricorn create a stable and ambitious partnership.",
    Aquarius: "Taurus and Aquarius can learn from each other's unique qualities.",
    Pisces: "Taurus and Pisces form a romantic and dreamy connection."
  },
  Gemini: {
    Aries: "Gemini and Aries make a lively pair with great communication.",
    Taurus: "Gemini and Taurus may need to work on understanding each other's needs.",
    Gemini: "Two Gemini create an intellectually stimulating relationship.",
    Cancer: "Gemini and Cancer can learn from each other's different approaches.",
    Leo: "Gemini and Leo form a creative and expressive partnership.",
    Virgo: "Gemini and Virgo make an analytical and communicative pair.",
    Libra: "Gemini and Libra create a harmonious and social connection.",
    Scorpio: "Gemini and Scorpio may need to bridge their different depths.",
    Sagittarius: "Gemini and Sagittarius form an adventurous and philosophical pair.",
    Capricorn: "Gemini and Capricorn can complement each other's strengths.",
    Aquarius: "Gemini and Aquarius create an innovative and intellectual partnership.",
    Pisces: "Gemini and Pisces may need to work on understanding each other."
  },
  Cancer: {
    Aries: "Cancer and Aries may need to work on understanding each other's emotional needs.",
    Taurus: "Cancer and Taurus form a nurturing and secure partnership.",
    Gemini: "Cancer and Gemini can learn from each other's different approaches.",
    Cancer: "Two Cancer create a deeply emotional and intuitive connection.",
    Leo: "Cancer and Leo balance emotional depth with creative expression.",
    Virgo: "Cancer and Virgo form a caring and practical partnership.",
    Libra: "Cancer and Libra create a harmonious and nurturing relationship.",
    Scorpio: "Cancer and Scorpio share an intense emotional bond.",
    Sagittarius: "Cancer and Sagittarius may need to bridge emotional and philosophical differences.",
    Capricorn: "Cancer and Capricorn complement each other's emotional and practical sides.",
    Aquarius: "Cancer and Aquarius can learn from each other's unique perspectives.",
    Pisces: "Cancer and Pisces create a deeply empathetic and spiritual connection."
  },
  Leo: {
    Aries: "Leo and Aries create a passionate and energetic partnership.",
    Taurus: "Leo and Taurus create a luxurious and passionate connection.",
    Gemini: "Leo and Gemini form a creative and expressive partnership.",
    Cancer: "Leo and Cancer balance emotional depth with creative expression.",
    Leo: "Two Leo create a dramatic and passionate relationship.",
    Virgo: "Leo and Virgo can learn from each other's different approaches.",
    Libra: "Leo and Libra form a harmonious and creative partnership.",
    Scorpio: "Leo and Scorpio create an intense and transformative connection.",
    Sagittarius: "Leo and Sagittarius make an adventurous and optimistic pair.",
    Capricorn: "Leo and Capricorn can balance creativity with practicality.",
    Aquarius: "Leo and Aquarius may need to bridge their different approaches.",
    Pisces: "Leo and Pisces create a creative and compassionate connection."
  },
  Virgo: {
    Aries: "Virgo and Aries can learn from each other's different approaches to life.",
    Taurus: "Virgo and Taurus make a practical and harmonious pair.",
    Gemini: "Virgo and Gemini make an analytical and communicative pair.",
    Cancer: "Virgo and Cancer form a caring and practical partnership.",
    Leo: "Virgo and Leo can learn from each other's different approaches.",
    Virgo: "Two Virgo create a practical and detail-oriented relationship.",
    Libra: "Virgo and Libra can balance practicality with harmony.",
    Scorpio: "Virgo and Scorpio form an intense and analytical partnership.",
    Sagittarius: "Virgo and Sagittarius may need to bridge practical and philosophical views.",
    Capricorn: "Virgo and Capricorn create a practical and ambitious partnership.",
    Aquarius: "Virgo and Aquarius can learn from each other's unique perspectives.",
    Pisces: "Virgo and Pisces balance practicality with intuition."
  },
  Libra: {
    Aries: "Libra and Aries form a harmonious and balanced relationship.",
    Taurus: "Libra and Taurus can learn from each other's different perspectives.",
    Gemini: "Libra and Gemini create a harmonious and social connection.",
    Cancer: "Libra and Cancer create a harmonious and nurturing relationship.",
    Leo: "Libra and Leo form a harmonious and creative partnership.",
    Virgo: "Libra and Virgo can balance practicality with harmony.",
    Libra: "Two Libra create a balanced and harmonious relationship.",
    Scorpio: "Libra and Scorpio may need to bridge harmony and intensity.",
    Sagittarius: "Libra and Sagittarius form a social and philosophical pair.",
    Capricorn: "Libra and Capricorn can balance harmony with ambition.",
    Aquarius: "Libra and Aquarius create a harmonious and innovative partnership.",
    Pisces: "Libra and Pisces form a harmonious and compassionate connection."
  },
  Scorpio: {
    Aries: "Scorpio and Aries create an intense and transformative connection.",
    Taurus: "Scorpio and Taurus form an intense and loyal relationship.",
    Gemini: "Scorpio and Gemini may need to bridge their different depths.",
    Cancer: "Scorpio and Cancer share an intense emotional bond.",
    Leo: "Scorpio and Leo create an intense and transformative connection.",
    Virgo: "Scorpio and Virgo form an intense and analytical partnership.",
    Libra: "Scorpio and Libra may need to bridge harmony and intensity.",
    Scorpio: "Two Scorpio create an intense and transformative relationship.",
    Sagittarius: "Scorpio and Sagittarius may need to bridge depth and freedom.",
    Capricorn: "Scorpio and Capricorn form an intense and ambitious partnership.",
    Aquarius: "Scorpio and Aquarius may need to bridge emotional and intellectual approaches.",
    Pisces: "Scorpio and Pisces create a deep and spiritual connection."
  },
  Sagittarius: {
    Aries: "Sagittarius and Aries make an adventurous and optimistic pair.",
    Taurus: "Sagittarius and Taurus may need to bridge their different approaches.",
    Gemini: "Sagittarius and Gemini form an adventurous and philosophical pair.",
    Cancer: "Sagittarius and Cancer may need to bridge emotional and philosophical differences.",
    Leo: "Sagittarius and Leo make an adventurous and optimistic pair.",
    Virgo: "Sagittarius and Virgo may need to bridge practical and philosophical views.",
    Libra: "Sagittarius and Libra form a social and philosophical pair.",
    Scorpio: "Sagittarius and Scorpio may need to bridge depth and freedom.",
    Sagittarius: "Two Sagittarius create an adventurous and philosophical relationship.",
    Capricorn: "Sagittarius and Capricorn can balance freedom with responsibility.",
    Aquarius: "Sagittarius and Aquarius form an innovative and philosophical partnership.",
    Pisces: "Sagittarius and Pisces can bridge philosophical and spiritual views."
  },
  Capricorn: {
    Aries: "Capricorn and Aries can complement each other's strengths and weaknesses.",
    Taurus: "Capricorn and Taurus create a stable and ambitious partnership.",
    Gemini: "Capricorn and Gemini can complement each other's strengths.",
    Cancer: "Capricorn and Cancer complement each other's emotional and practical sides.",
    Leo: "Capricorn and Leo can balance creativity with practicality.",
    Virgo: "Capricorn and Virgo create a practical and ambitious partnership.",
    Libra: "Capricorn and Libra can balance harmony with ambition.",
    Scorpio: "Capricorn and Scorpio form an intense and ambitious partnership.",
    Sagittarius: "Capricorn and Sagittarius can balance freedom with responsibility.",
    Capricorn: "Two Capricorn create a practical and ambitious relationship.",
    Aquarius: "Capricorn and Aquarius can balance tradition with innovation.",
    Pisces: "Capricorn and Pisces can balance practicality with spirituality."
  },
  Aquarius: {
    Aries: "Aquarius and Aries form an innovative and forward-thinking partnership.",
    Taurus: "Aquarius and Taurus can learn from each other's unique qualities.",
    Gemini: "Aquarius and Gemini create an innovative and intellectual partnership.",
    Cancer: "Aquarius and Cancer can learn from each other's unique perspectives.",
    Leo: "Aquarius and Leo may need to bridge their different approaches.",
    Virgo: "Aquarius and Virgo can learn from each other's unique perspectives.",
    Libra: "Aquarius and Libra create a harmonious and innovative partnership.",
    Scorpio: "Aquarius and Scorpio may need to bridge emotional and intellectual approaches.",
    Sagittarius: "Aquarius and Sagittarius form an innovative and philosophical partnership.",
    Capricorn: "Aquarius and Capricorn can balance tradition with innovation.",
    Aquarius: "Two Aquarius create an innovative and intellectual relationship.",
    Pisces: "Aquarius and Pisces can bridge intellectual and spiritual approaches."
  },
  Pisces: {
    Aries: "Pisces and Aries may need to bridge their different approaches to life.",
    Taurus: "Pisces and Taurus form a romantic and dreamy connection.",
    Gemini: "Pisces and Gemini may need to work on understanding each other.",
    Cancer: "Pisces and Cancer create a deeply empathetic and spiritual connection.",
    Leo: "Pisces and Leo create a creative and compassionate connection.",
    Virgo: "Pisces and Virgo balance practicality with intuition.",
    Libra: "Pisces and Libra form a harmonious and compassionate connection.",
    Scorpio: "Pisces and Scorpio create a deep and spiritual connection.",
    Sagittarius: "Pisces and Sagittarius can bridge philosophical and spiritual views.",
    Capricorn: "Pisces and Capricorn can balance practicality with spirituality.",
    Aquarius: "Pisces and Aquarius can bridge intellectual and spiritual approaches.",
    Pisces: "Two Pisces create a deeply spiritual and empathetic relationship."
  }
};

export function getZodiacSign(birthday: string): ZodiacSign {
  const date = new Date(birthday);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateStr = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  for (const [sign, { start, end }] of Object.entries(zodiacDates)) {
    if (dateStr >= start && dateStr <= end) {
      return sign as ZodiacSign;
    }
  }

  // Handle Capricorn's special case (spans across new year)
  if (dateStr >= '12-22' || dateStr <= '01-19') {
    return 'Capricorn';
  }

  return 'Aries'; // Default fallback
} 