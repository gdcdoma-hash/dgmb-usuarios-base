/**
 * Config.gs (SEM variáveis globais para não colidir com Code.gs)
 * Centraliza config via FUNÇÕES (não gera "repetição de variável").
 */

function dgmbSpreadsheetId_() {
  // ✅ COLE AQUI SEU ID (o que você mostrou):
  return '1B_SBXOL9-sciM1E-5CtXUwecqULtMuDJJ7A49-ihWPc';
}

function dgmbUsuariosSheetName_() {
  return 'USUARIOS';
}

function dgmbDefaultLimit_() {
  return 10;
}

/**
 * Helper interno: abre a planilha por ID e retorna a aba USUARIOS.
 */
function getUsuariosSheet_() {
  var id = dgmbSpreadsheetId_();
  if (!id) throw new Error('SpreadsheetId vazio em dgmbSpreadsheetId_().');

  var ss = SpreadsheetApp.openById(id);
  var name = dgmbUsuariosSheetName_();
  var sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Aba "' + name + '" não encontrada.');
  return sh;
}

