// Données du carnet : source unique du site.
// Prix Booking relevés le 31 octobre 2026 ; lodges privés, Eswatini et St Lucia relevés sur NightsBridge et ResRequest le 11 novembre 2026, relus le 12.
// Référence complète : ../2027-afrique-du-sud.md
const RELEVE = "11 novembre 2026";
const OBJECTIF = 7000;

const FENETRES = {
  f2: { label: "25 juil. → 9 août", depart: "2027-07-25", court: "Fin juillet", atout: "Les safaris sont terminés avant le pont férié du 6 au 9 août, qu'on passe au bord de l'océan." },
  // Fenêtre du 18 juillet retirée le 1er novembre 2026. Pour la réactiver, remettre cette ligne : les prix f1 sont conservés.
  // f1: { label: "18 juil. → 2 août", depart: "2027-07-18", court: "Mi-juillet", atout: "On arrive pile à la rentrée scolaire sud-africaine, une semaine entière avant le pont du 9 août." },
};

// Postes hors logement, repris du budget consolidé de la fiche.
const FIXES = [
  { poste: "Vols Paris → Johannesburg + Durban → Paris", detail: "RwandAir 525 € + Emirates 582 € par personne (relevé du 31 octobre 2026), zéro vol intérieur", prix: 2214 },
  { poste: "Trajet jusqu'à Paris CDG", detail: "Train ou voiture, pour deux", prix: 200 },
  { poste: "SUV automatique, essence, péages", voiture: true },
  { poste: "Droits d'entrée du Kruger", detail: "4 jours à 692 ZAR par adulte", prix: 300 },
  { poste: "Activités et visites", detail: "Soweto, Panorama Route, marche et sortie du soir au Kruger, Mlilwane, Hluhluwe-iMfolozi, Cape Vidal, croisière hippos", prix: 422 },
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
      { id: "rosebank", nom: "Southern Sun Rosebank", zone: "Rosebank", note: 8.6, avis: 6306, prix: { f1: 80, f2: 80 }, slug: "za/the-rosebank", retours: "Juillet 2026 : 9,0/10, sur 2 avis seulement. Plusieurs notes basses en octobre 2026, à revérifier avant le départ.", annul: { type: "free", f1: "2027-07-18", f2: "2027-07-25" }, pitch: "Grand hôtel fiable, en plein quartier sûr et animé. L'adresse la plus simple pour une arrivée de long-courrier." },
      { id: "wantage", nom: "The Wantage Suites", zone: "Rosebank", note: 9.2, avis: 1052, prix: { f1: 56, f2: 56 }, slug: "za/the-wantage-suites", retours: "Moyenne de 8,9 sur 40 avis récents, mais 7,3 sur les 3 avis de juillet 2026 et un problème de propreté signalé en septembre.", annul: { type: "free", f1: "2027-07-05", f2: "2027-07-12" }, pitch: "Suites très bien notées et le prix le plus doux de l'étape." },
      { id: "hi", nom: "Holiday Inn Rosebank", zone: "Rosebank", note: 8.6, avis: 2033, prix: { f1: 130, f2: 134 }, slug: "za/holiday-inn-johannesburg-rosebank", annul: { type: "free", f1: "2027-07-15", f2: "2027-07-22" }, pitch: "Valeur sûre internationale, à garder si on veut un cadre plus classique." },
    ],
  },
  {
    fichier: "etape-2-blyde-river-canyon.html", nom: "Blyde River Canyon", court: "Canyon", lieu: "Mpumalanga", couleur: "#6f7d3a",
    titre: "Le toit du Mpumalanga", accroche: "Des falaises rouges, des cascades et un des plus grands canyons du monde pour nous deux.",
    recit: "La route monte par les hauts plateaux, avec une pause truite et pancakes à Dullstroom et le vieux village de chercheurs d'or de Pilgrim's Rest. Le lendemain, on suit la Panorama Route quand la brume s'est levée : les Three Rondavels, les marmites de Bourke's Luck, God's Window et les chutes de Lisbon Falls. Une journée de grands paysages avant de plonger dans la brousse.",
    nuits: 2, debut: 3, photos: ["bly1", "bly3", "bly5", "bly2", "bly4"], carte: [30.77, -24.58],
    jours: [
      { j: 3, t: "La route des hauts plateaux", k: "~410 km · 5h30 hors pauses", d: "Autoroute N4, pause à Dullstroom, Pilgrim's Rest, installation pour 2 nuits." },
      { j: 4, t: "La Panorama Route", k: "~100 km · 1h40 de conduite", d: "Entre 10h et 16h pour éviter le brouillard : Three Rondavels, Bourke's Luck Potholes, God's Window, cascades et crêpes chez Harrie's." },
    ],
    savoir: ["Hazyview, en bas, est plus chaude (24–26 °C). Graskop, en haut, est au pied des belvédères (18–20 °C).", "Autour de Hazyview, on évite les portes Numbi et Phabeni et on ne roule pas à la tombée de la nuit.", "Une amende ne se paie jamais en liquide au bord de la route : on demande un PV officiel."],
    options: [
      { id: "forever", nom: "Blyde Canyon Forever Resort, tente", zone: "Canyon, près des Three Rondavels", note: 7.9, avis: 2021, prix: { f1: null, f2: 125 }, slug: "za/blyde-canyon-a-forever-resort", annul: { type: "free", f1: null, f2: "2027-06-27" }, retours: "Juillet 2026 : 7,6/10 sur 5 avis. L'emplacement est unanimement salué, mais le confort est jugé daté. Restauration critiquée en septembre et octobre 2026, gare aux babouins.", pitch: "Le mieux placé de tous : une tente de luxe au bord du canyon. Une adresse simple, choisie pour son emplacement." },
      { id: "forever-chalet", nom: "Blyde Canyon Forever Resort, chalet", zone: "Canyon, près des Three Rondavels", note: 7.9, avis: 2021, prix: { f1: null, f2: 191 }, repas: "Kitchenette, sans repas", slug: "za/blyde-canyon-a-forever-resort", annul: { type: "free", f1: null, f2: "2027-06-27" }, pitch: "Le même emplacement dans un chalet en dur, plus rassurant pour les nuits fraîches de juillet." },
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
      { j: 5, t: "Descente vers la brousse", k: "~150 km · 2h45 jusqu'à Orpen, plus ~45 min de piste", d: "Départ de Forever Resort avant 09h pour arriver au camp vers 12h30, déjeuner, installation, puis premier safari à 15h30 et retour de nuit au projecteur." },
      { j: 6, t: "La vraie journée safari", k: "0 km au volant", d: "06h–09h30 : sortie à l'aube. Brunch et piscine ou repos de 11h à 15h. 15h30 : safari du soir, apéritif en brousse, dîner autour du feu." },
    ],
    savoir: [
      "Audit temps réel du 11/11/2026 : Shindzela Tented Camp (1 390 €) est désormais 100 % complet les 29–31 juillet 2027 (0 tente libre sur 8), ainsi qu'Elephant Plains et Inyati.",
      "Notre choix, retenu le 12 novembre 2026 : la suite Premium de Ndzhaka Tented Camp (Manyeleti, 1 864 € tout compris, piscine privée chauffée), aux dates prévues du 29 au 31 juillet. Rien n'est encore réservé : faire confirmer par écrit l'annulation gratuite jusqu'à J-14 avant de payer.",
      "Variante « Swap » (mêmes vols) : faire Satara d'abord (29–31 juil.) puis la réserve privée les 31 juil.–2 août débloque la tente Standard de Ndzhaka (1 540 €) ou nThambo à Klaserie (1 726 €) ; finir à Sabi Sand les 2–4 août débloque Umkumbe Bush Lodge (1 916 €). Contreparties : environ 100 km et 2h de route en plus, on renonce à apprendre le pistage avec un ranger avant de conduire seuls, et les camps SANParks restent à vérifier à ces dates. Les options marquées « Swap » ci-dessous changent le budget, pas les dates affichées des étapes.",
      "Ce qu'on achète ici : le hors-piste pour suivre un léopard dans les buissons et la limite de 2 véhicules par scène.",
      "Prévoir les pourboires du ranger et du pisteur, environ 80 € dans le budget. Paludisme : risque faible en hiver austral mais pas nul, à voir avec un médecin.",
    ],
    options: [
      { id: "ndzhaka-prem", nom: "Ndzhaka Tented Camp · Suite Premium", zone: "Manyeleti (23 000 ha · Ouvert Kruger/Sabi Sand)", prix: { f1: 1836, f2: 1836 }, taxe: 28, repas: "All Inclusive (pension complète + boissons locales + 4 safaris hors-piste)", direct: "https://book.nightsbridge.com/39657", retours: "Disponible du 29 au 31 juillet, recontrôlé le 12/11/2026. Le descriptif officiel NightsBridge confirme une piscine privée chauffée sur le deck, salle de bain intérieure et boma privé.", annul: { type: "free", f1: "2027-07-08", f2: "2027-07-15", txt: "Annulation gratuite jusqu'à J-14 en réservant en direct sur NightsBridge (contre non-remboursable sur Booking)." }, pitch: "Notre choix, retenu le 12 novembre 2026 (29–31 juil.) : piscine privée chauffée, boissons comprises et pistage hors-piste entre Sabi Sand et Timbavati." },
      { id: "ndzhaka-std", nom: "Ndzhaka Tented Camp · Tente Standard (Swap J7–J8)", zone: "Manyeleti (23 000 ha · En inversant avec Satara : 31 juil.–2 août)", prix: { f1: null, f2: 1512 }, taxe: 28, repas: "All Inclusive (pension complète + boissons locales + 4 safaris hors-piste)", direct: "https://book.nightsbridge.com/39657", retours: "Complète les 29–31 juil., mais 3 tentes Standard disponibles les 31 juil.–2 août (et 2–4 août) en faisant Satara d'abord (zéro détour routier).", annul: { type: "free", f1: "2027-07-08", f2: "2027-07-17", txt: "Annulation gratuite jusqu'à J-14 sur NightsBridge. Économie de 324 € par rapport à la suite Premium." }, pitch: "L'astuce budget malin (31 juil.–2 août) : tout le confort de Ndzhaka en All Inclusive (boissons incluses) pour 1 540 € TTC, sans la piscine privée." },
      { id: "nthambo", nom: "nThambo Tree Camp (Swap J7–J8)", zone: "Klaserie (60 000 ha · 31 juil.–2 août)", prix: { f1: 1605, f2: 1605 }, taxe: 121, repas: "Pension complète + 4 safaris hors-piste", direct: "https://book.nightsbridge.com/17789", retours: "Complet les 29–31 juil., mais 1 cabane libre les 31 juil.–2 août (Chalet 2). Les 2–4 août sont écartés : trop loin de Lower Sabie et de l'Eswatini. Groupe Sun Destinations (cousin de Shindzela).", annul: { type: "cond", txt: "Réservation en direct sur NightsBridge. Conditions d'annulation Sun Destinations à confirmer (acompte 30 %)." }, pitch: "L'esprit Shindzela dans Klaserie : seulement 5 cabanes en bois sur pilotis face à la plaine et au point d'eau, avec petite piscine au camp." },
      { id: "umkumbe", nom: "Umkumbe Safari Lodge Riverside · Leopard Suite", zone: "Sabi Sand (65 000 ha)", prix: { f1: null, f2: 1900 }, taxe: 150, repas: "Pension complète + 4 safaris hors-piste (Suite Superior)", direct: "https://sundestinations.resrequest.com/reservation.php", retours: "Attention : au 11/11/2026, toutes les chambres Standard (1 760 €) sont prises le 30/07. Il ne reste plus qu'UNE SEULE suite (Leopard Suite à 2 050 € TTC) les 29–31 juil. ! (Chambres Standard encore libres à 1 760 € TTC les 27–29 juil. en inversant avec le Canyon).", annul: { type: "cond", txt: "Ultime chambre disponible les 29–31 juillet sur ResRequest. À bloquer immédiatement si retenu." }, pitch: "Le vrai lodge en dur climatisé avec piscine face à la rivière Sand, au cœur du mythique Sabi Sand (dernière suite disponible les 29–31 juil.)." },
      { id: "umkumbe-bush", nom: "Umkumbe Bush Lodge · Luxury Tent (Climax J9–J10)", zone: "Sabi Sand (65 000 ha · En fin de safari : 2–4 août)", prix: { f1: 1766, f2: 1766 }, taxe: 150, repas: "Pension complète + 4 safaris hors-piste", direct: "https://book.nightsbridge.com/32668", retours: "Les 2–4 août (après Lower Sabie), il reste 1 Leadwood Luxury Tent à 1 916 € TTC ! (Sur 29–31 juil., il ne reste qu'une tente Superior Wild Fig à 2 485 € TTC).", annul: { type: "cond", txt: "Annulable jusqu'à J-31 sur NightsBridge (retenue de 10 % de frais administratifs)." }, pitch: "Pour finir le safari en apothéose à Sabi Sand (2–4 août) dans un camp de tentes de luxe contemporaines avec piscine." },
      { id: "pungwe", nom: "Pungwe Bush Camp", zone: "Manyeleti (23 000 ha)", prix: { f1: 1395, f2: 1395 }, taxe: 28, repas: "Pension complète + 4 safaris hors-piste", direct: "https://www.pungwe.co.za/", retours: "4 grandes tentes Meru sous toit de chaume (8 hôtes max dans tout le camp). Tarif 2027 officiel : 6 450 ZAR/pers./nuit. Sans piscine ni prise en tente.", annul: { type: "cond", txt: "Disponibilité sur demande directe par mail (pungwe.co.za)." }, pitch: "La pépite ultra-intimiste citée par le Routard : 4 tentes seulement et un grand accent sur le pistage et la marche." },
      { id: "bateleur", nom: "Bateleur Safari Camp (Swap J7–J8)", zone: "Timbavati (53 000 ha · 31 juil.–2 août)", prix: { f1: 1951, f2: 1951 }, taxe: 159, repas: "Pension complète + safaris hors-piste et marches", direct: "https://book.nightsbridge.com/19819", retours: "Complet les 29–31 juil., mais 1 dernière chambre Double disponible les 31 juil.–2 août (et 22–24 juil.). Très réputé pour la qualité de ses guides à Timbavati, avec piscine.", annul: { type: "free", f1: "2027-07-08", f2: "2027-07-17", txt: "Annulation gratuite jusqu'à J-14 en direct sur NightsBridge." }, pitch: "Une superbe adresse intimiste au cœur de Timbavati avec piscine et annulation gratuite à J-14 (en décalant au 31 juil.–2 août)." },
      { id: "buffelshoek", nom: "Buffelshoek Tented Camp", zone: "Manyeleti (23 000 ha)", note: 8.9, prix: { f1: 1219, f2: 1219 }, taxe: 28, repas: "Pension complète + 2 safaris par jour, boissons en plus", slug: "za/buffelshoek-tented-camp", retours: "Juillet 2026 : 9,4/10 sur 9 avis, guides et safaris très salués. Mais confort très rustique : pas de piscine, tentes vieillissantes sans prise électrique ni verrou.", annul: { type: "free", f1: "2027-07-19", f2: "2027-07-26" }, pitch: "Le filet de sécurité 100 % annulable sur Booking : le moins cher, mais uniquement si l'on accepte un confort très roots sans piscine." },
      { id: "motswari", nom: "Motswari African Retreat", zone: "Timbavati (53 000 ha)", note: 9.7, prix: { f1: 1919, f2: 1919 }, taxe: 124, repas: "Pension complète + 2 safaris par jour", slug: "za/african-retreat-motswari-by-newmark", retours: "Bungalows ronds climatisés en dur, piscine et immense concession au cœur de Timbavati.", annul: { type: "free", f1: "2027-07-01", f2: "2027-07-08" }, pitch: "Le lodge 4★ en dur annulable sur Booking à Timbavati : le grand confort avec murs et piscine." },
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
    savoir: ["Les portes des camps ferment à 17h30 en juillet, 18h en août. On prévoit large.", "Option à regarder : une nuit à Olifants, le camp perché que le Routard préfère, à 1h45 au nord de Satara.", "Disponibilités relevées sur SANParks le 12 novembre 2026 : des bungalows sont libres nos deux nuits, sauf le BD2V face à la brousse, complet le 1er août."],
    options: [
      { id: "bd2", nom: "Bungalow BD2, BD2N ou BD2EC", zone: "Satara", prix: { f1: 235, f2: 240 }, repas: "Plaque de cuisson et frigo, sans repas", direct: SP, retours: "Relevé SANParks du 12/11/2026 : libre les deux nuits (BD2 : 12 unités le 31 juillet, 2 le 1er août ; BD2N : 2 puis 5 ; BD2EC : 3 puis 4). Prix affiché pour un BD2 du 31 juillet au 2 août : 4 437 ZAR, remise web et taxe communautaire comprises.", annul: { type: "sanparks" }, pitch: "Notre choix : bungalow climatisé autour des pelouses, kitchenette et barbecue, libre nos deux nuits. À réserver vite." },
      { id: "bd2v", nom: "Bungalow BD2V", zone: "Satara, face à la brousse", prix: { f1: 254, f2: 254 }, repas: "Kitchenette, sans repas", direct: SP, retours: "Relevé SANParks du 12/11/2026 : libre le 31 juillet seulement (2 unités), plus rien le 1er août. À surveiller en cas d'annulation.", annul: { type: "sanparks" }, pitch: "En bordure de clôture, face à la brousse et au point d'eau éclairé la nuit. Complet pour notre 2ᵉ nuit à ce jour." },
    ],
  },
  {
    fichier: "etape-5-kruger-sud.html", nom: "Kruger Sud", court: "Lower Sabie", lieu: "Parc national Kruger", couleur: "#b56f22",
    titre: "Au fil de la rivière Sabie", accroche: "Un deck sur l'eau, les hippos à portée de vue et, à l'aube, la brousse à pied.",
    recit: "On descend par Tshokwane, un des secteurs les plus généreux en lions selon le Routard, jusqu'à la rivière Sabie. Lower Sabie est l'un des plus beaux camps du parc : vastes pelouses, grands arbres et piscine. À l'aube, une marche de trois heures avec deux rangers armés. Le soir, notre propre braai sur la terrasse, de la bonne viande achetée à la boutique et les bruits de la nuit africaine. La seconde nuit, on remonte la rivière jusqu'à Skukuza, le camp historique du parc.",
    nuits: 2, debut: 9, photos: ["sud2", "sud1", "sud3", "sud4"], carte: [31.92, -25.12],
    jours: [
      { j: 9, t: "La grande descente", k: "95 km · 3h30–4h de safari", d: "Pause pique-nique à Tshokwane, plaines à herbivores, installation face à la rivière." },
      { j: 10, t: "À pied dans la brousse, puis Skukuza", k: "~45 km le long de la rivière", d: "05h30 : Guided Morning Walk à Lower Sabie (~33 € par personne). Puis route H4-1 le long de la rivière Sabie jusqu'à Skukuza, installation et dernier safari au coucher du soleil." },
    ],
    savoir: ["Le restaurant est moyen selon le Routard : on préfère la cuisinette et le braai du bungalow.", "Relevé SANParks du 12 novembre 2026 : à Lower Sabie, des bungalows sont libres le 2 août (dont 4 BD2U vue rivière), mais le 3 août il ne reste que des huttes à sanitaires communs.", "Décision du 12 novembre 2026 : 1 nuit à Lower Sabie le 2 août, puis 1 nuit à Skukuza le 3 août, où des bungalows BE2 sont libres. Le départ vers l'Eswatini se fait donc de Skukuza, par Malelane Gate.", "SANParks demande le paiement intégral par carte à la réservation. Ses conditions annoncent 25 % de frais d'annulation entre 15 et 30 jours avant l'arrivée, 50 % entre 7 et 14 jours, 100 % à 6 jours ou moins."],
    options: [
      { id: "bd2u", nom: "BD2U à Lower Sabie, puis BE2 à Skukuza", zone: "Lower Sabie vue rivière (2 août) · Skukuza (3 août)", prix: { f1: 266, f2: 242 }, repas: "Kitchenette à Lower Sabie, cuisine commune à Skukuza, sans repas", direct: SP, retours: "Relevé SANParks du 12/11/2026 : 4 BD2U libres le 2 août à Lower Sabie (2 523 ZAR la nuit), 9 BE2 libres le 3 août à Skukuza (1 949 ZAR la nuit, 2 lits simples, climatisé, salle d'eau privée). Remise web et taxe communautaire comprises.", annul: { type: "sanparks" }, pitch: "Notre choix : le premier rang sur la rivière pour une nuit, puis un bungalow à Skukuza, faute de bungalow libre à Lower Sabie le 3 août." },
      { id: "bd3", nom: "Bungalow BD3 ou BD2Z (2 nuits)", zone: "Lower Sabie", prix: { f1: 226, f2: 226 }, repas: "Kitchenette, sans repas", direct: SP, retours: "Relevé SANParks du 12/11/2026 : aucun bungalow libre à Lower Sabie le 3 août. Possible seulement en cas d'annulation.", annul: { type: "sanparks" }, pitch: "Climatisé, kitchenette sur la véranda, salle de bain privée." },
      { id: "bd2r", nom: "Bungalow BD2 rénové (2 nuits)", zone: "Lower Sabie", prix: { f1: 267, f2: 267 }, repas: "Kitchenette, sans repas", direct: SP, retours: "Relevé SANParks du 12/11/2026 : 3 BD2 libres le 2 août, aucun le 3 août. Possible seulement en cas d'annulation.", annul: { type: "sanparks" }, pitch: "Bungalow rénové, 2 lits, kitchenette." },
    ],
  },
  {
    fichier: "etape-6-eswatini.html", nom: "Eswatini", court: "Eswatini", lieu: "Royaume d'Eswatini", couleur: "#3e6b4f",
    titre: "Le royaume où l'on marche", accroche: "Après les fauves, la grasse matinée et une journée entière à pied ou à VTT parmi les zèbres.",
    recit: "On passe une frontière pour changer de monde. Dans le sanctuaire de Mlilwane, ni lions ni éléphants : on peut enfin descendre de voiture et marcher en liberté au milieu des zèbres, des nyalas et des phacochères. Une journée sans réveil ni volant, une randonnée jusqu'à Execution Rock ou une balade à VTT, puis la piscine. Le repos dont on aura besoin après six jours de safari.",
    nuits: 2, debut: 11, photos: ["esw1", "esw2", "esw3", "esw4"], carte: [31.2, -26.47],
    jours: [
      { j: 11, t: "Passage de frontière", k: "~236 km · 4h30 hors frontière", d: "Départ tôt de Skukuza, dernier safari jusqu'à Malelane Gate (63 km dans le parc), passage à Jeppes Reef et route de montagne via Piggs Peak. Calcul OSRM du 12 novembre 2026, attente à la frontière en plus." },
      { j: 12, t: "Zéro voiture", k: "0 km", d: "Grasse matinée, marche vers Execution Rock ou VTT au milieu des antilopes, après-midi piscine et artisanat swazi." },
    ],
    savoir: ["Demander au loueur la lettre d'autorisation de sortie du véhicule (incluse dans le budget).", "Ralentisseurs non peints, piétons et bétail : pas de conduite après 17h30.", "Taxe routière d'environ 100 ZAR à l'entrée."],
    options: [
      { id: "reilly", nom: "Reilly's Rock Hilltop Lodge", zone: "Au cœur de Mlilwane", note: 8.8, avis: 206, prix: { f1: 382, f2: 358 }, repas: "Demi-pension confirmée (dîners + petits-déjeuners inclus, 6 620 ZAR)", slug: "sz/reilly-39-s-rock-hilltop-lodge", retours: "Audit du 11/11/2026 : Mlilwane Rest Camp et Mantenga Lodge sont déjà complets sur 4–6 août ! Il ne reste plus que 4 chambres à Reilly's Rock (réservable aussi en direct sur book.nightsbridge.com/15495).", annul: { type: "free", f1: "2027-07-14", f2: "2027-07-21" }, pitch: "Le coup de cœur : maison coloniale sur une colline, jardin botanique peuplé d'antilopes, sentiers au départ du lodge. À réserver vite (4 chambres restantes)." },
      { id: "damicha", nom: "Damicha Boutique Lodge", zone: "Vallée d'Ezulwini", note: 8.7, avis: 514, prix: { f1: 172, f2: 172 }, slug: "sz/damicha-lodge", annul: { type: "free", f1: "2027-07-14", f2: "2027-07-21" }, pitch: "Boutique-lodge contemporain avec piscine, à 10 minutes de l'entrée de Mlilwane." },
      { id: "mvubu", nom: "Mvubu Falls Lodge", zone: "Lobamba", note: 9.0, avis: 39, prix: { f1: 166, f2: 166 }, repas: "Petit-déjeuner inclus", slug: "sz/mvubu-falls-lodge-lobamba", annul: { type: "free", f1: "2027-07-27", f2: "2027-08-03" }, pitch: "Au bord d'une cascade, annulable jusqu'à la veille de l'arrivée ou presque." },
    ],
  },
  {
    fichier: "etape-7-st-lucia.html", nom: "St Lucia", court: "St Lucia", lieu: "KwaZulu-Natal", couleur: "#2f7a8a",
    titre: "Le final sur l'océan Indien", accroche: "Du sable chaud, des hippos sur l'estuaire et des baleines depuis les dunes pour finir en beauté.",
    recit: "La route descend vers la chaleur du KwaZulu-Natal. À Cape Vidal, une longue plage sauvage, une eau à 21–22 °C, et en pleine saison de migration, les baleines à bosse se voient depuis les dunes aux jumelles. L'après-midi, deux heures de croisière sur une eau de miroir, entre 800 hippopotames et 1 000 crocodiles. Entre les deux, une matinée chez les rhinocéros de Hluhluwe-iMfolozi, à une heure de route. Le soir, poisson grillé. Il faudra prendre la voiture même pour 300 mètres : la nuit, les rues appartiennent aux hippos.",
    nuits: 2, debut: 13, photos: ["luc1", "luc2", "luc3", "luc4"], carte: [32.41, -28.37],
    jours: [
      { j: 13, t: "Vers l'océan", k: "330 km · 4h15", d: "Sortie d'Eswatini à Lavumisa, autoroute N2 dans le KwaZulu-Natal, arrivée vers 15h30." },
      { j: 14, t: "Les rhinocéros, puis les hippos", k: "~100 km aller-retour + pistes", d: "Départ vers 5h45 pour Hluhluwe-iMfolozi par Nyalazi Gate (49 km, 1h) : safari en voiture jusqu'à midi dans la grande réserve à rhinocéros. Retour à St Lucia pour la croisière de 2h sur l'estuaire à 15h." },
      { j: 15, t: "Cape Vidal, puis Durban", k: "~207 km · 2h35", d: "Plage et baleines depuis les dunes de Cape Vidal le matin, départ de St Lucia vers midi. Vol Emirates à 18h40, Paris le lendemain en début d'après-midi. Autoroute N2 jusqu'à l'aéroport King Shaka, sans traverser Durban." },
    ],
    savoir: ["La nuit, on ne marche jamais dans St Lucia : hippopotames dans les rues.", "On décide de la sortie baleines sur place, selon la houle. Rien à réserver avant.", "Hluhluwe-iMfolozi, ajouté le 12 novembre 2026 : 300 ZAR par adulte selon le dernier barème publié (environ 32 € à deux, à reconfirmer pour 2027). Portes ouvertes de 6h à 18h en hiver selon Ezemvelo ; des opérateurs annoncent 17h, on sort avant.", "Retour retenu le 12 novembre 2026 : Emirates à 18h40 depuis Durban, pour garder Cape Vidal le matin du départ. Billet pas encore acheté.", "Sur le parking, 5 à 10 ZAR pour les gardiens officiels en gilet."],
    options: [
      { id: "leopardtree", nom: "Leopard Tree Lodge", zone: "St Lucia", note: 9.7, avis: 737, prix: { f1: 184, f2: 175 }, slug: "za/lalapanzi-guest-house-st-lucia", retours: "Juillet 2026 : 9,7/10 sur 31 avis, très constant. Accueil de Thea, propreté et jardin reviennent souvent.", annul: { type: "free", f1: "2027-07-09", f2: "2027-07-16" }, pitch: "À 750 m de la plage, piscine dans un jardin où passent phacochères et petites antilopes." },
      { id: "ambience", nom: "African Ambience Guest House", zone: "St Lucia", note: 9.6, avis: 352, prix: { f1: 168, f2: 168 }, repas: "Petit-déjeuner inclus", slug: "za/africanambience-guesthouse", annul: { type: "free", f1: "2027-06-30", f2: "2027-07-07" }, pitch: "Note exceptionnelle et petit-déjeuner compris, pour un prix très doux." },
      { id: "ndiza", nom: "Ndiza Lodge and Cabanas", zone: "St Lucia", note: 9.3, avis: 537, prix: { f1: 185, f2: 195 }, slug: "za/ndiza-lodge-and-cabanas", annul: { type: "free", f1: "2027-07-09", f2: "2027-07-16" }, pitch: "2 piscines et terrasse panoramique sur l'océan et l'embouchure de l'estuaire." },
      { id: "corner", nom: "Leopard Corner Lodge", zone: "St Lucia", note: 9.6, avis: 1051, prix: { f1: 246, f2: 221 }, repas: "Petit-déjeuner inclus", slug: "za/leopard-corner", annul: { type: "free", f1: "2027-07-09", f2: "2027-07-16" }, pitch: "Guesthouse très soignée avec piscine, à 800 m de la plage." },
      { id: "dreamz", nom: "African-Dreamz Guest House", zone: "St Lucia", note: 9.0, avis: 291, prix: { f1: 142, f2: 142 }, slug: "za/african-dreamz-guest-house", annul: { type: "free", f1: "2027-07-23", f2: "2027-07-30" }, pitch: "Le moins cher de la sélection, annulable le plus tard." },
    ],
  },
];

