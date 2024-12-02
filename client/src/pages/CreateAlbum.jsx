import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from "react-router-dom";

export default function CreateAlbum() {
  const [files, setFiles] = useState([]);
  const [imageUploadProgress, setImageUploadProgress] = useState({});
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    photos: []
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/album/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/album/${data.slug}`);
      } 
    } catch (error) {
      setPublishError("Something went wrong");
    }
  }

  useEffect(() => {
    if (files.length > 0) {
      handleUploadImages();
    }
  }, [files]);

  const handleUploadImages = async () => {
    try {
      const uploadPromises = files.map(file => uploadSingleImage(file));
      await Promise.all(uploadPromises);
    } catch (error) {
      setImageUploadError("Image upload failed");
      console.log(error);
    }
  };

  const uploadSingleImage = async (file) => {
    try {
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(prev => ({
            ...prev,
            [fileName]: progress.toFixed(0)
          }));
        },
        (error) => {
          setImageUploadError("Image upload failed");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(prev => ({
              ...prev,
              [fileName]: 100
            }));
            setFormData(prev => ({
              ...prev,
              photos: [...prev.photos, { image: downloadURL, caption: '' }]
            }));
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      console.log(error);
    }
  };

  const handleCaptionChange = (index, caption) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) => 
        i === index ? { ...photo, caption } : photo
      )
    }));
  };

  return (
    <div className="create-album flex">
      <div className="left-side w-1/2 pr-4">
        <h2>Create album</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            id="title"
            placeholder="Title"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <TextInput
            type="text"
            id="description"
            placeholder="Description"
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <FileInput 
            type="file" 
            accept="image/*"
            multiple 
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Post
          </Button>
          {publishError && <p className="text-red-500 mt-2">{publishError}</p>}
        </form>
      </div>
      <div className="right-side w-1/2 pl-4">
        <h2>Uploaded Images</h2>
        <div className="image-grid grid grid-cols-2 gap-4">
        {formData.photos.map((photo, index) => (
            <div key={index} className="image-item">
              <div className="relative">
                <img src={photo.image} alt={`Uploaded ${index + 1}`} className="w-full h-40 object-cover mb-2" />
              </div>
              <TextInput
                type="text"
                placeholder="Add caption"
                value={photo.caption}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
