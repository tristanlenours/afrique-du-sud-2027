// Données du carnet : source unique du site.
// Prix pour 2 personnes relevés sur Booking le 31 octobre 2026 (tarifs annulables, connecté au compte).
// Référence complète : ../2027-afrique-du-sud.md
const RELEVE = "31 octobre 2026";
const OBJECTIF = 7000;

const FENETRES = {
  f2: { label: "25 juil. → 9 août", depart: "2027-07-25", court: "Fin juillet", atout: "Les safaris sont terminés avant le pont férié du 6 au 9 août, qu'on passe au bord de l'océan." },
  f1: { label: "18 juil. → 2 août", depart: "2027-07-18", court: "Mi-juillet", atout: "On arrive pile à la rentrée scolaire sud-africaine, une semaine entière avant le pont du 9 août." },
};

// Postes hors logement, repris du budget consolidé de la fiche.
const FIXES = [
  { poste: "Vols Paris → Johannesburg + Durban → Paris", detail: "RwandAir 525 € + Ethiopian 547 € par personne, zéro vol intérieur", prix: 2144 },
  { poste: "Trajet jusqu'à Paris CDG", detail: "Train ou voiture, pour deux", prix: 200 },
  { poste: "SUV automatique, essence, péages", detail: "First Car Rental, Suzuki Fronx, 13 jours : 563 € + 70 € de frais Eswatini + ~215 € d'essence et de péages, franchise non rachetée", prix: 848 },
  { poste: "Droits d'entrée du Kruger", detail: "4 jours à 692 ZAR par adulte", prix: 300 },
  { poste: "Activités et visites", detail: "Soweto, Panorama Route, marche et sortie du soir au Kruger, Mlilwane, Cape Vidal, croisière hippos", prix: 390 },
  { poste: "Repas hors réserve privée", detail: "Environ 50 € par jour à deux, braai au bungalow et bons restaurants", prix: 550 },
  { poste: "Pourboires, pharmacie, assurance", detail: "Bas de fourchette : 250 €, jusqu'à 550 € selon les imprévus et souvenirs", prix: 250 },
];

