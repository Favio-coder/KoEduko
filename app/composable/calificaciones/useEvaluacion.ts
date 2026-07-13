import type { Estudiante } from '~/services/estudiantes/obtenerEstudiantesAula'
import type { Atributo } from '~/types/atributo'
import type { ValorAtributoRow } from '~/services/atributos/obtenerValoresAtributo'
import { obtenerEstudiantesAula } from '~/services/estudiantes/obtenerEstudiantesAula'
import { obtenerValoresAtributo } from '~/services/atributos/obtenerValoresAtributo'
import { guardarValorAtributo } from '~/services/atributos/guardarValorAtributo'

export function useEvaluacion() {
  const { $supabase } = useNuxtApp()

  const estudiantes = ref<Estudiante[]>([])
  const valoresMap = ref<Map<string, number | null>>(new Map())
  const loading = ref(false)
  const saving = ref(false)

  function valorKey(c_atri: string, c_usua: string): string {
    return `${c_atri}::${c_usua}`
  }

  async function loadEstudiantes(c_curso: string): Promise<void> {
    loading.value = true
    try {
      estudiantes.value = await obtenerEstudiantesAula($supabase, c_curso)
    } finally {
      loading.value = false
    }
  }

  async function loadValores(atributos: Atributo[]): Promise<void> {
    if (atributos.length === 0) {
      valoresMap.value = new Map()
      return
    }
    const ids = atributos.map(a => a.c_atributo)
    const rows = await obtenerValoresAtributo($supabase, ids)
    const map = new Map<string, number | null>()
    for (const row of rows) {
      map.set(valorKey(row.c_atri, row.c_usua), row.valor)
    }
    valoresMap.value = map
  }

  function getValor(c_atri: string, c_usua: string): number {
    return valoresMap.value.get(valorKey(c_atri, c_usua)) ?? 0
  }

  async function saveValor(c_atri: string, c_usua: string, valor: number): Promise<void> {
    saving.value = true
    try {
      await guardarValorAtributo($supabase, { c_atri, c_usua, valor })
      valoresMap.value.set(valorKey(c_atri, c_usua), valor)
    } finally {
      saving.value = false
    }
  }

  return {
    estudiantes,
    valoresMap,
    loading,
    saving,
    loadEstudiantes,
    loadValores,
    getValor,
    saveValor,
  }
}
