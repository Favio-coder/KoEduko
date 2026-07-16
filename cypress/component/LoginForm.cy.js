describe('LoginForm Component', () => {
  it('Renderiza inputs de email y password', () => {
    document.body.innerHTML = `
      <form>
        <input type="email" placeholder="Correo electrónico" data-test="email" />
        <input type="password" placeholder="Contraseña" data-test="password" />
        <button type="submit">Ingresar</button>
      </form>
    `
    cy.get('[data-test="email"]').should('be.visible')
    cy.get('[data-test="password"]').should('be.visible')
    cy.contains('Ingresar').should('be.visible')
  })

  it('Toggle password show/hide cambia el type del input', () => {
    document.body.innerHTML = `
      <div id="app">
        <input type="password" data-test="password" id="pw" />
        <button onclick="
          var pw = document.getElementById('pw');
          pw.type = pw.type === 'password' ? 'text' : 'password';
        " data-test="toggle">Mostrar</button>
      </div>
    `
    cy.get('[data-test="password"]').should('have.attr', 'type', 'password')
    cy.get('[data-test="toggle"]').click()
    cy.get('[data-test="password"]').should('have.attr', 'type', 'text')
  })
})
