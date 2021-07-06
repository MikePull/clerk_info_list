import React, {useEffect, useState } from 'react'; 
import Member from "./Member";
import styled from "styled-components"

interface IMember {
    _id: string
    officialName: string,
    active: string
}

interface IVote<T> {
    members: Array<T>,
    name: string,
    description: string
}
const API_KEY = ""

async function getMembers(page: number) { 
    
    const response = await fetch(`https://clerkapi.azure-api.net/Members/v1/?key=${API_KEY}&$skip=${page}`); 
    return response.json();
}
async function getVotes(page?: number, withMembers?: boolean, amount?: number) {
    // Unsure on the amount of votes so doing the first 100 or an arbitrary amount. 
    // The members would have the voting data if the member page fetched intersects with the vote pages fetched
    // fetch all voting data in a loop

    if (withMembers && amount) {
        let memberVotes = {}
        for (let i = 0; i < amount; i + 10) {
            await fetch(`https://clerkapi.azure-api.net/Votes/v1/?$filter=superEvent/superEvent/congressNum%20eq%20%27116%27&key=${API_KEY}&${i}`)
                .then(response => response.json())
                .then(json => {
                    json.results.map(({members, name}: {members: Array<object>, name: string}) => {
                        members.forEach(member => {
                            memberVotes = {
                                [name]: [member.name]
                                ...memberVotes    
                            }
                        })
                    })
                })        
        }
        return await memberVotes
    }

    const response = await fetch(`https://clerkapi.azure-api.net/Votes/v1/?$filter=superEvent/superEvent/congressNum%20eq%20%27116%27&key=${API_KEY}&${page}`)
    return response.json();
}




export default function MemberList() { 
    const [memberData, setMemberData] = useState([]); 
    const [memberPage, setMemberPage] = useState(1)

    const [voteData, setVoteData] = useState([])
    const [votePage, setVotePage] = useState(1)

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