/* Who is signed in, shared by every page on this site.
   The home page (another site) passes the state in the address as ?as=lawyer / id / org / guest.
   It is kept in sessionStorage while moving between this site's pages, and written on <html>
   as data-user (lawyer | id) and data-org, the same names the home page puts on its <body>.
   Load it in <head>, so the guest or signed-in header is right from the first paint. */
(function () {
  var HOME = 'https://case-view-lawyer-docs-inline.vercel.app/home.html';
  var KEY = 'nh-as';
  var VALID = /^(lawyer|id|org|guest)$/;

  function stored() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { sessionStorage.setItem(KEY, v); } catch (e) {} }

  var m = location.search.match(/[?&]as=([a-z]+)/);
  var as = m && VALID.test(m[1]) ? m[1] : stored();
  if (!VALID.test(as || '')) as = 'guest';

  function apply(v) {
    as = v;
    store(v);
    var r = document.documentElement;
    if (v === 'guest') delete r.dataset.user; else r.dataset.user = v === 'org' ? 'id' : v;
    if (v === 'org') r.dataset.org = ''; else delete r.dataset.org;
    /* keep the state in the address too, so a reload or a shared link opens the same way */
    var u = new URL(location.href);
    if (v === 'guest') u.searchParams.delete('as'); else u.searchParams.set('as', v);
    if (u.href !== location.href) history.replaceState(history.state, '', u.href);
  }
  apply(as);

  var svg = function (body, size) {
    return '<svg width="' + (size || 19) + '" height="' + (size || 19) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  };
  var check = '<svg class="nh-acctcheck" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--brand-navy)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  /* The header's user area: the login button for a guest, the bell and account menu once
     signed in. Both are in the page, and CSS shows one of them (styles.css, "Signed-in state"). */
  function userArea() {
    return '' +
      '<details class="nh-login nh-guest">' +
        '<summary><span class="nh-loginbtn">' + svg('<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line>', 18) + 'התחברות</span></summary>' +
        '<div class="nh-loginmenu"><div class="nh-loginbox">' +
          '<div class="nh-logincap">בחירת שיטת הזדהות</div>' +
          '<button type="button" class="nh-loginopt" data-as="lawyer"><span class="ico">' + svg('<rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path>') + '</span><span><span class="t">כרטיס חכם</span><span class="s">למורשי גישה ועורכי דין</span></span></button>' +
          '<button type="button" class="nh-loginopt" data-as="id"><span class="ico">' + svg('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>') + '</span><span><span class="t">הזדהות ממשלתית</span><span class="s">כניסה באמצעות קוד ה-SMS</span></span></button>' +
        '</div></div>' +
      '</details>' +
      '<div class="nh-signedin">' +
        '<button class="cvs-bellbtn" aria-label="הודעות">' + svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"></path><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>', 20) + '<span class="cvs-bellbadge">3</span></button>' +
        '<details class="cvs-avatarmenu" style="position:relative">' +
          '<summary class="cvs-avatartrig" style="list-style:none">' +
            '<span class="cvs-avatarcircle">יכ</span>' +
            '<span class="cvs-avatarrole nh-only-lawyer">עו"ד</span>' +
            '<span class="cvs-avatarrole nh-only-id">ת.ז</span>' +
            '<span class="cvs-avatarrole nh-only-org nh-orgchip" title="חברת אלפא בע&quot;מ">' + svg('<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>', 15) + '<span>חברת אלפא בע"מ</span></span>' +
            '<svg class="cvs-avatarchev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
          '</summary>' +
          '<div class="nh-acctmenu">' +
            '<div class="nh-acctname">ישראל כהן</div>' +
            '<div class="cvs-menuitem nh-acct" role="button" tabindex="0" data-as="lawyer"><span>עו"ד, מ.ר 45213</span>' + check + '</div>' +
            '<div class="nh-acctrule"></div>' +
            '<div class="cvs-menuitem nh-acct" role="button" tabindex="0" data-as="id"><span>ת.ז 012345678</span>' + check + '</div>' +
            '<div class="nh-acctrule"></div>' +
            '<div class="cvs-menuitem nh-acct" role="button" tabindex="0" data-as="org"><span style="white-space:nowrap">ת.ז 012345678, חברת אלפא בע"מ</span>' + check + '</div>' +
            '<div style="border-top:1px solid var(--border-1);margin:4px -8px"></div>' +
            '<div class="cvs-menuitem nh-exit" role="button" tabindex="0" data-as="guest">' + svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>', 16) + 'יציאה</div>' +
          '</div>' +
        '</details>' +
      '</div>';
  }

  window.NH = {
    /* 'guest' | 'lawyer' | 'id' | 'org' */
    user: function () { return as; },
    /* fills the header's user area; called right after its placeholder, before the rest paints */
    renderUser: function (el) { el.innerHTML = userArea(); }
  };

  /* login, switching account and exit, all without leaving the page */
  document.addEventListener('click', function (e) {
    var pick = e.target.closest('[data-as]');
    if (pick && pick.closest('.nh-login, .cvs-avatarmenu')) {
      apply(pick.dataset.as);
      document.querySelectorAll('.nh-login[open], .cvs-avatarmenu[open]').forEach(function (d) { d.open = false; });
      document.dispatchEvent(new CustomEvent('nh:user', { detail: as }));
      return;
    }
    document.querySelectorAll('.nh-login[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
    /* the home page reads the state from its own #as=, so links back to it carry it */
    var a = e.target.closest('a[href^="' + HOME + '"]');
    if (a && as !== 'guest') { e.preventDefault(); location.href = HOME + '#as=' + as; }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-as]')) { e.preventDefault(); e.target.click(); }
    if (e.key === 'Escape') document.querySelectorAll('.nh-login[open]').forEach(function (d) { d.open = false; });
  });
})();
