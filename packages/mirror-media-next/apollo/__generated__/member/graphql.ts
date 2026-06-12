/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type CreateNewebpayTradeInfoForMagazineOrderInput = {
  buyerName?: string | null | undefined;
  buyerUBN?: string | null | undefined;
  carrierNum?: string | null | undefined;
  carrierType?: string | null | undefined;
  category: MagazineOrderCategoryType;
  comment?: string | null | undefined;
  createdBy?: UserRelateToOneForCreateInput | null | undefined;
  desc?: string | null | undefined;
  itemCount: number;
  loveCode?: number | null | undefined;
  merchandise: MerchandiseRelateToOneForCreateInput;
  printFlag?: string | null | undefined;
  promoteCode?: string | null | undefined;
  purchaseAddress: string;
  purchaseDatetime: string;
  purchaseEmail: string;
  purchaseMobile?: string | null | undefined;
  purchaseName: string;
  purchasePhone?: string | null | undefined;
  receiveAddress: string;
  receiveMobile?: string | null | undefined;
  receiveName: string;
  receiveNote?: string | null | undefined;
  receivePhone?: string | null | undefined;
};

export type MagazineOrderCategoryType =
  | 'B2B'
  | 'B2C';

export type MemberGenderType =
  | 'F'
  | 'M'
  | 'NA';

export type MerchandiseCreateInput = {
  code?: string | null | undefined;
  comment?: string | null | undefined;
  createdAt?: string | null | undefined;
  createdBy?: UserRelateToOneForCreateInput | null | undefined;
  currency?: MerchandiseCurrencyType | null | undefined;
  desc?: string | null | undefined;
  name?: string | null | undefined;
  price?: number | null | undefined;
  state?: MerchandiseStateType | null | undefined;
  updatedAt?: string | null | undefined;
  updatedBy?: UserRelateToOneForCreateInput | null | undefined;
};

export type MerchandiseCurrencyType =
  | 'TWD';

export type MerchandiseRelateToOneForCreateInput = {
  connect?: MerchandiseWhereUniqueInput | null | undefined;
  create?: MerchandiseCreateInput | null | undefined;
};

export type MerchandiseStateType =
  | 'active'
  | 'inactive';

export type MerchandiseWhereUniqueInput = {
  code?: string | null | undefined;
  id?: string | null | undefined;
  name?: string | null | undefined;
};

export type UserCreateInput = {
  createdAt?: string | null | undefined;
  createdBy?: UserRelateToOneForCreateInput | null | undefined;
  email?: string | null | undefined;
  lastLogin?: string | null | undefined;
  name?: string | null | undefined;
  password?: string | null | undefined;
  role?: UserRoleType | null | undefined;
  updatedAt?: string | null | undefined;
  updatedBy?: UserRelateToOneForCreateInput | null | undefined;
};

export type UserRelateToOneForCreateInput = {
  connect?: UserWhereUniqueInput | null | undefined;
  create?: UserCreateInput | null | undefined;
};

export type UserRoleType =
  | 'admin'
  | 'api'
  | 'editor';

export type UserWhereUniqueInput = {
  email?: string | null | undefined;
  id?: string | null | undefined;
};

export type FetchPaymentDataOfPapermagMutationVariables = Exact<{
  data: CreateNewebpayTradeInfoForMagazineOrderInput;
}>;


export type FetchPaymentDataOfPapermagMutation = { createNewebpayTradeInfoForMagazineOrder: { MerchantID: string, RespondType: string, TimeStamp: string, Version: string, MerchantOrderNo: string, Amt: number, ItemDesc: string, LoginType: number, Email: string, TradeLimit: number | null, NotifyURL: string | null } | null };

export type CreateMemberMutationVariables = Exact<{
  firebaseId: string;
  email: string;
}>;


export type CreateMemberMutation = { createmember: { firebaseId: string | null, id: string } | null };

export type UpdateMemberMutationVariables = Exact<{
  id: string;
  address?: string | null | undefined;
  country?: string | null | undefined;
  city?: string | null | undefined;
  district?: string | null | undefined;
  birthday?: string | null | undefined;
  gender?: MemberGenderType | null | undefined;
  name?: string | null | undefined;
  phone?: string | null | undefined;
}>;


export type UpdateMemberMutation = { updatemember: { phone: string | null, gender: MemberGenderType | null, birthday: string | null, name: string | null, address: string | null, city: string | null, country: string | null, district: string | null } | null };

