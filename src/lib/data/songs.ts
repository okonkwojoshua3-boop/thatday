import type { Song } from '@/types'

interface SongEntry {
  title: string
  artist: string
}

// US Billboard Hot 100 — best-selling single of the year
const usSongsByYear: Record<number, SongEntry> = {
  1958: { title: 'At the Hop', artist: 'Danny & the Juniors' },
  1959: { title: 'Mack the Knife', artist: 'Bobby Darin' },
  1960: { title: 'Theme from A Summer Place', artist: 'Percy Faith' },
  1961: { title: "Tossin' and Turnin'", artist: 'Bobby Lewis' },
  1962: { title: 'Stranger on the Shore', artist: 'Mr. Acker Bilk' },
  1963: { title: 'Sugar Shack', artist: 'Jimmy Gilmer & the Fireballs' },
  1964: { title: 'I Want to Hold Your Hand', artist: 'The Beatles' },
  1965: { title: 'Wooly Bully', artist: 'Sam the Sham & the Pharaohs' },
  1966: { title: 'The Ballad of the Green Berets', artist: 'Staff Sgt. Barry Sadler' },
  1967: { title: 'To Sir with Love', artist: 'Lulu' },
  1968: { title: 'Hey Jude', artist: 'The Beatles' },
  1969: { title: 'Sugar Sugar', artist: 'The Archies' },
  1970: { title: 'Bridge over Troubled Water', artist: 'Simon & Garfunkel' },
  1971: { title: 'Joy to the World', artist: 'Three Dog Night' },
  1972: { title: 'The First Time Ever I Saw Your Face', artist: 'Roberta Flack' },
  1973: { title: 'Tie a Yellow Ribbon', artist: 'Tony Orlando & Dawn' },
  1974: { title: 'Seasons in the Sun', artist: 'Terry Jacks' },
  1975: { title: 'Love Will Keep Us Together', artist: 'Captain & Tennille' },
  1976: { title: 'Silly Love Songs', artist: 'Wings' },
  1977: { title: 'You Light Up My Life', artist: 'Debby Boone' },
  1978: { title: 'Shadow Dancing', artist: 'Andy Gibb' },
  1979: { title: 'My Sharona', artist: 'The Knack' },
  1980: { title: 'Call Me', artist: 'Blondie' },
  1981: { title: 'Bette Davis Eyes', artist: 'Kim Carnes' },
  1982: { title: 'Physical', artist: 'Olivia Newton-John' },
  1983: { title: 'Every Breath You Take', artist: 'The Police' },
  1984: { title: 'When Doves Cry', artist: 'Prince' },
  1985: { title: 'Careless Whisper', artist: 'Wham!' },
  1986: { title: "That's What Friends Are For", artist: 'Dionne & Friends' },
  1987: { title: 'Walk Like an Egyptian', artist: 'The Bangles' },
  1988: { title: 'Faith', artist: 'George Michael' },
  1989: { title: 'Look Away', artist: 'Chicago' },
  1990: { title: 'Hold On', artist: 'Wilson Phillips' },
  1991: { title: 'Everything I Do (I Do It for You)', artist: 'Bryan Adams' },
  1992: { title: 'End of the Road', artist: 'Boyz II Men' },
  1993: { title: 'I Will Always Love You', artist: 'Whitney Houston' },
  1994: { title: 'The Sign', artist: 'Ace of Base' },
  1995: { title: "Gangsta's Paradise", artist: 'Coolio' },
  1996: { title: 'Macarena', artist: 'Los Del Rio' },
  1997: { title: 'Candle in the Wind', artist: 'Elton John' },
  1998: { title: 'Too Close', artist: 'Next' },
  1999: { title: 'Believe', artist: 'Cher' },
  2000: { title: 'Breathe', artist: 'Faith Hill' },
  2001: { title: 'Hanging by a Moment', artist: 'Lifehouse' },
  2002: { title: 'How You Remind Me', artist: 'Nickelback' },
  2003: { title: 'In da Club', artist: '50 Cent' },
  2004: { title: 'Yeah!', artist: 'Usher' },
  2005: { title: 'We Belong Together', artist: 'Mariah Carey' },
  2006: { title: 'Bad Day', artist: 'Daniel Powter' },
  2007: { title: 'Irreplaceable', artist: 'Beyoncé' },
  2008: { title: 'Low', artist: 'Flo Rida' },
  2009: { title: 'Boom Boom Pow', artist: 'Black Eyed Peas' },
  2010: { title: 'TiK ToK', artist: 'Ke$ha' },
  2011: { title: 'Rolling in the Deep', artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know', artist: 'Gotye' },
  2013: { title: 'Thrift Shop', artist: 'Macklemore & Ryan Lewis' },
  2014: { title: 'Happy', artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
  2016: { title: 'Love Yourself', artist: 'Justin Bieber' },
  2017: { title: 'Shape of You', artist: 'Ed Sheeran' },
  2018: { title: "God's Plan", artist: 'Drake' },
  2019: { title: 'Old Town Road', artist: 'Lil Nas X' },
  2020: { title: 'Blinding Lights', artist: 'The Weeknd' },
  2021: { title: 'drivers license', artist: 'Olivia Rodrigo' },
  2022: { title: 'As It Was', artist: 'Harry Styles' },
  2023: { title: 'Flowers', artist: 'Miley Cyrus' },
  2024: { title: 'Espresso', artist: 'Sabrina Carpenter' },
  2025: { title: 'Luther', artist: 'Kendrick Lamar & SZA' },
  2026: { title: 'Luther', artist: 'Kendrick Lamar & SZA' },
}

// UK Singles Chart — most weeks at #1 / best-selling single of the year
const gbSongsByYear: Record<number, SongEntry> = {
  1952: { title: 'Here in My Heart', artist: 'Al Martino' },
  1953: { title: 'She Wears Red Feathers', artist: 'Guy Mitchell' },
  1954: { title: 'Secret Love', artist: 'Doris Day' },
  1955: { title: 'Rose Marie', artist: 'Slim Whitman' },
  1956: { title: "I'll Be Home", artist: 'Pat Boone' },
  1957: { title: 'Diana', artist: 'Paul Anka' },
  1958: { title: 'All I Have to Do Is Dream', artist: 'Everly Brothers' },
  1959: { title: 'Living Doll', artist: 'Cliff Richard' },
  1960: { title: "It's Now or Never", artist: 'Elvis Presley' },
  1961: { title: 'Wooden Heart', artist: 'Elvis Presley' },
  1962: { title: 'I Remember You', artist: 'Frank Ifield' },
  1963: { title: 'She Loves You', artist: 'The Beatles' },
  1964: { title: "Can't Buy Me Love", artist: 'The Beatles' },
  1965: { title: 'Tears', artist: 'Ken Dodd' },
  1966: { title: 'Green Green Grass of Home', artist: 'Tom Jones' },
  1967: { title: 'Release Me', artist: 'Engelbert Humperdinck' },
  1968: { title: 'Those Were the Days', artist: 'Mary Hopkin' },
  1969: { title: 'Get Back', artist: 'The Beatles' },
  1970: { title: 'In the Summertime', artist: 'Mungo Jerry' },
  1971: { title: 'My Sweet Lord', artist: 'George Harrison' },
  1972: { title: 'Amazing Grace', artist: 'Royal Scots Dragoon Guards' },
  1973: { title: 'Tie a Yellow Ribbon', artist: 'Dawn ft. Tony Orlando' },
  1974: { title: 'Tiger Feet', artist: 'Mud' },
  1975: { title: 'Bohemian Rhapsody', artist: 'Queen' },
  1976: { title: 'Save Your Kisses for Me', artist: 'Brotherhood of Man' },
  1977: { title: "Don't Give Up on Us", artist: 'David Soul' },
  1978: { title: 'Rivers of Babylon', artist: 'Boney M' },
  1979: { title: 'Heart of Glass', artist: 'Blondie' },
  1980: { title: "Don't Stand So Close to Me", artist: 'The Police' },
  1981: { title: "Don't You Want Me", artist: 'Human League' },
  1982: { title: 'Come On Eileen', artist: 'Dexys Midnight Runners' },
  1983: { title: 'Karma Chameleon', artist: 'Culture Club' },
  1984: { title: "Do They Know It's Christmas?", artist: 'Band Aid' },
  1985: { title: 'The Power of Love', artist: 'Jennifer Rush' },
  1986: { title: "Don't Leave Me This Way", artist: 'The Communards' },
  1987: { title: 'Never Gonna Give You Up', artist: 'Rick Astley' },
  1988: { title: 'The Only Way Is Up', artist: 'Yazz' },
  1989: { title: 'Ride on Time', artist: 'Black Box' },
  1990: { title: 'Nothing Compares 2 U', artist: "Sinéad O'Connor" },
  1991: { title: '(Everything I Do) I Do It for You', artist: 'Bryan Adams' },
  1992: { title: 'I Will Always Love You', artist: 'Whitney Houston' },
  1993: { title: "I'd Do Anything for Love (But I Won't Do That)", artist: 'Meat Loaf' },
  1994: { title: 'Love Is All Around', artist: 'Wet Wet Wet' },
  1995: { title: 'Unchained Melody', artist: 'Robson & Jerome' },
  1996: { title: 'Wannabe', artist: 'Spice Girls' },
  1997: { title: 'Candle in the Wind 1997', artist: 'Elton John' },
  1998: { title: 'Believe', artist: 'Cher' },
  1999: { title: '...Baby One More Time', artist: 'Britney Spears' },
  2000: { title: 'Can We Fix It?', artist: 'Bob the Builder' },
  2001: { title: 'Whole Again', artist: 'Atomic Kitten' },
  2002: { title: 'Anything Is Possible / Evergreen', artist: 'Will Young' },
  2003: { title: 'Where Is the Love?', artist: 'Black Eyed Peas' },
  2004: { title: 'Call on Me', artist: 'Eric Prydz' },
  2005: { title: '(Is This the Way to) Amarillo', artist: 'Tony Christie ft. Peter Kay' },
  2006: { title: 'Crazy', artist: 'Gnarls Barkley' },
  2007: { title: 'Umbrella', artist: 'Rihanna ft. Jay-Z' },
  2008: { title: 'Bleeding Love', artist: 'Leona Lewis' },
  2009: { title: 'Poker Face', artist: 'Lady Gaga' },
  2010: { title: 'Love the Way You Lie', artist: 'Eminem ft. Rihanna' },
  2011: { title: 'Someone Like You', artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know', artist: 'Gotye ft. Kimbra' },
  2013: { title: 'Blurred Lines', artist: 'Robin Thicke ft. T.I. & Pharrell' },
  2014: { title: 'Happy', artist: 'Pharrell Williams' },
  2015: { title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth' },
  2016: { title: 'One Dance', artist: 'Drake ft. WizKid & Kyla' },
  2017: { title: 'Shape of You', artist: 'Ed Sheeran' },
  2018: { title: "God's Plan", artist: 'Drake' },
  2019: { title: 'Someone You Loved', artist: 'Lewis Capaldi' },
  2020: { title: 'Blinding Lights', artist: 'The Weeknd' },
  2021: { title: 'Easy On Me', artist: 'Adele' },
  2022: { title: 'As It Was', artist: 'Harry Styles' },
  2023: { title: 'Flowers', artist: 'Miley Cyrus' },
  2024: { title: 'Espresso', artist: 'Sabrina Carpenter' },
  2025: { title: 'Luther', artist: 'Kendrick Lamar & SZA' },
  2026: { title: 'Raindance', artist: 'Dave & Tems' },
}

// Nigeria — dominant Afrobeats / highlife hits by era
const ngSongsByYear: Record<number, SongEntry> = {
  1970: { title: 'Jeun Ko Ku', artist: 'Fela Kuti' },
  1971: { title: 'Beautiful Dancer', artist: 'Prince Nico Mbarga' },
  1972: { title: 'Shakara', artist: 'Fela Kuti' },
  1973: { title: 'Afrodisiac', artist: 'Fela Kuti' },
  1974: { title: 'Expensive Shit', artist: 'Fela Kuti' },
  1975: { title: 'Zombie', artist: 'Fela Kuti' },
  1976: { title: 'Zombie', artist: 'Fela Kuti' },
  1977: { title: 'Sorrow Tears and Blood', artist: 'Fela Kuti' },
  1978: { title: 'Sweet Mother', artist: 'Prince Nico Mbarga' },
  1979: { title: 'I.T.T.', artist: 'Fela Kuti' },
  1980: { title: 'Authority Stealing', artist: 'Fela Kuti' },
  1981: { title: 'Original Sufferhead', artist: 'Fela Kuti' },
  1982: { title: 'Perambulator', artist: 'King Sunny Ade' },
  1983: { title: 'Juju Music', artist: 'King Sunny Ade' },
  1984: { title: 'Synchro System', artist: 'King Sunny Ade' },
  1985: { title: 'Army Arrangement', artist: 'Fela Kuti' },
  1986: { title: 'Beasts of No Nation', artist: 'Fela Kuti' },
  1987: { title: 'Just Like That', artist: 'Majek Fashek' },
  1988: { title: 'Send Down the Rain', artist: 'Majek Fashek' },
  1989: { title: 'Prisoner of Conscience', artist: 'Majek Fashek' },
  1990: { title: 'I Like Your Attitude', artist: 'Onyeka Onwenu' },
  1991: { title: 'One Love', artist: 'Onyeka Onwenu & King Sunny Ade' },
  1992: { title: 'Aki Special', artist: 'Bright Chimezie' },
  1993: { title: 'African China', artist: 'African China' },
  1994: { title: 'Oruka', artist: '2Baba (2face Idibia)' },
  1995: { title: 'Shakomo', artist: 'Lagbaja' },
  1996: { title: 'Musical Conspiracy', artist: 'Lagbaja' },
  1997: { title: 'Ijo Fuji', artist: 'Wasiu Ayinde Marshal' },
  1998: { title: 'African Queen', artist: '2face Idibia' },
  1999: { title: 'Dance Inna Dem Face', artist: 'Plantashun Boiz' },
  2000: { title: 'Knock Me Off My Feet', artist: 'Tony Tetuila' },
  2001: { title: 'Your Waist', artist: 'Tony Tetuila' },
  2002: { title: 'African Queen', artist: '2face Idibia' },
  2003: { title: 'Only Me', artist: 'D\'banj' },
  2004: { title: 'Tongolo', artist: "D'banj" },
  2005: { title: 'Why Me', artist: "D'banj" },
  2006: { title: 'Olorun Maje', artist: "D'banj" },
  2007: { title: 'Fall in Love', artist: 'Wande Coal' },
  2008: { title: 'Bumper to Bumper', artist: 'Wande Coal' },
  2009: { title: 'Ololufe', artist: 'Wande Coal' },
  2010: { title: 'Superstar', artist: 'Wizkid' },
  2011: { title: 'Holla at Your Boy', artist: 'Wizkid' },
  2012: { title: 'Skelewu', artist: 'Davido' },
  2013: { title: 'Aye', artist: 'Davido' },
  2014: { title: 'Godwin', artist: 'Korede Bello' },
  2015: { title: 'Dorobucci', artist: 'MAVIN All Stars' },
  2016: { title: 'Ojuelegba', artist: 'Wizkid' },
  2017: { title: 'Fia', artist: 'Davido' },
  2018: { title: 'Soco', artist: 'Wizkid ft. Terri, Spotless & Ceeza Milli' },
  2019: { title: 'Fever', artist: 'Wizkid' },
  2020: { title: 'Essence', artist: 'Wizkid ft. Tems' },
  2021: { title: 'Essence', artist: 'Wizkid ft. Tems' },
  2022: { title: 'Last Last', artist: 'Burna Boy' },
  2023: { title: 'City Boys', artist: 'Burna Boy' },
  2024: { title: 'Lover', artist: 'Burna Boy' },
  2025: { title: 'Bundle', artist: 'Asake' },
  2026: { title: 'Bundle', artist: 'Asake' },
}

// South Africa — dominant hits by era
const zaSongsByYear: Record<number, SongEntry> = {
  1970: { title: 'Stimela', artist: 'Hugh Masekela' },
  1975: { title: 'Grazing in the Grass', artist: 'Hugh Masekela' },
  1980: { title: 'Soweto Blues', artist: 'Miriam Makeba' },
  1985: { title: 'Bring Him Back Home', artist: 'Hugh Masekela' },
  1987: { title: 'Graceland', artist: 'Paul Simon ft. Ladysmith Black Mambazo' },
  1990: { title: 'Homeless', artist: 'Ladysmith Black Mambazo' },
  1993: { title: 'Pata Pata', artist: 'Miriam Makeba' },
  1994: { title: 'Nakombela', artist: 'Sipho Hotstix Mabuse' },
  1995: { title: 'Weeping', artist: 'Bright Blue' },
  1996: { title: 'My Wish', artist: 'Yvonne Chaka Chaka' },
  1997: { title: 'Thank You Mr. DJ', artist: 'Yvonne Chaka Chaka' },
  1998: { title: 'Weekend Special', artist: 'Brenda Fassie' },
  1999: { title: 'Nomakanjani', artist: 'Brenda Fassie' },
  2000: { title: 'Vuli Ndlela', artist: 'Brenda Fassie' },
  2001: { title: 'Umuntu Ngumuntu Ngabantu', artist: 'Brenda Fassie' },
  2002: { title: 'Bambalelani', artist: 'Freshlyground' },
  2003: { title: 'Nomvula', artist: 'Freshlyground' },
  2004: { title: 'Doo Be Doo', artist: 'Freshlyground' },
  2005: { title: 'Ndihamba Nawe', artist: 'Freshlyground' },
  2006: { title: 'Potjo', artist: 'Freshlyground' },
  2007: { title: 'I\'d Like', artist: 'Freshlyground' },
  2008: { title: 'Nomvula', artist: 'Freshlyground' },
  2009: { title: 'Soldier', artist: 'Thandiswa Mazwai' },
  2010: { title: 'Waka Waka (This Time for Africa)', artist: 'Shakira ft. Freshlyground' },
  2011: { title: 'Loliwe', artist: 'Zahara' },
  2012: { title: 'Love Potion', artist: 'Mi Casa' },
  2013: { title: 'Jika', artist: 'Mi Casa' },
  2014: { title: 'Doc Shebeleza', artist: 'Cassper Nyovest' },
  2015: { title: 'Tsholofelo', artist: 'Cassper Nyovest' },
  2016: { title: "Don't Tell Me", artist: 'Black Coffee ft. Maxine' },
  2017: { title: 'Drive', artist: 'Black Coffee ft. Delilah Montagu' },
  2018: { title: 'We Dance Again', artist: 'Naughty Boy ft. Nile Rodgers & Sam Romans' },
  2019: { title: 'Superman', artist: 'Black Coffee ft. Bucie' },
  2020: { title: 'You Need Me', artist: 'Black Coffee ft. Maxine' },
  2021: { title: 'Subculture', artist: 'Black Coffee ft. Pharrell Williams' },
  2022: { title: 'Have a Good Time', artist: 'Black Coffee ft. Pharrell Williams' },
  2023: { title: 'Wish You Were Here', artist: 'Black Coffee ft. Msaki' },
  2024: { title: 'Queues', artist: 'Kabza De Small ft. Young Stunna & Bongza' },
  2025: { title: 'uSisi', artist: 'Kabza De Small ft. Young Stunna' },
  2026: { title: 'uSisi', artist: 'Kabza De Small ft. Young Stunna' },
}

// Brazil — dominant hits by era
const brSongsByYear: Record<number, SongEntry> = {
  1960: { title: 'Garota de Ipanema', artist: 'João Gilberto & Stan Getz' },
  1965: { title: 'Garota de Ipanema', artist: 'Tom Jobim' },
  1968: { title: 'Tropicália', artist: 'Caetano Veloso' },
  1970: { title: 'Aquarela do Brasil', artist: 'Elis Regina' },
  1975: { title: 'Como Nossos Pais', artist: 'Elis Regina' },
  1980: { title: 'Menina Veneno', artist: 'Ritchie' },
  1985: { title: 'Brasil', artist: 'Cazuza' },
  1990: { title: 'O Tempo Não Para', artist: 'Cazuza' },
  1992: { title: 'Ideologia', artist: 'Cazuza' },
  1993: { title: 'Hoje', artist: 'Titãs' },
  1994: { title: 'Epitáfio', artist: 'Titãs' },
  1995: { title: 'Minha Alma', artist: 'O Rappa' },
  1996: { title: 'A Novidade', artist: 'Gilberto Gil' },
  1997: { title: 'Sozinho', artist: 'Caetano Veloso' },
  1998: { title: 'Evidências', artist: 'Chitãozinho & Xororó' },
  1999: { title: 'Tudo Que Você Podia Ser', artist: 'Capital Inicial' },
  2000: { title: 'Andar com Fé', artist: 'Gilberto Gil' },
  2001: { title: 'Tempo Rei', artist: 'Gilberto Gil' },
  2002: { title: 'Couleur Locale', artist: 'Seu Jorge' },
  2003: { title: 'Carolina', artist: 'Seu Jorge' },
  2004: { title: 'Eu Sou Neguinha', artist: 'Claudinho & Buchecha' },
  2005: { title: 'Ela Vai', artist: 'Bonde do Tigrão' },
  2006: { title: 'Chuva de Arroz', artist: 'Ivete Sangalo' },
  2007: { title: 'Só Love', artist: 'Ivete Sangalo' },
  2008: { title: 'Flor e o Beija-Flor', artist: 'Ivete Sangalo' },
  2009: { title: 'Festa', artist: 'Ivete Sangalo' },
  2010: { title: 'Ai Se Eu Te Pego', artist: 'Michel Teló' },
  2011: { title: 'Ai Se Eu Te Pego', artist: 'Michel Teló' },
  2012: { title: 'Show das Poderosas', artist: 'Anitta' },
  2013: { title: 'Meiga e Abusada', artist: 'Anitta' },
  2014: { title: 'Bang', artist: 'Anitta' },
  2015: { title: 'Deixa Ele Sofrer', artist: 'Anitta' },
  2016: { title: 'Sua Cara', artist: 'Anitta ft. Major Lazer' },
  2017: { title: 'Downtown', artist: 'Anitta ft. J Balvin' },
  2018: { title: 'Vai Malandra', artist: 'Anitta ft. MC Zaac & Maejor' },
  2019: { title: 'Bola Rebola', artist: 'Tropkillaz ft. Anitta & J Balvin' },
  2020: { title: 'Me Gusta', artist: 'Anitta ft. Cardi B & Myke Towers' },
  2021: { title: 'Girl from Rio', artist: 'Anitta' },
  2022: { title: 'Envolver', artist: 'Anitta' },
  2023: { title: 'Mil Veces', artist: 'Anitta' },
  2024: { title: 'Funk Rave', artist: 'Anitta' },
  2025: { title: 'Mil Veces', artist: 'Anitta ft. Jhayco' },
  2026: { title: 'Mil Veces', artist: 'Anitta ft. Jhayco' },
}

// India — Bollywood / Hindi film chart (most popular song of the year)
const inSongsByYear: Record<number, SongEntry> = {
  1960: { title: 'Pyaar Kiya To Darna Kya',         artist: 'Lata Mangeshkar' },
  1965: { title: 'Mere Mehboob Qayamat Hogi',        artist: 'Mohammed Rafi' },
  1970: { title: 'Roop Tera Mastana',                artist: 'Kishore Kumar' },
  1975: { title: 'Dum Maro Dum',                     artist: 'Asha Bhosle' },
  1978: { title: 'Aap Jaisa Koi',                    artist: 'Nazia Hassan' },
  1980: { title: 'Om Shanti Om',                     artist: 'Nazia Hassan & Biddu' },
  1985: { title: 'Pyar Mein Dil Pe',                 artist: 'Lata Mangeshkar' },
  1988: { title: 'Ek Do Teen',                       artist: 'Alka Yagnik' },
  1991: { title: 'Dil Hai Ke Manta Nahin',           artist: 'Kumar Sanu & Anuradha Paudwal' },
  1994: { title: 'Tu Cheez Badi Hai Mast Mast',      artist: 'Udit Narayan & Kavita Krishnamurthy' },
  1995: { title: 'Tujhe Dekha To',                   artist: 'Lata Mangeshkar & Kumar Sanu' },
  1997: { title: 'Dil To Pagal Hai',                 artist: 'Lata Mangeshkar & Udit Narayan' },
  1998: { title: 'Kuch Kuch Hota Hai',               artist: 'Alka Yagnik & Kumar Sanu' },
  2000: { title: 'Kaho Naa... Pyaar Hai',            artist: 'Udit Narayan & Kavita Krishnamurthy' },
  2001: { title: 'Kabhi Khushi Kabhie Gham',         artist: 'Lata Mangeshkar' },
  2003: { title: 'Kal Ho Naa Ho',                    artist: 'Sonu Nigam' },
  2006: { title: 'Kajra Re',                         artist: 'Shankar Mahadevan, Javed Ali & Alka Yagnik' },
  2007: { title: 'Chak De! India',                   artist: 'Salim-Sulaiman' },
  2008: { title: 'Jai Ho',                           artist: 'A.R. Rahman' },
  2010: { title: 'Sheila Ki Jawani',                 artist: 'Sunidhi Chauhan & Vishal Dadlani' },
  2011: { title: 'Kolaveri Di',                      artist: 'Dhanush' },
  2012: { title: 'Chikni Chameli',                   artist: 'Shreya Ghoshal' },
  2013: { title: 'Lungi Dance',                      artist: 'Yo Yo Honey Singh' },
  2014: { title: 'Tum Hi Ho',                        artist: 'Arijit Singh' },
  2015: { title: 'Gerua',                            artist: 'Arijit Singh & Antara Mitra' },
  2016: { title: 'Ae Dil Hai Mushkil',               artist: 'Arijit Singh' },
  2017: { title: 'Badri Ki Dulhania',                artist: 'Neha Kakkar & Dev Negi' },
  2018: { title: 'Dilbar',                           artist: 'Neha Kakkar' },
  2019: { title: 'Kalank',                           artist: 'Arijit Singh' },
  2020: { title: 'Filhall',                          artist: 'Akshay Kumar ft. BPraak' },
  2021: { title: 'Raataan Lambiyan',                 artist: 'Jubin Nautiyal & Asees Kaur' },
  2022: { title: 'Kesariya',                         artist: 'Arijit Singh' },
  2023: { title: 'Jhoome Jo Pathaan',                artist: 'Arijit Singh & Sukriti Kakar' },
  2024: { title: 'Nain Tere',                        artist: 'Arijit Singh' },
  2025: { title: 'Mere Meherbaan',                   artist: 'Arijit Singh' },
  2026: { title: 'Mere Meherbaan',                   artist: 'Arijit Singh' },
}

// Canada — Canadian Hot 100 / RPM chart (highlights Canadian artists)
const caSongsByYear: Record<number, SongEntry> = {
  1965: { title: 'Shakin\' All Over',                artist: 'Guess Who' },
  1970: { title: 'American Woman',                   artist: 'Guess Who' },
  1975: { title: 'Seasons in the Sun',               artist: 'Terry Jacks' },
  1980: { title: 'Call Me',                          artist: 'Blondie' },
  1983: { title: 'Every Breath You Take',            artist: 'The Police' },
  1985: { title: 'Run to You',                       artist: 'Bryan Adams' },
  1987: { title: 'La Bamba',                         artist: 'Los Lobos' },
  1988: { title: 'Faith',                            artist: 'George Michael' },
  1990: { title: 'Nothing Compares 2 U',             artist: 'Sinéad O\'Connor' },
  1991: { title: '(Everything I Do) I Do It for You', artist: 'Bryan Adams' },
  1992: { title: 'I Will Always Love You',           artist: 'Whitney Houston' },
  1993: { title: "I'd Do Anything for Love",         artist: 'Meat Loaf' },
  1994: { title: 'The Sign',                         artist: 'Ace of Base' },
  1995: { title: "Gangsta's Paradise",               artist: 'Coolio' },
  1996: { title: 'Macarena',                         artist: 'Los Del Rio' },
  1997: { title: 'Candle in the Wind 1997',          artist: 'Elton John' },
  1998: { title: 'Believe',                          artist: 'Cher' },
  1999: { title: '...Baby One More Time',            artist: 'Britney Spears' },
  2000: { title: 'Breathe',                          artist: 'Faith Hill' },
  2001: { title: 'Hanging by a Moment',              artist: 'Lifehouse' },
  2002: { title: 'How You Remind Me',                artist: 'Nickelback' },
  2003: { title: 'In da Club',                       artist: '50 Cent' },
  2004: { title: 'Yeah!',                            artist: 'Usher' },
  2005: { title: 'We Belong Together',               artist: 'Mariah Carey' },
  2006: { title: 'Crazy',                            artist: 'Gnarls Barkley' },
  2007: { title: 'Irreplaceable',                    artist: 'Beyoncé' },
  2008: { title: 'Lollipop',                         artist: 'Lil Wayne' },
  2009: { title: 'Boom Boom Pow',                    artist: 'Black Eyed Peas' },
  2010: { title: 'TiK ToK',                         artist: 'Ke$ha' },
  2011: { title: 'Rolling in the Deep',              artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',     artist: 'Gotye ft. Kimbra' },
  2013: { title: 'Thrift Shop',                      artist: 'Macklemore & Ryan Lewis' },
  2014: { title: 'Happy',                            artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                      artist: 'Mark Ronson ft. Bruno Mars' },
  2016: { title: 'One Dance',                        artist: 'Drake' },
  2017: { title: 'Shape of You',                     artist: 'Ed Sheeran' },
  2018: { title: "God's Plan",                       artist: 'Drake' },
  2019: { title: 'Old Town Road',                    artist: 'Lil Nas X ft. Billy Ray Cyrus' },
  2020: { title: 'Blinding Lights',                  artist: 'The Weeknd' },
  2021: { title: 'drivers license',                  artist: 'Olivia Rodrigo' },
  2022: { title: 'As It Was',                        artist: 'Harry Styles' },
  2023: { title: 'Flowers',                          artist: 'Miley Cyrus' },
  2024: { title: 'Espresso',                         artist: 'Sabrina Carpenter' },
  2025: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
  2026: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
}

// Australia — ARIA Charts (best-selling single of the year)
const auSongsByYear: Record<number, SongEntry> = {
  1970: { title: 'In the Summertime',                artist: 'Mungo Jerry' },
  1975: { title: 'Love Will Keep Us Together',       artist: 'Captain & Tennille' },
  1980: { title: 'Another Brick in the Wall',        artist: 'Pink Floyd' },
  1983: { title: 'Come On Eileen',                   artist: 'Dexys Midnight Runners' },
  1986: { title: 'Rock Me Amadeus',                  artist: 'Falco' },
  1987: { title: 'Never Gonna Give You Up',          artist: 'Rick Astley' },
  1988: { title: 'Faith',                            artist: 'George Michael' },
  1989: { title: 'Like a Prayer',                    artist: 'Madonna' },
  1990: { title: 'Nothing Compares 2 U',             artist: 'Sinéad O\'Connor' },
  1991: { title: '(Everything I Do) I Do It for You', artist: 'Bryan Adams' },
  1992: { title: 'I Will Always Love You',           artist: 'Whitney Houston' },
  1994: { title: 'The Sign',                         artist: 'Ace of Base' },
  1995: { title: "Gangsta's Paradise",               artist: 'Coolio' },
  1996: { title: 'Macarena',                         artist: 'Los Del Rio' },
  1997: { title: 'Candle in the Wind 1997',          artist: 'Elton John' },
  1998: { title: 'Believe',                          artist: 'Cher' },
  1999: { title: '...Baby One More Time',            artist: 'Britney Spears' },
  2000: { title: 'Smooth',                           artist: 'Santana ft. Rob Thomas' },
  2001: { title: 'Hanging by a Moment',              artist: 'Lifehouse' },
  2002: { title: 'How You Remind Me',                artist: 'Nickelback' },
  2003: { title: 'Beautiful',                        artist: 'Christina Aguilera' },
  2004: { title: 'Yeah!',                            artist: 'Usher' },
  2005: { title: 'We Belong Together',               artist: 'Mariah Carey' },
  2006: { title: 'Crazy',                            artist: 'Gnarls Barkley' },
  2007: { title: 'Umbrella',                         artist: 'Rihanna ft. Jay-Z' },
  2008: { title: 'Bleeding Love',                    artist: 'Leona Lewis' },
  2009: { title: 'Poker Face',                       artist: 'Lady Gaga' },
  2010: { title: 'TiK ToK',                         artist: 'Ke$ha' },
  2011: { title: 'Rolling in the Deep',              artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',     artist: 'Gotye ft. Kimbra' },
  2013: { title: 'Blurred Lines',                    artist: 'Robin Thicke ft. T.I. & Pharrell' },
  2014: { title: 'Happy',                            artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                      artist: 'Mark Ronson ft. Bruno Mars' },
  2016: { title: 'One Dance',                        artist: 'Drake ft. WizKid & Kyla' },
  2017: { title: 'Shape of You',                     artist: 'Ed Sheeran' },
  2018: { title: "God's Plan",                       artist: 'Drake' },
  2019: { title: 'Old Town Road',                    artist: 'Lil Nas X ft. Billy Ray Cyrus' },
  2020: { title: 'Blinding Lights',                  artist: 'The Weeknd' },
  2021: { title: 'Easy On Me',                       artist: 'Adele' },
  2022: { title: 'As It Was',                        artist: 'Harry Styles' },
  2023: { title: 'Flowers',                          artist: 'Miley Cyrus' },
  2024: { title: 'Espresso',                         artist: 'Sabrina Carpenter' },
  2025: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
  2026: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
}

// Germany — GfK Entertainment Charts (best-selling single of the year)
const deSongsByYear: Record<number, SongEntry> = {
  1960: { title: 'Marina',                           artist: 'Rocco Granata' },
  1965: { title: '(I Can\'t Get No) Satisfaction',   artist: 'The Rolling Stones' },
  1970: { title: 'In the Summertime',                artist: 'Mungo Jerry' },
  1975: { title: 'Bohemian Rhapsody',                artist: 'Queen' },
  1978: { title: 'Rivers of Babylon',                artist: 'Boney M' },
  1980: { title: 'Call Me',                          artist: 'Blondie' },
  1984: { title: 'Relax',                            artist: 'Frankie Goes to Hollywood' },
  1986: { title: 'Rock Me Amadeus',                  artist: 'Falco' },
  1988: { title: 'Faith',                            artist: 'George Michael' },
  1990: { title: 'Nothing Compares 2 U',             artist: 'Sinéad O\'Connor' },
  1991: { title: '(Everything I Do) I Do It for You', artist: 'Bryan Adams' },
  1992: { title: 'I Will Always Love You',           artist: 'Whitney Houston' },
  1995: { title: 'Scatman (Ski-Ba-Bop-Ba-Dop-Bop)', artist: 'Scatman John' },
  1997: { title: 'Barbie Girl',                      artist: 'Aqua' },
  1998: { title: 'Believe',                          artist: 'Cher' },
  1999: { title: '...Baby One More Time',            artist: 'Britney Spears' },
  2002: { title: 'The Ketchup Song',                 artist: 'Las Ketchup' },
  2004: { title: 'Yeah!',                            artist: 'Usher' },
  2006: { title: 'Hips Don\'t Lie',                  artist: 'Shakira ft. Wyclef Jean' },
  2007: { title: 'Umbrella',                         artist: 'Rihanna ft. Jay-Z' },
  2008: { title: 'Viva la Vida',                     artist: 'Coldplay' },
  2009: { title: 'Poker Face',                       artist: 'Lady Gaga' },
  2010: { title: 'Dynamite',                         artist: 'Taio Cruz' },
  2011: { title: 'Someone Like You',                 artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',     artist: 'Gotye ft. Kimbra' },
  2013: { title: 'Blurred Lines',                    artist: 'Robin Thicke ft. T.I. & Pharrell' },
  2014: { title: 'Happy',                            artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                      artist: 'Mark Ronson ft. Bruno Mars' },
  2016: { title: 'One Dance',                        artist: 'Drake ft. WizKid & Kyla' },
  2017: { title: 'Shape of You',                     artist: 'Ed Sheeran' },
  2018: { title: "God's Plan",                       artist: 'Drake' },
  2019: { title: 'Old Town Road',                    artist: 'Lil Nas X ft. Billy Ray Cyrus' },
  2020: { title: 'Blinding Lights',                  artist: 'The Weeknd' },
  2021: { title: 'Easy On Me',                       artist: 'Adele' },
  2022: { title: 'As It Was',                        artist: 'Harry Styles' },
  2023: { title: 'Flowers',                          artist: 'Miley Cyrus' },
  2024: { title: 'Espresso',                         artist: 'Sabrina Carpenter' },
  2025: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
  2026: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
}

// France — SNEP Singles Chart (best-selling single of the year)
const frSongsByYear: Record<number, SongEntry> = {
  1960: { title: 'Non, je ne regrette rien',         artist: 'Édith Piaf' },
  1965: { title: 'La Bohème',                        artist: 'Charles Aznavour' },
  1970: { title: 'Les Champs-Élysées',               artist: 'Joe Dassin' },
  1975: { title: "L'Été indien",                     artist: 'Joe Dassin' },
  1978: { title: 'Rivers of Babylon',                artist: 'Boney M' },
  1980: { title: 'Et si tu n\'existais pas',          artist: 'Joe Dassin' },
  1986: { title: 'Voyage Voyage',                    artist: 'Desireless' },
  1989: { title: 'Lambada',                          artist: 'Kaoma' },
  1991: { title: '(Everything I Do) I Do It for You', artist: 'Bryan Adams' },
  1992: { title: 'I Will Always Love You',           artist: 'Whitney Houston' },
  1995: { title: 'Je te donne',                      artist: 'Jean-Jacques Goldman' },
  1997: { title: 'Candle in the Wind 1997',          artist: 'Elton John' },
  1998: { title: 'La Tribu de Dana',                 artist: 'Manau' },
  2000: { title: 'Moi... Lolita',                    artist: 'Alizée' },
  2002: { title: 'The Ketchup Song',                 artist: 'Las Ketchup' },
  2004: { title: 'Dragostea Din Tei',                artist: 'O-Zone' },
  2006: { title: 'Hips Don\'t Lie',                  artist: 'Shakira ft. Wyclef Jean' },
  2007: { title: 'Umbrella',                         artist: 'Rihanna ft. Jay-Z' },
  2008: { title: 'Viva la Vida',                     artist: 'Coldplay' },
  2009: { title: 'Poker Face',                       artist: 'Lady Gaga' },
  2010: { title: 'TiK ToK',                         artist: 'Ke$ha' },
  2011: { title: 'Someone Like You',                 artist: 'Adele' },
  2012: { title: 'Somebody That I Used to Know',     artist: 'Gotye ft. Kimbra' },
  2013: { title: 'Blurred Lines',                    artist: 'Robin Thicke ft. T.I. & Pharrell' },
  2014: { title: 'Happy',                            artist: 'Pharrell Williams' },
  2015: { title: 'Uptown Funk',                      artist: 'Mark Ronson ft. Bruno Mars' },
  2016: { title: 'One Dance',                        artist: 'Drake ft. WizKid & Kyla' },
  2017: { title: 'Shape of You',                     artist: 'Ed Sheeran' },
  2018: { title: "God's Plan",                       artist: 'Drake' },
  2019: { title: 'Old Town Road',                    artist: 'Lil Nas X ft. Billy Ray Cyrus' },
  2020: { title: 'Blinding Lights',                  artist: 'The Weeknd' },
  2021: { title: 'Easy On Me',                       artist: 'Adele' },
  2022: { title: 'As It Was',                        artist: 'Harry Styles' },
  2023: { title: 'Flowers',                          artist: 'Miley Cyrus' },
  2024: { title: 'Espresso',                         artist: 'Sabrina Carpenter' },
  2025: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
  2026: { title: 'Luther',                           artist: 'Kendrick Lamar & SZA' },
}

// Japan — Oricon Singles Chart (best-selling single of the year)
const jpSongsByYear: Record<number, SongEntry> = {
  1975: { title: 'Oyoge! Taiyakikun',                artist: 'Masato Shimon' },
  1980: { title: 'Yume de Aetara',                   artist: 'Hiromi Ōta' },
  1985: { title: 'CHA-CHA-CHA',                      artist: 'Ichikawa Ikue' },
  1988: { title: 'Donna Toki mo',                    artist: 'Anzen Chitai' },
  1990: { title: 'Oh! Yeah!',                        artist: 'Anzen Chitai' },
  1993: { title: 'Yoru no Yuki',                     artist: 'Chage & Aska' },
  1994: { title: 'Hello, Again ~Mukashi kara Aru Basho~', artist: 'MY LITTLE LOVER' },
  1996: { title: 'Don\'t You See!',                  artist: 'Globe' },
  1998: { title: 'my graduation',                    artist: 'SPEED' },
  2000: { title: 'Tsunami',                          artist: 'Southern All Stars' },
  2001: { title: 'Can You Keep a Secret?',           artist: 'Hikaru Utada' },
  2003: { title: 'Sekai ni Hitotsu Dake no Hana',    artist: 'SMAP' },
  2007: { title: 'Flavor of Life',                   artist: 'Hikaru Utada' },
  2008: { title: 'Prisoner of Love',                 artist: 'Hikaru Utada' },
  2010: { title: 'Heavy Rotation',                   artist: 'AKB48' },
  2011: { title: 'Everyday, Kachuusha',              artist: 'AKB48' },
  2012: { title: 'Give Me Five!',                    artist: 'AKB48' },
  2013: { title: 'Koisuru Fortune Cookie',           artist: 'AKB48' },
  2014: { title: 'Labrador Retriever',               artist: 'AKB48' },
  2015: { title: 'Bokutachi wa Tatakawanai',         artist: 'AKB48' },
  2016: { title: 'Tsubasa wa Iranai',                artist: 'AKB48' },
  2017: { title: 'Shoot Sign',                       artist: 'AKB48' },
  2018: { title: 'Teacher Teacher',                  artist: 'AKB48' },
  2019: { title: 'Yoru ni Kakeru',                   artist: 'YOASOBI' },
  2020: { title: 'Yoru ni Kakeru',                   artist: 'YOASOBI' },
  2021: { title: 'Kaibutsu',                         artist: 'YOASOBI' },
  2022: { title: 'Odo',                              artist: 'Ado' },
  2023: { title: 'Idol',                             artist: 'YOASOBI' },
  2024: { title: 'Promotion',                        artist: 'YOASOBI' },
  2025: { title: 'Biri-Biri',                        artist: 'YOASOBI' },
  2026: { title: 'Biri-Biri',                        artist: 'YOASOBI' },
}

// Kenya — dominant hits by era (Benga, Ohangla, Gengetone, Afropop)
const keSongsByYear: Record<number, SongEntry> = {
  1970: { title: 'Nakupenda Mpenzi',                 artist: 'Fadhili William' },
  1975: { title: 'Shauri Yako',                      artist: 'Orchestra Virunga' },
  1980: { title: 'Mama Africa',                      artist: 'Fadhili William' },
  1985: { title: 'Nakupenda',                        artist: 'Ayub Ogada' },
  1990: { title: 'Harambee',                         artist: 'Them Mushrooms' },
  1995: { title: 'Dunia Ina Mambo',                  artist: 'Orchestra Super Mazembe' },
  2000: { title: 'Ombeni',                           artist: 'Suzanna Owiyo' },
  2003: { title: 'Unbwogable',                       artist: 'Gidi Gidi Maji Maji' },
  2007: { title: 'My Life',                          artist: 'Nonini' },
  2010: { title: 'Leo ni Leo',                       artist: 'Sauti Sol' },
  2012: { title: 'Nishike',                          artist: 'Sauti Sol' },
  2014: { title: 'Sura Yako',                        artist: 'Sauti Sol' },
  2016: { title: 'Melanin',                          artist: 'Sauti Sol ft. Patoranking' },
  2017: { title: 'Suzanna',                          artist: 'Sauti Sol ft. Nyashinski' },
  2018: { title: 'Short & Sweet',                    artist: 'Sauti Sol ft. Bensoul' },
  2019: { title: 'Chaguo la Moyo',                   artist: 'Sauti Sol ft. Kaskazini' },
  2020: { title: 'Extravaganza',                     artist: 'Sauti Sol ft. Bensoul, Nviiri & Crystal Asige' },
  2021: { title: 'Rhumba Japani',                    artist: 'Sauti Sol ft. Kaskazini' },
  2022: { title: 'Lo Lo Lo',                         artist: 'Maandy' },
  2023: { title: 'Nairobi',                          artist: 'Sauti Sol' },
  2024: { title: 'Sawa Sawa',                        artist: 'Fena Gitu' },
  2025: { title: 'Nairobi',                          artist: 'Sauti Sol' },
  2026: { title: 'Nairobi',                          artist: 'Sauti Sol' },
}

// Ghana — dominant hits by era (Highlife, Hiplife, Afrobeats)
const ghSongsByYear: Record<number, SongEntry> = {
  1970: { title: 'Yaa Amponsah',                    artist: 'Ebo Taylor' },
  1975: { title: 'Love and Death',                  artist: 'Ebo Taylor' },
  1980: { title: 'Ohia',                            artist: 'E.T. Mensah' },
  1985: { title: 'Sankwuaa',                        artist: 'Kojo Antwi' },
  1990: { title: 'Oye',                             artist: 'Kojo Antwi' },
  1995: { title: 'Mepa Wo Kyew',                    artist: 'Daddy Lumba' },
  1997: { title: 'Aben Wo Ha',                      artist: 'Daddy Lumba' },
  2000: { title: 'Odo',                             artist: 'Daddy Lumba' },
  2003: { title: 'Odo Bra',                         artist: 'Ofori Amponsah' },
  2005: { title: 'Kokooko',                         artist: 'Ofori Amponsah' },
  2007: { title: 'Adom',                            artist: 'Ofori Amponsah' },
  2010: { title: 'My Lady',                         artist: 'Sarkodie ft. E.L.' },
  2012: { title: 'Adonai',                          artist: 'Sarkodie ft. Castro' },
  2013: { title: 'Non Living Thing',                artist: 'Sarkodie' },
  2015: { title: 'Ofie Nipa',                       artist: 'KiDi' },
  2016: { title: 'Say Cheese',                      artist: 'Shatta Wale' },
  2018: { title: 'Melissa',                         artist: 'KiDi' },
  2019: { title: 'Caro',                            artist: 'Kuami Eugene' },
  2020: { title: 'Wish Me Well',                    artist: 'KiDi' },
  2021: { title: 'Touch It',                        artist: 'KiDi' },
  2022: { title: 'For My Baby',                     artist: 'KiDi' },
  2023: { title: 'Enjoyment',                       artist: 'KiDi' },
  2024: { title: 'Liar',                            artist: 'KiDi' },
  2025: { title: 'Enjoyment',                       artist: 'KiDi ft. Sarkodie' },
  2026: { title: 'Enjoyment',                       artist: 'KiDi ft. Sarkodie' },
}

const CHART_LABELS: Record<string, string> = {
  us:    'US Billboard Hot 100',
  gb:    'UK Singles Chart',
  ng:    'Nigeria Afrobeats Chart',
  za:    'South Africa Music Charts',
  br:    'Brazil Music Charts',
  in:    'India Bollywood Chart',
  ca:    'Canadian Hot 100',
  au:    'ARIA Charts (Australia)',
  de:    'GfK Entertainment Charts',
  fr:    'SNEP Singles Chart (France)',
  jp:    'Oricon Singles Chart',
  ke:    'Kenya Music Chart',
  gh:    'Ghana Music Chart',
  world: 'US Billboard Hot 100',
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

function closestYear(map: Record<number, SongEntry>, year: number): SongEntry | null {
  const years = Object.keys(map).map(Number)
  if (!years.length) return null
  const closest = years.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  )
  return map[closest]
}

async function fetchAlbumArt(title: string, artist: string): Promise<string | undefined> {
  try {
    const q = encodeURIComponent(`${title} ${artist}`)
    const res = await fetch(
      `https://itunes.apple.com/search?term=${q}&entity=song&limit=1`,
      { next: { revalidate: 86400 } },
    )
    if (!res.ok) return undefined
    const data = await res.json()
    const url: string | undefined = data.results?.[0]?.artworkUrl100
    return url ? url.replace('100x100', '600x600') : undefined
  } catch {
    return undefined
  }
}

export async function getSongForYear(year: number, country = 'world', date?: string): Promise<Song | null> {
  if (year < 1950) return null

  // For dates within the last 14 days, try live chart APIs before falling back to static data
  if (date && isWithinLastDays(date, 14)) {
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
      const albumArt = await fetchAlbumArt(liveEntry.title, liveEntry.artist)
      return { title: liveEntry.title, artist: liveEntry.artist, chart: liveChart, albumArt }
    }
  }

  // Static data fallback for all other dates
  const chartKey = CHART_DATA[country] !== undefined ? country : 'world'
  const data = CHART_DATA[chartKey]
  const chart = CHART_LABELS[chartKey] ?? 'US Billboard Hot 100'

  const entry = data[year] ?? closestYear(data, year)
  if (!entry) return null

  const albumArt = await fetchAlbumArt(entry.title, entry.artist)
  return { title: entry.title, artist: entry.artist, chart, albumArt }
}
