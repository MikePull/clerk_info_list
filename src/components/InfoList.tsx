import React, {useEffect, useState } from 'react'; 
import Member from "./Member";
import styled from "styled-components"

interface IMember {
    _id: string
    officialName: string,
    active: string
}

interface IVote {
    _id: string,
    members?: any, // diff schema
    name: string,
    description: string
}
const API_KEY = process.env.API_KEY

async function getMembers(page: number) { 
    const response = await fetch(`https://clerkapi.azure-api.net/Members/v1/?key=${API_KEY}&$skip=${page}`); 
    return response.json();
}

async function getVotes(page: number, amount?: number) {
    const response = await fetch(`https://clerkapi.azure-api.net/Votes/v1/?$filter=superEvent/superEvent/congressNum%20eq%20%27116%27&key=${API_KEY}&$skip=${page}`)
    return response.json();
}
async function loadAllVotesByMember() {
    let memberVotes: any = {}
    for (let i = 0; i < 960; i += 10) {
        console.log(i)
        await getVotes(i)
            .then(json => {
                json.results.forEach(({members, name, _id}: {members: Array<object>, name: string, _id: string}) => {
                    members.forEach((member: any) => {
                        memberVotes[member.familyName] = memberVotes[member.familyName] 
                            ? [...memberVotes[member.familyName], {name, _id}]
                            : [{name, _id}]
                    })
                })
            })
    }
    return await memberVotes
}

export default function MemberList() { 
    const [memberData, setMemberData] = useState([]); 
    const [memberPage, setMemberPage] = useState(0)

    const [voteData, setVoteData] = useState<IVote[] | any>([])
    const [votePage, setVotePage] = useState(0)

    useEffect(()=> {
        getMembers(memberPage)
            .then(memberData => setMemberData(memberData.results))
            .catch(e => console.log(e));
    }, [memberPage]);

    useEffect(() => {
        getVotes(votePage)
            .then(voteData => setVoteData(voteData.results))
            .catch((e) => console.log(e))
    }, [votePage])

    // useEffect(() => {
    //     loadAllVotesByMember()
    // }, [])

    // ^Need to optimize, takes 70 sec

    return (
        <Container>
            <GridContainer>
                {memberData.map((m: IMember) => <Member key={m._id} name={m.officialName}/>)}
            </GridContainer>
            <PaginationBtns>
                { memberPage > 10 && <div onClick={() => setMemberPage(memberPage - 10)}> Previous </div> }
                <span>Page {Math.floor(memberPage / 10)}</span>
                <div onClick={() => setMemberPage(memberPage + 10)}> Next </div>
            </PaginationBtns>
            <GridContainer>
                {voteData.map((vote: IVote, idx: number) => <div key={idx}>{vote.name} <br /> {vote.description} {vote._id} </div>)}
            </GridContainer>
            <PaginationBtns>
                    { votePage > 10 && <div onClick={() => setVotePage(votePage - 10)}> Previous </div> }
                     <span> Page {Math.floor(votePage / 10)}</span>
                    <div onClick={() => setVotePage(votePage + 10)}> Next </div>
            </PaginationBtns>
        </Container>
    );
}

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    border: 1px solid black;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const PaginationBtns = styled.div`
    dsiplay: flex;
`