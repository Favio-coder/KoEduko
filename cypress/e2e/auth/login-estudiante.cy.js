// CDS-T25 — Login estudiante exitoso (smoke test with real credentials)
describe('Login Estudiante', () => {
  it('CDS-T25: Inicia sesión como estudiante y ve su aula asignada', () => {
    cy.loginReal('estudiante')
    cy.get('h1').should('contain', 'Bienvenido')
    cy.contains('Tu aula asignada').should('be.visible')
  })
})
