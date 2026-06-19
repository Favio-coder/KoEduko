Cypress.Commands.add('assertSwal', (title, text, options = {}) => {
  const timeout = options.timeout || 10000
  cy.get('.swal2-popup', { timeout }).should('be.visible')

  if (title) {
    cy.get('.swal2-title').should('contain', title)
  }

  if (text) {
    cy.get('.swal2-html-container').should('contain', text)
  }
})

Cypress.Commands.add('closeSwal', () => {
  cy.get('.swal2-popup').should('be.visible')
  cy.get('.swal2-confirm').click()
  cy.get('.swal2-popup').should('not.exist')
})

Cypress.Commands.add('mockInstituciones', (institucion) => {
  cy.intercept('GET', '**/rest/v1/instieducativo*', {
    statusCode: 200,
    body: [institucion],
  }).as('getInstituciones')
})

Cypress.Commands.add('selectInstitucion', (nombreInstitucion) => {
  cy.get('select').should('be.visible')
  cy.get('select option').should('have.length.greaterThan', 1)
  cy.get('select').select(nombreInstitucion)
})

Cypress.Commands.add('setVueInputValue', (selector, value) => {
  cy.get(selector).then(($input) => {
    const input = $input[0]
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set

    setter.call(input, value)
    input.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      data: value,
      inputType: 'insertText',
    }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
})

Cypress.Commands.add('typeIntoInput', (selector, value) => {
  cy.get(selector)
    .should('be.visible')
    .click()
    .type(`{selectAll}{del}${value}`, {
      parseSpecialCharSequences: false,
      force: true,
      delay: 30,
    })
})

Cypress.Commands.add('setDateInputValue', (selector, value) => {
  cy.get(selector).then(($input) => {
    const input = $input[0]
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    ).set

    setter.call(input, value)
    input.dispatchEvent(new InputEvent('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  })
})

Cypress.Commands.add('fillFormularioCrearCuenta', (datos) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    password,
  } = datos

  cy.typeIntoInput('input[placeholder="Nombre(s)"]', nombre)
  cy.typeIntoInput('input[placeholder="Apellido paterno"]', apellidoPaterno)
  cy.typeIntoInput('input[placeholder="Apellido materno"]', apellidoMaterno)
  cy.setDateInputValue('input[type="date"]', fechaNacimiento)
  cy.typeIntoInput('input[placeholder="Nueva contraseña"]', password)
})

Cypress.Commands.add('visitarCrearCuentaEstudiante', (email, contexto) => {
  const params = new URLSearchParams({
    instance: contexto.instance_id,
    rol: contexto.l_rol,
    email,
  })

  cy.visit(`/register/crear-cuenta?${params.toString()}`)
  cy.contains('h2', 'Crear cuenta').should('be.visible')
})
