import { useLocation , useNavigate} from 'react-router-dom';
export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    function pathMatchRoute(route) {
            if(location.pathname === route){
                return true
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
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-blue-900 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "text-black border-b-red-500"}`}
                      onClick={()=>navigate("/")} 
                    > Home
                    </li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-blue-900 border-b-[3px] border-b-transparent ${pathMatchRoute("/sign-in") && "text-black border-b-red-500"}`}
                    onClick={()=>navigate("/sign-in")} 
                    >
                    Sign In</li>
                </ul>
            </div>
        </header>
    </div>
  )
}
