import React from "react";
import BaseWindowPlugin from "../BaseWindowPlugin";

import NavigationIcon from "@material-ui/icons/Navigation";

import LocationView from "./LocationView";

class Location extends React.PureComponent {
  render() {
    return (
      <BaseWindowPlugin
        {...this.props}
        type={this.constructor.name}
        custom={{
          icon: <NavigationIcon />,
          title: "Positionera",
          description: "Visa min position i kartan",
          height: 300,
          width: 430,
          top: undefined,
          left: undefined
        }}
      >
        <LocationView map={this.props.map} />
      </BaseWindowPlugin>
    );
  }
}

export default Location;