// Liaisons entre étapes. Tronçons du canyon : calcul OSRM du 1er novembre 2026. Skukuza → Eswatini : calcul OSRM du 12 novembre 2026.
// Le reste reprend le programme. dx, dy : position de l'étiquette sur la carte.
const ROUTE = [
  { de: "Aéroport", a: "Rosebank", km: 45, txt: "45 km · 35 min" },
  { de: "Rosebank", a: "Canyon", km: 410, txt: "~410 km · 5h30", dx: -62, dy: 44 },
  { de: "Canyon", a: "Réserve privée", km: 150, txt: "~150 km · 2h45", dx: -6, dy: 38 },
  { de: "Réserve privée", a: "Satara", km: 95, txt: "75–110 km · 2h30–3h30", dx: 86, dy: -38 },
  { de: "Satara", a: "Lower Sabie", km: 95, txt: "95 km · 3h30–4h", dx: 86, dy: 6 },
  { de: "Skukuza", a: "Eswatini", km: 236, txt: "~236 km · 4h30", dx: 74, dy: 0 },
  { de: "Eswatini", a: "St Lucia", km: 330, txt: "330 km · 4h15", dx: 84, dy: 0 },
  { de: "St Lucia", a: "Durban", km: 207, txt: "~207 km · 2h35", dx: -84, dy: 0 },
];

