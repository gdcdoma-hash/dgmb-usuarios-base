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
  const tpl = HtmlService.createTemplateFromFile('UsuarioIndex');
  tpl.APP_NAME = 'DGMB - Usuários (Base)';
  const html = tpl.evaluate()
    .setTitle('DGMB - Usuários')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
