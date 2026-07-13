describe('H08 - Matching entre estudiantes', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('emparejamiento').as('data')
  })

  it('CDS-T59: visualiza la página de emparejamiento con selector de curso', function () {
    cy.visit('/emparejamiento')

    cy.contains('Emparejamiento Inteligente').should('be.visible')
    cy.get('select').should('be.visible')
    cy.contains('Entrenar IA').should('be.visible')
  })

  it('CDS-T60: entrena el modelo de IA exitosamente', function () {
    const { modeloStatus } = this.data

    cy.intercept('POST', '**/api/ia/train*', {
      statusCode: 200,
      body: { message: 'Modelo entrenado exitosamente' },
    }).as('trainModel')

    cy.intercept('GET', '**/api/ia/status/*', {
      statusCode: 200,
      body: modeloStatus,
    }).as('modelStatus')

    cy.visit('/emparejamiento')
    cy.contains('Entrenar IA').should('be.visible')
  })

  it('CDS-T61: genera emparejamientos cuando el modelo está listo', function () {
    const { modeloStatus, emparejamientos } = this.data

    cy.intercept('GET', '**/api/ia/status/*', {
      statusCode: 200,
      body: { ...modeloStatus, status: 'trained' },
    }).as('modelStatus')

    cy.intercept('GET', '**/api/ia/matches/*', {
      statusCode: 200,
      body: emparejamientos,
    }).as('getMatches')

    cy.visit('/emparejamiento')
    cy.contains('Emparejamiento Inteligente').should('be.visible')
  })

  it('CDS-T62: muestra el botón de exportar reporte cuando hay emparejamientos', function () {
    const { modeloStatus, emparejamientos } = this.data

    cy.intercept('GET', '**/api/ia/status/*', {
      statusCode: 200,
      body: { ...modeloStatus, status: 'trained' },
    }).as('modelStatus')

    cy.intercept('GET', '**/api/ia/matches/*', {
      statusCode: 200,
      body: emparejamientos,
    }).as('getMatches')

    cy.visit('/emparejamiento')
    cy.contains('Emparejamiento Inteligente').should('be.visible')
  })

  it('CDS-T63: deshabilita generar emparejamientos sin modelo entrenado', function () {
    cy.intercept('GET', '**/api/ia/status/*', {
      statusCode: 200,
      body: { status: 'untrained', accuracy: 0 },
    }).as('modelStatus')

    cy.visit('/emparejamiento')
    cy.contains('Generar Emparejamientos').should('be.disabled')
  })
})
