export type LoginSuccessResponse = {
    token: string
    refreshToken: string
}

export type LoginResponseType = 'SERVER_ERROR' | 'USERNAME_OR_PASSWORD_INCORRECT' | 'EMAIL_TAKEN' | 'SUCCESS'
