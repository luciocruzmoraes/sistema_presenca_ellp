const express = require('express');
const router = express.Router();

const alunosController = require('../controllers/AlunosController');
const presencaController = require('../controllers/PresencaController');
const userController = require('../controllers/userController'); 
const oficinasController = require('../controllers/OficinasController');

router.post('/alunos', alunosController.createAluno);
router.get('/alunos', alunosController.getAlunos);
router.get('/alunos/:id', alunosController.getAlunoById);
router.put('/alunos/:id', alunosController.updateAluno);
router.delete('/alunos/:id', alunosController.deleteAluno);

router.post('/presencas', presencaController.registrarPresenca);
router.get('/presencas/aluno/:alunoId', presencaController.getPresencasPorAluno);
router.get('/presencas/data/:data', presencaController.getPresencasPorData);
router.put('/presencas/:id', presencaController.updatePresenca);
router.delete('/presencas/:id', presencaController.deletePresenca);
router.get('/presencas', presencaController.getAllPresencas);

router.post('/users', userController.createUserData);
router.get('/users/:uid', userController.getUserData);

router.post('/oficinas', oficinasController.createOficina);
router.get('/oficinas', oficinasController.getOficinas);
router.get('/oficinas/:id', oficinasController.getOficinaById);
router.put('/oficinas/:id', oficinasController.updateOficina);
router.delete('/oficinas/:id', oficinasController.deleteOficina);

module.exports = router;
