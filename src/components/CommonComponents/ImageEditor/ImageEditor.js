import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react'
import ImageEditorReference from "tui-image-editor"
import "./imageEditor.css"
import { useState } from 'react';
const ImageEditor = ({ url, file }) => {
    const ImageEditorContainerRef = useRef(null);
    const [lcIntervals, setLcIntervals] = useState({})
    const [editedImageURL, setEditedImageURL] = useState("")
    const optionsMenus = { draw: false }
    let detailedColorState = false
    let containerInstance = null
    const [updatedImage, setUpdatedImage] = useState(null)


    const customTheme = {
        'common.bi.image': '/path-to-your-custom-icons.svg',
        'common.bisize.width': '20px',
        'common.bisize.height': '20px',
        'common.backgroundImage': 'none',
        'menu.normalIcon.color': '#333',
        'menu.activeIcon.color': '#00F',
        'menu.disabledIcon.color': '#999',
    };

    useEffect(() => {
        if (ImageEditorContainerRef.current) {
            const imageEditor = new ImageEditorReference(ImageEditorContainerRef.current, {
                includeUI: {
                    theme: customTheme,
                    loadImage: {
                        path: url, // Load an initial image
                        name: 'Clonos Image Editor',
                    },
                    menu: Object.keys(optionsMenus),
                },
            });
            // You can add event listeners and further customization here
            console.log('imageEditor:', imageEditor)
            containerInstance = imageEditor
        }

        let interval = setTimeout(() => {
            Object.keys(optionsMenus).includes("text") && handleUpdateLayoutRange({ className: "tie-text-range-value" })  // Updating the layout dynamicaly
            handleSetEvents({ menuOptions: Object.keys(optionsMenus), optionsMenus }) // Setting the event on the library default elements.
            Object.keys(optionsMenus).includes("draw") && handleUpdateLayoutRange({ className: "tie-draw-range-value" })
            handleSetEvents({ isSingle: true, singleMethod: handleCheck, type: ".", className: "tui-colorpicker-palette-toggle-slider" })
            Object.keys(optionsMenus).forEach(item => {  // Setting some Id on the default elements which are given by tui and react-skatch and react-crop.
                const featureElement = document.querySelector(`.tui-image-editor-menu-${item}`);
                featureElement.style.display = "none"
                featureElement.setAttribute("id", `clonos-editor-menu-${item}`)
            })
        }, 100)



        return () => {
            clearInterval(interval)

            Object.keys(lcIntervals)?.forEach((element, index) => {  // Here we are clearing local intervals
                clearInterval(lcIntervals[`${element + index}`])
            })
        }
    }, [])

    const handleCheck = () => {
        const featureElement = document.querySelector(`.tui-colorpicker-slider-container`);
        let interval = null
        if (detailedColorState) {
            interval = setTimeout(() => {
                featureElement.style.display = "none";
            }, 10)
            detailedColorState = false
        } else {
            interval = setTimeout(() => {
                featureElement.style.display = "flex"
            }, 10)
            detailedColorState = true
        }
        setLcIntervals((prev) => {
            let prevIntervals = { ...prev, [`interval${Object.keys(prev).length}`]: interval }
            return prevIntervals
        })
    }


    // tie-text-range-value tui-image-editor-range-value
    const handleUpdateLayoutRange = ({ className }) => {
        let element = document.querySelector(`.${className}`);
        console.log('elementRange:', element)
        element.type = "range"
    }
    // For example, you can save the edited image:
    const handleSave = () => {
        const editedImage = containerInstance.toDataURL();
        console.log('Edited image data:', editedImage);
        setUpdatedImage(editedImage)
    };


    const handleEventSatted = ({ className, optionsMenus }) => {
        if (optionsMenus[className] == true) {
            const featureElement = document.querySelector(`#clonos-editor-menu-${className}`);
            featureElement.style.display = "none"
            optionsMenus[className] = false
        } else {
            const featureElement = document.querySelector(`#clonos-editor-menu-${className}`);
            featureElement.style.display = "block"
            optionsMenus[className] = true
            Object.keys(optionsMenus).forEach((item) => {
                if (item !== className) {
                    const featureElement = document.querySelector(`#clonos-editor-menu-${item}`);
                    featureElement.style.display = "none"
                }
            })
        }
    }


    // Adding the event on the load of the page.
    const handleSetEvents = ({ menuOptions, optionsMenus, isSingle, type, className, singleMethod }) => {
        console.log('menuOptions:', menuOptions)
        if (isSingle) {
            const featureElement = document.querySelector(`${type}${className}`);
            featureElement.addEventListener(('click'), function () {
                singleMethod()
            })
        } else {
            menuOptions.length > 0 && menuOptions?.map((className) => {
                const featureElement = document.querySelector(`.tie-btn-${className}`);
                featureElement.addEventListener(('click'), function () {
                    handleEventSatted({ className, optionsMenus })
                })
            })
        }

    }

    const handleCheckUrl = (e) => {
        console.log('imageTarget:', e.target.files)
        containerInstance.loadImageFromFile(e.target.files["0"], e.target.files["0"].name)


        // containerInstance.loadImageFromFile(file).then(result => {
        //     console.log('old : ' + result.oldWidth + ', ' + result.oldHeight);
        //     console.log('new : ' + result.newWidth + ', ' + result.newHeight);
        // });
    }
    console.log('lcIntervals:', Object.keys(lcIntervals))

    return (
        <div className="clonos-image-editor-main-container">
            <div ref={ImageEditorContainerRef}></div>
            <button onClick={handleSave}>Save</button>
            <input type='file' placeholder='Import Image' onChange={handleCheckUrl} />

            <div>
                <img src={updatedImage} loading="lazy" />
            </div>
        </div>
    )
}

export default React.memo(ImageEditor)