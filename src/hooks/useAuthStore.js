import { useDispatch, useSelector } from "react-redux";
import { calendarAPI } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const { status, user, errorMessage } = useSelector((state) => state.auth);

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    console.log({ email, password });
    try {
      const { data } = await calendarAPI.post("/auth", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      dispatch(onLogout("incorrect data"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const createUser = async ({
    registerName: name,
    registerEmail: email,
    registerPassword: password,
  }) => {
    dispatch(onChecking());
    try {
      const res = await calendarAPI.post("/auth/new", { name, email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: res.data.name, uid: res.data.uid }));
    } catch (error) {
      console.log(error);
      dispatch(onLogout("error in data"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const authToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarAPI.get("/auth/renew");
      console.log({ data });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
      console.log(error);
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    status,
    user,
    errorMessage,
    startLogin,
    createUser,
    authToken,
    startLogout,
  };
};
