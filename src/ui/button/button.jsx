import { Loader } from "@/ui/loader";
import { Transition } from "@/ui/transition";
import { forwardRef } from "react";
import { classes } from "@/utils/style";
import { IconArrowAutofitRight } from "@tabler/icons-react";
import styles from "./button.module.css";

function isExternalLink(href) {
  return href?.includes("://");
}

export const Button = forwardRef(({ href, ...rest }, ref) => {
  if (isExternalLink(href) || !href) {
    return <ButtonContent href={href} ref={ref} {...rest} />;
  }

  return (
    <ButtonContent
      unstable_viewTransition
      as={"button"}
      prefetch="intent"
      to={href}
      ref={ref}
      {...rest}
    />
  );
});

const ButtonContent = forwardRef(
  (
    {
      className,
      as,
      secondary,
      loading,
      loadingText = "loading",
      iconOnly,
      children,
      rel,
      target,
      href,
      disabled,
      ...rest
    },
    ref
  ) => {
    const isExternal = isExternalLink(href);
    const defaultComponent = href ? "a" : "button";
    const Component = as || defaultComponent;

    return (
      <Component
        className={classes(styles.button, className)}
        data-loading={loading}
        data-icon-only={iconOnly}
        data-secondary={secondary}
        href={href}
        rel={rel || isExternal ? "noopener noreferrer" : undefined}
        target={target || isExternal ? "_blank" : undefined}
        disabled={disabled}
        ref={ref}
        {...rest}
      >
        {!!children && <span className={styles.text}>{children}</span>}
        <IconArrowAutofitRight size={24} className="ml-2" />
        <Transition unmount in={loading}>
          {({ visible, nodeRef }) => (
            <Loader
              ref={nodeRef}
              className={styles.loader}
              size={32}
              text={loadingText}
              data-visible={visible}
            />
          )}
        </Transition>
      </Component>
    );
  }
);
