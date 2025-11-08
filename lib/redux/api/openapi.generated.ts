import { api } from "./index";
export const addTagTypes = [
  "auth",
  "marketplace",
  "messaging",
  "reviews",
  "safety",
  "transactions",
  "users",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      authRefreshCreate: build.mutation<
        AuthRefreshCreateApiResponse,
        AuthRefreshCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/auth/refresh/`,
          method: "POST",
          body: queryArg.tokenRefresh,
        }),
        invalidatesTags: ["auth"],
      }),
      marketplaceCampusesList: build.query<
        MarketplaceCampusesListApiResponse,
        MarketplaceCampusesListApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/campuses`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceCampusesRead: build.query<
        MarketplaceCampusesReadApiResponse,
        MarketplaceCampusesReadApiArg
      >({
        query: (queryArg) => ({ url: `/marketplace/campuses/${queryArg.id}` }),
        providesTags: ["marketplace"],
      }),
      marketplaceCategoriesList: build.query<
        MarketplaceCategoriesListApiResponse,
        MarketplaceCategoriesListApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/categories`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceCategoriesRead: build.query<
        MarketplaceCategoriesReadApiResponse,
        MarketplaceCategoriesReadApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/categories/${queryArg.slug}`,
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceCategoriesSubcategories: build.query<
        MarketplaceCategoriesSubcategoriesApiResponse,
        MarketplaceCategoriesSubcategoriesApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/categories/${queryArg.slug}/subcategories`,
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceListingsList: build.query<
        MarketplaceListingsListApiResponse,
        MarketplaceListingsListApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings`,
          params: {
            category: queryArg.category,
            campus: queryArg.campus,
            condition: queryArg.condition,
            status: queryArg.status,
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceListingsCreate: build.mutation<
        MarketplaceListingsCreateApiResponse,
        MarketplaceListingsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings`,
          method: "POST",
          body: queryArg.listingCreate,
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceListingsMyListings: build.query<
        MarketplaceListingsMyListingsApiResponse,
        MarketplaceListingsMyListingsApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings/my_listings`,
          params: {
            category: queryArg.category,
            campus: queryArg.campus,
            condition: queryArg.condition,
            status: queryArg.status,
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceListingsRead: build.query<
        MarketplaceListingsReadApiResponse,
        MarketplaceListingsReadApiArg
      >({
        query: (queryArg) => ({ url: `/marketplace/listings/${queryArg.id}` }),
        providesTags: ["marketplace"],
      }),
      marketplaceListingsUpdate: build.mutation<
        MarketplaceListingsUpdateApiResponse,
        MarketplaceListingsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings/${queryArg.id}`,
          method: "PUT",
          body: queryArg.listing,
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceListingsPartialUpdate: build.mutation<
        MarketplaceListingsPartialUpdateApiResponse,
        MarketplaceListingsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.listing,
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceListingsDelete: build.mutation<
        MarketplaceListingsDeleteApiResponse,
        MarketplaceListingsDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceListingsMarkSold: build.mutation<
        MarketplaceListingsMarkSoldApiResponse,
        MarketplaceListingsMarkSoldApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/listings/${queryArg.id}/mark_sold`,
          method: "POST",
          body: queryArg.listing,
        }),
        invalidatesTags: ["marketplace"],
      }),
      getMarketplaceSavedSearches: build.query<
        GetMarketplaceSavedSearchesApiResponse,
        GetMarketplaceSavedSearchesApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/saved-searches`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["marketplace"],
      }),
      postMarketplaceSavedSearches: build.mutation<
        PostMarketplaceSavedSearchesApiResponse,
        PostMarketplaceSavedSearchesApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/saved-searches`,
          method: "POST",
          body: queryArg.savedSearch,
        }),
        invalidatesTags: ["marketplace"],
      }),
      getMarketplaceSavedSearchesById: build.query<
        GetMarketplaceSavedSearchesByIdApiResponse,
        GetMarketplaceSavedSearchesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/saved-searches/${queryArg.id}`,
        }),
        providesTags: ["marketplace"],
      }),
      putMarketplaceSavedSearchesById: build.mutation<
        PutMarketplaceSavedSearchesByIdApiResponse,
        PutMarketplaceSavedSearchesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/saved-searches/${queryArg.id}`,
          method: "PUT",
          body: queryArg.savedSearch,
        }),
        invalidatesTags: ["marketplace"],
      }),
      patchMarketplaceSavedSearchesById: build.mutation<
        PatchMarketplaceSavedSearchesByIdApiResponse,
        PatchMarketplaceSavedSearchesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/saved-searches/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.savedSearch,
        }),
        invalidatesTags: ["marketplace"],
      }),
      deleteMarketplaceSavedSearchesById: build.mutation<
        DeleteMarketplaceSavedSearchesByIdApiResponse,
        DeleteMarketplaceSavedSearchesByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/saved-searches/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceWishlistList: build.query<
        MarketplaceWishlistListApiResponse,
        MarketplaceWishlistListApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/wishlist`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["marketplace"],
      }),
      marketplaceWishlistCreate: build.mutation<
        MarketplaceWishlistCreateApiResponse,
        MarketplaceWishlistCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/wishlist`,
          method: "POST",
          body: queryArg.wishlist,
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceWishlistRead: build.query<
        MarketplaceWishlistReadApiResponse,
        MarketplaceWishlistReadApiArg
      >({
        query: (queryArg) => ({ url: `/marketplace/wishlist/${queryArg.id}` }),
        providesTags: ["marketplace"],
      }),
      marketplaceWishlistUpdate: build.mutation<
        MarketplaceWishlistUpdateApiResponse,
        MarketplaceWishlistUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/wishlist/${queryArg.id}`,
          method: "PUT",
          body: queryArg.wishlist,
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceWishlistPartialUpdate: build.mutation<
        MarketplaceWishlistPartialUpdateApiResponse,
        MarketplaceWishlistPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/wishlist/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.wishlist,
        }),
        invalidatesTags: ["marketplace"],
      }),
      marketplaceWishlistDelete: build.mutation<
        MarketplaceWishlistDeleteApiResponse,
        MarketplaceWishlistDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/marketplace/wishlist/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["marketplace"],
      }),
      messagingConversationsList: build.query<
        MessagingConversationsListApiResponse,
        MessagingConversationsListApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/conversations`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["messaging"],
      }),
      messagingConversationsRead: build.query<
        MessagingConversationsReadApiResponse,
        MessagingConversationsReadApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/conversations/${queryArg.id}`,
        }),
        providesTags: ["messaging"],
      }),
      messagingConversationsMessages: build.query<
        MessagingConversationsMessagesApiResponse,
        MessagingConversationsMessagesApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/conversations/${queryArg.id}/messages`,
        }),
        providesTags: ["messaging"],
      }),
      messagingMessagesList: build.query<
        MessagingMessagesListApiResponse,
        MessagingMessagesListApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/messages`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["messaging"],
      }),
      messagingMessagesCreate: build.mutation<
        MessagingMessagesCreateApiResponse,
        MessagingMessagesCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/messages`,
          method: "POST",
          body: queryArg.messageCreate,
        }),
        invalidatesTags: ["messaging"],
      }),
      messagingMessagesUnreadCount: build.query<
        MessagingMessagesUnreadCountApiResponse,
        MessagingMessagesUnreadCountApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/messages/unread_count`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["messaging"],
      }),
      messagingMessagesRead: build.query<
        MessagingMessagesReadApiResponse,
        MessagingMessagesReadApiArg
      >({
        query: (queryArg) => ({ url: `/messaging/messages/${queryArg.id}` }),
        providesTags: ["messaging"],
      }),
      messagingMessagesUpdate: build.mutation<
        MessagingMessagesUpdateApiResponse,
        MessagingMessagesUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/messages/${queryArg.id}`,
          method: "PUT",
          body: queryArg.message,
        }),
        invalidatesTags: ["messaging"],
      }),
      messagingMessagesPartialUpdate: build.mutation<
        MessagingMessagesPartialUpdateApiResponse,
        MessagingMessagesPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/messages/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.message,
        }),
        invalidatesTags: ["messaging"],
      }),
      messagingMessagesDelete: build.mutation<
        MessagingMessagesDeleteApiResponse,
        MessagingMessagesDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/messaging/messages/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["messaging"],
      }),
      reviewsList: build.query<ReviewsListApiResponse, ReviewsListApiArg>({
        query: (queryArg) => ({
          url: `/reviews/`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["reviews"],
      }),
      reviewsCreate: build.mutation<
        ReviewsCreateApiResponse,
        ReviewsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/reviews/`,
          method: "POST",
          body: queryArg.review,
        }),
        invalidatesTags: ["reviews"],
      }),
      reviewsGivenReviews: build.query<
        ReviewsGivenReviewsApiResponse,
        ReviewsGivenReviewsApiArg
      >({
        query: (queryArg) => ({
          url: `/reviews/given_reviews`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["reviews"],
      }),
      reviewsMyReviews: build.query<
        ReviewsMyReviewsApiResponse,
        ReviewsMyReviewsApiArg
      >({
        query: (queryArg) => ({
          url: `/reviews/my_reviews`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["reviews"],
      }),
      reviewsRead: build.query<ReviewsReadApiResponse, ReviewsReadApiArg>({
        query: (queryArg) => ({ url: `/reviews/${queryArg.id}` }),
        providesTags: ["reviews"],
      }),
      reviewsUpdate: build.mutation<
        ReviewsUpdateApiResponse,
        ReviewsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/reviews/${queryArg.id}`,
          method: "PUT",
          body: queryArg.review,
        }),
        invalidatesTags: ["reviews"],
      }),
      reviewsPartialUpdate: build.mutation<
        ReviewsPartialUpdateApiResponse,
        ReviewsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/reviews/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.review,
        }),
        invalidatesTags: ["reviews"],
      }),
      reviewsDelete: build.mutation<
        ReviewsDeleteApiResponse,
        ReviewsDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/reviews/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["reviews"],
      }),
      getSafetyFlaggedContent: build.query<
        GetSafetyFlaggedContentApiResponse,
        GetSafetyFlaggedContentApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/flagged-content`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["safety"],
      }),
      postSafetyFlaggedContent: build.mutation<
        PostSafetyFlaggedContentApiResponse,
        PostSafetyFlaggedContentApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/flagged-content`,
          method: "POST",
          body: queryArg.flaggedContent,
        }),
        invalidatesTags: ["safety"],
      }),
      getSafetyFlaggedContentById: build.query<
        GetSafetyFlaggedContentByIdApiResponse,
        GetSafetyFlaggedContentByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/flagged-content/${queryArg.id}`,
        }),
        providesTags: ["safety"],
      }),
      putSafetyFlaggedContentById: build.mutation<
        PutSafetyFlaggedContentByIdApiResponse,
        PutSafetyFlaggedContentByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/flagged-content/${queryArg.id}`,
          method: "PUT",
          body: queryArg.flaggedContent,
        }),
        invalidatesTags: ["safety"],
      }),
      patchSafetyFlaggedContentById: build.mutation<
        PatchSafetyFlaggedContentByIdApiResponse,
        PatchSafetyFlaggedContentByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/flagged-content/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.flaggedContent,
        }),
        invalidatesTags: ["safety"],
      }),
      deleteSafetyFlaggedContentById: build.mutation<
        DeleteSafetyFlaggedContentByIdApiResponse,
        DeleteSafetyFlaggedContentByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/flagged-content/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["safety"],
      }),
      safetyNotificationsList: build.query<
        SafetyNotificationsListApiResponse,
        SafetyNotificationsListApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/notifications`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["safety"],
      }),
      safetyNotificationsMarkAllRead: build.mutation<
        SafetyNotificationsMarkAllReadApiResponse,
        SafetyNotificationsMarkAllReadApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/notifications/mark_all_read`,
          method: "POST",
          body: queryArg.notification,
        }),
        invalidatesTags: ["safety"],
      }),
      safetyNotificationsUnreadCount: build.query<
        SafetyNotificationsUnreadCountApiResponse,
        SafetyNotificationsUnreadCountApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/notifications/unread_count`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["safety"],
      }),
      safetyNotificationsRead: build.query<
        SafetyNotificationsReadApiResponse,
        SafetyNotificationsReadApiArg
      >({
        query: (queryArg) => ({ url: `/safety/notifications/${queryArg.id}` }),
        providesTags: ["safety"],
      }),
      safetyNotificationsMarkRead: build.mutation<
        SafetyNotificationsMarkReadApiResponse,
        SafetyNotificationsMarkReadApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/notifications/${queryArg.id}/mark_read`,
          method: "POST",
          body: queryArg.notification,
        }),
        invalidatesTags: ["safety"],
      }),
      getSafetyStudyMaterials: build.query<
        GetSafetyStudyMaterialsApiResponse,
        GetSafetyStudyMaterialsApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["safety"],
      }),
      postSafetyStudyMaterials: build.mutation<
        PostSafetyStudyMaterialsApiResponse,
        PostSafetyStudyMaterialsApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials`,
          method: "POST",
          body: queryArg.studyMaterial,
        }),
        invalidatesTags: ["safety"],
      }),
      getSafetyStudyMaterialsById: build.query<
        GetSafetyStudyMaterialsByIdApiResponse,
        GetSafetyStudyMaterialsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials/${queryArg.id}`,
        }),
        providesTags: ["safety"],
      }),
      putSafetyStudyMaterialsById: build.mutation<
        PutSafetyStudyMaterialsByIdApiResponse,
        PutSafetyStudyMaterialsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials/${queryArg.id}`,
          method: "PUT",
          body: queryArg.studyMaterial,
        }),
        invalidatesTags: ["safety"],
      }),
      patchSafetyStudyMaterialsById: build.mutation<
        PatchSafetyStudyMaterialsByIdApiResponse,
        PatchSafetyStudyMaterialsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.studyMaterial,
        }),
        invalidatesTags: ["safety"],
      }),
      deleteSafetyStudyMaterialsById: build.mutation<
        DeleteSafetyStudyMaterialsByIdApiResponse,
        DeleteSafetyStudyMaterialsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["safety"],
      }),
      postSafetyStudyMaterialsByIdDownload: build.mutation<
        PostSafetyStudyMaterialsByIdDownloadApiResponse,
        PostSafetyStudyMaterialsByIdDownloadApiArg
      >({
        query: (queryArg) => ({
          url: `/safety/study-materials/${queryArg.id}/download`,
          method: "POST",
          body: queryArg.studyMaterial,
        }),
        invalidatesTags: ["safety"],
      }),
      getTransactionsMeetingLocations: build.query<
        GetTransactionsMeetingLocationsApiResponse,
        GetTransactionsMeetingLocationsApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/meeting-locations`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      getTransactionsMeetingLocationsById: build.query<
        GetTransactionsMeetingLocationsByIdApiResponse,
        GetTransactionsMeetingLocationsByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/meeting-locations/${queryArg.id}`,
        }),
        providesTags: ["transactions"],
      }),
      transactionsOffersList: build.query<
        TransactionsOffersListApiResponse,
        TransactionsOffersListApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      transactionsOffersCreate: build.mutation<
        TransactionsOffersCreateApiResponse,
        TransactionsOffersCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers`,
          method: "POST",
          body: queryArg.offer,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsOffersReceived: build.query<
        TransactionsOffersReceivedApiResponse,
        TransactionsOffersReceivedApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/received`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      transactionsOffersSent: build.query<
        TransactionsOffersSentApiResponse,
        TransactionsOffersSentApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/sent`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      transactionsOffersRead: build.query<
        TransactionsOffersReadApiResponse,
        TransactionsOffersReadApiArg
      >({
        query: (queryArg) => ({ url: `/transactions/offers/${queryArg.id}` }),
        providesTags: ["transactions"],
      }),
      transactionsOffersUpdate: build.mutation<
        TransactionsOffersUpdateApiResponse,
        TransactionsOffersUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/${queryArg.id}`,
          method: "PUT",
          body: queryArg.offer,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsOffersPartialUpdate: build.mutation<
        TransactionsOffersPartialUpdateApiResponse,
        TransactionsOffersPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.offer,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsOffersDelete: build.mutation<
        TransactionsOffersDeleteApiResponse,
        TransactionsOffersDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsOffersAccept: build.mutation<
        TransactionsOffersAcceptApiResponse,
        TransactionsOffersAcceptApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/${queryArg.id}/accept`,
          method: "POST",
          body: queryArg.offer,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsOffersCounter: build.mutation<
        TransactionsOffersCounterApiResponse,
        TransactionsOffersCounterApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/${queryArg.id}/counter`,
          method: "POST",
          body: queryArg.offer,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsOffersReject: build.mutation<
        TransactionsOffersRejectApiResponse,
        TransactionsOffersRejectApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/offers/${queryArg.id}/reject`,
          method: "POST",
          body: queryArg.offer,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsTransactionsList: build.query<
        TransactionsTransactionsListApiResponse,
        TransactionsTransactionsListApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      transactionsTransactionsCreate: build.mutation<
        TransactionsTransactionsCreateApiResponse,
        TransactionsTransactionsCreateApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions`,
          method: "POST",
          body: queryArg.transaction,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsTransactionsPurchases: build.query<
        TransactionsTransactionsPurchasesApiResponse,
        TransactionsTransactionsPurchasesApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/purchases`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      transactionsTransactionsSales: build.query<
        TransactionsTransactionsSalesApiResponse,
        TransactionsTransactionsSalesApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/sales`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["transactions"],
      }),
      transactionsTransactionsRead: build.query<
        TransactionsTransactionsReadApiResponse,
        TransactionsTransactionsReadApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/${queryArg.id}`,
        }),
        providesTags: ["transactions"],
      }),
      transactionsTransactionsUpdate: build.mutation<
        TransactionsTransactionsUpdateApiResponse,
        TransactionsTransactionsUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/${queryArg.id}`,
          method: "PUT",
          body: queryArg.transaction,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsTransactionsPartialUpdate: build.mutation<
        TransactionsTransactionsPartialUpdateApiResponse,
        TransactionsTransactionsPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.transaction,
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsTransactionsDelete: build.mutation<
        TransactionsTransactionsDeleteApiResponse,
        TransactionsTransactionsDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["transactions"],
      }),
      transactionsTransactionsComplete: build.mutation<
        TransactionsTransactionsCompleteApiResponse,
        TransactionsTransactionsCompleteApiArg
      >({
        query: (queryArg) => ({
          url: `/transactions/transactions/${queryArg.id}/complete`,
          method: "POST",
          body: queryArg.transaction,
        }),
        invalidatesTags: ["transactions"],
      }),
      usersList: build.query<UsersListApiResponse, UsersListApiArg>({
        query: (queryArg) => ({
          url: `/users/`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["users"],
      }),
      usersCreate: build.mutation<UsersCreateApiResponse, UsersCreateApiArg>({
        query: (queryArg) => ({
          url: `/users/`,
          method: "POST",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersLogin: build.mutation<UsersLoginApiResponse, UsersLoginApiArg>({
        query: (queryArg) => ({
          url: `/users/login`,
          method: "POST",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersMe: build.query<UsersMeApiResponse, UsersMeApiArg>({
        query: (queryArg) => ({
          url: `/users/me`,
          params: {
            search: queryArg.search,
            ordering: queryArg.ordering,
            page: queryArg.page,
          },
        }),
        providesTags: ["users"],
      }),
      usersRegister: build.mutation<
        UsersRegisterApiResponse,
        UsersRegisterApiArg
      >({
        query: (queryArg) => ({
          url: `/users/register`,
          method: "POST",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersUpdateProfileUpdate: build.mutation<
        UsersUpdateProfileUpdateApiResponse,
        UsersUpdateProfileUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/users/update_profile`,
          method: "PUT",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersUpdateProfilePartialUpdate: build.mutation<
        UsersUpdateProfilePartialUpdateApiResponse,
        UsersUpdateProfilePartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/users/update_profile`,
          method: "PATCH",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersRead: build.query<UsersReadApiResponse, UsersReadApiArg>({
        query: (queryArg) => ({ url: `/users/${queryArg.id}` }),
        providesTags: ["users"],
      }),
      usersUpdate: build.mutation<UsersUpdateApiResponse, UsersUpdateApiArg>({
        query: (queryArg) => ({
          url: `/users/${queryArg.id}`,
          method: "PUT",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersPartialUpdate: build.mutation<
        UsersPartialUpdateApiResponse,
        UsersPartialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/users/${queryArg.id}`,
          method: "PATCH",
          body: queryArg.user,
        }),
        invalidatesTags: ["users"],
      }),
      usersDelete: build.mutation<UsersDeleteApiResponse, UsersDeleteApiArg>({
        query: (queryArg) => ({
          url: `/users/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["users"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as api };
export type AuthRefreshCreateApiResponse = /** status 201  */ TokenRefreshRead;
export type AuthRefreshCreateApiArg = {
  tokenRefresh: TokenRefresh;
};
export type MarketplaceCampusesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: MarketplaceCampusRead[];
};
export type MarketplaceCampusesListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MarketplaceCampusesReadApiResponse =
  /** status 200  */ MarketplaceCampusRead;
export type MarketplaceCampusesReadApiArg = {
  /** A UUID string identifying this campus. */
  id: string;
};
export type MarketplaceCategoriesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: CategoryRead[];
};
export type MarketplaceCategoriesListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MarketplaceCategoriesReadApiResponse =
  /** status 200  */ CategoryRead;
export type MarketplaceCategoriesReadApiArg = {
  slug: string;
};
export type MarketplaceCategoriesSubcategoriesApiResponse =
  /** status 200  */ CategoryRead;
export type MarketplaceCategoriesSubcategoriesApiArg = {
  slug: string;
};
export type MarketplaceListingsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ListingListRead[];
};
export type MarketplaceListingsListApiArg = {
  category?: string;
  campus?: string;
  condition?: string;
  status?: string;
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MarketplaceListingsCreateApiResponse =
  /** status 201  */ ListingCreateRead;
export type MarketplaceListingsCreateApiArg = {
  listingCreate: ListingCreate;
};
export type MarketplaceListingsMyListingsApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ListingRead[];
};
export type MarketplaceListingsMyListingsApiArg = {
  category?: string;
  campus?: string;
  condition?: string;
  status?: string;
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MarketplaceListingsReadApiResponse = /** status 200  */ ListingRead;
export type MarketplaceListingsReadApiArg = {
  /** A UUID string identifying this listing. */
  id: string;
};
export type MarketplaceListingsUpdateApiResponse =
  /** status 200  */ ListingRead;
export type MarketplaceListingsUpdateApiArg = {
  /** A UUID string identifying this listing. */
  id: string;
  listing: Listing;
};
export type MarketplaceListingsPartialUpdateApiResponse =
  /** status 200  */ ListingRead;
export type MarketplaceListingsPartialUpdateApiArg = {
  /** A UUID string identifying this listing. */
  id: string;
  listing: Listing;
};
export type MarketplaceListingsDeleteApiResponse = unknown;
export type MarketplaceListingsDeleteApiArg = {
  /** A UUID string identifying this listing. */
  id: string;
};
export type MarketplaceListingsMarkSoldApiResponse =
  /** status 201  */ ListingRead;
export type MarketplaceListingsMarkSoldApiArg = {
  /** A UUID string identifying this listing. */
  id: string;
  listing: Listing;
};
export type GetMarketplaceSavedSearchesApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: SavedSearchRead[];
};
export type GetMarketplaceSavedSearchesApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type PostMarketplaceSavedSearchesApiResponse =
  /** status 201  */ SavedSearchRead;
export type PostMarketplaceSavedSearchesApiArg = {
  savedSearch: SavedSearch;
};
export type GetMarketplaceSavedSearchesByIdApiResponse =
  /** status 200  */ SavedSearchRead;
export type GetMarketplaceSavedSearchesByIdApiArg = {
  id: string;
};
export type PutMarketplaceSavedSearchesByIdApiResponse =
  /** status 200  */ SavedSearchRead;
export type PutMarketplaceSavedSearchesByIdApiArg = {
  id: string;
  savedSearch: SavedSearch;
};
export type PatchMarketplaceSavedSearchesByIdApiResponse =
  /** status 200  */ SavedSearchRead;
export type PatchMarketplaceSavedSearchesByIdApiArg = {
  id: string;
  savedSearch: SavedSearch;
};
export type DeleteMarketplaceSavedSearchesByIdApiResponse = unknown;
export type DeleteMarketplaceSavedSearchesByIdApiArg = {
  id: string;
};
export type MarketplaceWishlistListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: WishlistRead[];
};
export type MarketplaceWishlistListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MarketplaceWishlistCreateApiResponse =
  /** status 201  */ WishlistRead;
export type MarketplaceWishlistCreateApiArg = {
  wishlist: Wishlist;
};
export type MarketplaceWishlistReadApiResponse =
  /** status 200  */ WishlistRead;
export type MarketplaceWishlistReadApiArg = {
  id: string;
};
export type MarketplaceWishlistUpdateApiResponse =
  /** status 200  */ WishlistRead;
export type MarketplaceWishlistUpdateApiArg = {
  id: string;
  wishlist: Wishlist;
};
export type MarketplaceWishlistPartialUpdateApiResponse =
  /** status 200  */ WishlistRead;
export type MarketplaceWishlistPartialUpdateApiArg = {
  id: string;
  wishlist: Wishlist;
};
export type MarketplaceWishlistDeleteApiResponse = unknown;
export type MarketplaceWishlistDeleteApiArg = {
  id: string;
};
export type MessagingConversationsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ConversationRead[];
};
export type MessagingConversationsListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MessagingConversationsReadApiResponse =
  /** status 200  */ ConversationRead;
export type MessagingConversationsReadApiArg = {
  id: string;
};
export type MessagingConversationsMessagesApiResponse =
  /** status 200  */ ConversationRead;
export type MessagingConversationsMessagesApiArg = {
  id: string;
};
export type MessagingMessagesListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: MessageRead[];
};
export type MessagingMessagesListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MessagingMessagesCreateApiResponse =
  /** status 201  */ MessageCreate;
export type MessagingMessagesCreateApiArg = {
  messageCreate: MessageCreate;
};
export type MessagingMessagesUnreadCountApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: MessageRead[];
};
export type MessagingMessagesUnreadCountApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type MessagingMessagesReadApiResponse = /** status 200  */ MessageRead;
export type MessagingMessagesReadApiArg = {
  id: string;
};
export type MessagingMessagesUpdateApiResponse = /** status 200  */ MessageRead;
export type MessagingMessagesUpdateApiArg = {
  id: string;
  message: Message;
};
export type MessagingMessagesPartialUpdateApiResponse =
  /** status 200  */ MessageRead;
export type MessagingMessagesPartialUpdateApiArg = {
  id: string;
  message: Message;
};
export type MessagingMessagesDeleteApiResponse = unknown;
export type MessagingMessagesDeleteApiArg = {
  id: string;
};
export type ReviewsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ReviewRead[];
};
export type ReviewsListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ReviewsCreateApiResponse = /** status 201  */ ReviewRead;
export type ReviewsCreateApiArg = {
  review: Review;
};
export type ReviewsGivenReviewsApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ReviewRead[];
};
export type ReviewsGivenReviewsApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ReviewsMyReviewsApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ReviewRead[];
};
export type ReviewsMyReviewsApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type ReviewsReadApiResponse = /** status 200  */ ReviewRead;
export type ReviewsReadApiArg = {
  id: string;
};
export type ReviewsUpdateApiResponse = /** status 200  */ ReviewRead;
export type ReviewsUpdateApiArg = {
  id: string;
  review: Review;
};
export type ReviewsPartialUpdateApiResponse = /** status 200  */ ReviewRead;
export type ReviewsPartialUpdateApiArg = {
  id: string;
  review: Review;
};
export type ReviewsDeleteApiResponse = unknown;
export type ReviewsDeleteApiArg = {
  id: string;
};
export type GetSafetyFlaggedContentApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: FlaggedContentRead[];
};
export type GetSafetyFlaggedContentApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type PostSafetyFlaggedContentApiResponse =
  /** status 201  */ FlaggedContentRead;
export type PostSafetyFlaggedContentApiArg = {
  flaggedContent: FlaggedContent;
};
export type GetSafetyFlaggedContentByIdApiResponse =
  /** status 200  */ FlaggedContentRead;
export type GetSafetyFlaggedContentByIdApiArg = {
  id: string;
};
export type PutSafetyFlaggedContentByIdApiResponse =
  /** status 200  */ FlaggedContentRead;
export type PutSafetyFlaggedContentByIdApiArg = {
  id: string;
  flaggedContent: FlaggedContent;
};
export type PatchSafetyFlaggedContentByIdApiResponse =
  /** status 200  */ FlaggedContentRead;
export type PatchSafetyFlaggedContentByIdApiArg = {
  id: string;
  flaggedContent: FlaggedContent;
};
export type DeleteSafetyFlaggedContentByIdApiResponse = unknown;
export type DeleteSafetyFlaggedContentByIdApiArg = {
  id: string;
};
export type SafetyNotificationsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: NotificationRead[];
};
export type SafetyNotificationsListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type SafetyNotificationsMarkAllReadApiResponse =
  /** status 201  */ NotificationRead;
export type SafetyNotificationsMarkAllReadApiArg = {
  notification: Notification;
};
export type SafetyNotificationsUnreadCountApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: NotificationRead[];
};
export type SafetyNotificationsUnreadCountApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type SafetyNotificationsReadApiResponse =
  /** status 200  */ NotificationRead;
export type SafetyNotificationsReadApiArg = {
  id: string;
};
export type SafetyNotificationsMarkReadApiResponse =
  /** status 201  */ NotificationRead;
export type SafetyNotificationsMarkReadApiArg = {
  id: string;
  notification: Notification;
};
export type GetSafetyStudyMaterialsApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: StudyMaterialRead[];
};
export type GetSafetyStudyMaterialsApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type PostSafetyStudyMaterialsApiResponse =
  /** status 201  */ StudyMaterialRead;
export type PostSafetyStudyMaterialsApiArg = {
  studyMaterial: StudyMaterial;
};
export type GetSafetyStudyMaterialsByIdApiResponse =
  /** status 200  */ StudyMaterialRead;
export type GetSafetyStudyMaterialsByIdApiArg = {
  id: string;
};
export type PutSafetyStudyMaterialsByIdApiResponse =
  /** status 200  */ StudyMaterialRead;
export type PutSafetyStudyMaterialsByIdApiArg = {
  id: string;
  studyMaterial: StudyMaterial;
};
export type PatchSafetyStudyMaterialsByIdApiResponse =
  /** status 200  */ StudyMaterialRead;
export type PatchSafetyStudyMaterialsByIdApiArg = {
  id: string;
  studyMaterial: StudyMaterial;
};
export type DeleteSafetyStudyMaterialsByIdApiResponse = unknown;
export type DeleteSafetyStudyMaterialsByIdApiArg = {
  id: string;
};
export type PostSafetyStudyMaterialsByIdDownloadApiResponse =
  /** status 201  */ StudyMaterialRead;
export type PostSafetyStudyMaterialsByIdDownloadApiArg = {
  id: string;
  studyMaterial: StudyMaterial;
};
export type GetTransactionsMeetingLocationsApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: MeetingLocationRead[];
};
export type GetTransactionsMeetingLocationsApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type GetTransactionsMeetingLocationsByIdApiResponse =
  /** status 200  */ MeetingLocationRead;
export type GetTransactionsMeetingLocationsByIdApiArg = {
  id: string;
};
export type TransactionsOffersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: OfferRead[];
};
export type TransactionsOffersListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type TransactionsOffersCreateApiResponse = /** status 201  */ OfferRead;
export type TransactionsOffersCreateApiArg = {
  offer: Offer;
};
export type TransactionsOffersReceivedApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: OfferRead[];
};
export type TransactionsOffersReceivedApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type TransactionsOffersSentApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: OfferRead[];
};
export type TransactionsOffersSentApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type TransactionsOffersReadApiResponse = /** status 200  */ OfferRead;
export type TransactionsOffersReadApiArg = {
  id: string;
};
export type TransactionsOffersUpdateApiResponse = /** status 200  */ OfferRead;
export type TransactionsOffersUpdateApiArg = {
  id: string;
  offer: Offer;
};
export type TransactionsOffersPartialUpdateApiResponse =
  /** status 200  */ OfferRead;
export type TransactionsOffersPartialUpdateApiArg = {
  id: string;
  offer: Offer;
};
export type TransactionsOffersDeleteApiResponse = unknown;
export type TransactionsOffersDeleteApiArg = {
  id: string;
};
export type TransactionsOffersAcceptApiResponse = /** status 201  */ OfferRead;
export type TransactionsOffersAcceptApiArg = {
  id: string;
  offer: Offer;
};
export type TransactionsOffersCounterApiResponse = /** status 201  */ OfferRead;
export type TransactionsOffersCounterApiArg = {
  id: string;
  offer: Offer;
};
export type TransactionsOffersRejectApiResponse = /** status 201  */ OfferRead;
export type TransactionsOffersRejectApiArg = {
  id: string;
  offer: Offer;
};
export type TransactionsTransactionsListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: TransactionRead[];
};
export type TransactionsTransactionsListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type TransactionsTransactionsCreateApiResponse =
  /** status 201  */ TransactionRead;
export type TransactionsTransactionsCreateApiArg = {
  transaction: Transaction;
};
export type TransactionsTransactionsPurchasesApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: TransactionRead[];
};
export type TransactionsTransactionsPurchasesApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type TransactionsTransactionsSalesApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: TransactionRead[];
};
export type TransactionsTransactionsSalesApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type TransactionsTransactionsReadApiResponse =
  /** status 200  */ TransactionRead;
export type TransactionsTransactionsReadApiArg = {
  id: string;
};
export type TransactionsTransactionsUpdateApiResponse =
  /** status 200  */ TransactionRead;
export type TransactionsTransactionsUpdateApiArg = {
  id: string;
  transaction: Transaction;
};
export type TransactionsTransactionsPartialUpdateApiResponse =
  /** status 200  */ TransactionRead;
export type TransactionsTransactionsPartialUpdateApiArg = {
  id: string;
  transaction: Transaction;
};
export type TransactionsTransactionsDeleteApiResponse = unknown;
export type TransactionsTransactionsDeleteApiArg = {
  id: string;
};
export type TransactionsTransactionsCompleteApiResponse =
  /** status 201  */ TransactionRead;
export type TransactionsTransactionsCompleteApiArg = {
  id: string;
  transaction: Transaction;
};
export type UsersListApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: UserRead[];
};
export type UsersListApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type UsersCreateApiResponse = /** status 201  */ UserRead;
export type UsersCreateApiArg = {
  user: User;
};
export type UsersLoginApiResponse = /** status 201  */ UserRead;
export type UsersLoginApiArg = {
  user: User;
};
export type UsersMeApiResponse = /** status 200  */ {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: UserRead[];
};
export type UsersMeApiArg = {
  /** A search term. */
  search?: string;
  /** Which field to use when ordering the results. */
  ordering?: string;
  /** A page number within the paginated result set. */
  page?: number;
};
export type UsersRegisterApiResponse = /** status 201  */ UserRead;
export type UsersRegisterApiArg = {
  user: User;
};
export type UsersUpdateProfileUpdateApiResponse = /** status 200  */ UserRead;
export type UsersUpdateProfileUpdateApiArg = {
  user: User;
};
export type UsersUpdateProfilePartialUpdateApiResponse =
  /** status 200  */ UserRead;
export type UsersUpdateProfilePartialUpdateApiArg = {
  user: User;
};
export type UsersReadApiResponse = /** status 200  */ UserRead;
export type UsersReadApiArg = {
  /** A UUID string identifying this user. */
  id: string;
};
export type UsersUpdateApiResponse = /** status 200  */ UserRead;
export type UsersUpdateApiArg = {
  /** A UUID string identifying this user. */
  id: string;
  user: User;
};
export type UsersPartialUpdateApiResponse = /** status 200  */ UserRead;
export type UsersPartialUpdateApiArg = {
  /** A UUID string identifying this user. */
  id: string;
  user: User;
};
export type UsersDeleteApiResponse = unknown;
export type UsersDeleteApiArg = {
  /** A UUID string identifying this user. */
  id: string;
};
export type TokenRefresh = {
  refresh: string;
};
export type TokenRefreshRead = {
  refresh: string;
  access?: string;
};
export type MarketplaceCampus = {
  name: string;
  /** e.g., @pfw.edu */
  email_domain: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_active?: boolean;
};
export type MarketplaceCampusRead = {
  id?: string;
  name: string;
  /** e.g., @pfw.edu */
  email_domain: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_active?: boolean;
};
export type Category = {
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  icon_url?: string | null;
  display_order?: number;
  is_active?: boolean;
};
export type CategoryRead = {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | null;
  icon_url?: string | null;
  display_order?: number;
  is_active?: boolean;
  subcategories?: string;
};
export type ListingList = {
  title: string;
  price: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  status?: "active" | "sold" | "expired" | "deleted";
  location?: string;
  created_at?: string;
};
export type ListingListRead = {
  id?: string;
  title: string;
  price: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  status?: "active" | "sold" | "expired" | "deleted";
  location?: string;
  seller?: string;
  primary_image?: string;
  created_at?: string;
};
export type ListingImage = {
  image_url: string;
  display_order?: number;
  is_primary?: boolean;
};
export type ListingImageRead = {
  id?: string;
  image_url: string;
  display_order?: number;
  is_primary?: boolean;
};
export type Textbook = {
  isbn_10?: string;
  isbn_13?: string;
  title: string;
  author?: string;
  edition?: string;
  publisher?: string;
  publication_year?: number | null;
  course_code?: string;
  course_name?: string;
  department?: string;
  is_required?: boolean;
};
export type TextbookRead = {
  id?: string;
  isbn_10?: string;
  isbn_13?: string;
  title: string;
  author?: string;
  edition?: string;
  publisher?: string;
  publication_year?: number | null;
  course_code?: string;
  course_name?: string;
  department?: string;
  is_required?: boolean;
};
export type ListingCreate = {
  title: string;
  description: string;
  price: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  location?: string;
  is_negotiable?: boolean;
  images?: ListingImage[];
  textbook?: Textbook;
};
export type ListingCreateRead = {
  category_id?: string;
  title: string;
  description: string;
  price: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  location?: string;
  is_negotiable?: boolean;
  images?: ListingImageRead[];
  textbook?: TextbookRead;
};
export type Listing = {
  category?: Category;
  category_id: string;
  campus?: MarketplaceCampus;
  campus_id?: string;
  title: string;
  description: string;
  price: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  status?: "active" | "sold" | "expired" | "deleted";
  location?: string;
  is_featured?: boolean;
  is_negotiable?: boolean;
  textbook?: Textbook;
  expires_at?: string | null;
};
export type ListingRead = {
  id?: string;
  seller?: string;
  category?: CategoryRead;
  category_id: string;
  campus?: MarketplaceCampusRead;
  campus_id?: string;
  title: string;
  description: string;
  price: string;
  condition: "new" | "like_new" | "good" | "fair" | "poor";
  status?: "active" | "sold" | "expired" | "deleted";
  location?: string;
  view_count?: number;
  is_featured?: boolean;
  is_negotiable?: boolean;
  images?: ListingImageRead[];
  textbook?: TextbookRead;
  expires_at?: string | null;
  sold_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type SavedSearch = {
  search_name: string;
  search_query?: string;
  category?: Category;
  category_id?: string | null;
  min_price?: string | null;
  max_price?: string | null;
  condition?: string;
  campus?: MarketplaceCampus;
  campus_id?: string | null;
  is_active?: boolean;
  notification_enabled?: boolean;
};
export type SavedSearchRead = {
  id?: string;
  search_name: string;
  search_query?: string;
  category?: CategoryRead;
  category_id?: string | null;
  min_price?: string | null;
  max_price?: string | null;
  condition?: string;
  campus?: MarketplaceCampusRead;
  campus_id?: string | null;
  is_active?: boolean;
  notification_enabled?: boolean;
  created_at?: string;
};
export type Wishlist = {
  listing?: ListingList;
  listing_id: string;
};
export type WishlistRead = {
  id?: string;
  listing?: ListingListRead;
  listing_id: string;
  created_at?: string;
};
export type Conversation = {};
export type ConversationRead = {
  id?: string;
  participant_1?: string;
  participant_2?: string;
  listing?: string;
  last_message?: string;
  unread_count?: string;
  last_message_at?: string | null;
  created_at?: string;
};
export type Message = {
  conversation: string;
  message_text: string;
};
export type MessageRead = {
  id?: string;
  conversation: string;
  sender?: string;
  receiver?: string;
  message_text: string;
  is_read?: boolean;
  created_at?: string;
  read_at?: string | null;
};
export type MessageCreate = {
  message_text: string;
  receiver_id: string;
};
export type UserProfile = {};
export type UserProfileRead = {
  id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string | null;
  campus_name?: string;
  average_rating?: string;
  total_reviews?: number;
  created_at?: string;
};
export type Review = {
  transaction_id: string;
  reviewer?: UserProfile;
  reviewee?: UserProfile;
  reviewee_id: string;
  rating: number;
  review_text?: string;
  /** True if buyer reviewing seller, False if seller reviewing buyer */
  is_buyer_review: boolean;
};
export type ReviewRead = {
  id?: string;
  transaction_id: string;
  reviewer?: UserProfileRead;
  reviewee?: UserProfileRead;
  reviewee_id: string;
  rating: number;
  review_text?: string;
  /** True if buyer reviewing seller, False if seller reviewing buyer */
  is_buyer_review: boolean;
  is_flagged?: boolean;
  created_at?: string;
  updated_at?: string;
};
export type FlaggedContent = {
  content_type: "listing" | "message" | "user" | "review";
  content_id: string;
  reason: "spam" | "offensive" | "scam" | "inappropriate" | "other";
  description?: string;
};
export type FlaggedContentRead = {
  id?: string;
  content_type: "listing" | "message" | "user" | "review";
  content_id: string;
  reason: "spam" | "offensive" | "scam" | "inappropriate" | "other";
  description?: string;
  status?: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at?: string;
};
export type Notification = {
  notification_type:
    | "message"
    | "offer"
    | "status_change"
    | "price_drop"
    | "listing_expiring"
    | "review";
  title: string;
  message: string;
  reference_id?: string | null;
  reference_type?: string;
  is_read?: boolean;
};
export type NotificationRead = {
  id?: string;
  notification_type:
    | "message"
    | "offer"
    | "status_change"
    | "price_drop"
    | "listing_expiring"
    | "review";
  title: string;
  message: string;
  reference_id?: string | null;
  reference_type?: string;
  is_read?: boolean;
  created_at?: string;
};
export type StudyMaterial = {
  title: string;
  description?: string;
  course_code?: string;
  course_name?: string;
  material_type:
    | "notes"
    | "study_guide"
    | "practice_exam"
    | "syllabus"
    | "other";
  file_url?: string | null;
};
export type StudyMaterialRead = {
  id?: string;
  title: string;
  description?: string;
  course_code?: string;
  course_name?: string;
  material_type:
    | "notes"
    | "study_guide"
    | "practice_exam"
    | "syllabus"
    | "other";
  file_url?: string | null;
  download_count?: number;
  rating?: string;
  is_approved?: boolean;
  created_at?: string;
};
export type MeetingLocation = {
  campus: string;
  name: string;
  description?: string;
  location_type:
    | "library"
    | "student_center"
    | "security_desk"
    | "cafeteria"
    | "other";
  address?: string;
  building?: string;
  room_number?: string;
  hours_of_operation?: string;
  is_verified?: boolean;
  is_active?: boolean;
};
export type MeetingLocationRead = {
  id?: string;
  campus: string;
  name: string;
  description?: string;
  location_type:
    | "library"
    | "student_center"
    | "security_desk"
    | "cafeteria"
    | "other";
  address?: string;
  building?: string;
  room_number?: string;
  hours_of_operation?: string;
  is_verified?: boolean;
  is_active?: boolean;
};
export type Offer = {
  listing?: ListingList;
  listing_id: string;
  buyer?: UserProfile;
  seller?: UserProfile;
  offer_amount: string;
  message?: string;
  parent_offer?: string | null;
  expires_at?: string | null;
};
export type OfferRead = {
  id?: string;
  listing?: ListingListRead;
  listing_id: string;
  buyer?: UserProfileRead;
  seller?: UserProfileRead;
  offer_amount: string;
  message?: string;
  status?: "pending" | "accepted" | "rejected" | "countered" | "expired";
  parent_offer?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type Transaction = {
  listing?: ListingList;
  buyer?: UserProfile;
  seller?: UserProfile;
  offer?: string | null;
  final_price: string;
  status?: "inquired" | "negotiating" | "sold" | "completed" | "cancelled";
  meeting_location?: string;
  meeting_time?: string | null;
  payment_method?: string;
  notes?: string;
};
export type TransactionRead = {
  id?: string;
  listing?: ListingListRead;
  buyer?: UserProfileRead;
  seller?: UserProfileRead;
  offer?: string | null;
  final_price: string;
  status?: "inquired" | "negotiating" | "sold" | "completed" | "cancelled";
  meeting_location?: string;
  meeting_time?: string | null;
  payment_method?: string;
  notes?: string;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type User = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  profile_picture_url?: string | null;
  student_id?: string | null;
  campus_id?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  account_status?: "active" | "suspended" | "deleted";
};
export type UserRead = {
  id?: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number?: string | null;
  profile_picture_url?: string | null;
  student_id?: string | null;
  campus?: string;
  campus_id?: string | null;
  is_verified?: boolean;
  is_active?: boolean;
  account_status?: "active" | "suspended" | "deleted";
  average_rating?: string;
  total_reviews?: number;
  created_at?: string;
  updated_at?: string;
};
export const {
  useAuthRefreshCreateMutation,
  useMarketplaceCampusesListQuery,
  useLazyMarketplaceCampusesListQuery,
  useMarketplaceCampusesReadQuery,
  useLazyMarketplaceCampusesReadQuery,
  useMarketplaceCategoriesListQuery,
  useLazyMarketplaceCategoriesListQuery,
  useMarketplaceCategoriesReadQuery,
  useLazyMarketplaceCategoriesReadQuery,
  useMarketplaceCategoriesSubcategoriesQuery,
  useLazyMarketplaceCategoriesSubcategoriesQuery,
  useMarketplaceListingsListQuery,
  useLazyMarketplaceListingsListQuery,
  useMarketplaceListingsCreateMutation,
  useMarketplaceListingsMyListingsQuery,
  useLazyMarketplaceListingsMyListingsQuery,
  useMarketplaceListingsReadQuery,
  useLazyMarketplaceListingsReadQuery,
  useMarketplaceListingsUpdateMutation,
  useMarketplaceListingsPartialUpdateMutation,
  useMarketplaceListingsDeleteMutation,
  useMarketplaceListingsMarkSoldMutation,
  useGetMarketplaceSavedSearchesQuery,
  useLazyGetMarketplaceSavedSearchesQuery,
  usePostMarketplaceSavedSearchesMutation,
  useGetMarketplaceSavedSearchesByIdQuery,
  useLazyGetMarketplaceSavedSearchesByIdQuery,
  usePutMarketplaceSavedSearchesByIdMutation,
  usePatchMarketplaceSavedSearchesByIdMutation,
  useDeleteMarketplaceSavedSearchesByIdMutation,
  useMarketplaceWishlistListQuery,
  useLazyMarketplaceWishlistListQuery,
  useMarketplaceWishlistCreateMutation,
  useMarketplaceWishlistReadQuery,
  useLazyMarketplaceWishlistReadQuery,
  useMarketplaceWishlistUpdateMutation,
  useMarketplaceWishlistPartialUpdateMutation,
  useMarketplaceWishlistDeleteMutation,
  useMessagingConversationsListQuery,
  useLazyMessagingConversationsListQuery,
  useMessagingConversationsReadQuery,
  useLazyMessagingConversationsReadQuery,
  useMessagingConversationsMessagesQuery,
  useLazyMessagingConversationsMessagesQuery,
  useMessagingMessagesListQuery,
  useLazyMessagingMessagesListQuery,
  useMessagingMessagesCreateMutation,
  useMessagingMessagesUnreadCountQuery,
  useLazyMessagingMessagesUnreadCountQuery,
  useMessagingMessagesReadQuery,
  useLazyMessagingMessagesReadQuery,
  useMessagingMessagesUpdateMutation,
  useMessagingMessagesPartialUpdateMutation,
  useMessagingMessagesDeleteMutation,
  useReviewsListQuery,
  useLazyReviewsListQuery,
  useReviewsCreateMutation,
  useReviewsGivenReviewsQuery,
  useLazyReviewsGivenReviewsQuery,
  useReviewsMyReviewsQuery,
  useLazyReviewsMyReviewsQuery,
  useReviewsReadQuery,
  useLazyReviewsReadQuery,
  useReviewsUpdateMutation,
  useReviewsPartialUpdateMutation,
  useReviewsDeleteMutation,
  useGetSafetyFlaggedContentQuery,
  useLazyGetSafetyFlaggedContentQuery,
  usePostSafetyFlaggedContentMutation,
  useGetSafetyFlaggedContentByIdQuery,
  useLazyGetSafetyFlaggedContentByIdQuery,
  usePutSafetyFlaggedContentByIdMutation,
  usePatchSafetyFlaggedContentByIdMutation,
  useDeleteSafetyFlaggedContentByIdMutation,
  useSafetyNotificationsListQuery,
  useLazySafetyNotificationsListQuery,
  useSafetyNotificationsMarkAllReadMutation,
  useSafetyNotificationsUnreadCountQuery,
  useLazySafetyNotificationsUnreadCountQuery,
  useSafetyNotificationsReadQuery,
  useLazySafetyNotificationsReadQuery,
  useSafetyNotificationsMarkReadMutation,
  useGetSafetyStudyMaterialsQuery,
  useLazyGetSafetyStudyMaterialsQuery,
  usePostSafetyStudyMaterialsMutation,
  useGetSafetyStudyMaterialsByIdQuery,
  useLazyGetSafetyStudyMaterialsByIdQuery,
  usePutSafetyStudyMaterialsByIdMutation,
  usePatchSafetyStudyMaterialsByIdMutation,
  useDeleteSafetyStudyMaterialsByIdMutation,
  usePostSafetyStudyMaterialsByIdDownloadMutation,
  useGetTransactionsMeetingLocationsQuery,
  useLazyGetTransactionsMeetingLocationsQuery,
  useGetTransactionsMeetingLocationsByIdQuery,
  useLazyGetTransactionsMeetingLocationsByIdQuery,
  useTransactionsOffersListQuery,
  useLazyTransactionsOffersListQuery,
  useTransactionsOffersCreateMutation,
  useTransactionsOffersReceivedQuery,
  useLazyTransactionsOffersReceivedQuery,
  useTransactionsOffersSentQuery,
  useLazyTransactionsOffersSentQuery,
  useTransactionsOffersReadQuery,
  useLazyTransactionsOffersReadQuery,
  useTransactionsOffersUpdateMutation,
  useTransactionsOffersPartialUpdateMutation,
  useTransactionsOffersDeleteMutation,
  useTransactionsOffersAcceptMutation,
  useTransactionsOffersCounterMutation,
  useTransactionsOffersRejectMutation,
  useTransactionsTransactionsListQuery,
  useLazyTransactionsTransactionsListQuery,
  useTransactionsTransactionsCreateMutation,
  useTransactionsTransactionsPurchasesQuery,
  useLazyTransactionsTransactionsPurchasesQuery,
  useTransactionsTransactionsSalesQuery,
  useLazyTransactionsTransactionsSalesQuery,
  useTransactionsTransactionsReadQuery,
  useLazyTransactionsTransactionsReadQuery,
  useTransactionsTransactionsUpdateMutation,
  useTransactionsTransactionsPartialUpdateMutation,
  useTransactionsTransactionsDeleteMutation,
  useTransactionsTransactionsCompleteMutation,
  useUsersListQuery,
  useLazyUsersListQuery,
  useUsersCreateMutation,
  useUsersLoginMutation,
  useUsersMeQuery,
  useLazyUsersMeQuery,
  useUsersRegisterMutation,
  useUsersUpdateProfileUpdateMutation,
  useUsersUpdateProfilePartialUpdateMutation,
  useUsersReadQuery,
  useLazyUsersReadQuery,
  useUsersUpdateMutation,
  useUsersPartialUpdateMutation,
  useUsersDeleteMutation,
} = injectedRtkApi;
