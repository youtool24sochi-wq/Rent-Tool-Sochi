import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'

import $axios from '@/shared/api/axios'
import { AuthTypes } from '@/shared/types/auth/auth.interface'
import { UsersTypes } from '@/shared/types/users/users.interface'
import { API_URL } from '@/shared/utils/consts'

import { RootState } from '../../store'

// const rawUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
const initialState: AuthTypes.AuthState = {
  user: null,
  tokens: null,
  isValidToken: true,
  error: null,
  isAuth: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state: AuthTypes.AuthState, action: PayloadAction<UsersTypes.Individual>) => {
      const user = JSON.stringify(action.payload)

      localStorage.setItem('user', user)
      state.user = action.payload
      state.isAuth = true
    },
    setTokens: (state: AuthTypes.AuthState, action: PayloadAction<AuthTypes.Tokens>) => {
      const tokens = JSON.stringify(action.payload)

      localStorage.setItem('tokens', tokens)
      state.tokens = action.payload
      state.isAuth = true
    },
    setLogout: (state: AuthTypes.AuthState) => {
      localStorage.removeItem('tokens')
      localStorage.removeItem('user')
      state.tokens = null
      state.user = null
      state.isAuth = false
    },

    setIsValidToken(state: AuthTypes.AuthState, action: PayloadAction<boolean>) {
      state.isValidToken = action.payload
    },
    hydrateFromStorage: (state,action: PayloadAction<{ user: AuthTypes.User | null; tokens: AuthTypes.Tokens | null }>) => {
      state.user = action.payload.user
      state.tokens = action.payload.tokens
      state.isAuth = Boolean(action.payload.user && action.payload.tokens?.access)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAuth.pending, () => {})
    builder.addCase(loginAuth.fulfilled, (state) => {
      state.isAuth = true
    })
    builder.addCase(register.rejected, (state) => {
      state.isAuth = false
    })
  },
})

export const loginAuth = createAsyncThunk<unknown, AuthTypes.LoginUser>(
  'auth/login',
  async (data: AuthTypes.LoginUser, { dispatch, rejectWithValue }) => {
    try {
      const { data: response } = await axios.post(`${API_URL}/auth/login/`, data)

      const { refresh, access, user } = response

      dispatch(authSlice.actions.setTokens({ refresh, access }))
      dispatch(authSlice.actions.setUser(user))

      return response
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const register = createAsyncThunk<any, AuthTypes.RegisterUser>(
  'auth/register',
  async (data: AuthTypes.RegisterUser, { dispatch,rejectWithValue }) => {
    try {
      const { data: response } = await axios.post(`${API_URL}/auth/register/`, data)

      const { refresh, access, user } = response

      if (refresh && access && user) {
        dispatch(authSlice.actions.setTokens({ refresh, access }))
        dispatch(authSlice.actions.setUser(user))
      }

      return response
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const activateUser = createAsyncThunk<unknown, AuthTypes.ActivateUser>(
  'auth/register',
  async (data: AuthTypes.ActivateUser, { dispatch, rejectWithValue }) => {
    try {
      const { data: response } = await axios.post(`${API_URL}/users/activation/`, data)

      const { refresh, access, user } = response

      dispatch(authSlice.actions.setTokens({ refresh, access }))
      dispatch(authSlice.actions.setUser(user))
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const passwordReset = createAsyncThunk<any, AuthTypes.PasswordReset>(
  'auth/register',
  async (data: AuthTypes.PasswordReset, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/password_reset/`, data)

      return response
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const passwordResetConfirm = createAsyncThunk<any, AuthTypes.PasswordResetConfirm>(
  'auth/register',
  async (data: AuthTypes.PasswordResetConfirm, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/password_reset_confirm/`, data)

      return response
    } catch (error) {
      const err = error as AxiosError

      return rejectWithValue(err.response)
    }
  },
)

export const refreshToken = createAsyncThunk<unknown, void>(
  'auth/refresh',
  async (_, { getState, dispatch , rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const refresh = state.auth.tokens?.refresh

      const { data } = await $axios.post(`${API_URL}/users/refresh/`, {
        refresh,
      })

      if (!state.auth.isValidToken) {
        dispatch(authSlice.actions.setTokens(data))
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response!.data.message)
      }
    }
  },
)

export const refreshOAuth2Token = createAsyncThunk<unknown, any>(
  'auth/refresh',
  async (access_token: string , { dispatch , rejectWithValue }) => {
    try {

      const { data } = await axios.post(`${API_URL}/auth/oauth2/refresh/`, {
        access_token,
      })

      const { refresh, access } = data

      dispatch(authSlice.actions.setTokens({ refresh, access }))

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response!.data.message)
      }
    }
  },
)

export const userMe = createAsyncThunk<unknown, void>(
  'auth/userMe',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const token = state.auth.tokens?.access

      const response: any  = await $axios.get(`${API_URL}/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      dispatch(setUser(response.data))
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response!.data.message)
      }
    }
  },
)

export const { setUser, setLogout, setTokens, hydrateFromStorage } = authSlice.actions
export default authSlice.reducer
