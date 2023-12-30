import React, { useEffect, useState } from 'react';
import Styles from "../../../ModuleStyles/Auth/ClonosLogin/ClonosLogin.module.css";
import CLONOS_APP_LOGO from "../../../assets/UIUX/icons/CLONOS_APP_LOGO.svg";
import LOGIN_CAROUSEL_IMAGE_1 from "../../../assets/UIUX/images/LOGIN_CAROUSEL_SVG_1.svg"
import LOGIN_CAROUSEL_IMAGE_2 from "../../../assets/UIUX/images/LOGIN_CAROUSEL_SVG_2.svg"
import LOGIN_CAROUSEL_IMAGE_3 from "../../../assets/UIUX/images/LOGIN_CAROUSEL_SVG_3.svg"
import { handleLogin, handleStartCarousel } from '../../../utils/AuthMethods/ClonosLoginMethods';
import ClonosInput from '../../../components/CommonComponents/ClonosInput/ClonosInput';
import { ClonosButton } from '../../../components/CommonComponents/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const ClonosLogin = () => {
  const [lcValues, setLcValues] = useState({}) // This status will hold server response data and local data also.
  const [lcIntervals, setLcIntervals] = useState({ loading: false }) // This state will hold the interval id's.
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('lcValues:', lcValues)
  let carouselData = [
    {
      index: 1,
      image: LOGIN_CAROUSEL_IMAGE_1,
      heading: "Smart Solutions for Oil & Gas",
      paragraph: "Manage your Assets, Optimize the Process flow, Increase the Assets Reliability and Beyond!",
      isActive: true
    },
    {
      index: 2,
      image: LOGIN_CAROUSEL_IMAGE_2,
      heading: "3D Digital Twins",
      paragraph: "Fueling Your Future with 3D Precision: Oil & Gas Made Simple",
      isActive: false
    },
    {
      index: 3,
      image: LOGIN_CAROUSEL_IMAGE_3,
      heading: "Igniting Efficiency",
      paragraph: "Your Oil & Gas Industry SAAS Partner",
      isActive: false
    },
  ]


  const lcHandleGetValues = ({ type, uniqueKey, updatedValue }) => {
    setLcValues({ ...lcValues, [uniqueKey]: updatedValue })
  }


  useEffect(() => {
    handleStartCarousel({ interval: 2000, setLcIntervals, carouselData, setCarouselCurrentIndex })

    // Attach event listener to the document body
    document.body.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(lcIntervals["carouselImageIndicatorInterval"])
      document.body.removeEventListener('keydown', handleKeyPress);
    }
  }, [lcValues])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin({ dispatch, navigate, payload: lcValues, responseSetterMethod: setLcValues })
    }
  };

  return (
    <div className={Styles.main_container}>
      <section aria-label='carousel container' className={Styles.carousel_container}>
        <div aria-label='logo and heading container' className={Styles.logo_and_heading_container}>
          <header aria-label='logo and heading' className={Styles.logo_and_heading_element}>
            <img src={CLONOS_APP_LOGO} alt='logo' />
            <h3>Clonos</h3>
          </header>
          <span>Mandapeta</span>
        </div>
        <div aria-label='carousel image container' className={Styles.carousel_image_body}>

          <div className={Styles.carousel_image_container}>
            <img className={Styles.carousel_image} src={carouselData[carouselCurrentIndex - 1].image} alt={carouselData[carouselCurrentIndex - 1].heading} loading='lazy' />
          </div>

          <div className={Styles.carousel_image_heading_container}>
            <h3 className={Styles.carousel_image_heading}>{carouselData[carouselCurrentIndex - 1].heading}</h3>
            <p className={Styles.carousel_image_paragraph}>{carouselData[carouselCurrentIndex - 1].paragraph}</p>
          </div>
        </div>
        <footer className={Styles.carousel_footer}>
          <div className={Styles.carousel_image_indicator_container}>
            {
              carouselData?.map((element, index) => {
                return <span key={element.index} style={{ opacity: element?.index == carouselCurrentIndex ? 1 : 0.3 }} className={Styles.carousel_image_indicator_container_element}></span>
              })
            }
          </div>
        </footer>
      </section>
      <section aria-label='login fields container' className={Styles.login_fields_container}>
        <div className={Styles.login_fields_wrapper}>
          <header className={Styles.login_fields_header}>
            <h3>Welcome!</h3>
            <p>Please login to access your account.</p>
          </header>
          <div className={Styles.login_fields_body}>
            <ClonosInput
              isLabel={true}
              uniqueKey="email"
              type="email"
              label="User Email Id"
              placeholder="Enter Your Email Id"
              handleGetValues={lcHandleGetValues}
            />
            <ClonosInput
              isLabel={true}
              uniqueKey="password"
              type="password"
              label="Password"
              placeholder="Enter Your Password"
              handleGetValues={lcHandleGetValues}
            />
            <p className={Styles.forgot_password}>Forgot Password?</p>
            <ClonosButton style={{ width: "100%" }} loading={lcValues?.loading} onClick={() => handleLogin({ dispatch, navigate, payload: lcValues, responseSetterMethod: setLcValues })}>Login</ClonosButton>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ClonosLogin