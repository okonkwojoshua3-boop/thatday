import type { CountryCode } from './countries'

// "Surprise me" on the Time Machine lands on one of these moments. Dates are
// checked against Wikipedia; every photo is from Wikimedia Commons with its
// credit in photoCredits.ts. Where no free photo of the event exists, the
// photo shows its main person or place, and the credit says what it shows.

export interface Surprise {
  date: { y: number; m: number; d: number } // m is 0-based
  /** 'world' moments suit everyone; the rest come up more for their country */
  country: CountryCode
  text: string
  src: string
}

export const SURPRISES: Surprise[] = [
  { date: { y: 1969, m: 6, d: 20 }, country: 'world', text: 'Apollo 11 lands on the Moon.', src: '/welcome/moon.jpg' },
  { date: { y: 1989, m: 10, d: 9 }, country: 'de', text: 'The Berlin Wall falls.', src: '/welcome/berlin.jpg' },
  { date: { y: 1994, m: 4, d: 10 }, country: 'za', text: 'Mandela is sworn in as president.', src: '/welcome/mandela.jpg' },
  { date: { y: 1967, m: 3, d: 28 }, country: 'us', text: 'Muhammad Ali refuses the draft.', src: '/welcome/ali.jpg' },
  { date: { y: 1953, m: 5, d: 2 }, country: 'gb', text: 'Elizabeth II is crowned.', src: '/surprise/coronation-elizabeth-ii-1953.jpg' },
  { date: { y: 1955, m: 11, d: 1 }, country: 'us', text: 'Rosa Parks refuses to give up her seat.', src: '/surprise/rosa-parks-1955.jpg' },
  { date: { y: 1957, m: 2, d: 6 }, country: 'gh', text: 'Ghana becomes independent.', src: '/surprise/ghana-independence-nkrumah.jpg' },
  { date: { y: 1960, m: 3, d: 21 }, country: 'br', text: 'Brasília becomes Brazil\'s capital.', src: '/surprise/brasilia-national-congress-1960.jpg' },
  { date: { y: 1960, m: 9, d: 1 }, country: 'ng', text: 'Nigeria becomes independent.', src: '/surprise/nigeria-independence-balewa-1960.jpg' },
  { date: { y: 1961, m: 3, d: 12 }, country: 'world', text: 'Yuri Gagarin becomes the first human in space.', src: '/surprise/yuri-gagarin-1961.jpg' },
  { date: { y: 1963, m: 7, d: 28 }, country: 'us', text: 'Martin Luther King Jr.: "I have a dream."', src: '/surprise/march-on-washington-mlk-1963.jpg' },
  { date: { y: 1963, m: 11, d: 12 }, country: 'ke', text: 'Kenya becomes independent.', src: '/surprise/kenya-independence-kenyatta.jpg' },
  { date: { y: 1964, m: 9, d: 1 }, country: 'jp', text: 'Japan\'s bullet train starts running.', src: '/surprise/shinkansen-0-series-1967.jpg' },
  { date: { y: 1965, m: 1, d: 15 }, country: 'ca', text: 'Canada raises the Maple Leaf flag.', src: '/surprise/canada-maple-leaf-flag.jpg' },
  { date: { y: 1966, m: 6, d: 30 }, country: 'gb', text: 'England win the World Cup.', src: '/surprise/england-world-cup-final-1966.jpg' },
  { date: { y: 1970, m: 5, d: 21 }, country: 'br', text: 'Brazil win their third World Cup.', src: '/surprise/brazil-world-cup-1970-pele.jpg' },
  { date: { y: 1973, m: 9, d: 20 }, country: 'au', text: 'The Sydney Opera House opens.', src: '/surprise/sydney-opera-house-opening-1973.jpg' },
  { date: { y: 1981, m: 3, d: 12 }, country: 'us', text: 'The first Space Shuttle lifts off.', src: '/surprise/sts-1-columbia-launch-1981.jpg' },
  { date: { y: 1983, m: 5, d: 25 }, country: 'in', text: 'India win the Cricket World Cup.', src: '/surprise/india-world-cup-1983-prudential-cup.jpg' },
  { date: { y: 1990, m: 1, d: 11 }, country: 'za', text: 'Nelson Mandela walks free after 27 years.', src: '/surprise/nelson-mandela-1990.jpg' },
  { date: { y: 1990, m: 9, d: 3 }, country: 'de', text: 'Germany is reunified.', src: '/surprise/german-reunification-reichstag-1990.jpg' },
  { date: { y: 1991, m: 7, d: 6 }, country: 'world', text: 'Tim Berners-Lee opens the Web to all.', src: '/surprise/world-wide-web-tim-berners-lee.jpg' },
  { date: { y: 1998, m: 6, d: 12 }, country: 'fr', text: 'France win the World Cup.', src: '/surprise/france-world-cup-1998-zidane.jpg' },
  { date: { y: 2000, m: 8, d: 15 }, country: 'au', text: 'The Sydney Olympics open.', src: '/surprise/sydney-olympics-opening-2000.jpg' },
  { date: { y: 2001, m: 9, d: 12 }, country: 'gh', text: 'Kofi Annan wins the Nobel Peace Prize.', src: '/surprise/kofi-annan-nobel-2001.jpg' },
  { date: { y: 2002, m: 5, d: 30 }, country: 'br', text: 'Brazil win their fifth World Cup.', src: '/surprise/brazil-world-cup-2002.jpg' },
  { date: { y: 2005, m: 3, d: 23 }, country: 'world', text: 'The first YouTube video is uploaded.', src: '/surprise/youtube-me-at-the-zoo-2005.jpg' },
  { date: { y: 2007, m: 0, d: 9 }, country: 'us', text: 'Steve Jobs unveils the iPhone.', src: '/surprise/steve-jobs-iphone-2007.jpg' },
  { date: { y: 2009, m: 0, d: 20 }, country: 'us', text: 'Barack Obama is sworn in as president.', src: '/surprise/obama-inauguration-2009.jpg' },
  { date: { y: 2010, m: 1, d: 28 }, country: 'ca', text: 'Sidney Crosby scores the golden goal.', src: '/surprise/crosby-golden-goal-2010.jpg' },
  { date: { y: 2010, m: 6, d: 11 }, country: 'za', text: 'Spain win the World Cup in Johannesburg.', src: '/surprise/spain-world-cup-2010.jpg' },
  { date: { y: 2012, m: 6, d: 27 }, country: 'gb', text: 'The London Olympics open.', src: '/surprise/london-olympics-opening-2012.jpg' },
  { date: { y: 2012, m: 7, d: 6 }, country: 'world', text: 'Curiosity lands on Mars.', src: '/surprise/curiosity-landing-2012.jpg' },
  { date: { y: 2013, m: 1, d: 10 }, country: 'ng', text: 'Nigeria win the Africa Cup of Nations.', src: '/surprise/nigeria-afcon-2013.jpg' },
  { date: { y: 2014, m: 6, d: 13 }, country: 'de', text: 'Germany win the World Cup.', src: '/surprise/germany-world-cup-2014.jpg' },
  { date: { y: 2015, m: 6, d: 14 }, country: 'world', text: 'New Horizons flies past Pluto.', src: '/surprise/new-horizons-pluto-2015.jpg' },
  { date: { y: 2018, m: 6, d: 15 }, country: 'fr', text: 'France win the World Cup.', src: '/surprise/france-world-cup-2018.jpg' },
  { date: { y: 2019, m: 3, d: 10 }, country: 'world', text: 'The first image of a black hole is revealed.', src: '/surprise/black-hole-m87-2019.jpg' },
  { date: { y: 2019, m: 9, d: 12 }, country: 'ke', text: 'Eliud Kipchoge runs a marathon in under two hours.', src: '/surprise/kipchoge-sub-two-2019.jpg' },
  { date: { y: 2021, m: 6, d: 23 }, country: 'jp', text: 'The Tokyo Olympics open, a year late.', src: '/surprise/tokyo-olympics-opening-2021.jpg' },
  { date: { y: 2021, m: 11, d: 25 }, country: 'world', text: 'The James Webb Space Telescope launches.', src: '/surprise/jwst-launch-2021.jpg' },
]

// Moments from the picked country are four times as likely
const LOCAL_WEIGHT = 4

export function pickSurprise(options: Surprise[], country: CountryCode) {
  const weight = (s: Surprise) => (country !== 'world' && s.country === country ? LOCAL_WEIGHT : 1)
  let r = Math.random() * options.reduce((sum, s) => sum + weight(s), 0)
  for (const s of options) {
    r -= weight(s)
    if (r < 0) return s
  }
  return options[options.length - 1]
}
