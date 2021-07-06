import React from 'react';
import styled from "styled-components"

interface IProps {
 name: string
}

export default function Member(props: IProps) {
return (
    <MemberCard>
        <span>
            {props.name}
        </span>
    </MemberCard>
    ) ; 
} 

const MemberCard = styled.div`
    border: 1px solid black;
    width: max-content;
    padding: 4px
`