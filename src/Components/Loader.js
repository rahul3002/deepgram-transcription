import { Blocks } from "react-loader-spinner";
import React from "react";

// Loader.js

/**
 * Loader component that displays a loading spinner.
 * @param {boolean} visible - Determines whether the loader is visible or not.
 * @returns {JSX.Element|null} - The loader component.
 */
const Loader = ({ visible }) =>
  visible ? (
    <Blocks
      height="80" // The height of the loader spinner.
      width="80" // The width of the loader spinner.
      color="#4fa94d" // The color of the loader spinner.
      ariaLabel="blocks-loading" // The ARIA label for accessibility.
      wrapperStyle={{}} // Additional styles for the loader wrapper.
      wrapperClass="blocks-wrapper" // Additional CSS class for the loader wrapper.
      visible={true} // Determines whether the loader spinner is visible or not.
    />
  ) : null;

export default Loader;
