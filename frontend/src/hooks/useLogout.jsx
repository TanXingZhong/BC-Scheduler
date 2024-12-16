import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()

  const logout = async () => {
    
    const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: "include", // Required to include cookies in the request
    })

    const text = await response.json();

    if (!response.ok) {
    console.error('HTTP error:', response.status, response.statusText);
    return;
    } else {
        console.log(response);
    }

    // remove user from storage
    // localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    
  }

  return { logout }
}