import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import Styles from  "../../ModuleStyles/Attributes/Lines.module.css"

const Lines = ({lineCoordinates,}) => {
console.log('lineCoordinates:', lineCoordinates)
const [lineWidth,setLineWidth] = useState(null)
const [lineHeight,setLineHeight] = useState(null)

const getHeightAndWidth = useCallback(()=>{
    if(lineCoordinates.startPoint.x === lineCoordinates.endPoint.x){
      setLineHeight(lineCoordinates.endPoint.y - lineCoordinates.startPoint.y )
      setLineWidth(1)
    }
    else{
      setLineWidth(lineCoordinates.endPoint.x - lineCoordinates.startPoint.x)
      setLineHeight(1)
    }
},[lineCoordinates.startPoint,lineCoordinates.endPoint])


console.log("lineHeight",lineHeight)
console.log("lineWidth",lineWidth)
useEffect(()=>{
  getHeightAndWidth()
},[lineCoordinates.startPoint,lineCoordinates.endPoint])
  return (
    <div
    className={Styles.lines}
    style={{
      top: `${lineCoordinates.startPoint.y}px`,
      left: `${lineCoordinates.startPoint.x}px`,
      width:lineWidth,
      height:lineHeight
    }}
  ></div>
  )
}

export default Lines