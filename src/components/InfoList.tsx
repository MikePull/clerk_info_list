import React, {useEffect, useState } from 'react'; 
import styled from "styled-components"

interface IMember {
    _id: string,
    officialName: string,
    active: string,
    congresses?: any
}

interface IVote {
    _id: string,
    members?: any, // diff schema
    name: string,
    description: string
}
const API_KEY = "" /// Edit this line.

async function getMembers(page: number) { 
    console.log("fetching")
    const response = await fetch(`https://clerkapi.azure-api.net/Members/v1/?key=${API_KEY}&$skip=${page}`); 
    return response.json();
}

async function getVotes(page: number, amount?: number) {
    const response = await fetch(`https://clerkapi.azure-api.net/Votes/v1/?$filter=superEvent/superEvent/congressNum%20eq%20%27116%27&key=${API_KEY}&$skip=${page}`)
    return response.json();
}

async function loadAllMembers() {
    let finished = false
    let i = 0;
    let members: any[] = []

    while (!finished && i <= 70) {
        await getMembers(i)
                .then(json => {
                    members.push(
                        json.results.map((member: any) => (
                            {
                                officialName: member.officialName,
                                active: member.active, 
                                congresses: member.congresses,
                            }
                        ))
                    )
                })

                //.then(() => console.log(i + "<-----------", members))
                .catch(e => finished = true)
        
        i+=10
    }
    return await members

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

    const [memberLoad, setMemberLoad] = useState<any>([]);
    const [finishedLoading, setFinishedLoading] = useState(false)

    const [memberData, setMemberData] = useState<any>([]);
    const [memberPage, setMemberPage] = useState(0)

    const [voteData, setVoteData] = useState<IVote[] | any>([])
    const [votePage, setVotePage] = useState(0)

    const [showAllMembers, setShowAllMembers] = useState(false)

    const filterByQuery = (query: string, type: string) => {
        
    }

    useEffect(() => {
        if (showAllMembers) {
            loadAllMembers()
            .then(members => {
                for (let i in members) {
                    setMemberData([...members[i], ...memberData])
                }
            })
            console.log(typeof memberData)
        } else {
            getMembers(memberPage)
            .then(memberData => { 
                setMemberData(memberData.results) 
            })
            .catch(e => console.log(e));
        }
    }, [memberPage, showAllMembers]);

    useEffect(() => {
        getVotes(votePage)
            .then(voteData => setVoteData(voteData.results))
            .catch((e) => console.log(e))
    }, [votePage])

     useEffect(() => {
         
     }, [])

     useEffect(() => {
 //      console.log(memberData, "========", memberData[10])

    }, [memberData])

    // ^Need to optimize, takes 70 sec

    return (
        <FlexContainer>
            <MemberContainer>
                { memberData.map((m: IMember) => <div key={m._id}>{m.officialName}</div>) }
            </MemberContainer>
            <PaginationBtns>
                <div onClick={() => setShowAllMembers(!showAllMembers)}> { !showAllMembers ? "Show All" : "Show by Page" } </div>
                { memberPage > 10 && <div onClick={() => setMemberPage(memberPage - 10)}> Previous </div> }
                <span>Page {Math.floor(memberPage / 10)}</span>
                <div onClick={() => setMemberPage(memberPage + 10)}> Next </div>
            </PaginationBtns>
            <GridContainer>
                <h3>Votes</h3>
                {voteData.map((vote: IVote) => <div key={vote._id }> {vote.name} <br /> <br />{vote.description}</div> )}
            </GridContainer>
            <PaginationBtns>
                { votePage > 10 && <div onClick={() => setVotePage(votePage - 10)}> Previous </div> }
                <span> Page {Math.floor(votePage / 10)}</span>
                <div onClick={() => setVotePage(votePage + 10)}> Next </div>
            </PaginationBtns>
        </FlexContainer>
    );
}



const GridContainer = styled.div`

   padding: 3em;
   width: 90vw;
   word-wrap: break-word;
   word-break: break-all;
   height: auto;
   

   & > * {
        word-wrap: break-word;
        word-break: break-all;
        //overflow: hidden;
        height: fit-content;
        padding: 2em;
        position: relative;
        text-align: center;
        &:after {
            content: "";
            position: absolute;
            height: 2px;
            width: 50%;
            left: 50%;
            bottom: 0;
            transform: translate(-50%, -50%);
            background: black;
            box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
        }
   } 


`

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: max-content;
    justify-content: space-between;
`

const MemberContainer = styled.div`

    display: grid; 
  //  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));

    text-align: center;
    padding: 3em;

    & > * {
        text-align: center; 
        width: max-content;
        font-size: 22px;
        padding: .5em;
        margin: .5em;
        border-radius: 10px;
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }

`

const PaginationBtns = styled.div`
    width: 80vw;
    text-align: center;
    margin: 1em;
    display: flex;
    justify-content: space-between;
    & > * {
        
        box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
        width: fit-content;
        padding: .7em;
        background: #BCAC9B;
        color: #2A3D45;
        border-radius: 10px;
    }
    & > * {
        cursor: pointer;
    }
`