export type FetchAllMemberQueryVariables = Exact<{
  firebaseId: string;
}>;


export type FetchAllMemberQuery = { member: { id: string, firebaseId: string | null } | null };

export type FetchSubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchSubscriptionQuery = { subscriptions: Array<{ id: string }> | null };

export type FetchMemberProfileQueryVariables = Exact<{
  firebaseId: string;
}>;


export type FetchMemberProfileQuery = { member: { id: string, firebaseId: string | null, email: string | null, name: string | null, gender: MemberGenderType | null, birthday: string | null, phone: string | null, country: string | null, city: string | null, district: string | null, address: string | null } | null };

export type MagazineOrderQueryVariables = Exact<{
  orderNumber: string;
}>;


export type MagazineOrderQuery = { magazineOrders: Array<{ id: string, orderNumber: string | null, purchaseDatetime: string | null, itemCount: number | null, totalAmount: number | null, purchaseName: string | null, purchaseEmail: string | null, purchaseMobile: string | null, receiveName: string | null, receiveMobile: string | null, receiveAddress: string | null, createdAt: string | null, promoteCode: string | null, merchandise: { name: string | null, code: string | null, price: number | null } | null }> | null };


export const FetchPaymentDataOfPapermagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"fetchPaymentDataOfPapermag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"createNewebpayTradeInfoForMagazineOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNewebpayTradeInfoForMagazineOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MerchantID"}},{"kind":"Field","name":{"kind":"Name","value":"RespondType"}},{"kind":"Field","name":{"kind":"Name","value":"TimeStamp"}},{"kind":"Field","name":{"kind":"Name","value":"Version"}},{"kind":"Field","name":{"kind":"Name","value":"MerchantOrderNo"}},{"kind":"Field","name":{"kind":"Name","value":"Amt"}},{"kind":"Field","name":{"kind":"Name","value":"ItemDesc"}},{"kind":"Field","name":{"kind":"Name","value":"LoginType"}},{"kind":"Field","name":{"kind":"Name","value":"Email"}},{"kind":"Field","name":{"kind":"Name","value":"TradeLimit"}},{"kind":"Field","name":{"kind":"Name","value":"NotifyURL"}}]}}]}}]} as unknown as DocumentNode<FetchPaymentDataOfPapermagMutation, FetchPaymentDataOfPapermagMutationVariables>;
export const CreateMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firebaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createmember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firebaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firebaseId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"firebaseId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateMemberMutation, CreateMemberMutationVariables>;
export const UpdateMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"address"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"country"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"city"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"district"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"birthday"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gender"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"memberGenderType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatemember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"phone"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"gender"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gender"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"birthday"},"value":{"kind":"Variable","name":{"kind":"Name","value":"birthday"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"address"},"value":{"kind":"Variable","name":{"kind":"Name","value":"address"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"city"},"value":{"kind":"Variable","name":{"kind":"Name","value":"city"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"country"},"value":{"kind":"Variable","name":{"kind":"Name","value":"country"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"district"},"value":{"kind":"Variable","name":{"kind":"Name","value":"district"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"district"}}]}}]}}]} as unknown as DocumentNode<UpdateMemberMutation, UpdateMemberMutationVariables>;
export const FetchAllMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchAllMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firebaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firebaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firebaseId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firebaseId"}}]}}]}}]} as unknown as DocumentNode<FetchAllMemberQuery, FetchAllMemberQueryVariables>;
export const FetchSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<FetchSubscriptionQuery, FetchSubscriptionQueryVariables>;
export const FetchMemberProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchMemberProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firebaseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"firebaseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firebaseId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firebaseId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"birthday"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"country"}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"district"}},{"kind":"Field","name":{"kind":"Name","value":"address"}}]}}]}}]} as unknown as DocumentNode<FetchMemberProfileQuery, FetchMemberProfileQueryVariables>;
export const MagazineOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"magazineOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderNumber"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"magazineOrders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"orderNumber"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"equals"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderNumber"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"orderNumber"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseDatetime"}},{"kind":"Field","name":{"kind":"Name","value":"merchandise"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseName"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseEmail"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseMobile"}},{"kind":"Field","name":{"kind":"Name","value":"receiveName"}},{"kind":"Field","name":{"kind":"Name","value":"receiveMobile"}},{"kind":"Field","name":{"kind":"Name","value":"receiveAddress"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"promoteCode"}}]}}]}}]} as unknown as DocumentNode<MagazineOrderQuery, MagazineOrderQueryVariables>;