// Relevé Rentalcars du 31 octobre 2026, SUV automatique, annulation gratuite, 13 jours, Johannesburg → Durban.
const CARBURANT = 215;
const VOITURES = [
  { id: "alamo", loueur: "Alamo", modele: "Toyota Urban Cruiser", note: 8.1, avis: "500+", prix: 592, eswatini: 135, depot: 270, franchise: 1622, pitch: "Notre choix : un vrai petit SUV, un dépôt raisonnable et les meilleurs retours récents.", retours: "6 avis DiscoverCars de 2026, tous positifs (3 à Johannesburg, 3 à Durban, dont juillet). Dépôt rendu le matin même à Durban. Échantillon très petit." },
  { id: "first-fronx", loueur: "First Car Rental", modele: "Suzuki Fronx", note: 8.5, avis: "1 000+", prix: 563, eswatini: 70, depot: 162, franchise: 973, pitch: "Meilleure note globale, petit dépôt, petite franchise, mais des retours récents préoccupants.", retours: "Équipe et rapidité saluées à Johannesburg. Mais essence facturée malgré un plein rendu dans 3 avis de septembre et octobre 2026, et Fronx remplacé par un autre modèle dans 2 des 3 avis de 2026 qui le citent.", vigilance: true },
  { id: "hertz", loueur: "Hertz", modele: "Toyota Starlet Cross", note: 8.3, avis: "400+", prix: 395, eswatini: 108, depot: 1027, franchise: 919, pitch: "Le moins cher, mais 2 bagages en soute et plus de 1 000 € bloqués sur la carte.", retours: "5 avis DiscoverCars de 2026 à Johannesburg : un dépôt doublé au comptoir, un dépôt resté bloqué, des pneus sous-gonflés, mais un bon retour sur la Starlet en août." },
  { id: "europcar", loueur: "Europcar", modele: "Toyota Urban Cruiser", note: 8.3, avis: "1 000+", prix: 496, eswatini: 118, depot: 2303, franchise: 2303, pitch: "Prix correct, mais dépôt et franchise très élevés. Montants lus sur le Corolla Cross, frais Eswatini comptés par frontière.", retours: "4 avis DiscoverCars de 2026 à Johannesburg : 2 sur 4 signalent un litige de carburant ou un réservoir pas plein au retrait." },
  { id: "first-jolion", loueur: "First Car Rental", modele: "Haval Jolion", note: 8.5, avis: "1 000+", prix: 671, eswatini: 70, depot: null, franchise: null, pitch: "Le même loueur avec un vrai gabarit de SUV, pour 108 € de plus.", retours: "Aucun avis de 2026 lu sur ce modèle. Les constats sur l'essence et les changements de véhicule de First Car Rental valent aussi ici.", vigilance: true },
];
const VOITURES_EXCLUES = [
  { loueur: "Woodford", modele: "Toyota Urban Cruiser", raison: "L'entrée en Eswatini est interdite, alors que notre route y passe. Note 8,5, mais exclu." },
  { loueur: "Avis", modele: "Volkswagen T-Cross", raison: "647 € sans les frais Eswatini, non relevés. Note 8,1, dépôt 949 €, franchise 1 946 €." },
];
