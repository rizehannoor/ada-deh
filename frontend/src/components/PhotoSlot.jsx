import { useRef } from "react";

export default function PhotoSlot({
  index,
  photo,
  onChange,
  feedback,
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const url = URL.createObjectURL(file);

    onChange(index, url);
  };

  return (
    <div className={`photo-slot-wrapper ${photo ? "filled" : ""}`}>
      <button
        type="button"
        className="photo-slot"
        onClick={handleClick}
        aria-label={`pilih foto ${index + 1}`}
      >
        {photo ? (
          <img
            src={photo}
            alt={`foto ${index + 1}`}
            className="photo-preview"
          />
        ) : (
          <div className="photo-empty">
            <span className="photo-number">0{index + 1}</span>
            <span className="photo-add">tambah foto</span>
          </div>
        )}
      </button>

      {feedback && (
        <span className="photo-feedback">
          {feedback}
        </span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
}