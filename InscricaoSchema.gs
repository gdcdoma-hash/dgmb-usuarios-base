/**
 * InscricaoSchema.gs
 * Campos mínimos previstos para o módulo INSCRIÇÕES.
 */

var DGMB_INSCRICOES_FIELDS_ = [
  'id_inscricao',
  'id_usuario',
  'id_evento',
  'status',
  'data_inscricao'
];

var DGMB_INSCRICOES_FIELD_ALIASES_ = {
  id_inscricao: ['id_inscricao', 'idinscricao', 'inscricao_id', 'id'],
  id_usuario: ['id_usuario', 'idusuario', 'usuario_id', 'user_id'],
  id_evento: ['id_evento', 'idevento', 'evento_id'],
  status: ['status', 'situacao'],
  data_inscricao: ['data_inscricao', 'datainscricao', 'dt_inscricao', 'data', 'created_at']
};
