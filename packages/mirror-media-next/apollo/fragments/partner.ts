import { graphql } from '../__generated__/content'

export type PasswordState = {
  isSet: boolean
}

export type User = {
  id: string
  name: string
  email: string
  password: PasswordState
  role: string
  isProtected: boolean
}

export type GenericPartner = {
  id: string
  slug: string
  name: string
  showOnIndex: boolean
  website: string
  public: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  showThumb?: boolean // Whether external posts show their thumbnail
  showBrief?: boolean // Whether external posts show their brief
}

export type Partner = Pick<
  GenericPartner,
  'id' | 'slug' | 'name' | 'showOnIndex'
> &
  Partial<Pick<GenericPartner, 'showThumb' | 'showBrief'>>

export const partner = graphql(`
  fragment partner on Partner {
    id
    slug
    name
    showOnIndex
  }
`)
