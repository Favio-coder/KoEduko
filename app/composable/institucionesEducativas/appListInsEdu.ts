import { listInstitucionesEdu } from "~/services/login/listInsEdu";


interface InstitucionEdu {
    c_ie: string
    l_col: string
}

export const appListInsEdu = () => {

    //const instituciones: any = ref([])
    const instituciones = ref<InstitucionEdu[]>([]) //Tipado de TS


    const fetchInstituciones = async () =>  {
        const { $supabase } = useNuxtApp()

        instituciones.value = await listInstitucionesEdu($supabase)
    }

    return {
        instituciones,
        fetchInstituciones
    }
}