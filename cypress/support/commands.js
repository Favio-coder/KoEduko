// ═══════════════════════════════════════════════════════════
// COMMANDS — KoEduko Cypress
// ═══════════════════════════════════════════════════════════

// ── SweetAlert helpers ────────────────────────────────────
Cypress.Commands.add('assertSwal', (title, text, opts = {}) => {
  cy.get('.swal2-popup', { timeout: 8000 }).should('be.visible')
  if (title) cy.get('.swal2-title').should('contain', title)
  if (text) cy.get('.swal2-html-container').should('contain', text)
})

Cypress.Commands.add('closeSwal', () => {
  cy.get('.swal2-confirm').click()
  cy.get('.swal2-popup', { timeout: 5000 }).should('not.exist')
})

// ── Institution mock ─────────────────────────────────────
Cypress.Commands.add('mockInstituciones', (institucion = { l_col: 'Colegio Test', cod_mod: '1234' }) => {
  cy.intercept('GET', '**/rest/v1/instieducativo*', {
    statusCode: 200,
    body: [{ cod_mod: institucion.cod_mod, l_col: institucion.l_col }],
  }).as('getInstituciones')
})

Cypress.Commands.add('selectInstitucion', (nombre = 'Colegio Test') => {
  cy.get('select').first().select(nombre, { force: true })
})

// ── Vue input helper ─────────────────────────────────────
Cypress.Commands.add('setVueInputValue', { prevSubject: 'element' }, (subject, value) => {
  const el = subject[0]
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, 'value'
  ).set
  nativeInputValueSetter.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('blur'))
})

Cypress.Commands.add('typeIntoInput', (selector, value) => {
  cy.get(selector).clear({ force: true }).type(value, { force: true, delay: 10 })
})

// ── Mock login (no real auth) ────────────────────────────
Cypress.Commands.add('mockSupabaseSession', (user = { id: 'mock-user-1', email: 'docente@test.com' }) => {
  const token = JSON.stringify({
    access_token: 'mock-token',
    token_type: 'bearer',
    user,
  })
  localStorage.setItem(`sb-uwkqhqosdqdlomvmszxb-auth-token`, token)

  cy.intercept('GET', '**/auth/v1/user*', {
    statusCode: 200,
    body: { id: user.id, email: user.email },
  }).as('mockAuthUser')

  cy.intercept('GET', '**/auth/v1/session*', {
    statusCode: 200,
    body: { access_token: 'mock-token', user },
  }).as('mockAuthSession')
})

Cypress.Commands.add('loginAsTeacher', (perfilOverrides = {}) => {
  const user = { id: 'mock-docente-1', email: 'faviusam@gmail.com', nombre: 'Favio Coder', rol: 'Docente' }
  const perfil = {
    c_usua: 'mock-docente-1',
    c_instanceId: 'mock-docente-1',
    l_nom: 'Favio',
    l_apellp: 'Coder',
    l_apellm: 'Test',
    c_ie: 'ie-1',
    rol: { l_rol: 'Docente' },
    instieducativo: { l_col: 'Colegio Test' },
    ...perfilOverrides,
  }

  cy.mockSupabaseSession({ id: user.id, email: user.email })

  const piniaState = { auth: { user, perfil } }
  localStorage.setItem('pinia', JSON.stringify(piniaState))
})

Cypress.Commands.add('loginAsStudent', (perfilOverrides = {}) => {
  const user = { id: 'mock-est-1', email: 'asturimac.favio@gmail.com', nombre: 'Estudiante Test', rol: 'Alumno' }
  const perfil = {
    c_usua: 'mock-est-1',
    c_instanceId: 'mock-est-1',
    l_nom: 'Estudiante',
    l_apellp: 'Test',
    l_apellm: '',
    c_ie: 'ie-1',
    rol: { l_rol: 'Alumno' },
    instieducativo: { l_col: 'Colegio Test' },
    ...perfilOverrides,
  }

  cy.mockSupabaseSession({ id: user.id, email: user.email })

  const piniaState = { auth: { user, perfil } }
  localStorage.setItem('pinia', JSON.stringify(piniaState))
})

// ── Real login (smoke tests) ─────────────────────────────
Cypress.Commands.add('loginReal', (rol = 'docente') => {
  const creds = rol === 'docente'
    ? { email: 'faviusam@gmail.com', password: 'F@vio2005Ast' }
    : { email: 'asturimac.favio@gmail.com', password: 'F@vio2005Ast' }

  cy.session([creds.email, rol], () => {
    cy.task('loginSupabase', creds).then(({ session, perfil }) => {
      localStorage.setItem(
        `sb-uwkqhqosdqdlomvmszxb-auth-token`,
        JSON.stringify(session)
      )

      const user = {
        id: session.user.id,
        email: session.user.email,
        nombre: `${perfil.l_nom} ${perfil.l_apellp}`,
        rol: perfil.rol.l_rol,
      }
      const piniaState = { auth: { user, perfil } }
      localStorage.setItem('pinia', JSON.stringify(piniaState))
    })
  })

  cy.visit('/principal')
  cy.url({ timeout: 15000 }).should('include', '/principal')
})

// ── API mocks ────────────────────────────────────────────
Cypress.Commands.add('mockAulasDocente', (aulas = []) => {
  cy.intercept('POST', '**/rpc/get_aulas_docente', {
    statusCode: 200,
    body: aulas,
  }).as('getAulasDocente')
})

Cypress.Commands.add('mockCursos', (cursos = []) => {
  cy.intercept('GET', '**/core*curso*', {
    statusCode: 200,
    body: cursos,
  }).as('getCursos')
})

Cypress.Commands.add('mockInstitucionesCompletas', () => {
  cy.intercept('GET', '**/rest/v1/instieducativo*', {
    statusCode: 200,
    body: [{ cod_mod: '1234', l_col: 'Colegio Test', d_dep: 'Lima', d_prov: 'Lima' }],
  }).as('getInstituciones')
})
