import Link from "next/link";
//import js cookie
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Router from "next/router";
import { callbackify } from "util";

export default function Login() {
  const {
    register,
    control,
    resetField,
    setValue,
    trigger,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({});

  const router = useRouter();

  const [ProcessLogin, setProcessLogin]: any = useState(false);
  var expireTime = new Date();
  expireTime.setTime(expireTime.getTime() + (24 * 60 * 60 * 1000));

  async function onLogin(data: any) {
    setProcessLogin(true);

    await axios
      .post("http://localhost:4000/v1/login", {
        data: data,
      })
      .then(function (response) {
        if (response.data.result === "Failed") {
          toast.warning("Login Failed", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            autoClose: 800,
          });
          setProcessLogin(false);
        } else if (response.data.result === "NONACTIVE") {
          toast.info("Maaf, Akun Belum Aktif", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            autoClose: 800,
          });
          setProcessLogin(false);
        } else if (response.data.result === "Wrong") {
          toast.info("the username and password combination you entered into the system was incorrect or doesn't match", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            autoClose: 800,
          });
          setProcessLogin(false);
        } else if (response.data.result === undefined) {
          toast.info("Server is lost, please restart the browser", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            autoClose: 800,
          });
          setProcessLogin(false);
        } else if (response.data.result === "undefined") {
          toast.info("Server is lost, please restart the browser", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            autoClose: 800,
          });
          setProcessLogin(false);
        } else {
          toast.success("Login Berhasil", {
            position: toast.POSITION.TOP_CENTER,
            pauseOnHover: false,
            autoClose: 800,
            onClose: () => {
              router.reload();
              window.location.href = "/products/daftar_produk";
              Cookies.set("auth", "Login", { expires: expireTime });
              Cookies.set("auth_idusername", response.data.result[0]["id"], {
                expires: expireTime,
              });
              Cookies.set(
                "auth_username",
                response.data.result[0]["username"],
                { expires: expireTime }
              );
              Cookies.set("auth_name", response.data.result[0]["name"], {
                expires: expireTime,
              });
              Cookies.set(
                "auth_password",
                response.data.result[0]["password"],
                { expires: expireTime }
              );
              Cookies.set("auth_role", response.data.result[0]["role"], {
                expires: expireTime,
              });
              Cookies.set("auth_store", response.data.result[0]["id_store"], {
                expires: expireTime,
              });
              Cookies.set("auth_channel", response.data.result[0]["channel"], {
                expires: expireTime,
              });
            },
          });
          // console.log(response.data[0]['name']);
        }
      });
  }

  const [isipassword, setPassword]: any = useState("");
  const [isiusername, setUsername]: any = useState("");

  async function keyDown(event: any) {
    if (event.key == 'Enter') {
      if (event.key == 'Enter') {
        var username = isiusername.target.value;
        var password = isipassword.target.value;

        setProcessLogin(true);

        await axios
          .post("http://localhost:4000/v1/login_on_enter", {
            username: username,
            password: password,
          })
          .then(function (response) {
            if (response.data.result === "Failed") {
              toast.warning("Login Failed", {
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: false,
                autoClose: 800,
              });
              setProcessLogin(false);
            } else if (response.data.result === "NONACTIVE") {
              toast.info("Maaf, Akun Belum Aktif", {
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: false,
                autoClose: 800,
              });
              setProcessLogin(false);
            } else if (response.data.result === "Wrong") {
              toast.info("the username and password combination you entered into the system was incorrect or doesn't match", {
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: false,
                autoClose: 800,
              });
              setProcessLogin(false);
            } else {
              toast.success("Login Berhasil", {
                position: toast.POSITION.TOP_CENTER,
                pauseOnHover: false,
                autoClose: 800,
                onClose: () => {
                  router.reload();
                  window.location.href = "/products/daftar_produk";
                  Cookies.set("auth", "Login", { expires: expireTime });
                  Cookies.set("auth_idusername", response.data.result[0]["id"], {
                    expires: expireTime,
                  });
                  Cookies.set(
                    "auth_username",
                    response.data.result[0]["username"],
                    { expires: expireTime }
                  );
                  Cookies.set("auth_name", response.data.result[0]["name"], {
                    expires: expireTime,
                  });
                  Cookies.set(
                    "auth_password",
                    response.data.result[0]["password"],
                    { expires: expireTime }
                  );
                  Cookies.set("auth_role", response.data.result[0]["role"], {
                    expires: expireTime,
                  });
                  Cookies.set("auth_store", response.data.result[0]["id_store"], {
                    expires: expireTime,
                  });
                  Cookies.set("auth_channel", response.data.result[0]["channel"], {
                    expires: expireTime,
                  });
                },
              });
              // console.log(response.data[0]['name']);
            }
          });
      }
    }
  }

  return (
    <div className="bg-white h-screen w-screen flex items-center justify-center">
      <title>Login | Gudangsandal Official</title>
      <link rel="shortcut icon" href="../favicon.ico" />

      <ToastContainer className="mt-[50px]" />
      <div className="w-[600px] h-[600px] shadow-xl rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-[0px_20px_11px_1px_#2125291A]">
        <div className="flex justify-center mt-10 mb-0 ml-28 mr-28">
          <Image
            className="w-auto"
            src="/gudangsandallogo.png"
            alt="Picture of the author"
            width={160}
            height={160}
            placeholder="blur"
            blurDataURL={"/gudangsandallogo.png"}
          />
          {/* <span className='font-medium text-2xl text-black'>OFFICIAL KITA Apps</span> */}
        </div>

        <div className="mb-4">
          <span className="text-xl font-bold">Login</span>
        </div>

        <div>
          <div className="text-sm mb-2">Username</div>
          <input
            className={`${errors.username ? "border-red-400" : ""
              } h-auto rounded-lg w-full bg-white py-2 px-5 text-gray-700 focus:outline-none border text-base`}
            type="text"
            placeholder="Masukan Username"
            autoComplete="off"
            {...register("username", { required: true })}
            onChange={(e) => {
              setUsername(e);
            }}
          />
          {/* {errors.username && (
            <div className="text-sm italic">This field is required</div>
          )} */}
        </div>


        <div className="pt-2">
          <div className="text-sm mb-2">Password</div>
          <input
            className={`${errors.password ? "border-red-400" : ""
              } h-auto rounded-lg w-full bg-white py-2 px-5 text-gray-700 focus:outline-none border text-base`}
            type="password"
            placeholder="Masukan Password"
            autoComplete="off"
            {...register("password", { required: true })}
            onChange={(e) => {
              setPassword(e);
            }}
            onKeyDown={keyDown}
          />
          {/* {errors.password && (
            <div className="text-sm italic">This field is required</div>
          )} */}
        </div>

        <div className="mt-5">
          <button
            onClick={handleSubmit(onLogin)}
            disabled={ProcessLogin}
            type="button"
            className={`${ProcessLogin ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-800"
              } rounded-lg h-[50px] w-[100%] text-white`}
          >
            {(function () {
              if (ProcessLogin) {
                return (
                  <div className="w-[100%] text-center flex flex-auto items-center justify-center">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 mr-2 text-white animate-spin dark:text-white fill-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    Processing...
                  </div>
                );
              } else {
                return <div>Login</div>;
              }
            })()}
          </button>
        </div>
      </div>
    </div>
  );
}
