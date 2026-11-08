/* Daten aus cathamed.de und jobs.cathamed.de, Stand 08.11.2026.
   In der fertigen Seite pflegt das Team diese Liste an einer Stelle. */
var BERATUNG = { tel: '02552 50402-60', href: 'tel:+4925525040260' };

var ORTE = {
  beelen:      { name: 'Beelen', x: 564, y: 350, angebote: [
    { art: 'wg', name: 'Senioren-WG Am Bauenrott', adr: 'Am Bauenrott 1' } ] },
  everswinkel: { name: 'Everswinkel', x: 412, y: 354, angebote: [
    { art: 'zuhause', name: 'Ambulanter Pflegedienst Everswinkel', adr: 'Hovestraße 7', tel: '02582 99466-0' } ] },
  greven:      { name: 'Greven', x: 278, y: 200, angebote: [
    { art: 'zuhause', name: 'Ambulanter Pflegedienst Greven', adr: 'Münsterstraße 77–79', tel: '02571 58280-0' },
    { art: 'tag', name: 'Tagespflege Am Johannesgarten', adr: 'Münsterstraße 71', tel: '02571 8788 8120' },
    { art: 'wg', name: 'Senioren-WG Am Johannesgarten', adr: 'Münsterstraße 71', frei: true },
    { art: 'wg', name: 'Senioren-WG Greiwen', adr: 'Naendorfstraße 14' },
    { art: 'wohnen', name: 'Service-Wohnen Greven', adr: 'Münsterstraße 77–79' } ] },
  laer:        { name: 'Laer', x: 135, y: 234, neu: 'Neues Haus an der Pohlstraße', angebote: [
    { art: 'wg', name: 'Senioren-WG Laer', adr: 'Pohlstraße 1' },
    { art: 'wohnen', name: 'Barrierefreie Senioren-Wohnungen Laer', adr: 'Pohlstraße 1', frei: true } ] },
  muenster:    { name: 'Münster', x: 286, y: 320, angebote: [
    { art: 'wg', name: 'Senioren-WG Villa Kahmann', adr: 'Gremmendorfer Weg 44' },
    { art: 'wg', name: 'Senioren-WG Uppenberg', adr: 'Grevener Straße 248' } ] },
  ochtrup:     { name: 'Ochtrup', x: 38, y: 95, angebote: [
    { art: 'tag', name: 'Tagespflege Kiepenkerl', adr: 'Brookstraße 25', tel: '02553 9009620' },
    { art: 'wg', name: 'Senioren-WG Pottbäcker', adr: 'Heckenweg 1a', frei: true },
    { art: 'wohnen', name: 'Service-Wohnen Atrium', adr: 'Brookstraße 19' } ] },
  rheine:      { name: 'Rheine', x: 181, y: 28, unter: 'mit Hauenhorst', angebote: [
    { art: 'zuhause', name: 'Ambulanter Pflegedienst Rheine', adr: 'Lindenstraße 79', tel: '05971 997705' },
    { art: 'tag', name: 'Tagespflege Augenblick', adr: 'Lindenstraße 79', tel: '05971 8072778' },
    { art: 'tag', name: 'Tagespflege Lindenhof', adr: 'Hauptstraße 22, Hauenhorst', tel: '05971 96211-20' },
    { art: 'wg', name: 'Senioren-WG Am Elisabethplatz', adr: 'Darbrookstraße 25a' },
    { art: 'wg', name: 'Senioren-WG Lindenhof', adr: 'Hauptstraße 22, Hauenhorst' } ] },
  saerbeck:    { name: 'Saerbeck', x: 290, y: 125, angebote: [
    { art: 'zuhause', name: 'Ambulanter Pflegedienst Saerbeck', adr: 'Grevener Straße 22', tel: '02574 2889-709' } ] },
  sassenberg:  { name: 'Sassenberg', x: 522, y: 294, angebote: [
    { art: 'tag', name: 'Tagespflege Hesselblick', adr: 'Klingenhagen 14–16', tel: '02583 9197754' },
    { art: 'wg', name: 'Senioren-WG Hesselblick', adr: 'Klingenhagen 34' },
    { art: 'wohnen', name: 'Senioren-Wohnungen Am Klingenhagen', adr: 'Klingenhagen 14–16 und 34' } ] },
  steinfurt:   { name: 'Steinfurt', x: 166, y: 169, unter: 'Borghorst, Hauptsitz seit 1995', angebote: [
    { art: 'zuhause', name: 'Ambulanter Pflegedienst Steinfurt', adr: 'Münsterstraße 52', tel: '02552 9386-0' },
    { art: 'tag', name: 'Tagespflege Edelweiß', adr: 'Münsterstraße 53', tel: '02552 9386-216' },
    { art: 'wg', name: 'Senioren-WG Catharinen Quartier', adr: 'Kolpingstraße 2' },
    { art: 'wg', name: 'Senioren-WG Ermgard-von-Solms-Haus', adr: 'Nordwalder Straße 9' },
    { art: 'wohnen', name: 'Service-Wohnen Stadtvilla Borghorst', adr: 'Münsterstraße 52', frei: true } ] }
};

