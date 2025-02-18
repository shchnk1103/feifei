import { motion } from "framer-motion";
import { menuItemVariants } from "../animations";
import { mergeStyles } from "@/utils/styles";
import mobileStyles from "../styles/mobile.module.css";
import userStyles from "../styles/user.module.css";

const styles = mergeStyles(mobileStyles, userStyles);

interface UserSectionProps {
  user: any;
  mobile?: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onClose?: () => void;
}

export function UserSection({
  user,
  mobile,
  onLogin,
  onLogout,
  onClose,
}: UserSectionProps) {
  const Component = mobile ? motion.div : "div";
  const props = mobile ? { variants: menuItemVariants } : {};
  const className = mobile ? styles.mobileUserSection : styles.userSection;
  const buttonClassName = mobile ? styles.mobileAuthButton : styles.authButton;
  const usernameClassName = mobile ? styles.mobileUsername : styles.username;

  return (
    <Component {...props} className={className}>
      {user ? (
        <>
          <span className={usernameClassName}>{user.email?.split("@")[0]}</span>
          <button
            onClick={() => {
              onLogout();
              onClose?.();
            }}
            className={buttonClassName}
          >
            登出
          </button>
        </>
      ) : (
        <button
          onClick={() => {
            onLogin();
            onClose?.();
          }}
          className={buttonClassName}
        >
          登录
        </button>
      )}
    </Component>
  );
}
