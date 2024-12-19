import axios from 'axios'
import { create } from 'zustand'
import $api from '../http'
const dataStore = create((set) => ({
  user:{
    name:"Безкоровайний Владислав Андрійович",
    uid:"140278",
    status:"active",
    telegramId:"",
    phone:'380951470082',
    login:'vlad_b_1',
    adress:"Чернівці, Проспект Незалежності 116б кв 60",
    statusInternet:true,
    balance:"-5450",
    deposit:"0",
    monthlyPayment:"274",
    dateOfEndCredits:"2023-12-15",
    tariff:"ЧЕРНІВЦІ-КОМФОРТ-1000(309)_Internet+TV",
    lastPay:"2023-01-15  225 грн",
    ip:"192.5.4.7",
    duration:"+4 01:11:03",
    sendData:"767.85 GB",
    getData:"43.34 GB",
    subLogin:[
      {
        uid:"189209",
        login:"dorosh_ukr50",
      }
    ]
   },
   tariffAvaibles:[],
   tasks:[],
   
async getDataUid(uid){
  const dataUserUid= await $api.get(`http://194.8.147.150:5000/api/getDataUid?uid:${uid}&provider=${'Opticom'}`)
  const data=dataUserUid.data
  set(state=>({...state,user:data}))
},

async getTariff(uid){
  const dataTariff= await $api.get(`http://194.8.147.150:5000/api/getListTariffAvaible?uid=${uid}`)
  const data=dataTariff.data
  set(state=>({...state,tariffAvaibles:data}))
},
async getTaskUser(uid){
  const dataUserTask= await $api.get(`http://194.8.147.150:5000/api/getTaskUser?uid=${uid}`)
  const data=dataUserTask.data
  set(state=>({...state,tasks:data}))
},
  
  }))
  export default dataStore
  