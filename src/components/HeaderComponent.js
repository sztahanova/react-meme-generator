import { getTheme, Image, Text } from "@fluentui/react";
import React from "react";
import { TROLL_FACE_IMAGE } from "../links";

const Header = () => {
  const theme = getTheme();
  
  const headerStyles = {
    root: {
      height: 100,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 25,
      background: theme.palette.themePrimary,
    },
    title: {
      color: theme.palette.white
    }
  };

  return (
    <div style={headerStyles.root}>
      <Image
        src={TROLL_FACE_IMAGE}
        alt="Problem?"
        height={80}
      />
      <Text
        key="title"
        variant="mega"
        block
        nowrap
        style={headerStyles.title}
      >
        Meme Generator
      </Text>
    </div>
  );
};

export default Header;
