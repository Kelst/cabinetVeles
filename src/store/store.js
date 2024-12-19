import axios from 'axios'
import { create } from 'zustand'
import AuthService from '../services/AuthService'
import UserService from '../services/UserService'
import $api from '../http'
const useStore = create((set) => ({
  uid:[],
  ip:"",
  fio:"",
  login:"",
  isAuth:false,
  isCheckedPhone:false,
  errorMessage:'',
  openLoader:false,
  token:'',
  internetId:"",
  user:{
    uid:"",
    id:"",
  },
  userData: null,
  setLoader(){
    set(state=>({...state,openLoader:!state.openLoader}))
  },
async checkUser(){
  try {
    let data= await UserService.checkUser()
    console.log(data,"Check User");
    
    set(state=>({...state,isAuth:data}))
    return {isAuth: data}
    
  } catch (error) {
    return {isAuth: false}
    console.log("Error check user");
  }

},
async LoadData(login,password){
  try {
    const response=await AuthService.login(login,password)
    localStorage.setItem('token',response.data.accessToken);
    localStorage.setItem('uid',response.data.user.uid);
    console.log("UID",response.data);
    set(state=>({...state,isAuth:true,errorMessage:'',user:{...state.user,...response.data.user}}))
    return {flag:true,errText:''}
  } catch (error) {
    console.log(error.response?.data?.message,"MESSAge ERROR");
    set(state=>({...state,errorMessage:error.response?.data?.message}))
    return {flag:false,errText:error?.response?.data?.message}
  }

},
async getData(uid) {
  try {
    const response = await UserService.fetchUsers(uid)
    console.log( response,"From get Data");
    
    set(state => ({ 
      ...state, 
      userData: response,
      user: {
        ...state.user,
        ...response
      }
    }))
    
  } catch (e) {
    console.log(e)
  }
},
// async changeUser(uid) {
//   try {
//     localStorage.setItem('uid', uid);
//     const response = await UserService.fetchUsers(uid)
//     console.log( response,"From changeUser");
    
//     set(state => ({ 
//       ...state, 
//       userData: response,
//       user: {
//         ...state.user,
//         ...response
//       }
//     }))
    
//   } catch (e) {
//     console.log(e)
//   }
// },
async logIn(login, password) {
  try {
    const response = await AuthService.login(login, password)
    
    // Перевіряємо, чи є в відповіді повідомлення про помилку
    if (response.data.message && response.data.message.includes('Не вірний пароль')) {
      set(state => ({
        ...state, 
        errorMessage: response.data.message,
        isAuth: false
      }))
      return {
        flag: false, 
        errText: response.data.message
      }
    }
    
    // Якщо є accessToken - значить авторизація успішна
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('uid', response.data.user.uid);
      console.log("UID", response.data);
      
      set(state => ({
        ...state,
        isAuth: true,
        errorMessage: '',
        user: {
          ...state.user,
          ...response.data.user
        }
      }))
      
      return {
        flag: true,
        errText: ''
      }
    }
    
    // Якщо жодна з умов не спрацювала - повертаємо помилку
    throw new Error('Неочікувана відповідь від сервера')
    
  } catch (error) {
    console.log(error.response?.data?.message, "MESSAGE ERROR");
    
    const errorMessage = error.response?.data?.message || error.message || 'Помилка авторизації'
    
    set(state => ({
      ...state,
      errorMessage: errorMessage
    }))
    
    return {
      flag: false,
      errText: errorMessage
    }
  }
},
setCheckedPhone(){
set(state=>({...state,isCheckedPhone:!state.isCheckedPhone}))
},
async logInPhone(phone){
  try {
    const response=await AuthService.loginPhone(phone)
    const {token}=response.data

    set(state=>({...state,token:token,isCheckedPhone:true,errorMessage:''}))
    return true
  } catch (error) {
    console.log(error.response?.data?.message);
    set(state=>({...state,errorMessage:error.response?.data?.message}))
    return false
  }

},
async logOut(){
  try {
    console.log(localStorage.getItem('uid'),"FDFDD");
    const response=await AuthService.logouth()
    console.log(response,"LOGOUT");
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    set(state=>({...state,token:'',isAuth:false,user:{uid:"",id:""},userData:null}))
  } catch (error) {
    console.log("HUI");
    console.log(error.response?.data?.message);
  }

},
async handleVeriffyCode(code, phone) {
  try {
    const response = await axios.post(`http://194.8.147.150:5000/api/confirmCodePhone`, {
      code,
      phone
    });
    
    console.log('Server response:', response.data); // Для дебагу
    
    // Перевіряємо успішну відповідь і наявність токена
    if (response.data) {
     
     
      return {
     ...response.data
      }
    }

    // Якщо немає токена або даних користувача
    return {
      flag: false,
      errText: 'Помилка авторизації: відсутній токен доступу'
    };

  } catch (error) {
    console.error('Verification error:', error.response || error);
    
    return {
      flag: false,
      errText: error.response?.data?.message || 'Помилка підтвердження коду'
    };
  }
},
async checkAuth(){
  try {
  
  } catch (error) {
  
  }

},
 async checkBillingApi(){
  try {
  const user= await axios.get(`http://194.8.147.150:5000/api/checkIpBilling?provider=${'Opticom'}`)
  if(user.status=='200'){
return user.data
  } else {
    return {uid:"",id:"",fio:"",password:"",ip:""}
  }
  } catch (error) {
    
  }
 },
 async checkBillingApiGuest(guestIp){
  try {
  const user= await axios.get(`http://194.8.147.150:5000/api/checkBillingApiGuest?guestIp=${guestIp}&provider=${'Opticom'}`)
  if(user.status=='200'){
return user.data
  } else {
    return {uid:"",id:"",fio:"",password:"",ip:""}
  }
  } catch (error) {
    
  }
 },
 
 async reloadSession(uid) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/reloadSession', { uid })
    const result = response.data
    if (result.flag) {
      console.log("Session reloaded successfully:", result.reloadResult.message)
    } else {
      console.log("Failed to reload session:", result.reloadResult.message)
    }
    return result
  } catch (error) {
    console.error("Error reloading session:", error)
    return {
      flag: false,
      reloadResult: {
        success: false,
        message: "An error occurred while reloading the session"
      }
    }
  }
},
async unlinkPhone(uid, uidPrime, phone, loginOld) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/unlinkPhone', { 
      uid, 
      uidPrime, 
      phone, 
      loginOld 
    });
    
    const result = response.data;
    
    if (result.flag) {
      // Оновлюємо state, видаляючи відповідний логін з subLogin
      set(state => ({
        ...state,
        userData: {
          ...state.userData,
          subLogin: state.userData.subLogin.filter(login => login.uid !== uid)
        }
      }));
      
      console.log("Session reloaded successfully:", result.unlinkResult.message);
    } else {
      console.log("Failed to reload session:", result.unlinkResult.message);
    }
    
    return result;
  } catch (error) {
    console.error("Error unlinkResult session:", error);
    return {
      flag: false,
      reloadResult: {
        success: false,
        message: "An error occurred while unlinkResult the session"
      }
    };
  }
},
async stopPlayLogin(uid,login,balance,billId,feesM) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/toogleStopPlayLogin', { uid,login,balance,billId,feesM})
    const result = response.data
    if (result.disabled==0) {
      console.log("Логін активовано")
      set(state => ({ 
        ...state, 
        userData: {...state.userData,status :true},
        user: {
          ...state.user,
          status:true,
         
        }
      }))
    }else if (result.disabled==3) {
      console.log("Логін призупинено")
      set(state => ({ 
        ...state, 
        userData: {...state.userData,status :false},
        user: {
          ...state.user,
          status:false,
         
        }
      }))
    } else {
      console.log("помилка при активації/призупиненні логіна");
    }
    return {
      flag:result.disabled!=1,
      disabled:result.disabled
    }
  } catch (error) {
    console.error("Error start login:", error)
    return {
      flag: false
    }
  }
},
async clearCid(uid) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/clearCid', { uid })
    const result = response.data
    if (result.flag) {
      console.log("Мак очищено", result.reloadResult.message)
      set(state => ({ 
        ...state, 
        userData: {...state.userData,cid :""},
        user: {
          ...state.user,
          cid:"",
          
        }
      }))
    } else {
      console.log("Failed to clear mac:", result.message)
    }
    return result
  } catch (error) {
    console.error("Error clear cid:", error)
    return result
  }
},
async addCredit(uid,login) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/addCredit', { uid,login })
    const result = response.data
    if (result.status) {
      function addFiveDaysToToday() {
        const today = new Date();
        today.setDate(today.getDate() + 5);
        
        return today.getFullYear() + '-' + 
               String(today.getMonth() + 1).padStart(2, '0') + '-' + 
               String(today.getDate()).padStart(2, '0');
      }
      console.log("Кредит встановлено", result.message)
      set(state => ({ 
        ...state, 
        userData: {...state.userData,deposit :"4444",dateOfEndCredits:addFiveDaysToToday()},
        user: {
          ...state.user,
          deposit :"4444",
          dateOfEndCredits:addFiveDaysToToday()
          
        }
      }))
    } else {
      console.log("Failed to set credit:", result.message)
    }
    return result
  } catch (error) {
    console.error("Error clear cid:", error)
    return result
  }
},
async requestPhoneChange(uid,login,newPhone) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/request-phone-change', { uid,login,newPhone,provider:'Opticom'})
    const result = response.data
    return result
  } catch (error) {
    console.error("Error clear cid:", error)
    return result
  }
},
async confirmPhoneChange(uid,login,code,phone,newPhone) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/confirm-phone-change', {uid,login,code,phone})
    const result = response.data
    if(result.success){
      set(state => ({ 
        ...state, 
        userData: {...state.userData,phone :newPhone},
        user: {
          ...state.user,
          phone :newPhone,
          
        }
      }))
    }
    return result
  } catch (error) {
    console.error("Error clear cid:", error)
    return result
  }
},


