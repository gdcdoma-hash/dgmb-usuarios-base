/** DGMB_USUARIOS_BASE - LISTAGEM (READ ONLY)
 * Regras:
 * - WebApp com HtmlService
 * - SpreadsheetApp.openById(SPREADSHEET_ID) (NUNCA getActiveSpreadsheet)
 * - doGet(e) global obrigatório
 * - include(filename) global obrigatório
 */

/** const SPREADSHEET_ID = '1B_SBXOL9-sciM1E-5CtXUwecqULtMuDJJ7A49-ihWPc'; // <-- OBRIGATÓRIO 
const SHEET_USUARIOS_NAME = 'USUARIOS';
*/
function doGet(e) {
  var page = _dgmbResolvePage_(e);

  if (page === 'inscricoes') {
    var tplInscricoes = HtmlService.createTemplateFromFile('InscricaoIndex');
    tplInscricoes.APP_NAME = 'DGMB - Inscrições (Base)';

    return tplInscricoes.evaluate()
      .setTitle('DGMB - Inscrições')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  var tplUsuarios = HtmlService.createTemplateFromFile('UsuarioIndex');
  tplUsuarios.APP_NAME = 'DGMB - Usuários (Base)';

  return tplUsuarios.evaluate()
    .setTitle('DGMB - Usuários')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function _dgmbResolvePage_(e) {
  var raw = e && e.parameter && e.parameter.page ? String(e.parameter.page) : 'usuarios';
  raw = raw.toLowerCase().trim();

  if (raw === 'inscricoes') return 'inscricoes';
  return 'usuarios';
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
