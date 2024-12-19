import $api from "../http";

const setAuthData = (data) => {
     localStorage.setItem('authData', JSON.stringify(data));
 };
 
class AuthService {
     static async login(login, password) {
         try {
             const response = await $api.post('/login', {
                 login,
                 password,
                 provider: "Opticom"
             });
             
             if (response.data.accessToken && response.data.refreshToken) {
                 setAuthData(response.data);
             }
             
             return response;
         } catch (error) {
             console.error('Login error:', error);
             throw error;
         }
     }
 
     static async loginPhone(phone) {
         try {
             const response = await $api.post('/loginPhone', {
                 phone,
                 provider: "Opticom"
             });
             
             if (response.data.accessToken && response.data.refreshToken) {
                 setAuthData(response.data);
             }
             
             return response;
         } catch (error) {
             console.error('Phone login error:', error);
             throw error;
         }
     }
     
     static async logout() {
         try {
             const response = await $api.post('/logout', {
                 uid: getAuthData()?.user?.uid
             });
             removeAuthData();
             return response;
         } catch (error) {
             console.error('Logout error:', error);
             removeAuthData();
             throw error;
         }
     }
 
     static async checkAuth() {
         try {
             const authData = getAuthData();
             if (!authData) return false;
 
             // Можна додати перевірку терміну дії токена
             const response = await $api.get('/check-auth');
             return response.data.isAuth;
         } catch (error) {
             return false;
         }
     }
 
     // Утиліти для роботи з токенами
     static getAccessToken() {
         return getAuthData()?.accessToken;
     }
 
     static getRefreshToken() {
         return getAuthData()?.refreshToken;
     }
 
     static getUser() {
         return getAuthData()?.user;
     }
 }
 
 export default AuthService;