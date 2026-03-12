/**
 * InscricaoBackendChecks.gs
 * Validações defensivas do módulo INSCRIÇÕES.
 */

function checkInscricoesHeader_(headerRow) {
  try {
    var header = headerRow || [];
    var set = {};

    for (var i = 0; i < header.length; i++) {
      var key = String(header[i] || '').trim().toLowerCase();
      if (key) set[key] = true;
    }

    var missing = [];
    for (var j = 0; j < DGMB_INSCRICOES_MIN_HEADERS_.length; j++) {
      var k = DGMB_INSCRICOES_MIN_HEADERS_[j];
      if (!set[k]) missing.push(k);
    }

    if (missing.length) return { ok: false, missing: missing };
    return { ok: true, missing: [] };
  } catch (e) {
    return { ok: false, missing: DGMB_INSCRICOES_MIN_HEADERS_.slice() };
  }
}

function checkInscricaoRowShape_(item) {
  if (!item || typeof item !== 'object') item = {};

  for (var i = 0; i < DGMB_INSCRICOES_MIN_HEADERS_.length; i++) {
    var k = DGMB_INSCRICOES_MIN_HEADERS_[i];
    if (item[k] === null || typeof item[k] === 'undefined') {
      item[k] = '';
      continue;
    }

    if (typeof item[k] !== 'string') {
      item[k] = String(item[k]);
    }
  }

  return item;
}
