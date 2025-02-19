import { useDialog } from "../../context/DialogContext";

export default function Navbar() {
  const { openDialog, setDialogContent } = useDialog();

  const handleOpenDialog = () => {
    setDialogContent(<div>Navbar</div>);
    openDialog();
  };

  return (
    <header>
      <div className="bg-[#000] px-[6px] text-white min-h-[30px] font-[12px]">
        <div></div>
        <div className="w-full text-center overflow-hidden block">
          <p>Bring the hype to art</p>
        </div>
        <div className="absolute right-[15px] top-[5px]">
          <ul className="flex list-none gap-[34px]">
            <li>
              <span>EN</span>
            </li>
            <li onClick={handleOpenDialog} className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="15"
                viewBox="0 0 14 15"
              >
                <g fill="none" fillRule="evenodd">
                  <g stroke="#FFF">
                    <g>
                      <g transform="translate(-1348 -7) translate(0 -1) translate(1348 8)">
                        <circle cx="7" cy="4" r="3.5" />
                        <path d="M14 15h0c0-3.866-3.134-7-7-7h0c-3.866 0-7 3.134-7 7h0" />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </li>
            <li className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="15"
                viewBox="0 0 14 15"
              >
                <g fill="none" fillRule="evenodd">
                  <g stroke="#FFF">
                    <g>
                      <g>
                        <path
                          d="M0.551 14.5L1.62 3.5 12.38 3.5 13.449 14.5z"
                          transform="translate(-1387 -7) translate(0 -1) translate(1387 8)"
                        />
                        <path
                          d="M4 5.5L4.5 0.5 9.5 0.5 10 5.5"
                          transform="translate(-1387 -7) translate(0 -1) translate(1387 8)"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between px-[32px] py-[32px] border-[2px] border-l-0 border-r-0 border-t-0">
        {/* logo */}
        <div></div>
        {/* navigation */}
        <div></div>
        {/* logo second */}
        <div className="relative">
          <div className="absolute w-[88px] h-[88px] rounded-[50px] bg-black right-0 top-[-8px] flex justify-center items-center">
            <div className="text-white font-extrabold">shop</div>
          </div>
        </div>
      </div>
    </header>
  );
}
