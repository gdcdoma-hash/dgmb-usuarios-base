/**
 * InscricaoBackendChecks.gs
 * Validações defensivas do módulo INSCRIÇÕES.
 */

function checkInscricoesHeader_(headerRow) {
  try {
    var map = buildInscricoesHeaderMap_(headerRow || []);
    var missing = [];

    for (var i = 0; i < DGMB_INSCRICOES_FIELDS_.length; i++) {
      var field = DGMB_INSCRICOES_FIELDS_[i];
      if (map[field] === undefined) missing.push(field);
    }

    if (missing.length) return { ok: false, missing: missing };
    return { ok: true, missing: [] };
  } catch (e) {
    return { ok: false, missing: DGMB_INSCRICOES_FIELDS_.slice() };
  }
}

function buildInscricoesHeaderMap_(headerRow) {
  var normalizedHeaderIndex = {};

  for (var i = 0; i < headerRow.length; i++) {
    var key = normalizeInscricaoHeaderKey_(headerRow[i]);
    if (key && normalizedHeaderIndex[key] === undefined) {
      normalizedHeaderIndex[key] = i;
    }
  }

  var canonicalMap = {};
  for (var j = 0; j < DGMB_INSCRICOES_FIELDS_.length; j++) {
    var canonicalField = DGMB_INSCRICOES_FIELDS_[j];
    var aliases = DGMB_INSCRICOES_FIELD_ALIASES_[canonicalField] || [canonicalField];

    for (var a = 0; a < aliases.length; a++) {
      var aliasKey = normalizeInscricaoHeaderKey_(aliases[a]);
      if (aliasKey && normalizedHeaderIndex[aliasKey] !== undefined) {
        canonicalMap[canonicalField] = normalizedHeaderIndex[aliasKey];
        break;
      }
    }
  }

  return canonicalMap;
}

function normalizeInscricaoHeaderKey_(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

function checkInscricaoRowShape_(item) {
  if (!item || typeof item !== 'object') item = {};

  for (var i = 0; i < DGMB_INSCRICOES_FIELDS_.length; i++) {
    var k = DGMB_INSCRICOES_FIELDS_[i];
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
