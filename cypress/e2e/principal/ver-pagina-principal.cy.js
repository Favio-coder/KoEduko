describe('H04 - Ver página principal', () => {
  beforeEach(() => {
    cy.fixture('principal').as('data')
  })

  it('CDS-T39: muestra la página de inicio con selector de institución', function () {
    const { instituciones } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: instituciones,
    }).as('getInstituciones')

    cy.visit('/')

    cy.contains('¡Bienvenido a Ko Eduko!').should('be.visible')
    cy.get('select').should('be.visible')
    cy.contains('Ingresa el nombre de la institución').should('be.visible')
  })

  it('CDS-T40: seleccionar institución redirige a login', function () {
    const { instituciones } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: instituciones,
    }).as('getInstituciones')

    cy.visit('/')
    cy.wait('@getInstituciones')

    cy.get('select').select(instituciones[0].l_col)
    cy.url().should('include', '/login')
    cy.url().should('include', `institucion=${encodeURIComponent(instituciones[0].l_col)}`)
  })

  it('CDS-T41: navega a registro desde la página principal', function () {
    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [],
    }).as('getInstituciones')

    cy.visit('/')
    cy.contains('No tienes cuenta, registrate aquí').should('be.visible')
    cy.contains('No tienes cuenta, registrate aquí').click()
    cy.url().should('include', '/register')
  })

  it('CDS-T42: muestra todas las instituciones disponibles en el selector', function () {
    const { instituciones } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: instituciones,
    }).as('getInstituciones')

    cy.visit('/')
    cy.wait('@getInstituciones')

    cy.get('select option').should('have.length', instituciones.length + 1)
    cy.get('select').contains(instituciones[0].l_col).should('exist')
    cy.get('select').contains(instituciones[1].l_col).should('exist')
  })

  it('CDS-T43: muestra el logo de Ko Eduko en la página principal', function () {
    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [],
    }).as('getInstituciones')

    cy.visit('/')
    cy.get('img[src*="logo"]').should('be.visible')
  })
})
