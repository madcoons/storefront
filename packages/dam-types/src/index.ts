// Mirrors DTOs from the DAM backend.
// Source: /Users/Apple/RiderProjects/dam/src/Shared/Shared.Contracts/Store/

export interface UserStoreSocialLinks {
  instagram: string | null
  tiktok: string | null
  facebook: string | null
  x: string | null
}

export interface UserStoreContactAddress {
  street: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  country: string | null
}

export interface UserStoreLayoutConfig {
  contentWidth: string | null
  bannerStoredFileId: string | null
  bannerHeadline: string | null
  bannerSubtitle: string | null
  bannerTextAlign: string | null
  aboutText: string | null
  accentColor: string | null
  socialLinks: UserStoreSocialLinks | null
  contactEmail: string | null
  contactPhone: string | null
  contactAddress: UserStoreContactAddress | null
  announcementText: string | null
  announcementEnabled: boolean
  fontFamily: string | null
}

export interface PublicUserStoreDto {
  slug: string
  name: string
  description: string | null
  logoStoredFileId: string | null
  stripeExpressFullySetup: boolean
  templateCode: string
  layoutConfig: UserStoreLayoutConfig | null
  termsOfService: string | null
  sellerAgreement: string | null
  privacyPolicy: string | null
  refundPolicy: string | null
  primaryCustomDomainHostname: string | null
}