async requestPasswordChange(uid,login,oldPassword,newPassword) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/request-password-change', {uid,login,oldPassword,newPassword})
    const result = response.data
    return result
  } catch (error) {
    console.error("Error clear cid:", error)
    return result
  }
},
async getPayments(uid) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getPayments?uid=${uid}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getPayments :", error)
    return result
  }
},
async getFees(uid) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getFees?uid=${uid}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getFees :", error)
    return result
  }
},
async getTaskUser(uid) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getTaskUser?uid=${uid}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getTaskUser :", error)
    return result
  }
},
async getListTariffAvaible(uid) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getAvailableTariffUID?uid=${uid}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getTaskUser :", error)
    return result
  }
},
async getPortmoneLink(login,suma) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getPortmoneLink?login=${login}&suma=${suma}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getPortmoneLink :", error)
    return result
  }
},

async getPrivat24Link(login,suma) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getPrivat24Link?login=${login}&suma=${suma}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getPrivat24Link :", error)
    return result
  }
},
async getEasypayLink(login,suma) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getEasypayLink?login=${login}&suma=${suma}&provider=Opticom`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getEasypayLink :", error)
    return result
  }
},
async getLiqPayLink(login,suma) {
  try {
    const response = await $api.get(`http://194.8.147.150:5000/api/getLiqPayLink?login=${login}&suma=${suma}`)
    const result = response.data
    return result
  } catch (error) {
    console.error("Error getLiqPayLink :", error)
    return result
  }
},

