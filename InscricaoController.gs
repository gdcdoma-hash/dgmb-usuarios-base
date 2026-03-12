/**
 * InscricaoController.gs
 * Ponto de extensão do módulo INSCRIÇÕES.
 */

function inscricaoControllerListarResumo_(payloadNormalizado) {
  return inscricaoServiceListarResumo_(payloadNormalizado);
}

function inscricaoControllerHealthcheck_() {
  return {
    ok: true,
    modulo: 'inscricoes',
    message: 'Módulo INSCRIÇÕES inicializado.'
  };
}
