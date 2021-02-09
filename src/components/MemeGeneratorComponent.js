import { getTheme, PrimaryButton, Stack, TextField } from "@fluentui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_MEME_IMAGE, MEME_IMAGES } from "./../links";

const styles = {
  root: {
    padding: 20,
    backgroundColor: getTheme().palette.white,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    paddingBottom: 25,
  },
  formContainer: {
    width: "80%",
    maxWidth: 600,
  },
  input: {
    fieldGroup: [
      {
        borderColor: getTheme().palette.themePrimary,
        borderWidth: 2,
      },
    ],
  },
  memeContainer: { position: "relative", margin: "auto" },
  memeImage: { maxWidth: "100%" },
  h2: {
    position: "absolute",
    width: "80%",
    textAlign: "center",
    left: "50%",
    transform: "translateX(-50%)",
    margin: "15px 0",
    padding: "0 5px",
    fontFamily: "impact, sans-serif",
    fontSize: 40,
    textTransform: "uppercase",
    color: "white",
    letterSpacing: 1,
    textShadow:
      "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000, 2px 2px 5px #000",
  },
  top: {
    top: 0,
  },
  bottom: {
    bottom: 0,
  },
};

const MemeGenerator = () => {
  const theme = getTheme();

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [randomImage, setRandomImage] = useState(DEFAULT_MEME_IMAGE);
  const [originalSize, setOriginalSize] = useState([568, 335]);
  const [allMemeImages, setAllMemeImages] = useState([]);

  const canvasRef = useRef();
  const canvasContextRef = useRef();
  const imageRef = useRef();

  const getImages = useCallback(() => {
    fetch(MEME_IMAGES)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const memes = res.data.memes;
          setAllMemeImages(memes);
        }
      });
  }, []);
  useEffect(() => getImages(), [getImages]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvasContextRef.current = canvas.getContext("2d");
    const ctx = canvasContextRef.current;
    const img = imageRef.current;

    img.crossOrigin = "anonymous";

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  });

  const getLines = (text, maxWidth) => {
    const ctx = canvasContextRef.current;
    console.log(text);
    var words = text.toUpperCase().split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
      var word = words[i];
      var width = ctx.measureText(currentLine + " " + word).width;

      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    console.log(lines);
    return lines;
  };

  const writeTopTextOnCanvas = () => {
    const [width, height] = originalSize;
    const ctx = canvasContextRef.current;
    const topLines = getLines(topText, width);
    const offset = 40;

    topLines.forEach((line, index) => {
      ctx.strokeText(line, width / 2, offset + index * offset);
      ctx.fillText(line, width / 2, offset + index * offset);
    });
  };

  const writeBottomTextOnCanvas = () => {
    const [width, height] = originalSize;
    const ctx = canvasContextRef.current;
    const bottomLines = getLines(bottomText, width).reverse();
    const offset = 40;
    const bottomOffset = 10;

    bottomLines.forEach((line, index) => {
      ctx.strokeText(line, width / 2, height - bottomOffset - index * offset);
      ctx.fillText(line, width / 2, height - bottomOffset - index * offset);
    });
  };

  const handleClick = (event) => {
    event.preventDefault();

    const randomIndex = Math.floor(Math.random() * allMemeImages.length);
    const randomMeme = allMemeImages[randomIndex].url;
    setOriginalSize([
      allMemeImages[randomIndex].width,
      allMemeImages[randomIndex].height,
    ]);

    setTopText("");
    setBottomText("");
    setRandomImage(randomMeme);
  };

  const handleDownload = (event) => {
    event.preventDefault();

    const [width, height] = originalSize;
    const canvas = canvasRef.current;
    const ctx = canvasContextRef.current;
    const img = imageRef.current;

    img.crossOrigin = "anonymous";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.drawImage(img, 0, 0);
    ctx.font = "30px Impact";

    ctx.shadowColor = "black";
    ctx.textAlign = "center";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";

    writeTopTextOnCanvas();
    writeBottomTextOnCanvas();

    var link = document.createElement("a");
    link.download = "generated-meme.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <Stack
      grow
      horizontalAlign="center"
      tokens={{ childrenGap: 30 }}
      style={styles.root}
    >
      <div style={styles.buttonContainer}>
        <PrimaryButton onClick={handleClick}>Change meme</PrimaryButton>
      </div>
      <Stack tokens={{ childrenGap: 10 }} style={styles.formContainer}>
        <TextField
          value={topText}
          placeholder="Top Text"
          onChange={(event) => setTopText(event.target.value)}
          styles={() => styles.input}
          width="45%"
        />
        <TextField
          value={bottomText}
          placeholder="Bottom Text"
          onChange={(event) => setBottomText(event.target.value)}
          styles={() => styles.input}
        />
      </Stack>
      <div style={styles.memeContainer}>
        <img
          ref={imageRef}
          alt="random-meme"
          src={randomImage}
          style={styles.memeImage}
        />
        <h2 style={{ ...styles.h2, ...styles.top }}>{topText}</h2>
        <h2 style={{ ...styles.h2, ...styles.bottom }}>{bottomText}</h2>
      </div>
      <canvas ref={canvasRef} hidden />
      <PrimaryButton onClick={handleDownload}>Download meme</PrimaryButton>
    </Stack>
  );
};

export default MemeGenerator;
