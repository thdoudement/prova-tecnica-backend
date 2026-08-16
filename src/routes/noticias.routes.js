import { Router } from 'express';
import * as noticiasController from '../controllers/noticias.controller.js';

const router = Router();

router.get('/', noticiasController.listar);
router.get('/:id', noticiasController.buscarPorId);
router.post('/', noticiasController.criar);
router.put('/:id', noticiasController.atualizar);
router.delete('/:id', noticiasController.remover);

export default router;
