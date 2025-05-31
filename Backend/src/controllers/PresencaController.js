const admin = require('../firebase');
const db = admin.firestore();

const presencasCollection = db.collection('presencas');

const registrarPresenca = async (req, res) => {
  try {
    const { alunoId, data, presente, turma } = req.body;

    if (!alunoId || !data || typeof presente !== 'boolean' || !turma) {
      return res.status(400).json({ error: 'Campos alunoId, data, presente (booleano) e turma são obrigatórios' });
    }

    const novaPresenca = { alunoId, data, presente, turma };

    const docRef = await presencasCollection.add(novaPresenca);
    const presencaCriada = await docRef.get();

    res.status(201).json({ id: docRef.id, ...presencaCriada.data() });
  } catch (error) {
    console.error('Erro ao registrar presença:', error);
    res.status(500).json({ error: 'Erro ao registrar presença' });
  }
};

const getPresencasPorAluno = async (req, res) => {
  try {
    const { alunoId } = req.params;

    const snapshot = await presencasCollection.where('alunoId', '==', alunoId).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Nenhuma presença encontrada para esse aluno' });
    }

    const presencas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(presencas);
  } catch (error) {
    console.error('Erro ao buscar presenças:', error);
    res.status(500).json({ error: 'Erro ao buscar presenças' });
  }
};

const getPresencasPorData = async (req, res) => {
  try {
    const { data } = req.params;

    const snapshot = await presencasCollection.where('data', '==', data).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Nenhuma presença encontrada para essa data' });
    }

    const presencas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(presencas);
  } catch (error) {
    console.error('Erro ao buscar presenças:', error);
    res.status(500).json({ error: 'Erro ao buscar presenças' });
  }
};

const updatePresenca = async (req, res) => {
  try {
    const { id } = req.params;
    const { alunoId, data, presente, turma } = req.body;

    const presencaRef = presencasCollection.doc(id);
    const doc = await presencaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Presença não encontrada' });
    }

    await presencaRef.update({ alunoId, data, presente, turma });
    const presencaAtualizada = await presencaRef.get();

    res.status(200).json({ id: presencaAtualizada.id, ...presencaAtualizada.data() });
  } catch (error) {
    console.error('Erro ao atualizar presença:', error);
    res.status(500).json({ error: 'Erro ao atualizar presença' });
  }
};

const deletePresenca = async (req, res) => {
  try {
    const { id } = req.params;
    const presencaRef = presencasCollection.doc(id);
    const doc = await presencaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Presença não encontrada' });
    }

    await presencaRef.delete();
    res.status(200).json({ message: 'Presença deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar presença:', error);
    res.status(500).json({ error: 'Erro ao deletar presença' });
  }
};

module.exports = {
  registrarPresenca,
  getPresencasPorAluno,
  getPresencasPorData,
  updatePresenca,
  deletePresenca,
};
