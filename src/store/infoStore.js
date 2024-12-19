import axios from 'axios'
import { create } from 'zustand'
const useInfoStore = create((set) => ({
  openLoader: false,
openAlert:false,
typeAlert:2,
messageAlert:"",
activeItem:"Item1",
showCursor:true,

setShowCursor(){
  set(state=>({...state,showCursor:!state.showCursor}))
},
setActiveItem(item){
set(state=>({...state,activeItem:item}))
},
setLoader: (value) => set(state => ({ ...state, openLoader: value })),
  showAllert(type,message){
    set(state=>({...state,typeAlert:type,messageAlert:message,openAlert:!state.openAlert}))
  },
  hideAllert(){
    set(state=>({...state,openAlert:!state.openAlert}))
  }


  
  }))
  export default useInfoStore
  