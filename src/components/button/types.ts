import { ButtonHTMLAttributes, ElementType, ReactElement } from 'react'

export type ButtonType =
  | 'default'
  | 'primary'
  | 'simplicity'
  | 'gray'
  | 'alert'
  | 'icon'
  | 'iconSimplicity'
  | 'iconPrimary'
  | 'danger'

export type ButtonSize = 'mini' | 'small' | 'medium' | 'large'

type ButtonPropsType = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

export interface ButtonProps extends ButtonPropsType {
  /**
   * 强行调整元素类型，会导致丢失和button相关的api及类型注解，正常情况应该不需要用
   */
  elementType?: ElementType
  icon?: ReactElement
  type?: ButtonType
  buttonType?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  size?: ButtonSize
  text?: string
  loading?: boolean
  loadingDisabled?: boolean
  loadingSize?: number
}
