import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAulaStore } from '~/stores/aula'

const mockGrados = [
  {
    c_grad: 'g-1',
    l_grad: '1° Primaria',
    n_anio: 2026,
    l_desc: null,
    aulas: [{ c_aula: 'a-1', l_aula: 'A', l_desc: null }],
  },
  {
    c_grad: 'g-2',
    l_grad: '2° Primaria',
    n_anio: 2026,
    l_desc: null,
    aulas: [
      { c_aula: 'a-2', l_aula: 'B', l_desc: null },
      { c_aula: 'a-3', l_aula: 'C', l_desc: 'Laboratorio' },
    ],
  },
]

describe('AulaStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia con valores por defecto', () => {
    const store = useAulaStore()
    expect(store.gradosAulas).toEqual([])
    expect(store.gradoActual).toBeNull()
    expect(store.aulaActual).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('setGradosAulas() actualiza la lista', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    expect(store.gradosAulas).toHaveLength(2)
    expect(store.gradosAulas[0].l_grad).toBe('1° Primaria')
  })

  it('seleccionarGrado() cambia gradoActual y resetea aulaActual a null', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[0])
    expect(store.gradoActual?.c_grad).toBe('g-1')
    expect(store.aulaActual).toBeNull()
  })

  it('seleccionarAula() actualiza aulaActual', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[1])
    store.seleccionarAula(mockGrados[1].aulas[0])
    expect(store.aulaActual?.c_aula).toBe('a-2')
    expect(store.aulaActual?.l_aula).toBe('B')
  })

  it('seleccionCompleta es false si solo hay grado sin aula', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[0])
    expect(store.seleccionCompleta).toBe(false)
  })

  it('seleccionCompleta es true si hay grado y aula', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[0])
    store.seleccionarAula(mockGrados[0].aulas[0])
    expect(store.seleccionCompleta).toBe(true)
  })

  it('contextoActual retorna string con grado y aula', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[1])
    store.seleccionarAula(mockGrados[1].aulas[1])
    expect(store.contextoActual).toBe('2° Primaria · C')
  })

  it('contextoActual retorna string vacío sin selección', () => {
    const store = useAulaStore()
    expect(store.contextoActual).toBe('')
  })

  it('aulasDelGrado retorna aulas del grado seleccionado', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[1])
    expect(store.aulasDelGrado).toHaveLength(2)
    expect(store.aulasDelGrado[1].l_aula).toBe('C')
  })

  it('clear resetea todo el estado', () => {
    const store = useAulaStore()
    store.setGradosAulas(mockGrados)
    store.seleccionarGrado(mockGrados[0])
    store.seleccionarAula(mockGrados[0].aulas[0])
    store.clear()
    expect(store.gradosAulas).toEqual([])
    expect(store.gradoActual).toBeNull()
    expect(store.aulaActual).toBeNull()
    expect(store.error).toBeNull()
  })
})
