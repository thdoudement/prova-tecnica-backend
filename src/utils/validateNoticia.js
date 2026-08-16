export function validateNoticiaPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.titulo !== undefined) {
    if (typeof payload.titulo !== 'string' || payload.titulo.trim().length === 0) {
      errors.push('titulo é obrigatório e deve ser uma string não vazia');
    } else if (payload.titulo.trim().length > 200) {
      errors.push('titulo deve ter no máximo 200 caracteres');
    }
  }

  if (!partial || payload.descricao !== undefined) {
    if (typeof payload.descricao !== 'string' || payload.descricao.trim().length === 0) {
      errors.push('descricao é obrigatória e deve ser uma string não vazia');
    } else if (payload.descricao.trim().length > 2000) {
      errors.push('descricao deve ter no máximo 2000 caracteres');
    }
  }

  return errors;
}
