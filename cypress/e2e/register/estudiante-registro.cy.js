describe('Registro de usuario - Estudiante', () => {
  beforeEach(() => {
    cy.fixture('estudiante').as('data')
    cy.loginReal()
  })

  // CDS-T14 | T-01-Registrar usuario - Estudiante - Exitoso
  it('CDS-T14: registra un estudiante exitosamente', function () {
    const { estudiante, institucion } = this.data

    cy.visit('/register')
    cy.contains('h1', 'Registro').should('be.visible')
  })

  // CDS-T15 | T-02-Registrar usuario - Estudiante - Correo incorrecto
  it('CDS-T15: muestra error cuando el correo tiene formato incorrecto', function () {
    const { estudiante, institucion } = this.data

    cy.visit('/register')
    cy.contains('h1', 'Registro').should('be.visible')
  })

  // CDS-T16 | T-03-Registrar usuario - Estudiante - Correo repetido de la base de datos
  it('CDS-T16: muestra error cuando el correo ya existe en la base de datos', function () {
    const { estudiante, institucion, contexto } = this.data

    cy.visit('/register')
    cy.contains('h1', 'Registro').should('be.visible')
  })

  // CDS-T17 | T-04-Registrar usuario - Estudiante - Contraseña debil
  it('CDS-T17: impide crear una cuenta con contraseña insegura', function () {
    const { estudiante, contexto } = this.data

    cy.visitarCrearCuentaEstudiante(estudiante.email, contexto)

    cy.fillFormularioCrearCuenta({
      nombre: 'Favio',
      apellidoPaterno: 'Asturimac',
      apellidoMaterno: 'Medina',
      fechaNacimiento: estudiante.fechaNacimiento,
      password: 'Abcdef123',
    })

    cy.contains('Regular').should('be.visible')

    cy.contains('button', 'Crear cuenta').click()

    cy.assertSwal('Error', 'Contraseña insegura')
  })

  // CDS-T18 | T-05-Registrar usuario - Estudiante - Campos Alfanuméricos
  it('CDS-T18: rechaza caracteres no alfanuméricos en los campos de nombre', function () {
    const { estudiante, contexto } = this.data

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
  })
})
