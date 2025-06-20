const oficinaService = require('../services/OficinaService');

const createOficina = async (req, res) => {
  try {
    const { nome, descricao, data, local } = req.body;
    if (!nome || !descricao || !data || !local) {
      return res.status(400).json({ error: 'Campos nome, descricao, data e local são obrigatórios' });
    }
    const oficina = await oficinaService.createOficina({ nome, descricao, data, local });
    res.status(201).json(oficina);
  } catch (error) {
    console.error('Erro ao criar oficina:', error);
    res.status(500).json({ error: 'Erro ao criar oficina' });
  }
};

const getOficinas = async (req, res) => {
  try {
    const oficinas = await oficinaService.getOficinas();
    res.status(200).json(oficinas);
  } catch (error) {
    console.error('Erro ao buscar oficinas:', error);
    res.status(500).json({ error: 'Erro ao buscar oficinas' });
  }
};

const getOficinaById = async (req, res) => {
  try {
    const { id } = req.params;
    const oficina = await oficinaService.getOficinaById(id);
    if (!oficina) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }
    res.status(200).json(oficina);
  } catch (error) {
    console.error('Erro ao buscar oficina:', error);
    res.status(500).json({ error: 'Erro ao buscar oficina' });
  }
};


const updateOficina = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, data, local } = req.body;
    const oficinaAtualizada = await oficinaService.updateOficina(id, { nome, descricao, data, local });
    if (!oficinaAtualizada) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }
    res.status(200).json(oficinaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar oficina:', error);
    res.status(500).json({ error: 'Erro ao atualizar oficina' });
  }
};

const deleteOficina = async (req, res) => {
  try {
    const { id } = req.params;
    const sucesso = await oficinaService.deleteOficina(id);
    if (!sucesso) {
      return res.status(404).json({ error: 'Oficina não encontrada' });
    }
    res.status(200).json({ message: 'Oficina deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar oficina:', error);
    res.status(500).json({ error: 'Erro ao deletar oficina' });
  }
};

module.exports = {
  createOficina,
  getOficinas,
  getOficinaById,
  updateOficina,
  deleteOficina,
}; 