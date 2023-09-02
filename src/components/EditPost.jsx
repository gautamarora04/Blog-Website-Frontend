import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
// import { uploadImage } from "./CreateBlog";
const EditPost = () => {
  const [singlePost, setSinglePost] = useState();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const [imageUpload, setImageUpload] = useState();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const options = {
    position: "bottom-right",
    style: {
      backgroundColor: "gray",
      border: "2px solid lightgreen",
      color: "white",
      fontFamily: "Menlo, monospace",
      fontSize: "20px",
      textAlign: "center",
    },
    closeStyle: {
      color: "lightcoral",
      fontSize: "16px",
    },
  };

  const [openSnackbar] = useSnackbar(options);
  const singleBlog = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/allpost/${id}`,
        //{},
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        //setLoading(false);
        //setBlogData(response?.data?.data);
        setSinglePost(response?.data?.data);
        console.log(response?.data?.data);
      })
      .catch(function (error) {
        // handle error
        //setLoading(false);
        //   setMessage(error?.response?.data?.message);
        //   openSnackbar(error?.response?.data?.message);
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };

  useEffect(() => {
    const User = localStorage.getItem("user");

    if (!User) {
      navigate("/login");
    }
    singleBlog();
  }, []);

  const onSubmit = (data) => {
    setLoading(true);
    const body = {
      ...data,
      image: singleBlog?.image,
    };


    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/update/${id}`,
        { ...body },
        {
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log("response", response?.data);
        openSnackbar("Post Updated Successfully");
        setLoading(false);
        navigate("/personal");
      })
      .catch(function (error) {
        openSnackbar("Oops!, Post is not updated");
        setLoading(false);

        // handle error
        //setLoading(false);
        //   setMessage(error?.response?.data?.message);
        //
        console.log(error);
      });
  };
  
  const handleImage = (e) => {
    const file = e.target.files[0];
    const size = file.size / 1024;
    setImageUpload(e.target.files[0]);

    // formData.append("image", file);
    const reader = new FileReader();
    reader.onloadend = function () {
      setImage({ [e.target.name]: reader.result });

      // setPreview({ ...preview, [e.target.name]: reader.result });
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      e.target.value = null;
    }
  };
  const uploadImage = () => {
    let formData = new FormData(); //formdata object

    formData.append("image", imageUpload); //append the values with key, value pair
    //formData.append("name", imageUpload.name);
    formData.append("name", imageUpload.name);
    const config = {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    };
    let url = `${process.env.REACT_APP_BACKEND_URL}/api/upload-image`;

    axios
      .post(url, formData, config)
      .then((response) => {
        console.log("Image Url", response?.data?.url);
        setImage(response?.data?.url);
        openSnackbar("Image uploaded successfully");

      })
      .catch((error) => { 
        console.log(error);
      });
  };
  return (
    <div className="max-w-screen-md mx-auto p-5">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-first-name"
            >
              Title
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="grid-first-name"
              type="text"
              placeholder="title"
              name="title"
              autoComplete="off"
              defaultValue={singlePost?.title}
              {...register("title", {
                required: true,
              })}
            />
            {errors.title && errors.title.type === "required" && (
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 items-center lg:items-start mb-6">
          <div className="w-full px-3">
            <label title="click to select a picture">
              <input
                accept="image/*"
                className="hidden"
                id="banner"
                type="file"
                name="image"
                onChange={handleImage}
                visibility="hidden"
              />
              <div className="flex flex-col">
                <div className="pb-2">Upload Image</div>

                {image ? (
                  <div className="pt-4">
                    <div>
                      <img
                        className="-object-contain -mt-8 p-5 w-1/2"
                        src={image ? image.image : ""}
                        alt=""
                      />
                    </div>
                  </div>
                ) : (
                  <div className="pb-5">
                    <img
                      src={image ? image.image: "/upload/" + singlePost?.image}
                      style={{ background: "#EFEFEF" }}
                      className="h-full w-48"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>
          <div className="flex items-center justify-cente px-5">
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="button"
              onClick={uploadImage}
            >
              Upload Image

            </button>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-password"
            >
              Description
            </label>
            <textarea
              rows="10"
              name="description"
              defaultValue={singlePost?.description}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              {...register("description", {
                required: true,
              })}
            ></textarea>
            {errors.description && errors.description.type === "required" && (
              <p className="text-red-500 text-xs italic">
                Please fill out this field.
              </p>
            )}
          </div>
          <div className="flex justify-between w-full px-3">
            <button
              className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
              type="submit"
            >
              {loading ? "Loading" : " Update Post"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditPost;
