/**
 * InscricaoService.gs
 * Camada mínima com paginação do módulo INSCRIÇÕES.
 */

function inscricaoServiceListarResumo_(payloadNormalizado) {
  var repo = inscricaoRepoListarResumo_(payloadNormalizado);

  return {
    items: repo.items || [],
    page: repo.page || 1,
    limit: repo.limit || dgmbInscricaoDefaultLimit_(),
    total: repo.total || 0,
    totalPages: repo.totalPages || 1
  };
}
