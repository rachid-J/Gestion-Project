import React,{useState}  from 'react'
import { UploadCloud } from "lucide-react";
export const Profile = () => {
  const projects = [
    {
      "name": "E-Commerce Platform",
      "created_date": "2025-03-15",
      "end_date": "2025-06-30"
    },
    {
      "name": "Real Estate Website",
      "created_date": "2025-02-10",
      "end_date": "2025-07-01"
    },
    {
      "name": "Social Media App",
      "created_date": "2025-01-05",
      "end_date": "2025-05-20"
    },
    {
      "name": "AI Chatbot Development",
      "created_date": "2025-04-01",
      "end_date": "2025-09-15"
    },
    {
      "name": "Inventory Management System",
      "created_date": "2025-03-20",
      "end_date": "2025-08-10"
    }
  ]

  const [background, setBackground] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [hoverBg, setHoverBg] = useState(false);
  const [hoverProfile, setHoverProfile] = useState(false);

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) setBackground(URL.createObjectURL(file));
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };
  return (
    <>
      <div className="relative flex justify-center items-center mt-10">
        {/* Image de fond */}
        <div
          className="w-[75%] h-60 bg-cyan-300 relative cursor-pointer overflow-hidden flex items-center justify-center"
          style={{
            backgroundImage: background ? `url(${background})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onMouseEnter={() => setHoverBg(true)}
          onMouseLeave={() => setHoverBg(false)}
          onClick={() => document.getElementById("backgroundInput").click()}
        >
          {hoverBg && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
          )}
          <input
            type="file"
            id="backgroundInput"
            accept="image/*"
            className="hidden"
            onChange={handleBackgroundUpload}
          />
        </div>

        {/* Cercle de la photo de profil */}
        <div className="absolute left-55 -bottom-12 flex items-center justify-center">
          <div
            className="w-40 h-40 bg-cyan-600 text-white font-bold text-5xl flex items-center justify-center rounded-full border-4 border-white shadow-lg cursor-pointer overflow-hidden relative"
            onMouseEnter={() => setHoverProfile(true)}
            onMouseLeave={() => setHoverProfile(false)}
            onClick={() => document.getElementById("profileInput").click()}
          >
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              "AR"
            )}
            {hoverProfile && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
            )}
            <input
              type="file"
              id="profileInput"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center p-6 bg-white rounded-lg w-110">
        <div>
          <div className="absolute left-50 mb-20 mt-15">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Alii Riad</h2>
            <button className="mt-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md w-100 text-sm font-medium cursor-pointer hover:bg-gray-300 ">
              Gérer votre compte
            </button>
          </div>

          <div className=" absolute left-50 mt-4 bg-white p-4 rounded-lg shadow-md w-100 mt-50">
            <h3 className="text-gray-800 font-semibold mb-2">À propos</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center gap-6 mt-8 ml-5 mb-8 w-[100%] ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <input
                  type="text"
                  className="w-55 h-10 border border-gray-300 rounded-lg text-center placeholder-gray-500 "
                  placeholder="Votre intitulé de poste"
                />
              </div>
              <div className="flex items-center gap-6 mt-8 ml-5 mb-8 w-[100%] ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                <input
                  type="text"
                  className="w-55 h-10 border border-gray-300 rounded-lg text-center placeholder-gray-500"
                  placeholder="Votre organisation"
                />
              </div>
              <div className="flex items-center gap-6 mt-8 ml-5 mb-8 w-[100%] ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <input
                  type="text"
                  className="w-55 h-10 border border-gray-300 rounded-lg text-center placeholder-gray-500 "
                  placeholder="Votre emplacement"
                />
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">Contact</h3>
              <div className="flex items-center gap-6 mt-8 ml-5 mb-8 w-[100%] ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span className="text-xl">alii.riad1234@gmail.com</span>
              </div>
              <h3 className="text-gray-800 font-semibold mb-2">Équipes</h3>
              <div className=" flex items-center gap-6 mt-8 ml-5 mb-8 w-[100%]">
                <button className="flex items-center justify-center space-x-2 text-gray-800 font-medium w-48 h-10 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer">
                  <span className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-10"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </span>
                  <span>Créer une équipe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" absolute left-170 mt-20 bg-white p-4 rounded-lg shadow-md w-170">
          <h1 className="text-2xl font-bold mb-10">Élément(s) remanié(s)</h1>
          <div>
            {projects.map((elem) => (
              <div className="mb-4">
                <h1 className="text-xl">{elem.name}</h1>
                <span className="color-gray-600">{`${elem.created_date}-${elem.end_date}`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
