/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation fetchPaymentDataOfPapermag(\n    $data: createNewebpayTradeInfoForMagazineOrderInput!\n  ) {\n    createNewebpayTradeInfoForMagazineOrder(data: $data) {\n      MerchantID\n      RespondType\n      TimeStamp\n      Version\n      MerchantOrderNo\n      Amt\n      ItemDesc\n      LoginType\n      Email\n      TradeLimit\n      NotifyURL\n    }\n  }\n": typeof types.FetchPaymentDataOfPapermagDocument,
    "\n  mutation createMember($firebaseId: String!, $email: String!) {\n    createmember(data: { firebaseId: $firebaseId, email: $email }) {\n      firebaseId\n      id\n    }\n  }\n": typeof types.CreateMemberDocument,
    "\n  mutation updateMember(\n    $id: ID!\n    $address: String\n    $country: String\n    $city: String\n    $district: String\n    $birthday: String\n    $gender: memberGenderType\n    $name: String\n    $phone: String\n  ) {\n    updatemember(\n      where: { id: $id }\n      data: {\n        phone: $phone\n        gender: $gender\n        birthday: $birthday\n        name: $name\n        address: $address\n        city: $city\n        country: $country\n        district: $district\n      }\n    ) {\n      phone\n      gender\n      birthday\n      name\n      address\n      city\n      country\n      district\n    }\n  }\n": typeof types.UpdateMemberDocument,
    "\n  query fetchAllMember($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n    }\n  }\n": typeof types.FetchAllMemberDocument,
    "\n  query fetchSubscription {\n    subscriptions {\n      id\n    }\n  }\n": typeof types.FetchSubscriptionDocument,
    "\n  query fetchMemberProfile($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n      email\n      name\n      gender\n      birthday\n      phone\n      country\n      city\n      district\n      address\n    }\n  }\n": typeof types.FetchMemberProfileDocument,
    "\n  query magazineOrder($orderNumber: String!) {\n    magazineOrders(where: { orderNumber: { equals: $orderNumber } }) {\n      id\n      orderNumber\n      purchaseDatetime\n      merchandise {\n        name\n        code\n        price\n      }\n      itemCount\n      totalAmount\n      purchaseName\n      purchaseEmail\n      purchaseMobile\n      receiveName\n      receiveMobile\n      receiveAddress\n      createdAt\n      totalAmount\n      promoteCode\n    }\n  }\n": typeof types.MagazineOrderDocument,
};
const documents: Documents = {
    "\n  mutation fetchPaymentDataOfPapermag(\n    $data: createNewebpayTradeInfoForMagazineOrderInput!\n  ) {\n    createNewebpayTradeInfoForMagazineOrder(data: $data) {\n      MerchantID\n      RespondType\n      TimeStamp\n      Version\n      MerchantOrderNo\n      Amt\n      ItemDesc\n      LoginType\n      Email\n      TradeLimit\n      NotifyURL\n    }\n  }\n": types.FetchPaymentDataOfPapermagDocument,
    "\n  mutation createMember($firebaseId: String!, $email: String!) {\n    createmember(data: { firebaseId: $firebaseId, email: $email }) {\n      firebaseId\n      id\n    }\n  }\n": types.CreateMemberDocument,
    "\n  mutation updateMember(\n    $id: ID!\n    $address: String\n    $country: String\n    $city: String\n    $district: String\n    $birthday: String\n    $gender: memberGenderType\n    $name: String\n    $phone: String\n  ) {\n    updatemember(\n      where: { id: $id }\n      data: {\n        phone: $phone\n        gender: $gender\n        birthday: $birthday\n        name: $name\n        address: $address\n        city: $city\n        country: $country\n        district: $district\n      }\n    ) {\n      phone\n      gender\n      birthday\n      name\n      address\n      city\n      country\n      district\n    }\n  }\n": types.UpdateMemberDocument,
    "\n  query fetchAllMember($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n    }\n  }\n": types.FetchAllMemberDocument,
    "\n  query fetchSubscription {\n    subscriptions {\n      id\n    }\n  }\n": types.FetchSubscriptionDocument,
    "\n  query fetchMemberProfile($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n      email\n      name\n      gender\n      birthday\n      phone\n      country\n      city\n      district\n      address\n    }\n  }\n": types.FetchMemberProfileDocument,
    "\n  query magazineOrder($orderNumber: String!) {\n    magazineOrders(where: { orderNumber: { equals: $orderNumber } }) {\n      id\n      orderNumber\n      purchaseDatetime\n      merchandise {\n        name\n        code\n        price\n      }\n      itemCount\n      totalAmount\n      purchaseName\n      purchaseEmail\n      purchaseMobile\n      receiveName\n      receiveMobile\n      receiveAddress\n      createdAt\n      totalAmount\n      promoteCode\n    }\n  }\n": types.MagazineOrderDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation fetchPaymentDataOfPapermag(\n    $data: createNewebpayTradeInfoForMagazineOrderInput!\n  ) {\n    createNewebpayTradeInfoForMagazineOrder(data: $data) {\n      MerchantID\n      RespondType\n      TimeStamp\n      Version\n      MerchantOrderNo\n      Amt\n      ItemDesc\n      LoginType\n      Email\n      TradeLimit\n      NotifyURL\n    }\n  }\n"): (typeof documents)["\n  mutation fetchPaymentDataOfPapermag(\n    $data: createNewebpayTradeInfoForMagazineOrderInput!\n  ) {\n    createNewebpayTradeInfoForMagazineOrder(data: $data) {\n      MerchantID\n      RespondType\n      TimeStamp\n      Version\n      MerchantOrderNo\n      Amt\n      ItemDesc\n      LoginType\n      Email\n      TradeLimit\n      NotifyURL\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createMember($firebaseId: String!, $email: String!) {\n    createmember(data: { firebaseId: $firebaseId, email: $email }) {\n      firebaseId\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation createMember($firebaseId: String!, $email: String!) {\n    createmember(data: { firebaseId: $firebaseId, email: $email }) {\n      firebaseId\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateMember(\n    $id: ID!\n    $address: String\n    $country: String\n    $city: String\n    $district: String\n    $birthday: String\n    $gender: memberGenderType\n    $name: String\n    $phone: String\n  ) {\n    updatemember(\n      where: { id: $id }\n      data: {\n        phone: $phone\n        gender: $gender\n        birthday: $birthday\n        name: $name\n        address: $address\n        city: $city\n        country: $country\n        district: $district\n      }\n    ) {\n      phone\n      gender\n      birthday\n      name\n      address\n      city\n      country\n      district\n    }\n  }\n"): (typeof documents)["\n  mutation updateMember(\n    $id: ID!\n    $address: String\n    $country: String\n    $city: String\n    $district: String\n    $birthday: String\n    $gender: memberGenderType\n    $name: String\n    $phone: String\n  ) {\n    updatemember(\n      where: { id: $id }\n      data: {\n        phone: $phone\n        gender: $gender\n        birthday: $birthday\n        name: $name\n        address: $address\n        city: $city\n        country: $country\n        district: $district\n      }\n    ) {\n      phone\n      gender\n      birthday\n      name\n      address\n      city\n      country\n      district\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchAllMember($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n    }\n  }\n"): (typeof documents)["\n  query fetchAllMember($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchSubscription {\n    subscriptions {\n      id\n    }\n  }\n"): (typeof documents)["\n  query fetchSubscription {\n    subscriptions {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchMemberProfile($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n      email\n      name\n      gender\n      birthday\n      phone\n      country\n      city\n      district\n      address\n    }\n  }\n"): (typeof documents)["\n  query fetchMemberProfile($firebaseId: String!) {\n    member(where: { firebaseId: $firebaseId }) {\n      id\n      firebaseId\n      email\n      name\n      gender\n      birthday\n      phone\n      country\n      city\n      district\n      address\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query magazineOrder($orderNumber: String!) {\n    magazineOrders(where: { orderNumber: { equals: $orderNumber } }) {\n      id\n      orderNumber\n      purchaseDatetime\n      merchandise {\n        name\n        code\n        price\n      }\n      itemCount\n      totalAmount\n      purchaseName\n      purchaseEmail\n      purchaseMobile\n      receiveName\n      receiveMobile\n      receiveAddress\n      createdAt\n      totalAmount\n      promoteCode\n    }\n  }\n"): (typeof documents)["\n  query magazineOrder($orderNumber: String!) {\n    magazineOrders(where: { orderNumber: { equals: $orderNumber } }) {\n      id\n      orderNumber\n      purchaseDatetime\n      merchandise {\n        name\n        code\n        price\n      }\n      itemCount\n      totalAmount\n      purchaseName\n      purchaseEmail\n      purchaseMobile\n      receiveName\n      receiveMobile\n      receiveAddress\n      createdAt\n      totalAmount\n      promoteCode\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;