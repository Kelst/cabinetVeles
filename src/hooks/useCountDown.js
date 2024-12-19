import { Timelapse } from "@mui/icons-material"
import { useEffect, useState } from "react"

export const useCountDown=(initialTime,callback,interval=1000)=>{
    const [time,setTime]=useState(initialTime)
    useEffect(()=>{
        const costumInterval=setInterval(()=>{
            if(time>0)setTime((prev)=>prev-interval)

        },interval)
        if(time===0) callback()
        return ()=>clearInterval(costumInterval)
    },[time])
    return time
}