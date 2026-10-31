// Carnet de voyage : rendu des pages, choix des logements et budget en direct.
const CLE = "safari-2027-25-juillet";
const etat = { fenetre: "f2", choix: {} };
const page = document.body.dataset.etape;

function lire() {
  try { Object.assign(etat, JSON.parse(localStorage.getItem(CLE)) || {}); } catch (e) {}
  const m = location.hash.match(/^#nos-choix-(f[12])-(.+)$/);
  if (m) {
    etat.fenetre = m[1];
    m[2].split("-").forEach((v, i) => { if (ETAPES[i]?.options[+v]) etat.choix[i] = ETAPES[i].options[+v].id; });
    sauver();
  }
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
const totalFixes = FIXES.reduce((s, f) => s + f.prix, 0);
const totalLogements = () => ETAPES.reduce((s, e, i) => s + cout(choisi(i)), 0);

function lienResa(e, o) {
  if (o.direct) return o.direct;
  const a = iso(dateJour(e.debut)), b = iso(dateJour(e.debut + e.nuits));
  return `https://www.booking.com/hotel/${o.slug}.fr.html?checkin=${a}&checkout=${b}&group_adults=2&no_rooms=1&selected_currency=EUR`;
}

function badge(o) {
  const a = o.annul;
  if (a.type === "free") return `<span class="pastille ok">Annulation gratuite jusqu'au ${dateFr(a[etat.fenetre])}</span>`;
  if (a.type === "sanparks") return `<span class="pastille moyen">Sans frais à 31 jours ou plus, à reconfirmer</span>`;
  return `<span class="pastille attention">Annulation à confirmer</span>`;
}

function photo(k, cls = "") {
  const p = PHOTOS[k];
  return `<figure class="${cls}"><img src="photos/${k}.jpg" alt="${p.alt}" loading="lazy"><figcaption>${p.cap} <a href="${p.u}" target="_blank" rel="noopener">${p.a}, ${p.l}</a></figcaption></figure>`;
}

function fil() {
  return `<nav class="fil" aria-label="Étapes du voyage">
    <a href="index.html" class="${page === undefined ? "actif" : ""}"><b>★</b><span>Le voyage</span></a>
    ${ETAPES.map((e, i) => `<a href="${e.fichier}" class="${+page === i ? "actif" : ""}"><b>${i + 1}</b><span>${e.court}</span></a>`).join("")}
  </nav>`;
}

function entete() {
  document.getElementById("entete").innerHTML = `
    <div class="barre">
      <a class="marque" href="index.html">Afrique du Sud <em>2027</em></a>
      <div class="bascule" role="group" aria-label="Fenêtre de dates">
        ${Object.entries(FENETRES).map(([k, f]) => `<button data-f="${k}" aria-pressed="${etat.fenetre === k}">${f.label}</button>`).join("")}
      </div>
    </div>${fil()}`;
  document.querySelectorAll("[data-f]").forEach(b => b.onclick = () => { etat.fenetre = b.dataset.f; sauver(); rendre(); });
}

function piedBudget() {
  const t = totalFixes + totalLogements(), r = OBJECTIF - t, pct = Math.min(100, t / OBJECTIF * 100);
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
        <ol class="jours">${e.jours.map(j => `<li><span class="jour">J${j.j}<small>${dateJour(j.j).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</small></span><div><h3>${j.t}</h3>${j.k ? `<p class="km">${j.k}</p>` : ""}<p>${j.d}</p></div></li>`).join("")}</ol>
      </section>
      <section id="logements">
        <h2>Où dormir</h2>
        <p class="intro">Notre sélection à la date choisie, pour deux. Prix relevés le ${RELEVE}, ils peuvent bouger.</p>
        <div class="grille">${e.options.map(o => carteLogement(e, i, o)).join("")}</div>
      </section>
      <section class="savoir"><h2>Bon à savoir</h2><ul>${e.savoir.map(s => `<li>${s}</li>`).join("")}</ul></section>
      <nav class="suite">
        ${prec ? `<a href="${prec.fichier}"><small>← Étape ${i}</small>${prec.nom}</a>` : `<a href="index.html"><small>← Vue d'ensemble</small>Le voyage</a>`}
        ${suiv ? `<a class="droite" href="${suiv.fichier}"><small>Étape ${i + 2} →</small>${suiv.nom}</a>` : `<a class="droite" href="index.html#choix"><small>Dernière étape →</small>Nos choix et notre budget</a>`}
      </nav>
    </div>`;
  document.querySelectorAll("[data-o]").forEach(b => b.onclick = () => { etat.choix[i] = b.dataset.o; sauver(); rendre(); });
}

function carteRoute() {
  const X = l => (l - 27.6) * 92, Y = l => (-l - 23.8) * 105;
  const pts = ETAPES.map(e => [X(e.carte[0]), Y(e.carte[1])]);
  const d = [[X(31.12), Y(-29.6)]];
  return `<svg viewBox="0 0 520 650" role="img" aria-label="Itinéraire de Johannesburg à Durban">
    <path d="M${pts.map(p => p.map(n => n.toFixed(0)).join(" ")).join(" L")} L${d[0].map(n => n.toFixed(0)).join(" ")}" class="trace"/>
    <text x="${d[0][0] + 14}" y="${d[0][1] + 5}" class="ville">Durban, vol retour</text><circle cx="${d[0][0]}" cy="${d[0][1]}" r="6" class="fin"/>
    ${ETAPES.map((e, i) => { const [x, y] = pts[i]; const g = i <= 2 || i === 5; return `<a href="${e.fichier}"><circle cx="${x}" cy="${y}" r="15" style="fill:${e.couleur}"/><text x="${x}" y="${y + 5}" class="num">${i + 1}</text><text x="${g ? x - 21 : x + 22}" y="${y + 5}" class="ville" text-anchor="${g ? "end" : "start"}">${i === 3 ? "Satara" : e.court === "Joburg" ? "" : e.court}</text></a>`; }).join("")}
    <text x="${pts[0][0]}" y="${pts[0][1] + 36}" class="ville" text-anchor="middle">Johannesburg</text>
  </svg>`;
}

function rendreAccueil() {
  const f = FENETRES[etat.fenetre], logement = totalLogements(), total = totalFixes + logement, reste = OBJECTIF - total;
  const limites = ETAPES.map((e, i) => { const o = choisi(i); return { e, o, d: o.annul.type === "free" ? o.annul[etat.fenetre] : null }; });
  const prems = limites.filter(l => l.d).sort((a, b) => a.d.localeCompare(b.d))[0];
  const aConfirmer = limites.filter(l => !l.d);
  const code = ETAPES.map((e, i) => e.options.indexOf(choisi(i))).join("-");
  const lien = `${location.origin}${location.pathname}#nos-choix-${etat.fenetre}-${code}`;
  document.title = "Afrique du Sud 2027 · Notre voyage";
  document.getElementById("contenu").innerHTML = `
    <header class="heros accueil">
      <img src="photos/cen2.jpg" alt="${PHOTOS.cen2.alt}">
      <div class="voile"><div class="dedans">
        <p class="sur">Été 2027 · 15 jours · 13 nuits sur place</p>
        <h1>Du canyon à l'océan Indien</h1>
        <p class="acc">Un carnet pour rêver à deux : les lions du Kruger, les zèbres d'Eswatini, les baleines de Cape Vidal. Et un budget qu'on garde sous ${euros(OBJECTIF)}, avec des logements qu'on peut réserver aujourd'hui et annuler plus tard.</p>
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
          ${FIXES.map(p => `<div class="poste"><span>${p.poste}<small>${p.detail}</small></span><b>${euros(p.prix)}</b></div>`).join("")}
          <div class="poste total"><span>Total pour deux</span><b>${euros(total)}</b></div>
        </div>
        <p class="intro">${reste >= 0 ? `Il reste ${euros(reste)} sous notre objectif.` : `On dépasse notre objectif de ${euros(-reste)}.`} Si on atteint le haut de la fourchette des imprévus, il faut ajouter 300 € au total. Les Rocheuses en 2025 nous avaient coûté 7 349 € : on reste en dessous avec un safari en plus.</p>
      </section>
      <section id="reserver">
        <h2>Réserver sans risque</h2>
        <ol class="plan">
          <li><strong>Maintenant : Booking, en tarif annulable.</strong> On ne paie souvent rien avant la date limite indiquée sur chaque logement. À vérifier sur la page de réservation.</li>
          <li><strong>En parallèle : SANParks pour Satara et Lower Sabie.</strong> Les réservations sont ouvertes pour juillet 2027 et les bungalows face à la rivière partent vite. Le barème publié ne retient rien à 31 jours ou plus, à reconfirmer avant de payer.</li>
          <li><strong>Une fois les dates arrêtées : les vols.</strong> Ce sont eux qui nous engagent : ces billets ne sont pas annulables gratuitement, sauf tarif flexible.</li>
          <li><strong>Au printemps 2027 : le SUV,</strong> puis une dernière vérification de chaque logement avant ${prems ? dateFr(prems.d) : "la première échéance"}.</li>
        </ol>
        ${aConfirmer.length ? `<p class="alerte">À confirmer avant de payer : ${aConfirmer.map(l => l.o.nom).join(", ")}.</p>` : ""}
      </section>
      <footer class="credits"><h2>Sources et photos</h2>
        <p>Prix et dates d'annulation relevés sur Booking le ${RELEVE}, pour 2 adultes, avec des remises Genius possibles. Tarifs SANParks 2026/2027. Les prix des lodges en réserve privée peuvent varier avec les taxes de conservation, estimées ici. Les photos montrent les lieux, pas les logements : le bouton de chaque fiche ouvre leurs vraies photos.</p>
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

function rendre() {
  const y = scrollY;
  entete();
  page === undefined ? rendreAccueil() : rendreEtape();
  piedBudget();
  scrollTo(0, y);
}

lire();
rendre();
if (location.hash && !location.hash.startsWith("#nos-choix")) document.querySelector(location.hash)?.scrollIntoView();
document.querySelector(".fil .actif")?.scrollIntoView({ inline: "center", block: "nearest" });
addEventListener("keydown", e => {
  if (e.target.matches("input,textarea") || e.altKey || e.ctrlKey || e.metaKey) return;
  const fichiers = ["index.html", ...ETAPES.map(x => x.fichier)];
  const n = page === undefined ? 0 : +page + 1;
  const dest = e.key === "ArrowRight" ? fichiers[n + 1] : e.key === "ArrowLeft" ? fichiers[n - 1] : null;
  if (dest) location.href = dest;
});
