export type LoginSuccessResponse = {
    token: string
    refreshToken: string
}

export type LoginResponseType =  'USERNAME_OR_PASSWORD_INCORRECT' | 'EMAIL_TAKEN' | 'SUCCESS'
