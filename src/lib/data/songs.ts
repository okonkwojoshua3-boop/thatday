import type { Song } from '@/types'

interface SongEntry {
  title: string
  artist: string
}

// US — Billboard year-end No.1 (best sellers 1950–57, Hot 100 from 1958)
const usSongsByYear: Record<number, SongEntry> = {
  1950: { title: 'Goodnight Irene',                             artist: 'Gordon Jenkins and The Weavers' },
  1951: { title: 'Too Young',                                   artist: 'Nat King Cole' },
  1952: { title: 'Blue Tango',                                  artist: 'Leroy Anderson' },
  1953: { title: 'Song from Moulin Rouge',                      artist: 'Percy Faith' },
  1954: { title: 'Little Things Mean a Lot',                    artist: 'Kitty Kallen' },
  1955: { title: 'Cherry Pink and Apple Blossom White',         artist: 'Pérez Prado' },
  1956: { title: 'Heartbreak Hotel',                            artist: 'Elvis Presley' },
  1957: { title: 'All Shook Up',                                artist: 'Elvis Presley' },
  1958: { title: 'Nel Blu Dipinto di Blu (Volare)',             artist: 'Domenico Modugno' },
  1959: { title: 'The Battle of New Orleans',                   artist: 'Johnny Horton' },
  1960: { title: 'Theme from A Summer Place',                   artist: 'Percy Faith' },
  1961: { title: "Tossin' and Turnin'",                         artist: 'Bobby Lewis' },
  1962: { title: 'Stranger on the Shore',                       artist: 'Mr. Acker Bilk' },
  1963: { title: 'Sugar Shack',                                 artist: 'Jimmy Gilmer and the Fireballs' },
  1964: { title: 'I Want to Hold Your Hand',                    artist: 'The Beatles' },
  1965: { title: 'Wooly Bully',                                 artist: 'Sam the Sham & the Pharaohs' },
  1966: { title: 'The Ballad of the Green Berets',              artist: 'SSgt. Barry Sadler' },
  1967: { title: 'To Sir with Love',                            artist: 'Lulu' },
  1968: { title: 'Hey Jude',                                    artist: 'The Beatles' },
  1969: { title: 'Sugar, Sugar',                                artist: 'The Archies' },
  1970: { title: 'Bridge over Troubled Water',                  artist: 'Simon & Garfunkel' },
  1971: { title: 'Joy to the World',                            artist: 'Three Dog Night' },
  1972: { title: 'The First Time Ever I Saw Your Face',         artist: 'Roberta Flack' },
  1973: { title: "Tie a Yellow Ribbon 'Round the Ole Oak Tree", artist: 'Tony Orlando and Dawn' },
  1974: { title: 'The Way We Were',                             artist: 'Barbra Streisand' },
  1975: { title: 'Love Will Keep Us Together',                  artist: 'Captain & Tennille' },
  1976: { title: 'Silly Love Songs',                            artist: 'Wings' },
  1977: { title: "Tonight's the Night (Gonna Be Alright)",      artist: 'Rod Stewart' },
  1978: { title: 'Shadow Dancing',                              artist: 'Andy Gibb' },
  1979: { title: 'My Sharona',                                  artist: 'The Knack' },
  1980: { title: 'Call Me',                                     artist: 'Blondie' },
  1981: { title: 'Bette Davis Eyes',                            artist: 'Kim Carnes' },
  1982: { title: 'Physical',                                    artist: 'Olivia Newton-John' },
  1983: { title: 'Every Breath You Take',                       artist: 'The Police' },
  1984: { title: 'When Doves Cry',                              artist: 'Prince' },
  1985: { title: 'Careless Whisper',                            artist: 'Wham! featuring George Michael' },
  1986: { title: "That's What Friends Are For",                 artist: 'Dionne & Friends' },
  1987: { title: 'Walk Like an Egyptian',                       artist: 'The Bangles' },
  1988: { title: 'Faith',                                       artist: 'George Michael' },
  1989: { title: 'Look Away',                                   artist: 'Chicago' },
  1990: { title: 'Hold On',                                     artist: 'Wilson Phillips' },
  1991: { title: '(Everything I Do) I Do It for You',           artist: 'Bryan Adams' },
  1992: { title: 'End of the Road',                             artist: 'Boyz II Men' },
  1993: { title: 'I Will Always Love You',                      artist: 'Whitney Houston' },
  1994: { title: 'The Sign',                                    artist: 'Ace of Base' },
  1995: { title: "Gangsta's Paradise",                          artist: 'Coolio featuring L.V.' },
  1996: { title: 'Macarena (Bayside Boys Mix)',                 artist: 'Los del Río' },
  1997: { title: 'Candle in the Wind 1997',                     artist: 'Elton John' },
  1998: { title: 'Too Close',                                   artist: 'Next' },
  1999: { title: 'Believe',                                     artist: 'Cher' },
  2000: { title: 'Breathe',                                     artist: 'Faith Hill' },
  2001: { title: 'Hanging by a Moment',                         artist: 'Lifehouse' },
  2002: { title: 'How You Remind Me',                           artist: 'Nickelback' },
  2003: { title: 'In Da Club',                                  artist: '50 Cent' },
  2004: { title: 'Yeah!',                                       artist: 'Usher featuring Lil Jon and Ludacris' },
  2005: { title: 'We Belong Together',                          artist: 'Mariah Carey' },
  2006: { title: 'Bad Day',                                     artist: 'Daniel Powter' },
  2007: { title: 'Irreplaceable',                               artist: 'Beyoncé' },
  2008: { title: 'Low',                                         artist: 'Flo Rida featuring T-Pain' },
  2009: { title: 'Boom Boom Pow',                               artist: 'The Black Eyed Peas' },
  2010: { title: 'Tik Tok',                                     artist: 'Kesha' },
  2011: { title: 'Rolling in the Deep',                         artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',                artist: 'Gotye featuring Kimbra' },
  2013: { title: 'Thrift Shop',                                 artist: 'Macklemore & Ryan Lewis featuring Wanz' },
  2014: { title: 'Happy',                                       artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                                 artist: 'Mark Ronson featuring Bruno Mars' },
  2016: { title: 'Love Yourself',                               artist: 'Justin Bieber' },
  2017: { title: 'Shape of You',                                artist: 'Ed Sheeran' },
  2018: { title: "God's Plan",                                  artist: 'Drake' },
  2019: { title: 'Old Town Road',                               artist: 'Lil Nas X featuring Billy Ray Cyrus' },
  2020: { title: 'Blinding Lights',                             artist: 'The Weeknd' },
  2021: { title: 'Levitating',                                  artist: 'Dua Lipa' },
  2022: { title: 'Heat Waves',                                  artist: 'Glass Animals' },
  2023: { title: 'Last Night',                                  artist: 'Morgan Wallen' },
  2024: { title: 'Lose Control',                                artist: 'Teddy Swims' },
  2025: { title: 'Die with a Smile',                            artist: 'Lady Gaga and Bruno Mars' },
}

// UK — best-selling single of the year (chart from Nov 1952)
const gbSongsByYear: Record<number, SongEntry> = {
  1952: { title: 'Here in My Heart',                               artist: 'Al Martino' },
  1953: { title: 'I Believe',                                      artist: 'Frankie Laine' },
  1954: { title: 'Secret Love',                                    artist: 'Doris Day' },
  1955: { title: 'Rose Marie',                                     artist: 'Slim Whitman' },
  1956: { title: "I'll Be Home",                                   artist: 'Pat Boone' },
  1957: { title: 'Diana',                                          artist: 'Paul Anka' },
  1958: { title: 'Jailhouse Rock',                                 artist: 'Elvis Presley' },
  1959: { title: 'Living Doll',                                    artist: 'Cliff Richard' },
  1960: { title: "It's Now or Never",                              artist: 'Elvis Presley' },
  1961: { title: 'Wooden Heart',                                   artist: 'Elvis Presley' },
  1962: { title: 'I Remember You',                                 artist: 'Frank Ifield' },
  1963: { title: 'She Loves You',                                  artist: 'The Beatles' },
  1964: { title: "Can't Buy Me Love",                              artist: 'The Beatles' },
  1965: { title: 'Tears',                                          artist: 'Ken Dodd' },
  1966: { title: 'Green, Green Grass of Home',                     artist: 'Tom Jones' },
  1967: { title: 'Release Me',                                     artist: 'Engelbert Humperdinck' },
  1968: { title: 'Hey Jude',                                       artist: 'The Beatles' },
  1969: { title: 'Sugar, Sugar',                                   artist: 'The Archies' },
  1970: { title: 'In the Summertime',                              artist: 'Mungo Jerry' },
  1971: { title: 'My Sweet Lord',                                  artist: 'George Harrison' },
  1972: { title: 'Amazing Grace',                                  artist: 'The Royal Scots Dragoon Guards Band' },
  1973: { title: 'Tie a Yellow Ribbon Round the Ole Oak Tree',     artist: 'Dawn featuring Tony Orlando' },
  1974: { title: 'Tiger Feet',                                     artist: 'Mud' },
  1975: { title: 'Bye Bye Baby',                                   artist: 'Bay City Rollers' },
  1976: { title: 'Save Your Kisses for Me',                        artist: 'Brotherhood of Man' },
  1977: { title: 'Mull of Kintyre',                                artist: 'Wings' },
  1978: { title: 'Rivers of Babylon',                              artist: 'Boney M.' },
  1979: { title: 'Bright Eyes',                                    artist: 'Art Garfunkel' },
  1980: { title: "Don't Stand So Close to Me",                     artist: 'The Police' },
  1981: { title: "Don't You Want Me",                              artist: 'The Human League' },
  1982: { title: 'Come On Eileen',                                 artist: 'Dexys Midnight Runners' },
  1983: { title: 'Karma Chameleon',                                artist: 'Culture Club' },
  1984: { title: "Do They Know It's Christmas?",                   artist: 'Band Aid' },
  1985: { title: 'The Power of Love',                              artist: 'Jennifer Rush' },
  1986: { title: "Don't Leave Me This Way",                        artist: 'The Communards' },
  1987: { title: 'Never Gonna Give You Up',                        artist: 'Rick Astley' },
  1988: { title: 'Mistletoe and Wine',                             artist: 'Cliff Richard' },
  1989: { title: 'Ride On Time',                                   artist: 'Black Box' },
  1990: { title: 'Unchained Melody',                               artist: 'The Righteous Brothers' },
  1991: { title: '(Everything I Do) I Do It for You',              artist: 'Bryan Adams' },
  1992: { title: 'I Will Always Love You',                         artist: 'Whitney Houston' },
  1993: { title: "I'd Do Anything for Love (But I Won't Do That)", artist: 'Meat Loaf' },
  1994: { title: 'Love Is All Around',                             artist: 'Wet Wet Wet' },
  1995: { title: 'Unchained Melody',                               artist: 'Robson & Jerome' },
  1996: { title: 'Killing Me Softly',                              artist: 'Fugees' },
  1997: { title: 'Candle in the Wind 1997',                        artist: 'Elton John' },
  1998: { title: 'Believe',                                        artist: 'Cher' },
  1999: { title: '...Baby One More Time',                          artist: 'Britney Spears' },
  2000: { title: 'Can We Fix It?',                                 artist: 'Bob the Builder' },
  2001: { title: "It Wasn't Me",                                   artist: 'Shaggy featuring Rikrok' },
  2002: { title: 'Anything Is Possible / Evergreen',               artist: 'Will Young' },
  2003: { title: 'Where Is the Love?',                             artist: 'The Black Eyed Peas' },
  2004: { title: "Do They Know It's Christmas?",                   artist: 'Band Aid 20' },
  2005: { title: 'Is This the Way to Amarillo',                    artist: 'Tony Christie featuring Peter Kay' },
  2006: { title: 'Crazy',                                          artist: 'Gnarls Barkley' },
  2007: { title: 'Bleeding Love',                                  artist: 'Leona Lewis' },
  2008: { title: 'Hallelujah',                                     artist: 'Alexandra Burke' },
  2009: { title: 'Poker Face',                                     artist: 'Lady Gaga' },
  2010: { title: 'Love the Way You Lie',                           artist: 'Eminem featuring Rihanna' },
  2011: { title: 'Someone like You',                               artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',                   artist: 'Gotye featuring Kimbra' },
  2013: { title: 'Blurred Lines',                                  artist: 'Robin Thicke featuring T.I. and Pharrell Williams' },
  2014: { title: 'Happy',                                          artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                                    artist: 'Mark Ronson featuring Bruno Mars' },
  2016: { title: 'One Dance',                                      artist: 'Drake featuring Wizkid & Kyla' },
  2017: { title: 'Shape of You',                                   artist: 'Ed Sheeran' },
  2018: { title: 'One Kiss',                                       artist: 'Calvin Harris and Dua Lipa' },
  2019: { title: 'Someone You Loved',                              artist: 'Lewis Capaldi' },
  2020: { title: 'Blinding Lights',                                artist: 'The Weeknd' },
  2021: { title: 'Bad Habits',                                     artist: 'Ed Sheeran' },
  2022: { title: 'As It Was',                                      artist: 'Harry Styles' },
  2023: { title: 'Flowers',                                        artist: 'Miley Cyrus' },
  2024: { title: 'Stick Season',                                   artist: 'Noah Kahan' },
  2025: { title: 'Ordinary',                                       artist: 'Alex Warren' },
}

// Nigeria — notable releases (to 1996), defining song of the year (Zikoko lists,
// Headies; 1997–2019), TurnTable year-end No.1 (2020+). Gaps: nothing verifiable.
const ngSongsByYear: Record<number, SongEntry> = {
  1972: { title: 'Shakara',                artist: 'Fela Kuti' },
  1973: { title: 'Gentleman',              artist: 'Fela Kuti' },
  1975: { title: 'Expensive Shit',         artist: 'Fela Kuti' },
  1976: { title: 'Zombie',                 artist: 'Fela Kuti' },
  1977: { title: 'Sorrow Tears and Blood', artist: 'Fela Kuti' },
  1980: { title: 'Authority Stealing',     artist: 'Fela Kuti' },
  1983: { title: 'Perambulator',           artist: 'Fela Kuti' },
  1985: { title: 'Army Arrangement',       artist: 'Fela Kuti' },
  1988: { title: 'Send Down the Rain',     artist: 'Majek Fashek' },
  1997: { title: 'Dem Go Dey Pose',        artist: 'Baba Fryo' },
  1998: { title: 'Sakomo',                 artist: 'The Remedies' },
  1999: { title: 'Diana',                  artist: 'Daddy Showkey' },
  2000: { title: 'Mathematics',            artist: 'Sound Sultan' },
  2001: { title: 'My Car',                 artist: 'Tony Tetuila' },
  2002: { title: 'Mr Lecturer',            artist: 'Eedris Abdulkareem' },
  2003: { title: 'Danfo Driver',           artist: 'Mad Melon & Mountain Black' },
  2004: { title: 'African Queen',          artist: '2face Idibia' },
  2005: { title: 'Tongolo',                artist: "D'banj" },
  2006: { title: 'Why Me',                 artist: "D'banj" },
  2007: { title: 'Yahooze',                artist: 'Olu Maintain' },
  2008: { title: 'Gongo Aso',              artist: '9ice' },
  2009: { title: 'Yori Yori',              artist: 'Bracket' },
  2010: { title: 'Holla at Your Boy',      artist: 'Wizkid' },
  2011: { title: 'Dami Duro',              artist: 'Davido' },
  2012: { title: 'Kukere',                 artist: 'Iyanya' },
  2013: { title: 'Skelewu',                artist: 'Davido' },
  2014: { title: 'Aye',                    artist: 'Davido' },
  2015: { title: 'Godwin',                 artist: 'Korede Bello' },
  2016: { title: 'Fada Fada',              artist: 'Phyno ft. Olamide' },
  2017: { title: 'Fia',                    artist: 'Davido' },
  2018: { title: 'Soco',                   artist: 'Wizkid ft. Terri, Spotless & Ceeza Milli' },
  2020: { title: 'Nobody',                 artist: 'DJ Neptune ft. Joeboy & Mr Eazi' },
  2021: { title: 'Godly',                  artist: 'Omah Lay' },
  2022: { title: 'Buga (Lo Lo Lo)',        artist: 'Kizz Daniel ft. Tekno' },
  2023: { title: 'Lonely at the Top',      artist: 'Asake' },
  2024: { title: 'Twe Twe (Remix)',        artist: 'Kizz Daniel ft. Davido' },
  2025: { title: 'Joy Is Coming',          artist: 'Fido' },
}

// South Africa — Springbok Radio year-end No.1 (1958–88), verified hits after,
// Spotify Wrapped most-streamed (2023+)
const zaSongsByYear: Record<number, SongEntry> = {
  1958: { title: 'All I Have to Do Is Dream',        artist: 'The Everly Brothers' },
  1959: { title: 'Living Doll',                      artist: 'Cliff Richard' },
  1960: { title: "It's Now or Never",                artist: 'Elvis Presley' },
  1961: { title: 'Wooden Heart',                     artist: 'Elvis Presley' },
  1962: { title: 'Telstar',                          artist: 'The Tornados' },
  1963: { title: 'From Me to You',                   artist: 'The Beatles' },
  1964: { title: 'Heart',                            artist: 'Gene Rockwell' },
  1965: { title: 'The Carnival Is Over',             artist: 'The Seekers' },
  1966: { title: "These Boots Are Made for Walkin'", artist: 'Nancy Sinatra' },
  1967: { title: 'Silence Is Golden',                artist: 'The Tremeloes' },
  1968: { title: 'Sunglasses',                       artist: 'Hilary' },
  1969: { title: 'Suspicious Minds',                 artist: 'Elvis Presley' },
  1970: { title: 'Pretty Belinda',                   artist: 'Chris Andrews' },
  1971: { title: 'Mammy Blue',                       artist: 'Charisma' },
  1972: { title: 'I Can See Clearly Now',            artist: 'Johnny Nash' },
  1973: { title: "I Don't Wanna Play House",         artist: 'Barbara Ray' },
  1974: { title: 'Why Me',                           artist: 'Kris Kristofferson' },
  1975: { title: "You Ain't Seen Nothing Yet",       artist: 'Bachman-Turner Overdrive' },
  1976: { title: 'Lady in Blue',                     artist: 'Joe Dolan' },
  1977: { title: 'Mississippi',                      artist: 'Pussycat' },
  1978: { title: 'Rivers of Babylon',                artist: 'Boney M.' },
  1979: { title: 'Michael Row the Boat Ashore',      artist: 'Richard Jon Smith' },
  1980: { title: 'Paradise Road',                    artist: 'Joy' },
  1981: { title: 'Shaddap You Face',                 artist: 'Joe Dolce' },
  1982: { title: 'Baby Makes Her Blue Jeans Talk',   artist: 'Dr. Hook' },
  1983: { title: 'Words',                            artist: 'F. R. David' },
  1984: { title: 'Red Red Wine',                     artist: 'UB40' },
  1985: { title: 'Loverboy',                         artist: 'Billy Ocean' },
  1986: { title: 'Say You, Say Me',                  artist: 'Lionel Richie' },
  1987: { title: 'The Lady in Red',                  artist: 'Chris de Burgh' },
  1988: { title: 'Never Gonna Give You Up',          artist: 'Rick Astley' },
  1989: { title: 'Prisoner',                         artist: 'Lucky Dube' },
  2004: { title: 'Doo Be Doo',                       artist: 'Freshlyground' },
  2007: { title: "I'd Like",                         artist: 'Freshlyground' },
  2010: { title: 'Waka Waka (This Time for Africa)', artist: 'Shakira ft. Freshlyground' },
  2011: { title: 'Loliwe',                           artist: 'Zahara' },
  2014: { title: 'Doc Shebeleza',                    artist: 'Cassper Nyovest' },
  2020: { title: 'Jerusalema',                       artist: 'Master KG ft. Nomcebo Zikode' },
  2023: { title: 'Mnike',                            artist: 'Tyler ICU & Tumela_za ft. DJ Maphorisa, Nandipha808, Ceeka RSA & Tyron Dee' },
  2024: { title: 'Imithandazo',                      artist: 'Kabza De Small ft. Young Stunna, DJ Maphorisa, Sizwe Alakine & Umthakathi Kush' },
  2025: { title: 'Isaka (6am)',                      artist: 'Ciza ft. Jazzworx & Thukuthela' },
}

// Brazil — most-played song of the year (maistocadas.mus.br; Crowley airplay from 2000)
const brSongsByYear: Record<number, SongEntry> = {
  1950: { title: 'Pé De Manacá',                        artist: 'Isaura Garcia & Hervê Cordovil' },
  1951: { title: 'Vingança',                            artist: 'Linda Batista' },
  1952: { title: 'Lata D’água',                         artist: 'Marlene' },
  1953: { title: 'Risque',                              artist: 'Linda Batista' },
  1954: { title: 'Tereza Da Praia',                     artist: 'Dick Farney E Lúcio Alves' },
  1955: { title: 'Cafe Society',                        artist: 'Jorge Veiga' },
  1956: { title: 'Conceição',                           artist: 'Cauby Peixoto' },
  1957: { title: 'Mocinho Bonito',                      artist: 'Dóris Monteiro' },
  1958: { title: 'Litlle Darlin',                       artist: 'Lana Bittencourt' },
  1959: { title: 'Estupido Cupido',                     artist: 'Celly Campello' },
  1960: { title: 'Theme From A Summer Place',           artist: 'Percy Faith' },
  1961: { title: 'Palhaçada',                           artist: 'Dóris Monteiro' },
  1962: { title: 'O Trovador De Toledo',                artist: 'Gilda Lopes' },
  1963: { title: 'Mais Que Nada',                       artist: 'Jorge Ben' },
  1964: { title: 'Datemi un martello',                  artist: 'Rita Pavone' },
  1965: { title: 'Trem das onze',                       artist: 'Demônios da Garoa' },
  1966: { title: 'Quero Que Vá Tudo Pro Inferno',       artist: 'Roberto Carlos' },
  1967: { title: 'Gina',                                artist: 'Wayne Fontana' },
  1968: { title: 'Hey Jude',                            artist: 'The Beatles' },
  1969: { title: 'As Curvas da Estrada de Santos',      artist: 'Roberto Carlos' },
  1970: { title: 'Foi um Rio que passou em Minha Vida', artist: 'Paulinho da Viola' },
  1971: { title: 'Detalhes',                            artist: 'Roberto Carlos' },
  1972: { title: 'Alone Again',                         artist: 'Gilbert O’Sullivan' },
  1973: { title: 'O vira',                              artist: 'Secos e Molhados' },
  1974: { title: 'Feelings',                            artist: 'Morris Albert' },
  1975: { title: 'Moça',                                artist: 'Wando' },
  1976: { title: 'Juventude Transviada',                artist: 'Luiz Melodia' },
  1977: { title: 'Amigo',                               artist: 'Roberto Carlos' },
  1978: { title: 'Night Fever',                         artist: 'Bee Gees' },
  1979: { title: 'O Bêbado e a Equilibrista',           artist: 'Elis Regina' },
  1980: { title: 'Balancê',                             artist: 'Gal Costa' },
  1981: { title: 'Bette Davis Eyes',                    artist: 'Kim Carnes' },
  1982: { title: 'Muito estranho',                      artist: 'Dalto' },
  1983: { title: 'Menina veneno',                       artist: 'Ritchie' },
  1984: { title: 'Sonifera Ilha',                       artist: 'Titãs' },
  1985: { title: 'We Are The World',                    artist: 'USA For Africa' },
  1986: { title: 'Greatest Love Of All',                artist: 'Whitney Houston' },
  1987: { title: 'Livin’ on a Prayer',                  artist: 'Bon Jovi' },
  1988: { title: 'Faz Parte do Meu Show',               artist: 'Cazuza' },
  1989: { title: 'Bem Que Se Quis',                     artist: 'Marisa Monte' },
  1990: { title: 'Vision Of Love',                      artist: 'Mariah Carey' },
  1991: { title: '(Everything I Do) I Do It For You',   artist: 'Bryan Adams' },
  1992: { title: 'The one',                             artist: 'Elton John' },
  1993: { title: 'I Will Always Love You',              artist: 'Whitney Houston' },
  1994: { title: 'Breathe Again',                       artist: 'Toni Braxton' },
  1995: { title: 'Take A Bow',                          artist: 'Madonna' },
  1996: { title: 'Garota Nacional',                     artist: 'Skank' },
  1997: { title: 'UnBreak My Heart',                    artist: 'Toni Braxton' },
  1998: { title: 'Immortality',                         artist: 'Céline Dion ft. Bee Gees' },
  1999: { title: 'Sozinho',                             artist: 'Caetano Veloso' },
  2000: { title: 'Se eu não te amasse tanto assim',     artist: 'Ivete Sangalo' },
  2001: { title: 'Quem De Nós Dois',                    artist: 'Ana Carolina' },
  2002: { title: 'Toque de Mágica',                     artist: 'Pedro & Thiago' },
  2003: { title: 'Velha Infância',                      artist: 'Tribalistas' },
  2004: { title: 'Nosso Amor É Ouro',                   artist: 'Zezé Di Camargo & Luciano' },
  2005: { title: 'Fui Eu',                              artist: 'Zezé Di Camargo & Luciano' },
  2006: { title: 'Because Of You',                      artist: 'Kelly Clarkson' },
  2007: { title: 'Big girls don’t cry',                 artist: 'Fergie' },
  2008: { title: 'Boa Sorte / Good Luck',               artist: 'Vanessa Da Mata' },
  2009: { title: 'Halo',                                artist: 'Beyoncé' },
  2010: { title: 'I Want Know What Love Is',            artist: 'Mariah Carey' },
  2011: { title: 'Pra você',                            artist: 'Paula Fernandes' },
  2012: { title: 'Humilde Residência',                  artist: 'Michel Teló' },
  2013: { title: 'Vidro Fumê',                          artist: 'Bruno & Marrone' },
  2014: { title: 'Domingo de manhã',                    artist: 'Marcos & Belutti' },
  2015: { title: 'Escreve aí',                          artist: 'Luan Santana' },
  2016: { title: 'Seu Polícia',                         artist: 'Zé Neto e Cristiano' },
  2017: { title: 'Acordando o Prédio',                  artist: 'Luan Santana' },
  2018: { title: 'Apelido Carinhoso',                   artist: 'Gusttavo Lima' },
  2019: { title: 'Cem Mil',                             artist: 'Gusttavo Lima' },
  2020: { title: 'Com ou sem mim',                      artist: 'Gustavo Mioto' },
  2021: { title: 'Facas',                               artist: 'Diego e Victor Hugo ft Bruno e Marrone' },
  2022: { title: 'Termina comigo antes',                artist: 'Gusttavo Lima' },
  2023: { title: 'Desejo mortal',                       artist: 'Gusttavo Lima' },
  2024: { title: 'Escrito nas Estrelas',                artist: 'Lauana Prado' },
}

// India — Binaca Geetmala annual No.1 (1953–2000), defining Bollywood hit
// (2001–21), Spotify Wrapped most-streamed (2022+)
const inSongsByYear: Record<number, SongEntry> = {
  1953: { title: 'Ye Zindagi Usi Ki Hai',                           artist: 'Lata Mangeshkar' },
  1954: { title: 'Jayen To Jayen Kahan',                            artist: 'Talat Mahmood' },
  1955: { title: 'Mera Joota Hai Japani',                           artist: 'Mukesh' },
  1956: { title: 'Ae Dil Hai Mushkil Jeena Yahan',                  artist: 'Mohammed Rafi & Geeta Dutt' },
  1957: { title: 'Zara Saamne To Aao Chhaliye',                     artist: 'Lata Mangeshkar & Mohammed Rafi' },
  1958: { title: 'Hai Apna Dil To Awara',                           artist: 'Hemant Kumar' },
  1959: { title: 'Haal Kaisa Hai Janab Ka',                         artist: 'Kishore Kumar & Asha Bhosle' },
  1960: { title: 'Zindagi Bhar Nahin Bhoolegi Woh Barsaat Ki Raat', artist: 'Mohammed Rafi' },
  1961: { title: 'Teri Pyari Pyari Surat Ko',                       artist: 'Mohammed Rafi' },
  1962: { title: 'Ehsaan Tera Hoga Mujh Par',                       artist: 'Mohammed Rafi' },
  1963: { title: 'Jo Wada Kiya Woh Nibhana Padega',                 artist: 'Lata Mangeshkar & Mohammed Rafi' },
  1964: { title: 'Mere Man Ki Ganga Aur Tere Man Ki Jamuna',        artist: 'Mukesh & Vyjayanthimala' },
  1965: { title: 'Jis Dil Mein Basa Tha Pyar Tera',                 artist: 'Mukesh' },
  1966: { title: 'Baharon Phool Barsao',                            artist: 'Mohammed Rafi' },
  1967: { title: 'Sawan Ka Mahina Pawan Kare Sor',                  artist: 'Lata Mangeshkar & Mukesh' },
  1968: { title: 'Dil Vil Pyar Vyar Main Kya Jaanu Re',             artist: 'Lata Mangeshkar' },
  1969: { title: 'Kaise Rahoon Chup',                               artist: 'Lata Mangeshkar' },
  1970: { title: 'Bindiya Chamkegi',                                artist: 'Lata Mangeshkar' },
  1971: { title: 'Zindagi Ek Safar Hai Suhana',                     artist: 'Kishore Kumar' },
  1972: { title: 'Dum Maro Dum',                                    artist: 'Asha Bhosle & Usha Iyer' },
  1973: { title: 'Yaari Hai Imaan Mera',                            artist: 'Manna Dey' },
  1974: { title: 'Mera Jeevan Kora Kagaz',                          artist: 'Kishore Kumar' },
  1975: { title: 'Baaki Kuchh Bacha To Mehangai Maar Gayi',         artist: 'Lata Mangeshkar, Mukesh, Jani Babu Qawwal & Narendra Chanchal' },
  1976: { title: 'Kabhi Kabhie Mere Dil Mein',                      artist: 'Lata Mangeshkar & Mukesh' },
  1977: { title: 'Husn Haazir Hai',                                 artist: 'Lata Mangeshkar' },
  1978: { title: 'Ankhiyon Ke Jharokhon Se',                        artist: 'Hemlata' },
  1979: { title: 'O Saathi Re',                                     artist: 'Kishore Kumar' },
  1980: { title: 'Dafliwale Dafli Baja',                            artist: 'Lata Mangeshkar & Mohammed Rafi' },
  1981: { title: 'Mere Angne Mein',                                 artist: 'Amitabh Bachchan & Alka Yagnik' },
  1982: { title: 'Angrezi Mein Kehte Hain',                         artist: 'Lata Mangeshkar & Kishore Kumar' },
  1983: { title: 'Shayad Meri Shaadi Ka Khayal',                    artist: 'Lata Mangeshkar & Kishore Kumar' },
  1984: { title: 'Tu Mera Hero Hai',                                artist: 'Anuradha Paudwal & Manhar Udhas' },
  1985: { title: 'Sun Sahiba Sun',                                  artist: 'Lata Mangeshkar' },
  1986: { title: 'Yashoda Ka Nandlala',                             artist: 'Lata Mangeshkar' },
  1987: { title: 'Chitthi Aayi Hai',                                artist: 'Pankaj Udhas' },
  1988: { title: 'Papa Kehte Hain',                                 artist: 'Udit Narayan' },
  1989: { title: 'My Name Is Lakhan',                               artist: 'Mohammed Aziz, Anuradha Paudwal & Nitin Mukesh' },
  1990: { title: 'Gori Hai Kalaiyan',                               artist: 'Lata Mangeshkar & Shabbir Kumar' },
  1991: { title: 'Dekha Hai Pehli Baar',                            artist: 'Alka Yagnik & S. P. Balasubrahmanyam' },
  1992: { title: 'Maine Pyar Tumhi Se Kiya Hai',                    artist: 'Kumar Sanu & Anuradha Paudwal' },
  1993: { title: 'Choli Ke Peeche',                                 artist: 'Alka Yagnik & Ila Arun' },
  1994: { title: 'Didi Tera Devar Deewana',                         artist: 'Lata Mangeshkar & S. P. Balasubrahmanyam' },
  1995: { title: 'Tujhe Dekha To',                                  artist: 'Lata Mangeshkar & Kumar Sanu' },
  1996: { title: 'Pardesi Pardesi Jana Nahin',                      artist: 'Alka Yagnik & Udit Narayan' },
  1997: { title: 'Sandese Aate Hai',                                artist: 'Sonu Nigam & Roop Kumar Rathod' },
  1998: { title: 'Chaiyya Chaiyya',                                 artist: 'Sukhwinder Singh & Sapna Awasthi' },
  1999: { title: 'Taal Se Taal Mila',                               artist: 'Udit Narayan & Alka Yagnik' },
  2000: { title: 'Humko Humise Chura Lo',                           artist: 'Lata Mangeshkar & Udit Narayan' },
  2001: { title: 'Kabhi Khushi Kabhie Gham',                        artist: 'Lata Mangeshkar' },
  2003: { title: 'Kal Ho Naa Ho',                                   artist: 'Sonu Nigam' },
  2005: { title: 'Kajra Re',                                        artist: 'Shankar Mahadevan, Javed Ali & Alka Yagnik' },
  2007: { title: 'Chak De! India',                                  artist: 'Sukhwinder Singh' },
  2008: { title: 'Jai Ho',                                          artist: 'A.R. Rahman' },
  2010: { title: 'Sheila Ki Jawani',                                artist: 'Sunidhi Chauhan & Vishal Dadlani' },
  2011: { title: 'Kolaveri Di',                                     artist: 'Dhanush' },
  2012: { title: 'Chikni Chameli',                                  artist: 'Shreya Ghoshal' },
  2013: { title: 'Lungi Dance',                                     artist: 'Yo Yo Honey Singh' },
  2015: { title: 'Gerua',                                           artist: 'Arijit Singh & Antara Mitra' },
  2016: { title: 'Ae Dil Hai Mushkil',                              artist: 'Arijit Singh' },
  2017: { title: 'Badri Ki Dulhania',                               artist: 'Neha Kakkar & Dev Negi' },
  2018: { title: 'Dilbar',                                          artist: 'Neha Kakkar' },
  2019: { title: 'Kalank',                                          artist: 'Arijit Singh' },
  2021: { title: 'Raataan Lambiyan',                                artist: 'Jubin Nautiyal & Asees Kaur' },
  2022: { title: 'Kesariya',                                        artist: 'Arijit Singh' },
  2023: { title: 'Jhoome Jo Pathaan',                               artist: 'Arijit Singh & Sukriti Kakar' },
  2024: { title: 'Pehle Bhi Main',                                  artist: 'Vishal Mishra & Raj Shekhar' },
  2025: { title: 'Raanjhan',                                        artist: 'Parampara Tandon' },
}

// Canada — RPM year-end No.1 (1967–99), Canadian Hot 100 year-end (2008+).
// No national year-end chart 2000–07.
const caSongsByYear: Record<number, SongEntry> = {
  1967: { title: 'The Letter',                                 artist: 'The Box Tops' },
  1968: { title: 'Hey Jude',                                   artist: 'The Beatles' },
  1969: { title: 'Get Back',                                   artist: 'The Beatles' },
  1970: { title: 'Bridge over Troubled Water',                 artist: 'Simon & Garfunkel' },
  1971: { title: 'Joy to the World',                           artist: 'Three Dog Night' },
  1972: { title: 'American Pie',                               artist: 'Don McLean' },
  1973: { title: 'Tie a Yellow Ribbon Round the Ole Oak Tree', artist: 'Dawn' },
  1974: { title: 'Seasons in the Sun',                         artist: 'Terry Jacks' },
  1975: { title: 'Love Will Keep Us Together',                 artist: 'Captain & Tennille' },
  1976: { title: "Tonight's the Night (Gonna Be Alright)",     artist: 'Rod Stewart' },
  1977: { title: 'You Light Up My Life',                       artist: 'Debby Boone' },
  1978: { title: 'Night Fever',                                artist: 'Bee Gees' },
  1979: { title: 'The Logical Song',                           artist: 'Supertramp' },
  1980: { title: 'Another Brick in the Wall (Part II)',        artist: 'Pink Floyd' },
  1981: { title: 'Stars on 45 Medley',                         artist: 'Stars on 45' },
  1982: { title: "I Love Rock 'n' Roll",                       artist: 'Joan Jett & the Blackhearts' },
  1983: { title: 'Every Breath You Take',                      artist: 'The Police' },
  1984: { title: 'I Just Called to Say I Love You',            artist: 'Stevie Wonder' },
  1985: { title: 'Never Surrender',                            artist: 'Corey Hart' },
  1986: { title: 'The Power of Love',                          artist: 'Jennifer Rush' },
  1987: { title: 'La Bamba',                                   artist: 'Los Lobos' },
  1988: { title: 'Get Outta My Dreams, Get Into My Car',       artist: 'Billy Ocean' },
  1989: { title: 'Like a Prayer',                              artist: 'Madonna' },
  1990: { title: 'I Wish It Would Rain Down',                  artist: 'Phil Collins' },
  1991: { title: '(Everything I Do) I Do It for You',          artist: 'Bryan Adams' },
  1992: { title: "Sometimes Love Just Ain't Enough",           artist: 'Patty Smyth with Don Henley' },
  1993: { title: 'I Will Always Love You',                     artist: 'Whitney Houston' },
  1994: { title: 'All for Love',                               artist: 'Bryan Adams, Rod Stewart and Sting' },
  1995: { title: "I'll Be There for You",                      artist: 'The Rembrandts' },
  1996: { title: 'You Learn',                                  artist: 'Alanis Morissette' },
  1997: { title: 'Building a Mystery',                         artist: 'Sarah McLachlan' },
  1998: { title: 'Torn',                                       artist: 'Natalie Imbruglia' },
  1999: { title: "Livin' la Vida Loca",                        artist: 'Ricky Martin' },
  2008: { title: 'Apologize',                                  artist: 'Timbaland featuring OneRepublic' },
  2009: { title: 'I Gotta Feeling',                            artist: 'The Black Eyed Peas' },
  2010: { title: 'California Gurls',                           artist: 'Katy Perry featuring Snoop Dogg' },
  2011: { title: 'Rolling in the Deep',                        artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',               artist: 'Gotye featuring Kimbra' },
  2013: { title: 'Blurred Lines',                              artist: 'Robin Thicke featuring T.I. and Pharrell' },
  2014: { title: 'Happy',                                      artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                                artist: 'Mark Ronson featuring Bruno Mars' },
  2016: { title: 'Sorry',                                      artist: 'Justin Bieber' },
  2017: { title: 'Shape of You',                               artist: 'Ed Sheeran' },
  2018: { title: 'Havana',                                     artist: 'Camila Cabello featuring Young Thug' },
  2019: { title: 'Old Town Road',                              artist: 'Lil Nas X featuring Billy Ray Cyrus' },
  2020: { title: 'Dance Monkey',                               artist: 'Tones and I' },
  2021: { title: 'Levitating',                                 artist: 'Dua Lipa' },
  2022: { title: 'Cold Heart (Pnau Remix)',                    artist: 'Elton John and Dua Lipa' },
  2023: { title: 'Flowers',                                    artist: 'Miley Cyrus' },
  2024: { title: 'A Bar Song (Tipsy)',                         artist: 'Shaboozey' },
  2025: { title: 'A Bar Song (Tipsy)',                         artist: 'Shaboozey' },
}

// Australia — Kent Music Report year-end No.1 (1955–87, retro-calculated before
// 1974), ARIA year-end (1988+)
const auSongsByYear: Record<number, SongEntry> = {
  1955: { title: 'Hold My Hand',                                         artist: 'Don Cornell' },
  1956: { title: 'Just Walking in the Rain',                             artist: 'Johnnie Ray' },
  1957: { title: 'Around the World',                                     artist: 'Bing Crosby' },
  1958: { title: 'Tom Dooley',                                           artist: 'The Kingston Trio' },
  1959: { title: 'Smoke Gets in Your Eyes',                              artist: 'The Platters' },
  1960: { title: "It's Now or Never",                                    artist: 'Elvis Presley' },
  1961: { title: "I'm Gonna Knock on Your Door",                         artist: 'Eddie Hodges' },
  1962: { title: 'Working for the Man',                                  artist: 'Roy Orbison' },
  1963: { title: 'I Want to Hold Your Hand',                             artist: 'The Beatles' },
  1964: { title: 'I Saw Her Standing There',                             artist: 'The Beatles' },
  1965: { title: "Que Sera, Sera / Shakin' All Over",                    artist: 'Normie Rowe' },
  1966: { title: "These Boots Are Made for Walkin'",                     artist: 'Nancy Sinatra' },
  1967: { title: 'The Last Waltz',                                       artist: 'Engelbert Humperdinck' },
  1968: { title: 'Hey Jude',                                             artist: 'The Beatles' },
  1969: { title: 'Something / Come Together',                            artist: 'The Beatles' },
  1970: { title: 'Let It Be',                                            artist: 'The Beatles' },
  1971: { title: 'Eagle Rock',                                           artist: 'Daddy Cool' },
  1972: { title: 'Puppy Love',                                           artist: 'Donny Osmond' },
  1973: { title: 'Tie a Yellow Ribbon Round the Ole Oak Tree',           artist: 'Tony Orlando and Dawn' },
  1974: { title: 'My Coo Ca Choo',                                       artist: 'Alvin Stardust' },
  1975: { title: 'Fox on the Run',                                       artist: 'Sweet' },
  1976: { title: 'Fernando',                                             artist: 'ABBA' },
  1977: { title: "Don't Cry for Me Argentina",                           artist: 'Julie Covington' },
  1978: { title: "You're the One That I Want",                           artist: 'John Travolta and Olivia Newton-John' },
  1979: { title: 'Lay Your Love on Me',                                  artist: 'Racey' },
  1980: { title: 'I Got You',                                            artist: 'Split Enz' },
  1981: { title: 'Counting the Beat',                                    artist: 'The Swingers' },
  1982: { title: 'Eye of the Tiger',                                     artist: 'Survivor' },
  1983: { title: 'Australiana',                                          artist: 'Austen Tayshus' },
  1984: { title: 'Dancing in the Dark',                                  artist: 'Bruce Springsteen' },
  1985: { title: 'We Are the World',                                     artist: 'USA for Africa' },
  1986: { title: 'Chain Reaction',                                       artist: 'Diana Ross' },
  1987: { title: 'Locomotion',                                           artist: 'Kylie Minogue' },
  1988: { title: "(I've Had) The Time of My Life",                       artist: 'Bill Medley and Jennifer Warnes' },
  1989: { title: 'Like a Prayer',                                        artist: 'Madonna' },
  1990: { title: 'Nothing Compares 2 U',                                 artist: "Sinéad O'Connor" },
  1991: { title: '(Everything I Do) I Do It for You',                    artist: 'Bryan Adams' },
  1992: { title: 'Achy Breaky Heart',                                    artist: 'Billy Ray Cyrus' },
  1993: { title: "I'd Do Anything for Love (But I Won't Do That)",       artist: 'Meat Loaf' },
  1994: { title: 'Love Is All Around',                                   artist: 'Wet Wet Wet' },
  1995: { title: "Gangsta's Paradise",                                   artist: 'Coolio featuring L.V.' },
  1996: { title: 'Macarena',                                             artist: 'Los del Río' },
  1997: { title: 'Candle in the Wind 1997',                              artist: 'Elton John' },
  1998: { title: 'The Cup of Life / María',                              artist: 'Ricky Martin' },
  1999: { title: 'Mambo No. 5',                                          artist: 'Lou Bega' },
  2000: { title: "I'm Outta Love",                                       artist: 'Anastacia' },
  2001: { title: "Can't Fight the Moonlight",                            artist: 'LeAnn Rimes' },
  2002: { title: 'Without Me',                                           artist: 'Eminem' },
  2003: { title: 'Angels Brought Me Here',                               artist: 'Guy Sebastian' },
  2004: { title: 'What About Me',                                        artist: 'Shannon Noll' },
  2005: { title: 'The Prayer',                                           artist: 'Anthony Callea' },
  2006: { title: 'I Wish I Was a Punk Rocker (With Flowers in My Hair)', artist: 'Sandi Thom' },
  2007: { title: "Big Girls Don't Cry",                                  artist: 'Fergie' },
  2008: { title: 'Low',                                                  artist: 'Flo Rida featuring T-Pain' },
  2009: { title: 'I Gotta Feeling',                                      artist: 'The Black Eyed Peas' },
  2010: { title: 'Love the Way You Lie',                                 artist: 'Eminem featuring Rihanna' },
  2011: { title: 'Party Rock Anthem',                                    artist: 'LMFAO featuring Lauren Bennett and GoonRock' },
  2012: { title: 'Call Me Maybe',                                        artist: 'Carly Rae Jepsen' },
  2013: { title: 'Roar',                                                 artist: 'Katy Perry' },
  2014: { title: 'Happy',                                                artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                                          artist: 'Mark Ronson featuring Bruno Mars' },
  2016: { title: 'Closer',                                               artist: 'The Chainsmokers featuring Halsey' },
  2017: { title: 'Shape of You',                                         artist: 'Ed Sheeran' },
  2018: { title: 'Youngblood',                                           artist: '5 Seconds of Summer' },
  2019: { title: 'Old Town Road',                                        artist: 'Lil Nas X featuring Billy Ray Cyrus' },
  2020: { title: 'Blinding Lights',                                      artist: 'The Weeknd' },
  2021: { title: 'Heat Waves',                                           artist: 'Glass Animals' },
  2022: { title: 'As It Was',                                            artist: 'Harry Styles' },
  2023: { title: 'Flowers',                                              artist: 'Miley Cyrus' },
  2024: { title: 'Beautiful Things',                                     artist: 'Benson Boone' },
  2025: { title: 'Ordinary',                                             artist: 'Alex Warren' },
}

// Germany — official year-end No.1 (Musikmarkt 1959–76, Media Control 1977–2013,
// GfK Entertainment 2014+)
const deSongsByYear: Record<number, SongEntry> = {
  1959: { title: 'Die Gitarre und das Meer',                            artist: 'Freddy Quinn' },
  1960: { title: 'Marina',                                              artist: 'Rocco Granata' },
  1961: { title: 'Babysitter-Boogie',                                   artist: 'Ralf Bendix & Klein-Elisabeth' },
  1962: { title: 'Mexico',                                              artist: 'Bob Moore und sein Orchester' },
  1963: { title: 'Junge, komm bald wieder',                             artist: 'Freddy Quinn' },
  1964: { title: 'Liebeskummer lohnt sich nicht',                       artist: 'Siw Malmkvist' },
  1965: { title: 'Il Silenzio',                                         artist: 'Nini Rosso' },
  1966: { title: 'Strangers in the Night',                              artist: 'Frank Sinatra' },
  1967: { title: "Schiwago-Melodie (Lara's Theme)",                     artist: 'Maurice Jarre Orchester' },
  1968: { title: 'Mama',                                                artist: 'Heintje' },
  1969: { title: 'Eloise',                                              artist: 'Barry Ryan' },
  1970: { title: 'El Condor Pasa (If I Could)',                         artist: 'Simon & Garfunkel' },
  1971: { title: 'Butterfly',                                           artist: 'Danyel Gérard' },
  1972: { title: 'Komm gib mir deine Hand',                             artist: 'Tony Marshall' },
  1973: { title: 'Goodbye, My Love, Goodbye',                           artist: 'Demis Roussos' },
  1974: { title: 'Sugar Baby Love',                                     artist: 'The Rubettes' },
  1975: { title: 'Paloma Blanca',                                       artist: 'George Baker Selection' },
  1976: { title: 'Die kleine Kneipe',                                   artist: 'Peter Alexander' },
  1977: { title: "Don't Cry for Me Argentina",                          artist: 'Julie Covington' },
  1978: { title: 'Das Lied der Schlümpfe',                              artist: 'Vader Abraham' },
  1979: { title: 'So bist du',                                          artist: 'Peter Maffay' },
  1980: { title: 'Sun of Jamaica',                                      artist: 'Goombay Dance Band' },
  1981: { title: 'Dance Little Bird',                                   artist: "Electronica's" },
  1982: { title: 'Maid of Orleans (The Waltz Joan of Arc)',             artist: 'Orchestral Manoeuvres in the Dark' },
  1983: { title: 'Major Tom (völlig losgelöst)',                        artist: 'Peter Schilling' },
  1984: { title: 'Self Control',                                        artist: 'Laura Branigan' },
  1985: { title: 'Live Is Life',                                        artist: 'Opus' },
  1986: { title: 'Jeanny, Part I',                                      artist: 'Falco' },
  1987: { title: 'Voyage, voyage',                                      artist: 'Desireless' },
  1988: { title: "Girl You Know It's True",                             artist: 'Milli Vanilli' },
  1989: { title: 'Looking for Freedom',                                 artist: 'David Hasselhoff' },
  1990: { title: "Verdammt, ich lieb' Dich",                            artist: 'Matthias Reim' },
  1991: { title: 'Wind of Change',                                      artist: 'Scorpions' },
  1992: { title: 'Rhythm Is a Dancer',                                  artist: 'Snap!' },
  1993: { title: 'All That She Wants',                                  artist: 'Ace of Base' },
  1994: { title: 'Without You',                                         artist: 'Mariah Carey' },
  1995: { title: 'Conquest of Paradise',                                artist: 'Vangelis' },
  1996: { title: 'Killing Me Softly with His Song',                     artist: 'Fugees' },
  1997: { title: 'Time to Say Goodbye (Con te partirò)',                artist: 'Sarah Brightman & Andrea Bocelli' },
  1998: { title: 'My Heart Will Go On',                                 artist: 'Céline Dion' },
  1999: { title: 'Mambo No. 5 (A Little Bit of...)',                    artist: 'Lou Bega' },
  2000: { title: 'Anton aus Tirol',                                     artist: 'Anton feat. DJ Ötzi' },
  2001: { title: 'Daylight in Your Eyes',                               artist: 'No Angels' },
  2002: { title: 'The Ketchup Song (Aserejé)',                          artist: 'Las Ketchup' },
  2003: { title: 'We Have a Dream',                                     artist: 'DSDS-Allstars' },
  2004: { title: 'Dragostea din tei',                                   artist: 'O-Zone' },
  2005: { title: 'Schnappi',                                            artist: 'Schnappi, das kleine Krokodil' },
  2006: { title: 'Love Generation',                                     artist: 'Bob Sinclar feat. Gary Pine' },
  2007: { title: 'Ein Stern (... der deinen Namen trägt)',              artist: 'DJ Ötzi & Nik P.' },
  2008: { title: 'Apologize',                                           artist: 'Timbaland presents OneRepublic' },
  2009: { title: 'Poker Face',                                          artist: 'Lady Gaga' },
  2010: { title: 'Somewhere Over the Rainbow / What a Wonderful World', artist: 'Israel Kamakawiwoʻole' },
  2011: { title: 'On the Floor',                                        artist: 'Jennifer Lopez feat. Pitbull' },
  2012: { title: 'Ai Se Eu Te Pego!',                                   artist: 'Michel Teló' },
  2013: { title: 'Wake Me Up',                                          artist: 'Avicii feat. Aloe Blacc' },
  2014: { title: 'Atemlos durch die Nacht',                             artist: 'Helene Fischer' },
  2015: { title: 'Cheerleader (Felix Jaehn Remix)',                     artist: 'Omi' },
  2016: { title: 'Faded',                                               artist: 'Alan Walker' },
  2017: { title: 'Shape of You',                                        artist: 'Ed Sheeran' },
  2018: { title: 'In My Mind',                                          artist: "Dynoro & Gigi D'Agostino" },
  2019: { title: 'Old Town Road',                                       artist: 'Lil Nas X' },
  2020: { title: 'Blinding Lights',                                     artist: 'The Weeknd' },
  2021: { title: 'Wellerman',                                           artist: 'Nathan Evans' },
  2022: { title: 'Layla',                                               artist: 'DJ Robin & Schürze' },
  2023: { title: 'Komet',                                               artist: 'Udo Lindenberg & Apache 207' },
  2024: { title: 'I Like the Way You Kiss Me',                          artist: 'Artemas' },
  2025: { title: 'Wackelkontakt',                                       artist: 'Oimara' },
}

// France — SNEP year-end No.1 (1994+; no verifiable official year-end before)
const frSongsByYear: Record<number, SongEntry> = {
  1994: { title: '7 Seconds',                                          artist: "Youssou N'Dour & Neneh Cherry" },
  1995: { title: "Pour que tu m'aimes encore",                         artist: 'Céline Dion' },
  1996: { title: 'Macarena (Bayside Boys Remix)',                      artist: 'Los del Río' },
  1997: { title: 'Candle in the Wind 1997',                            artist: 'Elton John' },
  1998: { title: 'Belle',                                              artist: 'Daniel Lavoie, Patrick Fiori & Garou' },
  1999: { title: 'Mambo No. 5 (A Little Bit of...)',                   artist: 'Lou Bega' },
  2000: { title: 'Ces soirées-là',                                     artist: 'Yannick' },
  2001: { title: 'La Musique',                                         artist: 'Star Academy 1' },
  2002: { title: 'The Ketchup Song (Aserejé)',                         artist: 'Las Ketchup' },
  2003: { title: 'Chihuahua',                                          artist: 'DJ BoBo' },
  2004: { title: 'Dragostea din tei',                                  artist: 'O-Zone' },
  2005: { title: 'Un monde parfait',                                   artist: 'Ilona Mitrecey' },
  2006: { title: 'Pas le temps',                                       artist: 'Faf Larage' },
  2007: { title: 'Double je',                                          artist: 'Christophe Willem' },
  2008: { title: "Tired of Being Sorry (Laisse le destin l'emporter)", artist: 'Enrique Iglesias featuring Nâdiya' },
  2009: { title: "Ça m'énerve",                                        artist: 'Helmut Fritz' },
  2010: { title: 'Waka Waka (This Time for Africa)',                   artist: 'Shakira featuring Freshlyground' },
  2011: { title: 'Party Rock Anthem',                                  artist: 'LMFAO featuring Lauren Bennett & GoonRock' },
  2012: { title: 'Ai se eu te pego',                                   artist: 'Michel Teló' },
  2013: { title: 'Get Lucky',                                          artist: 'Daft Punk featuring Pharrell Williams & Nile Rodgers' },
  2014: { title: 'Happy',                                              artist: 'Pharrell Williams' },
  2015: { title: 'Lean On',                                            artist: 'Major Lazer & DJ Snake featuring MØ' },
  2016: { title: 'Cheap Thrills',                                      artist: 'Sia featuring Sean Paul' },
  2017: { title: 'Shape of You',                                       artist: 'Ed Sheeran' },
  2018: { title: 'Mafiosa',                                            artist: 'Lartiste featuring Caroliina' },
  2019: { title: 'Old Town Road',                                      artist: 'Lil Nas X' },
  2020: { title: 'Bande organisée',                                    artist: 'Jul, SCH, Kofs, Naps, Soso Maness, Elams, Solda & Houari' },
  2021: { title: 'La Kiffance',                                        artist: 'Naps' },
  2022: { title: 'Tout va bien',                                       artist: 'Alonzo featuring Ninho & Naps' },
  2023: { title: 'Flowers',                                            artist: 'Miley Cyrus' },
  2024: { title: 'Spider',                                             artist: 'Gims & Dystinct' },
  2025: { title: 'Ciel',                                               artist: 'Gims' },
}

// Japan — Oricon yearly No.1 (1968+; combined ranking from 2019)
const jpSongsByYear: Record<number, SongEntry> = {
  1968: { title: 'Hoshikage no Waltz',                    artist: 'Masao Sen' },
  1969: { title: 'Yoake no Scat',                         artist: 'Saori Yuki' },
  1970: { title: 'Kuroneko no Tango',                     artist: 'Osamu Minagawa' },
  1971: { title: 'Watashi no Jōkamachi',                  artist: 'Rumiko Koyanagi' },
  1972: { title: 'Onna no Michi',                         artist: 'Shiro Miya & Pinkara Trio' },
  1973: { title: 'Onna no Michi',                         artist: 'Shiro Miya & Pinkara Trio' },
  1974: { title: 'Namida no Misao',                       artist: 'Tonosama Kings' },
  1975: { title: 'Shōwa Karesusuki',                      artist: 'Sakura and Ichirō' },
  1976: { title: 'Oyoge! Taiyaki-kun',                    artist: 'Masato Shimon' },
  1977: { title: 'Nagisa no Sindbad',                     artist: 'Pink Lady' },
  1978: { title: 'UFO',                                   artist: 'Pink Lady' },
  1979: { title: 'Yume Oi Zake',                          artist: 'Jirō Atsumi' },
  1980: { title: 'Dancing All Night',                     artist: 'Monta and Brothers' },
  1981: { title: 'Ruby no Yubiwa',                        artist: 'Akira Terao' },
  1982: { title: 'Matsuwa',                               artist: 'Amin' },
  1983: { title: 'Sazanka no Yado',                       artist: 'Eisaku Ōkawa' },
  1984: { title: 'Moshimo Ashita ga...',                  artist: 'Warabe' },
  1985: { title: 'Julia ni Heartbreak',                   artist: 'The Checkers' },
  1986: { title: 'Cha-Cha-Cha',                           artist: 'Akemi Ishii' },
  1987: { title: 'Inochi Kurenai',                        artist: 'Eiko Segawa' },
  1988: { title: 'Paradise Ginga',                        artist: 'Hikaru Genji' },
  1989: { title: 'Diamonds',                              artist: 'Princess Princess' },
  1990: { title: 'Odoru Pompokolin',                      artist: 'B.B.Queens' },
  1991: { title: 'Oh! Yeah! / Love Story wa Totsuzen ni', artist: 'Kazumasa Oda' },
  1992: { title: 'Kimi ga Iru Dake de',                   artist: 'Kome Kome Club' },
  1993: { title: 'Yah Yah Yah / Yume no Bannin',          artist: 'Chage and Aska' },
  1994: { title: 'Innocent World',                        artist: 'Mr. Children' },
  1995: { title: 'Love Love Love / Arashi ga Kuru',       artist: 'Dreams Come True' },
  1996: { title: 'Namonaki Uta',                          artist: 'Mr. Children' },
  1997: { title: 'Can You Celebrate?',                    artist: 'Namie Amuro' },
  1998: { title: 'Yūwaku',                                artist: 'Glay' },
  1999: { title: 'Dango 3 Kyōdai',                        artist: 'Kentarō Hayami & Ayumi Shigemori' },
  2000: { title: 'Tsunami',                               artist: 'Southern All Stars' },
  2001: { title: 'Can You Keep a Secret?',                artist: 'Hikaru Utada' },
  2002: { title: 'H',                                     artist: 'Ayumi Hamasaki' },
  2003: { title: 'Sekai ni Hitotsu Dake no Hana',         artist: 'SMAP' },
  2004: { title: 'Hitomi o Tojite',                       artist: 'Ken Hirai' },
  2005: { title: 'Seishun Amigo',                         artist: 'Shūji to Akira' },
  2006: { title: 'Real Face',                             artist: 'KAT-TUN' },
  2007: { title: 'Sen no Kaze ni Natte',                  artist: 'Masafumi Akikawa' },
  2008: { title: 'Truth / Kaze no Mukō e',                artist: 'Arashi' },
  2009: { title: 'Believe / Kumori Nochi, Kaisei',        artist: 'Arashi' },
  2010: { title: 'Beginner',                              artist: 'AKB48' },
  2011: { title: 'Flying Get',                            artist: 'AKB48' },
  2012: { title: 'Manatsu no Sounds Good!',               artist: 'AKB48' },
  2013: { title: 'Sayonara Crawl',                        artist: 'AKB48' },
  2014: { title: 'Labrador Retriever',                    artist: 'AKB48' },
  2015: { title: 'Bokutachi wa Tatakawanai',              artist: 'AKB48' },
  2016: { title: 'Tsubasa wa Iranai',                     artist: 'AKB48' },
  2017: { title: 'Negaigoto no Mochigusare',              artist: 'AKB48' },
  2018: { title: 'Teacher Teacher',                       artist: 'AKB48' },
  2019: { title: 'Sustainable',                           artist: 'AKB48' },
  2020: { title: 'Imitation Rain / D.D.',                 artist: 'SixTones vs Snow Man' },
  2021: { title: 'Butter',                                artist: 'BTS' },
  2022: { title: 'Ichizu / Sakayume',                     artist: 'King Gnu' },
  2023: { title: 'Idol',                                  artist: 'Yoasobi' },
  2024: { title: 'Nidone / Bling-Bang-Bang-Born',         artist: 'Creepy Nuts' },
  2025: { title: 'Rose',                                  artist: 'Hana' },
}

// Kenya — no chart or award series; only hits whose year is verified
const keSongsByYear: Record<number, SongEntry> = {
  1960: { title: 'Malaika',             artist: 'Fadhili William' },
  1982: { title: 'Jambo Bwana',         artist: 'Them Mushrooms' },
  2001: { title: 'Nchi ya Kitu Kidogo', artist: 'Eric Wainaina' },
  2002: { title: 'Unbwogable',          artist: 'Gidi Gidi Maji Maji' },
  2014: { title: 'Sura Yako',           artist: 'Sauti Sol' },
  2017: { title: 'Melanin',             artist: 'Sauti Sol ft. Patoranking' },
  2018: { title: 'Short N Sweet',       artist: 'Sauti Sol ft. Nyashinski' },
  2020: { title: 'Suzanna',             artist: 'Sauti Sol' },
}

// Ghana — Ghana Music Awards most popular song (2015+; 2018 award annulled)
const ghSongsByYear: Record<number, SongEntry> = {
  2015: { title: 'Mansa',               artist: 'Bisa Kdei' },
  2016: { title: 'Christy',             artist: 'Dobble' },
  2017: { title: 'Total Cheat',         artist: 'Fancy Gadam ft. Sarkodie' },
  2019: { title: 'Things Fall Apart',   artist: 'Kofi Kinaata' },
  2020: { title: 'Adom',                artist: 'Diana Hamilton' },
  2021: { title: 'Touch It',            artist: 'KiDi' },
  2022: { title: 'Kweku the Traveller', artist: 'Black Sherif' },
  2023: { title: 'Terminator',          artist: 'King Promise' },
  2024: { title: 'Aseda',               artist: 'King Paluta' },
  2025: { title: 'Shoulder',            artist: 'Medikal ft. Shatta Wale & Beeztrap KOTM' },
}

// Which chart each table follows, by era: [from, to, name]. Years outside every
// era (no national chart existed) hold the year's defining hit instead.
const CHART_ERAS: Record<string, [number, number, string][]> = {
  us: [[1950, 1957, 'Billboard best sellers'], [1958, 9999, 'Billboard Hot 100']],
  gb: [[1952, 9999, 'UK Singles Chart']],
  ca: [[1967, 1999, 'RPM'], [2008, 9999, 'Canadian Hot 100']],
  au: [[1955, 1987, 'Kent Music Report'], [1988, 9999, 'ARIA']],
  de: [[1959, 1976, 'Musikmarkt'], [1977, 2013, 'Media Control'], [2014, 9999, 'GfK Entertainment']],
  fr: [[1994, 9999, 'SNEP']],
  jp: [[1968, 9999, 'Oricon']],
  ng: [[2020, 9999, 'TurnTable']],
  za: [[1958, 1988, 'Springbok Radio'], [2023, 9999, 'Spotify South Africa']],
  in: [[1953, 1993, 'Binaca Geetmala'], [2022, 9999, 'Spotify India']],
}

// Where a country has no song for a year, these borrow the US year-end No.1
// (labelled as such). Elsewhere a US hit says little about the day, so we show none.
const US_FALLBACK = new Set(['gb', 'ca', 'au', 'de', 'fr', 'jp'])

function chartFor(country: string, year: number) {
  return CHART_ERAS[country]?.find(([from, to]) => year >= from && year <= to)?.[2] ?? null
}

const CHART_DATA: Record<string, Record<number, SongEntry>> = {
  us:    usSongsByYear,
  world: usSongsByYear,
  gb:    gbSongsByYear,
  ng:    ngSongsByYear,
  za:    zaSongsByYear,
  br:    brSongsByYear,
  in:    inSongsByYear,
  ca:    caSongsByYear,
  au:    auSongsByYear,
  de:    deSongsByYear,
  fr:    frSongsByYear,
  jp:    jpSongsByYear,
  ke:    keSongsByYear,
  gh:    ghSongsByYear,
}

// ─── Live chart helpers ───────────────────────────────────────────────────────

const LASTFM_COUNTRY_NAMES: Record<string, string> = {
  us: 'united states',
  gb: 'united kingdom',
  ca: 'canada',
  au: 'australia',
  de: 'germany',
  fr: 'france',
  in: 'india',
  jp: 'japan',
  ng: 'nigeria',
  gh: 'ghana',
  ke: 'kenya',
  za: 'south africa',
  br: 'brazil',
}

function isWithinLastDays(dateStr: string, days: number): boolean {
  const d = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= days
}

async function fetchDeezerGlobalTop(): Promise<{ title: string; artist: string } | null> {
  try {
    const res = await fetch('https://api.deezer.com/chart/0/tracks?limit=1', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const json = await res.json()
    const track = json.data?.[0]
    if (!track) return null
    return { title: track.title, artist: track.artist.name }
  } catch {
    return null
  }
}

async function fetchLastFmTop(country: string): Promise<{ title: string; artist: string } | null> {
  const apiKey = process.env.LASTFM_API_KEY
  if (!apiKey) return null
  try {
    const countryName = LASTFM_COUNTRY_NAMES[country]
    const url = countryName
      ? `https://ws.audioscrobbler.com/2.0/?method=geo.getTopTracks&country=${encodeURIComponent(countryName)}&api_key=${apiKey}&format=json&limit=1`
      : `https://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=${apiKey}&format=json&limit=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const json = await res.json()
    const track = json.tracks?.track?.[0]
    if (!track?.name) return null
    return { title: track.name, artist: track.artist.name }
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/** The entry for a year, or the year before / after; never further than that */
function closestYear(map: Record<number, SongEntry>, year: number): { entry: SongEntry; year: number } | null {
  for (const y of [year, year - 1, year + 1]) if (map[y]) return { entry: map[y], year: y }
  return null
}

const MIX_KEYWORDS = ['mix', 'dj ', 'playlist', 'compilation', 'various', 'karaoke', 'tribute', 'cover version']

type ItunesResult = { artworkUrl100?: string; previewUrl?: string; collectionName?: string; artistName?: string }
type TrackMedia = { albumArt?: string; previewUrl?: string }

function pickBestItunesResult(results: ItunesResult[], preferredArtist: string): TrackMedia | undefined {
  if (!results.length) return undefined
  const preferred = preferredArtist.toLowerCase()

  // Prefer: artist matches AND not a compilation/mix
  const best =
    results.find((r) => {
      const col = (r.collectionName ?? '').toLowerCase()
      const art = (r.artistName ?? '').toLowerCase()
      return art.includes(preferred.split(' ')[0]) && !MIX_KEYWORDS.some((k) => col.includes(k))
    }) ??
    // Fallback: any result that isn't a compilation/mix
    results.find((r) => {
      const col = (r.collectionName ?? '').toLowerCase()
      return !MIX_KEYWORDS.some((k) => col.includes(k))
    }) ??
    results[0]

  if (!best?.artworkUrl100) return undefined
  return { albumArt: best.artworkUrl100.replace('100x100bb', '600x600bb'), previewUrl: best.previewUrl }
}

async function fetchTrackMedia(title: string, artist: string): Promise<TrackMedia> {
  // Strategy 1: iTunes full query — prefer original release over DJ mixes/compilations
  try {
    const q = encodeURIComponent(`${title} ${artist}`)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&entity=song&limit=10`,
      { next: { revalidate: 86400 } },
    )
    if (res.ok) {
      const data = await res.json()
      const media = pickBestItunesResult(data.results ?? [], artist)
      if (media) return media
    }
  } catch {}

  // Strategy 2: iTunes title-only (helps non-Latin / regional songs)
  try {
    const q = encodeURIComponent(title)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&entity=song&limit=10`,
      { next: { revalidate: 86400 } },
    )
    if (res.ok) {
      const data = await res.json()
      const media = pickBestItunesResult(data.results ?? [], artist)
      if (media) return media
    }
  } catch {}

  // Strategy 3: Last.fm track.getInfo (uses existing API key)
  const apiKey = process.env.LASTFM_API_KEY
  if (apiKey) {
    try {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(title)}&format=json&autocorrect=1`,
        { next: { revalidate: 86400 } },
      )
      if (res.ok) {
        const data = await res.json()
        const images: Array<{ size: string; '#text': string }> = data.track?.album?.image ?? []
        const img = images.find(i => i.size === 'extralarge') ?? images.find(i => i.size === 'large')
        const url = img?.['#text']
        // Last.fm returns a transparent placeholder for missing art — skip it
        if (url && !url.includes('2a96cbd8b46e442fc41c2b86b821562f')) return { albumArt: url }
      }
    } catch {}
  }

  return {}
}

export async function getSongForYear(year: number, country = 'world', date?: string): Promise<Song | null> {
  if (year < 1950) return null

  // Live charts only know this week, so only use them for the last few days
  if (date && isWithinLastDays(date, 7)) {
    let liveEntry: { title: string; artist: string } | null = null
    let liveChart: string

    if (country === 'world') {
      liveEntry = await fetchDeezerGlobalTop()
      liveChart = 'Deezer Global Charts'
    } else {
      liveEntry = await fetchLastFmTop(country)
      if (liveEntry) {
        liveChart = 'Last.fm Top Tracks'
      } else {
        liveEntry = await fetchDeezerGlobalTop()
        liveChart = 'Deezer Global Charts'
      }
    }

    if (liveEntry) {
      const media = await fetchTrackMedia(liveEntry.title, liveEntry.artist)
      return { title: liveEntry.title, artist: liveEntry.artist, chart: liveChart, year, basis: 'week', ...media }
    }
  }

  // Curated year table; where a country has nothing near this year, the US
  // Billboard year-end stands in and says so
  const key = country !== 'world' && CHART_DATA[country] ? country : 'us'
  let found = closestYear(CHART_DATA[key], year)
  let source = key
  if (!found && US_FALLBACK.has(key)) {
    found = closestYear(CHART_DATA.us, year)
    source = 'us'
  }
  if (!found) return null
  const { entry } = found
  const chartName = chartFor(source, found.year)
  const chart = chartName ? (source !== key ? `US ${chartName}` : chartName) : 'Song of the year'

  const media = await fetchTrackMedia(entry.title, entry.artist)
  return { title: entry.title, artist: entry.artist, chart, year: found.year, basis: chartName ? 'chart' : 'hit', ...media }
}

/** The curated No.1 for a year, without any network lookups (for quick summaries) */
export function getChartEntry(year: number, country = 'world'): { title: string; artist: string } | null {
  const key = country !== 'world' && CHART_DATA[country] ? country : 'us'
  const found = closestYear(CHART_DATA[key], year) ?? (US_FALLBACK.has(key) ? closestYear(CHART_DATA.us, year) : null)
  return found ? { title: found.entry.title, artist: found.entry.artist } : null
}
