import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";
import BlogPost from "./BlogPost";
const Home = () => {
  const [userData, setUserData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(); // State for last page
  useEffect(() => {
    // Fetch the total pages from your API and set it in state
    axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/api/allpost`, {
      params: {
        page: currentPage,
      },
      withCredentials: true,
    })
    .then(function (response) {
      setLastPage(response?.data?.meta?.last_page); // Extract last page from meta
    })
    .catch(function (error) {
      console.log(error);
    });

    const User = localStorage.getItem("user");
    const parseUser = JSON.parse(User);
    setUserData(parseUser);
  }, [currentPage]);
 // Function to handle next page click
  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  // Function to handle previous page click
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="relative h-screen w-full flex items-center justify-center text-center bg-cover bg-center">
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/background.jpg')" }}></div>


        <main className="px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h2 className="text-4xl tracking-tight leading-10 font-medium sm:text-5xl text-white sm:leading-none md:text-6xl">
            <span className="text-slate-400">
            Hi {userData?.first_name ? 
              (userData.first_name.charAt(0).toUpperCase() + userData.first_name.slice(1)) : ""
            } {userData?.last_name ? 
              (userData.last_name.charAt(0).toUpperCase() + userData.last_name.slice(1)) : ""
            },
          </span>{" "}

              Welcome to my site!
            </h2>
            <p className="mt-3 text-white text-lg sm:mt-5 sm:text-md sm:max-w-xl sm:mx-auto md:mt-5">
              Uncover fresh perspectives, ideas, and knowledge through the power of blogs.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex justify-center">
              <div className="rounded-md shadow">
                <a
                  href="/create"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-indigo-700  bg-gray-300 hover:bg-gray-600 hover:text-white focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:px-10"
                >
                  Create Post
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="/personal"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-regular rounded-md text-indigo-700 bg-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 transition duration-150 ease-in-out md:py-4 md:px-10"
                >
                  View My Post
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Pagination controls */}
      <div className="mt-5 flex justify-center items-center">
      <button
        onClick={handlePrevPage}
        className="px-4 py-2 bg-gray-100 border hover:bg-gray-300 rounded-md mr-2"
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-xl">{`Page ${currentPage} of ${lastPage}`}</span>
      <button
        onClick={handleNextPage}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-300 border rounded-md ml-2 mybtn"
        disabled={currentPage === lastPage}
      >
        Next
      </button>
      </div>  

      {/* Render your BlogPost component here with the currentPage */}
      <BlogPost currentPage={currentPage} />
      {/* <BlogPost /> */}

      {/* <div className="pt-10 text-3xl font-medium text-center">
        {loading ? "The System is logging you out" : "Welcome Home"}{" "}
        <span className="font-bold">
          {userData?.first_name} {userData?.last_name}
        </span>
      </div> */}
    </>
  );
};

export default Home;
