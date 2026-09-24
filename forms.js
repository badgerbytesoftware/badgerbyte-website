(function(){
  // Visual language (matches the #contact section in index.html)
  var BORDER = '#34343A', ERR = '#F07A6A', ACCENT = '#A9AEF0', OK = '#8FD3A8';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var CONTACT_EMAIL = 'admin@badgerbytesoftware.com';

  function el(id){ return document.getElementById(id); }
  function val(id){ var e = el(id); return e ? e.value.trim() : ''; }

  // --- Shared submit --------------------------------------------------------
  async function submitForm(endpoint, payload) {
    var res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    var data = await res.json();
    if (!res.ok || !data.success) throw new Error((data && data.error) || 'Submission failed');
    return data;
  }

  function honeypot(form) {
    var hp = form.querySelector('input[name="botcheck"]');
    return hp && hp.checked ? '1' : '';
  }

  function clearErrors(ids) {
    ids.forEach(function(id){ var e = el(id); if (e) e.style.borderColor = BORDER; });
  }

  function markError(id) {
    var e = el(id); if (!e) return;
    e.style.borderColor = ERR;
    e.addEventListener('input', function handler(){ e.style.borderColor = BORDER; e.removeEventListener('input', handler); });
  }

  function msgLine(btn) {
    var id = btn.id + '-msg';
    var p = document.getElementById(id);
    if (!p) {
      p = document.createElement('p');
      p.id = id;
      p.setAttribute('role', 'status');
      p.style.cssText = 'margin:0; font-size:13px; line-height:1.55;';
      btn.parentNode.insertBefore(p, btn.nextSibling);
    }
    return p;
  }

  function successPanel(form) {
    setTimeout(function(){
      form.innerHTML =
        '<div style="display:flex; flex-direction:column; gap:12px; padding:8px 0;">' +
          '<span style="font-family:\'Geist Mono\', ui-monospace, monospace; font-size:13px; color:' + ACCENT + '; letter-spacing:0.02em;">Message sent</span>' +
          '<h3 style="margin:0; font-size:28px; line-height:1.1; font-weight:500; letter-spacing:-0.03em; color:#FFFFFF;">Thanks &#8212; we&#8217;ll be in touch.</h3>' +
          '<p style="margin:0; font-size:15px; line-height:1.6; color:#B4B6BC;">We usually reply within one business day. In the meantime you can reach us at ' +
            '<a href="mailto:' + CONTACT_EMAIL + '" style="color:#FFFFFF; font-weight:500;">' + CONTACT_EMAIL + '</a>.</p>' +
        '</div>';
    }, 700);
  }

  // --- Contact form (index.html #contact) -----------------------------------
  var form = el('contact-form');
  var btn = el('send-contact');
  if (form && btn) form.addEventListener('submit', function(e){
    e.preventDefault();
    if (btn.disabled) return;

    var required = ['c-name', 'c-email', 'c-msg'];
    clearErrors(required);
    var msg = msgLine(btn); msg.textContent = '';

    var bad = false;
    required.forEach(function(id){ if (!val(id)) { markError(id); bad = true; } });
    var email = val('c-email');
    if (email && !EMAIL_RE.test(email)) { markError('c-email'); bad = true; }
    if (bad) { msg.style.color = ERR; msg.textContent = 'Please complete the highlighted fields.'; return; }

    var original = btn.textContent;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'default';
    btn.textContent = 'Sending…';

    submitForm('/api/contact', {
      name: val('c-name'),
      company: val('c-company'),
      email: email,
      phone: val('c-phone'),
      message: val('c-msg'),
      botcheck: honeypot(form)
    }).then(function(){
      btn.textContent = 'Sent ✓';
      btn.style.color = '#111113';
      btn.style.background = OK;
      successPanel(form);
    }).catch(function(){
      btn.textContent = original;
      btn.disabled = false;
      btn.style.opacity = '';
      btn.style.cursor = 'pointer';
      msg.style.color = ERR;
      msg.innerHTML = 'Something went wrong. Please email us at ' +
        '<a href="mailto:' + CONTACT_EMAIL + '" style="color:#FFFFFF; font-weight:500;">' + CONTACT_EMAIL + '</a>.';
    });
  });
})();
