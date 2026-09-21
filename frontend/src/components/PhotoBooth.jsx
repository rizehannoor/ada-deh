import { useRef, useState } from "react";
import { motion } from "framer-motion";

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function PhotoBooth({ onComplete }) {
  const [photos, setPhotos] = useState([null, null, null]);
  const [confirmed, setConfirmed] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [activeSlot, setActiveSlot] = useState(null);

  const fileInputRef = useRef(null);

  const choosePhoto = (index) => {
    setActiveSlot(index);
    fileInputRef.current?.click();
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file || activeSlot === null) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback("pilih foto ya.");
      return;
    }

    try {
      const image = await readFile(file);

      setPhotos((current) => {
        const next = [...current];
        next[activeSlot] = image;
        return next;
      });

      if (activeSlot === 0) {
        setFeedback("nice.");
      }

      if (activeSlot === 1) {
        setFeedback("dua lagi eh, satu lagi.");
      }

      if (activeSlot === 2) {
        setFeedback("itu dia.");
      }

      setConfirmed(false);
    } catch {
      setFeedback("foto itu nggak bisa dibaca.");
    }

    event.target.value = "";
  };

  const removePhoto = (index) => {
    setPhotos((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });

    setConfirmed(false);
    setFeedback("");
  };

  const handleContinue = () => {
    const total = photos.filter(Boolean).length;

    if (total < 3) {
      setFeedback(`masih kurang ${3 - total} foto.`);
      return;
    }

    if (!confirmed) {
      setConfirmed(true);
      setFeedback("tekan lagi kalau kamu yakin.");
      return;
    }

    onComplete(photos);
  };

  return (
    <div className="photo-booth">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />

      <div className="photo-grid">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            className={`photo-slot ${photo ? "has-photo" : ""}`}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => choosePhoto(index)}
          >
            {photo ? (
              <>
                <img
                  src={photo}
                  alt={`foto ${index + 1}`}
                />

                <button
                  type="button"
                  className="remove-photo"
                  onClick={(event) => {
                    event.stopPropagation();
                    removePhoto(index);
                  }}
                >
                  ×
                </button>
              </>
            ) : (
              <div className="empty-photo">
                <span className="photo-number">
                  0{index + 1}
                </span>

                <span>
                  tap untuk
                  <br />
                  pilih foto
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="photo-feedback">
        {feedback}
      </div>

      {photos.filter(Boolean).length === 3 && (
        <button
          type="button"
          className={`plain-action ${
            confirmed ? "confirmed" : ""
          }`}
          onClick={handleContinue}
        >
          {confirmed ? "sekali lagi" : "lanjut"}
        </button>
      )}
    </div>
  );
}