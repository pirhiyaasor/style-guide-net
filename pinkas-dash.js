/* דשבורד הנתונים של פנקס התובענות. כל הנתונים בדויים: 1,284 רשומות שנוצרות
   מזרע קבוע, כך שהמספרים זהים בכל טעינה וכל סינון מחשב מחדש את כל הדשבורד. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fmt = function (n) { return Number(n).toLocaleString('he-IL'); };
  var pct = function (a, b) { return b ? Math.round(a / b * 100) : 0; };

  var FIRST = 2012, LAST = 2026;
  var FIELDS = [
    { name: 'צרכנות', w: 30, df: ['רשת חיסכון בע"מ', 'מאפיית השרון בע"מ', 'מחלבות העמק בע"מ', 'שופ־אונליין בע"מ'] },
    { name: 'תקשורת', w: 16, df: ['נתיב תקשורת סלולרית בע"מ', 'גל־קו תקשורת בע"מ', 'אורן סיבים בע"מ'] },
    { name: 'ביטוח', w: 15, df: ['מגן ביטוח ישיר בע"מ', 'אופק ביטוח בע"מ', 'הראל־ים חברה לביטוח בע"מ'] },
    { name: 'בנקאות', w: 13, df: ['בנק הגליל בע"מ', 'בנק מרכז בע"מ', 'אשראי פלוס בע"מ'] },
    { name: 'עבודה', w: 10, df: ['כוח אדם מקצועי בע"מ', 'שירותי ניקיון ארצי בע"מ'] },
    { name: 'תחבורה', w: 7, df: ['קווי הצפון בע"מ', 'דרך ארץ הסעות בע"מ'] },
    { name: 'סביבה', w: 5, df: ['מפעלי הכרמל בע"מ', 'תעשיות נגב בע"מ'] },
    { name: 'אחר', w: 4, df: ['עיריית השפלה', 'רשות המים האזורית'] }
  ];
  var COURTS = [
    { name: 'מחוזי מרכז', w: 30 }, { name: 'מחוזי תל אביב־יפו', w: 28 }, { name: 'מחוזי חיפה', w: 13 },
    { name: 'מחוזי ירושלים', w: 11 }, { name: 'מחוזי צפון', w: 6 }, { name: 'מחוזי באר שבע', w: 5 }, { name: 'בתי הדין לעבודה', w: 7 }
  ];
  var STATUS = { pending: 'תלויה ועומדת', approved: 'אושרה כייצוגית', settled: 'הסתיימה בפשרה', rejected: 'הבקשה נדחתה', withdrawn: 'הסתלקות או מחיקה' };
  var OUTCOMES = ['approved', 'settled', 'rejected', 'withdrawn'];

  /* ── נתוני דמה ── */
  function seeded(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var R = seeded(1284);
  function pick(list) {
    var sum = list.reduce(function (s, x) { return s + x.w; }, 0), r = R() * sum;
    for (var i = 0; i < list.length; i++) { r -= list[i].w; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }
  function yearOf() {
    /* the filings grow until a peak in 2019 and then settle; 2026 is a partial year */
    var w = [];
    for (var y = FIRST; y <= LAST; y++) w.push({ y: y, w: y === LAST ? 40 : y <= 2019 ? 25 + (y - FIRST) * 16 : 130 - (y - 2019) * 7 });
    return pick(w).y;
  }
  function statusOf(field, age) {
    var open = Math.max(.04, 1 - age * .17);
    if (R() < open) return 'pending';
    var r = R(), good = field === 'ביטוח' || field === 'בנקאות' ? .1 : field === 'סביבה' ? -.1 : 0;
    return r < .14 ? 'approved' : r < .44 + good ? 'settled' : r < .76 + good / 2 ? 'rejected' : 'withdrawn';
  }
  var DATA = [];
  for (var i = 0; i < 1284; i++) {
    var f = pick(FIELDS), year = yearOf(), age = LAST - year;
    var court = f.name === 'עבודה' && R() < .8 ? 'בתי הדין לעבודה' : pick(COURTS).name;
    var st = statusOf(f.name, age);
    DATA.push({
      year: year, field: f.name, court: court, status: st,
      df: f.df[Math.floor(Math.pow(R(), 1.6) * f.df.length)],
      months: st === 'pending' ? null : Math.round(Math.min(age * 12 + 3, 6 + 60 * Math.pow(R(), 1.5))),
      amount: Math.round(Math.exp(16.1 + (R() + R() + R() - 1.5) * 1.5) / 1e5) / 10
    });
  }

  /* ── סינון ── */
  var F = { field: '', court: '', status: '', from: FIRST, to: LAST };
  function rows() {
    return DATA.filter(function (d) {
      return (!F.field || d.field === F.field) && (!F.court || d.court === F.court) && (!F.status || d.status === F.status) && d.year >= F.from && d.year <= F.to;
    });
  }
  function count(list, key) {
    var m = {};
    list.forEach(function (d) { m[d[key]] = (m[d[key]] || 0) + 1; });
    return m;
  }
  function median(a) {
    if (!a.length) return 0;
    a = a.slice().sort(function (x, y) { return x - y; });
    var h = a.length >> 1;
    return a.length % 2 ? a[h] : (a[h - 1] + a[h]) / 2;
  }
  var isLive = function (d) { return d.status === 'pending' || d.status === 'approved'; };
  var isGood = function (d) { return d.status === 'approved' || d.status === 'settled'; };
  function goodRate(list) {
    var done = list.filter(function (d) { return d.status !== 'pending'; });
    return { rate: pct(done.filter(isGood).length, done.length), done: done.length };
  }
  var months = function (list) { return median(list.filter(function (d) { return d.months != null; }).map(function (d) { return d.months; })); };
  var money = function (m) { return (m >= 10 ? Math.round(m) : m.toFixed(1)) + ' מיליון ₪'; };

  /* ── בניית הדשבורד ── */
  function card(id, title, sub, cls) {
    return '<section class="pd-card ' + (cls || '') + '" aria-labelledby="' + id + 'H"><h3 id="' + id + 'H">' + title + '</h3>' + (sub ? '<p class="pd-sub">' + sub + '</p>' : '') + '<div id="' + id + '"></div></section>';
  }
  function select(id, label, opts) {
    return '<label class="pd-filter"><span>' + label + '</span><span class="pd-selwrap"><select id="' + id + '">' +
      opts.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join('') +
      '</select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></span></label>';
  }
  function build() {
    var names = function (list) { return [['', 'הכול']].concat(list.map(function (x) { return [x.name, x.name]; })); };
    var years = [];
    for (var y = FIRST; y <= LAST; y++) years.push([String(y), String(y)]);
    $('pcDash').innerHTML =
      '<div class="pd-filters" role="group" aria-label="סינון הנתונים">' +
        select('pdField', 'תחום', names(FIELDS)) + select('pdCourt', 'בית משפט', names(COURTS)) +
        select('pdStatus', 'מצב התיק', [['', 'הכול']].concat(Object.keys(STATUS).map(function (k) { return [k, STATUS[k]]; }))) +
        select('pdFrom', 'משנת', years) + select('pdTo', 'עד שנת', years) +
        '<div class="pd-filteracts"><button type="button" class="pc-linkbtn" id="pdClear">ניקוי</button><button type="button" class="pc-btn" id="pdCsv"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>ייצוא CSV</button></div>' +
      '</div>' +
      '<div class="pd-count" id="pdCount" role="status"></div>' +
      '<div id="pdBody">' +
        '<div class="pd-kpis" id="pdKpis"></div>' +
        '<section class="pd-insights" aria-labelledby="pdInsH"><h3 id="pdInsH">מה בולט בנתונים</h3><ul id="pdIns"></ul></section>' +
        '<div class="pd-grid">' +
          card('pdYears', 'הגשות לפי שנה', 'מספר התובענות שהוגשו בכל שנה. שנת ' + LAST + ' עדיין חלקית.', 'pd-c8') +
          card('pdStat', 'מצב התיקים', 'כמה תיקים בכל מצב', 'pd-c4') +
          card('pdFields', 'תחומים', 'לחיצה על תחום מסננת את כל הדשבורד', 'pd-c5') +
          card('pdOut', 'איך הסתיימו התיקים, לפי תחום', 'חלוקה באחוזים, מתוך התיקים שכבר התקבלה בהם הכרעה', 'pd-c7') +
          card('pdHeat', 'נושאים חמים: תחום מול שנה', 'כמה תובענות הוגשו בכל תחום בעשר השנים האחרונות', 'pd-c12') +
          card('pdCourts', 'בתי משפט', 'כמה תיקים בכל ערכאה, ומשך הזמן החציוני עד הכרעה', 'pd-c5') +
          card('pdDfs', 'המשיבות שנתבעו הכי הרבה', 'עוזר לבדוק אם נגד משיבה מסוימת כבר תלויים תיקים', 'pd-c7') +
        '</div>' +
      '</div>' +
      '<div class="pd-empty" id="pdEmpty" hidden><b>אין תיקים שמתאימים לסינון</b><span>אפשר להרחיב את טווח השנים או לנקות את הסינון.</span></div>' +
      '<p class="pc-disclaim pd-note">כל הנתונים בעמוד בדויים ומוצגים להדגמה בלבד.</p>' +
      '<div class="pd-tip" id="pdTip" role="tooltip" hidden></div>';

    $('pdTo').value = String(LAST);
    [['pdField', 'field'], ['pdCourt', 'court'], ['pdStatus', 'status']].forEach(function (p) {
      $(p[0]).addEventListener('change', function () { F[p[1]] = this.value; draw(); });
    });
    $('pdFrom').addEventListener('change', function () { F.from = +this.value; if (F.to < F.from) { F.to = F.from; $('pdTo').value = this.value; } draw(); });
    $('pdTo').addEventListener('change', function () { F.to = +this.value; if (F.from > F.to) { F.from = F.to; $('pdFrom').value = this.value; } draw(); });
    $('pdClear').addEventListener('click', clear);
    $('pdCsv').addEventListener('click', csv);
    $('pdFields').addEventListener('click', function (e) {
      var b = e.target.closest('[data-field]'); if (!b) return;
      F.field = F.field === b.dataset.field ? '' : b.dataset.field;
      $('pdField').value = F.field;
      draw();
    });
    /* one tooltip for every mark in the dashboard */
    var tip = $('pdTip');
    function show(el) {
      tip.textContent = el.dataset.tip; tip.hidden = false;
      var r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
      tip.style.left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)) + 'px';
      tip.style.top = (r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8) + 'px';
    }
    ['mouseover', 'focusin'].forEach(function (t) {
      $('pcDash').addEventListener(t, function (e) { var el = e.target.closest('[data-tip]'); if (el) show(el); else tip.hidden = true; });
    });
    $('pcDash').addEventListener('mouseleave', function () { tip.hidden = true; });
    window.addEventListener('scroll', function () { tip.hidden = true; }, { passive: true });
  }
  function clear() {
    F = { field: '', court: '', status: '', from: FIRST, to: LAST };
    $('pdField').value = ''; $('pdCourt').value = ''; $('pdStatus').value = '';
    $('pdFrom').value = String(FIRST); $('pdTo').value = String(LAST);
    draw();
  }
  function csv() {
    var head = ['שנת הגשה', 'תחום', 'בית משפט', 'משיבה', 'מצב', 'חודשים עד הכרעה', 'סכום התביעה (מיליון ₪)'];
    var q = function (s) { return '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"'; };
    var text = [head].concat(rows().map(function (d) { return [d.year, d.field, d.court, d.df, STATUS[d.status], d.months, d.amount]; }))
      .map(function (r) { return r.map(q).join(','); }).join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }));
    a.download = 'pinkas-tovanot-demo.csv';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ── הרכיבים ── */
  function dataTable(summary, head, body) {
    return '<details class="pd-tablewrap"><summary>הצגה כטבלה</summary><div class="pd-scroll"><table class="pd-table"><caption class="pd-sr">' + summary + '</caption><thead><tr>' +
      head.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      body.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></details>';
  }
  function drawKpis(list) {
    var live = list.filter(isLive).length, g = goodRate(list), m = months(list);
    var tiles = [
      ['תובענות בפנקס', fmt(list.length), list.length === DATA.length ? 'כל השנים והתחומים' : 'מתוך ' + fmt(DATA.length)],
      ['תיקים פעילים', fmt(live), pct(live, list.length) + '% מהתיקים'],
      ['אישור או פשרה', g.done ? g.rate + '%' : '–', 'מתוך ' + fmt(g.done) + ' תיקים שהוכרעו'],
      ['משך עד הכרעה', m ? Math.round(m) + ' חודשים' : '–', 'חציון'],
      ['סכום תביעה', money(median(list.map(function (d) { return d.amount; }))), 'חציון']
    ];
    $('pdKpis').innerHTML = tiles.map(function (t) { return '<div class="pd-kpi"><span>' + t[0] + '</span><b>' + t[1] + '</b><small>' + t[2] + '</small></div>'; }).join('');
  }
  function drawInsights(list) {
    var out = [], c = count(list, 'field');
    var top = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0];
    if (!F.field && top) out.push('<b>' + esc(top) + '</b> הוא התחום הנפוץ ביותר, עם ' + pct(c[top], list.length) + '% מהתיקים.');
    var y = count(list, 'year'), a = y[LAST - 1] || 0, b = y[LAST - 2] || 0;
    if (a && b) {
      var d = Math.round((a - b) / b * 100);
      out.push('ב־' + (LAST - 1) + ' הוגשו <b>' + fmt(a) + '</b> תובענות, ' + (d === 0 ? 'בדיוק כמו' : (d > 0 ? 'עלייה של ' : 'ירידה של ') + Math.abs(d) + '% לעומת') + ' ' + (LAST - 2) + '.');
    }
    var best = FIELDS.map(function (f) { var g = goodRate(list.filter(function (x) { return x.field === f.name; })); return { n: f.name, r: g.rate, d: g.done }; })
      .filter(function (x) { return x.d >= 15; }).sort(function (p, q) { return q.r - p.r; })[0];
    if (!F.field && best) out.push('שיעור האישור או הפשרה הגבוה ביותר הוא בתחום <b>' + esc(best.n) + '</b>: ' + best.r + '% מהתיקים שהוכרעו.');
    var lv = count(list.filter(isLive), 'df'), who = Object.keys(lv).sort(function (p, q) { return lv[q] - lv[p]; })[0];
    if (who) out.push('הכי הרבה תיקים פעילים הם נגד <b>' + esc(who) + '</b>: ' + fmt(lv[who]) + ' תיקים.');
    $('pdIns').innerHTML = out.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }
  function niceMax(m) {
    if (m <= 5) return 5;
    var p = Math.pow(10, Math.floor(Math.log10(m))), s = m / p;
    return (s <= 2 ? 2 : s <= 5 ? 5 : 10) * p;
  }
  function drawYears(list) {
    var c = count(list, 'year'), ys = [];
    for (var y = F.from; y <= F.to; y++) ys.push(y);
    var mx = Math.max.apply(null, ys.map(function (y) { return c[y] || 0; })), top = niceMax(mx);
    var peak = ys.filter(function (y) { return (c[y] || 0) === mx; })[0];
    var grid = [1, .5, 0].map(function (t) { return '<div class="pd-gl" style="bottom:' + t * 100 + '%"><span class="pc-num">' + fmt(top * t) + '</span></div>'; }).join('');
    var cols = ys.map(function (y) {
      var n = c[y] || 0;
      return '<div class="pd-col' + (y === LAST ? ' is-partial' : '') + '" tabindex="0" data-tip="' + y + (y === LAST ? ' (שנה חלקית)' : '') + ': ' + fmt(n) + ' תובענות">' +
        '<div class="pd-colbar" style="height:' + (n / top * 100) + '%">' + (y === peak && n ? '<em class="pc-num">' + fmt(n) + '</em>' : '') + '</div></div>';
    }).join('');
    var labels = ys.map(function (y) { return '<span class="pc-num' + (ys.length > 8 && (LAST - y) % 2 ? ' pd-thin' : '') + '">' + y + '</span>'; }).join('');
    $('pdYears').innerHTML = '<div class="pd-plot">' + grid + '<div class="pd-cols">' + cols + '</div></div><div class="pd-xlabels">' + labels + '</div>' +
      dataTable('הגשות לפי שנה', ['שנה', 'תובענות'], ys.map(function (y) { return [y, fmt(c[y] || 0)]; }));
  }
  function bars(items, opts) {
    var mx = Math.max.apply(null, items.map(function (x) { return x.n; }).concat(1));
    return '<div class="pd-bars">' + items.map(function (x) {
      var inner = '<span class="pd-blabel">' + esc(x.name) + '</span><span class="pd-track"><i style="width:' + (x.n ? Math.max(1, x.n / mx * 100) : 0) + '%"></i></span><span class="pd-bval pc-num">' + fmt(x.n) + '</span>';
      var tip = esc(x.name) + ': ' + fmt(x.n) + ' תיקים (' + opts.of(x.n) + '%)';
      return opts.click
        ? '<button type="button" class="pd-bar pd-barbtn" data-field="' + esc(x.name) + '" aria-pressed="' + (F.field === x.name) + '" data-tip="' + tip + '">' + inner + '</button>'
        : '<div class="pd-bar" data-tip="' + tip + '">' + inner + '</div>';
    }).join('') + '</div>';
  }
  function drawStatus(list) {
    var c = count(list, 'status');
    $('pdStat').innerHTML = bars(Object.keys(STATUS).map(function (k) { return { name: STATUS[k], n: c[k] || 0 }; }), { of: function (n) { return pct(n, list.length); } });
  }
  function fieldOrder(list) {
    var c = count(list, 'field');
    return FIELDS.map(function (f) { return { name: f.name, n: c[f.name] || 0 }; }).sort(function (a, b) { return b.n - a.n; });
  }
  function drawFields(list) {
    /* the field filter is what this chart sets, so it keeps showing every field */
    var base = DATA.filter(function (d) { return (!F.court || d.court === F.court) && (!F.status || d.status === F.status) && d.year >= F.from && d.year <= F.to; });
    $('pdFields').innerHTML = bars(fieldOrder(base), { click: true, of: function (n) { return pct(n, base.length); } });
  }
  function drawOutcomes(list) {
    var fs = fieldOrder(list).filter(function (x) { return x.n; }).map(function (x) {
      var done = list.filter(function (d) { return d.field === x.name && d.status !== 'pending'; }), c = count(done, 'status');
      return { name: x.name, done: done.length, c: c };
    }).filter(function (x) { return x.done; });
    if (!fs.length) { $('pdOut').innerHTML = '<p class="pd-none">עדיין אין תיקים שהוכרעו בסינון הזה.</p>'; return; }
    var legend = '<div class="pd-legend">' + OUTCOMES.map(function (k, i) { return '<span><i class="pd-s' + i + '"></i>' + STATUS[k] + '</span>'; }).join('') + '</div>';
    var body = fs.map(function (f) {
      return '<div class="pd-stack"><span class="pd-blabel">' + esc(f.name) + '</span><span class="pd-stacktrack">' + OUTCOMES.map(function (k, i) {
        var n = f.c[k] || 0;
        return n ? '<i class="pd-s' + i + '" tabindex="0" style="flex:' + n + ' 0 0" data-tip="' + esc(f.name) + ', ' + STATUS[k] + ': ' + pct(n, f.done) + '% (' + fmt(n) + ' מתוך ' + fmt(f.done) + ')"></i>' : '';
      }).join('') + '</span></div>';
    }).join('');
    $('pdOut').innerHTML = legend + body + dataTable('תוצאות לפי תחום, באחוזים', ['תחום'].concat(OUTCOMES.map(function (k) { return STATUS[k]; })).concat('הוכרעו'),
      fs.map(function (f) { return [esc(f.name)].concat(OUTCOMES.map(function (k) { return pct(f.c[k] || 0, f.done) + '%'; })).concat(fmt(f.done)); }));
  }
  function drawHeat(list) {
    var ys = [];
    for (var y = Math.max(F.from, LAST - 9); y <= F.to; y++) ys.push(y);
    var fs = fieldOrder(list).filter(function (x) { return x.n; });
    if (!ys.length) { $('pdHeat').innerHTML = '<p class="pd-none">התצוגה מכסה את עשר השנים האחרונות בלבד. כדאי לבחור טווח שנים מאוחר יותר.</p>'; return; }
    var cell = {}, mx = 1;
    list.forEach(function (d) { var k = d.field + d.year; cell[k] = (cell[k] || 0) + 1; if (ys.indexOf(d.year) > -1 && cell[k] > mx) mx = cell[k]; });
    /* one hue, light to dark: the brand tint up to the brand navy */
    var mix = function (t) { var a = [232, 239, 249], b = [10, 59, 143]; return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; };
    var rowsHtml = fs.map(function (f) {
      return '<tr><th scope="row">' + esc(f.name) + '</th>' + ys.map(function (y) {
        var n = cell[f.name + y] || 0, t = n / mx;
        return '<td tabindex="0" class="pc-num" style="background:' + (n ? mix(t) : 'transparent') + ';color:' + (t > .5 ? '#fff' : 'var(--pc-ink)') + '" data-tip="' + esc(f.name) + ', ' + y + ': ' + fmt(n) + ' תובענות">' + (n || '') + '</td>';
      }).join('') + '</tr>';
    }).join('');
    $('pdHeat').innerHTML = '<div class="pd-scroll"><table class="pd-heat"><caption class="pd-sr">מספר התובענות לפי תחום ושנה</caption><thead><tr><td></td>' +
      ys.map(function (y) { return '<th scope="col" class="pc-num">' + y + '</th>'; }).join('') + '</tr></thead><tbody>' + rowsHtml + '</tbody></table></div>' +
      '<div class="pd-scale"><span class="pc-num">0</span><i></i><span class="pc-num">' + fmt(mx) + '</span></div>';
  }
  function drawCourts(list) {
    var c = count(list, 'court');
    var items = COURTS.map(function (x) { return { name: x.name, n: c[x.name] || 0 }; }).filter(function (x) { return x.n; }).sort(function (a, b) { return b.n - a.n; });
    var mx = items.length ? items[0].n : 1;
    $('pdCourts').innerHTML = '<div class="pd-scroll"><table class="pd-table"><thead><tr><th scope="col">ערכאה</th><th scope="col">תיקים</th><th scope="col">עד הכרעה</th></tr></thead><tbody>' + items.map(function (x) {
      var m = months(list.filter(function (d) { return d.court === x.name; }));
      return '<tr><td>' + esc(x.name) + '</td><td class="pd-cellbar"><span class="pd-track"><i style="width:' + (x.n / mx * 100) + '%"></i></span><span class="pc-num">' + fmt(x.n) + '</span></td><td>' + (m ? '<span class="pc-num">' + Math.round(m) + '</span> חודשים' : '–') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  }
  function drawDefendants(list) {
    var by = {};
    list.forEach(function (d) { (by[d.df] = by[d.df] || []).push(d); });
    var top = Object.keys(by).sort(function (a, b) { return by[b].length - by[a].length; }).slice(0, 7);
    $('pdDfs').innerHTML = '<div class="pd-scroll"><table class="pd-table"><thead><tr><th scope="col">משיבה</th><th scope="col">תחום</th><th scope="col">תיקים</th><th scope="col">פעילים</th><th scope="col">אישור או פשרה</th></tr></thead><tbody>' + top.map(function (n) {
      var l = by[n], g = goodRate(l);
      return '<tr><td>' + esc(n) + '</td><td>' + esc(l[0].field) + '</td><td class="pc-num">' + fmt(l.length) + '</td><td class="pc-num">' + fmt(l.filter(isLive).length) + '</td><td class="pc-num">' + (g.done ? g.rate + '%' : '–') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
  }
  function draw() {
    var list = rows();
    $('pdTip').hidden = true;
    $('pdCount').textContent = 'מוצגים ' + fmt(list.length) + ' מתוך ' + fmt(DATA.length) + ' תיקים';
    $('pdBody').hidden = !list.length;
    $('pdEmpty').hidden = !!list.length;
    if (!list.length) return;
    drawKpis(list); drawInsights(list); drawYears(list); drawStatus(list); drawFields(list); drawOutcomes(list); drawHeat(list); drawCourts(list); drawDefendants(list);
  }

  var ready = false;
  window.PinkasDash = { show: function () { if (!ready) { build(); ready = true; } draw(); } };
})();
