import { Alert, Button, TextInput } from "flowbite-react"
import { useSelector } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { app } from "../firebase"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"

export default function DashProfile() {
    const {currentUser} = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const filePickerRef = useRef()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file){
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])
    const uploadImage = async () => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log("Upload is " + progress + "% done")
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageFileUploadError("Could not upload image (File must be less than 2MB)")
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                })
            }
        )
    }
    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-4">
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    ref={filePickerRef} 
                    hidden
                />
                <div 
                    className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" 
                    onClick={() => filePickerRef.current.click()}
                >
                    <img 
                        src={imageFileUrl || currentUser.profilePicture} 
                        alt="user"
                        className="rounded-full w-full h-full border-8 border-[lightgray] object-cover" 
                    />
                </div>
                {imageFileUploadError && <Alert color="failure">{imageFileUploadError}</Alert>}
                <TextInput 
                    id="username" 
                    name="username" 
                    type="text" 
                    placeholder="username" 
                    defaultValue={currentUser.username} 
                />
                <TextInput 
                    id="email" 
                    name="email" 
                    type="text" 
                    placeholder="email" 
                    defaultValue={currentUser.email} 
                />
                <TextInput 
                    id="password" 
                    name="password" 
                    type="text" 
                    placeholder="password" 
                />
                <Button type="submit" outline>Update</Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
        </div>
    )
}
