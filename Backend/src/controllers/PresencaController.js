const presencaService = require('../services/PresencaService');

const registrarPresenca = async (req, res) => {
  try {
    const dados = req.body;
    const presenca = await presencaService.registrarPresenca(dados);
    res.status(201).json(presenca);
  } catch (error) {
    console.error('Erro ao registrar presença:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const getPresencasPorAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;
    const presencas = await presencaService.getPresencasPorAluno(alunoId);

    if (presencas.length === 0) {
      return res.status(404).json({ error: 'Nenhuma presença encontrada para esse aluno' });
    }

    res.status(200).json(presencas);
  } catch (error) {
    console.error('Erro ao buscar presenças:', error.message);
    res.status(500).json({ error: 'Erro ao buscar presenças' });
  }
};

const getPresencasPorData = async (req, res) => {
  try {
    const { data } = req.params;
    const presencas = await presencaService.getPresencasPorData(data);

    if (presencas.length === 0) {
      return res.status(404).json({ error: 'Nenhuma presença encontrada para essa data' });
    }

    res.status(200).json(presencas);
  } catch (error) {
    console.error('Erro ao buscar presenças:', error.message);
    res.status(500).json({ error: 'Erro ao buscar presenças' });
  }
};

const updatePresenca = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const presencaAtualizada = await presencaService.updatePresenca(id, dados);
    res.status(200).json(presencaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar presença:', error.message);
    res.status(400).json({ error: error.message });
  }
};

const deletePresenca = async (req, res) => {
  try {
    const { id } = req.params;
    await presencaService.deletePresenca(id);
    res.status(200).json({ message: 'Presença deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar presença:', error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registrarPresenca,
  getPresencasPorAluno,
  getPresencasPorData,
  updatePresenca,
  deletePresenca,
};
