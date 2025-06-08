import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/fonts.css';

const ElectionResults = () => {
  const { simId } = useParams<{ simId: string }>();
  const [winner, setWinner] = useState('Charlie Singh');
  const [logs, setLogs] = useState<string[]>([
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
    "Charlie Singh held a rally to please his voters",
  ]);
  const [newsItems] = useState([
    "3 cows arrested for not giving enough milk tax, right wing leaders protest",
    "Minister declares Earth is flat 'in some constituencies'.",
    "Local politician caught arguing with ChatGPT over vote count.",
    "New startup offers subscription-based fresh air; premium includes 'hope."
  ]);

  const charlieSinghApproval = 67;
  const armanPatelApproval = 67;
  const charlieVoteShare = 65;
  const armanVoteShare = 35;
  const charlieRating = 55;
  const armanRating = 45;

  // Animating news ticker
  const [tickerPosition, setTickerPosition] = useState(0);
  
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerPosition(prev => (prev - 1) % -3000); // Loop the ticker
    }, 50);
    
    return () => clearInterval(tickerInterval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#101528] overflow-hidden">
      {/* Left sidebar */}
      <div className="absolute left-[56px] top-[56px] w-[273px] flex flex-col gap-[52px]">
        {/* Approval ratings section */}
        <div className="flex flex-col gap-[14px]">
          {/* Charlie Singh approval */}
          <div className="w-full">
            <div className="border border-[#27283C] p-[16px_8px] gap-[8px]">
              <div className="flex flex-row items-center gap-[8px]">
                <div className="w-[36px] h-[36px]">
                  <div className="w-[36px] h-[36px] bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div className="text-white opacity-67 uppercase text-[12px] tracking-[0.08em] font-['Roboto_Mono']">
                    Approval Rating
                  </div>
                  <div className="flex flex-row items-center gap-[4px]">
                    <div className="flex flex-row items-center gap-[1px]">
                      {/* Blue progress bars */}
                      {Array.from({ length: 17 }).map((_, i) => (
                        <div key={`charlie-blue-${i}`} className="w-[4px] h-[16px] bg-[#5D6BFF]"></div>
                      ))}
                      {/* Gray progress bars */}
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={`charlie-gray-${i}`} className="w-[4px] h-[16px] bg-[#454545]"></div>
                      ))}
                    </div>
                    <div className="text-white text-[16px] tracking-[-0.02em] uppercase">
                      {charlieSinghApproval}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[rgba(242,213,242,0.1)] flex justify-between items-center p-[4px_8px] gap-[8px]">
              <div className="text-white text-[12px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
                Charlie Singh
              </div>
              <div className="w-[16px] h-[16px]">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 5.5L8 11L13.5 5.5" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Arman Patel approval */}
          <div className="w-full">
            <div className="border border-[#27283C] p-[16px_8px] gap-[8px]">
              <div className="flex flex-row items-center gap-[8px]">
                <div className="w-[36px] h-[36px]">
                  <div className="w-[36px] h-[36px] bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div className="text-white opacity-67 uppercase text-[12px] tracking-[0.08em] font-['Roboto_Mono']">
                    Approval Rating
                  </div>
                  <div className="flex flex-row items-center gap-[4px]">
                    <div className="flex flex-row items-center gap-[1px]">
                      {/* Orange progress bars */}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={`arman-orange-${i}`} className="w-[4px] h-[16px] bg-[#FF926E]"></div>
                      ))}
                      {/* Gray progress bars */}
                      {Array.from({ length: 19 }).map((_, i) => (
                        <div key={`arman-gray-${i}`} className="w-[4px] h-[16px] bg-[#454545]"></div>
                      ))}
                    </div>
                    <div className="text-white text-[16px] tracking-[-0.02em] uppercase">
                      {armanPatelApproval}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[rgba(242,213,242,0.1)] flex justify-between items-center p-[4px_8px] gap-[8px]">
              <div className="text-white text-[12px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
                Arman Patel
              </div>
              <div className="w-[16px] h-[16px]">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M2.5 5.5L8 11L13.5 5.5" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Vote share section */}
        <div className="flex flex-col gap-[32px]">
          <div className="flex flex-col gap-[8px]">
            <div className="text-white text-[12.21px] uppercase tracking-[0.08em] font-['Roboto_Mono']">
              Live Vote Share for this candidate (%)
            </div>
            <div className="border border-[#3B394E] w-full h-[233px] relative">
              {/* Vote share legend */}
              <div className="absolute left-[14px] top-[24px] flex flex-col gap-[14px]">
                <div className="flex flex-row items-center gap-[16px]">
                  <div className="w-[16px] h-[16px] bg-[#5D6BFF] rounded-full"></div>
                  <div className="flex flex-row items-center gap-[15px]">
                    <div className="text-[#B0B2B8] text-[14px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
                      Charlie Singh
                    </div>
                    <div className="text-white text-[14px] text-center uppercase tracking-[0.08em] font-['Roboto_Mono']">
                      {charlieVoteShare}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[16px]">
                  <div className="w-[16px] h-[16px] bg-[#FF926E] rounded-full"></div>
                  <div className="flex flex-row items-center gap-[15px]">
                    <div className="text-[#B0B2B8] text-[14px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
                      Arman Patel
                    </div>
                    <div className="text-white text-[14px] text-center uppercase tracking-[0.08em] font-['Roboto_Mono']">
                      {armanVoteShare}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Vote share grid */}
              <div className="absolute left-[14px] top-[102px] flex flex-col gap-[16px]">
                {Array.from({ length: 4 }).map((_, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex flex-row items-center gap-[41px]">
                    {Array.from({ length: 5 }).map((_, colIndex) => {
                      // Logic to determine dot color based on position
                      let color = "#5D6BFF"; // Default blue
                      if (rowIndex === 2 && colIndex >= 3) {
                        color = "#FF926E"; // Orange
                      } else if (rowIndex === 3) {
                        color = "#FF926E"; // Orange
                      }
                      return (
                        <div 
                          key={`dot-${rowIndex}-${colIndex}`} 
                          className="w-[16px] h-[16px] rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Approval rating graph */}
          <div className="flex flex-col gap-[8px]">
            <div className="text-white text-[12.21px] uppercase tracking-[0.08em] font-['Roboto_Mono']">
              Approval rating
            </div>
            <div className="border border-[#494149] w-full h-[252px] relative">
              {/* Time axis */}
              <div className="absolute left-[24.73px] bottom-[9px] flex flex-row items-center gap-[6px]">
                {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"].map((time, index) => (
                  <div key={`time-${index}`} className="text-[#717171] text-[11.79px] tracking-[-0.14em] font-['Roboto_Mono']">
                    {time}
                  </div>
                ))}
              </div>

              {/* Percentage axis */}
              <div className="absolute left-[8px] top-[14.65px] flex flex-col items-end gap-[4.71px]">
                {["100", "90", "80", "70", "60", "50", "40", "30", "20", "10", "00"].map((value, index) => (
                  <div key={`percent-${index}`} className="text-[#717171] text-[9.9px] text-right tracking-[-0.02em] font-['Roboto_Mono']">
                    {value}
                  </div>
                ))}
              </div>

              {/* Graph grid */}
              <div className="absolute left-[26.85px] top-[9px] w-[238.34px] h-[202.63px] border border-white"></div>

              {/* Graph lines */}
              <div className="absolute left-[33px] top-[99px] w-[232px] h-[111px] border-[3px] border-[#5D6BFF]"></div>
              <div className="absolute left-[33px] top-[76.5px] w-[218px] h-[133.5px] border-[3px] border-[#FF926E]"></div>

              {/* Graph legend */}
              <div className="absolute left-[42px] top-[20px] flex flex-col gap-[14px]">
                <div className="flex flex-row items-center gap-[16px]">
                  <div className="w-[16px] h-[17px] bg-[#5D6BFF] rounded-full"></div>
                  <div className="flex flex-row items-center gap-[15px]">
                    <div className="text-[#B0B2B8] text-[14px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
                      Charlie Singh
                    </div>
                    <div className="text-white text-[14px] text-center uppercase tracking-[0.08em] font-['Roboto_Mono']">
                      {charlieRating}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-[16px]">
                  <div className="w-[16px] h-[17px] bg-[#FF926E] rounded-full"></div>
                  <div className="flex flex-row items-center gap-[15px]">
                    <div className="text-[#B0B2B8] text-[14px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
                      Arman Patel
                    </div>
                    <div className="text-white text-[14px] text-center uppercase tracking-[0.08em] font-['Roboto_Mono']">
                      {armanRating}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center winner section */}
      <div className="absolute left-[808px] top-[67px] text-white text-[44.21px] uppercase tracking-[0.08em] font-['Roboto_Mono']">
        Winner
      </div>

      {/* Center approval rating box */}
      <div className="absolute left-[511px] top-[242px] w-[819px]">
        <div className="border-[3px] border-[#27283C] p-[48px_24px] gap-[24px]">
          <div className="flex flex-row items-center gap-[24px]">
            <div className="w-[108px] h-[108px]">
              <div className="w-[108px] h-[108px] bg-white rounded-full"></div>
            </div>
            <div className="flex flex-col items-start gap-[12px]">
              <div className="text-white opacity-67 uppercase text-[36px] tracking-[0.08em] font-['Roboto_Mono']">
                Approval Rating
              </div>
              <div className="w-[122.25px] h-[122.25px] bg-[#D9D9D9] rounded-full"></div>
              <div className="flex flex-row items-center gap-[12px]">
                <div className="flex flex-row items-center gap-[3px]">
                  {/* Blue progress bars (larger) */}
                  {Array.from({ length: 17 }).map((_, i) => (
                    <div key={`center-blue-${i}`} className="w-[12px] h-[48px] bg-[#5D6BFF]"></div>
                  ))}
                  {/* Gray progress bars (larger) */}
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div key={`center-gray-${i}`} className="w-[12px] h-[48px] bg-[#454545]"></div>
                  ))}
                </div>
                <div className="text-white text-[48px] tracking-[-0.02em] uppercase">
                  67%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-[3px] border-[rgba(242,213,242,0.1)] flex justify-between items-center p-[12px_24px] gap-[24px]">
          <div className="text-white text-[36px] uppercase tracking-[0.03em] font-['Roboto_Mono']">
            Charlie Singh
          </div>
          <div className="w-[48px] h-[48px]">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M7.5 16.5L24 33L40.5 16.5" stroke="white" strokeWidth="4.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Speech buttons */}
      <div className="absolute left-[667px] top-[576px] flex flex-row gap-[52px]">
        <div className="flex flex-col items-center">
          <div className="w-[122.25px] h-[122.25px] bg-[#D9D9D9] rounded-full flex items-center justify-center">
            <div className="w-[50.07px] h-[50.07px] bg-[#101528] rotate-90 transform" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}></div>
          </div>
          <div className="text-white text-[23.41px] uppercase tracking-[0.03em] mt-[20px] font-['Roboto_Mono']">
            Victory Speech
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-[122.25px] h-[122.25px] bg-[#D9D9D9] rounded-full flex items-center justify-center">
            <div className="w-[50.07px] h-[50.07px] bg-[#101528] rotate-90 transform" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}></div>
          </div>
          <div className="text-white text-[23.41px] uppercase tracking-[0.03em] mt-[20px] font-['Roboto_Mono']">
            Losing Speech
          </div>
        </div>
      </div>

      {/* Right sidebar - Logs */}
      <div className="absolute right-[71px] top-[55px] w-[273px] flex flex-col gap-[16px]">
        <div className="flex flex-row gap-[16px]">
          <div className="text-white text-[20px] tracking-[0.08em] font-['Roboto_Mono']">
            Logs
          </div>
          <div className="text-white opacity-30 text-[20px] tracking-[0.08em] font-['Roboto_Mono']">
            Chats
          </div>
        </div>
        <div className="flex flex-col gap-[20px]">
          {logs.map((log, index) => (
            <div key={`log-${index}`} className="text-white text-[12.21px] tracking-[0.08em] font-['Roboto_Mono']">
              12:15 &gt;&gt;&gt;{log}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom news ticker */}
      <div className="absolute bottom-[2px] left-0 w-full h-[34px] bg-[#0F1528] border border-[#414553] flex items-center overflow-hidden">
        <div 
          className="flex flex-row items-center gap-[28px] whitespace-nowrap transition-transform duration-500 ease-linear"
          style={{ transform: `translateX(${tickerPosition}px)` }}
        >
          {newsItems.map((item, index) => (
            <div key={`news-${index}`} className="text-white text-[16px] tracking-[0.01em] font-['Roboto_Mono']">
              {item}
            </div>
          ))}
          {/* Duplicate items to create seamless loop */}
          {newsItems.map((item, index) => (
            <div key={`news-dup-${index}`} className="text-white text-[16px] tracking-[0.01em] font-['Roboto_Mono']">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectionResults; 