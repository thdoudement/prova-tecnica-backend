import { prisma } from '../prisma/client.js';
import { buildListCacheKey, clearCache, getCache, setCache } from '../utils/cache.js';
import { enqueueNotificacao } from '../utils/queue.js';

function buildWhereClause({ titulo, descricao }) {
  const where = {};

  if (titulo) {
    where.titulo = { contains: titulo, mode: 'insensitive' };
  }

  if (descricao) {
    where.descricao = { contains: descricao, mode: 'insensitive' };
  }

  return where;
}

export async function listarNoticias({ page = 1, limit = 10, titulo, descricao } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;
  const where = buildWhereClause({ titulo, descricao });
  const cacheKey = buildListCacheKey({
    page: safePage,
    limit: safeLimit,
    titulo,
    descricao,
  });

  const cached = getCache(cacheKey);
  if (cached) {
    return { ...cached, fromCache: true };
  }

  const [total, data] = await Promise.all([
    prisma.noticia.count({ where }),
    prisma.noticia.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { id: 'desc' },
    }),
  ]);

  const result = {
    data,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
    fromCache: false,
  };

  setCache(cacheKey, result);
  return result;
}

export async function buscarNoticiaPorId(id) {
  return prisma.noticia.findUnique({ where: { id } });
}

export async function criarNoticia({ titulo, descricao }) {
  const noticia = await prisma.noticia.create({
    data: {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
    },
  });

  clearCache();
  enqueueNotificacao({ noticiaId: noticia.id, titulo: noticia.titulo });

  return noticia;
}

export async function atualizarNoticia(id, { titulo, descricao }) {
  const existing = await buscarNoticiaPorId(id);
  if (!existing) return null;

  const noticia = await prisma.noticia.update({
    where: { id },
    data: {
      ...(titulo !== undefined ? { titulo: titulo.trim() } : {}),
      ...(descricao !== undefined ? { descricao: descricao.trim() } : {}),
    },
  });

  clearCache();
  return noticia;
}

export async function deletarNoticia(id) {
  const existing = await buscarNoticiaPorId(id);
  if (!existing) return null;

  await prisma.noticia.delete({ where: { id } });
  clearCache();
  return existing;
}
