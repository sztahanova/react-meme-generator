import React, { Component } from "react";
import { DEFAULT_MEME_IMAGE, MEME_IMAGES } from "./../links";

class MemeGenerator extends Component {
  constructor() {
    super();

    this.state = {
      topText: "",
      bottomText: "",
      randomImage: DEFAULT_MEME_IMAGE,
      allMemeImages: [],
    };

    this.canvasRef = React.createRef();
    this.canvasContextRef = React.createRef();
    this.imageRef = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }

  componentDidMount() {
    fetch(MEME_IMAGES)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const memes = res.data.memes;
          this.setState({ allMemeImages: memes });
        }
      });

    const canvas = this.canvasRef.current;
    this.canvasContextRef.current = canvas.getContext("2d");
    const ctx = this.canvasContextRef.current;
    const img = this.imageRef.current;

    img.crossOrigin = "anonymous";

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.canvas.width = img.width;
      ctx.canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  }

  getLines(ctx, text, maxWidth) {
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
  }

  writeTopTextOnCanvas() {
    const ctx = this.canvasContextRef.current;
    const img = this.imageRef.current;
    const topLines = this.getLines(ctx, this.state.topText, img.width);
    const offset = 40;

    topLines.forEach((line, index) => {
      ctx.strokeText(line, img.width / 2, offset + index * offset);
      ctx.fillText(line, img.width / 2, offset + index * offset);
    });
  }

  writeBottomTextOnCanvas() {
    const ctx = this.canvasContextRef.current;
    const img = this.imageRef.current;
    const bottomLines = this.getLines(
      ctx,
      this.state.bottomText,
      img.width
    ).reverse();
    const offset = 40;
    const bottomOffset = 10;

    bottomLines.forEach((line, index) => {
      ctx.strokeText(
        line,
        img.width / 2,
        img.height - bottomOffset - index * offset
      );
      ctx.fillText(
        line,
        img.width / 2,
        img.height - bottomOffset - index * offset
      );
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleClick(event) {
    event.preventDefault();

    const randomIndex = Math.floor(
      Math.random() * this.state.allMemeImages.length
    );
    const randomMeme = this.state.allMemeImages[randomIndex].url;
    this.setState({ topText: "", bottomText: "", randomImage: randomMeme });
  }

  handleDownload(event) {
    event.preventDefault();

    const canvas = this.canvasRef.current;
    const ctx = this.canvasContextRef.current;
    const img = this.imageRef.current;

    img.crossOrigin = "anonymous";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx.font = "30px Impact";

    ctx.shadowColor = "black";
    ctx.textAlign = "center";
    ctx.shadowBlur = 7;
    ctx.lineWidth = 5;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";

    this.writeTopTextOnCanvas();
    this.writeBottomTextOnCanvas();

    var link = document.createElement("a");
    link.download = "generated-meme.png";
    link.href = this.canvasRef.current.toDataURL();
    link.click();
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Change meme</button>
        <form className="meme-form">
          <input
            type="text"
            name="topText"
            placeholder="Top Text"
            value={this.state.topText}
            onChange={this.handleChange}
          />
          <input
            type="text"
            name="bottomText"
            placeholder="Bottom Text"
            value={this.state.bottomText}
            onChange={this.handleChange}
          />
        </form>
        <div className="meme">
          <img
            ref={this.imageRef}
            alt="random-meme"
            src={this.state.randomImage}
          />
          <h2 className="top">{this.state.topText}</h2>
          <h2 className="bottom">{this.state.bottomText}</h2>
        </div>
        <canvas ref={this.canvasRef} hidden />
        <button onClick={this.handleDownload}>Download meme</button>
      </div>
    );
  }
}

export default MemeGenerator;
