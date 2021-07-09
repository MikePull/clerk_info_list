import React from 'react';
import styled from "styled-components"

interface IProps {
 name: string,
 description?: string,
 key: string
}

export default function Card(props: IProps) {
return (
    <GridCard>
        <div>
            {props.name && props.name}
        </div>
        <div>
             {props.description && props.description}
        </div>
    </GridCard>
    ) ; 
} 

const GridCard = styled.div`

    word-wrap: break-word;
    overflow-wrap: break-word;


    & > * {
        width: max-content;
        word-wrap: break-word !important;
       // height: 20em;
        overflow-wrap: anywhere;
    }
`