async changeTariffPlan(uid, internetId, tpId) {
  try {
    const response = await $api.post('http://194.8.147.150:5000/api/changeTariffPlan', { uid, internetId, tpId });
    const result = response.data;
    if (result.success) {
      // Знаходимо вибраний тариф по tpId із state
      set(state => {
        const selectedTariff = state.user.tarifAvaible.find(tariff => tariff.tp_id === tpId);
        
        if (selectedTariff) {
          return { 
            ...state, 
            userData: {
              ...state.userData,
              tariff: selectedTariff.name,
              monthlyPayment: selectedTariff.month_fee
            },
            user: {
              ...state.user,
              tariff: selectedTariff.name,
              monthlyPayment: selectedTariff.month_fee
            }
          };
        }
        return state;
      });
    }
    return result;
  } catch (error) {
    console.error("Error changeTariffPlan:", error);
    return result;
  }
},
 makerLinksToFastPayEasyPay  (amount, login)  {
  const param = `account=${login}&amount=${amount}&readonly=account`;
  console.log(param);
  const encodedData = btoa(param);
  console.log(encodedData);

  return encodedData;
},
async getDataOnu(uid) {
  try {
    const response = await $api.post(`http://194.8.147.150:5000/api/get-info-hard`,{ uid,})
    const result = response.data
    console.log(result);
    
    return result
  } catch (error) {
    console.error("Error getDataOnu :", error)
    return result
  }
},
async addAdditionalService(uid,login,phone,description) {
  try {

    const response = await $api.post('http://194.8.147.150:5000/api/addAdditionalService', { uid, login, phone,description,provider:'Opticom' });
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error changeTariffPlan:", error);
    return result;
  }
},
async addStaticRequest(login,phone) {
  try {

    const response = await $api.post('http://194.8.147.150:5000/api/addStaticRequest', {login, phone,provider:'Opticom' });
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error addStaticRequest:", error);
    return result;
  }
},
async addFeedBack(feedBack,phone,login) {
  try {

    const response = await $api.post('http://194.8.147.150:5000/api/addFeedback', {feedBack,phone,login,provider:"Opticom" });
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error addFeedBack:", error);
    return result;
  }
},
async addFeedBackU(login,phone,message,sublogin) {
  try {

    const response = await $api.post('http://194.8.147.150:5000/api/addFeedbackU', {login,phone,message,sublogin,provider:"Opticom" });
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error addFeedBackU:", error);
    return result;
  }
},
async removeStaticRequest(login) {
  try {

    const response = await $api.post('http://194.8.147.150:5000/api/removeStaticRequest', {login,provider:'Opticom'});
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error removeStaticRequest:", error);
    return result;
  }
},

}))
  export default useStore
