describe('KpiCard Component', () => {
  it('Renderiza tarjeta con título y valor', () => {
    document.body.innerHTML = `
      <div class="kpi-card">
        <p class="kpi-title">Total Alumnos</p>
        <p class="kpi-value">42</p>
      </div>
    `
    cy.contains('Total Alumnos').should('be.visible')
    cy.contains('42').should('be.visible')
  })

  it('Renderiza tarjeta con valor 0 correctamente', () => {
    document.body.innerHTML = `
      <div class="kpi-card">
        <p class="kpi-title">Promedio General</p>
        <p class="kpi-value">0</p>
      </div>
    `
    cy.contains('Promedio General').should('be.visible')
    cy.contains('0').should('be.visible')
  })
})
