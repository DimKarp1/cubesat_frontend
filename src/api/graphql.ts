import { gql } from '@apollo/client';

export const FETCH_COMPONENT = gql`
    query FetchComponent($id: Int!) {
        component(id: $id) {
            id
            title
            shortDescription
            description
            price
            imgSrc
        }
    }
`;

export const CREATE_COMPONENT = gql`
    mutation CreateComponent(
        $title: String!, 
        $price: Int!, 
        $shortDescription: String, 
        $description: String
    ) {
        createComponent(
            title: $title, 
            price: $price, 
            shortDescription: $shortDescription, 
            description: $description
        ) {
            component {
                id
                title
                shortDescription
                description
                price
                imgSrc
            }
        }
    }
`;