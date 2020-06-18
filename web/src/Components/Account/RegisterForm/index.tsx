import React, { useState, useCallback } from "react";
import cx from "classnames";
import styles from './index.module.scss';

const RegisterForm: React.FC<{
    className?: string;
    handleRegisterClick: () => void;
    handleRegister: (form: IRegisterForm) => Promise<any>;
    setUser: (usr: IUser | undefined) => void;
    formState: "idle" | "login" | "register";
}> = ({
    className,
    handleRegisterClick,
    handleRegister,
    setUser,
    formState,
}) => {
    const [formStatus, setFormStatus] = useState<"idle" | "active" | "submitting" | "success" | "error">("idle");
    const [formValue, setFormValue] = useState<IRegisterForm>({
        email: "",
        password: "",
    });

    const handleLinkClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setFormStatus("active");
        handleRegisterClick();
    }, [
        setFormStatus,
        handleRegisterClick,
    ]);

    const handleEmailChange = useCallback((e) => {
        e.preventDefault();
        setFormValue({
            ...formValue,
            email: e.target.value,
        });
    }, [
        formValue,
        setFormValue,
    ]);
    const handlePasswordChange = useCallback((e) => {
        e.preventDefault();
        setFormValue({
            ...formValue,
            password: e.target.value,
        });
    }, [
        setFormValue,
        formValue,
    ]);
    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus("submitting");
        handleRegister(formValue)
            .then((js) => {
                if(js.status) {
                    setFormStatus("error");
                } else {
                    setUser(js)
                }
            });
    }, [
        formValue,
        setFormStatus,
        handleRegister,
        setUser,
    ]);

    const container = useCallback((children) => (
        <div className={cx(className, styles.RegisterForm)}>
            {children}
        </div>
    ), [
        className,
    ]);

    if(formState === "login") {
        return (<></>);
    }

    switch(formStatus) {
        case "active": {
            return container(
                <form className={styles.Form} onSubmit={handleSubmit}>
                    <input className={styles.Input} type="email" placeholder="Email address..." required={true} onChange={handleEmailChange} value={formValue.email} />
                    <input className={styles.Input} type="password" placeholder="Password..." required={true} onChange={handlePasswordChange} value={formValue.password} />
                    <button className={styles.Button} type="submit">Register</button>
                </form>
            );
        }
        case "submitting": {
            return container(
                <svg className={styles.Spinner} viewBox="0 0 50 50">
                    <circle className={styles.SpinnerCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
            );
        }
        case "error": {
            return container(
                <span>There was a problem; please try again.</span>
            )
        }
        case "idle": {
            return container(
                <span className={styles.Link} onClick={handleLinkClick}>Register</span>
            );
        }
        default: {
            return container(
                <span>How'd you get here?</span>
            );
        }
    }
}

export default RegisterForm;
