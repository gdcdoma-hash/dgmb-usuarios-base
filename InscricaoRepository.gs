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
    out.push(checkInscricaoRowShape_(item));
  }

  return { items: out, total: out.length };
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
