import axios from 'axios'
import { create } from 'zustand'
import $api from '../http'
const dataStore = create((set) => ({
  user:{
    name:"",
    uid:"",
    status:"",
    telegramId:"",
    phone:'',
    login:'',
    adress:"",
    statusInternet:true,
    balance:"",
    deposit:"",
    monthlyPayment:"",
    dateOfEndCredits:"",
    tariff:"",
    lastPay:"",
    ip:"",
    duration:"",
    sendData:"",
    getData:"",
    subLogin:[
      {
        uid:"",
        login:"",
      }
    ]
   },
   tariffAvaibles:[],
   tasks:[],
   
async getDataUid(uid){
  const dataUserUid= await $api.get(`https://cabinet.biz.ua/api/getDataUid?uid:${uid}&provider=${'Opticom'}`)
  const data=dataUserUid.data
  set(state=>({...state,user:data}))
},

async getTariff(uid){
  const dataTariff= await $api.get(`https://cabinet.biz.ua/api/getListTariffAvaible?uid=${uid}`)
  const data=dataTariff.data
  set(state=>({...state,tariffAvaibles:data}))
},
async getTaskUser(uid){
  const dataUserTask= await $api.get(`https://cabinet.biz.ua/api/getTaskUser?uid=${uid}`)
  const data=dataUserTask.data
  set(state=>({...state,tasks:data}))
},
  
  }))
  export default dataStore
  