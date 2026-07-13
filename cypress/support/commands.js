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

Cypress.Commands.add('mockSupabaseSession', (user = {}) => {
  cy.intercept('GET', '**/auth/v1/user*', {
    statusCode: 200,
    body: {
      id: user.id || 'test-user-id',
      email: user.email || 'test@test.com',
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
    },
  }).as('getUser')

  cy.intercept('GET', '**/auth/v1/session*', {
    statusCode: 200,
    body: {
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: user.id || 'test-user-id',
        email: user.email || 'test@test.com',
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
      },
    },
  }).as('getSession')

  cy.window().then((win) => {
    const session = {
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 99999,
      refresh_token: 'mock-refresh-token',
      user: {
        id: user.id || 'test-user-id',
        email: user.email || 'test@test.com',
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
      },
    }
    const storageKey = 'sb-uwkqhqosdqdlomvmszxb-auth-token'
    win.localStorage.setItem(storageKey, JSON.stringify(session))
  })
})

Cypress.Commands.add('loginAsTeacher', (perfil = {}) => {
  const defaultPerfil = {
    l_nom: 'Maria',
    l_apellp: 'Gonzalez',
    l_apellm: 'Lopez',
    rol: { l_rol: 'Docente' },
    instieducativo: { l_col: 'Colegio Nacional Test' },
  }

  const authUser = {
    id: 'teacher-test-id',
    email: 'docente@test.com',
    user_metadata: { full_name: 'Maria Gonzalez Lopez' },
  }

  cy.mockSupabaseSession(authUser)

  cy.window().then((win) => {
    win.localStorage.setItem('auth', JSON.stringify({
      user: { ...authUser, rol: 'Docente', nombre: 'Maria Gonzalez Lopez' },
      perfil: { ...defaultPerfil, ...perfil },
    }))
  })
})

Cypress.Commands.add('loginAsStudent', (perfil = {}) => {
  const defaultPerfil = {
    l_nom: 'Carlos',
    l_apellp: 'Ramirez',
    l_apellm: 'Torres',
    rol: { l_rol: 'Alumno' },
    instieducativo: { l_col: 'Colegio Nacional Test' },
  }

  const authUser = {
    id: 'student-test-id',
    email: 'estudiante@test.com',
    user_metadata: { full_name: 'Carlos Ramirez Torres' },
  }

  cy.mockSupabaseSession(authUser)

  cy.window().then((win) => {
    win.localStorage.setItem('auth', JSON.stringify({
      user: { ...authUser, rol: 'Alumno', nombre: 'Carlos Ramirez Torres' },
      perfil: { ...defaultPerfil, ...perfil },
    }))
  })
})

Cypress.Commands.add('mockAulasDocente', (aulas = []) => {
  cy.intercept('POST', '**/rest/v1/rpc/get_aulas_docente', {
    statusCode: 200,
    body: aulas,
  }).as('getAulasDocente')
})

Cypress.Commands.add('mockCursos', (cursos = []) => {
  cy.intercept('GET', '**/rest/v1/core*curso*', {
    statusCode: 200,
    body: cursos,
  }).as('getCursos')
})

Cypress.Commands.add('mockInstitucionesCompletas', (instituciones = []) => {
  cy.intercept('GET', '**/rest/v1/instieducativo*', {
    statusCode: 200,
    body: instituciones,
  }).as('getInstituciones')
})

Cypress.Commands.add('loginReal', () => {
  const email = 'faviusam@gmail.com'
  const password = 'F@vio2005Ast'
  const storageKey = 'sb-uwkqhqosdqdlomvmszxb-auth-token'

  cy.task('loginSupabase', { email, password }).then(({ session, perfil }) => {
    const rol = perfil.rol?.l_rol

    cy.window().then((win) => {
      win.localStorage.setItem(storageKey, JSON.stringify(session))
      win.localStorage.setItem('auth', JSON.stringify({
        user: {
          id: perfil.c_usua || session.user.id,
          nombre: `${perfil.l_nom} ${perfil.l_apellp}`,
          rol,
          email: session.user.email,
        },
        perfil: {
          ...perfil,
          rol: { l_rol: rol },
          instieducativo: { l_col: perfil.instieducativo?.l_col },
        },
      }))
    })
  })
})
