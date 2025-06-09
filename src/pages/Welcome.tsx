import { useNavigate } from "react-router-dom";
import "../styles/fonts.css"; // Import fonts

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-[#121934] overflow-hidden">
      {/* Background Image - Throne */}
      <div className="absolute right-0 top-0 w-full h-full">
        {/* Image */}
        <div className="absolute right-0 top-0 w-[50%] h-full">
          <img
            src="/images/home_image.png"
            alt="Throne background"
            className="w-full h-full object-cover object-right"
          />
        </div>
        
        {/* Blue overlay */}
        <div className="absolute right-0 top-0 w-[50%] h-full bg-[rgba(38,51,170,0.33)]" />
        
        {/* Gradient overlay */}
        <div
          className="absolute right-0 top-0 w-[50%] h-full"
          style={{
            background: "linear-gradient(90deg, #121934 0%, rgba(18, 25, 52, 0) 30%, rgba(18, 25, 52, 0) 100%)",
          }}
        />
      </div>

      {/* Content container - centered for all screen sizes */}
      <div className="relative z-10 flex flex-col h-full max-w-[1728px] mx-auto px-4 sm:px-8 md:px-16 lg:px-24">
        {/* Logo/Title */}
        <h1
          className="text-[40px] sm:text-[48px] md:text-[52px] leading-[65px] text-white mt-[5vh] md:mt-[80px] ml-[5vw] md:ml-[132px]"
          style={{
            fontFamily: "Arcade Interlaced",
            fontWeight: 400,
          }}
        >
          POL/IO
        </h1>

        {/* Navigation Buttons - centered vertically in the page */}
        <div className="flex flex-col space-y-6 w-full max-w-[555px] mx-auto md:mx-0 md:ml-[5vw] md:ml-[132px] mt-auto mb-auto">
          {/* Create Button */}
          <button
            className="w-full h-[60px] md:h-[80px] bg-white flex justify-center items-center px-4 md:px-[88px] hover:bg-white/90 transition-colors"
            onClick={() => navigate("/create-simulation")}
          >
            <span
              className="text-[18px] md:text-[24px] leading-[32px] text-black text-center"
              style={{ fontFamily: "Roboto Mono", fontWeight: 400 }}
            >
              Create
            </span>
          </button>

          {/* All Simulations Button */}
          <button 
            className="w-full h-[60px] md:h-[80px] bg-transparent border border-[#A8A8A8] flex justify-center items-center px-4 md:px-[88px] hover:bg-white/10 transition-colors"
            onClick={() => navigate("/simulation-result")}
          >
            <span
              className="text-[18px] md:text-[24px] leading-[32px] text-white text-center"
              style={{ fontFamily: "Roboto Mono", fontWeight: 400 }}
            >
              All Simulations
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
