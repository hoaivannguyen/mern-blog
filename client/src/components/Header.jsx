import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

export default function Header() {
    const pathname = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link to="/">Hoai + Dieu</Link>
      <form>
        <TextInput 
            type="text" 
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
            <FaMoon />
        </Button>
        <Link to="/sign-in">
          <Button color="green" pill>Sign In</Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
            <Navbar.Link active={pathname === "/"} as={'div'}>
                <Link to="/">Home</Link>
            </Navbar.Link>
            <Navbar.Link active={pathname === "/about"} as={'div'}> 
                <Link to="/about">About</Link>
            </Navbar.Link>
            <Navbar.Link active={pathname === "/projects"} as={'div'}>
                <Link to="/projects">Projects</Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}