const PHOTOS = {
  cen2: { alt: "Arbre mort en silhouette sur un coucher de soleil orange", cap: "Coucher de soleil depuis le camp de Satara", a: "Wolves201", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Kruger_Satara_camp_JF.jpg" },
  jnb1: { alt: "Danseurs de rue devant un public dans Vilakazi Street", cap: "Vilakazi Street, Soweto", a: "Fata)(Morgana", l: "CC BY 4.0", u: "https://commons.wikimedia.org/wiki/File:Vilakazi_street_performers.jpg" },
  jnb2: { alt: "Union Buildings au-dessus de leurs jardins en terrasses", cap: "Union Buildings, Pretoria", a: "Ruby D-Brown", l: "CC BY 4.0", u: "https://commons.wikimedia.org/wiki/File:Union_Buildings_Pretoria_07.jpg" },
  jnb4: { alt: "Drapeau sud-africain dans une salle du musée", cap: "Musée de l'Apartheid, Johannesburg", a: "Pia Andrews", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Apartheid_Museum_-_15755983922.jpg" },
  bly1: { alt: "Trois sommets ronds dominant le canyon sous un grand ciel bleu", cap: "Les Three Rondavels", a: "Claidheamhmor", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:The_Three_Rondavels,_Blyde_River_Canyon.jpg" },
  bly2: { alt: "Falaise boisée plongeant vers la vallée", cap: "God's Window", a: "Marco Schmidt", l: "CC BY-SA 2.5", u: "https://commons.wikimedia.org/wiki/File:God_s_Window_MS_2561.JPG" },
  bly3: { alt: "Marmites de géants creusées dans la roche orange", cap: "Bourke's Luck Potholes", a: "Dietmar Rabich", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Blyde_River_Canyon_Nature_Reserve_(ZA),_Blyde_River,_Bourke%27s_Luck_Potholes_--_2024_--_9984.jpg" },
  bly4: { alt: "Façade ancienne du Pilgrim's Hotel", cap: "Pilgrim's Rest, village de chercheurs d'or", a: "South African Tourism", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Pilgrim%27s_Rest,_Mpumalanga,_South_Africa_(20521851051).jpg" },
  bly5: { alt: "Cascade tombant dans une gorge verdoyante", cap: "Lisbon Falls", a: "South African Tourism", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Lisbon_Falls,_Mpumalanga,_South_Africa_(20522678821).jpg" },
  pri2: { alt: "Ciel de feu au-dessus de la brousse au crépuscule", cap: "Crépuscule dans le Lowveld, voisin de la réserve", a: "Dietmar Rabich", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Makalali_Game_Reserve_(ZA),_Sonnenuntergang_--_2024_--_1773.jpg" },
  pri3: { alt: "Léopard allongé sur une grosse branche", cap: "Léopard dans son arbre, Kruger", a: "amanderson2", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Leopard_looking_at_us_from_tree_Kruger_South_Africa.jpg" },
  pri1: { alt: "Léopard caché dans le feuillage", cap: "Il faut l'œil du pisteur pour le voir", a: "amanderson2", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Leopard_napping_in_a_tree_Kruger_South_Africa.jpg" },
  cen1: { alt: "Lions allongés sur une route du parc", cap: "Lions à la sieste, Kruger", a: "Entropy1963", l: "Domaine public", u: "https://commons.wikimedia.org/wiki/File:Two_lions_having_a_break_after_an_unsuccessful_hunt_in_Kruger_National_Park.jpg" },
  cen3: { alt: "Zèbres et autruches dans les herbes de la plaine", cap: "Les plaines de Satara", a: "Karen Wiebe", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Sebra_en_volstruispaar,_Satara-vlaktes,_Krugerwildtuin.jpg" },
  cen4: { alt: "Éléphante et son petit avançant vers le photographe", cap: "Éléphants du Kruger", a: "Dietmar Rabich", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Kruger_National_Park_(ZA),_Elefanten_--_2024_--_0635.jpg" },
  sud1: { alt: "Rivière Sabie avec le camp sur la rive", cap: "La rivière Sabie et le camp de Lower Sabie", a: "Bernard Dupont", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:Sabie_River_with_Lower_Sabie_Camp_(32938460450).jpg" },
  sud2: { alt: "Troupeau d'éléphants traversant la rivière", cap: "Éléphants traversant la Sabie", a: "Bernard Dupont", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:African_Elephants_(Loxodonta_africana)_crossing_Sabie_River_..._(46244899544).jpg" },
  sud3: { alt: "Rhinocéros blanc et son petit", cap: "Rhinocéros blanc et son petit", a: "Charles J. Sharp", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:White_rhinoceros_(Ceratotherium_simum)_with_calf_Kruger.jpg" },
  sud4: { alt: "Bungalow au toit de chaume dans la verdure", cap: "Un bungalow de Lower Sabie", a: "Aliwal2012", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Lower_Sabie_Bungalows_23-02-2011.jpg" },
  esw1: { alt: "Zèbres devant la forêt et les montagnes au couchant", cap: "Mlilwane, zèbres au pied des montagnes", a: "Bernard Gagnon", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Mlilwane_Wildlife_Sanctuary_02.jpg" },
  esw2: { alt: "Lac calme entouré de collines", cap: "Le lac de Mlilwane", a: "Bernard Gagnon", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Lake_in_Mlilwane_Wildlife_Sanctuary.jpg" },
  esw3: { alt: "Antilope et arbre devant une montagne", cap: "À pied dans la réserve", a: "Vaiz Ha", l: "CC BY 2.0", u: "https://commons.wikimedia.org/wiki/File:Zabras_in_Mlilwane_Wildlife_Sanctuary.jpg" },
  esw4: { alt: "Nyala femelle dans l'herbe verte", cap: "Nyala femelle", a: "Bernard Gagnon", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Nyala_(female),_Mlilwane_Wildlife_Sanctuary.jpg" },
  luc1: { alt: "Longue plage dorée au bord de l'océan Indien", cap: "La plage de Cape Vidal", a: "Ossewa", l: "CC BY-SA 4.0", u: "https://commons.wikimedia.org/wiki/File:Cape_Vidal_beach_1.jpg" },
  luc2: { alt: "Groupe d'hippopotames sur une rive", cap: "Hippopotames du lac St Lucia", a: "Bernard Dupont", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:Hippo_(Hippopotamus_amphibius)_family_resting_on_the_shores_of_Lake_St_Lucia_.._(31656974747).jpg" },
  luc3: { alt: "Estuaire aux eaux calmes", cap: "L'estuaire de St Lucia", a: "Bernard Dupont", l: "CC BY-SA 2.0", u: "https://commons.wikimedia.org/wiki/File:St._Lucia_Estuary_..._(46391239615).jpg" },
  luc4: { alt: "Hippopotames dans l'eau devant la végétation", cap: "Parc d'iSimangaliso", a: "Rialfver", l: "CC BY-SA 3.0", u: "https://commons.wikimedia.org/wiki/File:Greater_St._Lucia.jpg" },
};

const SP = "https://www.sanparks.org/reservations/accommodation/filters";
// Annulation : free = gratuite vérifiée sur Booking aux dates du voyage ; cond = conditions à confirmer avant de payer.
const ETAPES = [
  {
    fichier: "etape-1-johannesburg.html", nom: "Johannesburg", court: "Joburg", lieu: "Gauteng", couleur: "#9a5b2f",
    titre: "Atterrir en douceur", accroche: "Une première nuit à 35 minutes de l'aéroport, entre l'histoire de Mandela et les jardins de Rosebank.",
    recit: "Pas de décalage horaire, pas de correspondance intérieure : on récupère notre SUV à l'aéroport et on entre dans le voyage tranquillement. Si on arrive assez tôt, Soweto avec un guide local et le musée de l'Apartheid donnent tout de suite la profondeur du pays. Sinon, piscine, dîner tôt à l'hôtel, et on garde notre énergie pour la route du lendemain.",
    nuits: 1, debut: 2, photos: ["jnb1", "jnb2", "jnb4"], carte: [28.1, -26.1],
    jours: [
      { j: 1, t: "Envol depuis Paris", d: "Vol de nuit via Kigali. Départ 21h30, sans décalage horaire à l'arrivée." },
      { j: 2, t: "Johannesburg", k: "45 km · 35 min", d: "Atterrissage à 13h55, retrait du SUV, installation à Rosebank. Visite de Soweto possible uniquement avec une arrivée matinale (vol British Airways)." },
    ],
    savoir: ["Le soir, taxi commandé ou dîner sur place : on ne marche pas et on reste dans les quartiers du nord.", "Soweto se visite avec un guide local, c'est la condition pour que ce soit simple et chaleureux."],
    options: [
      { id: "rosebank", nom: "Southern Sun Rosebank", zone: "Rosebank", note: 8.6, avis: 6306, prix: { f1: 80, f2: 80 }, slug: "za/the-rosebank", annul: { type: "free", f1: "2027-07-18", f2: "2027-07-25" }, pitch: "Grand hôtel fiable, en plein quartier sûr et animé. L'adresse la plus simple pour une arrivée de long-courrier." },
      { id: "wantage", nom: "The Wantage Suites", zone: "Rosebank", note: 9.2, avis: 1052, prix: { f1: 56, f2: 56 }, slug: "za/the-wantage-suites", annul: { type: "free", f1: "2027-07-05", f2: "2027-07-12" }, pitch: "Suites très bien notées et le prix le plus doux de l'étape." },
      { id: "hi", nom: "Holiday Inn Rosebank", zone: "Rosebank", note: 8.6, avis: 2033, prix: { f1: 130, f2: 134 }, slug: "za/holiday-inn-johannesburg-rosebank", annul: { type: "free", f1: "2027-07-15", f2: "2027-07-22" }, pitch: "Valeur sûre internationale, à garder si on veut un cadre plus classique." },
    ],
  },
  {
    fichier: "etape-2-blyde-river-canyon.html", nom: "Blyde River Canyon", court: "Canyon", lieu: "Mpumalanga", couleur: "#6f7d3a",
    titre: "Le toit du Mpumalanga", accroche: "Des falaises rouges, des cascades et un des plus grands canyons du monde pour nous deux.",
    recit: "La route monte par les hauts plateaux, avec une pause truite et pancakes à Dullstroom et le vieux village de chercheurs d'or de Pilgrim's Rest. Le lendemain, on suit la Panorama Route quand la brume s'est levée : les Three Rondavels, les marmites de Bourke's Luck, God's Window et les chutes de Lisbon Falls. Une journée de grands paysages avant de plonger dans la brousse.",
    nuits: 2, debut: 3, photos: ["bly1", "bly3", "bly5", "bly2", "bly4"], carte: [31.13, -25.05],
    jours: [
      { j: 3, t: "La route des hauts plateaux", k: "340 km · 3h45", d: "Autoroute N4, pause à Dullstroom, Pilgrim's Rest, installation pour 2 nuits." },
      { j: 4, t: "La Panorama Route", k: "80 km · 1h45 de conduite", d: "Entre 10h et 16h pour éviter le brouillard : Three Rondavels, Bourke's Luck Potholes, God's Window, cascades et crêpes chez Harrie's." },
    ],
    savoir: ["Hazyview, en bas, est plus chaude (24–26 °C). Graskop, en haut, est au pied des belvédères (18–20 °C).", "Autour de Hazyview, on évite les portes Numbi et Phabeni et on ne roule pas à la tombée de la nuit.", "Une amende ne se paie jamais en liquide au bord de la route : on demande un PV officiel."],
    options: [
      { id: "forever", nom: "Blyde Canyon, A Forever Resort", zone: "Canyon, près des Three Rondavels", note: 7.9, avis: 2021, prix: { f1: null, f2: 125 }, slug: "za/blyde-canyon-a-forever-resort", annul: { type: "cond", txt: "Annulation gratuite proposée aux dates du voyage : date limite à lire sur Booking avant de réserver." }, pitch: "Le mieux placé de tous : au bord du canyon, tout près des Three Rondavels. Une adresse simple, moins bien notée, choisie pour son emplacement." },
      { id: "laguna", nom: "Laguna Lodge", zone: "Graskop", note: 9.4, avis: 377, prix: { f1: 148, f2: 148 }, slug: "za/laguna-lodge", annul: { type: "free", f1: "2027-06-29", f2: "2027-07-06" }, pitch: "Adresse soignée au départ immédiat de la Panorama Route." },
      { id: "pilgrims", nom: "A Pilgrims Rest Guest House", zone: "Graskop", note: 9.4, avis: 499, prix: { f1: 129, f2: 129 }, slug: "za/a-pilgrims-rest", annul: { type: "free", f1: "2027-07-06", f2: "2027-07-13" }, pitch: "Maison d'hôtes de Graskop très bien notée, à prix doux." },
      { id: "cozy", nom: "Cozy Guest", zone: "Graskop", note: 9.5, avis: 165, prix: { f1: 150, f2: 150 }, repas: "Petit-déjeuner inclus", slug: "za/cosy-guest", annul: { type: "free", f1: "2027-07-13", f2: "2027-07-20" }, pitch: "Note exceptionnelle et petit-déjeuner compris." },
      { id: "elements", nom: "The Elements", zone: "Graskop", note: 9.0, avis: 565, prix: { f1: 118, f2: null }, slug: "za/the-elements-graskop", annul: { type: "free", f1: "2027-07-06", f2: null }, pitch: "Chambres de charme dans un jardin arboré, le meilleur prix de l'étape." },
      { id: "angels", nom: "Angels View Hotel", zone: "Graskop", note: 8.9, avis: 1216, prix: { f1: 297, f2: 297 }, repas: "Petit-déjeuner inclus", slug: "za/hoyohoyo-eagles-view-eco-estate", annul: { type: "free", f1: "2027-07-13", f2: "2027-07-20" }, pitch: "Le grand spectacle : hôtel au bord de la falaise, piscine à débordement sur l'escarpement." },
      { id: "bergdale", nom: "Bergdale Cottages", zone: "Hazyview", note: 9.6, avis: 426, prix: { f1: 150, f2: 150 }, slug: "za/bergdale-cottages", annul: { type: "free", f1: "2027-06-20", f2: "2027-06-27" }, pitch: "Cottages spacieux dans un domaine vallonné et très calme, piscine et vue sur les montagnes." },
    ],
  },
  {
    fichier: "etape-3-reserve-privee.html", nom: "Réserve privée", court: "Réserve", lieu: "Greater Kruger", couleur: "#a8472a",
    titre: "48 heures avec un pisteur", accroche: "Un 4x4 ouvert, un ranger, un pisteur, et la brousse sans clôture pour le premier grand frisson.",
    recit: "Ici, on ne conduit plus. Deux sorties par jour avec ranger et pisteur, à l'aube dans le froid piquant puis au coucher du soleil, avec un verre dans la brousse et le retour au projecteur. On apprend à lire une empreinte fraîche ou l'alarme d'un babouin. C'est notre école de la brousse : quand on prendra le volant dans le Kruger, on saura enfin où regarder.",
    nuits: 2, debut: 5, photos: ["pri3", "pri2", "pri1"], carte: [31.5, -24.6],
    jours: [
      { j: 5, t: "Descente vers la brousse", k: "100 km · 1h45", d: "On descend l'escarpement, arrivée vers 13h, déjeuner, puis premier safari à 15h30 et retour de nuit au projecteur." },
      { j: 6, t: "La vraie journée safari", k: "0 km au volant", d: "06h–09h30 : sortie à l'aube. Brunch et repos en journée. 15h30 : safari du soir, apéritif en brousse, dîner autour du feu." },
    ],
    savoir: ["À l'aube, il fait 8 à 10 °C en 4x4 ouvert : bonnet, polaire et coupe-vent. L'après-midi monte à 24–26 °C.", "Prévoir les pourboires du ranger et du pisteur, environ 80 € dans le budget.", "Paludisme : zone à risque, faible en hiver austral mais pas nul. À voir avec un médecin des voyages."],
    options: [
      { id: "buffelshoek", nom: "Buffelshoek Tented Camp", zone: "Manyeleti", note: 8.9, prix: { f1: 1219, f2: 1219 }, taxe: 28, repas: "Pension complète + 2 safaris par jour, boissons en plus", slug: "za/buffelshoek-tented-camp", annul: { type: "free", f1: "2027-07-19", f2: "2027-07-26" }, pitch: "La grande surprise : le moins cher des safaris tout compris annulables, en réserve ouverte sur le Kruger." },
      { id: "motswari", nom: "Motswari African Retreat", zone: "Timbavati", note: 9.7, prix: { f1: 1919, f2: 1919 }, taxe: 124, repas: "Pension complète + 2 safaris par jour", slug: "za/african-retreat-motswari-by-newmark", annul: { type: "free", f1: "2027-07-01", f2: "2027-07-08" }, pitch: "Lodge de luxe dans la réserve des lions blancs. Le rêve, si on accepte de dépasser." },
      { id: "mohlabetsi", nom: "Mohlabetsi Safari Lodge", zone: "Balule", note: 9.7, prix: { f1: 1675, f2: 2397 }, taxe: 35, repas: "Formule à vérifier au moment de réserver", slug: "za/mohlabetsi-safari-lodge", annul: { type: "free", f1: "2027-06-22", f2: "2027-06-29" }, pitch: "Rondavels au toit de chaume, piscine et point d'eau éclairé. Bien plus cher en fin juillet." },
      { id: "pondoro", nom: "Pondoro Game Lodge", zone: "Balule", note: 9.8, prix: { f1: 2242, f2: 2242 }, taxe: 54, repas: "Pension complète, safaris et marches inclus", slug: "za/pondoro-game-lodge", annul: { type: "free", f1: "2027-06-22", f2: "2027-06-29" }, pitch: "Coup de cœur du Routard : chalets sur la rivière Olifants, jacuzzi privé, table réputée." },
      { id: "shindzela", nom: "Shindzela Tented Camp", zone: "Timbavati", prix: { f1: 1390, f2: 1390 }, repas: "Pension complète + 4 safaris, taxes incluses", direct: "https://www.shindzela.co.za/", annul: { type: "cond", txt: "Pas de tarif sur Booking à ces dates. Selon un site tiers, acompte remboursé à plus d'un mois : à confirmer par écrit." }, pitch: "Tentes sur pilotis, ambiance brousse authentique, réputé pour ses guides." },
      { id: "pungwe", nom: "Pungwe Bush Camp", zone: "Manyeleti", prix: { f1: 1420, f2: 1420 }, repas: "Pension complète + 4 safaris, taxes incluses", direct: "https://www.pungwe.co.za/", annul: { type: "cond", txt: "Pas de tarif sur Booking à ces dates. Sources contradictoires (60 ou 30 jours) : à demander par écrit." }, pitch: "4 tentes seulement, cité par le Routard, grand accent sur le pistage." },
    ],
  },
  {
    fichier: "etape-4-kruger-centre.html", nom: "Kruger Centre", court: "Satara", lieu: "Parc national Kruger", couleur: "#c08a2c",
    titre: "Au volant, chez les lions", accroche: "Notre voiture, des pistes infinies et les plaines où rôdent les grands félins.",
    recit: "On entre par Orpen Gate et le parc devient notre terrain de jeu, à 25 km/h, vitres ouvertes. Satara est entouré des pâturages qui attirent les fauves : à l'aube, la mythique piste S100 et le belvédère de N'Wamanzi. Aux heures chaudes, piscine et sieste pendant que les animaux dorment à l'ombre. Le soir, sortie guidée au coucher du soleil puis retour de nuit, quand plus aucune voiture n'a le droit de circuler.",
    nuits: 2, debut: 7, photos: ["cen3", "cen1", "cen4", "cen2"], carte: [31.78, -24.4],
    jours: [
      { j: 7, t: "Entrée par Orpen Gate", k: "75 à 110 km · 2h30–3h30", d: "Dernier safari matinal et brunch au lodge, puis entrée dans le parc et route lente jusqu'à Satara." },
      { j: 8, t: "Le pays des fauves", k: "~85 km sur les pistes", d: "Aube sur la S100, belvédère de N'Wamanzi, piscine de 11h à 15h, Sunset Drive SANParks (~28 € par personne)." },
    ],
    savoir: ["Les portes des camps ferment à 17h30 en juillet, 18h en août. On prévoit large.", "Option à regarder : une nuit à Olifants, le camp perché que le Routard préfère, à 1h45 au nord de Satara.", "Disponibilités à vérifier directement sur SANParks, qui ne passe pas par Booking."],
    options: [
      { id: "bd2v", nom: "Bungalow BD2V", zone: "Satara, face à la brousse", prix: { f1: 254, f2: 254 }, repas: "Kitchenette, sans repas", direct: SP, annul: { type: "sanparks" }, pitch: "En bordure de clôture, face à la brousse et au point d'eau éclairé la nuit. 19 € de plus seulement." },
      { id: "bd2", nom: "Bungalow BD2 ou BD3B", zone: "Satara", prix: { f1: 235, f2: 235 }, repas: "Kitchenette, sans repas", direct: SP, annul: { type: "sanparks" }, pitch: "Bungalow climatisé autour des pelouses, kitchenette et barbecue." },
    ],
  },
  {
    fichier: "etape-5-kruger-sud.html", nom: "Kruger Sud", court: "Lower Sabie", lieu: "Parc national Kruger", couleur: "#b56f22",
    titre: "Au fil de la rivière Sabie", accroche: "Un deck sur l'eau, les hippos à portée de vue et, à l'aube, la brousse à pied.",
    recit: "On descend par Tshokwane, un des secteurs les plus généreux en lions selon le Routard, jusqu'à la rivière Sabie. Lower Sabie est l'un des plus beaux camps du parc : vastes pelouses, grands arbres et piscine. À l'aube, une marche de trois heures avec deux rangers armés. Le soir, notre propre braai sur la terrasse, de la bonne viande achetée à la boutique et les bruits de la nuit africaine.",
    nuits: 2, debut: 9, photos: ["sud2", "sud1", "sud3", "sud4"], carte: [31.92, -25.12],
    jours: [
      { j: 9, t: "La grande descente", k: "95 km · 3h30–4h de safari", d: "Pause pique-nique à Tshokwane, plaines à herbivores, installation face à la rivière." },
      { j: 10, t: "À pied dans la brousse", k: "~80 km sur les pistes", d: "05h30 : Guided Morning Walk (~33 € par personne). Pause au bungalow, puis route H4-1 le long de la rivière et dernier safari au coucher du soleil." },
    ],
    savoir: ["Le restaurant est moyen selon le Routard : on préfère la cuisinette et le braai du bungalow.", "Les ~15 unités face à la rivière partent très vite : on vérifie dès aujourd'hui.", "Plans B avec piscine si c'est complet : Skukuza ou Berg-en-Dal."],
    options: [
      { id: "bd2u", nom: "Bungalow BD2U ou BD3U", zone: "Lower Sabie, vue rivière", prix: { f1: 266, f2: 266 }, repas: "Kitchenette, sans repas", direct: SP, annul: { type: "sanparks" }, pitch: "Le premier rang sur la rivière, les plus demandés du camp. Le petit luxe qui vaut 40 €." },
      { id: "bd3", nom: "Bungalow BD3 ou BD2Z", zone: "Lower Sabie", prix: { f1: 226, f2: 226 }, repas: "Kitchenette, sans repas", direct: SP, annul: { type: "sanparks" }, pitch: "Climatisé, kitchenette sur la véranda, salle de bain privée." },
      { id: "bd2r", nom: "Bungalow BD2 rénové", zone: "Lower Sabie", prix: { f1: 267, f2: 267 }, repas: "Kitchenette, sans repas", direct: SP, annul: { type: "sanparks" }, pitch: "Bungalow rénové, 2 lits, kitchenette." },
    ],
  },
  {
    fichier: "etape-6-eswatini.html", nom: "Eswatini", court: "Eswatini", lieu: "Royaume d'Eswatini", couleur: "#3e6b4f",
    titre: "Le royaume où l'on marche", accroche: "Après les fauves, la grasse matinée et une journée entière à pied ou à VTT parmi les zèbres.",
    recit: "On passe une frontière pour changer de monde. Dans le sanctuaire de Mlilwane, ni lions ni éléphants : on peut enfin descendre de voiture et marcher en liberté au milieu des zèbres, des nyalas et des phacochères. Une journée sans réveil ni volant, une randonnée jusqu'à Execution Rock ou une balade à VTT, puis la piscine. Le repos dont on aura besoin après six jours de safari.",
    nuits: 2, debut: 11, photos: ["esw1", "esw2", "esw3", "esw4"], carte: [31.2, -26.47],
    jours: [
      { j: 11, t: "Passage de frontière", k: "210 km · 3h30", d: "Safari matinal vers Crocodile Bridge et ses rhinocéros, passage à Jeppes Reef et route de montagne via Piggs Peak." },
      { j: 12, t: "Zéro voiture", k: "0 km", d: "Grasse matinée, marche vers Execution Rock ou VTT au milieu des antilopes, après-midi piscine et artisanat swazi." },
    ],
    savoir: ["Demander au loueur la lettre d'autorisation de sortie du véhicule (incluse dans le budget).", "Ralentisseurs non peints, piétons et bétail : pas de conduite après 17h30.", "Taxe routière d'environ 100 ZAR à l'entrée."],
    options: [
      { id: "reilly", nom: "Reilly's Rock Hilltop Lodge", zone: "Au cœur de Mlilwane", note: 8.8, avis: 206, prix: { f1: 380, f2: 355 }, repas: "Demi-pension d'après notre relevé, à reconfirmer", slug: "sz/reilly-39-s-rock-hilltop-lodge", annul: { type: "free", f1: "2027-07-14", f2: "2027-07-21" }, pitch: "Le coup de cœur : maison coloniale sur une colline, jardin botanique peuplé d'antilopes, sentiers au départ du lodge." },
      { id: "damicha", nom: "Damicha Boutique Lodge", zone: "Vallée d'Ezulwini", note: 8.7, avis: 514, prix: { f1: 172, f2: 172 }, slug: "sz/damicha-lodge", annul: { type: "free", f1: "2027-07-14", f2: "2027-07-21" }, pitch: "Boutique-lodge contemporain avec piscine, à 10 minutes de l'entrée de Mlilwane." },
      { id: "mvubu", nom: "Mvubu Falls Lodge", zone: "Lobamba", note: 9.0, avis: 39, prix: { f1: 166, f2: 166 }, repas: "Petit-déjeuner inclus", slug: "sz/mvubu-falls-lodge-lobamba", annul: { type: "free", f1: "2027-07-27", f2: "2027-08-03" }, pitch: "Au bord d'une cascade, annulable jusqu'à la veille de l'arrivée ou presque." },
    ],
  },
  {
    fichier: "etape-7-st-lucia.html", nom: "St Lucia", court: "St Lucia", lieu: "KwaZulu-Natal", couleur: "#2f7a8a",
    titre: "Le final sur l'océan Indien", accroche: "Du sable chaud, des hippos sur l'estuaire et des baleines depuis les dunes pour finir en beauté.",
    recit: "La route descend vers la chaleur du KwaZulu-Natal. À Cape Vidal, une longue plage sauvage, une eau à 21–22 °C, et en pleine saison de migration, les baleines à bosse se voient depuis les dunes aux jumelles. L'après-midi, deux heures de croisière sur une eau de miroir, entre 800 hippopotames et 1 000 crocodiles. Le soir, poisson grillé. Il faudra prendre la voiture même pour 300 mètres : la nuit, les rues appartiennent aux hippos.",
    nuits: 2, debut: 13, photos: ["luc1", "luc2", "luc3", "luc4"], carte: [32.41, -28.37],
    jours: [
      { j: 13, t: "Vers l'océan", k: "330 km · 4h15", d: "Sortie d'Eswatini à Lavumisa, autoroute N2 dans le KwaZulu-Natal, arrivée vers 15h30." },
      { j: 14, t: "Cape Vidal et les hippos", k: "60 km aller-retour", d: "Plage et baleines depuis les dunes le matin, croisière de 2h sur l'estuaire à 15h. Sortie en mer en option si l'océan est calme (+185 € à deux)." },
      { j: 15, t: "Retour depuis Durban", k: "215 km · 2h15", d: "Autoroute N2 jusqu'à l'aéroport King Shaka, sans traverser Durban. Vol Ethiopian à 14h15, Paris le lendemain matin." },
    ],
    savoir: ["La nuit, on ne marche jamais dans St Lucia : hippopotames dans les rues.", "On décide de la sortie baleines sur place, selon la houle. Rien à réserver avant.", "Sur le parking, 5 à 10 ZAR pour les gardiens officiels en gilet."],
    options: [
      { id: "leopardtree", nom: "Leopard Tree Lodge", zone: "St Lucia", note: 9.7, avis: 737, prix: { f1: 184, f2: 175 }, slug: "za/lalapanzi-guest-house-st-lucia", annul: { type: "free", f1: "2027-07-09", f2: "2027-07-16" }, pitch: "À 750 m de la plage, piscine dans un jardin où passent phacochères et petites antilopes." },
      { id: "ambience", nom: "African Ambience Guest House", zone: "St Lucia", note: 9.6, avis: 352, prix: { f1: 168, f2: 168 }, repas: "Petit-déjeuner inclus", slug: "za/africanambience-guesthouse", annul: { type: "free", f1: "2027-06-30", f2: "2027-07-07" }, pitch: "Note exceptionnelle et petit-déjeuner compris, pour un prix très doux." },
      { id: "ndiza", nom: "Ndiza Lodge and Cabanas", zone: "St Lucia", note: 9.3, avis: 537, prix: { f1: 185, f2: 195 }, slug: "za/ndiza-lodge-and-cabanas", annul: { type: "free", f1: "2027-07-09", f2: "2027-07-16" }, pitch: "2 piscines et terrasse panoramique sur l'océan et l'embouchure de l'estuaire." },
      { id: "corner", nom: "Leopard Corner Lodge", zone: "St Lucia", note: 9.6, avis: 1051, prix: { f1: 246, f2: 221 }, repas: "Petit-déjeuner inclus", slug: "za/leopard-corner", annul: { type: "free", f1: "2027-07-09", f2: "2027-07-16" }, pitch: "Guesthouse très soignée avec piscine, à 800 m de la plage." },
      { id: "dreamz", nom: "African-Dreamz Guest House", zone: "St Lucia", note: 9.0, avis: 291, prix: { f1: 142, f2: 142 }, slug: "za/african-dreamz-guest-house", annul: { type: "free", f1: "2027-07-23", f2: "2027-07-30" }, pitch: "Le moins cher de la sélection, annulable le plus tard." },
    ],
  },
];
