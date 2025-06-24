describe('Gestão de Oficinas', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/oficinas').as('postOficina');
    cy.intercept('GET', '/api/oficinas').as('getOficinas');
    cy.intercept('GET', '/api/alunos').as('getAlunos');

    cy.visit('http://localhost:5173/workshops');

    cy.wait('@getOficinas');
    cy.wait('@getAlunos');
  });

  it('deve exibir a lista de oficinas', () => {
    cy.contains('Oficinas');
    cy.get('table').should('exist');
  });

  it('deve abrir modal de nova oficina', () => {
    cy.contains('Nova Oficina').click();
    cy.contains('Adicionar Oficina').should('exist');
  });

  it('deve adicionar uma nova oficina', () => {
    
    cy.contains('Nova Oficina').click();

    
    cy.get('input[name="nome"]').type('Oficina Teste1');
    cy.get('textarea[name="descricao"]').type('Descrição de teste');
    cy.get('input[name="local"]').type('Sala 1');

    cy.get('button[type=submit]').click();

    cy.wait('@postOficina').its('response.statusCode').should('eq', 201); // ou 200, conforme seu back
    cy.wait('@getOficinas');

    cy.contains('Oficina Teste1').should('exist');
  });

  it('deve abrir modal com alunos da oficina', () => {
    cy.get('table tbody tr').should('have.length.at.least', 1);

    cy.get('button[title="Ver Alunos"]').first().click();
    cy.contains('Alunos da Oficina').should('exist');
    cy.get('table').should('exist');
  });
});
