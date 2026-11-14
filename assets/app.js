// Carnet de voyage : rendu des pages, choix des logements et budget en direct.
const CLE = "safari-2027-25-juillet";
const etat = { fenetre: "f2", choix: {}, voiture: VOITURES[0].id, vol: VOLS[0].id };
const page = document.body.dataset.etape;
const vue = document.body.dataset.vue;

function lire() {
  try { Object.assign(etat, JSON.parse(localStorage.getItem(CLE)) || {}); } catch (e) {}
  const m = location.hash.match(/^#nos-choix-(f[12])-(.+)$/);
  if (m) {
    etat.fenetre = m[1];
    m[2].split("-").forEach((v, i) => {
      if (ETAPES[i]?.options[+v]) etat.choix[i] = ETAPES[i].options[+v].id;
      if (i === ETAPES.length && VOITURES[+v]) etat.voiture = VOITURES[+v].id;
      if (i === ETAPES.length + 1 && VOLS[+v]) etat.vol = VOLS[+v].id;
    });
    sauver();
  }
  if (!FENETRES[etat.fenetre]) etat.fenetre = Object.keys(FENETRES)[0];
}
function sauver() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }

const euros = n => n.toLocaleString("fr-FR").replace(/[  ]/g, " ") + " €";
const dateFr = (iso, o = { day: "numeric", month: "long" }) => new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", o);
const dateJour = j => { const d = new Date(FENETRES[etat.fenetre].depart + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + j - 1); return d; };
const iso = d => d.toISOString().slice(0, 10);

const dispo = (o) => o.prix[etat.fenetre] != null;
function choisi(i) {
  const e = ETAPES[i];
  return e.options.find(o => o.id === etat.choix[i] && dispo(o)) || e.options.find(dispo);
}
const cout = (o) => o.prix[etat.fenetre] + (o.taxe || 0);
const voiture = () => VOITURES.find(v => v.id === etat.voiture) || VOITURES[0];
const coutVoiture = v => v.prix + v.eswatini + CARBURANT;
const vol = () => VOLS.find(v => v.id === etat.vol) || VOLS[0];
const coutVol = v => 2 * v.lignes.reduce((s, l) => s + l[2], 0);
const fixes = () => FIXES.map(f => {
  if (f.vols) { const a = vol(); return { ...f, lien: "vols.html", prix: coutVol(a), detail: `${a.nom} : ${a.lignes.map(l => `${l[0].toLowerCase()} ${l[2]} €`).join(" + ")} par personne (relevé du ${VOLS_RELEVE})` }; }
  if (!f.voiture) return f;
  const v = voiture();
  return { ...f, lien: "location-voiture.html", prix: coutVoiture(v), detail: `${v.loueur}, ${v.modele}, 13 jours : ${v.prix} € + ${v.eswatini} € de frais Eswatini + ~${CARBURANT} € d'essence et de péages, franchise non rachetée` };
});
const totalFixes = () => fixes().reduce((s, f) => s + f.prix, 0);
const totalLogements = () => ETAPES.reduce((s, e, i) => s + cout(choisi(i)), 0);

// Lever et coucher du soleil calculés (équation du lever de soleil), arrondis à 5 minutes, heure d'Afrique du Sud (UTC+2).
function soleil(e, jour) {
  const rad = Math.PI / 180, [lon, lat] = e.carte, d = dateJour(jour);
  const n = Math.round(d / 86400000 + 2440587.5 - 2451545), js = n - lon / 360;
  const m = (357.5291 + 0.98560028 * js) % 360 * rad;
  const l = ((m / rad + 1.9148 * Math.sin(m) + 0.02 * Math.sin(2 * m) + 0.0003 * Math.sin(3 * m) + 282.9372) % 360) * rad;
  const midi = js + 0.0053 * Math.sin(m) - 0.0069 * Math.sin(2 * l);
  const decl = Math.asin(Math.sin(l) * Math.sin(23.4397 * rad)), phi = lat * rad;
  const w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl))) / rad / 360;
  const heure = j => {
    const t = Math.round((((j + 0.5) % 1 + 1) % 1 * 1440 + 120) / 5) * 5;
    return `${Math.floor(t / 60)}h${String(t % 60).padStart(2, "0")}`;
  };
  return { lever: heure(midi - w), coucher: heure(midi + w) };
}

function lienResa(e, o) {
  if (o.direct) return o.direct;
  const a = iso(dateJour(e.debut)), b = iso(dateJour(e.debut + e.nuits));
  return `https://www.booking.com/hotel/${o.slug}.fr.html?checkin=${a}&checkout=${b}&group_adults=2&no_rooms=1&selected_currency=EUR`;
}

function badge(o) {
  const a = o.annul;
  if (a.type === "free") return `<span class="pastille ok">Annulation gratuite jusqu'au ${dateFr(a[etat.fenetre])}</span>`;
  if (a.type === "sanparks") return `<span class="pastille moyen">Paiement intégral à la réservation, sans frais d'annulation à plus de 30 jours</span>`;
  return `<span class="pastille attention">Annulation à confirmer</span>`;
}

