const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');

const alunosController = require('../controllers/AlunosController');
const presencaController = require('../controllers/PresencaController');

router.post('/alunos', authMiddleware, alunosController.createAluno);
router.get('/alunos', authMiddleware, alunosController.getAlunos);
router.get('/alunos/:id', authMiddleware, alunosController.getAlunoById);
router.put('/alunos/:id', authMiddleware, alunosController.updateAluno);
router.delete('/alunos/:id', authMiddleware, alunosController.deleteAluno);

router.post('/presencas', authMiddleware, presencaController.registrarPresenca);
router.get('/presencas/aluno/:alunoId', authMiddleware, presencaController.getPresencasPorAluno);
router.get('/presencas/data/:data', authMiddleware, presencaController.getPresencasPorData);
router.put('/presencas/:id', authMiddleware, presencaController.updatePresenca);
router.delete('/presencas/:id', authMiddleware, presencaController.deletePresenca);

router.post('/users', authMiddleware, userController.createUserData);
router.get('/users/:uid', authMiddleware, userController.getUserData);

module.exports = router;
