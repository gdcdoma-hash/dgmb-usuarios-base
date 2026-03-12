/**
 * ResponseUtil.gs
 * Helpers padronizados de resposta (mínimo).
 * NÃO altera o contrato da apiUsuariosListarResumo.
 */

function dgmbOk(data) {
  return { ok: true, data: data };
}

function dgmbErr(message, code, details) {
  var err = {
    message: String(message || 'Erro inesperado.'),
    code: String(code || 'ERROR')
  };
  if (details !== undefined) err.details = details;
  return { ok: false, error: err };
}