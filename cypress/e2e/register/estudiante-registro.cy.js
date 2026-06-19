describe('Registro de usuario - Estudiante', () => {
  beforeEach(() => {
    cy.fixture('estudiante').as('data')
  })

  // CDS-T14 | T-01-Registrar usuario - Estudiante - Exitoso
  it('CDS-T14: registra un estudiante exitosamente', function () {
    const { estudiante, institucion, contexto } = this.data

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

    cy.get('input[type="email"]').should('be.visible').type(estudiante.email)
    cy.contains('button', 'Crear Cuenta').click()

    cy.wait('@getContexto')
    cy.wait('@sendOtp')
    cy.assertSwal('Correo enviado', 'Revisa tu email para continuar')
  })

  // CDS-T15 | T-02-Registrar usuario - Estudiante - Correo incorrecto
  it('CDS-T15: muestra error cuando el correo tiene formato incorrecto', function () {
    const { estudiante, institucion } = this.data

    cy.mockInstituciones(institucion)
    cy.visit('/register')

    cy.wait('@getInstituciones')
    cy.selectInstitucion(institucion.l_col)

    cy.get('input[type="email"]').should('be.visible').type(estudiante.emailInvalido)
    cy.contains('button', 'Crear Cuenta').click()

    cy.assertSwal('Error', 'Correo inválido')
  })

  // CDS-T16 | T-03-Registrar usuario - Estudiante - Correo repetido de la base de datos
  it('CDS-T16: muestra error cuando el correo ya existe en la base de datos', function () {
    const { estudiante, institucion, contexto } = this.data

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

    cy.get('input[type="email"]').should('be.visible').type(estudiante.emailDuplicado)
    cy.contains('button', 'Crear Cuenta').click()

    cy.wait('@getContexto')
    cy.wait('@sendOtp')
    cy.assertSwal('Error', 'User already registered')
  })

  // Test mal hecho

  // CDS-T17 | T-04-Registrar usuario - Estudiante - Contraseña debil
  // it('CDS-T17: muestra error cuando la contraseña es débil', function () {
  //   const { estudiante, contexto } = this.data

  //   cy.intercept('POST', '**/auth/v1/signup**').as('signUp')

  //   cy.visitarCrearCuentaEstudiante(estudiante.email, contexto)

  //   // cy.fillFormularioCrearCuenta({
  //   //   nombre: estudiante.nombre,
  //   //   apellidoPaterno: estudiante.apellidoPaterno,
  //   //   apellidoMaterno: estudiante.apellidoMaterno,
  //   //   fechaNacimiento: estudiante.fechaNacimiento,
  //   //   password: estudiante.passwordFuerte,
  //   // })

  //   cy.fillFormularioCrearCuenta({
  //     nombre: 'Favio',
  //     apellidoPaterno: 'Asturimac',
  //     apellidoMaterno: 'Medina',
  //     fechaNacimiento: estudiante.fechaNacimiento,
  //     password: estudiante.passwordFuerte,
  //   })

  //   cy.get('input[placeholder="Nueva contraseña"]')
  //     .click()
  //     .type('{selectAll}{del}')
  //     //.type(estudiante.passwordDebil, { parseSpecialCharSequences: false, force: true })
  //     .type('abc123', { parseSpecialCharSequences: false, force: true })

  //   cy.contains('p', 'Regular').should('be.visible')
  //   cy.contains('button', 'Crear cuenta').click()

  //   cy.assertSwal('Error', 'Contraseña insegura')
  //   cy.get('@signUp.all').should('have.length', 0)
  // })

  //Test bien realizado

  it('CDS-T17: impide crear una cuenta con contraseña insegura', function () {
  const { estudiante, contexto } = this.data

  cy.intercept('POST', '**/auth/v1/signup**').as('signUp')

  cy.visitarCrearCuentaEstudiante(estudiante.email, contexto)

  cy.fillFormularioCrearCuenta({
    nombre: 'Favio',
    apellidoPaterno: 'Asturimac',
    apellidoMaterno: 'Medina',
    fechaNacimiento: estudiante.fechaNacimiento,
    password: 'abc123',
  })



  // Validar indicador de fortaleza
  cy.contains('Regular').should('be.visible')

  // Intentar crear la cuenta
  cy.contains('button', 'Crear cuenta').click()

  // Validar mensaje de error
  cy.assertSwal('Error', 'Contraseña insegura')

  // Validar que no se envió la solicitud de registro
  cy.get('@signUp.all').should('have.length', 0)
})

  // CDS-T18 | T-05-Registrar usuario - Estudiante - Campos Alfanuméricos
  it('CDS-T18: rechaza caracteres no alfanuméricos en los campos de nombre', function () {
    const { estudiante, contexto } = this.data

    cy.intercept('POST', '**/auth/v1/signup**').as('signUp')

    cy.visitarCrearCuentaEstudiante(estudiante.email, contexto)

    cy.fillFormularioCrearCuenta({
      nombre: estudiante.nombreNoAlfanumerico,
      apellidoPaterno: estudiante.apellidoPaternoNoAlfanumerico,
      apellidoMaterno: estudiante.apellidoMaternoNoAlfanumerico,
      fechaNacimiento: estudiante.fechaNacimiento,
      password: estudiante.passwordFuerte,
    })

    cy.contains('button', 'Crear cuenta').click()

    cy.assertSwal('Error', 'Los campos de nombre solo permiten caracteres alfanuméricos')
    cy.get('@signUp.all').should('have.length', 0)
  })
})
