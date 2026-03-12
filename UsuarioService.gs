/**
 * UsuarioService.gs
 * Camada mínima:
 * - chama repository
 * - aplica paginação
 * - retorna { items, page, limit, total, totalPages }
 */

function usuarioServiceListarResumo_(payloadNormalizado) {
  var page = payloadNormalizado.page;
  var limit = payloadNormalizado.limit;

  var repo = usuarioRepoListarResumo_(payloadNormalizado);
  var total = repo.total || 0;

  var totalPages = (limit > 0) ? Math.max(1, Math.ceil(total / limit)) : 1;

  // Ajuste defensivo de page
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  var start = (page - 1) * limit;
  var end = start + limit;

  var itemsPaged = (repo.items || []).slice(start, end);

  return {
    items: itemsPaged,
    page: page,
    limit: limit,
    total: total,
    totalPages: totalPages
  };
}