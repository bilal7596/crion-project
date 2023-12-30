import { Checkbox } from '@material-ui/core'
import React, { useEffect } from 'react'
import { useState } from 'react'

const CheckBox = ({ checked, onChange }) => {
    const [lsChecked, setLcChecked] = useState(false)
    
    const handleChangeStatus = () => {
        setLcChecked(!lsChecked)
    }

    useEffect(() => {
        if (checked == true) {
            setLcChecked(true)
        } else {
            setLcChecked(false)
        }
    }, [checked])
    return <Checkbox
        onChange={onChange}
        color="primary"
        // checked={checked == true && lsChecked == false ? checked : !lsChecked}
        checked={lsChecked}
        onClick={handleChangeStatus}
    />
}

export default CheckBox