function photo(k, cls = "") {
  const p = PHOTOS[k];
  return `<figure class="${cls}"><img src="photos/${k}.jpg" alt="${p.alt}" loading="lazy"><figcaption>${p.cap} <a href="${p.u}" target="_blank" rel="noopener">${p.a}, ${p.l}</a></figcaption></figure>`;
}

function fil() {
  return `<nav class="fil" aria-label="Étapes du voyage">
    <a href="index.html" class="${page === undefined && !vue ? "actif" : ""}"><b>★</b><span>Le voyage</span></a>
    ${ETAPES.map((e, i) => `<a href="${e.fichier}" class="${+page === i ? "actif" : ""}"><b>${i + 1}</b><span>${e.court}</span></a>`).join("")}
    <a href="location-voiture.html" class="${vue === "voiture" ? "actif" : ""}"><b>🚙</b><span>Voiture</span></a>
    <a href="vols.html" class="${vue === "vols" ? "actif" : ""}"><b>✈</b><span>Vols</span></a>
  </nav>`;
}

function entete() {
  document.getElementById("entete").innerHTML = `
    <div class="barre">
      <a class="marque" href="index.html">Afrique du Sud <em>2027</em></a>
      ${Object.keys(FENETRES).length > 1 ? `<div class="bascule" role="group" aria-label="Fenêtre de dates">
        ${Object.entries(FENETRES).map(([k, f]) => `<button data-f="${k}" aria-pressed="${etat.fenetre === k}">${f.label}</button>`).join("")}
      </div>` : `<span class="dates">${FENETRES[etat.fenetre].label}</span>`}
    </div>${fil()}`;
  document.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { etat.fenetre = b.dataset.f; sauver(); rendre(); });
}

function piedBudget() {
  const t = totalFixes() + totalLogements(), r = OBJECTIF - t, pct = Math.min(100, t / OBJECTIF * 100);
  document.getElementById("budget-fixe").innerHTML = `
    <a href="index.html#budget">
      <span class="total"><strong>${euros(t)}</strong> pour nous deux</span>
      <span class="jauge"><i style="width:${pct}%" class="${r < 0 ? "depasse" : ""}"></i></span>
      <span class="reste ${r < 0 ? "depasse" : ""}">${r >= 0 ? `${euros(r)} sous les ${euros(OBJECTIF)}` : `${euros(-r)} au-dessus de ${euros(OBJECTIF)}`}</span>
    </a>`;
}

function carteLogement(e, i, o) {
  const pris = choisi(i).id === o.id, ok = dispo(o);
  const diff = ok ? cout(o) - cout(choisi(i)) : 0;
  return `<article class="logement ${pris ? "pris" : ""} ${ok ? "" : "off"}">
    <div class="ligne"><h3>${o.nom}</h3>${o.note ? `<span class="note">${o.note.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}</span>` : ""}</div>
    <p class="zone">${o.zone}${o.avis ? ` · ${o.avis.toLocaleString("fr-FR")} avis` : ""}</p>
    <p>${o.pitch}</p>
    ${o.retours ? `<p class="retours">${o.retours}</p>` : ""}
    ${o.repas ? `<p class="repas">${o.repas}</p>` : ""}
    ${ok ? badge(o) : `<span class="pastille attention">Pas de tarif annulable sur cette fenêtre</span>`}
    ${o.annul.txt ? `<p class="petit">${o.annul.txt}</p>` : ""}
    <div class="action">
      <div class="prix">${ok ? `<strong>${euros(o.prix[etat.fenetre])}</strong><small>${e.nuits} nuit${e.nuits > 1 ? "s" : ""} à deux${o.taxe ? ` + ~${o.taxe} € de taxes de réserve` : ""}</small>${!pris && diff ? `<small class="delta">${diff > 0 ? "+" : "−"}${euros(Math.abs(diff))} sur le total</small>` : ""}` : "<strong>—</strong>"}</div>
      <div class="boutons">
        <a class="lien" href="${lienResa(e, o)}" target="_blank" rel="noopener">${o.direct ? "Site officiel" : "Photos et tarifs"}</a>
        ${ok ? `<button class="choisir" data-o="${o.id}" aria-pressed="${pris}">${pris ? "✓ Notre choix" : "Choisir"}</button>` : ""}
      </div>
    </div>
  </article>`;
}

