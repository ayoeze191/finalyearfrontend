
interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    phone_number: string
  }
  interface AuthUser {
    token: string
    message: string
    user_id: number
    user_type: number
    admin_type: string
  }


interface AuthState {
    authenticating: boolean
    user?: User
    error?: Error
    token?: string
  }
const token = localStorage.getItem('token')
const state = reactive<AuthState>({
    authenticating: false,
    user: undefined,
    error: undefined,
    token: token || undefined,
  })

export const useAuth = () => {
    const setUser = (payload: AuthUser, remember: boolean): void => {
      if (remember) {
        localStorage.removeItem('token')
      }
      state.token = payload['token']
      state.error = undefined
    }
    const logout = (): Promise<void> => {
      localStorage.removeItem('token')
      localStorage.clear()
      return Promise.resolve((state.user = undefined))
    }
  
    return {
      setUser,
      logout,
      ...toRefs(state),
    }
  }