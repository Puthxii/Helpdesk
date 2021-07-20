export interface Roles {
    customer?: boolean
    supporter?: boolean
    maintenance?: boolean
    supervisor?: boolean
    developer?: boolean
}

export interface User {
    uid?: string
    email?: string
    password?: string
    name?: string
    firstName?: string
    lastName?: string
    fullName?: string
    mobileNumber?: string
    roles?: Roles
    photoURL?: string
    keyword?: any
}
