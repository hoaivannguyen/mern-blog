import { Button, Spinner, Dropdown } from "flowbite-react"
import { useEffect, useState } from "react" 
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import CommentSection from "../components/CommentSection"
import { HiDotsHorizontal } from "react-icons/hi"

export default function PostPage() {
  const { currentUser } = useSelector(state => state.user)
  const { postSlug } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [recentPosts, setRecentPosts] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/apis/post/getposts?slug=${postSlug}`)
        const data = await res.json()
        if (!res.ok) {
          setError(true)
          setLoading(false)
          return
        }
        if (res.ok) {
          setPost(data.posts[0])
          setLoading(false)
          setError(false)
        } 
      } catch (error) {
        setError(true)
        setLoading(false)
      } 
    }
    fetchPost()
  }, [postSlug])

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/apis/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentPosts(data.posts)
        }
      } 
      fetchRecentPosts()
    } catch (error) {
      console.log(error.message)
    }
  }, [])

  if (loading) 
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="xl" />
    </div>
  )
  return (
    <main className="p-3 flex flex-col max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto
      lg:text-4xl">
        {post && post.title}
      </h1>
      <Link 
        to={`/search?category/${post && post.author}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size={"xs"}>
          {post && post.author}
        </Button>
      </Link>
      <div className="relative group">
        <img 
          src={post && post.image} 
          alt={post && post.title} 
          className="mt-10 p-3 max-h-[600px] w-full object-cover justify-center"
        />
      </div>
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto
      w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length/1000).toFixed(0)} mins read
        </span>
      </div>
      <div 
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{__html: post && post.content}}
      >
      </div>
      <CommentSection postId={post._id}/>
    </main>
  )
}
