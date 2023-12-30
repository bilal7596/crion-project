import React from 'react';
import Styles from './ClonosSpinner.module.css';

/**
 * ClonosSpinner Component
 *
 * @param {string} color - The color of the spinner.
 * @param {string} spinnerShadowColor - The color of the spinner shadow.
 * @param {string} spinnerThickness - The thickness of the spinner border.
 * @param {string} width - The width and height of the spinner.
 *
 * @returns {JSX.Element} The ClonosSpinner component.
 */
const ClonosSpinner = ({ color, spinnerShadowColor, spinnerThickness, width }) => {
  // Object containing RGBA values for specified colors
  const colorRGBA = {
    red: 'rgba(255, 0, 0, 0.1)',
    blue: 'rgba(0, 0, 255, 0.1)',
    white: 'rgba(255, 255, 255, 0.1)',
    purple: 'rgba(128, 0, 128, 0.1)',
    green: 'rgba(0, 128, 0, 0.1)',
    yellow: 'rgba(255, 255, 0, 0.1)',
    black: 'rgba(0, 0, 0, 0.1)',
    pink: 'rgba(255, 192, 203, 0.1)',
    violet: 'rgba(238, 130, 238, 0.1)',
    olivgreen: 'rgba(128, 128, 0, 0.1)',
    gray: 'rgba(128, 128, 128, 0.1)',
  };

  /**
   * Renders the ClonosSpinner component.
   *
   * @returns {JSX.Element} The ClonosSpinner component.
   */
  return (
    <div
      style={{
        border: `${spinnerThickness ? spinnerThickness : '4px'} solid ${
          spinnerShadowColor ? colorRGBA[spinnerShadowColor] : 'rgba(0, 0, 0, 0.1)'
        }`,
        borderTop: color && `${spinnerThickness ? spinnerThickness : '4px'} solid ${color}`,
        width: width && width,
        height: width && width,
      }}
      className={Styles.spinner}
    ></div>
  );
};

export default ClonosSpinner;
