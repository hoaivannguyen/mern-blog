import { Table, Modal, Button } from "flowbite-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { HiOutlineExclamationCircle } from "react-icons/hi"

export default function DashAlbums() {
  const { currentUser } = useSelector(state => state.user)
  const [userAlbums, setUserAlbums] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [albumIdToDelete, setAlbumIdToDelete] = useState("")
  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(`/apis/album/getalbums?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok) {
          setUserAlbums(data.albums)
          if (data.albums.length < 9) {
            setShowMore(false)
        }
      } 
    } catch (error) {
        console.log(error.message)
      }
    }
    if (currentUser.isAdmin) {
      fetchAlbum()
    }
  }, [currentUser._id])

  const handleShowMore = async () => {
    const startIndex = userAlbums.length
    try {
      const res = await 
      fetch(`/apis/album/getalbums?userId=${currentUser._id}&startIndex=${startIndex}`)
      const data = await res.json()
      if (res.ok) {
        setUserAlbums((prev) => [...userAlbums, ...data.albums])
        if (data.albums.length < 9) {
          setShowMore(false)
      }
    } 
  } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteAlbum = async () => {
    setShowModal(false)
    try {
      const res = await fetch(
        `/apis/album/deletealbum/${albumIdToDelete}/${currentUser._id}`, 
        { method: "DELETE", }
      )
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserAlbums((prev) =>
           prev.filter((album) => album._id !== albumIdToDelete)
      )}
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300 
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userAlbums.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Album image</Table.HeadCell>
              <Table.HeadCell>Album title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userAlbums.map((album) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 
                dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(album.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/album/${album.slug}`}>
                      <img
                        src={album.image}
                        alt={album.title}
                        className="w-10 h-20 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-900 dark:text-white" 
                    to={`/album/${album.slug}`}>{album.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{album.author}</Table.Cell>
                  <Table.Cell>
                    <span 
                      onClick={() => {
                        setShowModal(true)
                        setAlbumIdToDelete(album._id)
                      }} 
                      className="font-medium text-red-500 hover:underline 
                      cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link 
                      className="text-teal-500 hover:underline" 
                      to={`/update-album/${album._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button 
              onClick={handleShowMore} 
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no albums yet</p>
      )}
      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        popup 
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle 
            className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200"
            />
            <h3 className="mb-5 text-lg font-normal text-gray-500 
            dark:text-gray-400">
              Are you sure you want to delete this album?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteAlbum}>
                Yes, I'm sure
              </Button>
              <Button onClick={() => setShowModal(false)} color="gray">
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
