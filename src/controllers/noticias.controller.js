import {
  atualizarNoticia,
  buscarNoticiaPorId,
  criarNoticia,
  deletarNoticia,
  listarNoticias,
} from '../services/noticias.service.js';
import { validateNoticiaPayload } from '../utils/validateNoticia.js';

export async function listar(req, res, next) {
  try {
    const { page, limit, titulo, descricao } = req.query;
    const result = await listarNoticias({ page, limit, titulo, descricao });
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function buscarPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const noticia = await buscarNoticiaPorId(id);
    if (!noticia) {
      return res.status(404).json({ message: 'Notícia não encontrada' });
    }

    return res.status(200).json(noticia);
  } catch (error) {
    return next(error);
  }
}

export async function criar(req, res, next) {
  try {
    const errors = validateNoticiaPayload(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Payload inválido', errors });
    }

    const noticia = await criarNoticia(req.body);
    return res.status(201).json(noticia);
  } catch (error) {
    return next(error);
  }
}

export async function atualizar(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const errors = validateNoticiaPayload(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Payload inválido', errors });
    }

    const noticia = await atualizarNoticia(id, req.body);
    if (!noticia) {
      return res.status(404).json({ message: 'Notícia não encontrada' });
    }

    return res.status(200).json(noticia);
  } catch (error) {
    return next(error);
  }
}

export async function remover(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const noticia = await deletarNoticia(id);
    if (!noticia) {
      return res.status(404).json({ message: 'Notícia não encontrada' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
