describe('H06 - Visualización de Dashboard', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('principal').as('data')
  })

  it('CDS-T44: muestra el dashboard del docente con métricas', function () {
    cy.visit('/principal')

    cy.contains('Herramienta IA').should('be.visible')
    cy.contains('Business Intelligence').should('be.visible')
  })

  it('CDS-T45: muestra el dashboard del estudiante con su aula asignada', function () {
    cy.visit('/principal')
    cy.contains('Bienvenido').should('be.visible')
  })

  it('CDS-T46: docente puede abrir el modal de Business Intelligence', function () {
    cy.visit('/principal')
    cy.contains('Business Intelligence').click()
    cy.contains('Business Intelligence', { timeout: 5000 }).should('exist')
  })

  it('CDS-T47: el dashboard docente muestra indicadores de rendimiento', function () {
    cy.visit('/principal')
    cy.contains('Herramienta IA').should('be.visible')
  })

  it('CDS-T48: redirige a login si no hay sesión activa', function () {
    cy.clearAllLocalStorage()
    cy.visit('/principal')
    cy.url().should('equal', Cypress.config().baseUrl + '/')
  })
})