var ARTEN = {
  zuhause: 'Pflege zu Hause',
  tag: 'Tagespflege',
  wg: 'Senioren-WG',
  wohnen: 'Service-Wohnen'
};

var PLAETZE = [
  { ort: 'laer', art: 'Service-Wohnen', name: 'Barrierefreie Senioren-Wohnungen', adr: 'Pohlstraße 1, Laer', bild: 'img/platz-laer.jpg', alt: 'Das neue Haus an der Pohlstraße in Laer mit Balkonen und Glasfront.' },
  { ort: 'ochtrup', art: 'Senioren-WG', name: 'WG-Zimmer im Pottbäcker', adr: 'Heckenweg 1a, Ochtrup', bild: 'img/platz-ochtrup.jpg', alt: 'Eine Hand holt einen frisch gebackenen Kuchen aus dem Ofen der WG-Küche.' },
  { ort: 'greven', art: 'Senioren-WG', name: 'WG-Zimmer Am Johannesgarten', adr: 'Münsterstraße 71, Greven', bild: 'img/platz-greven.jpg', alt: 'Das Haus Am Johannesgarten in Greven in der Abenddämmerung.' },
  { ort: 'steinfurt', art: 'Service-Wohnen', name: 'Wohnung in der Stadtvilla', adr: 'Münsterstraße 52, Borghorst', bild: 'img/platz-stadtvilla.jpg', alt: 'Heller, leerer Wohnraum mit bodentiefem Fenster in der Stadtvilla Borghorst.' }
];

/* 23 Stellen laut jobs.cathamed.de am 08.11.2026 */
var STELLEN = [
  { t: 'Pflegefachkraft, ambulanter Dienst', o: ['steinfurt'], b: 'Ambulante Pflege' },
  { t: 'Pflegefachassistenz, ambulanter Dienst', o: ['steinfurt'], b: 'Ambulante Pflege' },
  { t: 'Personalreferent (w/m/d)', o: ['steinfurt', 'greven'], b: 'Zentrale Verwaltung' },
  { t: 'Werkstudent Personalmanagement (w/m/d)', o: ['steinfurt'], b: 'Zentrale Verwaltung' },
  { t: 'Pflegefachkraft für die WG (m/w/d)', o: ['rheine'], b: 'Senioren-WG' },
  { t: 'Ausbildung Pflegefachkraft 2027 (w/m/d)', o: ['rheine'], b: 'Ausbildung' },
  { t: 'Ausbildung Pflegefachassistenz 2027 (w/m/d)', o: ['rheine'], b: 'Ausbildung' },
  { t: 'Pflegefachkraft (m/w/d)', o: ['muenster'], b: 'Ambulante Pflege und WG' },
  { t: 'Pflegefachkraft (m/w/d)', o: ['muenster'], b: 'Senioren-WG' },
  { t: 'Teamleitung Villa Kahmann (m/w/d)', o: ['muenster'], b: 'Senioren-WG' },
  { t: 'Pflegefachkraft als Praxisanleiterin (w/m/d)', o: ['sassenberg'], b: 'Ambulante Pflege und WG' },
  { t: 'Serviceassistenz Nachtdienst, WG Hesselblick (w/m/d)', o: ['sassenberg'], b: 'Senioren-WG' },
  { t: 'Betreuungskraft (w/m/d)', o: ['sassenberg'], b: 'Tagespflege' },
  { t: 'Pflegefachkraft (m/w/d)', o: ['everswinkel'], b: 'Ambulante Pflege' },
  { t: 'Pflegefachkraft Minijob (m/w/d)', o: ['everswinkel'], b: 'Ambulante Pflege' },
  { t: 'Serviceassistenz Intensivversorgung (w/m/d)', o: ['everswinkel'], b: 'Intensivpflege' },
  { t: 'Reinigungskraft ambulante Pflege (w/m/d)', o: ['everswinkel'], b: 'Hauswirtschaft' },
  { t: 'Pflegekraft (m/w/d)', o: ['saerbeck'], b: 'Ambulante Pflege' },
  { t: 'Pflegefachkraft Minijob (m/w/d)', o: ['saerbeck'], b: 'Ambulante Pflege' },
  { t: 'Reinigungskraft (m/w/d)', o: ['saerbeck'], b: 'Ambulante Pflege' },
  { t: 'Pflegefachkraft (m/w/d)', o: ['beelen'], b: 'Senioren-WG' },
  { t: 'Reinigungskraft, Senioren-WG (w/m/d)', o: ['ochtrup'], b: 'Senioren-WG' },
  { t: 'Praktikum', o: ['alle'], b: 'In allen Bereichen und Orten' }
];
