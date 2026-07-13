describe('H03 - Iniciar Sesión - Docente y Estudiante', () => {
  beforeEach(() => {
    cy.fixture('login').as('data')
  })

  it('CDS-T24: inicia sesión como estudiante exitosamente', function () {
    const { estudiante, institucion } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [institucion],
    }).as('getInstituciones')

    cy.intercept('POST', '**/auth/v1/token?grant_type=password*', {
      statusCode: 200,
      body: {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        user: { id: 'student-id', email: estudiante.email },
      },
    }).as('loginRequest')

    cy.intercept('GET', '**/rest/v1/usuarios*', {
      statusCode: 200,
      body: [{
        c_usua: 'student-id', l_nom: 'Carlos', l_apellp: 'Ramirez',
        c_ie: institucion.c_ie, rol: { l_rol: 'Alumno' },
        instieducativo: { l_col: institucion.l_col },
      }],
    }).as('getPerfil')

    cy.visit(`/login?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[type="email"]').should('be.visible').type('faviusam@gmail.com')
    cy.get('input[placeholder="Contraseña"]').should('be.visible').type('F@vio2005Ast')
    cy.contains('button', 'Ingresar').click()

    cy.url({ timeout: 10000 }).should('include', '/principal')
  })

  it('CDS-T25: inicia sesión como docente exitosamente', function () {
    const { docente, institucion } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [institucion],
    }).as('getInstituciones')

    cy.intercept('POST', '**/auth/v1/token?grant_type=password*', {
      statusCode: 200,
      body: {
        access_token: 'mock-access-token',
        token_type: 'bearer',
        user: { id: 'teacher-id', email: docente.email },
      },
    }).as('loginRequest')

    cy.intercept('GET', '**/rest/v1/usuarios*', {
      statusCode: 200,
      body: [{
        c_usua: 'teacher-id', l_nom: 'Maria', l_apellp: 'Gonzalez',
        c_ie: institucion.c_ie, rol: { l_rol: 'Docente' },
        instieducativo: { l_col: institucion.l_col },
      }],
    }).as('getPerfil')

    cy.visit(`/login?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[type="email"]').should('be.visible').type('faviusam@gmail.com')
    cy.get('input[placeholder="Contraseña"]').should('be.visible').type('F@vio2005Ast')
    cy.contains('button', 'Ingresar').click()

    cy.url({ timeout: 10000 }).should('include', '/principal')
  })

  it('CDS-T26: muestra error con credenciales inválidas', function () {
    const { estudiante, institucion } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [institucion],
    }).as('getInstituciones')

    cy.intercept('POST', '**/auth/v1/token?grant_type=password*', {
      statusCode: 400,
      body: { error: 'invalid_grant', error_description: 'Invalid login credentials' },
    }).as('loginRequest')

    cy.visit(`/login?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[type="email"]').should('be.visible').type(estudiante.email)
    cy.get('input[placeholder="Contraseña"]').should('be.visible').type('wrong-password')
    cy.contains('button', 'Ingresar').click()

    cy.wait('@loginRequest')
    cy.assertSwal('Error', 'Credenciales inválidas')
  })

  it('CDS-T27: valida que los campos no estén vacíos', function () {
    const { institucion } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [institucion],
    }).as('getInstituciones')

    cy.visit(`/login?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.contains('button', 'Ingresar').click()
    cy.get('input[type="email"]').then($el => {
      expect($el[0].validationMessage).to.exist
    })
  })

  it('CDS-T28: muestra/oculta contraseña con el toggle', function () {
    const { estudiante, institucion } = this.data

    cy.intercept('GET', '**/rest/v1/instieducativo*', {
      statusCode: 200,
      body: [institucion],
    }).as('getInstituciones')

    cy.visit(`/login?institucion=${encodeURIComponent(institucion.l_col)}&codinstitucion=${institucion.c_ie}`)

    cy.get('input[placeholder="Contraseña"]').should('have.attr', 'type', 'password')
    cy.get('button[aria-label*="Mostrar"]').click()
    cy.get('input[placeholder="Contraseña"]').should('have.attr', 'type', 'text')
    cy.get('button[aria-label*="Ocultar"]').click()
    cy.get('input[placeholder="Contraseña"]').should('have.attr', 'type', 'password')
  })
})
