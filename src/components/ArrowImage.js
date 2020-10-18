import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowAltCircleUp,
  faArrowAltCircleDown,
} from "@fortawesome/free-solid-svg-icons";

function ArrowImage({ percentChange, colorChange }) {
  if (percentChange) {
    if (percentChange >= 0) {
      return <FontAwesomeIcon icon={faArrowAltCircleUp} color={colorChange} />;
    } else if (percentChange < 0) {
      return (
        <FontAwesomeIcon icon={faArrowAltCircleDown} color={colorChange} />
      );
    }
  } else {
    return <></>;
  }
}

export default ArrowImage;
