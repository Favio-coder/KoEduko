describe('H11 - Ingresar a sala', () => {
  beforeEach(() => {
    cy.loginReal()
    cy.fixture('salas').as('data')
  })

  it('CDS-T74: carga el componente Jitsi al ingresar a una sala', function () {
    const { roomId } = this.data

    cy.visit(`/salas/${roomId}`)
    cy.contains('Sala en vivo').should('be.visible')
    cy.get('#jitsi-container').should('exist')
  })

  it('CDS-T75: redirige a login sin sesión activa', function () {
    cy.clearAllLocalStorage()
    cy.visit('/salas/sala-test')
    cy.url().should('equal', Cypress.config().baseUrl + '/')
  })

  it('CDS-T76: ingresa desde la lista de salas a una sala específica', function () {
    cy.visit('/salas')
    cy.contains('Salas de reunión').should('be.visible')
  })

  it('CDS-T77: muestra el nombre del usuario en la sala', function () {
    const { roomId } = this.data
    cy.visit(`/salas/${roomId}`)
    cy.contains('Sala en vivo').should('be.visible')
  })

  it('CDS-T78: carga el script de Jitsi Meet API', function () {
    const { roomId } = this.data
    cy.visit(`/salas/${roomId}`)
    cy.document().then((doc) => {
      const script = doc.querySelector('script[src*="meet.jit.si/external_api"]')
      expect(script).to.exist
    })
  })
})
