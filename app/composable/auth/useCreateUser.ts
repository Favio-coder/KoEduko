import { enviarCorreoRegistro } from "~/services/auth/crear-cuenta";

export const useCreateUser = () => {

    const loading = ref(false)

    const crearCuenta = async (email: string, codInstitucion: string, instance_id: string, rol: string) => {
        loading.value = true 

        try{
            await enviarCorreoRegistro(email, codInstitucion, instance_id, rol)
        }finally{
            loading.value = false
        }
    }

    return {
        crearCuenta, 
        loading
    }

}