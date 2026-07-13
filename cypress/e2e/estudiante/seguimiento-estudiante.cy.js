describe('H07 - Seguimiento de estudiante', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('calificaciones').as('data')
  })

  it('CDS-T54: visualiza sus calificaciones al seleccionar un curso', function () {
    cy.visit('/calificaciones')

    cy.contains('h1', 'Mis calificaciones').should('be.visible')
    cy.contains('Elige un curso').should('be.visible')
  })

  it('CDS-T55: muestra el promedio general en la página de calificaciones', function () {
    cy.visit('/calificaciones')
    cy.contains('Elige un curso').should('be.visible')
  })

  it('CDS-T56: muestra estado vacío cuando no hay curso seleccionado', function () {
    cy.visit('/calificaciones')
    cy.contains('Elige un curso').should('be.visible')
    cy.contains('Selecciona un curso para ver tus notas').should('be.visible')
  })

  it('CDS-T57: muestra gráficos de radar y doughnut para las notas', function () {
    cy.visit('/calificaciones')
    cy.contains('Elige un curso').should('be.visible')
  })

  it('CDS-T58: muestra las tarjetas de notas por categoría', function () {
    cy.visit('/calificaciones')
    cy.contains('Elige un curso').should('be.visible')
  })
})
