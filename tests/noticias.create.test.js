import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';

await jest.unstable_mockModule('../src/services/noticias.service.js', () => ({
  criarNoticia: jest.fn(),
  listarNoticias: jest.fn(),
  buscarNoticiaPorId: jest.fn(),
  atualizarNoticia: jest.fn(),
  deletarNoticia: jest.fn(),
}));

const app = (await import('../src/app.js')).default;
const noticiasService = await import('../src/services/noticias.service.js');

describe('Feature: Criação de Notícias', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Scenario: criar notícia com dados válidos', () => {
    it('Given um payload válido, When POST /noticias, Then retorna 201 e a notícia criada', async () => {
      const payload = {
        titulo: 'Nova notícia',
        descricao: 'Descrição da nova notícia',
      };

      noticiasService.criarNoticia.mockResolvedValue({
        id: 1,
        ...payload,
      });

      const response = await request(app).post('/noticias').send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(payload);
      expect(noticiasService.criarNoticia).toHaveBeenCalledWith(payload);
    });
  });

  describe('Scenario: rejeitar criação com payload inválido', () => {
    it('Given título ausente, When POST /noticias, Then retorna 400 com erros de validação', async () => {
      const response = await request(app)
        .post('/noticias')
        .send({ descricao: 'Sem título' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Payload inválido');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('titulo')]),
      );
      expect(noticiasService.criarNoticia).not.toHaveBeenCalled();
    });

    it('Given descrição vazia, When POST /noticias, Then retorna 400', async () => {
      const response = await request(app)
        .post('/noticias')
        .send({ titulo: 'Título ok', descricao: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([expect.stringContaining('descricao')]),
      );
    });
  });
});
