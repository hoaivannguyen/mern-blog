import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill in all fields');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok) {
        navigate ("/");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  }
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your email" />
              <TextInput type="email" placeholder="Email" id="email" onChange={handleChange}/>
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput type="password" placeholder="Password" id="password" onChange={handleChange}/>
            </div>
            <Button color="green" type="submit" disabled={loading}>
              {loading ? (
                  <>
                    <Spinner size="sm"/>
                    <span className="pl-3">Loading...</span>
                  </>
              ) : (
                "Sign In"
              )}
            </Button> 
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
        </div>
      </div>
    </div>
  ) 
}
