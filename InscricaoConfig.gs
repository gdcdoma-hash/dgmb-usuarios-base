/**
 * InscricaoConfig.gs
 * Configurações locais do módulo INSCRIÇÕES.
 */

function dgmbInscricaoSpreadsheetId_() {
  return dgmbSpreadsheetId_();
}

function dgmbInscricoesSheetName_() {
  return 'INSCRICOES';
}

function dgmbInscricaoDefaultLimit_() {
  return 10;
}

function getInscricoesSheet_() {
  var id = dgmbInscricaoSpreadsheetId_();
  if (!id) throw new Error('SpreadsheetId vazio em dgmbInscricaoSpreadsheetId_().');

  var ss = SpreadsheetApp.openById(id);
  var name = dgmbInscricoesSheetName_();
  var sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Aba "' + name + '" não encontrada.');
  return sh;
}
