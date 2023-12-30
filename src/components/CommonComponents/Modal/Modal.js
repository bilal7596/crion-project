import React, { useEffect, useRef } from 'react';
import Styles from './Modal.module.css';

const Modal = ({ isOpen, closeModalMethod, stopOverlayCloser, children }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target) && !stopOverlayCloser) {
      closeModalMethod(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeModalMethod, stopOverlayCloser]);

  return isOpen ? (
    <div className={Styles.modal_container}>
      <div ref={modalRef} className={Styles.modal_content}>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;

