import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold text-4xl">Hoai + Dieu</Link>
          <p className="text-sm mt-2">
            A blend of arts for Hoai + Dieu
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Your username" />
              <TextInput type="text" placeholder="Username" id="username"/>
            </div>
            <div className="">
              <Label value="Your email" />
              <TextInput type="text" placeholder="Email" id="email"/>
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput type="text" placeholder="Password" id="password"/>
            </div>
            <Button color="green" type="submit" >
              Sign Up
            </Button> 
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) 
}
