/**
 * InscricaoApi.gs
 * API inicial do módulo INSCRIÇÕES.
 */

function apiInscricoesListarResumo(payload) {
  try {
    var p = _dgmbNormalizeInscricaoPayload_(payload);
    var data = inscricaoServiceListarResumo_(p);

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
      'API_INSCRICOES_LISTAR_RESUMO_ERROR',
      { stack: e && e.stack ? String(e.stack) : undefined }
    );
  }
}

function _dgmbNormalizeInscricaoPayload_(payload) {
  payload = payload || {};

  var page = parseInt(payload.page, 10);
  if (!isFinite(page) || page < 1) page = 1;

  var limit = parseInt(payload.limit, 10);
  if (!isFinite(limit) || limit < 1) limit = dgmbInscricaoDefaultLimit_();

  return { page: page, limit: limit };
}
