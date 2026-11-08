(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var R = document.body.getAttribute('data-root') || '';
  var telHref = function (t) { return 'tel:+49' + t.replace(/[^0-9]/g, '').replace(/^0/, ''); };
  var root = document.documentElement;

  /* ---------- Menü ---------- */
  var menuBtn = $('.btn-menu'), nav = $('#nav');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { var auf = nav.classList.toggle('offen'); menuBtn.setAttribute('aria-expanded', auf); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('offen')) { nav.classList.remove('offen'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); } });
  }

  /* ---------- Ansicht (Schrift, Kontrast ...) ---------- */
  var gespeichert = {};
  try { gespeichert = JSON.parse(localStorage.getItem('cathamed-ansicht') || '{}'); } catch (e) {}
  function setze(k, v) {
    if (v && v !== '0') root.dataset[k] = v; else delete root.dataset[k];
    gespeichert[k] = v;
    try { localStorage.setItem('cathamed-ansicht', JSON.stringify(gespeichert)); } catch (e) {}
    anzeigen();
  }
  function anzeigen() {
    var s = root.dataset.schrift || '0';
    $$('button[data-schrift]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-schrift') === s ? 'true' : 'false'); });
    $$('[data-stufe="schrift"] button').forEach(function (b) { b.setAttribute('aria-pressed', s === b.dataset.wert ? 'true' : 'false'); });
    $$('[data-schalter]').forEach(function (b) { var an = root.dataset[b.dataset.schalter] === '1'; b.setAttribute('aria-pressed', an); b.textContent = an ? 'An' : 'Aus'; });
  }
  anzeigen();
  $$('button[data-schrift]').forEach(function (b) { b.addEventListener('click', function () { setze('schrift', b.getAttribute('data-schrift')); }); });
  $$('[data-stufe="schrift"] button').forEach(function (b) { b.addEventListener('click', function () { setze('schrift', b.dataset.wert); }); });
  $$('[data-schalter]').forEach(function (b) { b.addEventListener('click', function () { setze(b.dataset.schalter, root.dataset[b.dataset.schalter] === '1' ? '0' : '1'); }); });

  var dlg = $('#a11y'), oeffner = $('.btn-a11y');
  function esc(e) {
    if (e.key === 'Escape') zu();
    if (e.key === 'Tab') {
      var f = $$('button:not([disabled]), a', $('.a11y-panel')); var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  function auf() { dlg.classList.add('offen'); $('.a11y-zu').focus(); document.addEventListener('keydown', esc); }
  function zu() { dlg.classList.remove('offen'); document.removeEventListener('keydown', esc); oeffner.focus(); }
  if (oeffner) oeffner.addEventListener('click', auf);
  $$('[data-zu]').forEach(function (b) { b.addEventListener('click', zu); });

  var vorlesen = $('#vorlesen');
  if (vorlesen) {
    if (!('speechSynthesis' in window)) { vorlesen.disabled = true; vorlesen.textContent = 'nicht verfügbar'; }
    vorlesen.addEventListener('click', function () {
      var s = window.speechSynthesis;
      if (s.speaking) { s.cancel(); vorlesen.setAttribute('aria-pressed', 'false'); vorlesen.textContent = 'Start'; return; }
      var abschnitte = $$('main > section, main > nav'), mitte = window.innerHeight / 2, ziel = $('main');
      abschnitte.forEach(function (a) { var r = a.getBoundingClientRect(); if (r.top <= mitte && r.bottom >= mitte) ziel = a; });
      var u = new SpeechSynthesisUtterance(ziel.innerText.replace(/\s+/g, ' '));
      u.lang = 'de-DE'; u.rate = 0.95;
      u.onend = function () { vorlesen.setAttribute('aria-pressed', 'false'); vorlesen.textContent = 'Start'; };
      s.speak(u); vorlesen.setAttribute('aria-pressed', 'true'); vorlesen.textContent = 'Stopp';
      zu();
    });
  }

  /* ---------- Karte und Ortsblatt (Startseite) ---------- */
  var svg = $('#karte');
  if (svg && window.D) {
    var NS = 'http://www.w3.org/2000/svg';
    var O = D.orte, schluessel = Object.keys(O), start = O.steinfurt, wege = {};
    var inOrt = function (k) { return D.einrichtungen.filter(function (e) { return e.ort === k; }); };
    schluessel.forEach(function (k) {
      if (k === 'steinfurt') return;
      var o = O[k], mx = (start.x + o.x) / 2, my = (start.y + o.y) / 2, dx = o.x - start.x, dy = o.y - start.y;
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', 'M' + start.x + ' ' + start.y + ' Q' + (mx - dy * 0.18).toFixed(1) + ' ' + (my + dx * 0.18).toFixed(1) + ' ' + o.x + ' ' + o.y);
      p.setAttribute('class', 'weg'); svg.appendChild(p);
      try { p.style.setProperty('--len', Math.ceil(p.getTotalLength())); } catch (e) {}
      wege[k] = p;
    });
    var st = document.createElementNS(NS, 'text');
    st.setAttribute('x', start.x - 24); st.setAttribute('y', start.y + 24); st.setAttribute('class', 'start'); st.setAttribute('text-anchor', 'end');
    st.textContent = 'SEIT 1995'; svg.appendChild(st);
    var lp = { ochtrup: 'oben', sassenberg: 'oben', everswinkel: 'unten', beelen: 'unten', laer: 'links', steinfurt: 'links' };
    schluessel.forEach(function (k) {
      var o = O[k], n = inOrt(k).length;
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'punkt'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', o.name + ' anzeigen'); g.dataset.ort = k;
      var r = 6 + Math.min(n, 5) * 1.6;
      var c = document.createElementNS(NS, 'circle'); c.setAttribute('cx', o.x); c.setAttribute('cy', o.y); c.setAttribute('r', r);
      var t = document.createElementNS(NS, 'text'), pos = lp[k] || 'rechts';
      if (pos === 'oben') { t.setAttribute('x', o.x); t.setAttribute('y', o.y - r - 8); t.setAttribute('text-anchor', 'middle'); }
      else if (pos === 'unten') { t.setAttribute('x', o.x); t.setAttribute('y', o.y + r + 16); t.setAttribute('text-anchor', 'middle'); }
      else if (pos === 'links') { t.setAttribute('x', o.x - r - 6); t.setAttribute('y', o.y + 5); t.setAttribute('text-anchor', 'end'); }
      else { t.setAttribute('x', o.x + r + 6); t.setAttribute('y', o.y + 5); }
      t.textContent = o.name;
      g.appendChild(c); g.appendChild(t);
      g.addEventListener('click', function () { zeigeOrt(k); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); zeigeOrt(k); } });
      svg.appendChild(g);
    });
    var mWahl = $('#ortswahl-m');
    schluessel.forEach(function (k) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = O[k].name; b.dataset.ort = k; b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () { zeigeOrt(k); });
      mWahl.appendChild(b);
    });
    var reihe = ['zuhause', 'tag', 'wg', 'wohnen', 'intensiv'];
    var zeigeOrt = function (k) {
      var o = O[k], liste = inOrt(k);
      var nSt = D.stellen.filter(function (s) { return s.o.indexOf(k) > -1; }).length;
      var h = '<div class="ortsblatt-kopf"><h3><a href="' + R + 'orte/' + k + '/">' + o.name + '</a></h3><p>' + (o.unter || (liste.length + (liste.length === 1 ? ' Einrichtung' : ' Einrichtungen') + ' vor Ort')) + '</p></div>';
      reihe.forEach(function (art) {
        var g = liste.filter(function (e) { return e.typ === art; });
        if (!g.length) return;
        h += '<div class="gruppe"><h4>' + D.typen[art] + '</h4>';
        var ohne = false;
        g.forEach(function (e) {
          if (!e.tel) ohne = true;
          h += '<div class="eintrag' + (e.tel ? '' : ' ohne') + '"><b><a href="' + R + 'einrichtungen/' + e.slug + '/">' + e.name + '</a>' + (e.frei ? '<span class="frei">frei</span>' : '') + '</b><span>' + e.adresse + '</span>' +
            (e.tel ? '<a class="tel" href="' + telHref(e.tel) + '" aria-label="' + e.name + ' anrufen: ' + e.tel + '">' + e.tel + '</a>' : '') + '</div>';
        });
        if (ohne) h += '<div class="gruppe-tel"><span>Fragen, Besichtigung, Einzug: Pflegeberatung</span><a class="tel" href="' + telHref(D.beratung) + '" aria-label="Pflegeberatung anrufen: ' + D.beratung + '">' + D.beratung + '</a></div>';
        h += '</div>';
      });
      h += '<div class="ortsblatt-fuss"><a class="btn" href="' + R + 'orte/' + k + '/">Alles in ' + o.name + ' ansehen</a>' +
        (nSt ? '<a href="' + R + 'karriere/?ort=' + k + '#stellen">' + nSt + (nSt === 1 ? ' offene Stelle' : ' offene Stellen') + '</a>' : '') + '</div>';
      $('#ortsblatt').innerHTML = h;
      $$('.punkt').forEach(function (p) { p.classList.toggle('an', p.dataset.ort === k); });
      Object.keys(wege).forEach(function (w) { wege[w].classList.toggle('an', w === k); });
      $$('#ortswahl-m button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.ort === k ? 'true' : 'false'); });
    };
    zeigeOrt('steinfurt');
  }

  /* ---------- Reiter "Was brauchen Sie" ---------- */
  var tabs = $$('[role=tab]');
  function waehle(tab, fokus) {
    tabs.forEach(function (t) { var an = t === tab; t.setAttribute('aria-selected', an); t.tabIndex = an ? 0 : -1; document.getElementById(t.getAttribute('aria-controls')).hidden = !an; });
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

  /* ---------- Karriere: Filter, Stelle vorwählen ---------- */
  var filter = $('#filter');
  var params = new URLSearchParams(location.search);
  if (filter && window.D) {
    var zeigeStellen = function (k) {
      $$('#stellen .stelle').forEach(function (li, i) { var s = D.stellen[i]; li.hidden = !(k === 'alle' || s.o.indexOf(k) > -1); });
      $$('#filter button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.f === k ? 'true' : 'false'); });
    };
    filter.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) zeigeStellen(b.dataset.f); });
    if (params.get('ort') && D.orte[params.get('ort')]) zeigeStellen(params.get('ort'));
    var sel = $('#b-stelle');
    if (sel && params.get('stelle') && D.stellen[+params.get('stelle')]) sel.value = params.get('stelle');
    $$('#stellen .btn-stelle').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var m = a.getAttribute('href').match(/stelle=(\d+)/);
        if (m && sel) { e.preventDefault(); sel.value = m[1]; $('#kurzbewerbung').scrollIntoView({ block: 'start' }); setTimeout(function () { $('#b-kontakt').focus({ preventScroll: true }); }, 400); }
      });
    });
  }

  /* ---------- Formulare (Demo) ---------- */
  function absenden(form, feld, fehler, danke) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!feld.value.trim()) { fehler.hidden = false; feld.setAttribute('aria-invalid', 'true'); feld.focus(); return; }
      fehler.hidden = true; feld.removeAttribute('aria-invalid');
      var box = document.createElement('div');
      box.className = 'danke'; box.setAttribute('role', 'status'); box.tabIndex = -1;
      box.innerHTML = danke(form);
      form.replaceWith(box); box.focus();
    });
  }
  var fb = $('#form-bewerbung');
  if (fb) absenden(fb, $('#b-kontakt'), $('#b-fehler'), function (f) {
    var s = f.stelle.value === 'initiativ' ? 'Initiativbewerbung' : D.stellen[+f.stelle.value].t;
    return '<h3>Danke, deine Bewerbung ist angekommen.</h3><p>In der fertigen Seite geht die Kurzbewerbung „' + s + '“ an die Personalabteilung. Sie meldet sich dann bei dir' + (f.zeit.value ? ', am liebsten ' + f.zeit.value : '') + '.</p><p><b>Entwurf:</b> Es wurde nichts versendet.</p>';
  });
  $$('.form-kontakt').forEach(function (f) {
    var feld = $('input[name=kontakt]', f), fehler = $('.fehler', f);
    absenden(f, feld, fehler, function (f) {
      var o = f.ort.value && window.D ? ' in ' + D.orte[f.ort.value].name : '';
      return '<h3>Danke, Ihre Nachricht ist angekommen.</h3><p>In der fertigen Seite ginge sie direkt an das passende Team' + o + '. Das Team meldet sich dann bei Ihnen.</p><p><b>Entwurf:</b> Es wurde nichts versendet.</p>';
    });
  });
})();
