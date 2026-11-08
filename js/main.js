(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var telHref = function (t) { return 'tel:+49' + t.replace(/[^0-9]/g, '').replace(/^0/, ''); };
  var schluessel = Object.keys(ORTE);
  var aktuell = 'steinfurt';
  var stellenOrt = 'alle';

  /* ---------- Menü ---------- */
  var menuBtn = $('.btn-menu'), nav = $('#nav');
  menuBtn.addEventListener('click', function () {
    var auf = nav.classList.toggle('offen');
    menuBtn.setAttribute('aria-expanded', auf);
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('offen'); menuBtn.setAttribute('aria-expanded', 'false'); }); });

  /* ---------- Karte ---------- */
  var NS = 'http://www.w3.org/2000/svg';
  var svg = $('#karte');
  var start = ORTE.steinfurt;
  var wege = {};
  schluessel.forEach(function (k) {
    if (k === 'steinfurt') return;
    var o = ORTE[k];
    var mx = (start.x + o.x) / 2, my = (start.y + o.y) / 2;
    var dx = o.x - start.x, dy = o.y - start.y;
    var cx = mx - dy * 0.18, cy = my + dx * 0.18;
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M' + start.x + ' ' + start.y + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + o.x + ' ' + o.y);
    p.setAttribute('class', 'weg');
    svg.appendChild(p);
    try { p.style.setProperty('--len', Math.ceil(p.getTotalLength())); } catch (e) {}
    wege[k] = p;
  });
  var startText = document.createElementNS(NS, 'text');
  startText.setAttribute('x', start.x - 24); startText.setAttribute('y', start.y + 24);
  startText.setAttribute('class', 'start'); startText.setAttribute('text-anchor', 'end');
  startText.textContent = 'SEIT 1995';
  svg.appendChild(startText);

  var labelPos = { ochtrup: [0, -16, 'middle'], rheine: [14, 5, 'start'], saerbeck: [14, 5, 'start'], greven: [14, 5, 'start'], laer: [-14, 5, 'end'], muenster: [14, 5, 'start'], everswinkel: [0, 26, 'middle'], sassenberg: [0, -16, 'middle'], beelen: [0, 26, 'middle'], steinfurt: [-14, 5, 'end'] };
  schluessel.forEach(function (k) {
    var o = ORTE[k];
    var g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'punkt'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', o.name + ' anzeigen'); g.dataset.ort = k;
    var r = 6 + Math.min(o.angebote.length, 5) * 1.6;
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', o.x); c.setAttribute('cy', o.y); c.setAttribute('r', r);
    var lp = labelPos[k] || [14, 5, 'start'];
    var t = document.createElementNS(NS, 'text');
    t.setAttribute('x', o.x + (lp[2] === 'middle' ? 0 : (lp[0] > 0 ? r + 6 : -r - 6)));
    t.setAttribute('y', o.y + (lp[2] === 'middle' ? (lp[1] > 0 ? r + 16 : -r - 8) : 5));
    t.setAttribute('text-anchor', lp[2]);
    t.textContent = o.name;
    g.appendChild(c); g.appendChild(t);
    g.addEventListener('click', function () { zeigeOrt(k); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zeigeOrt(k); } });
    svg.appendChild(g);
  });

  /* Ortswahl Handy */
  var mWahl = $('#ortswahl-m');
  schluessel.forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = ORTE[k].name; b.dataset.ort = k; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { zeigeOrt(k); });
    mWahl.appendChild(b);
  });

  /* ---------- Ortsblatt ---------- */
  function stellenIn(k) { return STELLEN.filter(function (s) { return s.o.indexOf(k) > -1; }).length; }
  function zeigeOrt(k, scrollen) {
    aktuell = k;
    var o = ORTE[k];
    var html = '<div class="ortsblatt-kopf"><h3>' + o.name + '</h3><p>' + (o.unter || (o.angebote.length + (o.angebote.length === 1 ? ' Angebot' : ' Angebote') + ' vor Ort')) + (o.neu ? ' · ' + o.neu : '') + '</p></div>';
    ['zuhause', 'tag', 'wg', 'wohnen'].forEach(function (art) {
      var liste = o.angebote.filter(function (a) { return a.art === art; });
      if (!liste.length) return;
      html += '<div class="gruppe"><h4>' + ARTEN[art] + '</h4>';
      var ohneTel = liste.filter(function (a) { return !a.tel; });
      liste.forEach(function (a) {
        html += '<div class="eintrag' + (a.tel ? '' : ' ohne') + '"><b>' + a.name + (a.frei ? '<span class="frei">frei</span>' : '') + '</b><span>' + a.adr + '</span>' +
          (a.tel ? '<a class="tel" href="' + telHref(a.tel) + '" aria-label="' + a.name + ' anrufen: ' + a.tel + '">' + a.tel + '</a>' : '') + '</div>';
      });
      if (ohneTel.length) html += '<div class="gruppe-tel"><span>Fragen, Besichtigung, Einzug: Pflegeberatung</span><a class="tel" href="' + BERATUNG.href + '" aria-label="Pflegeberatung anrufen: ' + BERATUNG.tel + '">' + BERATUNG.tel + '</a></div>';
      html += '</div>';
    });
    var n = stellenIn(k);
    html += '<div class="ortsblatt-fuss"><button class="btn" type="button" data-anliegen="sonstiges" data-ortwahl="' + k + '">Anfrage für ' + o.name + '</button>' +
      (n ? '<a href="#karriere" data-stellen-ort="' + k + '">' + n + (n === 1 ? ' offene Stelle' : ' offene Stellen') + ' in ' + o.name + '</a>' : '') + '</div>';
    $('#ortsblatt').innerHTML = html;
    $$('.punkt').forEach(function (p) { p.classList.toggle('an', p.dataset.ort === k); });
    Object.keys(wege).forEach(function (w) { wege[w].classList.toggle('an', w === k); });
    $$('#ortswahl-m button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.ort === k ? 'true' : 'false'); });
    if (scrollen) document.getElementById('vor-ort').scrollIntoView();
  }
  zeigeOrt('steinfurt');
  $$('.orte button').forEach(function (b) { b.addEventListener('click', function () { zeigeOrt(b.dataset.ort, true); }); });

  /* ---------- Reiter "Was brauchen Sie" ---------- */
  var tabs = $$('[role=tab]');
  function waehle(tab, fokus) {
    tabs.forEach(function (t) {
      var an = t === tab;
      t.setAttribute('aria-selected', an); t.tabIndex = an ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !an;
    });
    if (fokus) tab.focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { waehle(t); if (window.innerWidth < 860) document.getElementById(t.getAttribute('aria-controls')).scrollIntoView({ block: 'start' }); });
    t.addEventListener('keydown', function (e) {
      var j = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') j = (i + 1) % tabs.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') j = 0; if (e.key === 'End') j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); waehle(tabs[j], true); }
    });
  });

  /* ---------- Freie Plätze ---------- */
  $('#plaetze').innerHTML = PLAETZE.map(function (p) {
    var bild = p.bild ? '<img src="' + p.bild + '" alt="' + p.alt + '" loading="lazy" width="768" height="512">' : '<span class="ortname" aria-hidden="true">' + ORTE[p.ort].name + '</span>';
    return '<article class="platz einblenden"><div class="bild">' + bild + '</div><div class="text"><span class="art">' + p.art + ' · Zimmer frei</span><h3>' + p.name + '</h3><span>' + p.adr + '</span>' +
      '<button class="btn" type="button" data-anliegen="platz" data-ortwahl="' + p.ort + '" data-text="Ich interessiere mich für: ' + p.name + ', ' + p.adr + '.">Platz anfragen</button></div></article>';
  }).join('');

  /* ---------- Stellen ---------- */
  var filter = $('#filter');
  var ortMitStellen = ['alle'].concat(schluessel.filter(function (k) { return stellenIn(k) > 0; }));
  filter.innerHTML = ortMitStellen.map(function (k) {
    return '<button type="button" data-f="' + k + '" aria-pressed="' + (k === 'alle') + '">' + (k === 'alle' ? 'Alle Orte' : ORTE[k].name) + '</button>';
  }).join('');
  function name(o) { return o[0] === 'alle' ? 'alle Orte' : o.map(function (k) { return ORTE[k].name; }).join(', '); }
  var alleOffen = false;
  function zeigeStellen(k) {
    stellenOrt = k;
    var liste = STELLEN.filter(function (s) { return k === 'alle' || s.o.indexOf(k) > -1; });
    var knopf = $('#alle-zeigen');
    if (knopf) knopf.parentNode.removeChild(knopf);
    var gesamt = liste.length;
    if (k === 'alle' && !alleOffen && gesamt > 8) {
      liste = liste.slice(0, 8);
      var nb = document.createElement('button');
      nb.type = 'button'; nb.id = 'alle-zeigen'; nb.className = 'alle-zeigen';
      nb.textContent = 'Alle ' + gesamt + ' Stellen zeigen';
      nb.addEventListener('click', function () { alleOffen = true; zeigeStellen('alle'); var li = $$('#stellen .stelle')[8]; if (li) li.querySelector('button').focus(); });
      $('#stellen').insertAdjacentElement('afterend', nb);
    }
    $('#stellen').innerHTML = liste.map(function (s) {
      var i = STELLEN.indexOf(s);
      return '<li class="stelle"><b>' + s.t + '</b><span>' + name(s.o) + ' · ' + s.b + '</span><button type="button" data-stelle="' + i + '">Kurz bewerben</button></li>';
    }).join('');
    $$('#filter button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === k ? 'true' : 'false'); });
  }
  filter.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) zeigeStellen(b.dataset.f); });
  zeigeStellen('alle');
  $$('[data-stellen-zahl]').forEach(function (el) { el.textContent = STELLEN.length; });

  var sel = $('#b-stelle');
  sel.innerHTML = '<option value="initiativ">Initiativbewerbung</option>' + STELLEN.map(function (s, i) { return '<option value="' + i + '">' + s.t + ' – ' + name(s.o) + '</option>'; }).join('');
  $('#stellen').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-stelle]'); if (!b) return;
    sel.value = b.dataset.stelle;
    $('#kurzbewerbung').scrollIntoView({ block: 'start' });
    setTimeout(function () { $('#b-kontakt').focus({ preventScroll: true }); }, 400);
  });

  /* ---------- Kontaktformular mit Einstieg ---------- */
  var kOrt = $('#k-ort');
  schluessel.forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = ORTE[k].name; kOrt.appendChild(o); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-stellen-ort]');
    if (a) { zeigeStellen(a.dataset.stellenOrt); return; }
    var b = e.target.closest('[data-anliegen]'); if (!b) return;
    var r = $('#anliegen input[value="' + b.dataset.anliegen + '"]'); if (r) r.checked = true;
    if (b.dataset.ortwahl) kOrt.value = b.dataset.ortwahl;
    if (b.dataset.text) $('#k-text').value = b.dataset.text;
    document.getElementById('kontakt').scrollIntoView({ block: 'start' });
    setTimeout(function () { $('#k-kontakt').focus({ preventScroll: true }); }, 400);
  });

  function absenden(form, feld, fehler, danke) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = feld.value.trim();
      if (!v) { fehler.hidden = false; feld.setAttribute('aria-invalid', 'true'); feld.focus(); return; }
      fehler.hidden = true; feld.removeAttribute('aria-invalid');
      var box = document.createElement('div');
      box.className = 'danke'; box.setAttribute('role', 'status'); box.tabIndex = -1;
      box.innerHTML = danke(form);
      form.replaceWith(box); box.focus();
    });
  }
  absenden($('#form-bewerbung'), $('#b-kontakt'), $('#b-fehler'), function (f) {
    var s = f.stelle.value === 'initiativ' ? 'Initiativbewerbung' : STELLEN[+f.stelle.value].t;
    return '<h4>Danke, deine Bewerbung ist angekommen.</h4><p>Hier würde in der fertigen Seite die Kurzbewerbung „' + s + '“ an die Personalabteilung gehen. Sie meldet sich dann bei dir' + (f.zeit.value ? ', am liebsten ' + f.zeit.value : '') + '.</p><p style="margin-top:.6rem"><b>Entwurf:</b> Es wurde nichts versendet.</p>';
  });
  absenden($('#form-kontakt'), $('#k-kontakt'), $('#k-fehler'), function (f) {
    var ort = f.ort.value ? ' in ' + ORTE[f.ort.value].name : '';
    return '<h4>Danke, Ihre Nachricht ist angekommen.</h4><p>In der fertigen Seite ginge sie direkt an das passende Team' + ort + '. Das Team meldet sich dann bei Ihnen.</p><p style="margin-top:.6rem"><b>Entwurf:</b> Es wurde nichts versendet.</p>';
  });

  /* ---------- Barrierefreiheit ---------- */
  var root = document.documentElement, dlg = $('#a11y'), oeffner = $('.btn-a11y');
  var gespeichert = {};
  try { gespeichert = JSON.parse(localStorage.getItem('cathamed-ansicht') || '{}'); } catch (e) {}
  function setze(k, v) { if (v && v !== '0') root.dataset[k] = v; else delete root.dataset[k]; gespeichert[k] = v; try { localStorage.setItem('cathamed-ansicht', JSON.stringify(gespeichert)); } catch (e) {} anzeigen(); }
  function anzeigen() {
    $$('[data-stufe="schrift"] button').forEach(function (b) { b.setAttribute('aria-pressed', (root.dataset.schrift || '0') === b.dataset.wert ? 'true' : 'false'); });
    $$('[data-schalter]').forEach(function (b) { var an = root.dataset[b.dataset.schalter] === '1'; b.setAttribute('aria-pressed', an); b.textContent = an ? 'An' : 'Aus'; });
  }
  Object.keys(gespeichert).forEach(function (k) { if (gespeichert[k] && gespeichert[k] !== '0') root.dataset[k] = gespeichert[k]; });
  anzeigen();
  $$('[data-stufe="schrift"] button').forEach(function (b) { b.addEventListener('click', function () { setze('schrift', b.dataset.wert); }); });
  $$('[data-schalter]').forEach(function (b) { b.addEventListener('click', function () { setze(b.dataset.schalter, root.dataset[b.dataset.schalter] === '1' ? '0' : '1'); }); });
  function auf() { dlg.classList.add('offen'); $('.a11y-zu').focus(); document.addEventListener('keydown', esc); }
  function zu() { dlg.classList.remove('offen'); document.removeEventListener('keydown', esc); oeffner.focus(); }
  function esc(e) {
    if (e.key === 'Escape') zu();
    if (e.key === 'Tab') {
      var f = $$('button, a', $('.a11y-panel')); var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  oeffner.addEventListener('click', auf);
  $$('[data-zu]').forEach(function (b) { b.addEventListener('click', zu); });

  var vorlesen = $('#vorlesen');
  if (!('speechSynthesis' in window)) { vorlesen.disabled = true; vorlesen.textContent = 'nicht verfügbar'; }
  vorlesen.addEventListener('click', function () {
    var s = window.speechSynthesis;
    if (s.speaking) { s.cancel(); vorlesen.setAttribute('aria-pressed', 'false'); vorlesen.textContent = 'Start'; return; }
    var abschnitte = $$('main > section'), mitte = window.innerHeight / 2, ziel = abschnitte[0];
    abschnitte.forEach(function (a) { var r = a.getBoundingClientRect(); if (r.top <= mitte && r.bottom >= mitte) ziel = a; });
    var u = new SpeechSynthesisUtterance(ziel.innerText.replace(/\s+/g, ' '));
    u.lang = 'de-DE'; u.rate = 0.95;
    u.onend = function () { vorlesen.setAttribute('aria-pressed', 'false'); vorlesen.textContent = 'Start'; };
    s.speak(u); vorlesen.setAttribute('aria-pressed', 'true'); vorlesen.textContent = 'Stopp';
    zu();
  });
})();
