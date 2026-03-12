/**
 * InscricaoRepository.gs
 * Camada de leitura inicial para evolução do módulo INSCRIÇÕES.
 */

function inscricaoRepoListarResumo_(payloadNormalizado) {
  var sh = getInscricoesSheet_();
  var values = sh.getDataRange().getValues();

  if (!values || values.length < 2) {
    return { items: [], total: 0 };
  }

  var header = values[0] || [];
  var chk = checkInscricoesHeader_(header);
  if (!chk.ok) {
    var err = new Error('Cabeçalho da aba INSCRICOES está faltando colunas mínimas.');
    err.code = 'HEADER_MISSING_COLUMNS';
    err.details = {
      missing: chk.missing || [],
      acceptedAliases: getInscricoesAcceptedAliases_()
    };
    throw err;
  }

  var map = buildInscricoesHeaderMap_(header);
  var out = [];

  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (_dgmbInscricaoRowIsEmpty_(row)) continue;

    var item = _dgmbInscricaoRowToItem_(row, map);
    item._sortIndex = out.length;
    out.push(checkInscricaoRowShape_(item));
  }

  _dgmbInscricaoSortResumo_(out);
  _dgmbInscricaoRemoveSortMeta_(out);

  return { items: out, total: out.length };
}

function _dgmbInscricaoSortResumo_(items) {
  if (!items || !items.length) return;

  items.sort(function (a, b) {
    var aDate = _dgmbInscricaoDateSortKey_(a && a.data_inscricao);
    var bDate = _dgmbInscricaoDateSortKey_(b && b.data_inscricao);

    if (aDate.valid && bDate.valid) {
      if (aDate.value !== bDate.value) return bDate.value - aDate.value;
    } else if (aDate.valid !== bDate.valid) {
      return aDate.valid ? -1 : 1;
    }

    var aId = _dgmbInscricaoToStr_(a && a.id_inscricao).toLowerCase();
    var bId = _dgmbInscricaoToStr_(b && b.id_inscricao).toLowerCase();
    if (aId !== bId) return aId < bId ? -1 : 1;

    var aIdx = (a && typeof a._sortIndex === 'number') ? a._sortIndex : 0;
    var bIdx = (b && typeof b._sortIndex === 'number') ? b._sortIndex : 0;
    return aIdx - bIdx;
  });
}

function _dgmbInscricaoDateSortKey_(raw) {
  if (raw === null || raw === undefined) return { valid: false, value: 0 };

  var value = String(raw).trim();
  if (!value) return { valid: false, value: 0 };

  var parsed = Date.parse(value);
  if (!isNaN(parsed)) return { valid: true, value: parsed };

  var m = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) return { valid: false, value: 0 };

  var day = Number(m[1]);
  var month = Number(m[2]) - 1;
  var year = Number(m[3]);
  var hour = Number(m[4] || 0);
  var minute = Number(m[5] || 0);
  var second = Number(m[6] || 0);

  var localDate = new Date(year, month, day, hour, minute, second);
  if (isNaN(localDate.getTime())) return { valid: false, value: 0 };

  return { valid: true, value: localDate.getTime() };
}

function _dgmbInscricaoRemoveSortMeta_(items) {
  if (!items || !items.length) return;
  for (var i = 0; i < items.length; i++) {
    delete items[i]._sortIndex;
  }
}

function _dgmbInscricaoRowIsEmpty_(row) {
  if (!row || !row.length) return true;
  for (var i = 0; i < row.length; i++) {
    var v = row[i];
    if (v !== '' && v !== null && v !== undefined) return false;
  }
  return true;
}

function _dgmbInscricaoGetByField_(row, map, canonicalField) {
  if (!map || map[canonicalField] === undefined) return '';
  var idx = map[canonicalField];
  var v = row[idx];
  return (v === null || v === undefined) ? '' : v;
}

function _dgmbInscricaoToISODate_(v) {
  if (typeof v === 'string') return v.trim();

  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  return String(v || '').trim();
}

function _dgmbInscricaoToStr_(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function _dgmbInscricaoRowToItem_(row, map) {
  var item = {
    id_inscricao: '',
    id_usuario: '',
    id_evento: '',
    status: '',
    data_inscricao: ''
  };

  item.id_inscricao = _dgmbInscricaoToStr_(_dgmbInscricaoGetByField_(row, map, 'id_inscricao'));
  item.id_usuario = _dgmbInscricaoToStr_(_dgmbInscricaoGetByField_(row, map, 'id_usuario'));
  item.id_evento = _dgmbInscricaoToStr_(_dgmbInscricaoGetByField_(row, map, 'id_evento'));
  item.status = _dgmbInscricaoToStr_(_dgmbInscricaoGetByField_(row, map, 'status'));
  item.data_inscricao = _dgmbInscricaoToISODate_(_dgmbInscricaoGetByField_(row, map, 'data_inscricao'));

  return item;
}
