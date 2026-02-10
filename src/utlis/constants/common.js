
export function StoreTokenInLocalStorage(token) {
    localStorage.setItem('token', token)
}

export function GetTokenFromLocalStorage() {
    localStorage.getItem('token')
}

export const getToken = localStorage.getItem('token')