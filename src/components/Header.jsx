import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function Header() {
    const [pageState, setPageState] = useState("Sign in")
    const [projectPage, setProjectPage] = useState("Project"); //

    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    useEffect(()=>{
      onAuthStateChanged(auth, (user)=>{
        if(user){
          setPageState("Profile")
          setProjectPage("Project")
        }
        else{
          setPageState("Sign in")
          setProjectPage("")
        }
      })

    }, [auth])
    function pathMatchRoute(route) {
            if(route === location.pathname){
                return true;
      }
    }

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <div>
                <img 
                    src='https://www.learningcom.it/wp-content/uploads/2017/09/TASKlogodeftrasp.png' alt='logo'
                    className='h-6 cursor-pointer'
                    onClick={()=>navigate("/")}    
                />
            </div>
            <div>
                <ul className='flex space-x-10'>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-blue-900 border-b-[3px] border-b-transparent ${
                      pathMatchRoute("/") && "text-black border-b-red-500"}`}
                      onClick={() => navigate("/")} 
                    > Home
                    </li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-blue-900 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile"))&& "text-black border-b-red-500"}`}
                    onClick={() => navigate("/profile")} 
                    >
                    {pageState}
                    </li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-blue-900 border-b-[3px] border-b-transparent ${pathMatchRoute("/projects") && "text-black border-b-red-500"}`} onClick={() => navigate("/projects")}>
                      {projectPage}
                    </li>

                </ul>
            </div>
        </header>
    </div>
  )
}
