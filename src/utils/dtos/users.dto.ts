export interface CreateUserDto {
    phoneNumber: string
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface AuthUserDto {
    email: string
    password: string
}
