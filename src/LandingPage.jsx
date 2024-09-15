import './LandingPage.css'
import React, { useRef, useState } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

export default function LandingPage() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [cropperInstance, setCropperInstance] = useState(null);
  const imageRef = useRef(null);

  const platforms = [
    { id: 1, name: "Instagram", width: 1080, height: 1350, logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
    { id: 2, name: "Facebook", width: 630, height: 1200, logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg" },
    { id: 3, name: "Twitter", width: 1080, height: 1350, logo: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_2012_logo.svg" },
    { id: 4, name: "LinkedIn", width: 627, height: 1200, logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg" },
  ];

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/jpg", "image/png", "image/heic"].includes(file.type)) {
      setUploadedImage(URL.createObjectURL(file));
    } else {
      alert("Please upload a valid image (jpeg, jpg, png, or heic)");
    }
  };

  const initializeCropper = (width, height) => {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }

    if (cropperInstance) {
      cropperInstance.destroy();
    }

    const imageElement = imageRef.current;
    const cropper = new Cropper(imageElement, {
      aspectRatio: width / height,
      viewMode: 1,
      zoomable: true,
      movable: true,
      cropBoxResizable: false, // The frame size should stay fixed.
      minCropBoxWidth: width,
      minCropBoxHeight: height,
      dragMode: "move",
    });
    
    setCropperInstance(cropper);
  };

  const downloadCroppedImage = (platform) => {
    if (!cropperInstance) {
      alert("Please upload and crop the image first.");
      return;
    }

    const canvas = cropperInstance.getCroppedCanvas({
      width: platform.width,
      height: platform.height,
    });

    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${platform.name}-cropped-image.jpg`;
      link.click();
    }, "image/jpeg");
  };

  return (
    <div>
      <header>
        <div className="headingBar">
          <p className="movingNote">Note: This platform works only for portrait photos.</p>
        </div>
      </header>
      <div className="headLine">
        <h1>Resize Your Image for Social-Media</h1>
        <p>Upload your image and adjust the crop for Instagram, Facebook, Twitter, and LinkedIn.</p>

        <div className="uploadButton">
          <label htmlFor="file-upload" className="btn btn-dark">
            Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/jpeg, image/jpg, image/png, image/heic"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {uploadedImage && (
        <div  style={{ maxWidth: "30%", height: "auto", marginLeft:"35%"}}>
          <h4>Uploaded Image Preview</h4>
          <img ref={imageRef} src={uploadedImage} alt="Uploaded" style={{ maxWidth: "70%", height: "auto" }} />
        </div>
      )}

      {uploadedImage && (
        <div>
          <div className="resizedheading">
            <h4>--- Crop and Download for Platforms ---</h4>
          </div>
          <div className="platforms">
            {platforms.map((platform) => (
              <div key={platform.id} className="platformslogo">
                <img src={platform.logo} alt={`${platform.name} logo`} />
                <div className="downloadbutton">
                  <button
                    type="button"
                    className="btn btn-secondary cropbutton"
                    onClick={() => initializeCropper(platform.width, platform.height)}
                  >
                    Crop
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => downloadCroppedImage(platform)}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="text-xs text-muted-foreground">&copy; 2024 Image Resizer. All rights reserved.</p>
        <div className="terms">
          <p>Terms of Service</p>
          <p>Privacy</p>
        </div>
      </footer>
    </div>
  );
}
