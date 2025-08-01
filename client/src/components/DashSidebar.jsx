import { Sidebar } from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiUser } from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice'
import { useSelector } from 'react-redux'

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user)
  const [tab, setTab] = useState("")
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get('tab');
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await fetch("/apis/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-1 flex-col'>
                <Link to="/dashboard?tab=profile">
                    <Sidebar.Item 
                        active={tab === "profile"} 
                        icon={HiUser} 
                        label={currentUser.isAdmin ? "Admin" : "User"} 
                        labelColor="dark" 
                        as="div"
                    >
                        Profile
                    </Sidebar.Item>
                </Link>
                {currentUser.isAdmin && (
                  <Link to="/dashboard?tab=posts">
                      <Sidebar.Item 
                          active={tab === "posts"} 
                          icon={HiDocumentText}
                          as="div" 
                      >
                          Posts
                      </Sidebar.Item>
                  </Link>    
                )}
                {currentUser.isAdmin && (
                  <Link to="/dashboard?tab=albums">
                      <Sidebar.Item 
                          active={tab === "albums"} 
                          icon={HiDocumentText}
                          as="div" 
                      >
                          Albums
                      </Sidebar.Item>
                  </Link>    
                )}
                <Sidebar.Item 
                  icon={HiArrowSmRight} 
                  className="cursor-pointer" 
                  onClick={handleSignOut}
                >
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
