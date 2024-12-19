import React from 'react'
import clases from "./GlasmorphizmButtonMob.module.css";

export default function GlasmorphizmButtonMob({label="Button",handleAction}) {
  return (
    <div onClick={handleAction} className={clases.container}>
    <div className={clases.btn}><span>{label}</span></div>
    </div>
  )
}
