import React, { useCallback, useState, useEffect } from 'react';
import cx from 'classnames';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import styles from './index.module.scss';

const registerURL = "/api/v1/auth/register"
const verifyURL = "/api/v1/auth/verify"
const deregisterURL = "/api/v1/auth/deregister"

const Account: React.FC<{
  user: IUser | undefined;
  setUser: (usr: IUser | undefined) => void;
  auth: IAuth | undefined;
}> = ({
  user,
  setUser,
}) => {
  const [formState, setFormState] = useState<"idle" | "login" | "register">("idle");
  const [userState, setUserState] = useState<"verified" | "anonymous">("anonymous");
  const [mouseState, setMouseState] = useState<"over" | "inactive">("inactive");

  useEffect(() => {
    if(user) {
      setUserState("verified");
    } else {
      setUserState("anonymous");
    }
  }, [
    setUserState,
    user,
  ]);

  const handleRegisterClick = useCallback(() => {
    setFormState("register");
  }, [
    setFormState,
  ]);
  const handleLoginClick = useCallback(() => {
    setFormState("login");
  }, [
    setFormState,
  ]);

  const handleDeregister = useCallback(async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        user: user?.id,
      }),
    };
    const res = await fetch(deregisterURL, options);
    setUser(undefined);
    return await res.json();
  }, [
    user,
    setUser,
  ]);
  const handleRegister = useCallback(async (form: IRegisterForm) => {
    const options = {
      method: "POST",
      body: JSON.stringify(form),
    };
    const res = await fetch(registerURL, options);
    setFormState("idle");
    return await res.json();
  }, [
  ]);
  const handleLogin = useCallback(async (form: IRegisterForm) => {
    const options = {
      method: "POST",
      body: JSON.stringify(form),
    };
    const res = await fetch(verifyURL, options);
    setFormState("idle");
    return await res.json();
  }, []);

  const handleMouseOver = useCallback(() => {
    setMouseState("over");
  }, [
    setMouseState,
  ]);
  const handleMouseOut = useCallback(() => {
    setMouseState("inactive");
  }, [
    setMouseState,
  ]);

  const container = useCallback((props: any, render: JSX.Element) => (
    <div className={cx({
      [styles.Account]: true,
      [styles.Hover]: mouseState === "over",
    })} {...props}>
      {render}
    </div>
  ), [
    mouseState,
  ]);

  switch(userState) {
    case "anonymous": {
      return container(
        {},
        <>
          <RegisterForm
            className={styles.AccountRegister}
            handleRegisterClick={handleRegisterClick}
            handleRegister={handleRegister}
            setUser={setUser}
            formState={formState}
          />
          <LoginForm
            className={styles.AccountLogin}
            handleLoginClick={handleLoginClick}
            handleLogin={handleLogin}
            setUser={setUser}
            formState={formState}
          />
        </>
      );
    }
    case "verified": {
      switch(mouseState) {
        case "inactive": {
          return container(
            {
              onMouseOver: handleMouseOver,
            },
            <span className={styles.AccountEmail}>{user?.email}</span>,
          );
        }
        case "over": {
          return container(
            {
              onClick: handleDeregister,
              onMouseOut: handleMouseOut,
            },
            <span className={styles.AccountLogout}>Logout</span>,
          );
        }
      }
    }
  }
}

export default Account;
