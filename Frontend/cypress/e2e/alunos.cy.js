describe('Gestão de Alunos', () => {
  const alunoMock = {
    nome: 'João Teste',
    email: 'joao@teste.com',
    telefone: '123456789',
    turma: 'Turma 1',
    observacoes: 'Aluno de teste',
    oficinas: [],
  };

  beforeEach(() => {
    cy.request('GET', 'http://localhost:3000/api/alunos').then((res) => {
      res.body.forEach((aluno) => {
        cy.request('DELETE', `http://localhost:3000/api/alunos/${aluno.id}`);
      });
    });

    cy.request('POST', 'http://localhost:3000/api/alunos', alunoMock);
    
    cy.intercept('GET', '**/api/alunos').as('getAlunos');
    cy.visit('http://localhost:5173/students');
    cy.wait('@getAlunos');
  });

  it('deve exibir a lista de alunos', () => {
    cy.contains('Alunos');
    cy.get('table').should('exist');
    cy.contains('João Teste').should('exist');
  });

  it('deve abrir o modal para novo aluno', () => {
    cy.contains('Novo Aluno').click();
    cy.contains('Adicionar Aluno').should('exist');
    cy.get('form').should('exist');
  });

  it('deve adicionar um novo aluno', () => {
    cy.contains('Novo Aluno').click();

    cy.get('input[name="nome"]').type('João Teste');
    cy.get('input[name="email"]').type('joao@teste.com');
    cy.get('input[name="telefone"]').type('987654321');
    cy.get('textarea[name="observacoes"]').type('Observação qualquer');
    cy.get('input[name="turma"]').type('Turma 2');

    cy.contains('Adicionar').click();

    cy.contains('João Teste').should('exist');
  });

  it('deve buscar um aluno pelo nome', () => {
    cy.get('input[placeholder="Buscar por nome..."]').type('João Teste');
    cy.contains('Buscar').click();
    cy.contains('João Teste').should('exist');
  });

  it('deve editar um aluno', () => {
    cy.contains('João Teste')
      .parent()
      .find('button.edit')
      .click();

    cy.get('input[name="nome"]').clear().type('João Editado');
    cy.contains('Atualizar').click();
    cy.contains('João Editado').should('exist');
  });

  it('deve excluir um aluno', () => {
    cy.contains('João Teste')
      .parent()
      .find('button.delete')
      .click();

    cy.on('window:confirm', () => true);
    cy.contains('João Teste').should('not.exist');
  });
});
