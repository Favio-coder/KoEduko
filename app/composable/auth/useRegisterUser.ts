import { registrarUsuario } from "~/services/auth/register";

export const useRegistrarUsuario = () => {

    const loading = ref(false)

    const register = async (payload: any) => {

        loading.value = true

        try{

            const response = await registrarUsuario(payload)

            return response

        }finally{
            loading.value = false
        }


    }

    return {
        register, 
        loading
    }

}