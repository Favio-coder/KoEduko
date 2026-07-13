describe('H02 - Registrar Usuario - Docente', () => {
  beforeEach(() => {
    cy.fixture('docente').as('data')
  })

  it('CDS-T19: registra un docente exitosamente', function () {
    const { docente, institucion, contexto } = this.data

    cy.mockInstituciones(institucion)

    cy.intercept('POST', '**/rest/v1/rpc/get_usuario_contexto', {
      statusCode: 200,
      body: [{ instance_id: contexto.instance_id, l_rol: contexto.l_rol }],
    }).as('getContexto')

    cy.intercept('POST', '**/rest/v1/rpc/validar_usuario_institucion', {
      statusCode: 200,
      body: true,
    })

    cy.intercept('POST', '**/auth/v1/otp**', {
      statusCode: 200,
      body: {},
    }).as('sendOtp')

    cy.visit('/register')
    cy.wait('@getInstituciones')
    cy.selectInstitucion(institucion.l_col)

    cy.get('input[type="email"]').should('be.visible').type(docente.email)
    cy.contains('button', 'Crear Cuenta').click()

    cy.wait('@getContexto')
    cy.wait('@sendOtp')
    cy.assertSwal('Correo enviado', 'Revisa tu email para continuar')
  })

  it('CDS-T20: muestra error cuando el correo tiene formato incorrecto', function () {
    const { docente, institucion } = this.data

    cy.mockInstituciones(institucion)
    cy.visit('/register')

    cy.wait('@getInstituciones')
    cy.selectInstitucion(institucion.l_col)

    cy.get('input[type="email"]').should('be.visible').type(docente.emailInvalido)
    cy.contains('button', 'Crear Cuenta').click()

    cy.assertSwal('Error', 'Correo inválido')
  })

  it('CDS-T21: muestra error cuando el correo ya está registrado', function () {
    const { docente, institucion, contexto } = this.data

    cy.mockInstituciones(institucion)

    cy.intercept('POST', '**/rest/v1/rpc/get_usuario_contexto', {
      statusCode: 200,
      body: [{ instance_id: contexto.instance_id, l_rol: contexto.l_rol }],
    }).as('getContexto')

    cy.intercept('POST', '**/rest/v1/rpc/validar_usuario_institucion', {
      statusCode: 200,
      body: true,
    })

    cy.intercept('POST', '**/auth/v1/otp**', {
      statusCode: 422,
      body: {
        error: 'user_already_exists',
        error_code: 'user_already_exists',
        msg: 'User already registered',
      },
    }).as('sendOtp')

    cy.visit('/register')
    cy.wait('@getInstituciones')
    cy.selectInstitucion(institucion.l_col)

    cy.get('input[type="email"]').should('be.visible').type(docente.emailDuplicado)
    cy.contains('button', 'Crear Cuenta').click()

    cy.wait('@getContexto')
    cy.wait('@sendOtp')
    cy.assertSwal('Error', 'User already registered')
  })

  it('CDS-T22: impide crear cuenta de docente con contraseña insegura', function () {
    const { docente, contexto } = this.data

    cy.intercept('POST', '**/auth/v1/signup**').as('signUp')

    cy.visitarCrearCuentaEstudiante(docente.email, contexto)

    cy.fillFormularioCrearCuenta({
      nombre: docente.nombre,
      apellidoPaterno: docente.apellidoPaterno,
      apellidoMaterno: docente.apellidoMaterno,
      fechaNacimiento: docente.fechaNacimiento,
      password: docente.passwordDebil,
    })

    cy.contains('button', 'Crear cuenta').click()
    cy.assertSwal('Error', 'Contraseña insegura')
    cy.get('@signUp.all').should('have.length', 0)
  })

  it('CDS-T23: rechaza caracteres no alfanuméricos en campos de nombre del docente', function () {
    const { docente, contexto } = this.data

    cy.intercept('POST', '**/auth/v1/signup**').as('signUp')

    cy.visitarCrearCuentaEstudiante(docente.email, contexto)

    cy.fillFormularioCrearCuenta({
      nombre: docente.nombreNoAlfanumerico,
      apellidoPaterno: docente.apellidoPaternoNoAlfanumerico,
      apellidoMaterno: docente.apellidoMaternoNoAlfanumerico,
      fechaNacimiento: docente.fechaNacimiento,
      password: docente.passwordFuerte,
    })

    cy.contains('button', 'Crear cuenta').click()
    cy.assertSwal('Error', 'Los campos de nombre solo permiten caracteres alfanuméricos')
    cy.get('@signUp.all').should('have.length', 0)
  })
})
