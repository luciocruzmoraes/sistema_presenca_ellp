const alunoService = require('../services/AlunoService');

const createAluno = async (req, res) => {
  try {
    const { nome, email, turma } = req.body;

    if (!nome || !email || !turma) {
      return res.status(400).json({ error: 'Campos nome, email e turma são obrigatórios' });
    }

    const aluno = await alunoService.createAluno({ nome, email, turma });
    res.status(201).json(aluno);
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
};

const getAlunos = async (req, res) => {
  try {
    const alunos = await alunoService.getAlunos();
    res.status(200).json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
};

const getAlunoById = async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await alunoService.getAlunoById(id);

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.status(200).json(aluno);
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
};

const updateAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, turma } = req.body;

    const alunoAtualizado = await alunoService.updateAluno(id, { nome, email, turma });

    if (!alunoAtualizado) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.status(200).json(alunoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
};

const deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await alunoService.deleteAluno(id);

    if (!sucesso) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.status(200).json({ message: 'Aluno deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    res.status(500).json({ error: 'Erro ao deletar aluno' });
  }
};

module.exports = {
  createAluno,
  getAlunos,
  getAlunoById,
  updateAluno,
  deleteAluno,
};
