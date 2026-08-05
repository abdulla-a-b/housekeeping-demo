/**
 * CLEAN MY AREA — Apps Script backend
 * Good & Fast Packaging Co. Ltd.
 *
 * Turns one Google Sheet into the database for the web app.
 * Deploy: Extensions > Apps Script > paste this > Deploy > New deployment
 *         Type "Web app", Execute as "Me", Access "Anyone".
 * Copy the /exec URL into API_URL at the top of index.html.
 */

var SHEET_ID = '';   // leave blank if this script is bound to the sheet

var TABS = {
  roster:     ['date','zone','lead','verifier','done','score','saved_at'],
  inspection: ['date','zone','verifier','total','s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','observations','saved_at'],
  vector:     ['date','location','type','action','closed_24h','saved_at'],
  layer1:     ['month','lines_pct','saved_at']
};

function book_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

function tab_(name) {
  var ss = book_();
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(TABS[name]);
    sh.getRange(1, 1, 1, TABS[name].length)
      .setFontWeight('bold').setBackground('#101211').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Create every tab at once. Run this manually the first time. */
function setup() {
  Object.keys(TABS).forEach(function (k) { tab_(k); });
  return 'Tabs ready: ' + Object.keys(TABS).join(', ');
}

function doPost(e) {
  try {
    var msg = JSON.parse(e.postData.contents);
    var p = msg.payload || {};
    var now = new Date();

    if (msg.type === 'roster') {
      upsert_('roster', p.date, [p.date, p.zone || '', p.lead || '', p.verifier || '',
        p.done ? 'Y' : 'N', p.score === null || p.score === undefined ? '' : p.score, now]);

    } else if (msg.type === 'inspection') {
      var s = p.scores || [];
      tab_('inspection').appendRow([p.date, p.zone, p.verifier, p.total,
        s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], s[8], s[9], p.obs || '', now]);

    } else if (msg.type === 'vector') {
      tab_('vector').appendRow([p.date, p.loc, p.type, p.action, p.closed ? 'Y' : 'N', now]);

    } else if (msg.type === 'layer1') {
      upsert_('layer1', p.month, [p.month, p.pct, now]);
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** One row per date (or month) — a re-save overwrites rather than duplicates. */
function upsert_(name, key, row) {
  var sh = tab_(name);
  var keys = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i][0];
    if (k instanceof Date) k = Utilities.formatDate(k, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    if (String(k) === String(key)) {
      sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sh.appendRow(row);
}

/** GET ?month=2026-08 returns the KPI figures for that month. */
function doGet(e) {
  var month = (e && e.parameter && e.parameter.month) ||
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  return json_(summary(month));
}

function summary(month) {
  var ros = rows_('roster'), ins = rows_('inspection'), vec = rows_('vector');
  var m = function (r) { return String(fmt_(r[0])).indexOf(month) === 0; };

  var days = ros.filter(m);
  var done = days.filter(function (r) { return r[4] === 'Y'; }).length;
  var scores = ins.filter(m).map(function (r) { return Number(r[3]); });
  var sites = vec.filter(m);
  var closed = sites.filter(function (r) { return r[4] === 'Y'; }).length;

  return {
    month: month,
    working_days: days.length,
    completed: done,
    adherence: days.length ? Math.round(done / days.length * 100) : null,
    inspections: scores.length,
    avg_score: scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length * 10) / 10 : null,
    below_30: scores.filter(function (s) { return s < 30; }).length,
    water_sites: sites.length,
    closed_24h: closed,
    closure_rate: sites.length ? Math.round(closed / sites.length * 100) : null,
    gate_adherence: days.length && (done / days.length) >= 0.95 ? 'ON TARGET' : 'BELOW',
    gate_score: scores.length && (scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) >= 40 ? 'ON TARGET' : 'BELOW'
  };
}

function rows_(name) {
  var sh = tab_(name);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}

function fmt_(v) {
  return v instanceof Date
    ? Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd')
    : String(v);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Email the monthly figures to the Factory Manager.
 * Set a time-driven trigger: monthly, 1st of the month, 08:00.
 */
function emailMonthly() {
  var d = new Date(); d.setMonth(d.getMonth() - 1);
  var month = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM');
  var s = summary(month);
  var body =
    'CLEAN MY AREA — ' + month + '\n\n' +
    'Adherence          ' + (s.adherence === null ? '—' : s.adherence + '%') + '   (target 95%)  ' + s.gate_adherence + '\n' +
    'Average score      ' + (s.avg_score === null ? '—' : s.avg_score + '/50') + '   (target 40)   ' + s.gate_score + '\n' +
    'Zones below 30     ' + s.below_30 + '\n' +
    'Water sites found  ' + s.water_sites + ', closed in 24h ' + s.closed_24h +
    ' (' + (s.closure_rate === null ? '—' : s.closure_rate + '%') + ')\n' +
    'Inspections done   ' + s.inspections + '\n\n' +
    'Full records: ' + book_().getUrl();

  MailApp.sendEmail({
    to: 'headhunterbabul@gmail.com',      // add Factory Manager, HSE
    subject: 'Clean My Area — ' + month + ' summary',
    body: body
  });
}
