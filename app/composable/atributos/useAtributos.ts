import type { Atributo, CrearAtributoDTO, EditarAtributoDTO } from '~/types/atributo'
import { listarAtributos } from '~/services/atributos/listarAtributos'
import { crearAtributo } from '~/services/atributos/crearAtributo'
import { editarAtributo } from '~/services/atributos/editarAtributo'
import { eliminarAtributo } from '~/services/atributos/eliminarAtributo'

export function useAtributos() {
  const { $supabase } = useNuxtApp()

  const atributos = ref<Atributo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = ref(false)

  async function loadAtributos(c_curso: string): Promise<Atributo[]> {
    loading.value = true
    error.value = null
    try {
      const data = await listarAtributos($supabase, c_curso)
      atributos.value = data
      return data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(payload: CrearAtributoDTO): Promise<Atributo> {
    saving.value = true
    try {
      const created = await crearAtributo($supabase, payload)
      atributos.value.push(created)
      return created
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      saving.value = false
    }
  }

  async function update(c_atributo: string, payload: EditarAtributoDTO): Promise<Atributo> {
    saving.value = true
    try {
      const updated = await editarAtributo($supabase, c_atributo, payload)
      const idx = atributos.value.findIndex(a => a.c_atributo === c_atributo)
      if (idx !== -1) {
        atributos.value[idx] = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      saving.value = false
    }
  }

  async function remove(c_atributo: string): Promise<void> {
    saving.value = true
    try {
      await eliminarAtributo($supabase, c_atributo)
      atributos.value = atributos.value.filter(a => a.c_atributo !== c_atributo)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      saving.value = false
    }
  }

  const pesoTotal = computed(() =>
    atributos.value.reduce((sum, a) => sum + a.peso, 0)
  )

  const tipoPredominante = computed(() => {
    const conteo: Record<string, number> = {}
    for (const a of atributos.value) {
      conteo[a.tipo] = (conteo[a.tipo] ?? 0) + 1
    }
    let max = 0
    let pred = '—'
    for (const [tipo, count] of Object.entries(conteo)) {
      if (count > max) {
        max = count
        pred = tipo
      }
    }
    return pred
  })

  return {
    atributos,
    loading,
    error,
    saving,
    pesoTotal,
    tipoPredominante,
    loadAtributos,
    create,
    update,
    remove,
  }
}
