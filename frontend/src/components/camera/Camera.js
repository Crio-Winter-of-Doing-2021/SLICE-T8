import React, { useState, useRef } from "react";
import Measure from "react-measure";
// import { UserMedia } from "../../hooks/use-user-media";
// import { CardRatio } from "../../hooks/use-card-ratio";
// import { Offsets } from "../../hooks/use-offsets";
import { CardRatio, Offsets, UserMedia } from './cameraHelper';
import {
  Video,
  Canvas,
  Wrapper,
  Container,
  Flash,
  Overlay,
  // Button
} from "./styles";
import Api_S3 from '../../apis/Api_S3';
import { Button } from "@material-ui/core";
import AlertDialog from "../AlertDialog";
import "react-toastify/dist/ReactToastify.css";
import { successToast, errorToast } from "../toasts";

const CAPTURE_OPTIONS = {
  audio: false,
  video: { facingMode: "environment" }
};

export function Camera({ onCapture, onClear, cardImage, setCardImage, isCameraOpen, setIsCameraOpen }) {
  const canvasRef = useRef();
  const videoRef = useRef();


  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [file, setFile] = useState();
  const [alertOpen, setAlertOpen] = useState(false);

  const mediaStream = UserMedia(CAPTURE_OPTIONS);
  const [aspectRatio, calculateRatio] = CardRatio(1.586);
  const offsets = Offsets(
    videoRef.current && videoRef.current.videoWidth,
    videoRef.current && videoRef.current.videoHeight,
    container.width,
    container.height
  );

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleResize(contentRect) {
    setContainer({
      width: contentRect.bounds.width,
      height: Math.round(contentRect.bounds.width / aspectRatio)
    });
  }

  function handleCanPlay() {
    calculateRatio(videoRef.current.videoHeight, videoRef.current.videoWidth);
    setIsVideoPlaying(true);
    videoRef.current.play();
  }

  function handleCapture() {
    const context = canvasRef.current.getContext("2d");

    context.drawImage(
      videoRef.current,
      offsets.x,
      offsets.y,
      container.width,
      container.height,
      0,
      0,
      container.width,
      container.height
    );
    canvasRef.current.toBlob(blob => {
      let file = new File([blob], `Camera-img.png`, { type: "image/jpeg" });
      onCapture(blob)
      setFile(file)
    }, "image/jpeg", 1)
    setIsCanvasEmpty(false);
    setIsFlashing(true);
  }

  const handleUpload = async () => {
    if (!localStorage.getItem("s3token")) {
      setAlertOpen(true);
      return;
    }
    try {
      await Api_S3.sendFilesToS3([[0, file]])
      successToast("Files are uploaded to S3")
      setFile();
      setIsCameraOpen(false);
      setCardImage();
    } catch (error) {
      errorToast("Unable to upload files to S3");
    }
  }

  function handleClear() {
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setIsCanvasEmpty(true);
    onClear();
  }

  if (!mediaStream) {
    return null;
  }

  return (
    <>
      <Measure bounds onResize={handleResize}>
        {({ measureRef }) => (
          <Wrapper>
            <Container
              ref={measureRef}
              maxHeight={videoRef.current && videoRef.current.videoHeight}
              maxWidth={videoRef.current && videoRef.current.videoWidth}
              style={{
                height: `${container.height}px`
              }}
            >
              <Video
                ref={videoRef}
                hidden={!isVideoPlaying}
                onCanPlay={handleCanPlay}
                autoPlay
                playsInline
                muted
                style={{
                  top: `-${offsets.y}px`,
                  left: `-${offsets.x}px`
                }}
              />

              <Overlay hidden={!isVideoPlaying} />

              <Canvas
                ref={canvasRef}
                width={container.width}
                height={container.height}
              />

              <Flash
                flash={isFlashing}
                onAnimationEnd={() => setIsFlashing(false)}
              />
            </Container>
            <div style={{ padding: '10px' }}>
              {!cardImage ? (
                <Button
                  style={{ marginRight: '20px' }}
                  variant="contained"
                  color="primary"
                  onClick={isCanvasEmpty ? handleCapture : handleClear}
                >
                  Take img
                </Button>
              ) : (
                <Button
                  style={{ marginRight: '20px' }}
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsCameraOpen(false);
                  setCardImage();
                }}
              >
                Close Camera
          </Button>
            </div>
          </Wrapper>
        )}
      </Measure>
      <AlertDialog alertOpen={alertOpen} setAlertOpen={setAlertOpen} />
    </>
  );
}
