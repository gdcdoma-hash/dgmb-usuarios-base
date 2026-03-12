/**
 * Api.gs
 * Mantém a função global apiUsuariosListarResumo(payload) e contrato imutável.
 */

function apiUsuariosListarResumo(payload) {
  try {
    var p = _dgmb_normalizePayload_(payload);
    var data = usuarioServiceListarResumo_(p);

    return dgmbOk({
      items: data.items,
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages: data.totalPages
    });
  } catch (e) {
    return dgmbErr(
      (e && e.message) ? e.message : String(e),
      'API_USUARIOS_LISTAR_RESUMO_ERROR',
      { stack: e && e.stack ? String(e.stack) : undefined }
    );
  }
}

function _dgmb_normalizePayload_(payload) {
  payload = payload || {};

  var page = parseInt(payload.page, 10);
  if (!isFinite(page) || page < 1) page = 1;

  var limit = parseInt(payload.limit, 10);
  if (!isFinite(limit) || limit < 1) limit = dgmbDefaultLimit_();

  var filtros = payload.filtros || {};
  var outFiltros = {
    nome: (filtros.nome === null || filtros.nome === undefined) ? '' : String(filtros.nome),
    status: (filtros.status === null || filtros.status === undefined) ? '' : String(filtros.status),
    cidade_uf: (filtros.cidade_uf === null || filtros.cidade_uf === undefined) ? '' : String(filtros.cidade_uf)
  };

  return { page: page, limit: limit, filtros: outFiltros };
}