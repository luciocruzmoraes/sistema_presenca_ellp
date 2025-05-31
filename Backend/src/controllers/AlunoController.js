const admin = require('../firebase');
const db = admin.firestore();

const alunosCollection = db.collection('alunos');

const createAluno = async (req, res) => {
  try {
    const { nome, email, turma } = req.body;

    if (!nome || !email || !turma) {
      return res.status(400).json({ error: 'Campos nome, email e turma são obrigatórios' });
    }

    const novoAluno = { nome, email, turma };

    const docRef = await alunosCollection.add(novoAluno);
    const alunoCriado = await docRef.get();

    res.status(201).json({ id: docRef.id, ...alunoCriado.data() });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    res.status(500).json({ error: 'Erro ao criar aluno' });
  }
};

const getAlunos = async (req, res) => {
  try {
    const snapshot = await alunosCollection.get();
    const alunos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
};

const getAlunoById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await alunosCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ error: 'Erro ao buscar aluno' });
  }
};

const updateAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, turma } = req.body;

    const alunoRef = alunosCollection.doc(id);
    const doc = await alunoRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    await alunoRef.update({ nome, email, turma });

    const alunoAtualizado = await alunoRef.get();

    res.status(200).json({ id: alunoAtualizado.id, ...alunoAtualizado.data() });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
};

const deleteAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const alunoRef = alunosCollection.doc(id);
    const doc = await alunoRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    await alunoRef.delete();
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
