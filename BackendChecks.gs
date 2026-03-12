/***********************
 * BackendChecks.gs (NOVO)
 * Responsabilidade 13 — Auto-checks + validação defensiva
 * (SEM impacto no front / SEM alterar contrato)
 ***********************/

/**
 * Campos mínimos exigidos para não quebrar o front.
 * (NÃO RENOMEAR)
 */
var DGMB_USUARIOS_MIN_HEADERS_ = [
  'id_dgmb',
  'id_usuario',
  'nome',
  'status',
  'cidade_uf',
  'whatsapp',
  'data_criacao'
];

/**
 * A) checkUsuariosHeader_()
 * Confere se o cabeçalho possui TODOS os campos mínimos.
 *
 * Retorno:
 * - OK:    { ok:true,  missing:[] }
 * - FALTA: { ok:false, missing:[...] }
 *
 * NÃO joga erro por padrão.
 * Não lê planilha aqui (para não criar chamada extra).
 */
function checkUsuariosHeader_(headerRow) {
  try {
    var header = headerRow || [];
    var set = {};

    for (var i = 0; i < header.length; i++) {
      var key = String(header[i] || '').trim().toLowerCase();
      if (key) set[key] = true;
    }

    var missing = [];
    for (var j = 0; j < DGMB_USUARIOS_MIN_HEADERS_.length; j++) {
      var k = DGMB_USUARIOS_MIN_HEADERS_[j];
      if (!set[k]) missing.push(k);
    }

    if (missing.length) return { ok: false, missing: missing };
    return { ok: true, missing: [] };
  } catch (e) {
    // Defensivo: se algo falhar no check, considera “faltando tudo”
    return { ok: false, missing: DGMB_USUARIOS_MIN_HEADERS_.slice() };
  }
}

/**
 * B) checkUsuariosRowShape_(item)
 * Garante que item sempre tenha os campos mínimos (string), mesmo vazios.
 * - Não altera valores válidos, apenas normaliza null/undefined.
 */
function checkUsuariosRowShape_(item) {
  if (!item || typeof item !== 'object') item = {};

  for (var i = 0; i < DGMB_USUARIOS_MIN_HEADERS_.length; i++) {
    var k = DGMB_USUARIOS_MIN_HEADERS_[i];

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