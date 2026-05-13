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

export interface StorePublicationDto {
  id: number
  metaValues: string
  isDigital: boolean
  createdAt: string
  imageUuid: string | null
}

export interface PublicationMeta {
  title: string
  description: string
  price: number
  minPrice: number
  maxPrice: number
  quantity: number
  tags: string[]
  primaryFile: { type: string; uuid: string } | null
  isSelfFulfilling: boolean
}

export interface PaginatedResult<T> {
  pageIndex: number
  totalPages: number
  totalItems: number
  pageSize: number
  items: T[]
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PublicationDetailDto {
  id: number
  metaValues: string
  isDigital: boolean
  createdAt: string
  visibleAttributeCodes: string[]
  options: PublicationOptionDto[]
  files: PublicationFileDto[]
  items: PublicationVariantDto[]
}

export interface PublicationOptionDto {
  name: string
  code: string
}

export interface PublicationFileDto {
  id: number
  uuid: string
  name: string
}

export interface PublicationVariantDto {
  id: number
  podProductVariantId: number | null
  podProductPartnerId: number | null
  attributeValues: string
  optionValues: PublicationOptionValueDto[]
  previewUuid: string | null
  price: number
}

export interface PublicationOptionValueDto {
  code: string
  value: string
  attributeCodes: string[]
}

// Checkout types

export interface CheckoutItemDto {
  variantId: number
  quantity: number
}

export interface StoreShippingAddressDto {
  name: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface CreateStoreCheckoutDto {
  items: CheckoutItemDto[]
  currency: string
  shipping?: StoreShippingAddressDto
  shippingMethod?: string
  buyerEmail?: string
}

export interface StoreCheckoutResultDto {
  clientSecret: string
  publishableKey: string
  taxAmountInCents: number
  totalAmountInCents: number
}

export interface EstimateShippingRequestDto {
  items: CheckoutItemDto[]
  countryCode: string
  shippingMethod: string
}

export interface ProviderShippingEstimateDto {
  partnerId: number
  partnerName: string
  basePrice: number
  additionalItemsCost: number
  itemCount: number
  totalCost: number
  minDeliveryDays: number
  maxDeliveryDays: number
}

export interface ShippingEstimateResultDto {
  providerEstimates: ProviderShippingEstimateDto[]
  totalShippingCost: number
}
