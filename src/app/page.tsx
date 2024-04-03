import NordVPNBanner1200x628 from "./components/(ads+affiliates)/NordVPNBanner1200x628";
import FooterContainer from "./components/(footer)/FooterContainer";
import FeaturedArticle from "./components/(home-page)/FeaturedArticle";
import HomeButton from "./components/(home-page)/HomeButton";
import HomeSearchInput from "./components/(home-page)/HomeSearchInput";
import HomeTypewriter from "./components/(home-page)/HomeTypewriter";

export default async function Home() {

  return (
    <div className="min-h-screen">
      <main className="flex flex-col items-center justify-between p-4 pt-16 pb-16 lg:pt-0 lg:pb-0 lg:p-8">
        <div className="flex w-full items-left mt-5">
          <HomeButton />
        </div>
        
        
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-5 sm:mt-28 mb-0 flex w-full flex-1 flex-col pl-0 pr-0 items-center justify-center'>
              <h1
                className="text-center leading-12 bg-gradient-to-br from-gray-400 to-black bg-clip-text pb-1 text-[28px] font-bold leading-8 text-transparent sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl"
              > 
              Wiki - Simplified
              </h1>

          <div className="flex items-center flex-col w-full md:w-3/5 pb-8 mt-10 " >
            
            <div className="flex items-center justify-center h-28">
              <HomeTypewriter />
         
            </div>
          </div>
          <div className=" w-full md:w-4/5  flex justify-center mt-4">
            <HomeSearchInput />
          </div>
          <div className="w-full md:w-full flex flex-col items-center jusify-center mt-8 mb-20 ">
            
            <div className="w-2/3 rounded-lg mt-28">
              <NordVPNBanner1200x628 />
            </div>
          </div>

          
        </div>
        <div>

        </div>
      </main>
      <FooterContainer />
      
    </div>
  );
}