function rendreEtape() {
  const i = +page, e = ETAPES[i], prec = ETAPES[i - 1], suiv = ETAPES[i + 1];
  document.title = `${e.nom} · Afrique du Sud 2027`;
  const arrivee = dateJour(e.debut), depart = dateJour(e.debut + e.nuits);
  const fmt = { day: "numeric", month: "long" };
  document.getElementById("contenu").innerHTML = `
    <header class="heros" style="--c:${e.couleur}">
      <img src="photos/${e.photos[0]}.jpg" alt="${PHOTOS[e.photos[0]].alt}">
      <div class="voile"><div class="dedans">
        <p class="sur">Étape ${i + 1} sur ${ETAPES.length} · ${e.lieu}</p>
        <h1>${e.titre}</h1>
        <p class="acc">${e.accroche}</p>
        <p class="meta">${e.nuits} nuit${e.nuits > 1 ? "s" : ""} · du ${arrivee.toLocaleDateString("fr-FR", fmt)} au ${depart.toLocaleDateString("fr-FR", fmt)} 2027</p>
      </div></div>
    </header>
    <div class="page">
      <section class="recit"><p>${e.recit}</p></section>
      <section class="galerie">${e.photos.slice(0).map((k, n) => photo(k, n === 0 ? "large" : "")).join("")}</section>
      <section>
        <h2>Au programme</h2>
        <p class="soleil">Lever du soleil vers ${soleil(e, e.debut).lever} · coucher vers ${soleil(e, e.debut).coucher}</p>
        <ol class="jours">${e.jours.map(j => `<li><span class="jour">J${j.j}<small>${dateJour(j.j).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</small></span><div><h3>${j.t}</h3>${j.k ? `<p class="km">${j.k}</p>` : ""}<p>${j.d}</p></div></li>`).join("")}</ol>
      </section>
      ${e.enroute ? `<section class="savoir enroute"><h2>À voir en route</h2><p class="intro">Des idées d'arrêts, à choisir selon l'heure et l'envie. Horaires et tarifs à vérifier avant le départ.</p>${e.enroute.map(b => `<h3>${b.trajet}</h3><ul>${b.arrets.map(([n, d]) => `<li><strong>${n}</strong> : ${d}</li>`).join("")}</ul>`).join("")}</section>` : ""}
      <section id="logements">
        <h2>Où dormir</h2>
        <p class="intro">Notre sélection à nos dates, pour deux. Prix relevés le ${RELEVE}, ils peuvent bouger.</p>
        <div class="grille">${e.options.filter(dispo).map(o => carteLogement(e, i, o)).join("")}</div>
      </section>
      <section class="savoir"><h2>Bon à savoir</h2><ul>${e.savoir.map(s => `<li>${s}</li>`).join("")}</ul></section>
      <nav class="suite">
        ${prec ? `<a href="${prec.fichier}"><small>← Étape ${i}</small>${prec.nom}</a>` : `<a href="index.html"><small>← Vue d'ensemble</small>Le voyage</a>`}
        ${suiv ? `<a class="droite" href="${suiv.fichier}"><small>Étape ${i + 2} →</small>${suiv.nom}</a>` : `<a class="droite" href="index.html#choix"><small>Dernière étape →</small>Nos choix et notre budget</a>`}
      </nav>
    </div>`;
  document.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { etat.choix[i] = b.dataset.o; sauver(); rendre(); });
}

const trajets = () => `<div class="trajets">${ROUTE.map(r => `<div><span>${r.de} → ${r.a}</span><b>${r.txt}</b></div>`).join("")}</div>`;

function carteRoute() {
  const X = l => (l - 27.6) * 92, Y = l => (-l - 23.8) * 105;
  const pts = ETAPES.map(e => [X(e.carte[0]), Y(e.carte[1])]);
  const d = [[X(31.12), Y(-29.6)]];
  const arrets = [...pts, d[0]];
  const liaisons = ROUTE.slice(1).map((r, n) => {
    const x = (arrets[n][0] + arrets[n + 1][0]) / 2 + r.dx, y = (arrets[n][1] + arrets[n + 1][1]) / 2 + r.dy, l = r.txt.length * 7 + 14;
    return `<g class="liaison"><rect x="${(x - l / 2).toFixed(0)}" y="${(y - 12).toFixed(0)}" width="${l}" height="23" rx="11"/><text x="${x.toFixed(0)}" y="${(y + 4).toFixed(0)}">${r.txt}</text></g>`;
  }).join("");
  const places = { 1: [-21, 5, "end"], 2: [-8, -20, "end"], 3: [22, 5, "start"], 4: [22, 5, "start"], 5: [-21, 5, "end"], 6: [22, 5, "start"] };
  return `<svg viewBox="0 0 600 650" role="img" aria-label="Itinéraire de Johannesburg à Durban, avec distances et temps de route">
    <path d="M${pts.map(p => p.map(n => n.toFixed(0)).join(" ")).join(" L")} L${d[0].map(n => n.toFixed(0)).join(" ")}" class="trace"/>
    <text x="${d[0][0] + 14}" y="${d[0][1] + 5}" class="ville">Durban, vol retour</text><circle cx="${d[0][0]}" cy="${d[0][1]}" r="6" class="fin"/>
    ${liaisons}
    ${ETAPES.map((e, i) => { const [x, y] = pts[i], q = places[i]; return `<a href="${e.fichier}"><circle cx="${x}" cy="${y}" r="15" style="fill:${e.couleur}"/><text x="${x}" y="${y + 5}" class="num">${i + 1}</text>${q ? `<text x="${x + q[0]}" y="${y + q[1]}" class="ville" text-anchor="${q[2]}">${i === 3 ? "Satara" : e.court}</text>` : ""}</a>`; }).join("")}
    <text x="${pts[0][0] - 30}" y="${pts[0][1] + 36}" class="ville">Johannesburg</text>
  </svg>`;
}

function rendreAccueil() {
  const f = FENETRES[etat.fenetre], logement = totalLogements(), total = totalFixes() + logement, reste = OBJECTIF - total;
  const limites = ETAPES.map((e, i) => { const o = choisi(i); return { e, o, d: o.annul.type === "free" ? o.annul[etat.fenetre] : null }; });
  const prems = limites.filter(l => l.d).sort((a, b) => a.d.localeCompare(b.d))[0];
  const aConfirmer = limites.filter(l => !l.d);
  const code = [...ETAPES.map((e, i) => e.options.indexOf(choisi(i))), VOITURES.indexOf(voiture()), VOLS.indexOf(vol())].join("-");
  const lien = `${location.origin}${location.pathname}#nos-choix-${etat.fenetre}-${code}`;
  document.title = "Afrique du Sud 2027 · Notre voyage";
  document.getElementById("contenu").innerHTML = `
    <header class="heros accueil">
      <img src="photos/cen2.jpg" alt="${PHOTOS.cen2.alt}">
      <div class="voile"><div class="dedans">
        <p class="sur">Été 2027 · 15 jours · 13 nuits sur place</p>
        <h1>Du canyon à l'océan Indien</h1>
        <p class="acc">Un carnet pour rêver à deux : les lions du Kruger, les zèbres d'Eswatini, les baleines de Cape Vidal. Et un budget maîtrisé autour de ${euros(OBJECTIF)}, avec des logements qu'on peut réserver aujourd'hui et annuler plus tard.</p>
        <a class="cta" href="${ETAPES[0].fichier}">Commencer le voyage</a>
      </div></div>
    </header>
    <div class="page">
      <section class="promesses">
        <div><strong>${euros(total)}</strong><span>pour nous deux, tout compris</span></div>
        <div><strong>0</strong><span>vol intérieur, tout se fait par la route</span></div>
        <div><strong>6 nuits</strong><span>de safari dont 2 en réserve privée</span></div>
        <div><strong>${prems ? dateFr(prems.d) : "—"}</strong><span>première date limite pour annuler sans frais</span></div>
      </section>
      <section class="deux">
        <div>
          <h2>La route</h2>
          <p class="intro">On descend du nord au sud sans jamais revenir sur nos pas, avec un grand paysage différent tous les deux jours.</p>
          <p class="intro"><strong>${f.court}.</strong> ${f.atout}</p>
        </div>
        <div class="carte">${carteRoute()}</div>
      </section>
      <section>
        <h3 class="sous">Les temps de route</h3>
        <p class="intro">Environ ${euros(ROUTE.reduce((s, r) => s + r.km, 0)).replace("€", "km")} de liaisons, hors pistes de safari et excursions. Dans le Kruger, on roule au rythme des animaux : les temps comptent les arrêts.</p>
        ${trajets()}
      </section>
      <section>
        <h3 class="sous">Le soleil</h3>
        <p class="intro">Heures approximatives, calculées pour chaque étape. C'est l'hiver austral : les journées durent environ 11 heures, et on arrive avant la nuit.</p>
        <div class="trajets">${ETAPES.map(e => { const h = soleil(e, e.debut); return `<div><span>${e.nom}</span><b>${h.lever} → ${h.coucher}</b></div>`; }).join("")}</div>
      </section>
      <section id="securite">
        <h2>Côté sécurité, on est prêts</h2>
        <p class="intro">Le pays demande de la vigilance, surtout dans les grandes villes et sur la route la nuit. Tout notre itinéraire est pensé pour ça : on sait où sont les risques, et on les contourne.</p>
        <div class="rassure">
          <div><h3>Dans les parcs</h3><p>Le Kruger, c'est le cœur du voyage : accès contrôlés aux portes, camps clôturés et gardés la nuit. Ici, la prudence concerne surtout les animaux.</p></div>
          <div><h3>En ville</h3><p>À Johannesburg, on arrive de jour et on dort à Rosebank. Le soir, on dîne sur place ou on commande un taxi. Soweto, ce sera avec un guide. Et on ne passe pas par le centre de Durban.</p></div>
          <div><h3>Sur la route</h3><p>Jamais de route de nuit : on arrive à chaque étape avant 17h30. On reste sur les grands axes, bagages cachés et réservoir au moins à moitié plein.</p></div>
          <div><h3>En Eswatini</h3><p>L'ambiance y est nettement plus paisible et détendue que dans les grandes villes sud-africaines. La vraie attention, là-bas, c'est la route et les animaux sur la chaussée.</p></div>
        </div>
        <h3 class="sous">Si on a un souci</h3>
        <p class="intro">On garde ces numéros dans nos deux téléphones. Pour tout le reste (hôpital, rapatriement, papiers, avocat), on appelle l'assistance dont le numéro est au dos de notre carte bancaire. Et s'il arrivait qu'on nous demande la voiture ou un sac, on donne tout de suite : rien de tout ça ne vaut le risque.</p>
        <div class="trajets">
          <div><span>Urgences depuis un mobile</span><b><a href="tel:112">112</a></b></div>
          <div><span>Police</span><b><a href="tel:10111">10111</a></b></div>
          <div><span>Ambulance et pompiers</span><b><a href="tel:10177">10177</a></b></div>
          <div><span>Consulat de France à Johannesburg</span><b><a href="tel:+27112090178">+27 11 209 0178</a></b></div>
          <div><span>Ambassade de France à Pretoria</span><b><a href="tel:+27124251600">+27 12 425 1600</a></b></div>
        </div>
      </section>
      <section>
        <h2>Les 7 étapes</h2>
        <div class="etapes">${ETAPES.map((e, i) => `<a class="vignette" href="${e.fichier}">
          <img src="photos/${e.photos[0]}.jpg" alt="${PHOTOS[e.photos[0]].alt}" loading="lazy">
          <div><small>${i + 1} · ${dateJour(e.debut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · ${e.nuits} nuit${e.nuits > 1 ? "s" : ""}</small><h3>${e.nom}</h3><p>${e.titre}</p></div>
        </a>`).join("")}</div>
      </section>
      <section id="choix">
        <h2>Nos choix</h2>
        <p class="intro">On choisit sur chaque page d'étape et tout se met à jour ici. Le lien garde nos choix pour qu'on regarde la même chose.</p>
        <div class="choix">${limites.map(({ e, o }, i) => `<a href="${e.fichier}#logements"><span class="n" style="background:${e.couleur}">${i + 1}</span><span class="c"><b>${o.nom}</b><small>${e.nom} · ${o.annul.type === "free" ? `annulable jusqu'au ${dateFr(o.annul[etat.fenetre])}` : "annulation à confirmer"}</small></span><span class="p">${euros(cout(o))}</span></a>`).join("")}</div>
        <div class="partage"><button id="partager">Copier le lien de nos choix</button><span id="copie" role="status"></span></div>
      </section>
      <section id="budget">
        <h2>Le budget</h2>
        <div class="comptes">
          <div class="poste fort"><span>Logements choisis<small>13 nuits, réserve privée comprise</small></span><b>${euros(logement)}</b></div>
          ${fixes().map(p => `<div class="poste"><span>${p.lien ? `<a href="${p.lien}">${p.poste}</a>` : p.poste}<small>${p.detail}</small></span><b>${euros(p.prix)}</b></div>`).join("")}
          <div class="poste total"><span>Total pour deux</span><b>${euros(total)}</b></div>
        </div>
        <p class="intro">${reste >= 0 ? `Il reste ${euros(reste)} sous notre objectif.` : `On dépasse notre objectif de ${euros(-reste)}.`} Si on atteint le haut de la fourchette des imprévus, il faut ajouter 300 € au total. Pour comparer, les Rocheuses nous avaient coûté 7 349 € en 2025.</p>
      </section>
      <section id="reserver">
        <h2>Réserver sans risque</h2>
        <ol class="plan">
          <li><strong>Maintenant : Booking, en tarif annulable.</strong> On ne paie souvent rien avant la date limite indiquée sur chaque logement. À vérifier sur la page de réservation.</li>
          <li><strong>En parallèle : SANParks pour Satara et Lower Sabie.</strong> Les réservations sont ouvertes pour juillet 2027 et les bungalows face à la rivière partent vite. Le barème publié ne retient rien à 31 jours ou plus, à reconfirmer avant de payer.</li>
          <li><strong>Une fois les dates arrêtées : <a href="vols.html">les vols</a>.</strong> Ce sont eux qui nous engagent : ces billets ne sont pas annulables gratuitement, sauf tarif flexible.</li>
          <li><strong>Au printemps 2027 : <a href="location-voiture.html">le SUV</a>,</strong> puis une dernière vérification de chaque logement avant ${prems ? dateFr(prems.d) : "la première échéance"}.</li>
        </ol>
        ${aConfirmer.length ? `<p class="alerte">À confirmer avant de payer : ${aConfirmer.map(l => l.o.nom).join(", ")}.</p>` : ""}
      </section>
      <footer class="credits"><h2>Sources et photos</h2>
        <p>Prix et dates d'annulation relevés sur Booking le 31 octobre 2026, pour 2 adultes, avec des remises Genius possibles. Lodges en réserve privée et Eswatini relevés en direct le ${RELEVE}. Tarifs SANParks 2026/2027. Les prix des lodges en réserve privée peuvent varier avec les taxes de conservation, estimées ici. Les photos montrent les lieux, pas les logements : le bouton de chaque fiche ouvre leurs vraies photos.</p>
        <p>Photos libres via Wikimedia Commons : ${Object.values(PHOTOS).map(p => `<a href="${p.u}" target="_blank" rel="noopener">${p.cap}</a> (${p.a}, ${p.l})`).join(" · ")}.</p>
      </footer>
    </div>`;
  const b = document.getElementById("partager");
  b.onclick = async () => {
    let ok = true;
    try { await navigator.clipboard.writeText(lien); } catch (e) { ok = false; }
    document.getElementById("copie").textContent = ok ? "Lien copié, à envoyer !" : lien;
  };
}

function lienVoiture() {
  const a = dateJour(2), b = dateJour(15);
  const q = new URLSearchParams({ coordinates: "-26.1326,28.2324", dropCoordinates: "-29.6144,31.1164", doDay: b.getUTCDate(), doMonth: b.getUTCMonth() + 1, doYear: b.getUTCFullYear(), doHour: 11, doMinute: 0, puDay: a.getUTCDate(), puMonth: a.getUTCMonth() + 1, puYear: a.getUTCFullYear(), puHour: 15, puMinute: 0, driversAge: 35, ftsType: "A", dropFtsType: "A", location: "", dropLocation: "", locationName: "Aéroport OR Tambo de Johannesbourg", locationIata: "JNB", dropLocationName: "Aéroport international King Shaka", dropLocationIata: "DUR", prefcurrency: "EUR", preflang: "fr", filterCriteria_carCategory: "suvs", filterCriteria_transmission: "AUTOMATIC", filterCriteria_sortBy: "PRICE", filterCriteria_sortAscending: "true" });
  return `https://www.rentalcars.com/search-results?${q}`;
}

function rendreVoiture() {
  const v = voiture();
  document.title = "Location de voiture · Afrique du Sud 2027";
  const fmt = { day: "numeric", month: "long" };
  const montant = n => n == null ? "à vérifier" : euros(n);
  const fiche = o => {
    const pris = o.id === v.id, diff = coutVoiture(o) - coutVoiture(v);
    return `<article class="logement ${pris ? "pris" : ""}">
      <div class="ligne"><h3>${o.modele}</h3><span class="note">${o.note.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}</span></div>
      <p class="zone">${o.loueur} · ${o.avis} avis Rentalcars</p>
      <p>${o.pitch}</p>
      <p class="retours ${o.vigilance ? "vigilance" : ""}">${o.retours}</p>
      <div class="chiffres">
        <span>Location 13 jours<b>${euros(o.prix)}</b></span>
        <span>Frais Eswatini<b>${euros(o.eswatini)}</b></span>
        <span>Dépôt bloqué<b>${montant(o.depot)}</b></span>
        <span>Franchise<b>${montant(o.franchise)}</b></span>
      </div>
      <div class="action">
        <div class="prix"><strong>${euros(coutVoiture(o))}</strong><small>essence et péages compris</small>${!pris && diff ? `<small class="delta">${diff > 0 ? "+" : "−"}${euros(Math.abs(diff))} sur le total</small>` : ""}</div>
        <div class="boutons"><a class="lien" href="${lienVoiture()}" target="_blank" rel="noopener">Voir sur Rentalcars</a><button class="choisir" data-v="${o.id}" aria-pressed="${pris}">${pris ? "✓ Notre choix" : "Choisir"}</button></div>
      </div>
    </article>`;
  };
  document.getElementById("contenu").innerHTML = `
    <header class="heros">
      <img src="photos/cen1.jpg" alt="${PHOTOS.cen1.alt}">
      <div class="voile"><div class="dedans">
        <p class="sur">La voiture · Johannesburg → Durban</p>
        <h1>Notre maison sur roues</h1>
        <p class="acc">Treize jours, un aller simple et une frontière : une automatique assez haute pour voir par-dessus les herbes du Kruger.</p>
        <p class="meta">Retrait le ${dateJour(2).toLocaleDateString("fr-FR", fmt)} à l'aéroport · retour le ${dateJour(15).toLocaleDateString("fr-FR", fmt)} à Durban</p>
      </div></div>
    </header>
    <div class="page">
      <section>
        <h2>Les options comparées</h2>
        <p class="intro">Relevé Rentalcars du 12 novembre 2026 pour les prix, du 31 octobre pour une partie des dépôts et franchises, avec annulation gratuite, pour un retrait à Johannesburg et un retour à Durban. Le lien ouvre la recherche à nos dates, où l'on retrouve le loueur voulu. Notre choix met à jour le budget. Conversion à 18,5 ZAR pour 1 €.</p>
        <p><a class="cta" href="${lienVoiture()}" target="_blank" rel="noopener">Réserver sur Rentalcars</a></p>
        <div class="grille">${VOITURES.map(fiche).join("")}</div>
      </section>
      <section>
        <h2>Écartés</h2>
        <div class="comptes">${VOITURES_EXCLUES.map(x => `<div class="poste"><span>${x.loueur}, ${x.modele}<small>${x.raison}</small></span></div>`).join("")}</div>
      </section>
      <section class="savoir">
        <h2>Et Auto Europe ?</h2>
        <p class="intro">Auto Europe couvre bien l'Afrique du Sud, avec Hertz, Budget, Avis et First Car Hire parmi ses partenaires. Son prix n'a pas pu être relevé : à comparer nous-mêmes sur <a href="https://www.autoeurope.fr/" target="_blank" rel="noopener">autoeurope.fr</a> aux mêmes dates, en vérifiant que l'Eswatini et l'aller simple sont bien inclus.</p>
      </section>
      <section class="savoir">
        <h2>Ce que disent les avis récents</h2>
        <ul>
          <li>Sur <a href="https://www.discovercars.com/partners/firstcarrental-1968" target="_blank" rel="noopener">DiscoverCars</a>, on lit les avis de clients ayant loué à l'agence de Johannesburg, datés au jour près. Lecture faite le 1er novembre 2026.</li>
          <li>First Car Rental, Hertz et Europcar affichent tous 1,7/5 sur <a href="https://www.trustpilot.com/review/firstcarrental.co.za" target="_blank" rel="noopener">Trustpilot</a>, où écrivent surtout les mécontents. Les plaintes de l'été 2026 portent sur le carburant, le dépôt, les frais au comptoir et les changements de véhicule.</li>
          <li>Alamo ressort le mieux, mais sur très peu d'avis. On relit ses avis de <a href="https://www.discovercars.com/partners/alamo-1968" target="_blank" rel="noopener">Johannesburg</a> et de <a href="https://www.discovercars.com/partners/alamo-1970" target="_blank" rel="noopener">Durban</a> juste avant de réserver.</li>
          <li>Quel que soit le loueur : on filme la voiture et la jauge au retrait, on fait le plein tout près de l'aéroport et on garde le ticket.</li>
        </ul>
      </section>
      <section class="savoir">
        <h2>À vérifier avant de payer</h2>
        <ul>
          <li>Le prix inclut bien l'aller simple Johannesburg → Durban.</li>
          <li>Les frais Eswatini sont facturés une seule fois, et le loueur fournit la lettre d'autorisation de sortie.</li>
          <li>Le type de carte exigé pour le dépôt.</li>
          <li>La couverture des pneus, des vitres et des pistes, et le coût d'un rachat de franchise, non compté dans le budget.</li>
          <li>Permis français accompagné du permis international ou d'une traduction assermentée en anglais : prévoir plusieurs semaines.</li>
        </ul>
      </section>
      <section>
        <h2>Les temps de route</h2>
        ${trajets()}
      </section>
      <nav class="suite">
        <a href="${ETAPES[ETAPES.length - 1].fichier}"><small>← Étape ${ETAPES.length}</small>${ETAPES[ETAPES.length - 1].nom}</a>
        <a class="droite" href="vols.html"><small>Ensuite →</small>Les vols</a>
      </nav>
    </div>`;
  document.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { etat.voiture = b.dataset.v; sauver(); rendre(); });
}

function rendreVols() {
  const v = vol();
  document.title = "Vols · Afrique du Sud 2027";
  const jour = d => dateFr(d, { weekday: "short", day: "numeric", month: "long" });
  const prix = n => n == null ? "—" : euros(n);
  const fiche = o => {
    const pris = o.id === v.id, diff = coutVol(o) - coutVol(v);
    return `<article class="logement ${pris ? "pris" : ""}">
      <div class="ligne"><h3>${o.nom}</h3></div>
      <p class="zone">${o.sous}</p>
      <p>${o.pitch}</p>
      <p class="retours ${o.vigilance ? "vigilance" : ""}">${o.retours}</p>
      ${o.lignes.map(([n, d, p]) => `<p class="petit"><strong>${n} · ${euros(p)} par personne.</strong> ${d}.</p>`).join("")}
      <p class="petit"><strong>Bagages en soute.</strong> ${o.bagages}.</p>
      <div class="action">
        <div class="prix"><strong>${euros(coutVol(o))}</strong><small>pour nous deux</small>${!pris && diff ? `<small class="delta">${diff > 0 ? "+" : "−"}${euros(Math.abs(diff))} sur le total</small>` : ""}</div>
        <div class="boutons">${o.liens.map(([t, q]) => `<a class="lien" href="${GF(q)}" target="_blank" rel="noopener">${t}</a>`).join("")}<button class="choisir" data-vol="${o.id}" aria-pressed="${pris}">${pris ? "✓ Notre choix" : "Choisir"}</button></div>
      </div>
    </article>`;
  };
  document.getElementById("contenu").innerHTML = `
    <header class="heros">
      <img src="photos/luc1.jpg" alt="${PHOTOS.luc1.alt}">
      <div class="voile"><div class="dedans">
        <p class="sur">Les vols · Paris → Johannesburg, Durban → Paris</p>
        <h1>Les vols, à optimiser</h1>
        <p class="acc">Environ ${euros(coutVol(v))} à deux sur ${euros(totalFixes() + totalLogements())} : c'est ici que quelques heures ou un jour de décalage pèsent le plus.</p>
        <p class="meta">Départ de Paris le ${dateFr(FENETRES[etat.fenetre].depart)} au soir · retour de Durban le ${dateJour(15).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
      </div></div>
    </header>
    <div class="page">
      <section>
        <h2>Les scénarios comparés</h2>
        <p class="intro">Prix relevés sur Google Flights le ${VOLS_RELEVE}, par personne, en classe économique, au départ de Paris CDG. Rien n'est acheté. Notre choix met à jour le budget. Les bagages viennent du relevé du 31 octobre et sont à relire avant de payer.</p>
        <div class="grille">${VOLS.map(fiche).join("")}</div>
      </section>
      <section>
        <h2>Et en décalant de quelques jours ?</h2>
        <p class="intro">Trois jours avant et trois jours après nos dates, même relevé. En résumé : notre dimanche de départ est déjà le jour le moins cher, et Emirates ne bouge presque pas. Seul le retour Ethiopian varie vraiment : le dimanche 8 août est son jour le plus cher.</p>
        <h3 class="sous">Aller Paris → Johannesburg</h3>
        <div class="trajets jours-vols">${VOLS_ALLER.map(a => `<div class="${a.nous ? "nous" : ""}"><span>${jour(a.d)}${a.nous ? " · notre date" : ""}<small>${a.autre}</small></span><b>${a.rwandair == null ? "Pas de RwandAir" : "RwandAir " + euros(a.rwandair)}</b></div>`).join("")}</div>
        <h3 class="sous">Retour Durban → Paris</h3>
        <div class="trajets jours-vols">${VOLS_RETOUR.map(r => `<div class="${r.nous ? "nous" : ""}"><span>${jour(r.d)}${r.nous ? " · notre date" : ""}<small>Emirates 18h40 : ${r.emirates == null ? "non relevé" : euros(r.emirates)}</small></span><b>Ethiopian ${prix(r.ethiopian)}</b></div>`).join("")}</div>
      </section>
      <section class="savoir">
        <h2>Ce qu'on peut en tirer</h2>
        <ul>
          <li><strong>Partir un autre jour ne rapporte rien.</strong> RwandAir est à 527 € le dimanche 25 et le lundi 26 juillet, à 577 € les autres jours, et absent le vendredi et le mercredi.</li>
          <li><strong>Rentrer le lundi 9 août avec Ethiopian : 454 € au lieu de 548 €.</strong> Avec l'aller RwandAir, cela fait 1 962 € à deux, soit 262 € de moins que notre choix. Mais il faut une nuit de plus, un 14ᵉ jour de voiture, et on arrive à Paris le mardi 10 : le gain réel est bien plus faible.</li>
          <li><strong>Tout décaler d'un jour</strong> (départ le lundi 26 juillet, retour le lundi 9 août) donnerait les mêmes 1 962 € sans nuit en plus, mais oblige à revérifier chaque logement, dont les bungalows du Kruger et le lodge.</li>
          <li><strong>Le vrai levier n'est pas la date, c'est le billet :</strong> l'aller-retour RwandAir par Johannesburg coûte 663 € par personne, contre 1 112 € pour nos deux allers simples. Il se paie en confort et en risque le dernier jour.</li>
          <li><strong>Emirates reste à 585 €</strong> du 8 au 11 août : aucun gain à décaler si l'on garde ce retour.</li>
        </ul>
      </section>
      <section class="savoir">
        <h2>À vérifier avant de payer</h2>
        <ul>
          <li>Les billets ne sont pas annulables gratuitement, sauf tarif flexible : on les achète une fois les logements calés.</li>
          <li>Le prix affiché est pour un adulte ; à deux, il peut différer de quelques euros s'il ne reste qu'une place au tarif le plus bas.</li>
          <li>La franchise de bagages de chaque billet, surtout sur le vol intérieur et sur Air Algérie.</li>
          <li>Google Flights annonçait le ${VOLS_RELEVE} des prix bas pour l'aller, 128 € sous le niveau habituel, et un aller à partir de 457 € que je n'ai pas identifié dans la liste.</li>
          <li>Les départs de Nantes ou de Brest n'ont pas été relevés à nouveau : le 31 octobre, ils coûtaient 700 à 1 300 € de plus à deux.</li>
        </ul>
      </section>
      <nav class="suite">
        <a href="location-voiture.html"><small>← La voiture</small>Location de voiture</a>
        <a class="droite" href="index.html#budget"><small>Retour →</small>Notre budget</a>
      </nav>
    </div>`;
  document.querySelectorAll("[data-vol]").forEach(b => b.onclick = () => { etat.vol = b.dataset.vol; sauver(); rendre(); });
}

function rendre() {
  const y = scrollY;
  entete();
  vue === "vols" ? rendreVols() : vue === "voiture" ? rendreVoiture() : page === undefined ? rendreAccueil() : rendreEtape();
  piedBudget();
  scrollTo(0, y);
}

lire();
rendre();
if (location.hash && !location.hash.startsWith("#nos-choix")) document.querySelector(location.hash)?.scrollIntoView();
document.querySelector(".fil .actif")?.scrollIntoView({ inline: "center", block: "nearest" });
addEventListener("keydown", e => {
  if (e.target.matches("input,textarea") || e.altKey || e.ctrlKey || e.metaKey) return;
  const fichiers = ["index.html", ...ETAPES.map(x => x.fichier), "location-voiture.html", "vols.html"];
  const n = vue === "vols" ? fichiers.length - 1 : vue === "voiture" ? fichiers.length - 2 : page === undefined ? 0 : +page + 1;
  const dest = e.key === "ArrowRight" ? fichiers[n + 1] : e.key === "ArrowLeft" ? fichiers[n - 1] : null;
  if (dest) location.href = dest;
});
