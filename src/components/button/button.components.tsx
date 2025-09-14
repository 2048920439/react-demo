import { LoadingIcon } from '@/components/button/loading.icon'
import classNames from 'classnames'
import { forwardRef, useMemo } from 'react'
import styles from './style.module.scss'
import { ButtonProps, ButtonSize, ButtonType } from './types'

const TypeClassMap: Record<ButtonType, string> = {
  default: styles.default,
  primary: styles.primary,
  simplicity: styles.simplicity,
  gray: styles.gray,
  alert: styles.alert,
  icon: styles.icon,
  iconSimplicity: styles.iconSimplicity,
  iconPrimary: styles.iconPrimary,
}

const SizeClassMap: Record<ButtonSize, string> = {
  mini: styles.mini,
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    elementType: Component = 'button',
    children,
    icon,
    type,
    buttonType = 'button',
    size = 'medium',
    className,
    loading = false,
    loadingDisabled = true,
    loadingSize = 16,
    disabled = false,
    ...rest
  } = props

  const isOnlyIcon = !children && icon

  const btnDisabled = disabled || (loading && loadingDisabled)

  const _type = useMemo(() => {
    if (isOnlyIcon) {
      if (!type) return 'icon'
      const iconMap = new Map<ButtonType, ButtonType>([
        ['primary', 'iconPrimary'],
        ['simplicity', 'iconSimplicity'],
      ])
      return iconMap.get(type) || type
    } else {
      return type || 'default'
    }
  }, [isOnlyIcon, type])

  const btnClass = classNames(TypeClassMap[_type], SizeClassMap[size], styles.btn, className, {
    [styles.loading]: loading,
  })

  return (
    <Component
      ref={ref}
      type={buttonType}
      data-button-type={_type}
      disabled={btnDisabled}
      className={btnClass}
      {...rest}
    >
      {loading ? <LoadingIcon className={styles.iconLoading} size={loadingSize} /> : icon}
      {children && (typeof children === 'string' ? <span>{children}</span> : children)}
    </Component>
  )
})
