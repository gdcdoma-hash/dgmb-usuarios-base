/**
 * UsuarioRepository.gs
 * Camada de leitura (somente leitura).
 * - Lê a planilha 1x por chamada
 * - Mapeia cabeçalho defensivamente
 * - Aplica filtros: nome (contains), status (equals), cidade_uf (contains)
 * - Garante campos mínimos em cada item
 *
 * RESPONSABILIDADE 13 (INTEGRAÇÃO MÍNIMA):
 * - checkUsuariosHeader_(header) 1x por chamada (SEM leitura extra)
 * - Se faltar coluna mínima: THROW com code HEADER_MISSING_COLUMNS + details.missing
 * - checkUsuariosRowShape_(item) ao montar cada item
 */

function usuarioRepoListarResumo_(payloadNormalizado) {
  var sh = getUsuariosSheet_();
  var values = sh.getDataRange().getValues(); // inclui cabeçalho

  if (!values || values.length < 2) {
    return { items: [], total: 0 };
  }

  var header = values[0] || [];

  // ✅ NOVO: header check 1x por chamada (SEM chamada extra)
  var chk = checkUsuariosHeader_(header);
  if (!chk.ok) {
    var err = new Error('Cabeçalho da aba USUARIOS está faltando colunas mínimas.');
    err.code = 'HEADER_MISSING_COLUMNS';
    err.details = { missing: chk.missing || [] };
    throw err; // Api/Service deve converter em dgmbErr(...) (contrato não muda)
  }

  var map = _dgmb_buildHeaderMap_(header);

  var filtros = (payloadNormalizado && payloadNormalizado.filtros) ? payloadNormalizado.filtros : {};
  var fNome = _dgmb_normText_(filtros.nome);
  var fCidade = _dgmb_normText_(filtros.cidade_uf);
  var fStatus = _dgmb_normText_(filtros.status);

  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];

    // Se a linha estiver completamente vazia, pula
    if (_dgmb_rowIsEmpty_(row)) continue;

    var item = _dgmb_rowToUsuarioItem_(row, map);

    // ✅ NOVO: garante shape mínimo SEM mexer em valores válidos
    item = checkUsuariosRowShape_(item);

    // Filtros (case-insensitive)
    if (fNome && _dgmb_normText_(item.nome).indexOf(fNome) === -1) continue;
    if (fCidade && _dgmb_normText_(item.cidade_uf).indexOf(fCidade) === -1) continue;
    if (fStatus && _dgmb_normText_(item.status) !== fStatus) continue;

    out.push(item);
  }

  return { items: out, total: out.length };
}

/** -------------------- Helpers internos -------------------- **/

function _dgmb_buildHeaderMap_(headerRow) {
  var map = {};
  for (var i = 0; i < headerRow.length; i++) {
    var key = _dgmb_normKey_(headerRow[i]);
    if (key) map[key] = i;
  }
  return map;
}

function _dgmb_normKey_(v) {
  return String(v || '')
    .trim()
    .toLowerCase();
}

function _dgmb_normText_(v) {
  return String(v || '')
    .trim()
    .toLowerCase();
}

function _dgmb_rowIsEmpty_(row) {
  if (!row || !row.length) return true;
  for (var i = 0; i < row.length; i++) {
    var v = row[i];
    if (v !== '' && v !== null && v !== undefined) return false;
  }
  return true;
}

function _dgmb_getByKey_(row, map, key) {
  if (!map || map[key] === undefined) return '';
  var idx = map[key];
  var v = row[idx];
  return (v === null || v === undefined) ? '' : v;
}

function _dgmb_toISODate_(v) {
  // Mantém string se já vier como string (ex: "2026-03-03" ou "03/03/2026")
  if (typeof v === 'string') return v.trim();

  // Se for Date, converte para yyyy-MM-dd (consistente para o front converter com safeDateBR)
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    // Usa timezone do script
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  // Caso venha número ou outro tipo, retorna string simples
  return String(v || '').trim();
}

function _dgmb_toStr_(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

function _dgmb_rowToUsuarioItem_(row, map) {
  // Garante SEMPRE estes campos no item (mesmo vazio)
  var item = {
    id_dgmb: '',
    id_usuario: '',
    nome: '',
    status: '',
    cidade_uf: '',
    whatsapp: '',
    data_criacao: ''
  };

  // Lê pelos nomes do cabeçalho (defensivo)
  item.id_dgmb = _dgmb_toStr_(_dgmb_getByKey_(row, map, 'id_dgmb'));
  item.id_usuario = _dgmb_toStr_(_dgmb_getByKey_(row, map, 'id_usuario'));
  item.nome = _dgmb_toStr_(_dgmb_getByKey_(row, map, 'nome'));
  item.status = _dgmb_toStr_(_dgmb_getByKey_(row, map, 'status'));
  item.cidade_uf = _dgmb_toStr_(_dgmb_getByKey_(row, map, 'cidade_uf'));
  item.whatsapp = _dgmb_toStr_(_dgmb_getByKey_(row, map, 'whatsapp'));

  // data_criacao pode vir Date ou string
  item.data_criacao = _dgmb_toISODate_(_dgmb_getByKey_(row, map, 'data_criacao'));

  return item;
}