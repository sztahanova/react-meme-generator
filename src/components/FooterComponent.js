import { getTheme, Text } from "@fluentui/react";
import React from "react";

const Footer = () => {
    const theme = getTheme();

  return (
    <footer style={{backgroundColor: theme.palette.themePrimary}}>
      <div className="empty-container" />
      <div style={{textAlign: "center", color: theme.palette.white}}>
        <Text >Created with React and Fluent UI</Text>
      </div>
    </footer>
  );
};

export default Footer;
