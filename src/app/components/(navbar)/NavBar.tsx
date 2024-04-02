

import HomeButton from "../(home-page)/HomeButton";
import NavBarSearchInput from "./NavBarSearchInput";


const NavBar = () => {
    // NavBar.js

return (
    <div className="">
      <div className="  flex flex-col sm:flex-row items-center justify-center md:justify-between p-4 ">
        <div className="w-2/3 md:w-1/2 flex text-sm items-center justify-center ">
          <HomeButton />
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center ">
          <div className="w-80" >
            <NavBarSearchInput />
          </div>
        
        </div>
      </div>
    </div>
  )
}

export default NavBar;