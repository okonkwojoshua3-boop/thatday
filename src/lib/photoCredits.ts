// Credits for the photos in public/welcome (Welcome arches, story card and the
// Time Machine's Surprise me). Taken from each file's Wikimedia Commons page.
// CC BY-SA needs the author, licence, source and a note of changes.

export interface PhotoCredit {
  src: string
  title: string
  author: string
  licence: string
  licenceUrl?: string
  source: string
  changes: string
}

const COMMONS = 'https://commons.wikimedia.org/wiki/File:'

export const PHOTO_CREDITS: PhotoCredit[] = [
  {
    src: '/welcome/moon.jpg',
    title: 'A Man on the Moon (AS11-40-5903), 1969',
    author: 'Neil A. Armstrong, NASA',
    licence: 'Public domain',
    source: `${COMMONS}A_Man_on_the_Moon,_AS11-40-5903_(cropped).jpg`,
    changes: 'Cropped, shown in black and white',
  },
  {
    src: '/welcome/ali.jpg',
    title: 'Muhammad Ali, 1967',
    author: 'Ira Rosenberg, World Journal Tribune (Library of Congress)',
    licence: 'Public domain',
    source: `${COMMONS}Muhammad_Ali_NYWTS.jpg`,
    changes: 'Cropped, shown in black and white',
  },
  {
    src: '/welcome/fela.jpg',
    title: 'Fela Kuti, circa 1986',
    author: 'Promotional photo, Celluloid Records',
    licence: 'Public domain',
    source: `${COMMONS}Fela_Kuti_circa_1986.jpg`,
    changes: 'Cropped, shown in black and white',
  },
  {
    src: '/welcome/mandela.jpg',
    title: 'Nelson Mandela in Washington, DC, October 1994',
    author: 'Kingkongphoto & www.celebrity-photos.com',
    licence: 'CC BY-SA 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
    source: `${COMMONS}Nelson_Mandela_1994.jpg`,
    changes: 'Cropped, shown in black and white',
  },
  {
    src: '/welcome/berlin.jpg',
    title: 'West and East Germans at the Brandenburg Gate, 1989',
    author: 'Unknown photographer; reproduction by Lear 21',
    licence: 'CC BY-SA 3.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    source: `${COMMONS}West_and_East_Germans_at_the_Brandenburg_Gate_in_1989.jpg`,
    changes: 'Cropped, darkened under the caption, black and white in Surprise me',
  },
]
