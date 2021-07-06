import React, {useEffect, useState } from 'react'; 
import Member from "./Member";
import styled from "styled-components"

interface IMember {
    _id: string
    officialName: string,
    active: string
}
const API_KEY = ""

async function getMembers(page: number) { 
    
    const response = await fetch(`https://clerkapi.azure-api.net/Members/v1/?key=${API_KEY}&$skip=${page}`); 
    return response.json();
}
async function getVotes() {
    const response = await fetch(`https://clerkapi.azure-api.net/Votes/v1/?$filter=superEvent/superEvent/congressNum%20eq%20%27116%27&key=${API_KEY}`)
    return response.json();
}

export default function MemberList() { 
    const [memberData, setMemberData] = useState([]); 
    const [page, setPage] = useState(1)
    useEffect(()=> {
        getMembers(page).then(memberData => setMemberData(memberData.results)).then(() => console.log(memberData));
        getVotes().then(voteData => console.log(voteData.results))
    }, [page]);
    return (
        <div>
            {memberData.map((m: IMember) => <Member key={m._id} name={m.officialName}/>)}
            <div>
                { page > 2 && <div onClick={() => setPage(page - 1)}> Previous </div> }
                <div onClick={() => setPage(page + 1)}> Next </div>
            </div>
         </div>
); }

const Container = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
`