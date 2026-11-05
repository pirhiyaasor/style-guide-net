/* ── פנקס התובענות: שאלה → תוצאות חיפוש → שיחה עם התיקים שנבחרו ──
   Four views of one page, by hash: '' the opening question, #results the 20 results
   (table or cards), #cases the conversation, #dashboard the data (pinkas-dash.js).
   Answers cite paragraphs in the cases' documents; a citation opens the document
   beside the conversation, with the cited paragraphs marked and numbered. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CASES = PINKAS.CASES, SUGGEST = PINKAS.SUGGEST;
  var byId = function (id) { return CASES.filter(function (c) { return c.id === id; })[0]; };
  var ic = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var svg = {
    chev: ic('<path d="m6 9 6 6 6-6"/>'),
    doc: ic('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>'),
    scale: ic('<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>'),
    alert: ic('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
    copy: ic('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),
    up: ic('<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>'),
    down: ic('<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>'),
    msg: ic('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>')
  };
  var reduce = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var wide = function () { return window.matchMedia('(min-width: 1181px)').matches; };
  var shortCourt = function (c) { return c.court.replace(/^בית המשפט /, '').replace(/^בית הדין /, 'בית הדין '); };
  var title = function (c) { return c.pl + ' נ\' ' + c.df; };
  var status = function (c) { return '<span class="pc-st ' + (c.open ? 'pc-st-open' : 'pc-st-closed') + '">' + (c.open ? 'פתוח' : 'סגור') + '</span>'; };
  var dateKey = function (d) { var p = d.split('.'); return p[2] + p[1] + p[0]; };

  var S = {
    view: 'welcome', query: '', results: [], sel: [], filter: { branch: '', court: '', status: '', sort: 'rel' },
    layout: null, chat: [], on: [], turns: 0, busy: false, failNext: location.hash === '#error', doc: null
  };

  /* ── search: always the 20 cases of the registry, most relevant first ── */
  function rank(q) {
    var t = q.toLowerCase();
    return CASES.map(function (c, i) {
      return { c: c, s: c.kw.filter(function (k) { return t.indexOf(k.toLowerCase()) > -1; }).length, i: i };
    }).sort(function (a, b) { return b.s - a.s || dateKey(b.c.filed).localeCompare(dateKey(a.c.filed)); })
      .map(function (x) { return x.c.id; });
  }
  function shown() {
    var f = S.filter;
    var list = S.results.map(byId).filter(function (c) {
      return (!f.branch || c.branch === f.branch) && (!f.court || shortCourt(c) === f.court) && (!f.status || (f.status === 'open') === c.open);
    });
    if (f.sort !== 'rel') list.sort(function (a, b) { var r = dateKey(a.filed).localeCompare(dateKey(b.filed)); return f.sort === 'old' ? r : -r; });
    return list;
  }

  function search(q) {
    S.query = q; S.results = rank(q); S.sel = [];
    S.filter = { branch: '', court: '', status: '', sort: 'rel' };
    ['pcFBranch', 'pcFCourt', 'pcFStatus'].forEach(function (id) { $(id).value = ''; });
    $('pcFSort').value = 'rel';
    S.chat = []; S.on = []; S.turns = 0; $('pcThread').innerHTML = ''; closeDoc();
  }
  function runSearch(q) {
    q = (q || '').trim();
    if (!q) return;
    search(q);
    $('pcAskHome').value = ''; syncSend();
    location.hash = 'results';
    var body = $('pcResBody');
    body.innerHTML = '<div class="pc-resload" role="status"><span class="pc-spin" aria-hidden="true"></span>מחפש בפנקס…</div>' +
      '<div class="pc-sk pc-skrow"></div><div class="pc-sk pc-skrow"></div><div class="pc-sk pc-skrow"></div><div class="pc-sk pc-skrow"></div>';
    $('pcResCount').textContent = '';
    setTimeout(function () {
      if (S.failNext) {
        S.failNext = false;
        body.innerHTML = '<div class="pc-notice" role="alert">' + svg.alert + '<span>לא הצלחנו להשלים את החיפוש בפנקס. השאלה שלכם נשמרה, ואפשר לנסות שוב.</span><button type="button" class="pc-linkbtn" id="pcRetry">נסה שוב</button></div>';
        $('pcRetry').addEventListener('click', function () { runSearch(q); });
        return;
      }
      renderResults();
    }, 900);
  }

  /* ── results ── */
  function docList(c) {
    if (!c.docs.length) return '<p class="pc-nodocs">לתיק הזה לא נסרקו מסמכים.</p>';
    return '<ul class="pc-doclist">' + c.docs.map(function (d, i) {
      return '<li><button type="button" class="pc-docrow" data-open-doc="' + c.id + ':' + i + '">' + svg.doc + '<span>' + esc(d.type) + '</span><small class="pc-num">' + d.date + '</small></button></li>';
    }).join('') + '</ul>';
  }
  function picked(c) { return S.sel.indexOf(c.id) > -1; }
  function pick(c, label) {
    return '<label class="pc-pick" title="בחירת התיק לשיחה"><input type="checkbox" data-pick="' + c.id + '"' + (picked(c) ? ' checked' : '') + ' aria-label="בחירת ' + esc(label || ('ת"צ ' + c.num)) + '"></label>';
  }
  function renderTable(list) {
    var all = list.length && list.every(picked);
    return '<div class="pc-tablewrap"><table class="pc-rtable"><caption class="pd-sr">תוצאות החיפוש</caption><thead><tr>' +
      '<th class="pc-ckcol"><label class="pc-pick"><input type="checkbox" id="pcPickAll"' + (all ? ' checked' : '') + ' aria-label="בחירת כל התוצאות"></label></th>' +
      '<th scope="col">מספר תיק</th><th scope="col">שם התיק</th><th scope="col">בית משפט</th><th scope="col">ענף</th>' +
      '<th scope="col"><button type="button" class="pc-sorth" data-sort-date>הוגשה' + (S.filter.sort === 'rel' ? '' : S.filter.sort === 'new' ? ' ↓' : ' ↑') + '</button></th>' +
      '<th scope="col">סטטוס</th><th scope="col">עילה</th><th scope="col"><span class="pd-sr">פרטים</span></th></tr></thead><tbody>' +
      list.map(function (c) {
        var did = 'pcd-' + c.id;
        return '<tr class="pc-rrow' + (picked(c) ? ' is-picked' : '') + '" data-case="' + c.id + '">' +
          '<td class="pc-ckcol">' + pick(c) + '</td>' +
          '<td><span class="pc-numtxt pc-num">' + c.num + '</span></td>' +
          '<td class="pc-tname">' + esc(title(c)) + '</td>' +
          '<td>' + esc(shortCourt(c)) + '</td><td>' + esc(c.branch) + '</td>' +
          '<td class="pc-num">' + c.filed + '</td><td>' + status(c) + '</td>' +
          '<td class="pc-tcause">' + esc(c.cause) + '</td>' +
          '<td><button type="button" class="pc-chev" data-expand aria-expanded="false" aria-controls="' + did + '" aria-label="פרטים ומסמכים, ת&quot;צ ' + c.num + '">' + svg.chev + '</button></td></tr>' +
          '<tr class="pc-rdetail" id="' + did + '" hidden><td></td><td colspan="8"><div class="pc-detail">' +
            '<div><h4>תקציר</h4><p>' + esc(c.sum) + '</p></div>' +
            '<div><h4>מסמכים מצורפים</h4>' + docList(c) + '</div></div></td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function renderCards(list) {
    return '<div class="pc-cards">' + list.map(function (c) {
      var mid = 'pcm-' + c.id, did = 'pcdd-' + c.id;
      return '<article class="pc-card' + (picked(c) ? ' is-picked' : '') + '" data-case="' + c.id + '">' +
        '<div class="pc-cardtop">' + pick(c) + '<span class="pc-numpill pc-num">' + c.num + '</span>' + status(c) + '</div>' +
        '<h3>' + esc(title(c)) + '</h3>' +
        '<div class="pc-cardmeta"><span>' + esc(shortCourt(c)) + '</span><span>' + esc(c.branch) + '</span><span>הוגשה ב־<span class="pc-num">' + c.filed + '</span></span></div>' +
        '<p class="pc-cardcause"><b>עילה:</b> ' + esc(c.cause) + '</p>' +
        '<button type="button" class="pc-more" data-more aria-expanded="false" aria-controls="' + mid + '"><span>הצג עוד</span>' + svg.chev + '</button>' +
        '<div class="pc-cardmore" id="' + mid + '" hidden><p>' + esc(c.sum) + '</p>' +
          (c.docs.length
            ? '<button type="button" class="pc-btn" data-showdocs aria-expanded="false" aria-controls="' + did + '">' + svg.doc + 'הצגת מסמכים (' + c.docs.length + ')</button><div id="' + did + '" hidden>' + docList(c) + '</div>'
            : '<button type="button" class="pc-btn" disabled>' + svg.doc + 'אין מסמכים סרוקים</button>') +
        '</div></article>';
    }).join('') + '</div>';
  }
  function layout() { return S.layout || (window.matchMedia('(max-width: 700px)').matches ? 'cards' : 'table'); }
  function renderResults() {
    var list = shown();
    $('pcResCount').innerHTML = 'נמצאו <b>' + S.results.length + '</b> תובענות רלוונטיות לשאלה: <q>' + esc(S.query) + '</q>' +
      (list.length < S.results.length ? ' · מוצגות ' + list.length + ' לפי הסינון' : '');
    document.querySelectorAll('[data-layout]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.layout === layout())); });
    $('pcResBody').innerHTML = list.length
      ? (layout() === 'table' ? renderTable(list) : renderCards(list))
      : '<div class="pd-empty"><b>אין תוצאות שמתאימות לסינון</b><span>אפשר לנקות את הסינון כדי לראות את כל התוצאות.</span></div>';
    syncPickbar();
  }
  function syncPickbar() {
    var n = S.sel.length;
    $('pcPickbar').hidden = !n;
    $('pcPickCount').textContent = n === 1 ? 'תיק אחד נבחר' : n + ' תיקים נבחרו';
    $('pcStartChat').innerHTML = svg.msg + 'שוחח עם התיקים (' + n + ')';
    document.querySelectorAll('#pcResBody [data-case]').forEach(function (el) { el.classList.toggle('is-picked', S.sel.indexOf(el.dataset.case) > -1); });
    var all = $('pcPickAll');
    if (all) { var l = shown(); all.checked = l.length > 0 && l.every(picked); }
  }
  function setPick(id, on) {
    S.sel = S.sel.filter(function (x) { return x !== id; });
    if (on) S.sel.push(id);
  }

  /* ── the conversation ── */
  function renderSide() {
    var on = S.on.length;
    $('pcSideCount').textContent = on + ' מתוך ' + S.chat.length;
    $('pcSideList').innerHTML = S.chat.map(function (id) {
      var c = byId(id), lid = 'pcsd-' + id, open = S.doc && S.doc.c === id;
      return '<li class="pc-sc' + (S.on.indexOf(id) > -1 ? ' is-on' : '') + (open ? ' is-open' : '') + '" data-case="' + id + '">' +
        '<div class="pc-scrow">' +
          '<label class="pc-pick" title="לכלול את התיק בשאלות"><input type="checkbox" data-chat-pick="' + id + '"' + (S.on.indexOf(id) > -1 ? ' checked' : '') + ' aria-label="לכלול בשאלות את ת&quot;צ ' + c.num + '"></label>' +
          '<div class="pc-scid"><b>' + esc(title(c)) + '</b><span><span class="pc-num">' + c.num + '</span> · ' + (c.open ? 'פתוח' : 'סגור') + '</span></div>' +
          '<button type="button" class="pc-chev" data-side-toggle aria-expanded="' + open + '" aria-controls="' + lid + '" aria-label="מסמכי התיק">' + svg.chev + '</button>' +
        '</div>' +
        '<div class="pc-scdocs" id="' + lid + '"' + (open ? '' : ' hidden') + '>' +
          (c.docs.length ? '<ul>' + c.docs.map(function (d, i) {
            var cur = S.doc && S.doc.c === id && S.doc.d === i;
            return '<li><button type="button" class="pc-scdoc" data-open-doc="' + id + ':' + i + '"' + (cur ? ' aria-current="true"' : '') + '>' + svg.doc + '<span>' + esc(d.type) + '<small class="pc-num">' + d.date + '</small></span></button></li>';
          }).join('') + '</ul>' : '<p class="pc-nodocs">לתיק הזה לא נסרקו מסמכים.</p>') +
        '</div></li>';
    }).join('');
    $('pcNoneOn').hidden = !!on;
    syncSend();
  }
  function startChat() {
    if (!S.sel.length) return;
    var same = S.chat.length === S.sel.length && S.chat.every(function (id) { return S.sel.indexOf(id) > -1; });
    if (!same) {
      var was = S.chat.length;
      S.chat = S.sel.slice(); S.on = S.sel.slice();
      if (was) systemPill('התיקים בשיחה עודכנו: ' + S.chat.length + ' תיקים. השאלות הבאות יתייחסו אליהם.');
    }
    if (!$('pcThread').children.length) intro();
    location.hash = 'cases';
  }
  function systemPill(text) {
    var d = document.createElement('div');
    d.className = 'pc-pill'; d.textContent = text;
    $('pcThread').appendChild(d);
  }
  function intro() {
    systemPill('נטענו ' + S.chat.length + ' תיקים לשיחה. אפשר לשאול אם הנושא שלכם כבר הוגש, להשוות בין התיקים או לבקש תקציר.');
  }

  /* answers: cite(c, doc, paragraph) numbers each source once, in order of use */
  function citer() {
    var list = [];
    var cite = function (c, d, p) {
      if (!c.docs[d]) return '';
      var k = c.id + ':' + d + ':' + p, n = list.indexOf(k) + 1;
      if (!n) { list.push(k); n = list.length; }
      return '<button type="button" class="pc-cite" data-n="' + n + '" aria-label="מקור ' + n + '">' + n + '</button>';
    };
    return { cite: cite, list: list };
  }
  var name = function (c) { return '<b>' + esc(c.df) + '</b> (ת"צ <span class="pc-num">' + c.num + '</span>)'; };
  var noDoc = function (c) { return c.docs.length ? '' : ' <span class="pc-nocite">(אין מסמך סרוק)</span>'; };
  function quotes(cs, cite) {
    var q = cs.filter(function (c) { return c.docs.length; }).slice(0, 2);
    return q.length ? '<h3>ציטוטים מן המקורות</h3>' + q.map(function (c) {
      var t = c.open ? c.sum : c.quote, at = c.open ? [0, 1] : [2, 1];
      return '<blockquote>"' + esc(t) + '"<footer>' + esc(c.docs[at[0]].type) + ', ' + esc(c.df) + ' ' + cite(c, at[0], at[1]) + '</footer></blockquote>';
    }).join('') : '';
  }
  function aOverlap(cs, X) {
    var live = cs.filter(function (c) { return c.open; });
    var b = '<p>בדקתי את ' + (cs.length === 1 ? 'התיק שבחרתם' : cs.length + ' התיקים שבחרתם') + ' מול השאלה שלכם.</p><h3>מה נטען בכל תיק</h3><ul>' + cs.map(function (c) {
      return '<li>' + name(c) + ': ' + esc(c.cause) + '. ' + X.cite(c, 0, 2) + ' התיק ' + (c.open ? 'פתוח' : 'סגור') + '. ' + X.cite(c, 2, c.open ? 0 : 2) + noDoc(c) + '</li>';
    }).join('') + '</ul><h3>מה זה אומר לגבי תובענה חדשה</h3>';
    b += live.length
      ? '<p>בתיקים הפתוחים הוגדרה כבר קבוצה ' + live.map(function (c) { return X.cite(c, 0, 3); }).join('') + '. כשתלויה בקשה לאישור באותן שאלות של עובדה ומשפט, בית המשפט לא ינהל בדרך כלל שני הליכים מקבילים נגד אותה משיבה. אם התובענה שלכם מכוונת לתקופה אחרת, למוצר אחר או לקבוצה אחרת, ייתכן שהיא עדיין אפשרית.</p>'
      : '<p>ההכרעה בתיקים האלה ' + cs.map(function (c) { return X.cite(c, 2, 2); }).join('') + ' מחייבת בדרך כלל את חברי הקבוצה שהוגדרה בהם. חשוב לבדוק אם המקרה שלכם נכלל בהגדרה ובתקופה.</p>';
    return { body: b + quotes(cs, X.cite) };
  }
  function aCompare(cs, X) {
    var b = '<p>השוואה בין ' + (cs.length === 1 ? 'התיק' : cs.length + ' התיקים') + ' שבחרתם:</p><div class="pc-cmpwrap"><table class="pc-cmp"><thead><tr><th>תיק</th><th>משיבה</th><th>עילה</th><th>הקבוצה</th><th>סטטוס</th><th>סכום</th></tr></thead><tbody>' +
      cs.map(function (c) {
        return '<tr><td class="pc-num">' + c.num + '</td><td>' + esc(c.df) + '</td><td>' + esc(c.cause) + ' ' + X.cite(c, 0, 2) + '</td><td>' + esc(c.group) + ' ' + X.cite(c, 0, 3) + '</td><td>' + status(c) + '</td><td><span class="pc-num">' + c.amount + '</span> ' + X.cite(c, 0, 4) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    b += cs.length > 1 ? '<p>ההבדל המרכזי הוא במשיבה ובהגדרת הקבוצה. חפיפה בעילה לבדה לא תמיד מונעת הגשה, אם המשיבה או הקבוצה שונות.</p>' : '<p>בשיחה מסומן תיק אחד בלבד. כדי להשוות, סמנו תיק נוסף בצד.</p>';
    return { body: b };
  }
  function aStatus(cs, X) {
    return { body: '<p>מה מצב כל אחד מהתיקים:</p><ul>' + cs.map(function (c) {
      return '<li>' + name(c) + ': ' + (c.open ? 'פתוח. ' + esc(c.stage) : 'סגור. ' + esc(c.outcome)) + ' ' + X.cite(c, 2, c.open ? 0 : 2) + noDoc(c) + '</li>';
    }).join('') + '</ul>' };
  }
  function aSummary(cs, X) {
    return { body: cs.map(function (c) {
      return '<h3>' + esc(title(c)) + '</h3><p>' + esc(c.sum) + ' ' + X.cite(c, 0, 1) + ' סכום התובענה: <span class="pc-num">' + c.amount + '</span>. ' + X.cite(c, 0, 4) + noDoc(c) + '</p>';
    }).join('') };
  }
  function aDefense(cs, X) {
    return { body: '<p>מה טוענות המשיבות בתשובה לבקשת האישור:</p><ul>' + cs.map(function (c) {
      return '<li>' + name(c) + ': ' + (c.defense ? esc(c.defense) + ' ' + X.cite(c, 1, 1) : 'המשיבה טרם הגישה תשובה, או שהתשובה לא נסרקה.') + '</li>';
    }).join('') + '</ul>' };
  }
  function answer(q, cs) {
    var X = citer(), named = cs.filter(function (c) { return q.indexOf(c.num) > -1; });
    if (named.length) cs = named;
    var r = /השוו|השווה|הבדל|השוואה|לעומת/.test(q) ? aCompare(cs, X)
      : /תוצא|הסתיים|נגמר|מצב|סטטוס|מה קרה|פתוח|סגור/.test(q) ? aStatus(cs, X)
      : /תקציר|סכם|סיכום|על מה|ספר לי/.test(q) ? aSummary(cs, X)
      : /טוענ|טענות|הגנה|תשובת|תשובה/.test(q) ? aDefense(cs, X)
      : aOverlap(cs, X);
    r.sources = X.list;
    return r;
  }

  function userBlock(q, cs) {
    var who = { lawyer: 'עו"ד ישראל כהן', id: 'ישראל כהן', org: 'ישראל כהן, חברת אלפא בע"מ' }[window.NH ? NH.user() : 'lawyer'];
    var d = document.createElement('div');
    d.className = 'pc-ublock';
    d.innerHTML = '<div class="pc-who"><span class="pc-av pc-av-user" aria-hidden="true">' + (who ? 'יכ' : 'א') + '</span>' + (who || 'אני') + '</div>' +
      '<div class="pc-qtag">על ' + (cs.length === 1 ? 'התיק' : cs.length + ' התיקים') + ': ' + cs.map(function (c) { return '<span class="pc-num">' + c.num + '</span>'; }).join('') + '</div><div class="pc-q"></div>';
    d.querySelector('.pc-q').textContent = q;
    return d;
  }
  function answerBlock(res, t) {
    var a = document.createElement('article');
    a.className = 'pc-a'; a.id = 'pca-' + t;
    a.dataset.sources = res.sources.join('|');
    var n = res.sources.length;
    a.innerHTML = '<div class="pc-ahead"><div class="pc-who"><span class="pc-av pc-av-bot" aria-hidden="true">' + svg.scale + '</span>פנקס התובענות' +
        (n ? '<small>· מבוסס על ' + (n === 1 ? 'מקור אחד' : n + ' מקורות') + '</small>' : '') + '</div>' +
      '<div class="pc-acts"><button type="button" class="cvs-iconbtn" data-copy title="העתקת התשובה" aria-label="העתקת התשובה">' + svg.copy + '</button>' +
      '<button type="button" class="cvs-iconbtn" data-rate aria-pressed="false" title="תשובה מועילה" aria-label="תשובה מועילה">' + svg.up + '</button>' +
      '<button type="button" class="cvs-iconbtn" data-rate aria-pressed="false" title="תשובה לא מועילה" aria-label="תשובה לא מועילה">' + svg.down + '</button></div></div>' +
      '<div class="pc-body">' + res.body + '</div>';
    return a;
  }
  function ask(q) {
    q = (q || '').trim();
    var cs = S.on.map(byId);
    if (!q || S.busy || !cs.length) return;
    var thread = $('pcThread');
    thread.appendChild(userBlock(q, cs));
    $('pcAskDock').value = ''; grow($('pcAskDock'));
    var t = ++S.turns, res = answer(q, cs);
    S.busy = true; syncSend();
    var ld = document.createElement('article');
    ld.className = 'pc-a pc-loading'; ld.setAttribute('aria-busy', 'true');
    ld.innerHTML = '<div class="pc-ahead"><div class="pc-who"><span class="pc-av pc-av-bot" aria-hidden="true">' + svg.scale + '</span>פנקס התובענות</div></div>' +
      '<div class="pc-step" role="status"><span class="pc-spin" aria-hidden="true"></span><span>קורא את מסמכי התיקים…</span></div>' +
      '<div class="pc-sk" style="width:92%"></div><div class="pc-sk" style="width:84%"></div><div class="pc-sk" style="width:66%"></div>';
    thread.appendChild(ld);
    ld.scrollIntoView({ block: 'nearest', behavior: reduce() ? 'auto' : 'smooth' });
    setTimeout(function () { var s = ld.querySelector('.pc-step span:last-child'); if (s) s.textContent = 'מנסח תשובה עם מקורות…'; }, 700);
    setTimeout(function () {
      ld.remove(); S.busy = false; syncSend();
      var a = answerBlock(res, t);
      thread.appendChild(a);
      a.scrollIntoView({ block: 'start', behavior: reduce() ? 'auto' : 'smooth' });
    }, 1400);
  }

  /* ── documents: beside the conversation on a wide screen, over the page otherwise ── */
  function paper(c, di, pins, active) {
    var d = c.docs[di];
    return '<div class="c">' + esc(c.court) + '</div><div class="n">ת"צ <span class="pc-num">' + c.num + '</span></div>' +
      '<p><b>המבקש/ת:</b> ' + esc(c.pl) + '<br><b>המשיבה:</b> ' + esc(c.df) + '</p><h4>' + esc(d.type) + '</h4>' +
      d.paras.map(function (t, i) {
        var mine = pins.filter(function (p) { return p.p === i; });
        return '<div class="pp' + (mine.length ? ' is-cited' : '') + (i === active ? ' is-active' : '') + '" data-p="' + i + '">' +
          (mine.length ? '<span class="pc-pins">' + mine.map(function (p) { return '<span class="pc-pin" title="מקור ' + p.n + '">' + p.n + '</span>'; }).join('') + '</span>' : '') +
          '<span class="pp-n">' + (i + 1) + '.</span> ' + (mine.length ? '<mark>' + esc(t) + '</mark>' : esc(t)) + '</div>';
      }).join('') +
      '<p class="pp-date">' + (di === 0 || di === 1 ? 'הוגש ביום ' : 'ניתנה היום, ') + '<span class="pc-num">' + d.date + '</span></p>' +
      '<p class="pp-demo">מסמך לדוגמה באב־טיפוס. התוכן בדוי.</p>';
  }
  var lastFocus = null;
  function openDoc(cid, di, pins, active, from) {
    var c = byId(cid);
    if (!c || !c.docs[di]) return;
    pins = pins || []; lastFocus = from || document.activeElement;
    S.doc = { c: cid, d: di };
    var head = 'ת"צ <span class="pc-num">' + c.num + '</span> · ' + esc(c.docs[di].type);
    var inline = S.view === 'cases' && wide();
    var scroll;
    if (inline) {
      $('pcViewTitle').innerHTML = head;
      $('pcViewPaper').innerHTML = paper(c, di, pins, active);
      $('pcViewer').hidden = false;
      $('pcCases').classList.add('has-doc');
      scroll = $('pcViewScroll');
    } else {
      $('pcDocTitle').innerHTML = head;
      $('pcPaper').innerHTML = paper(c, di, pins, active);
      $('pcDoc').hidden = false; $('pcDocBg').hidden = false;
      scroll = $('pcDoc').querySelector('.pc-docscroll');
      $('pcDocClose').focus();
    }
    if (S.view === 'cases') renderSide();
    var target = scroll.querySelector('.pp.is-active');
    if (target) target.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' }); else scroll.scrollTop = 0;
  }
  function closeDoc() {
    var had = S.doc;
    S.doc = null;
    $('pcViewer').hidden = true; $('pcCases').classList.remove('has-doc');
    $('pcDoc').hidden = true; $('pcDocBg').hidden = true;
    if (had && S.view === 'cases') renderSide();
    if (had && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  /* a citation: find its document and mark every paragraph that the same answer cites there */
  function openCite(btn) {
    var art = btn.closest('.pc-a'); if (!art) return;
    var keys = art.dataset.sources.split('|'), n = +btn.dataset.n, k = keys[n - 1].split(':');
    var pins = keys.map(function (x, i) { var p = x.split(':'); return { c: p[0], d: +p[1], p: +p[2], n: i + 1 }; })
      .filter(function (x) { return x.c === k[0] && x.d === +k[1]; });
    openDoc(k[0], +k[1], pins, +k[2], btn);
    art.querySelectorAll('.is-current').forEach(function (x) { x.classList.remove('is-current'); });
    art.querySelectorAll('[data-n="' + n + '"]').forEach(function (x) { x.classList.add('is-current'); });
  }

  /* ── composers ── */
  function grow(t) { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 180) + 'px'; }
  function syncSend() {
    $('pcFormHome').querySelector('.pc-send').disabled = !$('pcAskHome').value.trim();
    $('pcFormDock').querySelector('.pc-send').disabled = S.busy || !S.on.length || !$('pcAskDock').value.trim();
  }
  [['pcAskHome', 'pcFormHome', runSearch], ['pcAskDock', 'pcFormDock', ask]].forEach(function (p) {
    var t = $(p[0]), f = $(p[1]);
    t.addEventListener('input', function () { grow(t); syncSend(); });
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); p[2](t.value); } });
    f.addEventListener('submit', function (e) { e.preventDefault(); p[2](t.value); });
  });
  $('pcSuggest').innerHTML = SUGGEST.map(function (s) { return '<button type="button" class="pc-sugg">' + svg.msg + '<span>' + esc(s) + '</span></button>'; }).join('');
  $('pcSuggest').addEventListener('click', function (e) { var b = e.target.closest('.pc-sugg'); if (b) runSearch(b.textContent); });

  /* ── results interactions ── */
  var branches = [], courts = [];
  CASES.forEach(function (c) { if (branches.indexOf(c.branch) < 0) branches.push(c.branch); if (courts.indexOf(shortCourt(c)) < 0) courts.push(shortCourt(c)); });
  $('pcFBranch').innerHTML = '<option value="">כל הענפים</option>' + branches.map(function (b) { return '<option>' + esc(b) + '</option>'; }).join('');
  $('pcFCourt').innerHTML = '<option value="">כל בתי המשפט</option>' + courts.map(function (b) { return '<option>' + esc(b) + '</option>'; }).join('');
  [['pcFBranch', 'branch'], ['pcFCourt', 'court'], ['pcFStatus', 'status'], ['pcFSort', 'sort']].forEach(function (p) {
    $(p[0]).addEventListener('change', function () { S.filter[p[1]] = this.value; renderResults(); });
  });
  document.querySelectorAll('[data-layout]').forEach(function (b) {
    b.addEventListener('click', function () { S.layout = b.dataset.layout; renderResults(); });
  });
  $('pcResBody').addEventListener('change', function (e) {
    var cb = e.target;
    if (cb.id === 'pcPickAll') { shown().forEach(function (c) { setPick(c.id, cb.checked); }); renderResults(); return; }
    if (cb.dataset.pick) { setPick(cb.dataset.pick, cb.checked); syncPickbar(); }
  });
  $('pcResBody').addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('.pc-pick')) return;
    var od = t.closest('[data-open-doc]');
    if (od) { var p = od.dataset.openDoc.split(':'); openDoc(p[0], +p[1], [], -1, od); return; }
    if (t.closest('[data-sort-date]')) { S.filter.sort = S.filter.sort === 'new' ? 'old' : 'new'; $('pcFSort').value = S.filter.sort; renderResults(); return; }
    var ex = t.closest('[data-expand]');
    if (ex) { var open = ex.getAttribute('aria-expanded') !== 'true'; ex.setAttribute('aria-expanded', open); $(ex.getAttribute('aria-controls')).hidden = !open; ex.closest('tr').classList.toggle('is-open', open); return; }
    var more = t.closest('[data-more]');
    if (more) { var o = more.getAttribute('aria-expanded') !== 'true'; more.setAttribute('aria-expanded', o); more.querySelector('span').textContent = o ? 'הצג פחות' : 'הצג עוד'; $(more.getAttribute('aria-controls')).hidden = !o; return; }
    var sd = t.closest('[data-showdocs]');
    if (sd) { var s = sd.getAttribute('aria-expanded') !== 'true'; sd.setAttribute('aria-expanded', s); $(sd.getAttribute('aria-controls')).hidden = !s; return; }
  });
  $('pcPickClear').addEventListener('click', function () { S.sel = []; renderResults(); });
  $('pcStartChat').addEventListener('click', startChat);

  /* ── conversation interactions ── */
  $('pcSideList').addEventListener('change', function (e) {
    var id = e.target.dataset.chatPick; if (!id) return;
    S.on = S.chat.filter(function (x) { return x === id ? e.target.checked : S.on.indexOf(x) > -1; });
    renderSide();
  });
  $('pcSideList').addEventListener('click', function (e) {
    var t = e.target;
    var od = t.closest('[data-open-doc]');
    if (od) { var p = od.dataset.openDoc.split(':'); openDoc(p[0], +p[1], [], -1, od); return; }
    var tg = t.closest('[data-side-toggle]');
    if (tg) { var o = tg.getAttribute('aria-expanded') !== 'true'; tg.setAttribute('aria-expanded', o); $(tg.getAttribute('aria-controls')).hidden = !o; tg.closest('.pc-sc').classList.toggle('is-open', o); }
  });
  $('pcBackRes').addEventListener('click', function () { location.hash = 'results'; });
  $('pcThread').addEventListener('click', function (e) {
    var t = e.target;
    var c = t.closest('.pc-cite');
    if (c) { openCite(c); return; }
    var copy = t.closest('[data-copy]');
    if (copy) {
      var text = copy.closest('.pc-a').querySelector('.pc-body').innerText;
      var done = function () { copy.setAttribute('aria-pressed', 'true'); copy.title = 'הועתק'; setTimeout(function () { copy.setAttribute('aria-pressed', 'false'); copy.title = 'העתקת התשובה'; }, 1600); };
      try { navigator.clipboard.writeText(text).then(done, done); } catch (err) { done(); }
      return;
    }
    var rate = t.closest('[data-rate]');
    if (rate) {
      var on = rate.getAttribute('aria-pressed') !== 'true';
      rate.parentNode.querySelectorAll('[data-rate]').forEach(function (r) { r.setAttribute('aria-pressed', 'false'); });
      rate.setAttribute('aria-pressed', on);
    }
  });
  $('pcViewClose').addEventListener('click', closeDoc);
  $('pcDocClose').addEventListener('click', closeDoc);
  $('pcDocBg').addEventListener('click', closeDoc);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.doc) closeDoc(); });
  /* the inline viewer becomes an overlay when the screen narrows, and back */
  window.matchMedia('(min-width: 1181px)').addEventListener('change', function () {
    if (S.doc && S.view === 'cases') { var d = S.doc; closeDoc(); openDoc(d.c, d.d, [], -1); }
  });

  /* ── views ── */
  var SUB = {
    welcome: 'בדיקה אם כבר הוגשה תובענה ייצוגית בנושא',
    dash: 'נתונים רוחביים על התובענות הייצוגיות בפנקס'
  };
  function route(fromUser) {
    var h = location.hash;
    var v = h === '#dashboard' ? 'dash' : h === '#results' ? 'results' : h === '#cases' ? 'cases' : 'welcome';
    /* a linked view with nothing in it yet opens on the first example */
    if ((v === 'results' || v === 'cases') && !S.query) { search(SUGGEST[0]); renderResults(); }
    if (v === 'cases' && !S.chat.length) { if (!S.sel.length) S.sel = S.results.slice(0, 2); S.chat = S.sel.slice(); S.on = S.sel.slice(); intro(); }
    if (v !== S.view) closeDoc();
    S.view = v;
    var dash = v === 'dash';
    $('pcWelcome').hidden = v !== 'welcome';
    $('pcResults').hidden = v !== 'results';
    $('pcCases').hidden = v !== 'cases';
    $('pcDash').hidden = !dash;
    $('pcMain').className = 'pc-main' + (dash ? ' is-dash' : v === 'welcome' ? '' : ' is-wide');
    $('pcCrumbPinkas').hidden = !dash;
    $('pcCrumbNow').textContent = dash ? 'דשבורד נתונים' : 'פנקס התובענות הייצוגיות';
    $('pcTitle').textContent = dash ? 'דשבורד נתונים' : 'פנקס התובענות הייצוגיות';
    $('pcSubtitle').textContent = dash ? SUB.dash : SUB.welcome;
    $('pcSubtitle').hidden = !(dash || v === 'welcome');
    $('pcDashLbl').textContent = dash ? 'חזרה לפנקס' : 'דשבורד נתונים';
    $('pcNew').hidden = !(v === 'results' || v === 'cases');
    document.title = dash ? 'דשבורד נתונים' : 'פנקס התובענות הייצוגיות';
    if (dash) PinkasDash.show();
    if (v === 'results' && $('pcResBody').innerHTML === '') renderResults();
    if (v === 'results') syncPickbar();
    if (v === 'cases') renderSide();
    if (fromUser) { window.scrollTo(0, 0); $('pcTitle').focus({ preventScroll: true }); }
  }
  var back = 'welcome';
  $('pcDashBtn').addEventListener('click', function () {
    if (S.view === 'dash') location.hash = back === 'welcome' ? '' : back;
    else { back = S.view; location.hash = 'dashboard'; }
  });
  $('pcCrumbPinkas').addEventListener('click', function (e) { e.preventDefault(); location.hash = back === 'welcome' ? '' : back; });
  $('pcNew').addEventListener('click', function () {
    S.query = ''; S.results = []; S.sel = []; S.chat = []; S.on = []; S.turns = 0;
    $('pcThread').innerHTML = ''; $('pcResBody').innerHTML = ''; closeDoc();
    location.hash = '';
    $('pcAskHome').focus();
  });
  window.addEventListener('hashchange', function () { route(true); });
  syncSend();
  route(false);
})();
