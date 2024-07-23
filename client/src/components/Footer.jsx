import { Footer } from "flowbite-react"
import { Link } from "react-router-dom"

export default function FooterCom() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
        <div className="classname">
            <div className="">
                <div className="">
                    <Link to="/">Hoai + Dieu</Link>
                </div>
            </div>
        </div>
    </Footer>
  )
}
